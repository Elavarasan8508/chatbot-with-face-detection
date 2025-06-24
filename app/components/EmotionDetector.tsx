"use client"

import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, AlertCircle, Smile, Frown, Angry, Ghost, Skull, Star, Meh, Brain, Target } from 'lucide-react';

const EmotionDetector = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<{ name: string; probability: string } | null>(null);
  const [debugInfo, setDebugInfo] = useState('Initializing...');
  const detectionRef = useRef<NodeJS.Timeout | null>(null);
  const isModelsLoaded = useRef(false);

  const [sec, setSec] = useState(0);

  const secToMin = () => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} Min ${s} Sec`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadModels = async () => {
    try {
      setDebugInfo('Loading models...');
      await Promise.all([
        faceapi.nets.tinyFaceDetector.load('/models'),
        faceapi.nets.faceLandmark68Net.load('/models'),
        faceapi.nets.faceExpressionNet.load('/models')
      ]);
      isModelsLoaded.current = true;
      setDebugInfo('Models loaded successfully');
      return true;
    } catch (err) {
      setError('Failed to load face detection models');
      setDebugInfo('Model loading failed');
      return false;
    }
  };

  const startVideo = async () => {
    try {
      setDebugInfo('Starting video...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          videoRef.current!.onloadeddata = () => resolve(true);
        });
        setDebugInfo('Video ready');
        return true;
      }
      return false;
    } catch (err) {
      setError('Unable to access camera');
      setDebugInfo('Camera error');
      return false;
    }
  };

  const detectEmotions = async () => {
    if (!videoRef.current || !isModelsLoaded.current || videoRef.current.paused || videoRef.current.ended) return;

    try {
      const detections = await faceapi
        .detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
        )
        .withFaceExpressions();

      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        const dominantEmotion = Object.entries(expressions).reduce((prev, current) =>
          current[1] > prev[1] ? current : prev
        );

        setEmotion({
          name: dominantEmotion[0],
          probability: (dominantEmotion[1] * 100).toFixed(1)
        });

        setDebugInfo('Face detected');
      } else {
        setEmotion(null);
        setDebugInfo('No face detected');
      }
    } catch (err) {
      setDebugInfo('Detection error');
    }
  };

  const startDetection = () => {
    if (detectionRef.current) {
      clearInterval(detectionRef.current);
    }

    detectEmotions();
    detectionRef.current = setInterval(detectEmotions, 1000);
  };

  useEffect(() => {
    const initialize = async () => {
      const modelsLoaded = await loadModels();
      if (modelsLoaded) {
        const videoStarted = await startVideo();
        if (videoStarted) {
          startDetection();
        }
      }
      setIsLoading(false);
    };

    initialize();

    return () => {
      if (detectionRef.current) clearInterval(detectionRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const getEmotionIcon = (emotionName: string) => {
    const icons: Record<string, JSX.Element> = {
      happy: <Smile className="w-8 h-8 text-blue-600" />,
      sad: <Frown className="w-8 h-8 text-blue-600" />,
      angry: <Angry className="w-8 h-8 text-red-600" />,
      fearful: <Ghost className="w-8 h-8 text-blue-600" />,
      disgusted: <Skull className="w-8 h-8 text-yellow-600" />,
      surprised: <Star className="w-8 h-8 text-pink-600" />,
      neutral: <Meh className="w-8 h-8 text-gray-600" />
    };
    return icons[emotionName] || <AlertCircle className="w-8 h-8 text-gray-600" />;
  };

  const getEmotionColor = (emotionName: string) => {
    const colors: Record<string, string> = {
      happy: 'bg-blue-50 border-blue-200 text-blue-700',
      sad: 'bg-blue-50 border-blue-200 text-blue-700',
      angry: 'bg-red-50 border-red-200 text-red-700',
      fearful: 'bg-blue-50 border-blue-200 text-blue-700',
      disgusted: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      surprised: 'bg-pink-50 border-pink-200 text-pink-700',
      neutral: 'bg-gray-50 border-gray-200 text-gray-700'
    };
    return colors[emotionName] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 p-6">
      <Card className="h-screen mx-auto bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="space-y-4 pb-2">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="h-10 w-10 text-blue-600" />
            <CardTitle className="text-4xl font-bold text-blue-900">Emotion Recognition</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="relative aspect-video w-full bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner">
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-blue-100 z-10">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                      <div className="text-lg font-bold text-blue-600">95%</div>
                    </div>
                  </div>
                </div>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="w-10 h-10 animate-pulse text-gray-400" />
                      <span className="text-sm text-gray-500">Initializing camera...</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
                  <div className="text-sm text-gray-600">Session Duration</div>
                  <div className="text-lg font-semibold text-blue-900">{secToMin()}</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
                  <div className="text-sm text-gray-600">Data Points</div>
                  <div className="text-lg font-semibold text-blue-900">{String(sec)}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="ml-2">{error}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm font-medium text-gray-600">{debugInfo}</span>
                  </div>
                  {emotion && (
                    <div className={`flex items-center gap-4 p-6 rounded-xl border shadow-sm ${getEmotionColor(emotion.name)}`}>
                      {getEmotionIcon(emotion.name)}
                      <div className="flex flex-col">
                        <span className="text-xl font-semibold capitalize">{emotion.name}</span>
                        <span className="text-sm text-gray-600">Confidence: {emotion.probability}%</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionDetector;
