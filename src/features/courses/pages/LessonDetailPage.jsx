import React, { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import CodeRunnerBlock from '../../../components/CodeRunnerBlock';
import { courseApi } from '../api/course.api';
import LessonQuiz from '../../quizzes/components/LessonQuiz';

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
    <main className="w-full relative pb-20 px-4 md:px-10 lg:px-16 bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto pt-8 flex flex-col lg:flex-row gap-10">
        
        {/* Left Sidebar Dashboard */}
        <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
          {/* Back navigation */}
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors text-[13px] font-bold uppercase tracking-widest w-fit"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Modules
          </button>

          <div className="sticky top-24 bg-surface-variant/20 border border-outline/20 rounded-2xl p-6 shadow-lg flex flex-col gap-5">
            <div className="p-4 bg-primary-fixed-dim/10 rounded-xl w-fit">
              <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">
                import_contacts
              </span>
            </div>
            
            <div>
              <div className="text-[12px] font-bold text-primary-fixed-dim uppercase tracking-widest mb-1">
                Currently Learning
              </div>
              <h2 className="font-headline-sm text-on-surface text-[22px] font-bold leading-tight mb-2">
                {lesson.title}
              </h2>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-outline/20">
              <div className="flex items-center gap-3 text-[14px] font-bold text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px] text-[#4ade80]">military_tech</span>
                XP Reward: <span className="text-on-surface">{lesson.points || 100}</span>
              </div>
              <div className="flex items-center gap-3 text-[14px] font-bold text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px] text-[#f87171]">local_fire_department</span>
                Difficulty: <span className="text-on-surface capitalize">{lesson.difficulty || 'Normal'}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <div className="flex-1 min-w-0">
          {/* Lesson Header */}
          <header className="mb-10 pb-8 border-b border-outline/20">
            <div className="inline-block px-3 py-1 bg-primary-fixed-dim/10 text-primary-fixed-dim border border-primary-fixed-dim/20 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
              Lesson Content
            </div>
            <h1 className="font-headline-lg text-[32px] md:text-[42px] font-bold text-on-surface leading-tight mb-4">
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
                  const language = className ? className.replace('language-', '').trim() : '';
                  
                  if (!inline && language) {
                    if (language === 'python-run') {
                      return (
                        <CodeRunnerBlock 
                          initialCode={String(children).replace(/\n$/, '')} 
                        />
                      );
                    }
                    
                    return (
                      <SyntaxHighlighter
                        {...props}
                        children={String(children).replace(/\n$/, '')}
                        style={atomDark}
                        language={language}
                        PreTag="div"
                        className="rounded-xl my-6 border border-outline/20 !bg-[#121c25]"
                      />
                    );
                  }
                  
                  return (
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

          {/* Quiz Section */}
          <LessonQuiz lessonId={lesson._id} />
        </div>

      </div>
    </main>
  );
};

export default LessonDetailPage;
