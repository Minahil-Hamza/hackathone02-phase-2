"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckSquare,
  Shield,
  Zap,
  BarChart3,
  Clock,
  Target,
  Sparkles,
  ListTodo,
  Calendar,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl translate-y-1/2" />

        <div className="relative text-center animate-fade-in-up max-w-5xl mx-auto py-20 md:py-32 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            Smart Task Management Made Simple
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Organize Your Life{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent">
              Effortlessly
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            TaskFlow helps you manage tasks with priorities, categories, and due dates.
            Stay focused, get organized, and accomplish more every day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-10 py-7 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all font-semibold">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signup">
                  <Button size="lg" className="text-lg px-10 py-7 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all font-semibold">
                    Start Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl font-semibold">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* App Preview / Features Grid */}
      <div className="w-full max-w-6xl mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-primary">Stay Productive</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you manage tasks efficiently and never miss a deadline.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<ListTodo className="h-7 w-7" />}
            title="Smart Task Management"
            description="Create, organize, and track tasks with a clean, intuitive interface. Mark complete with a single click."
          />
          <FeatureCard
            icon={<Target className="h-7 w-7" />}
            title="Priority Levels"
            description="Set priorities from low to urgent. Focus on what matters most and never lose track of critical tasks."
          />
          <FeatureCard
            icon={<Tag className="h-7 w-7" />}
            title="Categories"
            description="Organize tasks by category - work, personal, health, finance, education, and more."
          />
          <FeatureCard
            icon={<Calendar className="h-7 w-7" />}
            title="Due Dates"
            description="Set due dates for your tasks and stay on top of deadlines. Never miss an important date again."
          />
          <FeatureCard
            icon={<Shield className="h-7 w-7" />}
            title="Secure Authentication"
            description="JWT-based sign in and sign up. Your data is private and protected with industry-standard security."
          />
          <FeatureCard
            icon={<BarChart3 className="h-7 w-7" />}
            title="Task Statistics"
            description="Track your progress with real-time stats. See completed, pending, and total tasks at a glance."
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="w-full bg-gradient-to-b from-transparent via-primary/5 to-transparent py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started in{" "}
              <span className="text-primary">3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step="01"
              title="Create Account"
              description="Sign up in seconds with just your email and password. No credit card required."
            />
            <StepCard
              step="02"
              title="Add Your Tasks"
              description="Create tasks with titles, descriptions, priorities, categories, and due dates."
            />
            <StepCard
              step="03"
              title="Stay Organized"
              description="Track progress, filter tasks, and mark them complete as you crush your goals."
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="100%" label="Free Forever" />
            <StatCard number="24/7" label="Always Available" />
            <StatCard number="Fast" label="Instant Sync" />
            <StatCard number="Secure" label="JWT Protected" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-20 px-4">
        <div className="max-w-4xl mx-auto text-center rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 p-12 md:p-16">
          <Zap className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join TaskFlow today and start managing your tasks the smart way.
            Free forever, no strings attached.
          </p>
          {!isAuthenticated && (
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-10 py-7 rounded-2xl shadow-lg shadow-primary/25 font-semibold">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-8 rounded-2xl border bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
      <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-8">
      <div className="text-6xl font-black text-primary/20 mb-4">{step}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="p-6">
      <div className="text-4xl font-bold text-primary mb-2">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}
