interface ContactOwnerData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export function contactOwnerHtml(data: ContactOwnerData): string {
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Inter', Arial, sans-serif; background: #0A0A0A; margin: 0; padding: 0; }
      .container { max-width: 560px; margin: 40px auto; background: #1A1A1A; border-radius: 8px; overflow: hidden; border: 1px solid #2A2A2A; }
      .header { background: #111; padding: 24px 32px; border-bottom: 1px solid #2A2A2A; }
      .header h1 { color: #C9933A; font-family: Georgia, serif; font-size: 18px; margin: 0; }
      .body { padding: 32px; }
      .field { margin-bottom: 20px; }
      .label { font-size: 10px; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; font-family: 'Courier New', monospace; margin-bottom: 6px; }
      .value { font-size: 15px; color: #F5F5F5; line-height: 1.5; }
      .message-box { background: #111; border: 1px solid #2A2A2A; border-radius: 8px; padding: 16px; margin-top: 8px; font-size: 14px; line-height: 1.7; color: #E5E5E5; white-space: pre-wrap; }
      .reply-btn { display: inline-block; background: #C9933A; color: #0A0A0A !important; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-top: 24px; }
      .footer { padding: 16px 32px; border-top: 1px solid #2A2A2A; text-align: center; }
      .timestamp { font-size: 11px; color: #4A4A4A; font-family: 'Courier New', monospace; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Contact Form Submission</h1>
      </div>
      <div class="body">
        <div class="field">
          <div class="label">Name</div>
          <div class="value">${data.name}</div>
        </div>
        <div class="field">
          <div class="label">Email</div>
          <div class="value">${data.email}</div>
        </div>
        ${data.phone ? `<div class="field"><div class="label">Phone</div><div class="value">${data.phone}</div></div>` : ""}
        <div class="field">
          <div class="label">Subject</div>
          <div class="value">${data.subject}</div>
        </div>
        <div class="field">
          <div class="label">Message</div>
          <div class="message-box">${data.message}</div>
        </div>
        <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" class="reply-btn">Reply to ${data.name}</a>
      </div>
      <div class="footer">
        <span class="timestamp">${timestamp}</span>
      </div>
    </div>
  </body>
</html>`;
}
