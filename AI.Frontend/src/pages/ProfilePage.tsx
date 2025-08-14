import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/shared/Input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useStorePreviousLocation } from '@/hooks/useStorePreviousLocation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { deleteUser } from '@/services/auth'

const ProfilePage: React.FC = () => {
  useStorePreviousLocation()

  const { user, updateUserProfile, changeUserPassword, logout, loading } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const navigate = useNavigate()
  const { toast } = useToast()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setUsername(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const passwordRules = {
    hasUppercase: /[A-Z]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    minLength: newPassword.length >= 8,
    matches: newPassword === confirmPassword && confirmPassword.length > 0
  }

  const isPasswordValid =
    passwordRules.hasUppercase &&
    passwordRules.hasNumber &&
    passwordRules.hasSpecialChar &&
    passwordRules.minLength &&
    passwordRules.matches

  const handleSaveProfile = async () => {
    if (!username.trim() || !email.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Username and Email cannot be empty"
      })
      return
    }

    setIsLoading(true)
    try {
      await updateUserProfile({ userName: username, email })
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated."
      })
      setIsEditingProfile(false)
    } catch (err) {
      console.error('Update profile failed:', err)
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update profile. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!isPasswordValid) return

    setIsLoading(true)
    try {
      await changeUserPassword({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      })

      toast({
        title: "Password Changed",
        description: "Your password has been successfully changed."
      })

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
    } catch (err) {
      console.error('Change password failed:', err)
      toast({
        variant: "destructive",
        title: "Change Failed",
        description: "Failed to change password. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const storedUser = localStorage.getItem('chatbotUser')
      if (!storedUser) throw new Error('User ID not found in localStorage')

      const userId = JSON.parse(storedUser).id
      if (!userId) throw new Error('User ID missing in stored data')

      await deleteUser(userId)

      toast({
        title: 'Account Deleted',
        description: 'Your account and all associated data have been deleted.',
      })

      await logout()
      navigate('/')
    } catch (err) {
      console.error('Delete account failed:', err)
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: 'Failed to delete account. Please try again.',
      })
    } finally {
      setIsDeleting(false)
      setIsDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-purple-500 mx-auto"></div>
      </div>
    )
  }

  if (!user) {
    return <div className="p-8 text-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">User not found</div>
  }

  return (
    <div className="container py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="dark:border-gray-700 dark:text-gray-300"
          >
            ← Back
          </Button>
        </div>

        <Card className="shadow-lg border-0 dark:border dark:border-gray-700">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-purple-300">
              Your Profile
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              Manage your account settings and information
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-600/20 to-primary/30 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {username?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold dark:text-white">{username}</h3>
                <p className="text-muted-foreground dark:text-gray-400">{email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="dark:text-gray-300">Username</Label>
              <Input
                id="username"
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditingProfile || isLoading}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />

              <Label htmlFor="email" className="mt-2 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditingProfile || isLoading}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />

              {isEditingProfile ? (
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
                    disabled={isLoading}
                    className="dark:border-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="mt-4 dark:border-gray-700 dark:text-gray-300"
                  onClick={() => setIsEditingProfile(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="mt-6">
              {!showPasswordForm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordForm(true)}
                  className="dark:border-gray-700 dark:text-gray-300"
                >
                  Change Password
                </Button>
              ) : (
                <div className="space-y-3">
                  <Label htmlFor="currentPassword" className="dark:text-gray-300">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  />

                  <Label htmlFor="newPassword" className="dark:text-gray-300">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  />

                  <ul className="text-sm space-y-1 pl-4 dark:text-gray-400">
                    <li className="flex items-center">
                      {passwordRules.hasUppercase ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
                      At least one uppercase letter
                    </li>
                    <li className="flex items-center">
                      {passwordRules.hasNumber ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
                      At least one number
                    </li>
                    <li className="flex items-center">
                      {passwordRules.hasSpecialChar ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
                      At least one special character
                    </li>
                    <li className="flex items-center">
                      {passwordRules.minLength ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
                      Minimum 8 characters
                    </li>
                  </ul>

                  <Label htmlFor="confirmPassword" className="dark:text-gray-300">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  />
                  {confirmPassword && newPassword && !passwordRules.matches && (
                    <p className="text-red-500 dark:text-red-400 text-sm">Passwords do not match</p>
                  )}

                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordForm(false)}
                      disabled={isLoading}
                      className="dark:border-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      disabled={!isPasswordValid || isLoading}
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
                    >
                      {isLoading ? 'Changing...' : 'Confirm Change'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end space-x-4">
          <Button 
            variant="destructive" 
            onClick={() => setIsDialogOpen(true)}
            className="dark:bg-red-600 dark:hover:bg-red-700"
          >
            Remove Account
          </Button>
          <Button 
            variant="outline" 
            onClick={logout}
            className="dark:border-gray-700 dark:text-gray-300"
          >
            Logout
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Confirm Account Removal</DialogTitle>
              <DialogDescription className="dark:text-gray-300">
                This action <strong>cannot be undone</strong>. Your account and all associated data, including all chats, will be permanently deleted from the database.
                Are you sure you want to proceed?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isDeleting}
                className="dark:border-gray-700 dark:text-gray-300"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="dark:bg-red-600 dark:hover:bg-red-700"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ProfilePage