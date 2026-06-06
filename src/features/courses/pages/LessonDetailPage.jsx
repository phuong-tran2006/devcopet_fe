import React, { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { courseApi } from '../api/course.api';

const LessonDetailPage = () => {
  const { lessonId } = useParams({ strict: false });
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lessonId) {
      courseApi.getLessonDetail(lessonId)
        .then(data => {
          setLesson(data);
          document.title = `${data.title} - Devcopet`;
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [lessonId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-fixed-dim border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">error</span>
        <h2 className="font-headline-md text-white mb-2">Lesson Not Found</h2>
        <p className="text-on-surface-variant">We couldn't find the lesson you were looking for.</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-6 bg-primary-fixed-dim/20 text-primary-fixed-dim px-6 py-2 rounded-lg font-bold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="w-full relative pb-20 px-4 md:px-10 lg:px-16 bg-surface">
      <div className="max-w-[800px] mx-auto pt-8">
        
        {/* Back navigation */}
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors text-[13px] font-bold mb-8 uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Modules
        </button>

        {/* Lesson Header */}
        <header className="mb-10 pb-8 border-b border-white/10">
          <div className="inline-block px-3 py-1 bg-primary-fixed-dim/10 text-primary-fixed-dim border border-primary-fixed-dim/20 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
            Lesson
          </div>
          <h1 className="font-headline-lg text-[32px] md:text-[42px] font-bold text-white leading-tight mb-4">
            {lesson.title}
          </h1>
          {lesson.description && (
            <p className="font-body-lg text-on-surface-variant text-[16px] md:text-[18px]">
              {lesson.description}
            </p>
          )}
        </header>

        {/* Markdown Content */}
        <article className="markdown-body font-body-md text-on-surface text-[15px] leading-relaxed mb-16">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    children={String(children).replace(/\n$/, '')}
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-xl my-6 border border-white/10 !bg-[#121c25]"
                  />
                ) : (
                  <code {...props} className={`${className} bg-surface-container-high text-primary-fixed px-1.5 py-0.5 rounded font-code-md text-[13px]`}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {lesson.content}
          </ReactMarkdown>
        </article>

        {/* Action Bottom */}
        <div className="bg-[#121c25] rounded-xl p-8 border border-primary-fixed-dim/30 shadow-[0_0_20px_rgba(0,218,248,0.1)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-headline-sm text-white mb-2">Ready to test your knowledge?</h3>
            <p className="text-[14px] text-on-surface-variant">Complete the quiz to earn XP and progress to the next lesson.</p>
          </div>
          <Link
            to="/lesson/$lessonId/quiz"
            params={{ lessonId: lesson._id }}
            className="w-full md:w-auto flex-shrink-0 bg-primary-fixed-dim text-on-primary-fixed font-bold px-8 py-3.5 rounded-xl hover:bg-primary-fixed hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,218,248,0.4)] whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">assignment</span>
            Start Quiz
          </Link>
        </div>

      </div>
    </main>
  );
};

export default LessonDetailPage;
