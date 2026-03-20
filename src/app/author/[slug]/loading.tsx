import { QuoteListSkeleton } from "@/components/ui/Skeleton";

export default function AuthorLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] px-5 pt-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="shimmer h-4 w-28 rounded-lg mb-6" />
        <div className="shimmer h-48 rounded-2xl mb-8" />
        <div className="shimmer h-6 w-40 rounded-lg mb-5" />
        <QuoteListSkeleton count={4} />
      </div>
    </div>
  );
}
