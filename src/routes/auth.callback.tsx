import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "../features/users/store/auth.store";

type SearchParams = {
  accessToken?: string;
  refreshToken?: string;
};

export const Route = createFileRoute("/auth/callback")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      accessToken: search.accessToken as string | undefined,
      refreshToken: search.refreshToken as string | undefined,
    };
  },
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/callback" });
  const { setAuth } = useAuthStore();

  useEffect(() => {
    // The backend redirects to /auth/callback?accessToken=...&refreshToken=...
    const { accessToken, refreshToken } = search;

    if (accessToken) {
      // Store tokens and set auth state
      setAuth(accessToken, refreshToken || "");
      navigate({ to: "/" });
    } else {
      // Failed or no token
      navigate({ to: "/login" });
    }
  }, [search, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#008080] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-['Montserrat'] text-xl">Authenticating...</p>
      </div>
    </div>
  );
}
