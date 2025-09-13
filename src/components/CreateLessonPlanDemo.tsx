import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload, FileText, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CreateLessonPlanDemoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSubject: string;
}

const SUBJECTS = ["Statistics", "Computer Science", "AP English", "Social Studies"];

export default function CreateLessonPlanDemo({
  open,
  onOpenChange,
  defaultSubject
}: CreateLessonPlanDemoProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [content, setContent] = useState("");
  const [objectives, setObjectives] = useState("");
  const [materials, setMaterials] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generateQuizAfter, setGenerateQuizAfter] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' ||
          file.type.startsWith('text/') ||
          file.type.includes('document') ||
          file.type.includes('word')) {
        setUploadedFile(file);

        // Simulate extracting content from PDF
        if (file.type === 'application/pdf') {
          toast.success(`PDF "${file.name}" uploaded successfully!`);
          toast.info("Demo: Extracting text content from PDF...");

          // Simulate PDF text extraction
          setTimeout(() => {
            const sampleContent = `Lesson Plan: ${title || file.name.replace('.pdf', '')}

Objectives:
- Students will understand key concepts
- Apply knowledge through practical examples
- Demonstrate mastery through assessment

Content Overview:
This lesson covers fundamental principles and provides hands-on learning opportunities. Students will engage with interactive materials and collaborative exercises.

Activities:
1. Introduction and review of previous concepts
2. New material presentation with examples
3. Guided practice exercises
4. Independent work time
5. Assessment and wrap-up

Materials Needed:
- Textbook chapters 5-7
- Handout worksheets
- Calculator (if applicable)
- Interactive whiteboard access

Assessment:
Students will be evaluated through participation, completion of practice problems, and a short quiz at the end of the lesson.`;

            setContent(sampleContent);
            setObjectives("Students will understand key concepts and apply knowledge through practical examples");
            setMaterials("Textbook, worksheets, calculator, interactive whiteboard");
            toast.success("Content extracted from PDF successfully!");
          }, 2000);
        } else {
          toast.success(`File "${file.name}" uploaded successfully!`);
        }
      } else {
        toast.error("Please upload a PDF, Word document, or text file.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a lesson plan title");
      return;
    }

    if (!content.trim() && !uploadedFile) {
      toast.error("Please provide lesson content or upload a file");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(`Lesson plan "${title}" created successfully!`);

      if (generateQuizAfter) {
        toast.info("Demo: Generating quiz from lesson plan content with AI...");
        setTimeout(() => {
          toast.success("AI-generated quiz created and added to assignments!");
        }, 3000);
      }

      // Reset form
      setTitle("");
      setContent("");
      setObjectives("");
      setMaterials("");
      setUploadedFile(null);
      setGenerateQuizAfter(false);
      setIsLoading(false);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Lesson Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to Statistics"
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

          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Lesson Plan File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload PDF or Document</Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button variant="outline" type="button">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </label>
                  {uploadedFile && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{uploadedFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round(uploadedFile.size / 1024)} KB)
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedFile(null);
                          setContent("");
                          setObjectives("");
                          setMaterials("");
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Supports PDF, Word documents, and text files. Content will be automatically extracted.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <div className="space-y-2">
            <Label htmlFor="objectives">Learning Objectives</Label>
            <Textarea
              id="objectives"
              placeholder="What will students learn or be able to do after this lesson?"
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              rows={3}
            />
          </div>

          {/* Lesson Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Lesson Content {!uploadedFile && "*"}</Label>
            <Textarea
              id="content"
              placeholder={uploadedFile ? "Content will be extracted from uploaded file..." : "Enter your lesson plan content, activities, and instructions..."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              disabled={!!uploadedFile && content.includes("Lesson Plan:")} // Disable if content was extracted
            />
            {uploadedFile && content.includes("Lesson Plan:") && (
              <p className="text-xs text-green-600">✓ Content extracted from uploaded file</p>
            )}
          </div>

          {/* Materials Needed */}
          <div className="space-y-2">
            <Label htmlFor="materials">Materials Needed</Label>
            <Textarea
              id="materials"
              placeholder="List any materials, resources, or equipment needed for this lesson..."
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              rows={2}
            />
          </div>

          {/* AI Quiz Generation Option */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI Quiz Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={generateQuizAfter}
                  onChange={(e) => setGenerateQuizAfter(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  Automatically generate a quiz from this lesson plan using AI after saving
                </span>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                AI will analyze your lesson content and create relevant questions for student assessment.
              </p>
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
                  {generateQuizAfter ? "Creating & Generating Quiz..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Lesson Plan
                  {generateQuizAfter && <Sparkles className="h-4 w-4 ml-2 text-purple-400" />}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}