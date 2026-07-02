export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://delhishoepalace.com",
    name: "Delhi Shoe Palace",
    description:
      "Delhi's most trusted footwear store since 2001. Premium brands for Men, Women & Kids.",
    url: "https://delhishoepalace.com",
    telephone: "+91-XXXXXXXXXX",
    email: "contact@delhishoepalace.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Karol Bagh",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      postalCode: "110005",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.6519,
      longitude: 77.1908,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "21:00",
      },
    ],
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    image: "https://delhishoepalace.com/opengraph-image",
    sameAs: [],
    foundingDate: "2001",
  };
}

export function generateProductSchema(product: {
  name: string;
  description?: string | null;
  price: number;
  slug: string;
  brand: { name: string };
  images: { url: string; alt?: string | null }[];
  status: string;
}) {
  const image = product.images[0];
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://delhishoepalace.com";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} at Delhi Shoe Palace`,
    image: image?.url,
    brand: {
      "@type": "Brand",
      name: product.brand.name,
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.status === "AVAILABLE"
          ? "https://schema.org/InStock"
          : product.status === "OUT_OF_STOCK"
            ? "https://schema.org/OutOfStock"
            : "https://schema.org/PreOrder",
      seller: {
        "@type": "Organization",
        name: "Delhi Shoe Palace",
      },
    },
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
