import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

// Fetch pending or all reviews for moderation
export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reviews = await db.review.findMany({
      include: {
        user: { select: { name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch moderation queue" }, { status: 500 })
  }
}

// Update review status (APPROVE / REJECT)
export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reviewId, status } = await request.json() // status: "APPROVED" | "REJECTED"

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updated = await db.review.update({
      where: { id: reviewId },
      data: { status },
    })

    return NextResponse.json({ success: true, updated })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update review status" }, { status: 500 })
  }
}