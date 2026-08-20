"use client"

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

function MapLoading() {
  const t = useTranslations("common")
  return (
    <div className="flex h-[500px] items-center justify-center rounded-lg border border-border bg-muted" role="status">
      <p className="text-muted-foreground">{t("loadingMap")}</p>
    </div>
  )
}

// Dynamically import SingleSourceMap to avoid SSR window issues
const SingleSourceMap = dynamic(
  () => import("@/components/single-source-map").then((mod) => mod.SingleSourceMap),
  {
    ssr: false,
    loading: () => <MapLoading />,
  }
);

interface ClientMapWrapperProps {
  lat: number;
  lng: number;
  sourceName?: string | null;
  locationAddress?: string | null;
  height?: string;
}

export function ClientMapWrapper(props: ClientMapWrapperProps) {
  return (
    <Suspense fallback={<MapLoading />}>
      <SingleSourceMap {...props} />
    </Suspense>
  );
}
