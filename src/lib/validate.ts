// src/lib/validate.ts

// Remove HTML tags & trim whitespace
export function sanitize(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

// Basic UUID v4 check
export function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    str
  );
}

// Validate reason string length
export function validateReason(reason: any): string | null {
  if (typeof reason !== "string") return "Reason must be a string";
  if (reason.trim().length < 5) return "Reason too short (min 5 chars)";
  return null;
}

// Validate accepted_downsell boolean
export function validateDownsell(val: any): string | null {
  if (typeof val !== "boolean") return "accepted_downsell must be boolean";
  return null;
}
