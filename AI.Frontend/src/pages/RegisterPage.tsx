import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useDeleteGuestSessionOnExit } from '@/hooks/useDeleteGuestSession'
import { useStorePreviousLocation } from '@/hooks/useStorePreviousLocation'

const RegisterPage: React.FC = () => {
  useDeleteGuestSessionOnExit()
  useStorePreviousLocation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const { toast } = useToast();

  const validatePassword = (pwd: string) => ({
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    specialChar: /[^A-Za-z0-9]/.test(pwd),
    numeric: /\d/.test(pwd),
  })

  const passwordChecks = validatePassword(password)
  const passwordsMatch = password === confirmPassword

  const isPasswordValid =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.specialChar &&
    passwordChecks.numeric

  const canSubmit =
    name.trim() &&
    email.trim() &&
    isPasswordValid &&
    passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setError("Please fill all fields correctly.")
      return
    }

    setError("");
    setIsLoading(true);

    try {
      await register(email, name, password, confirmPassword);

      toast({
        title: "Account created",
        description: "Your account was successfully created. Redirecting to login...",
        duration: 2000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error('Registration failed:', err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-lg border-0 dark:border dark:border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-purple-300">
            Create Account
          </CardTitle>
          <CardDescription className="dark:text-gray-300">
            Get started with your AI assistant journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-gray-300">Username</Label>
              <Input
                id="username"
                placeholder="Preferred Username"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>

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

            <div className="space-y-2 relative">
              <Label
                htmlFor="password"
                className={
                  !isPasswordValid && password ? "text-red-500 dark:text-red-400" : "dark:text-gray-300"
                }
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <ul className="mt-2 text-sm space-y-1">
                <li
                  className={`flex items-center gap-2 ${
                    passwordChecks.length ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {passwordChecks.length ? "✔" : "✖"} Minimum 8 characters
                </li>
                <li
                  className={`flex items-center gap-2 ${
                    passwordChecks.uppercase ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {passwordChecks.uppercase ? "✔" : "✖"} At least one uppercase
                  letter
                </li>
                <li
                  className={`flex items-center gap-2 ${
                    passwordChecks.specialChar ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {passwordChecks.specialChar ? "✔" : "✖"} At least one special
                  character
                </li>
                <li
                  className={`flex items-center gap-2 ${
                    passwordChecks.numeric ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {passwordChecks.numeric ? "✔" : "✖"} At least one number
                </li>
              </ul>
            </div>

            <div className="space-y-2 relative">
              <Label
                htmlFor="confirmPassword"
                className={!passwordsMatch && confirmPassword ? "text-red-500 dark:text-red-400" : "dark:text-gray-300"}
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {!passwordsMatch && confirmPassword && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-600/10 to-primary/10 p-4 rounded-md">
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                <strong>Note:</strong> This is a live demo environment. You don't need to verify your account.
                Feel free to use any username and password combination. This is just to showcase authentication
                and chat history restoration features.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
              disabled={isLoading || !canSubmit}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Already have an account? <Link to="/login" className="underline text-primary dark:text-purple-400">Sign in</Link>
          </p>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            <Link to="/" className="underline text-primary dark:text-purple-400">
              Continue as guest
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RegisterPage