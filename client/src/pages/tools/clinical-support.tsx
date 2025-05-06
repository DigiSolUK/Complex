import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ArrowLeft, BriefcaseMedical, CheckCircle, Pill, Stethoscope } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SuggestionCardProps {
  title: string;
  content: string;
  type: 'diagnosis' | 'treatment' | 'medication';
  confidence?: number;
  source?: string;
}

const SuggestionCard = ({ title, content, type, confidence = 0.9, source = 'AI Clinical Support Model' }: SuggestionCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'diagnosis':
        return <Stethoscope className="h-5 w-5 text-primary" />;
      case 'treatment':
        return <BriefcaseMedical className="h-5 w-5 text-primary" />;
      case 'medication':
        return <Pill className="h-5 w-5 text-primary" />;
      default:
        return <CheckCircle className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="text-sm text-muted-foreground">
            {Math.round(confidence * 100)}% confidence
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">{content}</p>
          {source && (
            <p className="text-xs text-muted-foreground">
              Source: {source}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ClinicalSupportTool() {
  const [patientData, setPatientData] = useState('');
  const [currentTab, setCurrentTab] = useState('symptoms');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<null | {
    diagnoses: SuggestionCardProps[];
    treatments: SuggestionCardProps[];
    medications: SuggestionCardProps[];
  }>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientData.trim()) {
      alert('Please enter patient symptoms or medical history first');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to AI service
    setTimeout(() => {
      // Example response
      setResults({
        diagnoses: [
          {
            title: 'Type 2 Diabetes Mellitus',
            content: 'Patient symptoms and history suggest uncontrolled Type 2 Diabetes. Key indicators include polydipsia, polyuria, weight loss, and fatigue. Consider HbA1c testing for confirmation.',
            type: 'diagnosis',
            confidence: 0.89,
            source: 'NHS Clinical Guidelines 2025'
          },
          {
            title: 'Diabetic Neuropathy',
            content: 'Secondary concern: Peripheral neuropathy as complication of diabetes. Symptoms of numbness and tingling in extremities indicate early stages.',
            type: 'diagnosis',
            confidence: 0.76,
            source: 'International Diabetes Federation'
          }
        ],
        treatments: [
          {
            title: 'Dietary Modifications',
            content: 'Low glycemic index diet with reduced carbohydrate intake. Recommend consultation with dietitian for personalized meal planning.',
            type: 'treatment',
            confidence: 0.94,
            source: 'NICE Guidelines 2025'
          },
          {
            title: 'Regular Physical Activity',
            content: '150 minutes of moderate-intensity activity weekly. Start with walking 30 minutes daily and gradually increase intensity.',
            type: 'treatment',
            confidence: 0.92,
            source: 'UK Physical Activity Guidelines'
          }
        ],
        medications: [
          {
            title: 'Metformin',
            content: 'Starting dose: 500mg twice daily with meals, increasing to 850mg twice daily after 1 week if tolerated. Monitor kidney function.',
            type: 'medication',
            confidence: 0.88,
            source: 'British National Formulary'
          },
          {
            title: 'Empagliflozin',
            content: '10mg once daily in the morning. Recent studies show cardioprotective benefits for diabetic patients.',
            type: 'medication',
            confidence: 0.72,
            source: 'European Medicines Agency'
          }
        ]
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/tools">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Clinical Decision Support</h1>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="symptoms">Patient Symptoms</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="labs">Lab Results</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="symptoms" className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enter Patient Symptoms</CardTitle>
                <CardDescription>
                  Describe the patient's current symptoms, duration, and severity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="symptoms-description">Symptoms Description</Label>
                    <Textarea
                      id="symptoms-description"
                      placeholder="e.g., Patient presents with increased thirst, frequent urination, unexplained weight loss, and fatigue for the past 3 months..."
                      value={patientData}
                      onChange={(e) => setPatientData(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Patient Age</Label>
                      <Input id="age" placeholder="e.g., 45" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sex">Biological Sex</Label>
                      <Input id="sex" placeholder="e.g., Female" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="ml-auto">
                  {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
                </Button>
              </CardFooter>
            </Card>
          </form>

          {results && (
            <div className="space-y-6">
              <Separator />
              
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h2 className="text-lg font-semibold flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  Analysis Complete
                </h2>
                <p className="text-sm text-muted-foreground">
                  Based on the provided information, we've generated potential diagnoses, treatment options, and medication recommendations.
                  These suggestions are AI-generated and should be reviewed by a qualified healthcare professional.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Potential Diagnoses</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.diagnoses.map((diagnosis, index) => (
                    <SuggestionCard key={index} {...diagnosis} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recommended Treatments</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.treatments.map((treatment, index) => (
                    <SuggestionCard key={index} {...treatment} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Medication Recommendations</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.medications.map((medication, index) => (
                    <SuggestionCard key={index} {...medication} />
                  ))}
                </div>
              </div>

              <Alert variant="destructive" className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important Disclaimer</AlertTitle>
                <AlertDescription>
                  This AI-generated clinical decision support is intended as a supplementary tool only. All suggestions should be critically evaluated by a qualified healthcare professional. Final diagnosis and treatment decisions remain the responsibility of the clinician.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Patient Medical History</CardTitle>
              <CardDescription>
                Enter relevant medical history, including past diagnoses, surgeries, and family history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Patient has a history of hypertension diagnosed 3 years ago..."
                className="min-h-[200px]"
              />
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Analyze History</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="labs">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Results</CardTitle>
              <CardDescription>
                Enter recent lab test results and biomarkers for analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., CBC results: WBC 7.5, RBC 4.2..."
                className="min-h-[200px]"
              />
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Analyze Lab Results</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
