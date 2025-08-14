import React from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'

interface MessageProps {
  message: {
    id: string
    content: string
    isUserMessage: boolean
    timestamp: Date
  }
  isStreaming?: boolean
}

const Message: React.FC<MessageProps> = ({ message, isStreaming = false }) => {
  return (
    <div 
      className={cn(
        'flex items-start gap-3',
        message.isUserMessage ? 'justify-end' : 'justify-start'
      )}
    >
      {!message.isUserMessage && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-primary text-white">
            AI
          </AvatarFallback>
        </Avatar>
      )}
      
      <div 
        className={cn(
          'rounded-xl px-4 py-3 max-w-[80%]',
          message.isUserMessage 
            ? 'bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-br-none' 
            : 'bg-gradient-to-br from-purple-600/20 to-primary/30 dark:from-purple-600/30 dark:to-primary/40 rounded-bl-none',
          isStreaming && 'animate-pulse'
        )}
      >
        <div className="whitespace-pre-wrap break-words dark:text-white">
          {message.content}
        </div>
        <div 
          className={cn(
            'text-xs mt-1',
            message.isUserMessage 
              ? 'text-primary-foreground/70' 
              : 'text-muted-foreground dark:text-gray-400'
          )}
        >
          {format(new Date(message.timestamp), 'HH:mm')}
        </div>
      </div>
      
      {message.isUserMessage && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-accent dark:bg-gray-700">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

export default Message