interface DigestData {
  newUsers: number;
  topProducts: { name: string; views: number }[];
  newWishlists: number;
  newContacts: number;
  date: string;
}

export function adminDailyDigestHtml(data: DigestData): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://delhishoepalace.com";

  const topProductsRows = data.topProducts
    .map(
      (p, i) =>
        `<tr>
          <td style="padding:8px 12px;font-size:13px;color:#F5F5F5;border-bottom:1px solid #2A2A2A;">${i + 1}. ${p.name}</td>
          <td style="padding:8px 12px;font-size:13px;color:#C9933A;font-family:'Courier New',monospace;text-align:right;border-bottom:1px solid #2A2A2A;">${p.views} views</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Inter', Arial, sans-serif; background: #0A0A0A; margin: 0; padding: 0; }
      .container { max-width: 560px; margin: 40px auto; background: #111; border-radius: 8px; overflow: hidden; border: 1px solid #2A2A2A; }
      .header { background: #0A0A0A; padding: 24px 32px; border-bottom: 1px solid #2A2A2A; }
      .header h1 { color: #F5F5F5; font-family: Georgia, serif; font-size: 18px; margin: 0 0 4px; }
      .header p { color: #6B6B6B; font-size: 12px; font-family: 'Courier New', monospace; margin: 0; }
      .stats { display: flex; padding: 24px 32px; gap: 16px; }
      .stat { flex: 1; background: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 8px; padding: 16px; text-align: center; }
      .stat-value { font-size: 28px; font-weight: 700; color: #C9933A; font-family: 'Courier New', monospace; }
      .stat-label { font-size: 10px; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }
      .body { padding: 0 32px 24px; }
      .section-title { font-size: 11px; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; margin-bottom: 12px; }
      .products-table { width: 100%; border-collapse: collapse; background: #1A1A1A; border-radius: 8px; overflow: hidden; }
      .cta { display: block; background: #C9933A; color: #0A0A0A !important; text-decoration: none; padding: 14px; border-radius: 6px; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; text-align: center; margin: 24px 32px; }
      .footer { padding: 16px 32px; border-top: 1px solid #2A2A2A; text-align: center; font-size: 11px; color: #4A4A4A; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Daily Summary</h1>
        <p>${data.date}</p>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 32px;">
        <tr>
          <td style="width:25%;text-align:center;background:#1A1A1A;border:1px solid #2A2A2A;border-radius:8px;padding:16px;">
            <div style="font-size:28px;font-weight:700;color:#C9933A;font-family:'Courier New',monospace;">${data.newUsers}</div>
            <div style="font-size:10px;color:#6B6B6B;text-transform:uppercase;letter-spacing:0.1em;margin-top:4px;">New Users</div>
          </td>
          <td style="width:8px;"></td>
          <td style="width:25%;text-align:center;background:#1A1A1A;border:1px solid #2A2A2A;border-radius:8px;padding:16px;">
            <div style="font-size:28px;font-weight:700;color:#C9933A;font-family:'Courier New',monospace;">${data.topProducts.reduce((a, b) => a + b.views, 0)}</div>
            <div style="font-size:10px;color:#6B6B6B;text-transform:uppercase;letter-spacing:0.1em;margin-top:4px;">Product Views</div>
          </td>
          <td style="width:8px;"></td>
          <td style="width:25%;text-align:center;background:#1A1A1A;border:1px solid #2A2A2A;border-radius:8px;padding:16px;">
            <div style="font-size:28px;font-weight:700;color:#C9933A;font-family:'Courier New',monospace;">${data.newWishlists}</div>
            <div style="font-size:10px;color:#6B6B6B;text-transform:uppercase;letter-spacing:0.1em;margin-top:4px;">Wishlists</div>
          </td>
          <td style="width:8px;"></td>
          <td style="width:25%;text-align:center;background:#1A1A1A;border:1px solid #2A2A2A;border-radius:8px;padding:16px;">
            <div style="font-size:28px;font-weight:700;color:#C9933A;font-family:'Courier New',monospace;">${data.newContacts}</div>
            <div style="font-size:10px;color:#6B6B6B;text-transform:uppercase;letter-spacing:0.1em;margin-top:4px;">Contacts</div>
          </td>
        </tr>
      </table>
      <div class="body">
        <div class="section-title">Top Products</div>
        <table class="products-table">
          ${topProductsRows || '<tr><td style="padding:12px;color:#6B6B6B;font-size:13px;">No product views recorded</td></tr>'}
        </table>
      </div>
      <a href="${siteUrl}/admin" class="cta">Manage Your Store →</a>
      <div class="footer">
        Delhi Shoe Palace — Admin Daily Digest
      </div>
    </div>
  </body>
</html>`;
}
