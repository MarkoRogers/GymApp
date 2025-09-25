export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-6 p-6">
      <h1 className="text-3xl font-bold">Gym Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Workouts</h2>
          <p className="text-gray-600">Track your workout progress</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Progress</h2>
          <p className="text-gray-600">View your fitness journey</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Statistics</h2>
          <p className="text-gray-600">Analyze your performance</p>
        </div>
      </div>
    </div>
  );
}
