import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ProtectedRoute } from '../components/ProtectedRoute';

// This route handles /chapter (without courseId) - redirect to /course
// The actual chapter view is at /chapter/:courseId
export const Route = createFileRoute('/chapter')({
  component: function ChapterRedirect() {
    const navigate = useNavigate();
    
    useEffect(() => {
      // Redirect to course page by default (or first course 'python')
      navigate({ to: '/course' });
    }, [navigate]);
    
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen bg-[#041521]">
          <div className="text-[#bdc9c8]">Redirecting...</div>
        </div>
      </ProtectedRoute>
    );
  },
});
