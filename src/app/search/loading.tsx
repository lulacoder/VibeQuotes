import { QuoteListSkeleton } from "@/components/ui/Skeleton";

export default function SearchLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Search Header Skeleton */}
      <div className="text-center mb-8">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 animate-pulse" />
        <div className="h-5 w-80 max-w-full bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-6 animate-pulse" />
        <div className="h-14 max-w-2xl mx-auto bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
      </div>

      {/* Results Skeleton */}
      <QuoteListSkeleton count={5} />
    </div>
  );
}
