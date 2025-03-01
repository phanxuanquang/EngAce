"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ReactNode } from "react";
import { FileSpreadsheet } from "lucide-react";

import * as XLSX from "xlsx";

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
    <h2 className="text-xl font-bold py-2">{children}</h2>
  ),
  h3: ({ children }: ComponentProps) => (
    <h3 className="text-lg font-bold py-2">
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
      className="underline hover:text-blue-600 dark:hover:text-blue-300 text-medium"
    >
      {children}
    </a>
  ),
  code: ({ inline, className, children }: CodeProps) => {
    if (inline) {
      return (
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm md:text-base text-gray-800 dark:bg-gray-800 dark:text-gray-200">
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
  table: ({ children }: ComponentProps) => {
    const handleExport = () => {
      const table = document.querySelector("table") as HTMLTableElement;
      if (!table) return;

      // Get headers
      const headers = Array.from(table.querySelectorAll("th") as NodeListOf<HTMLTableCellElement>).map(
        (th) => th.textContent || ""
      );

      // Get rows
      const rows = Array.from(table.querySelectorAll("tbody tr") as NodeListOf<HTMLTableRowElement>).map((row) =>
        Array.from(row.querySelectorAll("td") as NodeListOf<HTMLTableCellElement>).map((td) => td.textContent || "")
      );

      // Create worksheet data
      const wsData = [headers, ...rows];

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Style configuration
      const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F46E5" } },
        alignment: { horizontal: "center" },
      };

      // Apply styles to header row
      if (ws["!ref"]) {
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_cell({ r: 0, c: C });
          ws[address].s = headerStyle;
        }
      }

      // Set column widths
      const colWidths = headers.map(() => ({ wch: 20 }));
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Table Data");

      // Generate filename
      const fileName = `EngAce-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);
    };

    return (
      <div className="my-2 w-full overflow-x-auto space-y-1">
        <table className="min-w-full border border-slate-100 dark:border-slate-700 text-sm rounded-lg dark:bg-slate-800/30 bg-slate-400/30">
          {children}
        </table>
        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="mt-1 text-xs inline-flex items-center gap-1.5 px-2 py-1 rounded
          bg-green-600 text-white hover:bg-green-700 
          dark:bg-green-700 dark:hover:bg-green-800
          transition-colors duration-200"
          >
            <FileSpreadsheet size={14} />
            Xuất thành trang tính
          </button>
        </div>
      </div>
    );
  },
  thead: ({ children }: ComponentProps) => (
    <thead className="bg-slate-400/80 dark:bg-slate-800 text-sm">{children}</thead>
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
    <th className="px-4 py-1.5 text-left text-slate-900 dark:text-slate-100 ">
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
