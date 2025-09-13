import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Users, Play, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

interface AssignmentListProps {
  subject: string;
}

export default function AssignmentList({ subject }: AssignmentListProps) {
  const assignments = useQuery(api.assignments.getBySubject, { subject });
  const publishAssignment = useMutation(api.assignments.publish);
  const gradeSubmission = useAction(api.grading.gradeSubmission);
  const [gradingSubmissions, setGradingSubmissions] = useState<Set<string>>(new Set());

  const handlePublish = async (assignmentId: string) => {
    try {
      await publishAssignment({ assignmentId });
      toast.success("Assignment published successfully!");
    } catch (error) {
      console.error("Failed to publish assignment:", error);
      toast.error("Failed to publish assignment");
    }
  };

  const handleGradeAll = async (assignmentId: string) => {
    try {
      const submissions = await api.submissions.getByAssignment({ assignmentId });
      const ungraded = submissions?.filter(s => !s.isGraded) || [];
      
      if (ungraded.length === 0) {
        toast.info("No ungraded submissions found");
        return;
      }

      setGradingSubmissions(prev => new Set([...prev, assignmentId]));
      
      for (const submission of ungraded) {
        await gradeSubmission({ submissionId: submission._id });
      }
      
      toast.success(`Graded ${ungraded.length} submissions automatically!`);
    } catch (error) {
      console.error("Failed to grade submissions:", error);
      toast.error("Failed to grade submissions");
    } finally {
      setGradingSubmissions(prev => {
        const newSet = new Set(prev);
        newSet.delete(assignmentId);
        return newSet;
      });
    }
  };

  if (!assignments) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No assignments created yet for {subject}.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assignments.map((assignment, index) => (
        <motion.div
          key={assignment._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium truncate">{assignment.title}</h4>
                    <Badge variant={assignment.isPublished ? "default" : "secondary"}>
                      {assignment.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="outline">{assignment.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {assignment.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{assignment.questions.length} questions</span>
                    <span>{assignment.totalPoints} points</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  {!assignment.isPublished ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePublish(assignment._id)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Publish
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGradeAll(assignment._id)}
                        disabled={gradingSubmissions.has(assignment._id)}
                      >
                        {gradingSubmissions.has(assignment._id) ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Users className="h-3 w-3 mr-1" />
                        )}
                        Grade All
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
