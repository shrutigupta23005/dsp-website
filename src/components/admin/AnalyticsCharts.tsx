"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AnalyticsCharts({
  productViews,
  categoryCounts,
  wishlistAdds,
  signups,
}: {
  productViews: Array<{ name: string; views: number }>;
  categoryCounts: Array<{ name: string; products: number }>;
  wishlistAdds: Array<{ date: string; saves: number }>;
  signups: Array<{ date: string; users: number }>;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard title="Product View Leaders">
        <BarChart data={productViews}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" hide />
          <YAxis />
          <Tooltip />
          <Bar dataKey="views" fill="#C9933A" />
        </BarChart>
      </ChartCard>
      <ChartCard title="Top Categories By Product Count">
        <BarChart data={categoryCounts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="products" fill="#0A0A0A" />
        </BarChart>
      </ChartCard>
      <ChartCard title="Wishlist Adds Over Time">
        <LineChart data={wishlistAdds}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="saves" stroke="#C9933A" strokeWidth={2} />
        </LineChart>
      </ChartCard>
      <ChartCard title="User Signups Over Time">
        <LineChart data={signups}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#0A0A0A" strokeWidth={2} />
        </LineChart>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="rounded-lg border border-border bg-white p-6">
      <h2 className="mb-6 font-semibold text-text-primary">{title}</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
