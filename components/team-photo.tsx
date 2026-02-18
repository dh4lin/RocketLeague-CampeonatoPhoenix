"use client"

import { useRef } from "react"
import { Camera } from "lucide-react"

interface TeamPhotoProps {
  photo: string | null
  teamName: string
  onPhotoChange: (photoUrl: string) => void
}

export function TeamPhoto({ photo, teamName, onPhotoChange }: TeamPhotoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        onPhotoChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary transition-all hover:border-primary hover:ring-1 hover:ring-primary/30"
        title="Clique para alterar a foto"
      >
        {photo ? (
          <>
            <img
              src={photo}
              alt={teamName}
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-3.5 w-3.5 text-foreground" />
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground transition-colors group-hover:text-primary">
            {teamName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
