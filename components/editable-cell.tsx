"use client"

import { useState, useRef, useEffect } from "react"

interface EditableCellProps {
  value: string | number
  onChange: (value: string | number) => void
  type?: "text" | "number"
  className?: string
  minWidth?: string
}

export function EditableCell({
  value,
  onChange,
  type = "text",
  className = "",
  minWidth = "2rem",
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(value))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditValue(String(value))
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSubmit = () => {
    setIsEditing(false)
    if (type === "number") {
      const num = parseInt(editValue, 10)
      if (!isNaN(num) && num >= 0) {
        onChange(num)
      } else {
        setEditValue(String(value))
      }
    } else {
      if (editValue.trim()) {
        onChange(editValue.trim())
      } else {
        setEditValue(String(value))
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    } else if (e.key === "Escape") {
      setEditValue(String(value))
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={type}
        min={type === "number" ? 0 : undefined}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        className={`bg-secondary text-secondary-foreground rounded-sm px-1.5 py-0.5 text-center font-mono text-sm outline-none ring-1 ring-primary/50 focus:ring-primary ${className}`}
        style={{ minWidth, width: `${Math.max(String(editValue).length + 1, 3)}ch` }}
      />
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer rounded-sm px-1.5 py-0.5 text-center font-mono text-sm transition-colors hover:bg-secondary/80 hover:text-primary focus:bg-secondary/80 focus:text-primary focus:outline-none ${className}`}
      style={{ minWidth }}
      title="Clique para editar"
    >
      {value}
    </button>
  )
}
