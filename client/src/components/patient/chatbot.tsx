import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MessageCircle, SendHorizontal } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  type: "patient" | "assistant";
  content: string;
  timestamp: Date;
};

interface ChatbotProps {
  patientId: number;
}

export function Chatbot({ patientId }: ChatbotProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat history on component mount
  const { data: chatHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: [`/api/patient-chatbot/history/${patientId}`],
    enabled: !!patientId, 
  });

  // Scroll to bottom of messages when a new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load chat history when available
  useEffect(() => {
    if (chatHistory?.success && chatHistory.history?.length > 0) {
      const formattedMessages = chatHistory.history.map((msg: any) => ([
        {
          type: "patient",
          content: msg.patientMessage,
          timestamp: new Date(msg.timestamp),
        },
        {
          type: "assistant",
          content: msg.aiResponse,
          timestamp: new Date(msg.timestamp),
        }
      ])).flat();
      
      setMessages(formattedMessages);
    }
  }, [chatHistory]);

  // Send message mutation
  const chatMutation = useMutation({
    mutationFn: async (newMessage: string) => {
      const response = await apiRequest("POST", "/api/patient-chatbot/chat", {
        patientId,
        message: newMessage,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setMessages([...messages, {
          type: "assistant",
          content: data.response,
          timestamp: new Date(),
        }]);
      } else {
        toast({
          title: "Error",
          description: "Failed to get a response from the healthcare assistant",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    },
  });

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to the messages list
    const newMessages = [...messages, {
      type: "patient",
      content: message,
      timestamp: new Date(),
    }];
    
    setMessages(newMessages);
    chatMutation.mutate(message);
    setMessage(""); // Clear the input field
  };

  // Render loading state if history is loading
  if (isLoadingHistory) {
    return (
      <Card className="w-full h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" />
            Healthcare Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">Loading conversation history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          Healthcare Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full space-y-3">
            <p className="text-muted-foreground text-center">
              Welcome to your personal healthcare assistant. <br />
              How can I help you today?
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === "patient" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.type === "patient" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"}`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1"
            disabled={chatMutation.isPending}
          />
          <Button type="submit" disabled={!message.trim() || chatMutation.isPending}>
            {chatMutation.isPending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}