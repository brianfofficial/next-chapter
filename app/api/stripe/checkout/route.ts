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
      .select("*")
      .eq("id", user.id)
      .single()

    if (employerError || !employer) {
      return NextResponse.json(
        { error: "Employer profile not found" },
        { status: 404 }
      )
    }

    // Check if already has a subscription
    if (employer.subscription_tier === "pro") {
      return NextResponse.json(
        { error: "Already subscribed to Pro plan" },
        { status: 400 }
      )
    }

    let customerId = employer.stripe_customer_id

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: employer.contact_email,
        metadata: {
          employer_id: employer.id,
          company_name: employer.company_name,
        },
      })
      customerId = customer.id

      // Save customer ID to database
      await supabase
        .from("employers")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)
    }

    // Get the origin from the request headers
    const origin = request.headers.get("origin") || "http://localhost:3005"

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Next Chapter Pro",
              description:
                "Unlimited access to athlete contact info and advanced features",
            },
            unit_amount: 29900, // $299.00
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/employers/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/employers/upgrade?canceled=true`,
      metadata: {
        employer_id: user.id,
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
