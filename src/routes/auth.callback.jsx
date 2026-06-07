import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuthStore } from '../features/users/store/auth.store';

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/auth/callback' });
  const { setAuth } = useAuthStore();

  useEffect(() => {
    // The backend redirects to /auth/callback?accessToken=...&refreshToken=...
    const { accessToken, refreshToken } = search;

    if (accessToken) {
      // Store tokens and set auth state
      setAuth(accessToken, refreshToken || '', null); // User info could be fetched next or decoded from JWT
      navigate({ to: '/' });
    } else {
      // Failed or no token
      navigate({ to: '/login' });
    }
  }, [search, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#041521] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#008080] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-['Montserrat'] text-xl">Authenticating...</p>
      </div>
    </div>
  );
}
