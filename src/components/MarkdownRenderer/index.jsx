import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

/**
 * MarkdownRenderer
 * Renders a Markdown string (from lesson.document) with:
 * - Styled headings, paragraphs, lists
 * - Code blocks with syntax highlighting (dark theme, matching UI)
 * - Inline code
 */
const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // ── Headings ──────────────────────────────────────
          h1: ({ children }) => (
            <h1
              style={{
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '24px',
                fontWeight: 700,
                color: '#E5E9EC',
                marginBottom: '16px',
                marginTop: '32px',
                lineHeight: 1.3,
              }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              style={{
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '20px',
                fontWeight: 600,
                color: '#D1D9E0',
                marginBottom: '12px',
                marginTop: '28px',
                lineHeight: 1.3,
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '17px',
                fontWeight: 600,
                color: '#A6B5C3',
                marginBottom: '10px',
                marginTop: '24px',
              }}
            >
              {children}
            </h3>
          ),

          // ── Paragraph ─────────────────────────────────────
          p: ({ children }) => (
            <p
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: '15px',
                color: '#8FA3B5',
                lineHeight: 1.75,
                marginBottom: '14px',
              }}
            >
              {children}
            </p>
          ),

          // ── Bold / Italic ──────────────────────────────────
          strong: ({ children }) => (
            <strong style={{ color: '#D1D9E0', fontWeight: 600 }}>{children}</strong>
          ),
          em: ({ children }) => (
            <em style={{ color: '#A6B5C3', fontStyle: 'italic' }}>{children}</em>
          ),

          // ── Lists ─────────────────────────────────────────
          ul: ({ children }) => (
            <ul
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: '15px',
                color: '#8FA3B5',
                lineHeight: 1.75,
                paddingLeft: '24px',
                marginBottom: '14px',
                listStyleType: 'disc',
              }}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: '15px',
                color: '#8FA3B5',
                lineHeight: 1.75,
                paddingLeft: '24px',
                marginBottom: '14px',
                listStyleType: 'decimal',
              }}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: '4px' }}>{children}</li>
          ),

          // ── Inline Code ───────────────────────────────────
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            if (!inline && language) {
              return (
                <div style={{ marginBottom: '20px', marginTop: '8px' }}>
                  {language && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: '#0E1A24',
                        borderRadius: '8px 8px 0 0',
                        borderBottom: '1px solid #1C2D3C',
                      }}
                    >
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#FF5F56',
                          display: 'inline-block',
                        }}
                      />
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#FFBD2E',
                          display: 'inline-block',
                        }}
                      />
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#27C93F',
                          display: 'inline-block',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'Roboto Mono, monospace',
                          fontSize: '11px',
                          color: '#576978',
                          marginLeft: '8px',
                          textTransform: 'lowercase',
                        }}
                      >
                        {language}
                      </span>
                    </div>
                  )}
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language || 'text'}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: language ? '0 0 8px 8px' : '8px',
                      background: '#0A1520',
                      border: '1px solid #1C2D3C',
                      borderTop: language ? 'none' : '1px solid #1C2D3C',
                      fontSize: '14px',
                      padding: '16px',
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // Inline code
            return (
              <code
                style={{
                  fontFamily: 'Roboto Mono, monospace',
                  fontSize: '13px',
                  color: '#7FE3DD',
                  background: '#0A1D28',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid #1C2D3C',
                }}
                {...props}
              >
                {children}
              </code>
            );
          },

          // ── Blockquote ────────────────────────────────────
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: '3px solid #7FE3DD',
                paddingLeft: '16px',
                margin: '16px 0',
                color: '#7D8A95',
                fontStyle: 'italic',
              }}
            >
              {children}
            </blockquote>
          ),

          // ── Horizontal Rule ───────────────────────────────
          hr: () => (
            <hr
              style={{
                border: 'none',
                borderTop: '1px solid #1C2D3C',
                margin: '24px 0',
              }}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
