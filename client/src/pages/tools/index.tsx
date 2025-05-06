import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BriefcaseMedical, MessageCircle, BarChart2, Layers, Sparkles, Brain, AreaChart, ShieldCheck, FileText } from 'lucide-react';

interface AIToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  tags?: string[];
  isNew?: boolean;
}

const AIToolCard = ({ title, description, icon, path, tags = [], isNew = false }: AIToolCardProps) => (
  <Card className="overflow-hidden transition-all hover:shadow-md">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
        {isNew && (
          <Badge variant="default" className="bg-accent text-white">
            New
          </Badge>
        )}
      </div>
      <CardTitle className="mt-2">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="pb-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </CardContent>
    <CardFooter>
      <Link href={path}>
        <Button className="w-full">Open Tool</Button>
      </Link>
    </CardFooter>
  </Card>
);

export default function AIToolsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Tools</h1>
        <p className="text-muted-foreground">
          Enhance patient care and streamline operations with our suite of AI-powered healthcare tools.
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">AI Assistant</h2>
            <p className="max-w-2xl">
              Our AI assistant can help with patient queries, medical information, and care plan suggestions, powered by our advanced healthcare-specific models.
            </p>
          </div>
          <Button size="lg" className="whitespace-nowrap" onClick={() => alert('AI Assistant feature coming soon!')}>
            <Sparkles className="mr-2 h-4 w-4" />
            Try AI Assistant
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold tracking-tight">Available Tools</h2>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AIToolCard
          title="Clinical Decision Support"
          description="Get evidence-based suggestions for diagnosis and treatment plans based on patient data."
          icon={<BriefcaseMedical className="h-8 w-8 text-primary" />}
          path="/tools/clinical-support"
          tags={['Diagnosis', 'Treatment Plans', 'Evidence-based']}
        />
        
        <AIToolCard
          title="Patient Support Chatbot"
          description="AI-powered chatbot to assist patients with questions about their care plans and medications."
          icon={<MessageCircle className="h-8 w-8 text-primary" />}
          path="/tools/patient-support"
          tags={['Patient Engagement', 'Support', 'Q&A']}
        />
        
        <AIToolCard
          title="Predictive Analytics"
          description="Analyze patient data to predict health trends, risks, and outcomes for improved care."
          icon={<BarChart2 className="h-8 w-8 text-primary" />}
          path="/tools/analytics"
          tags={['Predictions', 'Data Analysis', 'Risk Assessment']}
          isNew={true}
        />
        
        <AIToolCard
          title="Compliance Analyzer"
          description="Ensure your documentation and processes meet healthcare regulations and standards."
          icon={<Layers className="h-8 w-8 text-primary" />}
          path="/tools/compliance"
          tags={['Regulations', 'Documentation', 'Audit']}
        />
        
        <AIToolCard
          title="Care Plan Generator"
          description="Generate personalized care plans based on patient history, conditions, and best practices."
          icon={<Brain className="h-8 w-8 text-primary" />}
          path="/tools/care-plan-generator"
          tags={['Personalization', 'Care Planning', 'Best Practices']}
          isNew={true}
        />
        
        <AIToolCard
          title="Health Trends Analysis"
          description="Identify and visualize health trends across your patient population for proactive care."
          icon={<AreaChart className="h-8 w-8 text-primary" />}
          path="/tools/health-trends"
          tags={['Population Health', 'Visualization', 'Proactive Care']}
        />
        
        <AIToolCard
          title="Privacy Compliance"
          description="Audit your systems and processes for GDPR, HIPAA, and other privacy regulation compliance."
          icon={<ShieldCheck className="h-8 w-8 text-primary" />}
          path="/tools/privacy-compliance"
          tags={['HIPAA', 'GDPR', 'Data Protection']}
        />
        
        <AIToolCard
          title="Medical Notes Summarizer"
          description="Automatically generate concise summaries from detailed medical notes and consultations."
          icon={<FileText className="h-8 w-8 text-primary" />}
          path="/tools/notes-summarizer"
          tags={['Summarization', 'Documentation', 'Efficiency']}
        />
      </div>

      <div className="bg-muted p-6 rounded-lg space-y-4 mt-8">
        <h3 className="text-xl font-semibold">Need a Custom AI Solution?</h3>
        <p>Our team can develop tailored AI tools to address your specific healthcare challenges.</p>
        <Button variant="outline" onClick={() => alert('Contact form will be added soon!')}>Contact Our AI Team</Button>
      </div>
    </div>
  );
}
