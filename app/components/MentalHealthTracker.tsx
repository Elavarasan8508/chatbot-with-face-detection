"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";

import { 
  Brain, Send,
  User2Icon
} from 'lucide-react';

import { MessageContent } from './MessageContent';
import { generateGeminiResponse } from '@/actions/gemini';
import EmotionDetector from './EmotionDetector';
import MentalHealthTable from './MentalHealthTable';
import { getMentalDatas, getTodayCompleted, insertMentalHealth, processData } from '@/lib/serveracs';
import AttendanceTracker from './AttendanceTracker';
import MarkLeave from './mini/MarkLeave';
import Profile from './mini/Profile';


const MentalHealthChatbot = ({user, data}:any) => {
  const [messages, setMessages] = useState([
    { 
      text: "Hi! I'm your mental health companion. You can ask Anything",
      isBot: true,
      options: []
    }
  ]);

  const [emo, setEmo] = useState("Not Detected");


  
  const [formData, setFormData] = useState({
    sadness: false,
    euphoric: false,
    exhausted: false,
    sleep_disorder: false,
    mood_swing: false,
    suicidal_thoughts: false,
    anorexia: false,
    authority_respect: false,
    try_explanation: false,
    aggressive_response: false,
    ignore_and_move_on: false,
    nervous_breakdown: false,
    admit_mistakes: false,
    overthinking: false,
    concentration: 5,
    optimism: 5
  });

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);


  const [datas, setDatas] = useState<any[]>([]);
  const [todayCompleted, setTadayCompleted] = useState<boolean>(false);

  const [pred, setPred] = useState({type:"Predicting"});


  useEffect(() => {



  }, []);




  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const addMessage = (message, delay = 1000) => {
    setIsThinking(true);
    setTimeout(() => {
      setMessages(prev => [...prev, message]);
      setIsThinking(false);
    }, delay);
  };

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      setMessages(prev => [...prev, { text: userInput, isBot: false }]);
      const currentInput = userInput;
      setUserInput('');
      await askAi(currentInput);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const askAi = async (prompt) => {
    setIsThinking(true);

    try {
      const res = await generateGeminiResponse(prompt,messages,emo,pred);
      setMessages(prev => [...prev, { text: res, isBot: true, isMarkdown: true }]);
    } catch (error) {
      console.error('Error calling AI:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
        isBot: true 
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleOptionClick = (option) => {
    setMessages(prev => [...prev, { text: option, isBot: false }]);
    
    if (option === "Yes, let's begin") {
      setTimeout(() => {
        addMessage({
          text: "I'll ask you a series of questions to better understand how you're feeling. Please answer honestly - this is a safe space.",
          isBot: true
        });
        setCurrentQuestion(0);
      }, 500);
    }
  };





  return (
    <div className="max-h-screen g-gradient-to-br from-blue-50 to-blue-50 p-4 relative">
      <Card className="max-w-2xl mx-auto shadow-lg border-none bg-white/90 backdrop-blur">
        <CardHeader className="border-b bg-gradient-to-r from-blue-100 to-blue-100">
          <CardTitle className="flex items-center justify-between space-x-2 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-600">
           Chatbot

          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`rounded-2xl p-4 max-w-[80%] ${
                    msg.isBot 
                      ? 'bg-gradient-to-r from-blue-100 to-blue-100 text-gray-800' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-500 text-white'
                  }`}>
                    <MessageContent message={msg} />
                    {msg.options && (
                      <div className="mt-4 space-y-2">
                        {msg.options.map((option) => (
                          <Button
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            className="w-full bg-white text-blue-600 hover:bg-blue-50"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                    {msg.question && (
                      <div className="mt-4 space-y-4">
                        {msg.question.type === 'boolean' ? (
                          <div className="flex justify-center space-x-4">
                            <Button
                              onClick={() => handleResponse(true)}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={() => handleResponse(false)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              No
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Slider
                              defaultValue={[5]}
                              max={10}
                              min={1}
                              step={1}
                              className="w-full"
                              onValueCommit={([value]) => handleResponse(value)}
                            />
                            <div className="flex justify-between text-sm">
                              <span>1</span>
                              <span>10</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-blue-100 to-blue-100 rounded-2xl p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-grow px-4 py-2 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Button 
                onClick={handleSendMessage}
                className="rounded-full bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  );
};

export default MentalHealthChatbot;