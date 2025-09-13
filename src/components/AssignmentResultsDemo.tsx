import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, BookOpen, FileText, Clock } from "lucide-react";
import { MockSubmission, MockAssignment } from "@/data/mockData";

interface AssignmentResultsDemoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: MockAssignment | null;
  submission: MockSubmission | null;
}

export default function AssignmentResultsDemo({
  open,
  onOpenChange,
  assignment,
  submission
}: AssignmentResultsDemoProps) {
  if (!assignment || !submission) return null;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 65) return 'D';
    return 'F';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignment Results: {assignment.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <span className={getScoreColor(submission.percentage)}>
                      {submission.totalScore}/{submission.maxScore}
                    </span>
                    <Badge variant="outline" className={getScoreColor(submission.percentage)}>
                      {submission.percentage}% ({getGradeLetter(submission.percentage)})
                    </Badge>
                  </h3>
                  <p className="text-muted-foreground">Overall Score</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{assignment.subject}</Badge>
                </div>
              </div>

              <Progress
                value={submission.percentage}
                className="h-3 mb-4"
              />

              {/* Submission Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Submitted: {new Date(submission.submittedAt!).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Graded: {new Date(submission.gradedAt!).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{submission.answers.length} Questions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Teacher Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm leading-relaxed">{submission.feedback}</p>
              </div>
            </CardContent>
          </Card>

          {/* Question-by-Question Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {submission.answers.map((answer, index) => {
                const question = assignment.questions.find(q => q.id === answer.questionId);
                if (!question) return null;

                return (
                  <div key={answer.questionId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Question {index + 1}</span>
                          <Badge variant={answer.isCorrect ? "default" : "destructive"}>
                            {answer.points}/{answer.maxPoints} pts
                          </Badge>
                          {answer.isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : answer.points > 0 ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {question.question}
                        </p>
                      </div>
                    </div>

                    {/* Student Answer */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Your Answer:</h4>
                        <div className="p-3 bg-muted/30 rounded border-l-4 border-l-blue-500">
                          <p className="text-sm">{answer.answer}</p>
                        </div>
                      </div>

                      {/* Correct Answer (if wrong) */}
                      {!answer.isCorrect && (
                        <div>
                          <h4 className="font-medium text-sm mb-1">Correct Answer:</h4>
                          <div className="p-3 bg-green-50 rounded border-l-4 border-l-green-500">
                            <p className="text-sm">{question.correctAnswer}</p>
                          </div>
                        </div>
                      )}

                      {/* Feedback */}
                      <div>
                        <h4 className="font-medium text-sm mb-1">Feedback:</h4>
                        <div className={`p-3 rounded border-l-4 ${
                          answer.isCorrect
                            ? 'bg-green-50 border-l-green-500'
                            : answer.points > 0
                              ? 'bg-yellow-50 border-l-yellow-500'
                              : 'bg-red-50 border-l-red-500'
                        }`}>
                          <p className="text-sm">{answer.feedback}</p>
                        </div>
                      </div>

                      {/* Explanation (if available) */}
                      {question.explanation && (
                        <div>
                          <h4 className="font-medium text-sm mb-1">Explanation:</h4>
                          <div className="p-3 bg-blue-50 rounded border-l-4 border-l-blue-500">
                            <p className="text-sm">{question.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Rubric (if available) */}
          {assignment.rubric && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grading Rubric</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap font-sans">
                    {assignment.rubric}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => {
              // In real app, this would download or print results
              window.print();
            }}>
              Print Results
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}