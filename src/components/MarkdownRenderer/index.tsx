// @ts-nocheck
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import CodeRunnerBlock from "../CodeRunnerBlock";

/**
 * MarkdownRenderer
 * Renders a Markdown string (from lesson.document) with:
 * - Styled headings, paragraphs, lists
 * - Code blocks with syntax highlighting (dark theme, matching UI)
 * - Inline code
 */
const markdownComponents = {
  // ── Headings ──────────────────────────────────────
  h1: ({ children }) => (
    <h1
      style={{
        fontFamily: '"Montserrat", sans-serif',
        fontSize: "26px",
        fontWeight: 700,
        color: "#F8FAFC",
        marginBottom: "20px",
        marginTop: "40px",
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
        fontSize: "20px",
        fontWeight: 700,
        color: "#F8FAFC",
        marginBottom: "16px",
        marginTop: "32px",
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
        fontSize: "17px",
        fontWeight: 600,
        color: "#A6B5C3",
        marginBottom: "10px",
        marginTop: "24px",
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
        fontSize: "15px",
        color: "#CBD5E1",
        lineHeight: 1.75,
        marginBottom: "16px",
      }}
    >
      {children}
    </p>
  ),

  // ── Bold / Italic ──────────────────────────────────
  strong: ({ children }) => (
    <strong style={{ color: "#D1D9E0", fontWeight: 600 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ color: "#A6B5C3", fontStyle: "italic" }}>{children}</em>
  ),

  // ── Lists ─────────────────────────────────────────
  ul: ({ children }) => (
    <ul
      style={{
        fontFamily: '"Roboto", sans-serif',
        fontSize: "15px",
        color: "#8FA3B5",
        lineHeight: 1.75,
        paddingLeft: "24px",
        marginBottom: "14px",
        listStyleType: "disc",
      }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol
      style={{
        fontFamily: '"Roboto", sans-serif',
        fontSize: "15px",
        color: "#CBD5E1",
        lineHeight: 1.75,
        paddingLeft: "24px",
        marginBottom: "14px",
        listStyleType: "decimal",
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children }) => <li style={{ marginBottom: "4px" }}>{children}</li>,

  // ── Inline Code ───────────────────────────────────
  code: ({ inline, className, children, ...props }) => {
    const language = className ? className.replace("language-", "").trim() : "";

    if (!inline && language) {
      if (language === "python-run") {
        return (
          <CodeRunnerBlock initialCode={String(children).replace(/\n$/, "")} />
        );
      }

      return (
        <div style={{ marginBottom: "24px", marginTop: "16px" }}>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={language || "text"}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: "8px",
              background: "#161B22",
              border: "1px solid #1E293B",
              fontSize: "14px",
              padding: "16px",
            }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    }

    // Inline code
    return (
      <code
        style={{
          fontFamily: "Roboto Mono, monospace",
          fontSize: "13.5px",
          color: "#10B981",
          background: "#161B22",
          padding: "3px 6px",
          borderRadius: "4px",
          border: "1px solid #1E293B",
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
        borderLeft: "4px solid #10B981",
        paddingLeft: "16px",
        margin: "24px 0",
        color: "#94A3B8",
        fontStyle: "italic",
      }}
    >
      {children}
    </blockquote>
  ),

  // ── Horizontal Rule ───────────────────────────────
  hr: () => (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid #1C2D3C",
        margin: "24px 0",
      }}
    />
  ),
};

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
