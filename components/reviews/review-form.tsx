"use client"

import { useState } from "react"

export function ReviewForm({ productId, onReviewSubmitted }: { productId: string; onReviewSubmitted: () => void }) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage("")

    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    })

    const data = await res.json()
    setSubmitting(false)

    if (res.ok) {
      setMessage("Review submitted! It will appear after moderation queue approval.")
      setComment("")
      setRating(5)
      onReviewSubmitted()
    } else {
      setMessage(data.error || "Failed to submit review.")
    }
  }

  const ratingLabels: Record<number, string> = {
    1: "Terrible ── Disappointing batch",
    2: "Poor ── Needs adjustment",
    3: "Average ── Decent texture",
    4: "Very Good ── Rich layers",
    5: "Excellent ── Masterpiece artisan quality",
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-[#F9FBF7] border border-[#D5E1D0] space-y-5 shadow-xs">
      <div>
        <h4 className="font-display text-base font-semibold text-[#1B2A1E]">Leave a Tasting Review</h4>
        <p className="text-xs text-[#4A6B43] mt-0.5">Rate the strata, moisture profile, and overall craftsmanship.</p>
      </div>

      {/* Interactive Star Rating Widget */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="text-2xl transition-transform hover:scale-110 focus:outline-none"
            >
              <span className={(hoverRating ?? rating) >= star ? "text-amber-500 drop-shadow-2xs" : "text-[#D5E1D0]"}>
                ★
              </span>
            </button>
          ))}
          <span className="ml-3 font-mono text-xs font-semibold text-[#3B5336] bg-[#E9F0E5] px-2.5 py-1 rounded-xl border border-[#D5E1D0]">
            {rating} / 5
          </span>
        </div>
        <p className="font-mono text-[11px] text-[#4A6B43]">{ratingLabels[hoverRating ?? rating]}</p>
      </div>

      {/* Modern Textarea with Character Counter */}
      <div className="space-y-1.5">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe the spice balance, structural moisture, and layer distribution..."
          required
          rows={3}
          maxLength={300}
          className="w-full text-xs p-3.5 rounded-2xl bg-white border border-[#D5E1D0] text-[#1B2A1E] placeholder:text-[#4A6B43]/50 focus:outline-none focus:ring-2 focus:ring-[#3B5336]/20 focus:border-[#3B5336] resize-none shadow-inner"
        />
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-mono text-[#4A6B43]">Markdown supported</span>
          <span className="text-[10px] font-mono text-[#4A6B43]">{comment.length}/300</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-xl bg-[#3B5336] text-white text-xs font-mono uppercase tracking-wider font-semibold hover:bg-[#273824] transition-all active:scale-95 disabled:opacity-50 shadow-sm"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>

        {message && (
          <p className="text-xs font-medium text-[#3B5336] animate-pulse bg-[#E9F0E5] px-3 py-1.5 rounded-xl border border-[#D5E1D0]">
            {message}
          </p>
        )}
      </div>
    </form>
  )
}