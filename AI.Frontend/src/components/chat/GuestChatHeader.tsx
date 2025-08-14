import React, { useState, useEffect } from 'react'
import { Info, X } from 'lucide-react'

const GuestChatHeader: React.FC = () => {
  const [showInfo, setShowInfo] = useState(true)

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
        <h2 className="text-lg font-semibold dark:text-white">New Chat</h2>
      </div>

      <div className="flex items-center">
        <span className="text-sm text-muted-foreground mr-2 dark:text-gray-400">Guest Mode</span>
        <button
          onClick={() => setShowInfo(true)}
          className="p-2 rounded hover:bg-muted transition-colors dark:hover:bg-gray-800"
          aria-label="Information"
        >
          <Info className="h-5 w-5 text-muted-foreground dark:text-gray-400" />
        </button>
      </div>

      {showInfo && (
        <div className="absolute top-14 right-4 max-w-sm w-[90%] md:w-96 rounded-lg border bg-background shadow-lg p-4 text-sm animate-in fade-in slide-in-from-top-2 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <p className="text-foreground text-justify dark:text-gray-300">
              This is a <strong>live demo environment</strong> using Gemini free-tier AI.
              Responses may be slow. You're currently in <strong>Guest Mode</strong> -
              chats won't be saved. To save chat history, please register an account.
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

export default GuestChatHeader