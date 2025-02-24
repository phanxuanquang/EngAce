"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ReactNode } from "react"

export interface MarkdownRendererProps {
  children: string
}

interface ComponentProps {
  children?: ReactNode

}

interface LinkProps {
  href?: string
  children?: ReactNode
}

interface CodeProps {
  inline?: boolean
  className?: string
  children?: ReactNode
}

const components = {
  h1: ({ children }: ComponentProps) => (
    <h1 className="text-4xl font-extrabold py-2">
      {children}
    </h1>
  ),
  h2: ({ children }: ComponentProps) => (
    <h2 className="text-2xl font-bold py-2">
      {children}
    </h2>
  ),
  h3: ({ children }: ComponentProps) => (
    <h3 className="text-xl font-bold py-2">
      {children}
    </h3>
  ),
  h4: ({ children }: ComponentProps) => (
    <h4 className="font-bold py-1">
      {children}
    </h4>
  ),
  p: ({ children }: ComponentProps) => (
    <p className="my-2">
      {children}
    </p>
  ),
  ul: ({ children }: ComponentProps) => (
    <ul className="my-4 list-disc pl-6 marker:text-white-500">
      {children}
    </ul>
  ),
  ol: ({ children }: ComponentProps) => (
    <ol className="my-2 list-decimal pl-6">
      {children}
    </ol>
  ),
  li: ({ children }: ComponentProps) => (
    <li className="my-2 relative before:absolute before:left-[-1.5em] before:text-white-500 before:font-bold">
      {children}
    </li>
  ),
  strong: ({ children }: ComponentProps) => (
    <strong className="font-bold">
      {children}
    </strong>
  ),
  blockquote: ({ children }: ComponentProps) => (
    <blockquote className="my-3 border-l-4 border-blue-500/50 pl-4 not-italic text-white-600 dark:text-white-400">
      {children}
    </blockquote>
  ),
  a: ({ href, children }: LinkProps) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline"
    >
      {children}
    </a>
  ),
  code: ({ inline, className, children }: CodeProps) => {
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