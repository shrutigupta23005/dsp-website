import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Delhi Shoe Palace <noreply@delhishoepalace.com>";

/**
 * Send a password reset email with a secure token link
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset Your Password — Delhi Shoe Palace",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: 'Inter', Arial, sans-serif;
              background-color: #F5F2EE;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 560px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0,0,0,0.06);
            }
            .header {
              background: #0A0A0A;
              padding: 32px;
              text-align: center;
            }
            .header h1 {
              color: #C9933A;
              font-family: Georgia, serif;
              font-size: 24px;
              margin: 0;
              letter-spacing: -0.02em;
            }
            .body {
              padding: 32px;
              color: #1A1A1A;
              line-height: 1.6;
            }
            .body p {
              margin: 0 0 16px;
              font-size: 15px;
            }
            .button {
              display: inline-block;
              background: #C9933A;
              color: #0A0A0A !important;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 600;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              margin: 8px 0 24px;
            }
            .footer {
              padding: 24px 32px;
              border-top: 1px solid #E2DDD6;
              font-size: 12px;
              color: #6B6B6B;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Delhi Shoe Palace</h1>
            </div>
            <div class="body">
              <p>You requested a password reset for your account.</p>
              <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
              <a href="${resetLink}" class="button">Reset Password</a>
              <p>If you didn't request this, you can safely ignore this email. Your password will not be changed.</p>
            </div>
            <div class="footer">
              <p>Delhi Shoe Palace, Karol Bagh, New Delhi, India</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

/**
 * Send a welcome email after signup
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to Delhi Shoe Palace",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: 'Inter', Arial, sans-serif;
              background-color: #F5F2EE;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 560px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0,0,0,0.06);
            }
            .header {
              background: #0A0A0A;
              padding: 32px;
              text-align: center;
            }
            .header h1 {
              color: #C9933A;
              font-family: Georgia, serif;
              font-size: 24px;
              margin: 0;
            }
            .body {
              padding: 32px;
              color: #1A1A1A;
              line-height: 1.6;
            }
            .body p {
              margin: 0 0 16px;
              font-size: 15px;
            }
            .button {
              display: inline-block;
              background: #C9933A;
              color: #0A0A0A !important;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 600;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              margin: 8px 0 24px;
            }
            .footer {
              padding: 24px 32px;
              border-top: 1px solid #E2DDD6;
              font-size: 12px;
              color: #6B6B6B;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Delhi Shoe Palace</h1>
            </div>
            <div class="body">
              <p>Hello ${name},</p>
              <p>Welcome to Delhi Shoe Palace! We're thrilled to have you join our community of footwear enthusiasts.</p>
              <p>With your account, you now have access to our full catalog, personalized recommendations, wishlists, and more.</p>
              <a href="${process.env.NEXTAUTH_URL}" class="button">Explore Collection</a>
              <p>For any inquiries, feel free to reach out on WhatsApp or visit our store in Karol Bagh, New Delhi.</p>
            </div>
            <div class="footer">
              <p>Delhi Shoe Palace — 24 Years of Trust</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
