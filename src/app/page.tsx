"use client"

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Brain, 
  Upload, 
  Zap,
  FileText,
  Plus,
  Mic,
  Paperclip,
  StopCircle,
  type LucideIcon
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ApiButton {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  apiEndpoint: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiButtons: ApiButton[] = [
    {
      id: "rag",
      label: "RAG",
      icon: Search,
      description: "Retrieve Augmented Generation",
      apiEndpoint: "/api/rag"
    },
    {
      id: "stream",
      label: "Stream",
      icon: Zap,
      description: "Streaming response",
      apiEndpoint: "/api/stream"
    },
    {
      id: "thinking",
      label: "Thinking",
      icon: Brain,
      description: "Deep reasoning mode",
      apiEndpoint: "/api/thinking"
    },
    {
      id: "search",
      label: "Search",
      icon: Search,
      description: "Semantic search",
      apiEndpoint: "/api/search"
    },
    {
      id: "upload",
      label: "Upload",
      icon: Upload,
      description: "Document upload",
      apiEndpoint: "/api/upload"
    },
    {
      id: "docs",
      label: "Docs",
      icon: FileText,
      description: "Document management",
      apiEndpoint: "/api/docs"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, apiType?: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 11),
      content,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(2, 11),
        content: `Đây là phản hồi mô phỏng từ API ${apiType || 'chat'}. Tin nhắn của bạn: "${content}"`,
        role: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleApiButtonClick = (apiButton: ApiButton) => {
    const promptText = `Sử dụng ${apiButton.label} (${apiButton.description})`;
    handleSendMessage(promptText, apiButton.id);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="md:hidden">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Spring AI Chat
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Plus className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Chào mừng đến với Spring AI
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Bắt đầu cuộc trò chuyện hoặc sử dụng các tính năng AI bên dưới
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {apiButtons.map((apiButton) => (
                    <Card 
                      key={apiButton.id}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 border-gray-200 dark:border-gray-700"
                      onClick={() => handleApiButtonClick(apiButton)}
                    >
                      <CardContent className="p-4 text-center">
                        <apiButton.icon className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {apiButton.label}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {apiButton.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.role === "user" ? "/user-avatar.png" : "/ai-avatar.png"} />
                      <AvatarFallback>
                        {message.role === "user" ? "U" : "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {message.role === "user" ? "Bạn" : "Spring AI"}
                      </div>
                      <div className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Spring AI
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        </div>
                        <span className="text-sm text-gray-500">Đang suy nghĩ...</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto p-4">
            {/* API Action Buttons */}
            {messages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {apiButtons.map((apiButton) => (
                  <Button
                    key={apiButton.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleApiButtonClick(apiButton)}
                    disabled={isLoading}
                    className="flex items-center space-x-1"
                  >
                    <apiButton.icon className="w-4 h-4" />
                    <span>{apiButton.label}</span>
                  </Button>
                ))}
              </div>
            )}

            {/* Input Field */}
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Nhắn tin tới Spring AI..."
                  disabled={isLoading}
                  className="pr-12 min-h-[44px] resize-none border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                className="h-11 w-11 p-0 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {isLoading ? (
                  <StopCircle className="h-5 w-5" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Spring AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
