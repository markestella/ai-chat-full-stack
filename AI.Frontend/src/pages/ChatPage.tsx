import React, { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Sidebar from '@/components/chat/Sidebar'
import ChatHeader from '@/components/chat/ChatHeader'
import ChatMessages from '@/components/chat/ChatMessages'
import ChatInput from '@/components/chat/ChatInput'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useChat } from '@/context'
import { useStorePreviousLocation } from '@/hooks/useStorePreviousLocation'

const ChatPage: React.FC = () => {
  useStorePreviousLocation()

  const { user, loading } = useAuth()
  const { isNewChatClicked, currentSession } = useChat()
  const navigate = useNavigate()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="flex flex-1 overflow-hidden relative">
        {!user?.isGuest && (
          <Sidebar
            isMobileOpen={isSidebarOpen}
            onCloseMobile={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex flex-col flex-1 overflow-hidden">
          <ChatHeader
            onToggleSidebar={() => setIsSidebarOpen(true)}
            isNewChat={!!(isNewChatClicked && !user?.isGuest)}
          />

          <div className="flex flex-col flex-1 overflow-hidden">
            {isNewChatClicked && !currentSession ? (
              <div className="flex flex-1 items-center justify-center text-muted-foreground p-4 text-center">
                <div>
                  <div className="mx-auto bg-gradient-to-br from-purple-600/20 to-primary/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-primary dark:text-purple-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 8.25h9m-9 3H12m-9 2.25V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v9a2.25 2.25 0 01-2.25 2.25H8.25L3 20.25v-6z"
                      />
                    </svg>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 dark:text-white">
                    Start a conversation
                  </h3>

                  <p className="text-muted-foreground max-w-md dark:text-gray-300">
                    Your conversation will begin when you send your first message to the AI.
                  </p>
                </div>
              </div>

            ) : (
              <div className="flex-1 overflow-y-auto">
                <ChatMessages />
              </div>
            )}

            <div>
              <div className="max-w-3xl mx-auto p-4">
                <ChatInput />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ChatPage