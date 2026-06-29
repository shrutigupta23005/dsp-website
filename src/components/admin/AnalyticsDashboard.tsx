"use client";

import React, { useState } from "react";
import {
  Package,
  Users as UsersIcon,
  Heart,
  Eye,
  TrendingUp,
  Award,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import StatCard from "./StatCard";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn, formatPrice } from "@/lib/utils";

interface AnalyticsDashboardProps {
  data: any;
  isLoading: boolean;
  range: string;
  onRangeChange: (range: string) => void;
}

const CustomAreaTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-[#C9933A] p-2.5 rounded-lg text-white font-mono text-xs shadow-lg">
        <p className="font-sans font-semibold text-[#6B6B6B]">{payload[0].payload.date}</p>
        <p className="text-[#C9933A] mt-1">{`Signups: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-[#C9933A] p-2.5 rounded-lg text-white font-mono text-xs shadow-lg">
        <p className="font-sans font-semibold text-[#6B6B6B]">{payload[0].payload.date}</p>
        <p className="text-[#C9933A] mt-1">{`Saves: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const CustomViewsTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-[#C9933A] p-2.5 rounded-lg text-white font-mono text-xs shadow-lg">
        <p className="font-sans font-semibold text-xs text-[#F5F5F5] truncate max-w-[150px]">
          {payload[0].payload.name}
        </p>
        <p className="text-[#C9933A] mt-1">{`Views: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsDashboard({
  data,
  isLoading,
  range,
  onRangeChange,
}: AnalyticsDashboardProps) {
  // Sort State for Category Performance Table
  const [catSortField, setCatSortField] = useState<"productCount" | "totalViews">("totalViews");
  const [catSortOrder, setCatSortOrder] = useState<"asc" | "desc">("desc");

  const toggleSort = (field: "productCount" | "totalViews") => {
    if (catSortField === field) {
      setCatSortOrder(catSortOrder === "asc" ? "desc" : "asc");
    } else {
      setCatSortField(field);
      setCatSortOrder("desc");
    }
  };

  const getSortIcon = (field: "productCount" | "totalViews") => {
    if (catSortField !== field) return null;
    return catSortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center h-12">
          <div className="space-y-2">
            <div className="h-6 bg-[#1A1A1A] w-48 rounded animate-pulse" />
            <div className="h-4 bg-[#1A1A1A] w-32 rounded animate-pulse" />
          </div>
          <div className="h-9 bg-[#1A1A1A] w-64 rounded animate-pulse" />
        </div>

        {/* Row 1 KPI Skeletons */}
        <div className="grid gap-6 md:grid-cols-4">
          <div className="h-32 bg-[#1A1A1A] rounded-2xl animate-pulse" />
          <div className="h-32 bg-[#1A1A1A] rounded-2xl animate-pulse" />
          <div className="h-32 bg-[#1A1A1A] rounded-2xl animate-pulse" />
          <div className="h-32 bg-[#1A1A1A] rounded-2xl animate-pulse" />
        </div>

        {/* Row 2 Charts Skeletons */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-96 bg-[#1A1A1A] rounded-2xl animate-pulse lg:col-span-2" />
          <div className="h-96 bg-[#1A1A1A] rounded-2xl animate-pulse" />
        </div>

        {/* Row 3 Skeletons */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-80 bg-[#1A1A1A] rounded-2xl animate-pulse" />
          <div className="h-80 bg-[#1A1A1A] rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Extract variables
  const {
    userSignups,
    wishlistActivity,
    topProducts,
    topCategories,
    topBrands,
    statusBreakdown,
    totalStats,
  } = data;

  const totalProducts = totalStats.products;
  const totalUsers = totalStats.users;
  const totalWishlists = totalStats.wishlists;
  const avgProductPrice = totalStats.avgPrice;

  // Pie chart configuration
  const statusColors: Record<string, string> = {
    AVAILABLE: "#22C55E",
    NEW_ARRIVAL: "#3B82F6",
    TRENDING: "#C9933A",
    LIMITED: "#EF4444",
  };

  const statusPieData = statusBreakdown.map((item: any) => ({
    name: item.status.replace("_", " "),
    value: item.count,
    color: statusColors[item.status] || "#6B6B6B",
  }));

  // Max brand count (for proportional horizontal bars)
  const maxBrandCount = topBrands.length > 0 ? Math.max(...topBrands.map((b: any) => b.productCount)) : 1;

  // Sorted categories
  const sortedCategories = [...topCategories].sort((a: any, b: any) => {
    const valA = a[catSortField];
    const valB = b[catSortField];
    return catSortOrder === "asc" ? valA - valB : valB - valA;
  });

  return (
    <div className="space-y-6">
      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] font-sans">Analytics</h2>
          <span className="text-xs font-mono text-[#6B6B6B]">
            Real-time store performance and customer activity insights
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range select */}
          <div className="flex bg-[#141414] border border-[#242424] p-0.5 rounded-lg">
            {["7d", "30d", "90d"].map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={cn(
                  "px-3.5 h-7 rounded text-[11px] font-semibold font-mono uppercase transition-colors cursor-pointer",
                  range === r
                    ? "bg-[#C9933A] text-[#0F0F0F]"
                    : "text-[#6B6B6B] hover:text-[#F5F5F5]"
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <span className="text-[10px] font-mono text-[#3A3A3A] hidden sm:inline">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* ROW 1: KPI CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          description="Total active catalog items"
        />
        <StatCard
          title="Total Customers"
          value={totalUsers}
          icon={UsersIcon}
          description="Registered store members"
        />
        <StatCard
          title="Wishlist Saves"
          value={totalWishlists}
          icon={Heart}
          description="Total product saved actions"
        />
        <StatCard
          title="Avg Product Price"
          value={formatPrice(avgProductPrice)}
          icon={TrendingUp}
          description="Average price per footwear"
        />
      </div>

      {/* ROW 2: Main Charts (65% + 35% split) */}
      <div className="grid gap-6 lg:grid-cols-10">
        {/* Left: User Growth Area Chart */}
        <div className="lg:col-span-6 bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[#F5F5F5] font-sans">
              Customer Growth
            </h3>
            <span className="text-xs font-mono text-[#6B6B6B]">
              New customer sign-ups over selected period
            </span>
          </div>

          <div className="h-[280px] w-full mt-4">
            {userSignups.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={userSignups}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9933A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C9933A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#242424" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#6B6B6B"
                    fontSize={11}
                    fontFamily="var(--font-mono)"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6B6B6B"
                    fontSize={11}
                    fontFamily="var(--font-mono)"
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#C9933A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#areaGradient)"
                    dot={{ r: 3, stroke: "#C9933A", strokeWidth: 1, fill: "#0F0F0F" }}
                    activeDot={{ r: 5, fill: "#C9933A", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-[#242424] rounded-xl text-xs text-[#6B6B6B]">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Status Donut Chart */}
        <div className="lg:col-span-4 bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#F5F5F5] font-sans">
              Status Breakdown
            </h3>
            <span className="text-xs font-mono text-[#6B6B6B]">
              Share of product classifications
            </span>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusPieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Central Counter */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-mono text-[#F5F5F5]">
                {totalProducts}
              </span>
              <span className="text-[9px] text-[#6B6B6B] uppercase font-mono tracking-wider">
                Products
              </span>
            </div>
          </div>

          {/* Custom Legends list */}
          <div className="space-y-1.5 mt-2">
            {statusPieData.map((item: any, index: number) => {
              const pct =
                totalProducts > 0 ? ((item.value / totalProducts) * 100).toFixed(0) : "0";
              return (
                <div key={index} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[#6B6B6B]">{item.name}</span>
                  </div>
                  <span className="text-[#F5F5F5] font-bold">
                    {item.value} <span className="text-[10px] text-[#3A3A3A]">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ROW 3: Two charts (50%+50% split) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Wishlist Activity Bar Chart */}
        <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[#F5F5F5] font-sans">
              Wishlist Activity
            </h3>
            <span className="text-xs font-mono text-[#6B6B6B]">
              Footwear saves logs per day
            </span>
          </div>

          <div className="h-[220px] w-full">
            {wishlistActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={wishlistActivity}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#242424" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#6B6B6B"
                    fontSize={11}
                    fontFamily="var(--font-mono)"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6B6B6B"
                    fontSize={11}
                    fontFamily="var(--font-mono)"
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="count" fill="#C9933A" radius={[3, 3, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-[#242424] rounded-xl text-xs text-[#6B6B6B]">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Right: Top 10 Products by Views Horizontal Bar Chart */}
        <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[#F5F5F5] font-sans">
              Most Viewed Products
            </h3>
            <span className="text-xs font-mono text-[#6B6B6B]">
              Top 10 catalog items viewed (all-time)
            </span>
          </div>

          <div className="h-[220px] w-full overflow-y-auto custom-scrollbar">
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={topProducts}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: 15, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#242424" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#6B6B6B"
                    fontSize={10}
                    fontFamily="var(--font-mono)"
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#6B6B6B"
                    fontSize={9}
                    fontFamily="var(--font-sans)"
                    tickLine={false}
                    axisLine={false}
                    width={90}
                    tickFormatter={(val) => (val.length > 13 ? val.substring(0, 11) + "..." : val)}
                  />
                  <Tooltip content={<CustomViewsTooltip />} />
                  <Bar dataKey="viewCount" fill="#E5AC52" radius={[0, 3, 3, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-[#242424] rounded-xl text-xs text-[#6B6B6B]">
                No views recorded.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ROW 4: Tables Row (50% + 50%) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Top Brands */}
        <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6">
          <h3 className="text-base font-semibold text-[#F5F5F5] font-sans mb-3">
            Top Brands by Products
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] text-[#6B6B6B] font-mono uppercase tracking-wider">
                <tr>
                  <th className="p-3 w-16 text-center">Rank</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3 w-40">Products</th>
                  <th className="p-3 w-20 text-right">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]">
                {topBrands.slice(0, 5).map((brand: any, idx: number) => {
                  const proportionalWidth = (brand.productCount / maxBrandCount) * 100;
                  const isRankOne = idx === 0;

                  return (
                    <tr
                      key={brand.id}
                      className={cn(
                        "bg-[#141414] even:bg-[#161616] hover:bg-[#1E1A14]",
                        isRankOne && "bg-[#1E1A14]/40"
                      )}
                    >
                      <td className="p-3 text-center font-mono font-bold text-[#C9933A]">
                        {idx + 1}
                      </td>
                      <td className="p-3 font-sans font-medium text-[#F5F5F5]">
                        {brand.name}
                      </td>
                      <td className="p-3">
                        <div className="w-full bg-[#0F0F0F] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#C9933A] h-full"
                            style={{ width: `${proportionalWidth}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#C9933A]">
                        {brand.productCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Category Performance */}
        <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6">
          <h3 className="text-base font-semibold text-[#F5F5F5] font-sans mb-3">
            Category Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] text-[#6B6B6B] font-mono uppercase tracking-wider select-none">
                <tr>
                  <th className="p-3 w-16 text-center">Rank</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 w-24">Gender</th>
                  <th
                    className="p-3 text-right cursor-pointer hover:text-[#C9933A] transition-colors"
                    onClick={() => toggleSort("productCount")}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Products</span>
                      {getSortIcon("productCount")}
                    </div>
                  </th>
                  <th
                    className="p-3 text-right cursor-pointer hover:text-[#C9933A] transition-colors"
                    onClick={() => toggleSort("totalViews")}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Views</span>
                      {getSortIcon("totalViews")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]">
                {sortedCategories.slice(0, 5).map((cat: any, idx: number) => {
                  return (
                    <tr key={cat.id} className="bg-[#141414] even:bg-[#161616] hover:bg-[#1E1A14]">
                      <td className="p-3 text-center font-mono font-bold text-[#C9933A]">
                        {idx + 1}
                      </td>
                      <td className="p-3 font-sans font-medium text-[#F5F5F5]">
                        {cat.name}
                      </td>
                      <td className="p-3 font-mono">
                        <span className="text-[10px] border border-[#242424] bg-[#1A1A1A] text-[#6B6B6B] px-1.5 py-0.5 rounded">
                          {cat.gender}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-[#6B6B6B]">
                        {cat.productCount}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#C9933A]">
                        {cat.totalViews}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
