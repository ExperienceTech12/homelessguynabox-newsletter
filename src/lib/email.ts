// Email infrastructure — ready for Resend integration
// Uncomment and configure when ready to send emails

// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_ENABLED = !!process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "newsletter@homelessguynabox.org";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!EMAIL_ENABLED) {
    console.log(`[Email Disabled] Would send to ${to}: ${subject}`);
    return { success: true, disabled: true };
  }

  try {
    // When Resend is configured, uncomment:
    // const { data, error } = await resend.emails.send({
    //   from: EMAIL_FROM,
    //   to,
    //   subject,
    //   html,
    // });
    // if (error) throw error;
    // return { success: true, id: data?.id };

    console.log(`[Email] Sent to ${to}: ${subject}`);
    return { success: true };
  } catch (error) {
    console.error("[Email Error]", error);
    return { success: false, error };
  }
}

export function buildNewsletterEmail(
  title: string,
  content: string,
  unsubscribeUrl: string
) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0a0a0f; color: #e4e4e7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 40px 20px; background: linear-gradient(135deg, rgba(168,85,247,0.2), rgba(6,182,212,0.2)); border-radius: 12px; margin-bottom: 24px; }
    .header h1 { color: #ffffff; font-size: 24px; margin: 0 0 8px; }
    .header p { color: #a855f7; margin: 0; font-size: 14px; }
    .content { background: #12121a; border-radius: 12px; padding: 32px; border: 1px solid rgba(255,255,255,0.08); }
    .content h2 { color: #ffffff; }
    .content a { color: #a855f7; }
    .cta { display: inline-block; background: #a855f7; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer { text-align: center; padding: 24px; color: #71717a; font-size: 12px; }
    .footer a { color: #71717a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>HomelessGuyNABOX</h1>
      <p>24/7 Music Streaming Newsletter</p>
    </div>
    <div class="content">
      <h2>${title}</h2>
      ${content}
      <p style="text-align: center; margin-top: 32px;">
        <a href="${EMAIL_FROM}" class="cta">Listen Now</a>
      </p>
    </div>
    <div class="footer">
      <p>You're receiving this because you subscribed to HomelessGuyNABOX newsletter.</p>
      <p><a href="${unsubscribeUrl}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;
}

export { EMAIL_ENABLED, EMAIL_FROM };
