import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
} from "@/services/auth";
import { GUEST_USER } from "@/lib/constants";
import { useChat } from "./ChatContext";

type User = {
  id: string;
  email: string;
  name: string;
  isGuest: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  startGuestSession: () => void;
  updateUserProfile: (data: { userName: string; email: string }) => Promise<void>;
  changeUserPassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function useSafeChat() {
    try {
      return useChat();
    } catch {
      return undefined;
    }
  }

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("chatbotUser");
    const tokenExpiry = localStorage.getItem("chatbotTokenExpiry");

    if (storedUser && tokenExpiry && Date.now() < Number(tokenExpiry)) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && !parsedUser.id && parsedUser._id) {
          parsedUser.id = parsedUser._id;
        }
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
    setLoading(false);
  }, []);


  const chatContext = useSafeChat();
  const resetChatState = chatContext?.resetChatState;

  const loginMutation = useMutation({ mutationFn: loginUser });
  const registerMutation = useMutation({ mutationFn: registerUser });
  const updateProfileMutation = useMutation({ mutationFn: updateProfile });
  const changePasswordMutation = useMutation({ mutationFn: changePassword });

  const logout = useCallback((redirect: boolean = true) => {
    setUser(null);
    localStorage.removeItem("chatbotUser");
    localStorage.removeItem("chatbotToken");
    localStorage.removeItem("chatbotTokenExpiry");
    localStorage.removeItem("guestSession");

    if (resetChatState) resetChatState();

    if (redirect) navigate("/login");
  }, [navigate, resetChatState]);

  const refreshAuthToken = useCallback(async () => {
    try {
      const data = await refreshToken();
      localStorage.setItem("chatbotToken", data.token);
      const expiresAt = Date.now() + data.expiresIn * 1000;
      localStorage.setItem("chatbotTokenExpiry", expiresAt.toString());
    } catch {
      logout(); 
    }
  }, [logout]);

  useEffect(() => {
    if (!user || user.isGuest) return;

    const tokenExpiry = localStorage.getItem("chatbotTokenExpiry");
    if (!tokenExpiry) return;

    const scheduleRefresh = () => {
      const expiresAt = Number(tokenExpiry);
      const now = Date.now();
      const refreshAt = expiresAt - 5 * 60 * 1000; 

      if (refreshAt > now) {
        setTimeout(() => refreshAuthToken(), refreshAt - now);
      } else {
        refreshAuthToken();
      }
    };

    scheduleRefresh();
  }, [user, refreshAuthToken]);

  useEffect(() => {
    if (!user || user.isGuest) return;

    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => logout(), 60 * 60 * 1000); 
    };

    const events = ["mousemove", "keydown", "click"];
    events.forEach((evt) => window.addEventListener(evt, resetIdleTimer));

    resetIdleTimer();

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
      clearTimeout(idleTimer);
    };
  }, [user, logout]);

  const login = async (email: string, password: string) => {
    const data = await loginMutation.mutateAsync({ email, password });

    localStorage.setItem("chatbotToken", data.token);
    const expiresAt = Date.now() + data.expiresIn * 1000;
    localStorage.setItem("chatbotTokenExpiry", expiresAt.toString());

    const profile = await getProfile();
    const userData: User = {
      id: profile.userId ?? "",
      email: profile.email ?? "",
      name: profile.userName ?? "",
      isGuest: false,
    };

    setUser(userData);
    localStorage.setItem("chatbotUser", JSON.stringify(userData));
    navigate("/chat");
  };

  const register = async (
    email: string,
    userName: string,
    password: string,
    confirmPassword: string
  ) => {
    await registerMutation.mutateAsync({ email, userName, password, confirmPassword });
  };

  const startGuestSession = () => {
    setUser(GUEST_USER);
    localStorage.setItem("chatbotUser", JSON.stringify(GUEST_USER));
    localStorage.setItem("guestSession", "true");
    navigate("/guest-chat");
  };

  const updateUserProfile = async (data: { userName: string; email: string }) => {
    if (!user || user.isGuest) return;
    await updateProfileMutation.mutateAsync(data);

    const newUser = { ...user, name: data.userName, email: data.email };
    setUser(newUser);
    localStorage.setItem("chatbotUser", JSON.stringify(newUser));
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  const changeUserPassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    return await changePasswordMutation.mutateAsync(passwordData);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    startGuestSession,
    updateUserProfile,
    changeUserPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
