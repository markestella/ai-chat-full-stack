import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ChatSessionItemProps {
  session: {
    id: string
    title: string
    createdAt: Date
    updatedAt?: Date
  }
  isActive: boolean
  onClick: () => void
}

const ChatSessionItem: React.FC<ChatSessionItemProps> = ({
  session,
  isActive,
  onClick
}) => {
  return (
    <div
      className={cn(
        'group flex items-center justify-between rounded-md p-2 hover:bg-accent transition-colors cursor-pointer',
        isActive ? 'bg-gradient-to-r from-purple-600/10 to-primary/10' : ''
      )}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-sm dark:text-white">
          {session.title}
        </p>
        <p className="text-xs text-muted-foreground dark:text-gray-400">
          {format(new Date(session.updatedAt || session.createdAt), 'MMM d, h:mm a')}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 dark:text-gray-400"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  )
}

export default ChatSessionItem