import { PomodoroTimer } from "@/components/pomodoro-timer";
import { AssignmentManager } from "@/components/assignment-manager";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, Target, TrendingUp, LayoutDashboard, User } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-custom-light font-manrope">
      {/* Header */}
      <div className="bg-white border-b border-custom-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-custom-blue rounded-lg flex items-center justify-center mr-3">
                <LayoutDashboard className="w-5 h-5 text-custom-dark" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Svanik's Dashboard</h1>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-custom-medium rounded-full flex items-center justify-center mr-2">
                <User className="w-4 h-4 text-custom-dark" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Svanik</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 lg:text-3xl">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your focus sessions and assignments efficiently</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pomodoro Timer Section */}
          <div className="lg:col-span-1">
            <PomodoroTimer />
          </div>

          {/* Assignments Section */}
          <div className="lg:col-span-2">
            <AssignmentManager />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Card className="border border-custom-medium shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-custom-blue rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-custom-dark" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Focus Time</p>
                  <p className="text-lg font-semibold text-gray-900" data-testid="text-total-focus-time">
                    0h 0m
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-custom-medium shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-custom-blue rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-custom-dark" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
                  <p className="text-lg font-semibold text-gray-900" data-testid="text-completed-tasks">
                    0
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-custom-medium shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-custom-blue rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-custom-dark" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Weekly Goal</p>
                  <p className="text-lg font-semibold text-gray-900" data-testid="text-weekly-goal">
                    0%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-custom-medium shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-custom-blue rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-custom-dark" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Productivity</p>
                  <p className="text-lg font-semibold text-gray-900" data-testid="text-productivity">
                    0%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
