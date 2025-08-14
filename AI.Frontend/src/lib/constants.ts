export const GUEST_USER_ID = "f6de90d5-4490-46e2-82d4-cae4df7a9eaf";
export const GUEST_USER = {
  id: GUEST_USER_ID,
  email: "guest@chatapp.com",
  name: "guest-username",
  isGuest: true,
};
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5262/api";