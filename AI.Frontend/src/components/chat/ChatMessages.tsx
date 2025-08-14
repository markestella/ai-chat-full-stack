import React, { useEffect, useRef } from "react"
import Message from "./Message"
import { useChat } from "@/context/ChatContext"

const ChatMessages: React.FC = () => {
  const { messages, isStreaming, activeMessage } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isStreaming, activeMessage])

  return (
    <div className="p-4 pb-8 w-full max-w-3xl mx-auto">
      <div className="space-y-6">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        {isStreaming && (
          <Message
            message={{
              id: 'streaming',
              content: activeMessage || 'Thinking...',
              isUserMessage: false,
              timestamp: new Date(),
            }}
            isStreaming={true}
          />
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  )
}

export default ChatMessages