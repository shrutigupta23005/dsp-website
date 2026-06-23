import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Delhi Shoe Palace and 24 years of trusted footwear retail in Delhi.",
};

const timeline = [
  ["2001", "Delhi Shoe Palace opens as a neighborhood footwear store built on trust and personal recommendations."],
  ["2010", "The store expands into a wider family catalog with daily wear, school shoes, formal footwear, and sports shoes."],
  ["2018", "Premium brand discovery becomes a core strength, helping customers compare global and Indian footwear labels."],
  ["2026", "The digital catalog brings the in-store browsing experience online while purchases stay personal through WhatsApp and store visits."],
];

export default function AboutPage() {
  return (
    <div className="bg-background-secondary pt-28">
      <section className="container-narrow section-pad text-center">
        <p className="eyebrow">Our Story</p>
        <h1 className="section-title mt-3">24 Years. Thousands of Pairs. One Promise.</h1>
        <span className="golden-rule mx-auto" />
        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-text-muted">
          Delhi Shoe Palace is a real Delhi footwear store shaped by everyday customers, school seasons, wedding rushes,
          office needs, and the simple belief that the right pair should feel good before it looks good.
        </p>
      </section>
      <section className="bg-background-primary py-20 text-white">
        <div className="container-wide grid gap-6 md:grid-cols-4">
          {[
            ["24", "Years"],
            ["5000+", "Customers"],
            ["200+", "Brands"],
            ["1", "Store"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-white/10 p-6 text-center">
              <p className="price text-4xl text-accent">{value}</p>
              <p className="mt-2 text-sm uppercase tracking-wider text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container-narrow section-pad">
        <p className="eyebrow">Timeline</p>
        <h2 className="section-title mt-3">Built One Customer At A Time</h2>
        <span className="golden-rule" />
        <div className="mt-12 space-y-6">
          {timeline.map(([year, text], index) => (
            <div key={year} className={`flex ${index % 2 ? "justify-end" : "justify-start"}`}>
              <div className="w-full rounded-lg border border-border bg-white p-6 shadow-sm md:w-[72%]">
                <p className="price text-2xl text-accent">{year}</p>
                <p className="mt-3 leading-7 text-text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
