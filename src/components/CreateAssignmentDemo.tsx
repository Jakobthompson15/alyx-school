import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, Plus, Trash2, Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

interface CreateAssignmentDemoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSubject: string;
}

const SUBJECTS = ["Statistics", "Computer Science", "AP English", "Social Studies"];

interface Question {
  id: string;
  question: string;
  type: 'multiple_choice' | 'open_ended';
  points: number;
  options?: string[];
  correctAnswer: string;
}

export default function CreateAssignmentDemo({
  open,
  onOpenChange,
  defaultSubject
}: CreateAssignmentDemoProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [rubric, setRubric] = useState("");
  const [uploadedRubric, setUploadedRubric] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      question: "",
      type: 'multiple_choice',
      points: 10,
      options: ['', '', '', ''],
      correctAnswer: ""
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleRubricUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('text/')) {
        setUploadedRubric(file);
        toast.success(`Rubric file "${file.name}" uploaded successfully!`);
      } else {
        toast.error("Please upload a PDF or text file for the rubric.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || questions.length === 0) {
      toast.error("Please fill in all required fields and add at least one question");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(`Assignment "${title}" created successfully!`);
      toast.info("Demo: In full version, this would save to your Convex database and be available to students.");

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setRubric("");
      setUploadedRubric(null);
      setQuestions([]);
      setIsLoading(false);
      onOpenChange(false);
    }, 2000);
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
              <Label htmlFor="title">Assignment Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Probability Distributions Quiz"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subj) => (
                    <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what this assignment covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Rubric Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grading Rubric</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rubric">Rubric Text</Label>
                <Textarea
                  id="rubric"
                  placeholder="Enter your grading criteria and point breakdown..."
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Rubric File (Optional)</Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={handleRubricUpload}
                      className="hidden"
                    />
                    <Button variant="outline" type="button">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </label>
                  {uploadedRubric && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{uploadedRubric.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedRubric(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Supports PDF, TXT, DOC, DOCX files
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Questions Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Questions</CardTitle>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">
                    Total: {totalPoints} points
                  </Badge>
                  <Button onClick={addQuestion} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No questions added yet. Click "Add Question" to get started.
                </p>
              ) : (
                questions.map((question, index) => (
                  <Card key={question.id} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Question {index + 1}</h4>
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
                        <Label>Question Text *</Label>
                        <Textarea
                          placeholder="Enter your question..."
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <Select
                            value={question.type}
                            onValueChange={(value) => updateQuestion(question.id, 'type', value)}
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
                            onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 10)}
                          />
                        </div>
                      </div>

                      {question.type === 'multiple_choice' && (
                        <div className="space-y-2">
                          <Label>Answer Options</Label>
                          {question.options?.map((option, optIndex) => (
                            <Input
                              key={optIndex}
                              placeholder={`Option ${optIndex + 1}`}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(question.options || [])];
                                newOptions[optIndex] = e.target.value;
                                updateQuestion(question.id, 'options', newOptions);
                              }}
                            />
                          ))}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Correct Answer *</Label>
                        <Textarea
                          placeholder={question.type === 'multiple_choice'
                            ? "Enter the correct option (e.g., Option 1)"
                            : "Enter the ideal answer or key points..."}
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                          rows={question.type === 'open_ended' ? 3 : 1}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Assignment
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}