import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertAssignmentSchema, type InsertAssignment, type Assignment } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface EditAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: Assignment | null;
}

const statusOptions = [
  { value: "not-started", label: "Not Started" },
  { value: "in-progress", label: "In Progress" },
  { value: "in-review", label: "In Review" },
  { value: "completed", label: "Completed" },
];

export function EditAssignmentModal({ open, onOpenChange, assignment }: EditAssignmentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertAssignment>({
    resolver: zodResolver(insertAssignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      status: "not-started",
    },
  });

  // Reset form when assignment changes
  useEffect(() => {
    if (assignment && open) {
      form.reset({
        title: assignment.title,
        description: assignment.description || "",
        dueDate: assignment.dueDate,
        status: assignment.status,
      });
    }
  }, [assignment, open, form]);

  const updateAssignmentMutation = useMutation({
    mutationFn: async (data: InsertAssignment) => {
      if (!assignment) throw new Error("No assignment to update");
      const response = await apiRequest("PATCH", `/api/assignments/${assignment.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      toast({
        title: "Assignment updated",
        description: "Your assignment has been successfully updated.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update assignment. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update assignment:", error);
    },
  });

  const onSubmit = (data: InsertAssignment) => {
    updateAssignmentMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
            Edit Assignment
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0"
              data-testid="button-close-edit-modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter assignment title"
                      className="w-full"
                      data-testid="input-edit-title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Due Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="w-full"
                      data-testid="input-edit-due-date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Enter assignment description"
                      className="w-full"
                      data-testid="textarea-edit-description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium"
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateAssignmentMutation.isPending}
                className="px-4 py-2 text-sm font-medium bg-custom-blue text-custom-dark hover:bg-custom-medium"
                data-testid="button-save-edit"
              >
                {updateAssignmentMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}