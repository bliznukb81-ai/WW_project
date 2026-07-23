export default function SkeletonCard() {
  return (
    <div className="w-full min-w-0 flex flex-col gap-2 animate-pulse">
      <div className="w-full aspect-[4/5] bg-gray-200 rounded-2xl shrink-0"></div>
      
      <div className="flex flex-col gap-1 mt-1">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-1"></div>
      </div>
    </div>
  );
}