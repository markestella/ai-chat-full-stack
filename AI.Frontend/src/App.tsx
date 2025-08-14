import { Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'
import GuestChatPage from './pages/GuestChatPage'
import PrivacyPolicy from "./pages/LegalPages/PrivacyPolicy";
import TermsAndConditions from "./pages/LegalPages/TermsAndConditions";



function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/guest-chat" element={<GuestChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
