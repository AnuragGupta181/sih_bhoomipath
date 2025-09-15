import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Download, MessageCircle, Send, SkipForward, ArrowDown } from 'lucide-react';
import { quizQuestions } from '@/data/quizQuestions';
import { QuizState, QuizData, QuizPayload } from '@/types/quiz';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';


interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  options?: string[];
  questionId?: keyof QuizData | string;
  questionType?: 'select' | 'number';
  unit?: string;
  allowSkip?: boolean;
  disabled?: boolean;
}


const EcoSathi = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{[key: number]: string}>({});
  const [disabledQuestions, setDisabledQuestions] = useState<Set<number>>(new Set());
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatInput, setChatInput] = useState('');
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    isSubmitting: false,
    results: null,
    userGoal: ''
  });
  const [isQuestionMode, setIsQuestionMode] = useState(true);
  const [chatStarted, setChatStarted] = useState(false);

  // Initialize chat with welcome message only
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: "Hi, I'm EcoSathi! 🌱 I'll help you run a Life Cycle Assessment through a quick 15-question chat. Ready to get started?"
    };
    
    setChatMessages([welcomeMessage]);
  }, []);

const goToReport = () => {
  const sample_row = {
    Process_Type: quizState.answers.Process_Type || null,
    Metal: quizState.answers.Metal || null,
    Energy_MJ_per_kg: quizState.answers.Energy_MJ_per_kg || null,
    Quantity_kg: quizState.answers.Quantity_kg || null,
    Energy_MJ_total: quizState.answers.Energy_MJ_total || null,
    Transport_km: quizState.answers.Transport_km || null,
    Transport_Mode: quizState.answers.Transport_Mode || null,
    Transport_emissions_kgCO2: quizState.answers.Transport_emissions_kgCO2 || null,
    Water_use_m3_per_ton: quizState.answers.Water_use_m3_per_ton || null,
    End_of_Life: quizState.answers.End_of_Life || null,
    Circularity_option: quizState.answers.Circularity_option || null,
    Process_emissions_kgCO2: quizState.answers.Process_emissions_kgCO2 || null,
    Total_emissions_kgCO2: quizState.answers.Total_emissions_kgCO2 || null,
    Emission_factor_kgCO2_per_MJ: quizState.answers.Emission_factor_kgCO2_per_MJ || null,
  };

  navigate('/report', { 
    state: { 
      results: quizState.results, 
      answers: quizState.answers,
      sample_row   // 👈 yaha pass kar diya
    } 
  });
};


  
  const startChat = () => {
    setChatStarted(true);
    const startMessage: ChatMessage = {
      role: 'assistant',
      content: "Great! Let's begin your LCA analysis."
    };
    
    setChatMessages(prev => [...prev, startMessage]);
    
    // Start first question after brief delay
    setTimeout(() => {
      askNextQuestion(0);
    }, 1000);
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages]);

  // Handle scroll detection for scroll-to-bottom button
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        setShowScrollBottom(scrollTop + clientHeight < scrollHeight - 100);
      }
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const askNextQuestion = (questionIndex: number) => {
    const totalQuestions = quizQuestions.length + 1; // +1 for goal question
    
    if (questionIndex >= quizQuestions.length) {
      // Ask goal question
      const goalMessage: ChatMessage = {
        role: 'assistant',
        content: `Question ${questionIndex + 1} of ${totalQuestions}: What is your goal for this LCA run?`,
        questionId: 'userGoal' as keyof QuizData,
        questionType: 'number', // Using number type for text area
        allowSkip: false
      };
      setChatMessages(prev => [...prev, goalMessage]);
      return;
    }

    const question = quizQuestions[questionIndex];
    const progress = Math.round(((questionIndex + 1) / totalQuestions) * 100);
    
    const questionMessage: ChatMessage = {
      role: 'assistant',
      content: `Question ${questionIndex + 1} of ${totalQuestions}: ${question.title}`,
      options: question.options,
      questionId: question.id,
      questionType: question.type,
      unit: question.unit,
      allowSkip: !question.required
    };

    setChatMessages(prev => [...prev, questionMessage]);
  };

  const handleAnswer = (questionId: keyof QuizData | string, value: string | number, messageIndex?: number) => {
    if (questionId === 'userGoal') {
      setQuizState(prev => ({ ...prev, userGoal: value as string }));
      setChatMessages(prev => [...prev, { role: 'user', content: value as string }]);
      if (messageIndex !== undefined) {
        setDisabledQuestions(prev => new Set([...prev, messageIndex]));
      }
      submitQuiz();
      return;
    }

    const numericFields = ['Energy_MJ_per_kg', 'Quantity_kg', 'Energy_MJ_total', 'Transport_km', 'Transport_emissions_kgCO2', 'Water_use_m3_per_ton', 'Process_emissions_kgCO2', 'Total_emissions_kgCO2', 'Emission_factor_kgCO2_per_MJ'];
    
    const newAnswers = {
      ...quizState.answers,
      [questionId]: numericFields.includes(questionId) ? (value === '' ? 0 : Number(value)) : value
    };

    // Auto-calculate Energy_MJ_total = Energy_MJ_per_kg × Quantity_kg
    if (questionId === 'Energy_MJ_per_kg' || questionId === 'Quantity_kg') {
      const energyPerKg = questionId === 'Energy_MJ_per_kg' ? Number(value) : (newAnswers.Energy_MJ_per_kg || 0);
      const quantity = questionId === 'Quantity_kg' ? Number(value) : (newAnswers.Quantity_kg || 0);
      if (energyPerKg && quantity) {
        newAnswers.Energy_MJ_total = energyPerKg * quantity;
      }
    }

    // Auto-calculate Total_emissions_kgCO2 = Process_emissions_kgCO2 + Transport_emissions_kgCO2
    if (questionId === 'Process_emissions_kgCO2' || questionId === 'Transport_emissions_kgCO2') {
      const processEmissions = questionId === 'Process_emissions_kgCO2' ? Number(value) : (newAnswers.Process_emissions_kgCO2 || 0);
      const transportEmissions = questionId === 'Transport_emissions_kgCO2' ? Number(value) : (newAnswers.Transport_emissions_kgCO2 || 0);
      if (processEmissions || transportEmissions) {
        newAnswers.Total_emissions_kgCO2 = processEmissions + transportEmissions;
      }
    }

    setQuizState(prev => ({ ...prev, answers: newAnswers }));
    setChatMessages(prev => [...prev, { role: 'user', content: String(value) }]);
    
    // Disable the question
    if (messageIndex !== undefined) {
      setDisabledQuestions(prev => new Set([...prev, messageIndex]));
    }
    
    // Move to next question
    const nextQuestion = quizState.currentQuestion + 1;
    setQuizState(prev => ({ ...prev, currentQuestion: nextQuestion }));
    
    setTimeout(() => {
      askNextQuestion(nextQuestion);
    }, 500);
  };

  const handleOptionSelect = (messageIndex: number, option: string) => {
    setSelectedOptions(prev => ({ ...prev, [messageIndex]: option }));
  };

  const handleOptionNext = (messageIndex: number, questionId: keyof QuizData | string) => {
    const selectedOption = selectedOptions[messageIndex];
    if (selectedOption && questionId) {
      handleAnswer(questionId, selectedOption, messageIndex);
      setSelectedOptions(prev => {
        const newSelected = { ...prev };
        delete newSelected[messageIndex];
        return newSelected;
      });
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSkip = (messageIndex?: number) => {
    const currentQ = quizQuestions[quizState.currentQuestion];
    if (currentQ?.type === 'number') {
      handleAnswer(currentQ.id, 0, messageIndex);
    } else {
      setChatMessages(prev => [...prev, { role: 'user', content: 'Skipped' }]);
      if (messageIndex !== undefined) {
        setDisabledQuestions(prev => new Set([...prev, messageIndex]));
      }
      const nextQuestion = quizState.currentQuestion + 1;
      setQuizState(prev => ({ ...prev, currentQuestion: nextQuestion }));
      setTimeout(() => {
        askNextQuestion(nextQuestion);
      }, 500);
    }
  };

  const submitQuiz = async () => {
    setQuizState(prev => ({ ...prev, isSubmitting: true }));
    setChatMessages(prev => [...prev, { role: 'assistant', content: '🔄 Analyzing your data...' }]);
    
    const payload: QuizPayload = {
      sample_row: {
        Process_Type: quizState.answers.Process_Type || null,
        Metal: quizState.answers.Metal || null,
        Energy_MJ_per_kg: quizState.answers.Energy_MJ_per_kg || null,
        Quantity_kg: quizState.answers.Quantity_kg || null,
        Energy_MJ_total: quizState.answers.Energy_MJ_total || null,
        Transport_km: quizState.answers.Transport_km || null,
        Transport_Mode: quizState.answers.Transport_Mode || null,
        Transport_emissions_kgCO2: quizState.answers.Transport_emissions_kgCO2 || null,
        Water_use_m3_per_ton: quizState.answers.Water_use_m3_per_ton || null,
        End_of_Life: quizState.answers.End_of_Life || null,
        Circularity_option: quizState.answers.Circularity_option || null,
        Process_emissions_kgCO2: quizState.answers.Process_emissions_kgCO2 || null,
        Total_emissions_kgCO2: quizState.answers.Total_emissions_kgCO2 || null,
        Emission_factor_kgCO2_per_MJ: quizState.answers.Emission_factor_kgCO2_per_MJ || null
      },
      question: quizState.userGoal || 'LCA analysis for metallurgy process'
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/chat_ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

       console.log("📡 Raw response:", response);

  if (!response.ok) {
    console.error("❌ Response not OK:", response.status, response.statusText);
  }

  let results = await response.json();
  results=results.airesponse

  console.log("✅ Parsed results:", results);
  


  
      setQuizState(prev => ({ ...prev, isSubmitting: false, results }));
      
      const resultMessage = typeof results === 'string' ? results : JSON.stringify(results, null, 2);
      setChatMessages(prev => [...prev, 
        { role: 'assistant', content: '🎉 Analysis Complete!' },
        { role: 'assistant', content: resultMessage }
      ]);
      
      toast({
        
        title: "Analysis Complete!",
        description: "Your LCA results are ready.",
      });
    } catch (error) {
      console.error("🔥 Fetch error:", error);

      setQuizState(prev => ({ ...prev, isSubmitting: false }));
      setChatMessages(prev => [...prev, 
        { role: 'assistant', content: '❌ Network error. Would you like to retry or export your data?' }
      ]);
      toast({
        title: "Connection Error",
        description: "Failed to submit. You can retry or export your data.",
        variant: "destructive"
      });
    }
  };

  const resetQuiz = () => {
    setQuizState({ currentQuestion: 0, answers: {}, isSubmitting: false, results: null, userGoal: '' });
    setChatMessages([]);
    setSelectedOptions({});
    setDisabledQuestions(new Set());
    setChatStarted(false);
    
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: "Hi, I'm EcoSathi! 🌱 I'll help you run a Life Cycle Assessment through a quick 15-question chat. Ready to get started?"
      };
      setChatMessages([welcomeMessage]);
    }, 500);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(quizState.answers, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lca-quiz-answers.json';
    link.click();
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    
    // Handle free-form chat if not in question mode
    if (!isQuestionMode) {
      const userMessage = chatInput.trim();
      setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setChatInput('');
      
      setTimeout(() => {
        let response = "That's a great question! ";
        if (userMessage.toLowerCase().includes('emission')) {
          response += "To reduce emissions, consider: switching to renewable energy, optimizing transport routes, or exploring circular economy options.";
        } else if (userMessage.toLowerCase().includes('circular')) {
          response += "Circularity means keeping materials in use longer through recycling, refurbishing, or remanufacturing.";
        } else {
          response += "I can help you explore this through our LCA analysis.";
        }
        
        setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }, 1000);
    }
  };

  const getCurrentQuestion = () => {
    return chatMessages.find((msg, idx) => 
      msg.role === 'assistant' && 
      (msg.options || msg.questionType === 'number' || msg.questionId === 'userGoal') && 
      !disabledQuestions.has(idx)
    );
  };

  const getCurrentQuestionIndex = () => {
    return chatMessages.findIndex((msg, idx) => 
      msg.role === 'assistant' && 
      (msg.options || msg.questionType === 'number' || msg.questionId === 'userGoal') && 
      !disabledQuestions.has(idx)
    );
  };

  const currentQuestion = getCurrentQuestion();
  const currentQuestionIndex = getCurrentQuestionIndex();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      {/* Header */}
      <Card className="bhoomi-card m-4 mb-0 mt-20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 bhoomi-text-gradient text-lg text-size-xl font-bold">
            <MessageCircle className="w-5 h-5" />
            <h1>Eco Sathi - Your Personal LCA Assistant</h1>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Chat Messages - Scrollable Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 pb-2 space-y-4 bg-card/50 backdrop-blur-sm border border-border rounded-2xl"
      >
        {chatMessages.map((msg, idx) => {
          const isDisabled = disabledQuestions.has(idx);

          return (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                } ${isDisabled ? "opacity-70" : ""}`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {/* Show unit hint for current number questions */}
                {msg.role === "assistant" &&
                  msg.questionType === "number" &&
                  msg.unit &&
                  idx === currentQuestionIndex && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Unit: {msg.unit}
                    </p>
                  )}
              </div>
            </div>
          );
        })}

        {/* Scroll to bottom button */}
        {showScrollBottom && (
          <Button
            className="fixed bottom-4 right-4 rounded-full p-3 shadow-lg z-10 bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
            onClick={scrollToBottom}
          >
            <ArrowDown className="w-5 h-5" />
          </Button>
        )}
      </div>
      
      {/* Fixed Bottom Input Area - WhatsApp Style */}
      {!chatStarted && (
        <div className="border-t bg-background p-4">
          <Card className="bhoomi-card">
            <CardContent className="p-4 text-center">
              <Button
                onClick={startChat}
                size="lg"
                className="w-full max-w-xs bhoomi-btn-glow"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      {chatStarted && currentQuestion && (
        <div className="border-t bg-background p-4">
          <Card className="bhoomi-card">
            <CardContent className="p-4">
              {/* Options for select questions */}
              {currentQuestion.options && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">Choose an option:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
                    {currentQuestion.options.map((option) => (
                      <Button
                        key={option}
                        variant={selectedOptions[currentQuestionIndex] === option ? "default" : "outline"}
                        size="sm"
                        className="justify-start text-left text-wrap p-3 h-auto min-h-[2.5rem]"
                        onClick={() => handleOptionSelect(currentQuestionIndex, option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  {selectedOptions[currentQuestionIndex] && (
                    <div className="flex gap-2 mt-3 max-w-xs">
                      <Button
                        size="sm"
                        onClick={() => currentQuestion.questionId && handleOptionNext(currentQuestionIndex, currentQuestion.questionId)}
                        className="flex-1"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Next
                      </Button>
                      {currentQuestion.allowSkip && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSkip(currentQuestionIndex)}
                        >
                          <SkipForward className="w-4 h-4 mr-1" />
                          Skip
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Input for number questions */}
              {currentQuestion.questionType === 'number' && !currentQuestion.options && currentQuestion.questionId !== 'userGoal' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Enter a numeric value:</p>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter value"
                      className="flex-1"
                      id={`current-input`}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const value = (e.target as HTMLInputElement).value;
                          if (currentQuestion.questionId) handleAnswer(currentQuestion.questionId, value, currentQuestionIndex);
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById(`current-input`) as HTMLInputElement;
                        const value = input?.value || '';
                        if (currentQuestion.questionId) handleAnswer(currentQuestion.questionId, value, currentQuestionIndex);
                      }}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Next
                    </Button>
                    {currentQuestion.allowSkip && (
                      <Button
                        variant="ghost"
                        onClick={() => handleSkip(currentQuestionIndex)}
                      >
                        <SkipForward className="w-4 h-4 mr-1" />
                        Skip
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Textarea for goal question */}
              {currentQuestion.questionId === 'userGoal' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Describe your goal for this LCA analysis:</p>
                  <Textarea
                    placeholder="e.g., Reduce CO2 emissions by 20%, explore circular economy options..."
                    className="min-h-20"
                    id={`current-textarea`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        const value = (e.target as HTMLTextAreaElement).value;
                        if (value.trim()) handleAnswer('userGoal', value, currentQuestionIndex);
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      const textarea = document.getElementById(`current-textarea`) as HTMLTextAreaElement;
                      const value = textarea?.value || '';
                      if (value.trim()) handleAnswer('userGoal', value, currentQuestionIndex);
                    }}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Goal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Show action buttons after results */}
      {quizState.results && !currentQuestion && (
        <div className="border-t bg-background p-4">
          <Card className="bhoomi-card">
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={goToReport} variant="outline" size="sm">
  <Download className="w-4 h-4 mr-2" />
  View Report
</Button>

                <Button onClick={resetQuiz} variant="secondary" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EcoSathi;