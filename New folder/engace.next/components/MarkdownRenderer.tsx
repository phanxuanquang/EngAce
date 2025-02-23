"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export interface MarkdownRendererProps {
  children: string
}

const components = {
  h1: ({ children }: any) => (
    <h1 className="text-4xl font-bold py-2">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-2xl font-bold py-2">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-xl font-bold py-2">
      {children}
    </h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="font-bold py-1">
      {children}
    </h4>
  ),
  p: ({ children }: any) => (
    <p className="my-2">
      {children}
    </p>
  ),
  ul: ({ children }: any) => (
    <ul className="my-4 list-disc pl-6 marker:text-white-500">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="my-2 list-decimal pl-6">
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li className="my-2 relative before:absolute before:left-[-1.5em] before:text-white-500 before:font-bold">
      {children}
    </li>
  ),
  strong: ({ children }: any) => (
    <strong className="font-bold">
      {children}
    </strong>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="my-4 border-l-4 border-blue-500/50 pl-4 not-italic text-white-600 dark:text-white-400">
      {children}
    </blockquote>
  ),
  a: ({ href, children }: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline"
    >
      {children}
    </a>
  ),
  code: ({ inline, className, children }: any) => {
    if (inline) {
      return (
        <code className="rounded bg-white-100 px-1.5 py-0.5 text-white-800 dark:bg-white-700 dark:text-white-200">
          {children}
        </code>
      )
    }

    return (
      <code className={`block p-4 overflow-x-auto ${className || ""}`}>
        {children}
      </code>
    )
  },
  pre: ({ children }: any) => {
    const code = children?.props?.children || ""
    return (
      <pre className="my-4 rounded-lg bg-white-100 dark:bg-white-700 relative group">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="px-2 py-1 rounded text-xs bg-white-700/50 text-white-300 hover:bg-white-700 transition-colors"
          >
            Copy
          </button>
        </div>
        {children}
      </pre>
    )
  }
}

export default function MarkdownRenderer({ children }: MarkdownRendererProps) {
  return (
    <article className="prose max-w-none dark:prose-invert">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </article>
  )
}