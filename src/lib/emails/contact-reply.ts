export function contactReplyHtml(name: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: 'Inter', Arial, sans-serif; background: #F5F2EE; margin: 0; padding: 0; }
      .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
      .header { background: #0A0A0A; padding: 32px; text-align: center; }
      .header h1 { color: #C9933A; font-family: Georgia, serif; font-size: 24px; margin: 0; letter-spacing: -0.02em; }
      .body { padding: 32px; color: #1A1A1A; line-height: 1.7; }
      .body p { margin: 0 0 16px; font-size: 15px; }
      .info-box { background: #F5F2EE; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .info-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; font-size: 14px; color: #1A1A1A; }
      .info-row:last-child { margin-bottom: 0; }
      .info-label { font-weight: 600; min-width: 80px; color: #6B6B6B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; }
      .whatsapp-btn { display: inline-block; background: #25D366; color: #fff !important; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 600; margin: 8px 0; }
      .footer { padding: 24px 32px; border-top: 1px solid #E2DDD6; font-size: 12px; color: #6B6B6B; text-align: center; line-height: 1.6; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Delhi Shoe Palace</h1>
      </div>
      <div class="body">
        <p>Hi ${name || "there"},</p>
        <p>Thank you for reaching out to us! We've received your message and our team will get back to you within <strong>24 hours</strong>.</p>
        <p>For a faster response, you can chat with us directly on WhatsApp:</p>
        <p><a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999"}" class="whatsapp-btn">Chat on WhatsApp</a></p>
        <div class="info-box">
          <div class="info-row">
            <span class="info-label">Address</span>
            <span>Delhi Shoe Palace, Karol Bagh, New Delhi — 110005</span>
          </div>
          <div class="info-row">
            <span class="info-label">Hours</span>
            <span>Mon–Sat: 10 AM – 9 PM · Sun: 11 AM – 7 PM</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone</span>
            <span>+91 99999 99999</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>You received this email because you contacted Delhi Shoe Palace through our website.</p>
        <p>Delhi Shoe Palace — 24 Years of Trust in Footwear</p>
      </div>
    </div>
  </body>
</html>`;
}
