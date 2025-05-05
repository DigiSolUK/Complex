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

    // Create session middleware
    const sessionMiddleware = session({
      secret: process.env.SESSION_SECRET || "complex-care-secret",
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: false, // Set to false for development, true for production
        path: "/",
        sameSite: "none"
      },
      store: storage.sessionStore, // Use database session store
      name: "complexcare.sid",
    });

    return [sessionMiddleware, passport.initialize(), passport.session()];
  }

  // Authentication middleware
  isAuthenticated(req: Request, res: Response, next: NextFunction) {
    // Debug the session state
    console.log('Request cookies:', req.headers.cookie);
    console.log('Session ID:', req.sessionID);
    console.log('Is authenticated:', req.isAuthenticated());
    console.log('User in session:', req.user ? `User ID: ${req.user.id}` : 'No user');
    console.log('Session data:', req.session);
    
    // Check for the test cookie
    console.log('User ID cookie:', req.cookies.user_id);
    
    if (req.isAuthenticated()) {
      return next();
    }
    
    res.status(401).json({ message: "Unauthorized" });
  }

  // Role-based authorization middleware
  hasRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!roles.includes(req.user!.role)) {
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
          
          // Set a custom cookie as a test
          res.cookie('user_id', user.id, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
            sameSite: 'none'
          });
          
          console.log("Login successful for user ID:", user.id);
          console.log("Response headers being sent:", res.getHeaders());
          
          return res.json(user);
        });
      });
    })(req, res, next);
  }
}

export const auth = new Auth();
