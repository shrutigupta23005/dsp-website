"use client";

import React from "react";
import Link from "next/link";
import {
  Package,
  Users as UsersIcon,
  Heart,
  Eye,
  PlusCircle,
  BarChart2,
  Tag,
  Award,
  ArrowRight,
} from "lucide-react";
import StatCard from "./StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn, getInitials } from "@/lib/utils";

interface DashboardClientProps {
  stats: {
    totalProducts: number;
    totalUsers: number;
    totalWishlists: number;
    totalViews: number;
    mostViewed: any[];
    mostWishlisted: any[];
    recentUsers: any[];
    productsByCategory: any[];
    newProductsThisWeek: number;
    newUsersThisWeek: number;
  };
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-[#C9933A] p-2.5 rounded-lg text-white font-mono text-xs shadow-lg">
        <p className="font-sans font-semibold text-[#F5F5F5]">{payload[0].payload.name}</p>
        <p className="text-[#C9933A] mt-1">{`Products: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardClient({ stats }: DashboardClientProps) {
  // Calculate relative time ago for recent users
  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* ROW 1: KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend={{
            value: stats.newProductsThisWeek,
            direction: "up",
            label: "new this week",
          }}
        />
        <StatCard
          title="Registered Users"
          value={stats.totalUsers}
          icon={UsersIcon}
          trend={{
            value: stats.newUsersThisWeek,
            direction: "up",
            label: "new this week",
          }}
        />
        <StatCard
          title="Total Wishlist Saves"
          value={stats.totalWishlists}
          icon={Heart}
          description="Across all store products"
        />
        <StatCard
          title="Total Product Views"
          value={stats.totalViews}
          icon={Eye}
          description="Cumulative views counter"
        />
      </div>

      {/* ROW 2: Charts Row */}
      <div className="grid gap-6 lg:grid-cols-10">
        {/* Left: Products by Category */}
        <div className="lg:col-span-6 bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F5] font-sans">
              Category Distribution
            </h2>
            <span className="text-xs font-mono text-[#6B6B6B]">
              Active products listed per category
            </span>
          </div>

          <div className="h-[260px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.productsByCategory}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9933A" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#8B6520" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#242424" vertical={false} />
                <XAxis
                  dataKey="name"
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
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1E1A14", opacity: 0.3 }} />
                <Bar
                  dataKey="count"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Top 5 Wishlist Leaderboard */}
        <div className="lg:col-span-4 bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 flex flex-col">
          <h2 className="text-base font-semibold text-[#F5F5F5] font-sans">
            Most Saved Products
          </h2>
          <span className="text-xs font-mono text-[#6B6B6B] mb-4">
            Wishlist leaderboard rankings
          </span>

          <div className="flex-1 flex flex-col justify-between divide-y divide-[#242424]">
            {stats.mostWishlisted.map((item, idx) => {
              const imgUrl = item.images?.[0]?.url ?? "/placeholder-shoe.jpg";
              const isRankOne = idx === 0;

              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 py-3 transition-colors",
                    isRankOne && "bg-[#1E1A14]/40 px-2 rounded-xl border border-[#C9933A]/10 -mx-2"
                  )}
                >
                  {/* Rank */}
                  <span className="font-mono font-bold text-lg text-[#C9933A] w-6 text-center">
                    {idx + 1}
                  </span>

                  {/* Thumbnail */}
                  <img
                    src={imgUrl}
                    alt={item.name}
                    className="w-11 h-11 rounded-lg object-cover bg-[#141414]"
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/products/${item.id}/edit`}
                      className="text-[13px] font-semibold text-[#F5F5F5] hover:text-[#C9933A] transition-colors truncate block font-sans"
                    >
                      {item.name}
                    </Link>
                    <span className="text-[11px] font-mono text-[#6B6B6B]">
                      {item.brand?.name || "Delhi Shoe Palace"}
                    </span>
                  </div>

                  {/* Saves Count */}
                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-[#C9933A]">
                      {item.wishlistCount}
                    </span>
                    <span className="text-[9px] font-mono text-[#6B6B6B] block uppercase">
                      Saves
                    </span>
                  </div>
                </div>
              );
            })}
            {stats.mostWishlisted.length === 0 && (
              <p className="text-xs text-[#6B6B6B] p-6 text-center">No wishlists yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* ROW 3: Three Equal Columns */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Col 1: Top 5 Most Viewed */}
        <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 flex flex-col">
          <h2 className="text-base font-semibold text-[#F5F5F5] font-sans">
            Top Viewed Products
          </h2>
          <span className="text-xs font-mono text-[#6B6B6B] mb-4">
            Most popular items in catalog
          </span>

          <div className="flex-1 flex flex-col justify-between divide-y divide-[#242424]">
            {stats.mostViewed.map((item, idx) => {
              const imgUrl = item.images?.[0]?.url ?? "/placeholder-shoe.jpg";

              return (
                <div key={item.id} className="flex items-center gap-3 py-2.5">
                  <span className="font-mono text-sm text-[#C9933A] w-5 text-center">
                    {idx + 1}
                  </span>
                  <img
                    src={imgUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover bg-[#141414]"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/products/${item.id}/edit`}
                      className="text-xs font-semibold text-[#F5F5F5] hover:text-[#C9933A] transition-colors truncate block font-sans"
                    >
                      {item.name}
                    </Link>
                    <span className="text-[10px] font-mono text-[#6B6B6B]">
                      {item.brand?.name || "Delhi Shoe Palace"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#C9933A]">
                      {item.viewCount}
                    </span>
                    <span className="text-[9px] font-mono text-[#6B6B6B] block uppercase">
                      Views
                    </span>
                  </div>
                </div>
              );
            })}
            {stats.mostViewed.length === 0 && (
              <p className="text-xs text-[#6B6B6B] p-6 text-center">No views recorded.</p>
            )}
          </div>
        </div>

        {/* Col 2: Recent Users */}
        <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F5] font-sans">
              New Members
            </h2>
            <span className="text-xs font-mono text-[#6B6B6B] mb-4 block">
              Recent user registrations
            </span>

            <div className="space-y-4 divide-y divide-[#242424]/50">
              {stats.recentUsers.map((u, idx) => (
                <div
                  key={u.id}
                  className={cn("flex items-center gap-3", idx > 0 && "pt-3")}
                >
                  <div className="w-8 h-8 rounded-full bg-[#C9933A] text-[#0F0F0F] flex items-center justify-center font-sans font-medium text-xs">
                    {getInitials(u.name || "User")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#F5F5F5] truncate block font-sans">
                      {u.name || "Customer"}
                    </span>
                    <span className="text-[10px] font-mono text-[#6B6B6B] truncate block">
                      {u.email}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6B6B6B]">
                    {formatTimeAgo(u.createdAt)}
                  </span>
                </div>
              ))}
              {stats.recentUsers.length === 0 && (
                <p className="text-xs text-[#6B6B6B] p-6 text-center">No recent signups.</p>
              )}
            </div>
          </div>

          <Link href="/admin/users" className="block mt-4">
            <button className="w-full flex items-center justify-center gap-1.5 h-9 border border-[#C9933A] text-[#C9933A] hover:bg-[#C9933A] hover:text-[#0F0F0F] transition-all duration-200 text-xs font-semibold rounded-lg cursor-pointer">
              View All Users
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* Col 3: Quick Actions */}
        <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 flex flex-col">
          <h2 className="text-base font-semibold text-[#F5F5F5] font-sans">
            Quick Actions
          </h2>
          <span className="text-xs font-mono text-[#6B6B6B] mb-4">
            Dashboard management shortcuts
          </span>

          <div className="flex-1 grid grid-cols-2 gap-3">
            <Link
              href="/admin/products/new"
              className="bg-[#141414] border border-[#242424] hover:border-[#C9933A] hover:bg-[#1E1A14] p-4 rounded-xl flex flex-col justify-between transition-all group cursor-pointer"
            >
              <PlusCircle className="w-6 h-6 text-[#C9933A] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-[#F5F5F5] font-sans block mt-2">
                Add Product
              </span>
            </Link>
            <Link
              href="/admin/brands"
              className="bg-[#141414] border border-[#242424] hover:border-[#C9933A] hover:bg-[#1E1A14] p-4 rounded-xl flex flex-col justify-between transition-all group cursor-pointer"
            >
              <Award className="w-6 h-6 text-[#C9933A] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-[#F5F5F5] font-sans block mt-2">
                Add Brand
              </span>
            </Link>
            <Link
              href="/admin/categories"
              className="bg-[#141414] border border-[#242424] hover:border-[#C9933A] hover:bg-[#1E1A14] p-4 rounded-xl flex flex-col justify-between transition-all group cursor-pointer"
            >
              <Tag className="w-6 h-6 text-[#C9933A] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-[#F5F5F5] font-sans block mt-2">
                Add Category
              </span>
            </Link>
            <Link
              href="/admin/analytics"
              className="bg-[#141414] border border-[#242424] hover:border-[#C9933A] hover:bg-[#1E1A14] p-4 rounded-xl flex flex-col justify-between transition-all group cursor-pointer"
            >
              <BarChart2 className="w-6 h-6 text-[#C9933A] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-[#F5F5F5] font-sans block mt-2">
                View Analytics
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
