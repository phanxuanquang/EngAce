import React from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LucideIcon } from "lucide-react"

type SelectOption = {
  value: string
  label: string
}

type SelectGroupProps = {
  label: string
  placeholder: string
  icon: LucideIcon
  options: SelectOption[]
  value?: string
  error?: string
  disabled?: boolean
  onValueChange: (value: string) => void
  register?: any
}

export default function SelectGroup({
  label,
  placeholder,
  icon: Icon,
  options,
  value,
  error,
  disabled = false,
  onValueChange,
  register,
}: SelectGroupProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
        <Select 
          onValueChange={onValueChange} 
          disabled={disabled}
          value={value}
          {...(register ? register : {})}
        >
          <SelectTrigger className="pl-10 focus-visible:ring-0">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="focus-visible:ring-0">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="focus-visible:ring-0"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
} 