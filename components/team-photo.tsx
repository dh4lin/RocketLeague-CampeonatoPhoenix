"use client"

import { useState } from "react"
import { Camera } from "lucide-react"

interface TeamPhotoProps {
  photo: string | null
  teamName: string
  onPhotoChange: (photoUrl: string) => void
}

export function TeamPhoto({
  photo,
  teamName,
  onPhotoChange,
}: TeamPhotoProps) {
  const [editing, setEditing] = useState(false)
  const [url, setUrl] = useState(photo || "")

  const saveUrl = () => {
    if (url.trim()) {
      onPhotoChange(url)
    }
    setEditing(false)
  }

  return (
    <div className="flex flex-col items-center gap-1">
      {/* FOTO */}
      <div
        onClick={() => setEditing(true)}
        className="group relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-secondary"
        title="Clique para colar link da imagem"
      >
        {photo ? (
          <img
            src={photo}
            alt={teamName}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-bold text-muted-foreground">
            {teamName.charAt(0).toUpperCase()}
          </span>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100">
          <Camera className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* INPUT DE LINK */}
      {editing && (
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Cole URL da imagem"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-32 rounded border px-2 py-1 text-xs"
          />

          <button
            onClick={saveUrl}
            className="rounded bg-primary px-2 py-1 text-xs text-white"
          >
            OK
          </button>
        </div>
      )}
    </div>
  )
}
