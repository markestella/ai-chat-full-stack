import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/shared/Input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context';
import { useStorePreviousLocation } from '@/hooks/useStorePreviousLocation';

function isResponseObject(
  obj: unknown
): obj is { data: { message?: string } } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'data' in obj &&
    typeof (obj).data === 'object' &&
    (obj).data !== null
  );
}

function extractErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    isResponseObject((error as { response: unknown }).response) &&
    typeof (error as { response: { data: { message?: string } } }).response.data
      .message === 'string'
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Invalid email or password. Please try again.';
}

const LoginPage: React.FC = () => {
  useStorePreviousLocation()
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { setCurrentSession, setIsNewChatClicked } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      localStorage.removeItem('guestSession');
      localStorage.removeItem('guestSessionId');
      setCurrentSession(null);
      setIsNewChatClicked(true);

      await login(email, password);
    } catch (error: unknown) {
      setError(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-lg border-0 dark:border dark:border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-purple-300">
            Sign In
          </CardTitle>
          <CardDescription className="dark:text-gray-300">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            <Link to="/register" className="underline text-primary dark:text-purple-400">
              Don't have an account? Register
            </Link>
          </p>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            <Link to="/" className="underline text-primary dark:text-purple-400">
              Continue as guest
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;