import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const alt = "Product — Delhi Shoe Palace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      price: true,
      brand: { select: { name: true } },
      images: { take: 1, orderBy: { order: "asc" }, select: { url: true } },
    },
  });

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0A0A0A",
            color: "#C9933A",
            fontSize: 32,
          }}
        >
          Product Not Found
        </div>
      ),
      { ...size }
    );
  }

  const imageUrl = product.images[0]?.url;
  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0A0A0A",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #C9933A, #E5AC52, #C9933A)",
          }}
        />

        {/* Left: Product image */}
        {imageUrl && (
          <div
            style={{
              width: 400,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1A1A1A",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={product.name}
              width={350}
              height={350}
              style={{ objectFit: "contain" }}
            />
          </div>
        )}

        {/* Right: Product info */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 56px",
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "#C9933A",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 12,
            }}
          >
            {product.brand.name}
          </div>

          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#F5F5F5",
              lineHeight: 1.2,
              marginBottom: 24,
            }}
          >
            {product.name}
          </div>

          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#C9933A",
              marginBottom: 32,
            }}
          >
            {price}
          </div>

          {/* Divider */}
          <div
            style={{
              width: 64,
              height: 2,
              backgroundColor: "#C9933A",
              marginBottom: 24,
            }}
          />

          <div
            style={{
              fontSize: 16,
              color: "#6B6B6B",
            }}
          >
            Delhi Shoe Palace — 24 Years of Trust
          </div>
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 32,
            fontSize: 14,
            color: "#3A3A3A",
          }}
        >
          delhishoepalace.com
        </div>
      </div>
    ),
    { ...size }
  );
}
