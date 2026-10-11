import { site } from "@/content/site";

export type ContactFields = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

function mailto(subject: string, body: string): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** RFC 6068: line breaks in a mailto body are CRLF. */
const CRLF = "\r\n";

/** Contact form message, prefilled the way the design specifies. */
export function contactMailto({ name, email, topic, message }: ContactFields): string {
  const subject = `[dantech.app] ${topic || "Hello"} — ${name}`;
  const body = `${message.replace(/\r?\n/g, CRLF)}${CRLF}${CRLF}— ${name} <${email}>`;
  return mailto(subject, body);
}

/** Ship notes sign-up request, used when no newsletter endpoint is configured. */
export function subscribeMailto(email: string): string {
  return mailto("[dantech.app] Ship notes — subscribe", `Please add ${email} to the Ship notes list.`);
}
