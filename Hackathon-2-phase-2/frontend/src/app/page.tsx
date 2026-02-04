import { Button } from '@/components/ui/button';
import { ArrowRight, GraduationCap, Users, BookOpen, Award } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center animate-fade-in-up max-w-4xl mx-auto py-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent">
            EduTrack
          </span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          The all-in-one solution for managing students efficiently and effortlessly.
          Built with modern technology for a seamless experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/students">
            <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/students">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl">
              View Students
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose <span className="text-primary">EduTrack</span>?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Easy Management"
            description="Add, edit, and manage student records with just a few clicks. Simple and intuitive interface."
          />
          <FeatureCard
            icon={<BookOpen className="h-8 w-8" />}
            title="Organized Data"
            description="Keep all student information organized and easily accessible in one central location."
          />
          <FeatureCard
            icon={<Award className="h-8 w-8" />}
            title="Export & Reports"
            description="Export student data to Excel for reports and analysis with a single click."
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="100%" label="Free to Use" />
            <StatCard number="24/7" label="Available" />
            <StatCard number="Fast" label="Performance" />
            <StatCard number="Secure" label="Data Storage" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-8 rounded-2xl border bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
      <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
        <div className="text-primary">{icon}</div>
      </div>
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
