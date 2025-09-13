import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router";
import TeacherDashboard from "@/components/TeacherDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role === "teacher") {
    return <TeacherDashboard />;
  } else if (user.role === "student") {
    return <StudentDashboard />;
  }

  return <Navigate to="/auth" replace />;
}
