"use client";

export function useFilters(basePath = "/products") {
  function href(filters: Record<string, string>, updates: Record<string, string | null>) {
    const params = new URLSearchParams(filters);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  return { href };
}
