export default function FiltersSkeleton() {
  return (
    <aside className="w-80 lg:w-64 bg-background border-r border-gray-300 p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    </aside>
  );
}
