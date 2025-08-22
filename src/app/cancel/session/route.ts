// src/app/api/cancel/session/route.ts
import { NextRequest, NextResponse } from "next/server";

type Variant = "A" | "B";

// Minimal same-origin check (optional for now; safe & simple)
function assertSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return; // skip in local dev if missing
  try {
    const o = new URL(origin);
    if (o.host !== host) throw new Error("CSRF protection: invalid origin");
  } catch {
    throw new Error("CSRF protection: invalid origin");
  }
}

export async function POST(req: NextRequest) {
  try {
    assertSameOrigin(req);

    // 👉 Keep this stub simple for now so everything runs:
    // We'll wire Supabase + deterministic A/B in the next small step.
    const variant: Variant = "A";

    return NextResponse.json({ variant });
  } catch (e: any) {
    return new NextResponse(e?.message || "Failed to start session", {
      status: 400,
    });
  }
}
