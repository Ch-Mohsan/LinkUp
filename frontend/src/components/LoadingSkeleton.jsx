const LoadingSkeleton = () => {
  return (
    <div className="card overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div>
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>

      {/* Image Skeleton */}
      <div className="w-full h-80 bg-gray-200 dark:bg-gray-700"></div>

      {/* Actions Skeleton */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>

        {/* Text Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Comment Input Skeleton */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSkeleton 