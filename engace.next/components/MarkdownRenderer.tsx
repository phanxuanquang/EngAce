"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ReactNode } from "react";

export interface MarkdownRendererProps {
  children: string;
}

interface ComponentProps {
  children?: ReactNode;
}

interface LinkProps {
  href?: string;
  children?: ReactNode;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

const components = {
  h1: ({ children }: ComponentProps) => (
    <h1
      className="text-3xl lg:text-4xl font-black py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent relative
    after:content-[''] after:absolute after:bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:via-pink-500 after:to-blue-500 after:rounded-full after:opacity-75
    hover:scale-100 transition-transform duration-300"
    >
      {children}
    </h1>
  ),
  h2: ({ children }: ComponentProps) => (
    <h2 className="text-lg md:text-lg lg:text-lg font-bold py-2">{children}</h2>
  ),
  h3: ({ children }: ComponentProps) => (
    <h3 className="text-xl md:text-xl lg:text-2xl font-bold py-2">
      {children}
    </h3>
  ),
  h4: ({ children }: ComponentProps) => (
    <h4 className="font-bold py-1">{children}</h4>
  ),
  p: ({ children }: ComponentProps) => (
    <p className="my-2 text-sm md:text-base text-white-600 dark:text-white-400">
      {children}
    </p>
  ),
  ul: ({ children }: ComponentProps) => (
    <ul className="my-2 list-disc pl-4 marker:text-white-500 text-sm md:text-base text-white-600 dark:text-white-400">
      {children}
    </ul>
  ),
  ol: ({ children }: ComponentProps) => (
    <ol className="my-2 list-decimal pl-4 marker:text-white-500 text-sm md:text-base text-white-600 dark:text-white-400">
      {children}
    </ol>
  ),
  li: ({ children }: ComponentProps) => (
    <li className="my-2 relative before:absolute before:left-[-1.5em] before:text-white-500 before:font-bold md:text-base text-white-600 dark:text-white-400">
      {children}
    </li>
  ),
  strong: ({ children }: ComponentProps) => (
    <strong className="font-bold text-white-800 dark:text-white-200">
      {children}
    </strong>
  ),
  blockquote: ({ children }: ComponentProps) => (
    <blockquote className="my-2 border-l-4 border-blue-500/50 pl-4 not-italic text-sm md:text-base text-white-600 dark:text-white-400">
      {children}
    </blockquote>
  ),
  a: ({ href, children }: LinkProps) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
    >
      {children}
    </a>
  ),
  code: ({ inline, className, children }: CodeProps) => {
    if (inline) {
      return (
        <code className="rounded bg-white-100 px-1.5 py-0.5 text-sm md:text-base text-white-800 dark:bg-white-700 dark:text-white-200">
          {children}
        </code>
      );
    }

    return (
      <code
        className={`block p-2 overflow-x-auto text-xs md:text-base ${
          className || ""
        }`}
      >
        {children}
      </code>
    );
  },
  table: ({ children }: ComponentProps) => (
    <div className="my-2 w-full overflow-x-auto">
      <table className="min-w-full border-collapse border border-slate-100 dark:border-slate-700 text-sm rounded-lg">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: ComponentProps) => (
    <thead className="bg-slate-100 dark:bg-slate-800 text-sm">{children}</thead>
  ),
  tbody: ({ children }: ComponentProps) => (
    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
      {children}
    </tbody>
  ),
  tr: ({ children }: ComponentProps) => (
    <tr className="px-4 py-2 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">
      {children}
    </tr>
  ),
  th: ({ children }: ComponentProps) => (
    <th className="px-4 py-1 text-left font-semibold text-slate-900 dark:text-slate-100 ">
      {children}
    </th>
  ),
  td: ({ children }: ComponentProps) => (
    <td className="px-4 py-2 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">
      {children}
    </td>
  ),
};

export default function MarkdownRenderer({ children }: MarkdownRendererProps) {
  return (
    <article className="prose max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </article>
  );
}
