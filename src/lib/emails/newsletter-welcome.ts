export function newsletterWelcomeHtml(
  name: string,
  email: string,
  unsubscribeToken: string
): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://delhishoepalace.com";
  const unsubLink = `${siteUrl}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: 'Inter', Arial, sans-serif; background: #F5F2EE; margin: 0; padding: 0; }
      .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
      .header { background: #0A0A0A; padding: 40px 32px; text-align: center; }
      .header h1 { color: #C9933A; font-family: Georgia, serif; font-size: 24px; margin: 0 0 8px; letter-spacing: -0.02em; }
      .header p { color: #6B6B6B; font-size: 13px; margin: 0; }
      .body { padding: 32px; color: #1A1A1A; line-height: 1.7; }
      .body p { margin: 0 0 16px; font-size: 15px; }
      .highlight { background: linear-gradient(135deg, #C9933A 0%, #E5AC52 100%); color: #0A0A0A !important; padding: 24px; border-radius: 8px; text-align: center; margin: 24px 0; }
      .highlight h2 { margin: 0 0 8px; font-size: 18px; font-weight: 700; }
      .highlight p { margin: 0; font-size: 14px; color: #1A1A1A !important; }
      .cta-btn { display: inline-block; background: #C9933A; color: #0A0A0A !important; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 14px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin: 8px 0 24px; }
      .footer { padding: 24px 32px; border-top: 1px solid #E2DDD6; font-size: 12px; color: #6B6B6B; text-align: center; line-height: 1.6; }
      .footer a { color: #C9933A; text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Delhi Shoe Palace</h1>
        <p>Welcome to the family!</p>
      </div>
      <div class="body">
        <p>Hi ${name || "there"},</p>
        <p>Welcome to the Delhi Shoe Palace newsletter! You're now part of an exclusive community of footwear enthusiasts.</p>
        <div class="highlight">
          <h2>🎉 You're In!</h2>
          <p>Be the first to know about new arrivals, exclusive offers, and seasonal collections.</p>
        </div>
        <p>Here's what you can expect:</p>
        <p>✨ <strong>New Arrivals</strong> — Fresh styles as they land in store<br>
        🏷️ <strong>Exclusive Offers</strong> — Subscriber-only deals<br>
        👟 <strong>Style Tips</strong> — Expert advice on finding your perfect pair</p>
        <p style="text-align: center;">
          <a href="${siteUrl}/products" class="cta-btn">Explore Collection</a>
        </p>
      </div>
      <div class="footer">
        <p>You subscribed with ${email}</p>
        <p>Don't want these emails? <a href="${unsubLink}">Unsubscribe</a></p>
        <p>Delhi Shoe Palace, Karol Bagh, New Delhi — 110005</p>
      </div>
    </div>
  </body>
</html>`;
}
