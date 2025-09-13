import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, BookOpen, CheckCircle, Clock, Award, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const mockAssignments = [
  {
    id: 1,
    title: "Probability Distributions",
    subject: "Statistics",
    description: "Complete questions about normal and binomial distributions",
    questions: 8,
    points: 100,
    status: "available",
  },
  {
    id: 2,
    title: "Data Structures Quiz",
    subject: "Computer Science",
    description: "Arrays, linked lists, stacks, and queues fundamentals",
    questions: 12,
    points: 150,
    status: "completed",
    score: 142,
    percentage: 95,
  },
  {
    id: 3,
    title: "Shakespeare Analysis",
    subject: "AP English",
    description: "Analyze themes and literary devices in Hamlet Act 1",
    questions: 6,
    points: 80,
    status: "pending",
  },
  {
    id: 4,
    title: "World War I Timeline",
    subject: "Social Studies",
    description: "Major events and causes leading to WWI",
    questions: 10,
    points: 120,
    status: "available",
  },
];

export default function DemoStudent() {
  const navigate = useNavigate();

  const handleDemo = (action: string, assignment?: any) => {
    if (action === "Start Assignment" && assignment) {
      toast.success(`Starting "${assignment.title}"...`);
      toast.info("Demo: Full assignment interface would appear here!");
    } else if (action === "View Results" && assignment) {
      toast.success(`Viewing results for "${assignment.title}"`);
      toast.info(`Score: ${assignment.score}/${assignment.points} (${assignment.percentage}%)`);
    } else {
      toast.info(`Demo: ${action} functionality would work here with full backend!`);
    }
  };

  const availableCount = mockAssignments.filter(a => a.status === "available").length;
  const pendingCount = mockAssignments.filter(a => a.status === "pending").length;
  const completedCount = mockAssignments.filter(a => a.status === "completed").length;
  const avgScore = completedCount > 0 ?
    Math.round(mockAssignments
      .filter(a => a.status === "completed")
      .reduce((sum, a) => sum + (a.percentage || 0), 0) / completedCount) : 0;

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
                  const isCompleted = assignment.status === "completed";
                  const isPending = assignment.status === "pending";
                  const isAvailable = assignment.status === "available";

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
                          <span>{assignment.questions} questions</span>
                          <span>{assignment.points} points</span>
                          {isCompleted && assignment.score && (
                            <span className="text-green-600 font-medium">
                              Score: {assignment.score}/{assignment.points} ({assignment.percentage}%)
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
    </div>
  );
}