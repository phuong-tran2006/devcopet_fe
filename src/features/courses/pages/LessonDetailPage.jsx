import React, { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import CodeRunnerBlock from '../../../components/CodeRunnerBlock';
import CourseSidebar from '../components/CourseSidebar';
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
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-80px)] bg-surface overflow-hidden">
      
      {/* Cột trái: Sidebar (Danh sách bài học) */}
      {lesson && lesson.courseId && (
        <CourseSidebar courseId={lesson.courseId} currentLessonId={lesson._id} />
      )}

      {/* Cột phải: Nội dung bài học */}
      <main className="flex-1 w-full relative pb-20 px-4 md:px-10 lg:px-16 overflow-y-auto custom-scrollbar">
        {/* Nút Hamburger menu trên mobile (chỉ là nút giữ chỗ, chưa làm overlay drawer vì phức tạp) */}
        <div className="lg:hidden mt-4 mb-6 flex items-center justify-between border-b border-[#1e293b] pb-4">
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-white">
            <span className="material-symbols-outlined text-[20px]">menu_open</span>
            <span className="font-label-sm tracking-widest text-[11px] uppercase">Danh sách bài học</span>
          </button>
          <span className="font-label-sm text-primary-fixed-dim tracking-widest text-[10px] uppercase border border-primary-fixed-dim/30 px-2 py-1 rounded bg-primary-fixed-dim/10">Bài 2</span>
        </div>

        <div className="max-w-[800px] mx-auto lg:pt-10">
          
          {/* Back navigation (chỉ hiện trên Mobile, vì Desktop có nút ở Sidebar) */}
          <button 
            onClick={() => window.history.back()}
            className="lg:hidden inline-flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors text-[13px] font-bold mb-8 uppercase tracking-widest"
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
                      className="rounded-xl my-6 border border-white/10 !bg-[#121c25]"
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
      </main>
    </div>
  );
};

export default LessonDetailPage;
