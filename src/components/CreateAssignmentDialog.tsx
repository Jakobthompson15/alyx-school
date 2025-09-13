import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  type: "multiple_choice" | "open_ended";
  options?: string[];
  correctAnswer: string;
  points: number;
}

interface CreateAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSubject: string;
}

const SUBJECTS = ["Statistics", "Computer Science", "AP English", "Social Studies"];

export default function CreateAssignmentDialog({ 
  open, 
  onOpenChange, 
  defaultSubject 
}: CreateAssignmentDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createAssignment = useMutation(api.assignments.create);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      question: "",
      type: "multiple_choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 10,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || questions.length === 0) {
      toast.error("Please fill in all required fields and add at least one question");
      return;
    }

    // Validate questions
    for (const question of questions) {
      if (!question.question.trim() || !question.correctAnswer.trim()) {
        toast.error("Please complete all questions and provide correct answers");
        return;
      }
      if (question.type === "multiple_choice" && (!question.options || question.options.some(opt => !opt.trim()))) {
        toast.error("Please provide all multiple choice options");
        return;
      }
    }

    setIsLoading(true);
    try {
      await createAssignment({
        title: title.trim(),
        description: description.trim(),
        subject,
        type: "assignment",
        questions,
      });

      toast.success("Assignment created successfully!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setQuestions([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create assignment:", error);
      toast.error("Failed to create assignment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Assignment title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subj) => (
                    <SelectItem key={subj} value={subj}>
                      {subj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Assignment description and instructions"
              rows={3}
            />
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Questions</h3>
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  Total Points: {totalPoints}
                </Badge>
                <Button onClick={addQuestion} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </div>

            {questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Question {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                      placeholder="Enter your question"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={question.type}
                        onValueChange={(value: "multiple_choice" | "open_ended") => {
                          const updates: Partial<Question> = { type: value };
                          if (value === "open_ended") {
                            updates.options = undefined;
                          } else {
                            updates.options = ["", "", "", ""];
                          }
                          updateQuestion(question.id, updates);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="open_ended">Open Ended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Points</Label>
                      <Input
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      {question.type === "multiple_choice" ? (
                        <Select
                          value={question.correctAnswer}
                          onValueChange={(value) => updateQuestion(question.id, { correctAnswer: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="D">D</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Textarea
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                          placeholder="Expected answer or key points"
                          rows={2}
                        />
                      )}
                    </div>
                  </div>

                  {question.type === "multiple_choice" && question.options && (
                    <div className="space-y-2">
                      <Label>Options</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <span className="text-sm font-medium w-6">
                              {String.fromCharCode(65 + optionIndex)}:
                            </span>
                            <Input
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No questions added yet. Click "Add Question" to get started.
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Creating..." : "Create Assignment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
