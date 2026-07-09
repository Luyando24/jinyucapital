"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 text-2xl font-bold">Something went wrong</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        We had trouble loading this section. Please check your connection and try
        refreshing the page.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
