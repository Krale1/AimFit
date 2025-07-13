export default function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="bg-surface p-8 rounded-lg border border-border shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-title">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-background p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-2 text-title">Workout Stats</h2>
            <p className="text-body">Track your fitness progress</p>
          </div>
          <div className="bg-background p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-2 text-title">Nutrition</h2>
            <p className="text-body">Monitor your daily nutrition</p>
          </div>
          <div className="bg-background p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-2 text-title">Goals</h2>
            <p className="text-body">Set and track your fitness goals</p>
          </div>
        </div>
      </div>
    </div>
  );
} 