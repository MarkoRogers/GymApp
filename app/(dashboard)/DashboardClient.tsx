"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Calendar,
  Target,
  TrendingUp,
  Dumbbell,
  Trophy,
  Flame,
  Clock
} from "lucide-react";

interface DashboardClientProps {
  session: { user: { name?: string } };
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const stats = {
    workoutsThisWeek: 3,
    currentStreak: 5,
    totalWorkouts: 47,
    personalRecords: 8,
    weeklyGoal: 4,
    avgWorkoutTime: 45,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session.user.name?.split(" ")[0] || "Athlete"}!
          </h1>
          <p className="text-muted-foreground">
            Here's your fitness overview for today
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Flame className="h-3 w-3" />
          <span>{stats.currentStreak} day streak</span>
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats cards */}
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

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
              <Dumbbell className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Start Workout</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
              <TrendingUp className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Log Progress</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Plan Workout</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
              <Target className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Set Goal</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
