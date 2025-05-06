import { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CarePlanTemplateCard } from '@/components/care-plans/care-plan-template-card';
import { type CarePlanTemplate } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { motion } from 'framer-motion';

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Animation variants for each card
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

interface TemplateSelectorProps {
  templates: CarePlanTemplate[];
  onSelect?: (template: CarePlanTemplate) => void;
  onClose?: () => void;
  patientId: number;
}

export function TemplateSelector({ 
  templates, 
  onSelect, 
  onClose,
  patientId 
}: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Get unique categories from templates
  const categories = ['all', ...Array.from(new Set(templates.map(template => template.category)))];
  
  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Select Care Plan Template</h2>
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
        
        <TabsContent value={activeCategory} className="mt-0">
          {filteredTemplates.length > 0 ? (
            <ScrollArea className="h-[60vh] pr-4 -mr-4">
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredTemplates.map(template => (
                  <motion.div key={template.id} variants={cardVariants}>
                    <CarePlanTemplateCard
                      template={template}
                      onSelect={onSelect}
                      minimal={false}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </ScrollArea>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-center text-neutral-500 mb-4">No matching templates found.</p>
                <AnimatedButton 
                  variant="outline"
                  emotionalState="calm"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                >
                  Clear filters
                </AnimatedButton>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Create New Template</span>
        </Button>
      </div>
    </div>
  );
}
