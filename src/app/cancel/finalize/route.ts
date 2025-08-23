import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, reason, accepted_downsell } = body as {
      userId: string;
      reason?: string;
      accepted_downsell?: boolean;
    };

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // 1️⃣ Get subscription for this user
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("id, status")
      .eq("user_id", userId)
      .maybeSingle();

    if (subError || !subscription) {
      console.error("Subscription lookup error:", subError);
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // 2️⃣ Mark subscription as pending_cancellation
    const { error: updateError } = await supabaseAdmin
      .from("subscriptions")
      .update({ status: "pending_cancellation" })
      .eq("id", subscription.id);

    if (updateError) {
      console.error("Subscription update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update subscription" },
        { status: 500 }
      );
    }

    // 3️⃣ Update existing cancellation row with reason + accepted_downsell
    const { error: cancelUpdateError } = await supabaseAdmin
      .from("cancellations")
      .update({
        reason: reason || null,
        accepted_downsell: accepted_downsell ?? false,
      })
      .eq("user_id", userId);

    if (cancelUpdateError) {
      console.error("Cancellation update error:", cancelUpdateError);
      return NextResponse.json(
        { error: "Failed to update cancellation record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Finalize cancel error:", e);
    return NextResponse.json(
      { error: e?.message || "Failed to finalize cancellation" },
      { status: 500 }
    );
  }
}
