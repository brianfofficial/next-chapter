import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Create Supabase client with service role for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const employerId = session.metadata?.employer_id

  if (!employerId) {
    console.error("No employer_id in session metadata")
    return
  }

  // Get subscription details
  const subscriptionId = session.subscription as string
  const subscription = (await stripe.subscriptions.retrieve(
    subscriptionId
  )) as Stripe.Subscription

  // Update employer record
  await supabase
    .from("employers")
    .update({
      subscription_tier: "pro",
      subscription_status: subscription.status,
      stripe_subscription_id: subscriptionId,
      subscription_start_date: new Date(
        (subscription as any).current_period_start * 1000
      ).toISOString(),
      subscription_end_date: new Date(
        (subscription as any).current_period_end * 1000
      ).toISOString(),
    })
    .eq("id", employerId)

  console.log(`Subscription activated for employer: ${employerId}`)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find employer by stripe_customer_id
  const { data: employer } = await supabase
    .from("employers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single()

  if (!employer) {
    console.error(`No employer found for customer: ${customerId}`)
    return
  }

  // Determine subscription tier based on status
  const tier =
    subscription.status === "active" || subscription.status === "trialing"
      ? "pro"
      : "free_trial"

  await supabase
    .from("employers")
    .update({
      subscription_tier: tier,
      subscription_status: subscription.status,
      subscription_start_date: new Date(
        (subscription as any).current_period_start * 1000
      ).toISOString(),
      subscription_end_date: new Date(
        (subscription as any).current_period_end * 1000
      ).toISOString(),
    })
    .eq("id", employer.id)

  console.log(
    `Subscription updated for employer: ${employer.id}, status: ${subscription.status}`
  )
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find employer by stripe_customer_id
  const { data: employer } = await supabase
    .from("employers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single()

  if (!employer) {
    console.error(`No employer found for customer: ${customerId}`)
    return
  }

  await supabase
    .from("employers")
    .update({
      subscription_tier: "free_trial",
      subscription_status: "canceled",
      subscription_end_date: new Date(
        (subscription as any).ended_at! * 1000
      ).toISOString(),
    })
    .eq("id", employer.id)

  console.log(`Subscription canceled for employer: ${employer.id}`)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  // Find employer by stripe_customer_id
  const { data: employer } = await supabase
    .from("employers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single()

  if (!employer) {
    console.error(`No employer found for customer: ${customerId}`)
    return
  }

  // Update subscription status to active on successful payment
  await supabase
    .from("employers")
    .update({
      subscription_status: "active",
    })
    .eq("id", employer.id)

  console.log(`Payment succeeded for employer: ${employer.id}`)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  // Find employer by stripe_customer_id
  const { data: employer } = await supabase
    .from("employers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single()

  if (!employer) {
    console.error(`No employer found for customer: ${customerId}`)
    return
  }

  // Update subscription status to past_due
  await supabase
    .from("employers")
    .update({
      subscription_status: "past_due",
    })
    .eq("id", employer.id)

  console.log(`Payment failed for employer: ${employer.id}`)
}
