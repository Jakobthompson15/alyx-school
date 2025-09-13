import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface AuthProps {
  redirectAfterAuth?: string;
}

export default function AuthPage({ redirectAfterAuth }: AuthProps = {}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const quickSignIn = async (role: "teacher" | "student") => {
    setIsLoading(true);

    // Simulate loading
    setTimeout(() => {
      toast.success(`Welcome, ${role === "teacher" ? "Demo Teacher" : "Demo Student"}!`);

      // Navigate to appropriate dashboard
      if (role === "teacher") {
        navigate("/demo-teacher");
      } else {
        navigate("/demo-student");
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex items-center justify-center h-full flex-col">
          <Card className="min-w-[350px] pb-0 border shadow-md">
            <CardHeader className="text-center">
              <div className="flex justify-center">
                <div
                  className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center mb-4 mt-4 cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  <span className="text-primary-foreground font-bold text-xl">A</span>
                </div>
              </div>
              <CardTitle className="text-xl">Choose your role</CardTitle>
              <CardDescription>
                Demo mode — no authentication required
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => quickSignIn("teacher")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Continuing...
                    </>
                  ) : (
                    "Continue as Teacher"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => quickSignIn("student")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Continuing...
                    </>
                  ) : (
                    "Continue as Student"
                  )}
                </Button>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Demo Features:</strong><br />
                  ✅ Modern Apple-style interface<br />
                  ✅ Role-based navigation<br />
                  ✅ Responsive design<br />
                  ⚠️ Backend functionality requires setup
                </p>
              </div>
            </CardContent>

            <div className="py-4 px-6 text-xs text-center text-muted-foreground bg-muted border-t rounded-b-lg">
              ALYX - AI-Powered Education Platform Demo
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}