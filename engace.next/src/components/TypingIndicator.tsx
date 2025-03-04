export default function TypingIndicator() {
  return (
    <div className="flex space-x-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl w-fit">
      <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-[bounce_1.4s_infinite_.2s]" />
      <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-[bounce_1.4s_infinite_.4s]" />
      <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-[bounce_1.4s_infinite_.6s]" />
    </div>
  )
}