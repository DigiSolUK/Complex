import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'wouter';
import { BarChart2, Shield, BrainCircuit, MessageSquare, Zap, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  tags?: string[];
  status?: 'beta' | 'new' | 'stable';
}

const ToolCard = ({ title, description, icon, path, tags = [], status }: ToolCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          {status && (
            <Badge variant={status === 'new' ? 'default' : status === 'beta' ? 'secondary' : 'outline'}>
              {status.toUpperCase()}
            </Badge>
          )}
        </div>
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Badge key={i} variant="outline">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={path}>
          <Button className="w-full">
            Open Tool <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const AITools = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Tools</h1>
        <p className="text-muted-foreground">
          Advanced AI-powered tools to enhance care delivery and operational efficiency.
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ToolCard
          title="Clinical Support"
          description="AI-assisted diagnosis, treatment recommendations, and medical reference tools for healthcare professionals."
          icon={<BrainCircuit className="h-6 w-6" />}
          path="/tools/clinical-support"
          tags={['Diagnostics', 'Treatment', 'Reference']}
          status="new"
        />
        
        <ToolCard
          title="Patient Support"
          description="Compassionate AI chatbot for answering patient questions and providing support resources."
          icon={<MessageSquare className="h-6 w-6" />}
          path="/tools/patient-support"
          tags={['Patient Communication', 'Education', 'Support']}
          status="beta"
        />
        
        <ToolCard
          title="Analytics"
          description="Advanced analytics and insights to improve operational efficiency and care outcomes."
          icon={<BarChart2 className="h-6 w-6" />}
          path="/tools/analytics"
          tags={['Reports', 'Trends', 'Predictions']}
          status="stable"
        />
        
        <ToolCard
          title="Compliance Scanner"
          description="AI-powered compliance analysis tools to ensure adherence to healthcare regulations."
          icon={<Shield className="h-6 w-6" />}
          path="/tools/compliance"
          tags={['Regulations', 'Audit', 'Risk Management']}
          status="new"
        />
      </div>
    </div>
  );
};

export default AITools;
