// lib/resend.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)

const FROM = 'Patriot Ops Center <noreply@patriot-ops.com>'

// ── Email helpers ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, firstName: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to Patriot Ops Center — Your Benefits Journey Starts Now',
    html: welcomeHtml(firstName),
  })
}

export async function sendMagicLinkEmail(to: string, magicLink: string) {
  // Supabase handles magic link delivery by default; use this only if
  // you override the SMTP provider with Resend in Supabase dashboard.
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Your Patriot Ops Center Sign-In Link',
    html: magicLinkHtml(magicLink),
  })
}

export async function sendSubscriptionConfirmation(
  to: string,
  firstName: string,
  planName: string,
  nextBillingDate: string,
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `You're now on the ${planName} plan — Welcome aboard`,
    html: subscriptionHtml(firstName, planName, nextBillingDate),
  })
}

export async function sendOnboardingComplete(to: string, firstName: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Your profile is complete — Let\'s find your benefits',
    html: onboardingCompleteHtml(firstName),
  })
}

// ── HTML templates ────────────────────────────────────────────────────────────
// Minimal inline-styled HTML safe for all email clients

const layout = (content: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#0a1929;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1929;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0f2744;border-radius:12px;overflow:hidden;border:1px solid rgba(245,158,11,0.2);">
        <tr>
          <td style="background:linear-gradient(135deg,#0a1929 0%,#1a3a5c 100%);padding:32px 40px;border-bottom:2px solid #f59e0b;">
            <p style="margin:0;font-size:13px;color:#f59e0b;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Patriot Ops Center</p>
          </td>
        </tr>
        <tr><td style="padding:40px;">
          ${content}
        </td></tr>
        <tr>
          <td style="padding:24px 40px;background:#0a1929;border-top:1px solid rgba(255,255,255,0.08);">
            <p style="margin:0;font-size:12px;color:#64748b;text-align:center;">
              Patriot Ops Center · Serving Those Who Served<br>
              <a href="https://beta.patriot-ops.com/unsubscribe" style="color:#64748b;">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`

const btn = (href: string, text: string) =>
  `<a href="${href}" style="display:inline-block;background:#f59e0b;color:#0a1929;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;margin-top:24px;">${text}</a>`

const h1 = (text: string) =>
  `<h1 style="margin:0 0 16px;font-size:28px;font-weight:800;color:#ffffff;line-height:1.2;">${text}</h1>`

const p = (text: string) =>
  `<p style="margin:0 0 16px;font-size:16px;color:#94a3b8;line-height:1.6;">${text}</p>`

function welcomeHtml(firstName: string) {
  return layout(`
    ${h1(`Welcome, ${firstName}. Your mission starts here.`)}
    ${p(`You've joined thousands of veterans using Patriot Ops Center to navigate VA benefits, file stronger claims, and transition into civilian careers with confidence.`)}
    ${p(`Complete your military profile to unlock personalized benefit recommendations tailored to your branch, MOS, and service dates.`)}
    ${btn('https://beta.patriot-ops.com/onboarding', 'Complete My Profile →')}
    ${p(`Questions? Reply to this email — a real veteran advocate will respond within 24 hours.`)}
  `)
}

function magicLinkHtml(magicLink: string) {
  return layout(`
    ${h1('Your secure sign-in link')}
    ${p(`Click the button below to sign in to Patriot Ops Center. This link expires in 1 hour and can only be used once.`)}
    ${btn(magicLink, 'Sign In Securely →')}
    ${p(`If you didn't request this, you can safely ignore this email.`)}
  `)
}

function subscriptionHtml(firstName: string, planName: string, nextBillingDate: string) {
  return layout(`
    ${h1(`${firstName}, you're now on the ${planName} plan.`)}
    ${p(`Your subscription is active. Your next billing date is <strong style="color:#f59e0b;">${nextBillingDate}</strong>.`)}
    ${p(`All ${planName} features are now unlocked. Head to your dashboard to put them to work.`)}
    ${btn('https://beta.patriot-ops.com/dashboard', 'Go to Dashboard →')}
    ${p(`To manage or cancel your subscription, visit your account settings at any time.`)}
  `)
}

function onboardingCompleteHtml(firstName: string) {
  return layout(`
    ${h1(`Profile complete, ${firstName}.`)}
    ${p(`Your military profile is set up. We've analyzed your branch, MOS, and service dates to surface the benefits most likely to apply to you.`)}
    ${p(`Start with the VA Eligibility Checker to see what you qualify for — it takes about 3 minutes.`)}
    ${btn('https://beta.patriot-ops.com/dashboard', 'View My Benefits →')}
  `)
}
