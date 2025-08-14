import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "@/lib/constants";

export function useDeleteGuestSessionOnExit() {
    const location = useLocation();

    const deleteGuestSession = () => {
        const guestSessionId = localStorage.getItem("guestSessionId");
        if (guestSessionId) {
            const url = `${API_BASE_URL}/Chat/guest/sessions/delete/${guestSessionId}`;

            if (navigator.sendBeacon) {
                navigator.sendBeacon(url);
            } else {
                fetch(url, { method: "POST", keepalive: true }).catch(() => { });
            }
        }
    };

    useEffect(() => {
        const previousLoc = localStorage.getItem('previousLocation')

        if (previousLoc == "/guest-chat" && location.pathname !== "/guest-chat") {
            deleteGuestSession();
        }

        if (location.pathname == "/guest-chat") {
            const handleBeforeUnload = (event: BeforeUnloadEvent) => {
                deleteGuestSession();

                event.preventDefault();
                event.returnValue = '';
            };

            window.addEventListener("beforeunload", handleBeforeUnload);

            return () => {
                window.removeEventListener("beforeunload", handleBeforeUnload);
            };
        }
    }, [location]);

}
