import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  PlusCircle,
  X,
  ChevronsLeft,
  ChevronsRight,
  MessageCircleMoreIcon,
  Trash2,
  CheckSquare
} from "lucide-react"
import { useChat } from "@/context/ChatContext"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteChatSession, deleteMultipleChatSessions } from "@/services/chat"

interface SidebarProps {
  isMobileOpen: boolean
  onCloseMobile: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { sessions, switchSession, currentSession, setIsNewChatClicked, setCurrentSession } = useChat()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedSessions, setSelectedSessions] = useState<string[]>([])
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const deleteSingleMutation = useMutation({
    mutationFn: (sessionId: string) => deleteChatSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] })
      if (deleteTarget === currentSession?.id) {
        setCurrentSession(null)
      }
    }
  })

  const deleteMultipleMutation = useMutation({
    mutationFn: (sessionIds: string[]) => deleteMultipleChatSessions(sessionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] })
      if (selectedSessions.includes(currentSession?.id ?? "")) {
        setCurrentSession(null)
      }
      setSelectedSessions([])
    }
  })

  const handleNewChat = () => {
    setIsNewChatClicked(true)
    setCurrentSession(null)
  }

  const toggleSelectSession = (id: string) => {
    setSelectedSessions(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    )
  }

  const handleDeleteConfirmed = () => {
    if (deleteTarget) {
      deleteSingleMutation.mutate(deleteTarget)
    } else {
      deleteMultipleMutation.mutate(selectedSessions)
    }
    setConfirmDeleteOpen(false)
    setDeleteTarget(null)
    handleNewChat()
  }

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <div
        className={`
          fixed md:static top-0 left-0 h-full z-50 border-r bg-background
          flex flex-col transition-transform duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${isCollapsed ? "md:w-16" : "md:w-64"} w-64
          bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800
        `}
      >
        <div className="p-4 flex items-center justify-between border-b md:border-0 gap-2 dark:border-gray-800">
          {!isCollapsed && !isSelecting && (
            <Button 
              onClick={handleNewChat} 
              className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
              variant="ghost"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          )}

          {!isCollapsed && !isSelecting && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSelecting(true)}
              className="dark:text-gray-300"
            >
              <CheckSquare className="h-5 w-5" />
            </Button>
          )}

          {isSelecting && !isCollapsed && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSelecting(false)
                  setSelectedSessions([])
                }}
                className="dark:border-gray-700 dark:text-gray-300"
              >
                Cancel
              </Button>
              {selectedSessions.length > 0 && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setDeleteTarget(null)
                    setConfirmDeleteOpen(true)
                  }}
                  className="dark:bg-red-600 dark:hover:bg-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex dark:text-gray-300"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden dark:text-gray-300"
            onClick={onCloseMobile}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className={`space-y-1 ${isCollapsed ? "p-2" : "p-4 pt-0"}`}>
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-2 relative"
              >
                {isSelecting && (
                  <Checkbox
                    checked={selectedSessions.includes(session.id)}
                    onCheckedChange={() => toggleSelectSession(session.id)}
                    className="dark:border-gray-600"
                  />
                )}
                <Button
                  onClick={() => {
                    if (!isSelecting) {
                      setIsNewChatClicked(false)
                      switchSession(session.id)
                      onCloseMobile()
                    }
                  }}
                  variant={currentSession?.id === session.id ? "secondary" : "ghost"}
                  className={`flex-1 justify-start text-left ${
                    currentSession?.id === session.id 
                      ? "font-medium bg-gradient-to-r from-purple-600/10 to-primary/10" 
                      : ""
                  } dark:text-gray-300`}
                >
                  {!isCollapsed ? (
                    <span className="truncate w-full dark:text-white">{session.title || "New Chat"}</span>
                  ) : (
                    <MessageCircleMoreIcon className="h-4 w-4 mx-auto" />
                  )}
                </Button>
                {!isSelecting && currentSession?.id === session.id && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="ml-1 dark:bg-red-600 dark:hover:bg-red-700"
                    onClick={() => {
                      setDeleteTarget(session.id)
                      setConfirmDeleteOpen(true)
                    }}
                    aria-label="Delete session"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

          </div>
        </ScrollArea>
      </div>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              {deleteTarget
                ? "Delete this chat session?"
                : `Delete ${selectedSessions.length} selected sessions?`}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground dark:text-gray-300">
            This action cannot be undone. Do you want to proceed?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDeleteOpen(false)
                setDeleteTarget(null)
              }}
              className="dark:border-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirmed}
              disabled={deleteSingleMutation.isPending || deleteMultipleMutation.isPending}
              className="dark:bg-red-600 dark:hover:bg-red-700"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Sidebar