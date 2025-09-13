import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus, BookOpen, FileText, Users, BarChart3, Eye, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { mockAssignments, mockLessonPlans } from "@/data/mockData";
import CreateAssignmentDemo from "@/components/CreateAssignmentDemo";
import CreateLessonPlanDemo from "@/components/CreateLessonPlanDemo";
import { useState } from "react";

const SUBJECTS = ["Statistics", "Computer Science", "AP English", "Social Studies"];

export default function DemoTeacher() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showCreateLessonPlan, setShowCreateLessonPlan] = useState(false);

  const handleDemo = (action: string) => {
    if (action === "Create Assignment") {
      setShowCreateAssignment(true);
    } else if (action === "Create Lesson Plan") {
      setShowCreateLessonPlan(true);
    } else {
      toast.info(`Demo: ${action} functionality would work here with full backend!`);
    }
  };

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
                <p className="text-sm text-muted-foreground">Teacher Portal - Demo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">Demo Teacher</p>
                <p className="text-sm text-muted-foreground">teacher@demo.com</p>
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
            Welcome back, Demo Teacher
          </h2>
          <p className="text-muted-foreground">
            Manage your classes, create assignments, and track student progress.
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
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockAssignments.length}</p>
                  <p className="text-sm text-muted-foreground">Assignments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockLessonPlans.length}</p>
                  <p className="text-sm text-muted-foreground">Lesson Plans</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">124</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">AI</p>
                  <p className="text-sm text-muted-foreground">Grading</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subject Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={selectedSubject} onValueChange={setSelectedSubject}>
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-full max-w-2xl grid-cols-4">
                {SUBJECTS.map((subject) => (
                  <TabsTrigger key={subject} value={subject} className="text-sm">
                    {subject}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex gap-2">
                <Button onClick={() => handleDemo("Create Lesson Plan")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Lesson Plan
                </Button>
                <Button onClick={() => handleDemo("Create Assignment")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Assignment
                </Button>
              </div>
            </div>

            {SUBJECTS.map((subject) => (
              <TabsContent key={subject} value={subject} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Assignments
                        <Badge variant="secondary">
                          {mockAssignments.filter(a => a.subject === subject).length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockAssignments
                          .filter(assignment => assignment.subject === subject)
                          .map((assignment, index) => (
                            <motion.div
                              key={assignment.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:shadow-sm transition-all"
                            >
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{assignment.title}</h4>
                                  <Badge variant={assignment.published ? "default" : "secondary"}>
                                    {assignment.published ? "Published" : "Draft"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {assignment.questions.length} questions • {assignment.totalPoints} points
                                </p>
                              </div>
                              <Button size="sm" variant="outline" onClick={() => handleDemo("View Assignment")}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </motion.div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Lesson Plans
                        <Badge variant="secondary">
                          {mockLessonPlans.filter(lp => lp.subject === subject).length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockLessonPlans
                          .filter(plan => plan.subject === subject)
                          .map((plan, index) => (
                            <motion.div
                              key={plan.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:shadow-sm transition-all"
                            >
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{plan.title}</h4>
                                  {plan.hasQuiz && (
                                    <Badge variant="default">Quiz Generated</Badge>
                                  )}
                                  {plan.uploadedFile && (
                                    <Badge variant="outline">📄 PDF</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => handleDemo("View Lesson Plan")}>
                                  <FileText className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                {!plan.hasQuiz && (
                                  <Button size="sm" variant="outline" onClick={() => handleDemo("Generate Quiz")}>
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Generate Quiz
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>

      {/* Create Assignment Dialog */}
      <CreateAssignmentDemo
        open={showCreateAssignment}
        onOpenChange={setShowCreateAssignment}
        defaultSubject={selectedSubject}
      />

      {/* Create Lesson Plan Dialog */}
      <CreateLessonPlanDemo
        open={showCreateLessonPlan}
        onOpenChange={setShowCreateLessonPlan}
        defaultSubject={selectedSubject}
      />
    </div>
  );
}