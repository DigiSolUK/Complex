import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function TestLogin() {
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [sessionInfo, setSessionInfo] = useState(null);
  const [userData, setUserData] = useState(null);

  // Check session status when component loads
  useEffect(() => {
    checkSession();
  }, []);

  const login = async () => {
    setLoading(true);
    setStatus('Logging in...');
    
    try {
      // Make a direct fetch call to the login endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      setStatus(`Login ${response.ok ? 'successful' : 'failed'} - Status: ${response.status}`);
      
      if (response.ok) {
        setUserData(data);
        toast({
          title: 'Login successful',
          description: `Logged in as ${data.username}`,
        });
        // Check session immediately after login
        checkSession();
      } else {
        toast({
          title: 'Login failed',
          description: data.message || 'Authentication failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setStatus(`Error: ${error.message}`);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    setStatus('Checking authentication...');
    
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setStatus(`Authenticated as ${data.username}`);
        toast({
          title: 'Authentication status',
          description: `You are logged in as ${data.username}`,
        });
      } else {
        setStatus(`Not authenticated - Status: ${response.status}`);
        setUserData(null);
        toast({
          title: 'Not authenticated',
          description: 'You are not logged in',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setStatus(`Error: ${error.message}`);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    setLoading(true);
    setStatus('Checking session...');
    
    try {
      const response = await fetch('/api/test-session', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      const data = await response.json();
      setSessionInfo(data);
      setStatus(`Session check complete - Status: ${response.status}`);
    } catch (error) {
      console.error('Session check error:', error);
      setStatus(`Session check error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setStatus('Logging out...');
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        setUserData(null);
        setStatus('Logged out successfully');
        toast({
          title: 'Logged out',
          description: 'You have been logged out successfully',
        });
        // Check session after logout
        checkSession();
      } else {
        setStatus(`Logout failed - Status: ${response.status}`);
        toast({
          title: 'Logout failed',
          description: 'Failed to log out',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      setStatus(`Logout error: ${error.message}`);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Authentication Test Tool</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-2">
              <Button onClick={login} disabled={loading} className="w-full">
                Login
              </Button>
              <Button onClick={logout} disabled={loading} variant="outline" className="w-full">
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status and Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Session Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Status:</p>
              <p className="p-2 bg-muted rounded-md">{status}</p>
            </div>
            <div className="space-y-2">
              <Button onClick={checkAuth} disabled={loading} className="w-full">
                Check Authentication
              </Button>
              <Button onClick={checkSession} disabled={loading} variant="outline" className="w-full">
                Check Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Data Display */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Data */}
        <Card>
          <CardHeader>
            <CardTitle>User Data</CardTitle>
          </CardHeader>
          <CardContent>
            {userData ? (
              <pre className="p-4 bg-muted rounded-md overflow-auto max-h-64">
                {JSON.stringify(userData, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground">Not authenticated</p>
            )}
          </CardContent>
        </Card>

        {/* Session Info */}
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            {sessionInfo ? (
              <pre className="p-4 bg-muted rounded-md overflow-auto max-h-64">
                {JSON.stringify(sessionInfo, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground">No session information available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
