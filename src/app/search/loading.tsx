import { QuoteListSkeleton } from "@/components/ui/Skeleton";

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] px-5 pt-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 space-y-3">
          <div className="shimmer h-10 w-72 rounded-lg" />
          <div className="shimmer h-5 w-96 max-w-full rounded-lg" />
        </div>
        <div className="shimmer h-32 rounded-2xl mb-6" />
        <QuoteListSkeleton count={4} />
      </div>
    </div>
  );
}
