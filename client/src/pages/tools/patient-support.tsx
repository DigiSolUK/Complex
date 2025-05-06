import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, SendHorizonal, User, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function PatientSupportTool() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your healthcare assistant. How can I help you today with your care plan, medication questions, or health concerns?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Sample responses for different types of questions
    const getResponse = (userQuery: string): string => {
      const query = userQuery.toLowerCase();
      
      if (query.includes('medication') || query.includes('pills') || query.includes('dose')) {
        return 'Your current medications should be taken as prescribed. For Metformin, take one 500mg tablet twice daily with meals. For potential side effects, monitor for stomach upset, diarrhea, or nausea, which typically improve over time. Always consult your doctor before making any changes to your medication regimen.';
      } 
      else if (query.includes('diet') || query.includes('food') || query.includes('eat')) {
        return 'Based on your care plan, we recommend a low glycemic index diet rich in vegetables, lean proteins, and whole grains. Try to limit processed foods and sugary drinks. Your nutritionist has suggested 5-6 small meals throughout the day rather than 3 large ones to help maintain stable blood sugar levels.';
      }
      else if (query.includes('appointment') || query.includes('visit') || query.includes('doctor')) {
        return 'Your next scheduled appointment is with Dr. Anderson on Tuesday, May 15th at 2:30 PM. Would you like me to send you a reminder 24 hours before?';
      }
      else if (query.includes('exercise') || query.includes('physical activity') || query.includes('workout')) {
        return 'Your care plan recommends 30 minutes of moderate physical activity at least 5 days a week. This could include walking, swimming, or cycling. Start slowly and gradually increase intensity. Remember to monitor your blood glucose before and after exercise.';
      }
      else {
        return 'Thank you for your question. Based on your care plan, I recommend discussing this with your healthcare provider during your next appointment. Would you like me to make a note of this question for your upcoming visit?';
      }
    };

    // Simulate API delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getResponse(input),
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/tools">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Patient Support Chatbot</h1>
      </div>

      <Card className="border rounded-lg">
        <CardHeader>
          <CardTitle>Healthcare Assistant</CardTitle>
          <CardDescription>
            Ask questions about your care plan, medications, or health concerns.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <div className="h-[500px] flex flex-col">
            <div className="flex-1 overflow-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className="flex max-w-[80%]">
                    {message.sender === 'assistant' && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage src="/images/assistant-avatar.png" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <MessageSquare className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`rounded-lg p-3 ${message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'}`}
                      >
                        {message.content}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <Avatar className="h-8 w-8 ml-2 mt-1">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <MessageSquare className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-3">
          <div className="flex w-full items-center space-x-2">
            <Textarea
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 max-h-[100px] min-h-[60px]"
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              disabled={!input.trim() || isLoading}
            >
              <SendHorizonal className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <div className="text-sm text-muted-foreground">
        <p>This AI assistant is designed to provide information and support based on your care plan. It is not a replacement for professional medical advice. Always consult with your healthcare provider for medical decisions.</p>
      </div>
    </div>
  );
}
