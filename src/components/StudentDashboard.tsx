import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, BookOpen, CheckCircle, Clock, Award } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import TakeAssignmentDialog from "./TakeAssignmentDialog";

export default function StudentDashboard() {
  const { user, signOut } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  
  const assignments = useQuery(api.assignments.getPublished);
  const submissions = useQuery(api.submissions.getByStudent);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions?.find(s => s.assignmentId === assignmentId);
  };

  const completedCount = submissions?.filter(s => s.isGraded).length || 0;
  const pendingCount = submissions?.filter(s => !s.isGraded).length || 0;
  const availableCount = (assignments?.length || 0) - (submissions?.length || 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.svg" alt="ALYX" className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">ALYX</h1>
                <p className="text-sm text-muted-foreground">Student Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {user?.name?.split(' ')[0]}
          </h2>
          <p className="text-muted-foreground">
            Complete your assignments and track your progress.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{availableCount}</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedCount}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {submissions?.length ? 
                      Math.round((submissions.filter(s => s.isGraded && s.totalScore).reduce((sum, s) => sum + (s.totalScore! / s.maxScore), 0) / submissions.filter(s => s.isGraded).length) * 100) || 0
                      : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments?.map((assignment) => {
                  const submission = getSubmissionForAssignment(assignment._id);
                  const isCompleted = !!submission;
                  const isGraded = submission?.isGraded;

                  return (
                    <motion.div
                      key={assignment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{assignment.title}</h3>
                          <Badge variant="outline">{assignment.subject}</Badge>
                          {isCompleted && (
                            <Badge variant={isGraded ? "default" : "secondary"}>
                              {isGraded ? "Graded" : "Submitted"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {assignment.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{assignment.questions.length} questions</span>
                          <span>{assignment.totalPoints} points</span>
                          {isGraded && submission && (
                            <span className="text-green-600 font-medium">
                              Score: {submission.totalScore}/{submission.maxScore} 
                              ({Math.round((submission.totalScore! / submission.maxScore) * 100)}%)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isCompleted ? (
                          <Button onClick={() => setSelectedAssignment(assignment)}>
                            Start Assignment
                          </Button>
                        ) : isGraded ? (
                          <Button variant="outline" onClick={() => setSelectedAssignment(assignment)}>
                            View Results
                          </Button>
                        ) : (
                          <Button variant="outline" disabled>
                            Awaiting Grade
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {!assignments?.length && (
                  <div className="text-center py-8 text-muted-foreground">
                    No assignments available yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Take Assignment Dialog */}
      {selectedAssignment && (
        <TakeAssignmentDialog
          assignment={selectedAssignment}
          open={!!selectedAssignment}
          onOpenChange={(open) => !open && setSelectedAssignment(null)}
        />
      )}
    </div>
  );
}
