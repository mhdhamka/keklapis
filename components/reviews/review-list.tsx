"use client"

import { useEffect, useState } from "react"

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    name?: string | null
    image?: string | null
  }
}

export function ReviewList({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products/${productId}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [productId])

  if (loading) return <p className="text-xs text-muted-foreground">Loading reviews...</p>
  if (reviews.length === 0) return <p className="text-xs text-muted-foreground">No approved reviews yet. Be the first to review!</p>

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 rounded-xl bg-card border border-border/60 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {review.user.image ? (
                <img src={review.user.image} alt="" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {review.user.name?.[0] || "U"}
                </div>
              )}
              <span className="text-xs font-semibold text-foreground">{review.user.name || "Anonymous"}</span>
            </div>
            <div className="flex text-amber-500 text-xs">
              {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}