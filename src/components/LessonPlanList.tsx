import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

interface LessonPlanListProps {
  subject: string;
}

export default function LessonPlanList({ subject }: LessonPlanListProps) {
  const lessonPlans = useQuery(api.lessonPlans.getByTeacher);
  const generateQuiz = useAction((api as any).lessonPlans_actions.generateQuizFromLessonPlan);
  const [generatingQuizzes, setGeneratingQuizzes] = useState<Set<string>>(new Set());

  const filteredPlans = lessonPlans?.filter(plan => plan.subject === subject) || [];

  const handleGenerateQuiz = async (lessonPlanId: string) => {
    setGeneratingQuizzes(prev => new Set([...prev, lessonPlanId]));
    
    try {
      const result = await generateQuiz({ lessonPlanId });
      
      if (result.success) {
        toast.success("Quiz generated successfully from lesson plan!");
      } else {
        toast.error(result.error || "Failed to generate quiz");
      }
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      toast.error("Failed to generate quiz");
    } finally {
      setGeneratingQuizzes(prev => {
        const newSet = new Set(prev);
        newSet.delete(lessonPlanId);
        return newSet;
      });
    }
  };

  if (!lessonPlans) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (filteredPlans.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No lesson plans created yet for {subject}.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredPlans.map((lessonPlan, index) => (
        <motion.div
          key={lessonPlan._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium truncate">{lessonPlan.title}</h4>
                    {lessonPlan.generatedQuizId && (
                      <Badge variant="default">Quiz Generated</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {lessonPlan.content.substring(0, 100)}...
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  {!lessonPlan.generatedQuizId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateQuiz(lessonPlan._id)}
                      disabled={generatingQuizzes.has(lessonPlan._id)}
                    >
                      {generatingQuizzes.has(lessonPlan._id) ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3 mr-1" />
                      )}
                      Generate Quiz
                    </Button>
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
