import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "../features/users/store/auth.store";
import { api } from "../services/axiosClient";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/callback" }) as {
    redirect?: string;
  };
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const response = await api.get("/users/me");
        const user = response.data;

        setAuth(null, null, user);

        const redirectUrl =
          search.redirect ||
          new URLSearchParams(window.location.search).get("redirect");
        if (!user?.onboardingCompleted) {
          navigate({ to: "/onboarding" });
        } else {
          navigate({ to: redirectUrl || "/course" });
        }
      } catch (error) {
        navigate({
          to: "/login",
          search: { error: "social_login_failed" },
        });
      }
    };

    handleCallback();
  }, [navigate, search, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#041521] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#008080] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-['Montserrat'] text-xl">Authenticating...</p>
      </div>
    </div>
  );
}
