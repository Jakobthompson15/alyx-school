import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CreateLessonPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSubject: string;
}

const SUBJECTS = ["Statistics", "Computer Science", "AP English", "Social Studies"];

export default function CreateLessonPlanDialog({ 
  open, 
  onOpenChange, 
  defaultSubject 
}: CreateLessonPlanDialogProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const createLessonPlan = useMutation(api.lessonPlans.create);
  const generateQuiz = useAction(api.lessonPlans.generateQuizFromLessonPlan);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const lessonPlanId = await createLessonPlan({
        title: title.trim(),
        subject,
        content: content.trim(),
      });

      toast.success("Lesson plan created successfully!");
      
      // Reset form
      setTitle("");
      setContent("");
      onOpenChange(false);

      return lessonPlanId;
    } catch (error) {
      console.error("Failed to create lesson plan:", error);
      toast.error("Failed to create lesson plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWithQuiz = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const lessonPlanId = await createLessonPlan({
        title: title.trim(),
        subject,
        content: content.trim(),
      });

      toast.success("Lesson plan created successfully!");

      // Generate quiz
      setIsGeneratingQuiz(true);
      const result = await generateQuiz({ lessonPlanId });
      
      if (result.success) {
        toast.success("Quiz generated automatically from lesson plan!");
      } else {
        toast.error("Lesson plan created, but quiz generation failed. You can try generating it later.");
      }

      // Reset form
      setTitle("");
      setContent("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create lesson plan:", error);
      toast.error("Failed to create lesson plan. Please try again.");
    } finally {
      setIsLoading(false);
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Lesson Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Lesson plan title"
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
            <Label htmlFor="content">Lesson Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your lesson plan content, objectives, activities, and key concepts..."
              rows={12}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Include learning objectives, key concepts, activities, and any important information. 
              This content will be used to generate quizzes automatically.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSubmit} 
              disabled={isLoading || isGeneratingQuiz}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Only
            </Button>
            <Button 
              onClick={handleCreateWithQuiz} 
              disabled={isLoading || isGeneratingQuiz}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGeneratingQuiz ? "Generating Quiz..." : "Save & Generate Quiz"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
