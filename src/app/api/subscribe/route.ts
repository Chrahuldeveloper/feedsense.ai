import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!, // public key is fine here
  key_secret: process.env.RAZORPAY_KEY_SECRET!,     // secret key server-side
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}


export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });

    return new NextResponse(JSON.stringify({ orderId: order.id }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return new NextResponse(JSON.stringify({ error: error.message || "An error occurred" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
