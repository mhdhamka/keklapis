"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AIChatSheetProps {
  isOpen: boolean
  onClose: () => void
  t: (key: string) => string
}

export function AIChatSheet({ isOpen, onClose, t }: AIChatSheetProps) {
  const QUICK_PROMPTS = [
    t("chat.prompt1"),
    t("chat.prompt2"),
    t("chat.prompt3")
  ]

  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: t("chat.welcomeMessage") }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return

    const userMessage = textToSend.trim()
    setInput("")
    
    const updatedMessages = [...messages, { role: "user" as const, content: userMessage }]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || t("chat.apiError"))

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply }
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chat.apiError") }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-background/95 backdrop-blur-3xl border-l border-[#8C7355]/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Modern Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#8C7355]/20 bg-[#E6DEC7]/30">
        <div>
          <h2 className="font-display font-bold text-sm tracking-tight text-foreground">{t("chat.title")}</h2>
          <p className="text-[10px] text-[#8C7355] font-mono uppercase tracking-widest">{t("chat.subtitle")}</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-[#8C7355]/10 transition-colors"
          aria-label={t("chat.close")}
        >
          ✕
        </button>
      </div>

      {/* Interactive Layer Visualizer Bar */}
      <div className="px-6 py-3 border-b border-[#8C7355]/20 bg-[#D4C3A3]/20 flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-[10px] font-mono text-[#8C7355] uppercase tracking-wider">
          <span>{t("chat.layerStackBar")}</span>
          <span>{t("chat.interactivePreview")}</span>
        </div>
        <div className="flex h-3 w-full rounded-full overflow-hidden shadow-inner border border-[#8C7355]/30">
          <div className="flex-1 bg-[#8C7355] transition-all hover:opacity-90 cursor-pointer" title={t("chat.layer1Title")} onClick={() => handleSend(t("chat.layer1Query"))} />
          <div className="flex-1 bg-[#D4C3A3] transition-all hover:opacity-90 cursor-pointer" title={t("chat.layer2Title")} onClick={() => handleSend(t("chat.layer2Query"))} />
          <div className="flex-1 bg-[#596B5A] transition-all hover:opacity-90 cursor-pointer" title={t("chat.layer3Title")} onClick={() => handleSend(t("chat.layer3Query"))} />
          <div className="flex-1 bg-[#788877] transition-all hover:opacity-90 cursor-pointer" title={t("chat.layer4Title")} onClick={() => handleSend(t("chat.layer4Query"))} />
          <div className="flex-1 bg-[#E6DEC7] transition-all hover:opacity-90 cursor-pointer" title={t("chat.layer5Title")} onClick={() => handleSend(t("chat.layer5Query"))} />
        </div>
      </div>

      {/* Quick Interactive Prompt Pills */}
      <div className="px-5 py-2.5 border-b border-border/40 bg-background/50 flex gap-2 overflow-x-auto no-scrollbar">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-medium bg-[#596B5A]/10 hover:bg-[#596B5A] hover:text-white text-[#596B5A] dark:text-[#E6DEC7] transition-all border border-[#596B5A]/20 shadow-2xs active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs transition-all",
              msg.role === "user"
                ? "ml-auto bg-[#596B5A] text-white rounded-br-none"
                : "mr-auto bg-[#E6DEC7]/60 dark:bg-muted/60 text-foreground border border-[#8C7355]/30 rounded-bl-none whitespace-pre-wrap"
            )}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="mr-auto bg-[#8C7355]/10 text-[#8C7355] dark:text-[#D4C3A3] rounded-2xl px-4 py-2.5 text-xs animate-pulse flex items-center gap-2 border border-[#8C7355]/20">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8C7355] animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4C3A3] animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#596B5A] animate-bounce [animation-delay:0.4s]" />
            </span>
            {t("chat.bakingWisdom")}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-4 border-t border-[#8C7355]/20 bg-[#E6DEC7]/20 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("chat.inputPlaceholder")}
          className="flex-1 rounded-xl border border-[#8C7355]/30 bg-background px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#596B5A] shadow-inner"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-[#596B5A] text-white text-xs font-semibold hover:bg-[#596B5A]/90 transition-all disabled:opacity-40 shadow-sm active:scale-95"
        >
          {t("chat.submit")}
        </button>
      </form>
    </div>
  )
}