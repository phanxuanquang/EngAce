import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LucideIcon } from "lucide-react"

type InputGroupProps = {
  id: string
  label: string
  placeholder: string
  icon: LucideIcon
  type?: string
  error?: string
  disabled?: boolean
  register?: any
  registerOptions?: any
  rightElement?: React.ReactNode
  extraComponent?: React.ReactNode
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputGroup({
  id,
  label,
  placeholder,
  icon: Icon,
  type = "text",
  error,
  disabled = false,
  register,
  registerOptions = {},
  rightElement,
  extraComponent,
  onChange,
}: InputGroupProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      
      <div className="relative flex items-center">
        <div className="absolute left-3 flex items-center justify-center h-full">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`pl-10 ${rightElement ? "pr-10" : ""} focus-visible:ring-0 w-full`}
          disabled={disabled}
          {...(register ? register(id, registerOptions) : {})}
          onChange={onChange}
          autoComplete="off"
        />
        {rightElement && (
          <div className="absolute right-3 flex items-center justify-center h-full">
            {rightElement}
          </div>
        )}
      </div>
      
      {extraComponent && <div className="mt-2">{extraComponent}</div>}
      
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  )
} 