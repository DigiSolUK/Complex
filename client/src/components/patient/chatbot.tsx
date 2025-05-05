import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id?: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  patientId: number;
  patientName?: string;
}

export function PatientChatbot({ patientId, patientName = 'Patient' }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await apiRequest('GET', `/api/patient-chatbot/history/${patientId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch chat history');
        }
        
        const data = await response.json();
        
        // Transform the history data into our message format
        if (data.success && Array.isArray(data.history)) {
          const formattedMessages = data.history.map((entry: any) => ([
            {
              id: entry.id,
              content: entry.patientMessage,
              sender: 'user',
              timestamp: new Date(entry.timestamp)
            },
            {
              id: entry.id,
              content: entry.aiResponse,
              sender: 'bot',
              timestamp: new Date(entry.timestamp)
            }
          ])).flat();
          
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        toast({
          title: 'Error',
          description: 'Failed to load chat history',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchChatHistory();
  }, [patientId, toast]);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Add initial bot welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0 && !isLoadingHistory) {
      setMessages([
        {
          content: `Hello ${patientName}, I'm your healthcare assistant. How can I help you today?`,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length, isLoadingHistory, patientName]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      content: inputMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to API
      const response = await apiRequest('POST', '/api/patient-chatbot/chat', {
        patientId,
        message: inputMessage
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      // Add bot response to chat
      setMessages(prev => [
        ...prev, 
        {
          content: data.response || "I'm sorry, I couldn't process your request right now.",
          sender: 'bot' as const,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response',
        variant: 'destructive',
      });

      // Add error message
      setMessages(prev => [
        ...prev, 
        {
          content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
          sender: 'bot' as const,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-primary">Healthcare Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-4">
        {isLoadingHistory ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            <span className="ml-2 text-muted-foreground">Loading conversation history...</span>
          </div>
        ) : (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4 pb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/assets/healthcare-assistant.png" alt="Healthcare Assistant" />
                      <AvatarFallback className="bg-primary text-white">HA</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/assets/patient-avatar.png" alt="Patient" />
                      <AvatarFallback className="bg-secondary text-secondary-foreground">PT</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder="Type your message here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-h-[60px] max-h-[120px] resize-none"
            disabled={isLoading || isLoadingHistory}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || isLoadingHistory}
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
