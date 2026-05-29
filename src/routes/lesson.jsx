import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ProtectedRoute } from '../components/ProtectedRoute';

// This route handles /lesson (without lessonId) - redirect to /course
// The actual lesson view is at /lesson/detail/:lessonId
export const Route = createFileRoute('/lesson')({
  component: function LessonRedirect() {
    const navigate = useNavigate();
    
    useEffect(() => {
      // Redirect to course page by default
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
