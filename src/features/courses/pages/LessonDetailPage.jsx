import React from 'react';
import { useParams } from '@tanstack/react-router';

const LessonDetailPage = () => {
  const { lessonId } = useParams({ strict: false });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Lesson Detail Page</h1>
      <p>Viewing lesson ID: {lessonId}</p>
    </div>
  );
};

export default LessonDetailPage;
