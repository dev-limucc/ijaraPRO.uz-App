'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

