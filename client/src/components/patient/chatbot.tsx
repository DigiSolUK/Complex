import { useState, useEffect, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Bot, User, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

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
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Fetch chat history
  const { data: chatHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["/api/patient-chatbot/history", patientId],
    enabled: !!patientId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/patient-chatbot/chat", {
        patientId,
        message,
      });
      return response.json();
    },
    onSuccess: (data) => {
      // If the response was successful, update the messages state with the AI's response
      if (data.success && data.response) {
        setMessages((prev) => [...prev, {
          type: "assistant",
          content: data.response,
          timestamp: new Date(),
        }]);
        
        // Invalidate the chat history query to refetch updated messages
        queryClient.invalidateQueries({ queryKey: ["/api/patient-chatbot/history", patientId] });
      } else {
        // Handle error responses that might still return a 200 status code
        toast({
          title: "Error",
          description: data.message || "Failed to get a response from the assistant.",
          variant: "destructive",
        });
      }
      setIsTyping(false);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast({
        title: "Message Failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
      setIsTyping(false);
    },
  });

  // Load chat history when it changes
  useEffect(() => {
    if (chatHistory?.success && chatHistory.history) {
      const formattedMessages = chatHistory.history.map((msg: any) => ({
        type: msg.type,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      }));
      setMessages(formattedMessages);
    }
  }, [chatHistory]);

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add patient message to the UI immediately
    const patientMessage: Message = {
      type: "patient",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, patientMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Send message to API
    sendMessageMutation.mutate(message);
    
    // Clear input
    setMessage("");
  };

  // Function to refresh the chat history
  const refreshChatHistory = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/patient-chatbot/history", patientId] });
    toast({
      title: "Refreshed",
      description: "Chat history has been refreshed.",
    });
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          <h3 className="font-semibold">Patient Support Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={refreshChatHistory} title="Refresh chat history">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading conversation history...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="h-12 w-12 text-primary/20 mb-3" />
            <h3 className="font-medium mb-1">How can I help you today?</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              I'm here to assist with care plan questions, health information, and support. Our conversation is private and secure.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isAssistant = msg.type === "assistant";
            return (
              <div key={index} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                <div className={`flex gap-2 max-w-[80%] ${isAssistant ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isAssistant ? "bg-primary/10" : "bg-secondary"}`}>
                    {isAssistant ? (
                      <Bot className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-secondary-foreground" />
                    )}
                  </div>
                  <div>
                    <div className={`${isAssistant ? "bg-muted" : "bg-primary text-primary-foreground"} p-3 rounded-lg`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(msg.timestamp, "h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[80%]">
              <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-100"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Message input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type a message..."
            className="min-h-[60px] max-h-[120px]"
            disabled={isTyping || isLoadingHistory}
          />
          <Button 
            type="submit" 
            disabled={!message.trim() || isTyping || isLoadingHistory}
            className="self-end"
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </Card>
  );
}
