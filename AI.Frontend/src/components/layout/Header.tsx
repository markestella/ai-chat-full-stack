import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import UserNav from '@/components/shared/UserNav'
import { useAuth } from '@/context/AuthContext'
import Logo from '@/assets/logo.svg?react'
import { ThemeToggle } from '../shared/ThemeToggleButton'

const Header: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (location.pathname === '/') return null

  const isChatPage = location.pathname === '/chat'
  const isGuestChatPage = location.pathname === '/guest-chat'

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div
        className={`flex h-16 items-center justify-between ${isChatPage || isGuestChatPage
          ? 'w-full px-4 sm:px-6 lg:px-8'
          : 'container px-4 sm:px-6'
          }`}
      >
        <Link to={isGuestChatPage ? "/guest-chat" : "/chat"} className="flex items-center space-x-2">
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold">Full-Stack AI Demo</span>
        </Link>

        {user?.isGuest ? (
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link to="/register">Register</Link>
            </Button>
            <ThemeToggle />
          </div>
        ) : isAuthenticated ? (
          isChatPage ? (
            <div className="flex items-center space-x-2">
              <UserNav />
              <ThemeToggle />
            </div>
          ) : (
            <UserNav />
          )
        ) : (
          <div className="flex space-x-2 items-center">
            <Button variant="outline" asChild>
              <Link to="/register">Register</Link>
            </Button>
            <ThemeToggle />
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
