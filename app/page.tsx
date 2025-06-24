import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Brain, MessageCircle, Activity, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">

            {/* <span className="text-xl font-semibold text-gray-900">MindWell</span> */}
          </div>
          <div className="flex gap-4">
            <Link href="/chat">
              <Button variant="ghost">Chat now</Button>
            </Link>
            <Link href="/detect">
              <Button variant="ghost">Detect</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Automated Mental Health Assessment Using Deep Learning Model
              </h1>
              <p className="text-xl text-gray-600">
                Experience compassionate support and guidance through our AI-powered platform, designed to help you navigate your mental wellness journey.
              </p>
              <div className="flex gap-4">
                <Link href="/chat">
                  <Button className="group bg-blue-600 hover:bg-blue-700">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg blur-xl opacity-50"></div>
              <img 
                src="https://hbr.org/resources/images/article_assets/2022/10/A_Oct22_06_mental-health_1058086058.jpg"
                alt="Mental Health Support Illustration"
                className="relative rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all">
              <CardContent className="p-6 space-y-4">
                <MessageCircle className="w-12 h-12 text-blue-600 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold">AI Chat Support</h3>
                <p className="text-gray-600">24/7 conversation partner trained to provide empathetic listening and guidance.</p>
                <Link href="/chat">
                  <Button variant="ghost" className="group-hover:bg-blue-50">
                    Start Chat
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all">
              <CardContent className="p-6 space-y-4">
                <Activity className="w-12 h-12 text-blue-600 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold">Mood Analysis</h3>
                <p className="text-gray-600">Advanced AI tools to help track and understand your emotional patterns.</p>
                <Link href="/detect">
                  <Button variant="ghost" className="group-hover:bg-blue-50">
                    Analyze Mood
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all">
              <CardContent className="p-6 space-y-4">
                <Brain className="w-12 h-12 text-blue-600 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold">Resource Library</h3>
                <p className="text-gray-600">Curated collection of mental health resources and self-help materials.</p>
                {/* <Link href="/resources">
                  <Button variant="ghost" className="group-hover:bg-blue-50">
                    Browse Resources
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;