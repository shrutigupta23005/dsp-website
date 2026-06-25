import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(15).optional(),
  subject: z.enum(
    ["General Inquiry", "Product Availability", "Bulk Order", "Feedback", "Other"],
    { message: "Please select a subject" }
  ),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: validated.error.errors[0]?.message || "Invalid form data",
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validated.data;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === "re_your-resend-api-key") {
      // In development without Resend, log and return success
      console.log("Contact form submission (Resend not configured):", {
        name,
        email,
        phone,
        subject,
        message,
      });
      return NextResponse.json({
        success: true,
        message: "Your message has been received. We will get back to you soon!",
      });
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Delhi Shoe Palace <noreply@delhishoepalace.com>",
      to: "contact@delhishoepalace.com",
      replyTo: email,
      subject: `[Website Contact] ${subject} — from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', Arial, sans-serif; background: #F5F2EE; margin: 0; padding: 0; }
              .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
              .header { background: #0A0A0A; padding: 24px 32px; }
              .header h1 { color: #C9933A; font-family: Georgia, serif; font-size: 20px; margin: 0; }
              .body { padding: 32px; color: #1A1A1A; line-height: 1.7; }
              .field { margin-bottom: 16px; }
              .label { font-size: 11px; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }
              .value { font-size: 15px; margin-top: 4px; }
              .message-box { background: #F5F2EE; border-radius: 6px; padding: 16px; margin-top: 16px; font-size: 14px; line-height: 1.7; white-space: pre-wrap; }
              .footer { padding: 16px 32px; border-top: 1px solid #E2DDD6; font-size: 11px; color: #6B6B6B; text-align: center; }
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
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value">${email}</div>
                </div>
                ${phone ? `<div class="field"><div class="label">Phone</div><div class="value">${phone}</div></div>` : ""}
                <div class="field">
                  <div class="label">Subject</div>
                  <div class="value">${subject}</div>
                </div>
                <div class="label">Message</div>
                <div class="message-box">${message}</div>
              </div>
              <div class="footer">
                Sent from Delhi Shoe Palace website contact form
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent! We will get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
