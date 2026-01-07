import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get employer profile
    const { data: employer, error: employerError } = await supabase
      .from("employers")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    if (employerError || !employer || !employer.stripe_customer_id) {
      return NextResponse.json(
        { error: "No billing account found" },
        { status: 404 }
      )
    }

    // Get the origin from the request headers
    const origin = request.headers.get("origin") || "http://localhost:3005"

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: employer.stripe_customer_id,
      return_url: `${origin}/employers/settings`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Billing portal error:", error)
    return NextResponse.json(
      { error: "Failed to create billing portal session" },
      { status: 500 }
    )
  }
}
