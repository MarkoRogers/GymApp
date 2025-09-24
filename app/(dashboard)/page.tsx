import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  Activity,
  Calendar,
  Target,
  TrendingUp,
  Dumbbell,
  Trophy,
  Flame,
  Clock
} from 'lucide-react';

export default async function Dashboard() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  // Mock data for now - we'll replace this with real database queries later
  const stats = {
    workoutsThisWeek: 3,
    currentStreak: 5,
    totalWorkouts: 47,
    personalRecords: 8,
    weeklyGoal: 4,
    caloriesBurned: 1250,
    avgWorkoutTime: 45,
    activeDays: 12
  };

  const recentWorkouts = [
    { name: 'Push Day', date: '2 hours ago', duration: '42 min' },
    { name: 'Leg Day', date: 'Yesterday', duration: '38 min' },
    { name: 'Pull Day', date: '2 days ago', duration: '46 min' },
  ];

  const goals = [
    { title: 'Weekly Workouts', current: 3, target: 4, unit: 'workouts' },
    { title: 'Weight Goal', current: 165, target: 160, unit: 'lbs' },
    { title: 'Bench Press', current: 185, target: 200, unit: 'lbs' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session.user.name?.split(' ')[0] || 'Athlete'}!
          </h1>
          <p className="text-muted-foreground">
            Here's your fitness overview for today
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Flame className="h-3 w-3" />
            <span>{stats.currentStreak} day streak</span>
          </Badge>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.workoutsThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.weeklyGoal} workouts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">consecutive days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Records</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.personalRecords}</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Workout</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgWorkoutTime}m</div>
            <p className="text-xs text-muted-foreground">per session</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Workouts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Dumbbell className="h-5 w-5" />
              <span>Recent Workouts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentWorkouts.map((workout, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{workout.name}</h3>
                  <p className="text-sm text-muted-foreground">{workout.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{workout.duration}</Badge>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
            <div className="pt-2">
              <button className="text-sm text-primary hover:underline">
                View all workouts →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Goal Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal, index) => {
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-muted-foreground">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-2">
              <button className="text-sm text-primary hover:underline">
                Manage goals →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors">
              <Dumbbell className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Start Workout</span>
            </button>
            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors">
              <TrendingUp className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Log Progress</span>
            </button>
            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors">
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Plan Workout</span>
            </button>
            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors">
              <Target className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Set Goal</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
