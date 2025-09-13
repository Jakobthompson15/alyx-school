import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { BookOpen, Users, Brain, Award, ArrowRight, Globe } from "lucide-react";

const languages = [
  { text: "Hello", lang: "English" },
  { text: "Hola", lang: "Spanish" },
  { text: "Bonjour", lang: "French" },
  { text: "Hallo", lang: "German" },
  { text: "Ciao", lang: "Italian" },
  { text: "こんにちは", lang: "Japanese" },
  { text: "안녕하세요", lang: "Korean" },
  { text: "你好", lang: "Chinese" },
];

export default function Landing() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="ALYX" className="h-8 w-8" />
              <h1 className="text-2xl font-bold tracking-tight">ALYX</h1>
            </div>
            <Button onClick={handleGetStarted} disabled={isLoading}>
              {isAuthenticated ? "Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            {/* Animated Hello Messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
                {languages.map((item, index) => (
                  <motion.div
                    key={item.lang}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm border"
                  >
                    <div className="text-2xl font-bold mb-1">{item.text}</div>
                    <div className="text-sm text-muted-foreground">{item.lang}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ALYX
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The intelligent school interface that connects teachers and students through 
                AI-powered assignments, automated grading, and seamless learning experiences.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Button size="lg" onClick={handleGetStarted} disabled={isLoading}>
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/auth")}>
                  <Globe className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold tracking-tight mb-4">
              Everything you need for modern education
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              ALYX brings together powerful tools for teachers and students in one seamless platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Smart Assignments",
                description: "Create multiple choice and open-ended assignments with AI-powered grading.",
                color: "blue",
              },
              {
                icon: Brain,
                title: "AI Grading",
                description: "Automated grading for all assignment types with detailed feedback.",
                color: "purple",
              },
              {
                icon: Users,
                title: "Multi-Subject",
                description: "Support for Statistics, Computer Science, AP English, and Social Studies.",
                color: "green",
              },
              {
                icon: Award,
                title: "Auto Quizzes",
                description: "Generate quizzes automatically from your lesson plans using AI.",
                color: "orange",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex p-3 rounded-lg mb-4 bg-${feature.color}-100`}>
                      <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                    </div>
                    <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-4xl font-bold tracking-tight">
              Ready to transform your classroom?
            </h3>
            <p className="text-xl text-muted-foreground">
              Join teachers and students already using ALYX to create better learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted} disabled={isLoading}>
                {isAuthenticated ? "Go to Dashboard" : "Start Teaching"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img src="/logo.svg" alt="ALYX" className="h-6 w-6" />
              <span className="font-bold">ALYX</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Powered by{" "}
              <a
                href="https://vly.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                vly.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}