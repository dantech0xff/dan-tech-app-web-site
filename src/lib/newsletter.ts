import { subscribeMailto } from "./mailto";

/** `subscribed`: the endpoint stored the address. `mail-app`: a prefilled email was opened instead. */
export type SubscribeOutcome = "subscribed" | "mail-app";

/**
 * Sends the address to `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` as JSON `{ email }`
 * (Formspree, Buttondown proxy, Supabase function, …). Without an endpoint the
 * visitor's mail app opens with a sign-up request to the studio inbox.
 */
export async function subscribeToShipNotes(
  email: string,
  endpoint: string | undefined = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT,
): Promise<SubscribeOutcome> {
  if (!endpoint) {
    window.location.href = subscribeMailto(email);
    return "mail-app";
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email }),
    // A hung endpoint should surface as the inline error, not a stuck button.
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Newsletter endpoint responded with ${response.status}`);
  return "subscribed";
}
