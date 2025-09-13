import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, BookOpen, CheckCircle, Clock, Award, Play, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { mockAssignments, mockSubmissions, MockAssignment, MockSubmission } from "@/data/mockData";
import AssignmentResultsDemo from "@/components/AssignmentResultsDemo";
import { useState } from "react";


export default function DemoStudent() {
  const navigate = useNavigate();
  const [selectedAssignment, setSelectedAssignment] = useState<MockAssignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<MockSubmission | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleDemo = (action: string, assignment?: MockAssignment) => {
    if (action === "Start Assignment" && assignment) {
      toast.success(`Starting "${assignment.title}"...`);
      toast.info("Demo: Full assignment interface would appear here!");
    } else if (action === "View Results" && assignment) {
      const submission = mockSubmissions.find(s => s.assignmentId === assignment.id);
      if (submission) {
        setSelectedAssignment(assignment);
        setSelectedSubmission(submission);
        setShowResults(true);
      }
    } else {
      toast.info(`Demo: ${action} functionality would work here with full backend!`);
    }
  };

  const getAssignmentStatus = (assignment: MockAssignment) => {
    const submission = mockSubmissions.find(s => s.assignmentId === assignment.id);
    if (!submission) return 'available';
    return submission.status;
  };

  const getSubmissionData = (assignment: MockAssignment) => {
    return mockSubmissions.find(s => s.assignmentId === assignment.id);
  };

  const availableCount = mockAssignments.filter(a => getAssignmentStatus(a) === "available").length;
  const pendingCount = mockSubmissions.filter(s => s.status === "pending").length;
  const completedCount = mockSubmissions.filter(s => s.status === "completed").length;
  const avgScore = completedCount > 0 ?
    Math.round(mockSubmissions
      .filter(s => s.status === "completed")
      .reduce((sum, s) => sum + s.percentage, 0) / completedCount) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">ALYX</h1>
                <p className="text-sm text-muted-foreground">Student Portal - Demo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">Demo Student</p>
                <p className="text-sm text-muted-foreground">student@demo.com</p>
              </div>
              <Button variant="outline" onClick={() => navigate("/")}>
                <LogOut className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, Demo Student
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
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
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
                  <p className="text-2xl font-bold">{avgScore}%</p>
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
                {mockAssignments.map((assignment, index) => {
                  const status = getAssignmentStatus(assignment);
                  const submission = getSubmissionData(assignment);
                  const isCompleted = status === "completed";
                  const isPending = status === "pending";
                  const isAvailable = status === "available";

                  return (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-6 border border-border/50 rounded-lg hover:shadow-sm transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{assignment.title}</h3>
                          <Badge variant="outline">{assignment.subject}</Badge>
                          {isCompleted && (
                            <Badge variant="default">Graded</Badge>
                          )}
                          {isPending && (
                            <Badge variant="secondary">Submitted</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {assignment.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{assignment.questions.length} questions</span>
                          <span>{assignment.totalPoints} points</span>
                          {isCompleted && submission && (
                            <span className="text-green-600 font-medium">
                              Score: {submission.totalScore}/{submission.maxScore} ({submission.percentage}%)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAvailable && (
                          <Button onClick={() => handleDemo("Start Assignment", assignment)}>
                            <Play className="h-4 w-4 mr-2" />
                            Start Assignment
                          </Button>
                        )}
                        {isCompleted && (
                          <Button variant="outline" onClick={() => handleDemo("View Results", assignment)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Results
                          </Button>
                        )}
                        {isPending && (
                          <Button variant="outline" disabled>
                            Awaiting Grade
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Assignment Results Dialog */}
      <AssignmentResultsDemo
        open={showResults}
        onOpenChange={setShowResults}
        assignment={selectedAssignment}
        submission={selectedSubmission}
      />
    </div>
  );
}