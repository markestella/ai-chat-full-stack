import React, { useState, useEffect } from 'react'
import { useChat } from '@/context/ChatContext'
import { Menu, Info, X } from 'lucide-react'

interface ChatHeaderProps {
  onToggleSidebar?: () => void
  isNewChat: boolean
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onToggleSidebar, isNewChat }) => {
  const { currentSession, isNewChatClicked } = useChat()
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    if (isNewChatClicked) {
      setShowInfo(true)
    }
  }, [isNewChatClicked])

  useEffect(() => {
    if (showInfo) {
      const timer = setTimeout(() => {
        setShowInfo(false)
      }, 12000)
      return () => clearTimeout(timer)
    }
  }, [showInfo])

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm shadow-sm dark:bg-gray-900/90 dark:border-b dark:border-gray-800">
      <div className="flex items-center gap-2">
        <button
          className="md:hidden p-2 -ml-2 rounded hover:bg-muted dark:hover:bg-gray-800"
          onClick={() => onToggleSidebar?.()}
        >
          <Menu className="h-5 w-5 text-muted-foreground dark:text-gray-400" />
        </button>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-primary dark:text-purple-400"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>

        <h2 className="text-lg font-semibold dark:text-white">
          {!isNewChat && currentSession?.title}
        </h2>
      </div>

      <button
        onClick={() => setShowInfo(true)}
        className="p-2 rounded hover:bg-muted transition-colors dark:hover:bg-gray-800"
        aria-label="Information"
      >
        <Info className="h-5 w-5 text-muted-foreground dark:text-gray-400" />
      </button>

      {showInfo && (
        <div className="absolute top-14 right-4 max-w-sm w-[90%] md:w-96 rounded-lg border bg-background shadow-lg p-4 text-sm animate-in fade-in slide-in-from-top-2 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <p className="text-foreground text-justify dark:text-gray-300">
              This is just a <strong>live demo environment</strong> showcasing personal projects using the
              Gemini free-tier AI tool. Responses may be slow depending on current usage. 
              Please bear with it and enjoy exploring how this demo works. Thank you!
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="ml-2 text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatHeader