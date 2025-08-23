import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  sanitize,
  isValidUUID,
  validateReason,
  validateDownsell,
} from "@/lib/validate";

export async function POST(req: Request) {
  try {
    // 1️⃣ CSRF origin check
    const origin = req.headers.get("origin");
    if (origin && !origin.startsWith("http://localhost:3000")) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

    // 2️⃣ Parse & validate inputs
    const { userId, reason, accepted_downsell } = await req.json();

    if (!isValidUUID(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const reasonError = validateReason(reason);
    if (reasonError) {
      return NextResponse.json({ error: reasonError }, { status: 400 });
    }

    const downsellError = validateDownsell(accepted_downsell);
    if (downsellError) {
      return NextResponse.json({ error: downsellError }, { status: 400 });
    }

    const cleanReason = sanitize(reason);

    // 3️⃣ Get subscription
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

    // 4️⃣ Mark subscription as pending_cancellation
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

    // 5️⃣ Update existing cancellation row (not insert)
    const { error: cancelUpdateError } = await supabaseAdmin
      .from("cancellations")
      .update({
        reason: cleanReason,
        accepted_downsell,
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
  } catch (err: any) {
    console.error("Finalize cancel error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to finalize cancellation" },
      { status: 500 }
    );
  }
}
