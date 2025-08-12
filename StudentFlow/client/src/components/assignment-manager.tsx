import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Assignment } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { AddAssignmentModal } from "./add-assignment-modal";
import { EditAssignmentModal } from "./edit-assignment-modal";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, Edit3, Trash2, CheckCircle } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  "not-started": { label: "Not Started", className: "bg-gray-100 text-gray-700" },
  "in-progress": { label: "In Progress", className: "bg-blue-100 text-blue-700" },
  "in-review": { label: "In Review", className: "bg-yellow-100 text-yellow-700" },
  "completed": { label: "Completed", className: "bg-green-100 text-green-700" },
};

export function AssignmentManager() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assignments = [], isLoading } = useQuery<Assignment[]>({
    queryKey: ["/api/assignments"],
  });

  const deleteAssignmentMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/assignments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      toast({
        title: "Assignment deleted",
        description: "The assignment has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete assignment. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to delete assignment:", error);
    },
  });

  const markAsCompletedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("PATCH", `/api/assignments/${id}`, { status: "completed" });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      toast({
        title: "Assignment completed",
        description: "The assignment has been marked as completed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark assignment as completed. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to mark assignment as completed:", error);
    },
  });

  const handleDeleteAssignment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      deleteAssignmentMutation.mutate(id);
    }
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsEditModalOpen(true);
  };

  const handleMarkAsCompleted = (id: string) => {
    markAsCompletedMutation.mutate(id);
  };

  const formatDueDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const getDueDateBadge = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) {
      return { label: "Overdue", className: "bg-red-100 text-red-700" };
    } else if (diffDays <= 1) {
      return { label: "Due Soon", className: "bg-red-100 text-red-700" };
    } else if (diffDays <= 7) {
      return { label: "This Week", className: "bg-yellow-100 text-yellow-700" };
    } else if (diffDays <= 14) {
      return { label: "Next Week", className: "bg-gray-100 text-gray-700" };
    } else {
      return null;
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-custom-medium shadow-sm">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading assignments...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border border-custom-medium shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-900">Assignments</span>
              <Badge 
                variant="secondary" 
                className="ml-2 bg-custom-blue text-custom-dark"
                data-testid="text-assignment-count"
              >
                {assignments.length}
              </Badge>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-custom-blue hover:bg-custom-medium text-custom-dark px-3 py-2 text-sm font-medium"
              data-testid="button-add-assignment"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Assignment
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {assignments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-sm">No assignments yet. Create your first assignment to get started.</div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {assignments.map((assignment) => {
                const statusInfo = statusConfig[assignment.status as keyof typeof statusConfig];
                const dueDateBadge = getDueDateBadge(assignment.dueDate);

                return (
                  <div 
                    key={assignment.id} 
                    className="p-4 hover:bg-gray-50 transition-colors"
                    data-testid={`card-assignment-${assignment.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-2 flex-wrap gap-2">
                          <h3 
                            className="text-sm font-medium text-gray-900 truncate"
                            data-testid={`text-title-${assignment.id}`}
                          >
                            {assignment.title}
                          </h3>
                          {dueDateBadge && (
                            <Badge 
                              className={`text-xs px-2 py-1 ${dueDateBadge.className}`}
                              data-testid={`badge-due-${assignment.id}`}
                            >
                              {dueDateBadge.label}
                            </Badge>
                          )}
                        </div>
                        {assignment.description && (
                          <p 
                            className="text-sm text-gray-600 mb-2"
                            data-testid={`text-description-${assignment.id}`}
                          >
                            {assignment.description}
                          </p>
                        )}
                        <div className="flex items-center text-xs text-gray-500 flex-wrap gap-2">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span data-testid={`text-due-date-${assignment.id}`}>
                              {formatDueDate(assignment.dueDate)}
                            </span>
                          </div>
                          <span>•</span>
                          <Badge 
                            className={`${statusInfo.className} text-xs`}
                            data-testid={`badge-status-${assignment.id}`}
                          >
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        {assignment.status !== "completed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsCompleted(assignment.id)}
                            disabled={markAsCompletedMutation.isPending}
                            className="p-1 text-gray-400 hover:text-green-600 h-8 w-8"
                            data-testid={`button-complete-${assignment.id}`}
                            title="Mark as completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAssignment(assignment)}
                          className="p-1 text-gray-400 hover:text-gray-600 h-8 w-8"
                          data-testid={`button-edit-${assignment.id}`}
                          title="Edit assignment"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          disabled={deleteAssignmentMutation.isPending}
                          className="p-1 text-gray-400 hover:text-red-600 h-8 w-8"
                          data-testid={`button-delete-${assignment.id}`}
                          title="Delete assignment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddAssignmentModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />

      <EditAssignmentModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        assignment={selectedAssignment}
      />
    </>
  );
}
