import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const reviews = await db.review.findMany({
      where: {
        productId,
        status: "APPROVED", // Only show approved reviews to public users
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: productId } = await params
    const body = await request.json()
    const { rating, comment } = body

    if (!rating || rating < 1 || rating > 5 || !comment) {
      return NextResponse.json({ error: "Invalid rating or comment" }, { status: 400 })
    }

    const review = await db.review.create({
      data: {
        rating: Number(rating),
        comment,
        productId,
        userId: session.user.id,
        status: "PENDING", // Sent to moderation queue by default
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}