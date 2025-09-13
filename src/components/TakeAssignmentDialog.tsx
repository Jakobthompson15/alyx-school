import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface TakeAssignmentDialogProps {
  assignment: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TakeAssignmentDialog({ 
  assignment, 
  open, 
  onOpenChange 
}: TakeAssignmentDialogProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submission = useQuery(api.submissions.getSubmission, {
    assignmentId: assignment._id,
  });
  
  const submitAssignment = useMutation(api.submissions.submit);

  const isCompleted = !!submission;
  const isGraded = submission?.isGraded;

  useEffect(() => {
    if (submission && submission.answers) {
      const submissionAnswers: Record<string, string> = {};
      submission.answers.forEach(answer => {
        submissionAnswers[answer.questionId] = answer.answer;
      });
      setAnswers(submissionAnswers);
    }
  }, [submission]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    // Validate all questions are answered
    const unanswered = assignment.questions.filter((q: any) => !answers[q.id]?.trim());
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions. ${unanswered.length} questions remaining.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionAnswers = assignment.questions.map((q: any) => ({
        questionId: q.id,
        answer: answers[q.id],
      }));

      await submitAssignment({
        assignmentId: assignment._id,
        answers: submissionAnswers,
      });

      toast.success("Assignment submitted successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit assignment:", error);
      toast.error("Failed to submit assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQuestionResult = (questionId: string) => {
    if (!submission || !submission.answers) return null;
    return submission.answers.find(a => a.questionId === questionId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{assignment.title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{assignment.subject}</Badge>
              {isCompleted && (
                <Badge variant={isGraded ? "default" : "secondary"}>
                  {isGraded ? "Graded" : "Submitted"}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{assignment.description}</p>
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
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {assignment.questions.map((question: any, index: number) => {
              const result = getQuestionResult(question.id);
              const isCorrect = result?.isCorrect;

              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={isGraded ? (isCorrect ? "border-green-200" : "border-red-200") : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">
                          Question {index + 1}
                          {isGraded && (
                            <span className="ml-2">
                              {isCorrect ? (
                                <CheckCircle className="inline h-4 w-4 text-green-600" />
                              ) : (
                                <Clock className="inline h-4 w-4 text-red-600" />
                              )}
                            </span>
                          )}
                        </CardTitle>
                        <Badge variant="outline">{question.points} pts</Badge>
                      </div>
                      <p className="text-sm">{question.question}</p>
                    </CardHeader>
                    <CardContent>
                      {question.type === "multiple_choice" ? (
                        <RadioGroup
                          value={answers[question.id] || ""}
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                          disabled={isCompleted}
                        >
                          {question.options?.map((option: string, optionIndex: number) => {
                            const optionLetter = String.fromCharCode(65 + optionIndex);
                            return (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <RadioGroupItem value={optionLetter} id={`${question.id}-${optionIndex}`} />
                                <Label htmlFor={`${question.id}-${optionIndex}`} className="flex-1">
                                  {optionLetter}. {option}
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      ) : (
                        <Textarea
                          value={answers[question.id] || ""}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          placeholder="Enter your answer..."
                          rows={4}
                          disabled={isCompleted}
                        />
                      )}

                      {isGraded && result && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Points: {result.points}/{question.points}
                            </span>
                            {result.isCorrect ? (
                              <Badge variant="default">Correct</Badge>
                            ) : (
                              <Badge variant="destructive">Incorrect</Badge>
                            )}
                          </div>
                          {result.feedback && (
                            <p className="text-sm text-muted-foreground">{result.feedback}</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isCompleted ? "Close" : "Cancel"}
          </Button>
          {!isCompleted && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Assignment"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
