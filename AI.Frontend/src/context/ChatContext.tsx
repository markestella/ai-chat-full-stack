import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getChatSessions,
  getChatMessages,
  createChatSession,
  sendMessage,
  getGuestChatMessages,
} from "@/services/chat";
import { useAuth } from "@/context/AuthContext";
import { GUEST_USER_ID } from "@/lib/constants";

type Message = {
  id: string;
  content: string;
  isUserMessage: boolean;
  timestamp: Date;
};

type Session = {
  id: string;
  title: string;
  createdAt: Date;
};

type ChatContextType = {
  isNewChatClicked: boolean;
  setIsNewChatClicked: (value: boolean) => void;
  sessions: Session[];
  currentSession: Session | null;
  setCurrentSession: (session: Session | null) => void;
  messages: Message[];
  isStreaming: boolean;
  activeMessage: string | null;
  switchSession: (sessionId: string) => void;
  sendUserMessage: (content: string) => Promise<void>;
  resetChatState: () => void;
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [isNewChatClicked, setIsNewChatClicked] = useState(true);

  const isGuest = user?.isGuest === true;
  const effectiveUserId = isGuest ? GUEST_USER_ID : user?.id || null;

  const { data: sessionsData = [] } = useQuery({
    queryKey: ["chatSessions", user?.id],
    queryFn: getChatSessions,
    enabled: !!user && !isGuest,
  });

  const sessions = sessionsData.map(session => ({
    id: session.id || '', 
    title: session.title || "Untitled",
    createdAt: new Date(session.createdAt || Date.now())
  }));

  const { data: messagesData = [] } = useQuery({
    queryKey: ["chatMessages", currentSession?.id, effectiveUserId],
    queryFn: () => {
      if (!currentSession?.id) return Promise.resolve([]);
      if (user && !isGuest) {
        return getChatMessages(currentSession.id);
      }
      return getGuestChatMessages(currentSession.id, GUEST_USER_ID);
    },
    enabled: !!currentSession?.id && !!effectiveUserId,
  });


  const messages = messagesData.map(message => ({
    id: message.id || '', 
    content: message.content || "",
    isUserMessage: message.isUserMessage || false,
    timestamp: new Date(message.timestamp || Date.now()) 
  }));

  useEffect(() => {
    if (isGuest) {
      const sessionId = localStorage.getItem("guestSessionId");
      if (sessionId) {
        const session: Session = {
          id: sessionId,
          title: "Guest Session",
          createdAt: new Date(),
        };
        setCurrentSession(session);
        setIsNewChatClicked(false);
      }
    }
  }, [isGuest]);

  const resetChatState = useCallback(() => {
    setCurrentSession(null);
    setIsNewChatClicked(true);
    setIsStreaming(false);
    setActiveMessage(null);
    queryClient.removeQueries({ queryKey: ["chatSessions"] });
    queryClient.removeQueries({ queryKey: ["chatMessages"] });
  }, [queryClient]);

  useEffect(() => {
    if (!user) resetChatState();
  }, [user, resetChatState]);

  const switchSession = useCallback(
    (sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId) || null;
      setCurrentSession(session);
      setIsNewChatClicked(false);
      queryClient.removeQueries({ queryKey: ["chatMessages"] });
    },
    [sessions, queryClient]
  );

  const sendUserMessage = async (content: string) => {
    if (!effectiveUserId) {
      console.error("No user ID available — cannot send message");
      return;
    }

    let session = currentSession;

    if (!session || isNewChatClicked) {
      const newSession = await createChatSession({
        title: content.slice(0, 30),
        userId: isGuest ? GUEST_USER_ID : effectiveUserId,
      });

      session = {
        id: newSession.id || '', 
        title: newSession.title || "New Chat",
        createdAt: new Date(newSession.createdAt || Date.now()), 
      };

      setCurrentSession(session);

      if (isGuest && session) {
        localStorage.setItem("guestSessionId", session.id);
      }

      if (!isGuest) {
        queryClient.invalidateQueries({ queryKey: ["chatSessions", effectiveUserId] });
      }
    }

    if (!session) {
      console.error("Failed to create or retrieve chat session");
      return;
    }

    queryClient.setQueryData<Message[]>(
      ["chatMessages", session.id, effectiveUserId],
      (prev = []) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          content,
          isUserMessage: true,
          timestamp: new Date(),
        },
      ]
    );

    setIsStreaming(true);
    setActiveMessage("");

    try {
      const botResponse = await sendMessage({
        sessionId: session.id,
        content,
        userId: isGuest ? GUEST_USER_ID : effectiveUserId,
      });

      const text = botResponse.content || "";
      let i = 0;
      const interval = setInterval(() => {
        setActiveMessage((prev) => (prev || "") + text[i]);
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setIsStreaming(false);
          setActiveMessage(null);

          queryClient.setQueryData<Message[]>(
            ["chatMessages", session!.id, effectiveUserId],
            (prev = []) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                content: text,
                isUserMessage: false,
                timestamp: new Date(),
              },
            ]
          );
        }
      }, 30);
    } catch (error) {
      console.error("Bot reply failed", error);
      setIsStreaming(false);
      setActiveMessage(null);
    }
  };

  const value: ChatContextType = {
    isNewChatClicked,
    setIsNewChatClicked,
    sessions,
    currentSession,
    setCurrentSession,
    messages,
    isStreaming,
    activeMessage,
    switchSession,
    sendUserMessage,
    resetChatState,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};