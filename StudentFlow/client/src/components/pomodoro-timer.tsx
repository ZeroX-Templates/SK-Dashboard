import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

type TimerMode = "work" | "break";

interface TimerStats {
  sessionsCompleted: number;
  focusTime: number; // in minutes
  assignmentsDone: number;
}

export function PomodoroTimer() {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState<TimerMode>("work");
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [stats, setStats] = useState<TimerStats>(() => {
    const saved = localStorage.getItem("pomodoroStats");
    return saved ? JSON.parse(saved) : { sessionsCompleted: 0, focusTime: 0, assignmentsDone: 0 };
  });

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pomodoroStats", JSON.stringify(stats));
  }, [stats]);

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Timer completed
      setIsRunning(false);
      
      if (currentMode === "work") {
        setStats(prev => ({
          ...prev,
          sessionsCompleted: prev.sessionsCompleted + 1,
          focusTime: prev.focusTime + workDuration
        }));
        setCurrentMode("break");
        setTimeRemaining(breakDuration * 60);
      } else {
        setCurrentMode("work");
        setTimeRemaining(workDuration * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentMode, workDuration, breakDuration]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFocusTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleStart = useCallback(() => {
    setIsRunning(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(currentMode === "work" ? workDuration * 60 : breakDuration * 60);
  }, [currentMode, workDuration, breakDuration]);

  const handleWorkDurationChange = useCallback((value: string) => {
    const duration = parseInt(value);
    setWorkDuration(duration);
    if (currentMode === "work" && !isRunning) {
      setTimeRemaining(duration * 60);
    }
  }, [currentMode, isRunning]);

  const handleBreakDurationChange = useCallback((value: string) => {
    const duration = parseInt(value);
    setBreakDuration(duration);
    if (currentMode === "break" && !isRunning) {
      setTimeRemaining(duration * 60);
    }
  }, [currentMode, isRunning]);

  return (
    <div className="space-y-4">
      <Card className="border border-custom-medium shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-lg font-medium text-gray-900">
            Focus Timer
            <Timer className="w-5 h-5 text-custom-dark" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2" data-testid="timer-display">
              {formatTime(timeRemaining)}
            </div>
            <div 
              className="text-sm text-custom-dark bg-custom-blue px-3 py-1 rounded-full inline-block"
              data-testid="timer-mode"
            >
              {currentMode === "work" ? "Work Session" : "Break Time"}
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center space-x-2">
            <Button
              onClick={handleStart}
              disabled={isRunning}
              className="bg-custom-blue hover:bg-custom-medium text-custom-dark px-4 py-2 text-sm font-medium"
              data-testid="button-start"
            >
              <Play className="w-4 h-4 mr-1" />
              Start
            </Button>
            <Button
              onClick={handlePause}
              disabled={!isRunning}
              variant="outline"
              className="border-custom-medium hover:bg-gray-50 text-gray-700 px-4 py-2 text-sm font-medium"
              data-testid="button-pause"
            >
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-custom-medium hover:bg-gray-50 text-gray-700 px-4 py-2 text-sm font-medium"
              data-testid="button-reset"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>

          {/* Timer Settings */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Work Duration</span>
              <Select value={workDuration.toString()} onValueChange={handleWorkDurationChange}>
                <SelectTrigger className="w-24" data-testid="select-work-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Break Duration</span>
              <Select value={breakDuration.toString()} onValueChange={handleBreakDurationChange}>
                <SelectTrigger className="w-24" data-testid="select-break-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 min</SelectItem>
                  <SelectItem value="10">10 min</SelectItem>
                  <SelectItem value="15">15 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Stats */}
      <Card className="border border-custom-medium shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Today's Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sessions Completed</span>
              <span className="font-medium text-gray-900" data-testid="text-sessions">
                {stats.sessionsCompleted}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Focus Time</span>
              <span className="font-medium text-gray-900" data-testid="text-focus-time">
                {formatFocusTime(stats.focusTime)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Assignments Done</span>
              <span className="font-medium text-gray-900" data-testid="text-assignments-done">
                {stats.assignmentsDone}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
