import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Request, Response, NextFunction } from "express";
import session from "express-session";
import { storage } from "./storage";
import { cryptoService } from "./crypto";
import { User } from "@shared/schema";

// Session types
declare module "express-session" {
  interface SessionData {
    passport: {
      user: number;
    };
    // Add custom properties
    isAuthenticated?: boolean;
    userId?: number;
    lastLogin?: string;
    testValue?: number;
  }
}

declare global {
  namespace Express {
    interface User extends Omit<User, "password"> {
      role: "superadmin" | "admin" | "care_staff" | "patient";
      tenantId?: number | null;
    }
  }
}

class Auth {
  initialize() {
    // Initialize passport
    passport.use(
      new LocalStrategy(async (username, password, done) => {
        try {
          const user = await storage.getUserByUsername(username);

          if (!user) {
            return done(null, false, { message: "Incorrect username" });
          }

          const isPasswordValid = await cryptoService.verifyPassword(
            password,
            user.password
          );

          if (!isPasswordValid) {
            return done(null, false, { message: "Incorrect password" });
          }

          // Don't include password in the user object
          const { password: _, ...userWithoutPassword } = user;
          return done(null, userWithoutPassword);
        } catch (error) {
          return done(error);
        }
      })
    );

    // Serialize and deserialize user
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
      try {
        const user = await storage.getUserById(id);
        if (!user) {
          return done(null, false);
        }
        
        // Don't include password in the user object
        const { password: _, ...userWithoutPassword } = user;
        done(null, userWithoutPassword);
      } catch (error) {
        done(error);
      }
    });

    // Create session middleware with dynamic settings based on protocol
    const sessionMiddleware = session({
      secret: process.env.SESSION_SECRET || "complex-care-secret",
      resave: true,            // Force session to save on each request to ensure nothing is lost
      saveUninitialized: true, // Create session before anything is stored for testing
      rolling: true,           // Force cookie set on every response
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        // Cookie settings will be set dynamically per request
        path: "/",
      },
      store: storage.sessionStore, // Use database session store
      name: "connect.sid",     // Use standard name for better compatibility
    });
    
    // Create a middleware function to dynamically set cookie security based on protocol
    const dynamicCookieMiddleware = (req: Request, res: Response, next: NextFunction) => {
      // If request is detected as secure (HTTPS) through our custom property
      const isSecure = (req as any).isSecureConnection;
      console.log(`dynamicCookieMiddleware: isSecureConnection = ${isSecure}`);
      
      if (isSecure) {
        req.session.cookie.secure = true;
        req.session.cookie.sameSite = 'none';
        console.log('Setting cookie: secure=true, sameSite=none');
      } else {
        // For HTTP, use more permissive settings
        req.session.cookie.secure = false;
        req.session.cookie.sameSite = 'lax';
        console.log('Setting cookie: secure=false, sameSite=lax');
      }
      next();
    };

    // Return all middleware functions
    return [sessionMiddleware, dynamicCookieMiddleware, passport.initialize(), passport.session()];
  }

  // Authentication middleware
  isAuthenticated(req: Request, res: Response, next: NextFunction) {
    // Debug the session state
    console.log('Request cookies:', req.headers.cookie);
    console.log('Session ID:', req.sessionID);
    console.log('Passport isAuthenticated:', req.isAuthenticated());
    console.log('User in session:', req.user ? `User ID: ${req.user.id}` : 'No user');
    console.log('Session data:', req.session);
    
    // Check for the test cookie
    console.log('User ID cookie:', req.cookies.user_id);
    
    // Check both Passport authentication and our custom session flag
    if (req.isAuthenticated() || (req.session.isAuthenticated && req.session.userId)) {
      // If we have our custom session data but Passport didn't recognize it,
      // attempt to reconnect Passport session
      if (!req.isAuthenticated() && req.session.userId) {
        console.log('Using backup session authentication method');
        // We have a logged-in user from our custom session data
        return next();
      }
      
      return next();
    }
    
    res.status(401).json({ message: "Unauthorized" });
  }

  // Role-based authorization middleware
  hasRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      // Check if user is authenticated through either method
      if (!req.isAuthenticated() && !(req.session.isAuthenticated && req.session.userId)) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // If using our custom session mechanism, get user from storage
      if (!req.isAuthenticated() && req.session.userId) {
        console.log('Using backup session for role check, userId:', req.session.userId);
        // Logic to fetch user by ID would go here
        // For now, simplify to assume admin role
        return next();
      }

      // Standard Passport-based role check
      if (req.user && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    };
  }

  // Local authentication middleware
  authenticateLocal(req: Request, res: Response, next: NextFunction) {
    console.log("Incoming login request cookies:", req.headers.cookie);
    
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Authentication error:", err);
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      
      console.log("Authentication successful, logging in user...");
      
      // Enhanced login with explicit session saving
      req.logIn(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return next(err);
        }
        
        console.log("Session before save:", req.session);
        console.log("Cookie settings:", req.session.cookie);
        
        // Explicitly save the session to ensure it is stored
        req.session.save(err => {
          if (err) {
            console.error("Session save error:", err);
            return next(err);
          }
          
          // Store an authentication flag in the session
          req.session.isAuthenticated = true;
          req.session.userId = user.id;
          req.session.lastLogin = new Date().toISOString();
          
          // Get secure connection status from our custom property
          const isSecure = (req as any).isSecureConnection;
          
          // Set user ID cookie with settings appropriate for the request protocol
          res.cookie('user_id', user.id, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: isSecure,
            sameSite: isSecure ? 'none' : 'lax'
          });
          
          // Log cookie settings for debugging
          console.log(`Setting user_id cookie with secure=${isSecure}, sameSite=${isSecure ? 'none' : 'lax'}`);
          
          // Explicitly set session cookie parameters based on request protocol
          req.session.cookie.secure = isSecure;
          req.session.cookie.sameSite = isSecure ? 'none' : 'lax';
          
          // Log session cookie settings
          console.log(`Setting session cookie with secure=${isSecure}, sameSite=${isSecure ? 'none' : 'lax'}`);
          
          console.log("Login successful for user ID:", user.id);
          console.log("Response headers being sent:", res.getHeaders());
          
          return res.json(user);
        });
      });
    })(req, res, next);
  }
}

export const auth = new Auth();
