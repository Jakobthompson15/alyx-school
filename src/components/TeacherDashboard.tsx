import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Plus, BookOpen, FileText, Users, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import CreateAssignmentDialog from "./CreateAssignmentDialog";
import CreateLessonPlanDialog from "./CreateLessonPlanDialog";
import AssignmentList from "./AssignmentList";
import LessonPlanList from "./LessonPlanList";
import { toast } from "sonner";

const SUBJECTS = ["Statistics", "Computer Science", "AP English", "Social Studies"];

export default function TeacherDashboard() {
  const { user, signOut } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showCreateLessonPlan, setShowCreateLessonPlan] = useState(false);

  const assignments = useQuery(api.assignments.getBySubject, { subject: selectedSubject });
  const lessonPlans = useQuery(api.lessonPlans.getByTeacher);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.svg" alt="ALYX" className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">ALYX</h1>
                <p className="text-sm text-muted-foreground">Teacher Portal</p>
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

      <div className="max-w-7xl mx-auto px-8 py-12">
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
                  <p className="text-2xl font-bold">{assignments?.length || 0}</p>
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
                  <p className="text-2xl font-bold">{lessonPlans?.length || 0}</p>
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
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Subjects</p>
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
                <Button onClick={() => setShowCreateLessonPlan(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Lesson Plan
                </Button>
                <Button onClick={() => setShowCreateAssignment(true)}>
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
                        <Badge variant="secondary">{assignments?.length || 0}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AssignmentList subject={subject} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Lesson Plans
                        <Badge variant="secondary">
                          {lessonPlans?.filter(lp => lp.subject === subject).length || 0}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LessonPlanList subject={subject} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>

      {/* Dialogs */}
      <CreateAssignmentDialog
        open={showCreateAssignment}
        onOpenChange={setShowCreateAssignment}
        defaultSubject={selectedSubject}
      />
      
      <CreateLessonPlanDialog
        open={showCreateLessonPlan}
        onOpenChange={setShowCreateLessonPlan}
        defaultSubject={selectedSubject}
      />
    </div>
  );
}
