import React, { useState, useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChat } from '@/context/ChatContext'

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendUserMessage, isStreaming, setIsNewChatClicked } = useChat()

  const handleSubmit = async () => {
    if (message.trim() === '' || isStreaming) return

    await sendUserMessage(message)
    setMessage('')

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    setIsNewChatClicked(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`
    }
  }, [message])

  return (
    <div className="relative">
      <div className="relative rounded-xl shadow-sm focus-within:ring-1 focus-within:ring-ring dark:focus-within:ring-purple-500">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message AI Assistant..."
          className="
            min-h-[56px]
            py-4
            pr-12
            resize-none
            !border-none
            !outline-none
            !shadow-none
            bg-transparent
            appearance-none
            focus:!outline-none
            focus:!border-none
            focus:!ring-0
            focus-visible:!ring-0
            dark:bg-gray-800/50
            dark:text-gray-200
          "
          disabled={isStreaming}
          rows={1}
        />
        <Button
          onClick={handleSubmit}
          disabled={message.trim() === '' || isStreaming}
          className="absolute right-2 bottom-2 h-9 w-9 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
          size="icon"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

export default ChatInput