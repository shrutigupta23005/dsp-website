"use client";

import React, { useState } from "react";
import useSWR from "swr";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AnalyticsPage() {
  const [range, setRange] = useState("30d");
  const { data, isValidating } = useSWR(
    `/api/admin/analytics?range=${range}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  return (
    <AnalyticsDashboard
      data={data}
      isLoading={isValidating || !data}
      range={range}
      onRangeChange={setRange}
    />
  );
}
