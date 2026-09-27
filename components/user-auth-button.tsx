"use client"

import { useState, useRef, useEffect } from "react"
import { signIn, signOut } from "next-auth/react"

interface UserAuthButtonProps {
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

export function UserAuthButton({ user }: UserAuthButtonProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
          {user.name || user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="rounded-xl bg-muted/60 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted border border-border/60 transition-all active:scale-95"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
      >
        <span>Sign In</span>
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-card border border-border/80 shadow-xl p-2 z-50 flex flex-col gap-1">
          {/* Google Button */}
          <button
            onClick={() => {
              setOpen(false)
              signIn("google")
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors text-left group"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.35 7.22 24 12 24z" />
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.13 0 9.87 0 12s.43 3.87 1.18 5.4l4.09-3.16z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.15 2.65 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* GitHub Button */}
          <button
            onClick={() => {
              setOpen(false)
              signIn("github")
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors text-left group"
          >
            <svg className="w-4 h-4 shrink-0 fill-current text-foreground" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Sign in with GitHub</span>
          </button>
        </div>
      )}
    </div>
  )
}