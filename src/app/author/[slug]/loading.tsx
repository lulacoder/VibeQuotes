import { AuthorCardSkeleton, QuoteListSkeleton } from "@/components/ui/Skeleton";

export default function AuthorLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Back Link Skeleton */}
      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
      
      {/* Author Card Skeleton */}
      <AuthorCardSkeleton />
      
      {/* Quotes Section */}
      <div className="mt-12">
        <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
        <QuoteListSkeleton count={3} />
      </div>
    </div>
  );
}
