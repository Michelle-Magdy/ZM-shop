export default function LoadingSpinner({ cssClass = "h-12 w-12" }) {
  return (
    <main className="min-h-screen p-4">
      <div className="flex justify-center items-center h-64">
        <div
          className={`animate-spin rounded-full ${cssClass}h-12 w-12 border-b-2 border-primary`}
        ></div>
      </div>
    </main>
  );
}
