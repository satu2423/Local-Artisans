import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

const CraftingAnimation = ({ productData, onAnimationComplete }) => {
  const [animationData, setAnimationData] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (productData) {
      generateAnimation();
    }
  }, [productData]);

  useEffect(() => {
    let interval;
    if (isPlaying && animationData) {
      interval = setInterval(() => {
        setCurrentFrame(prev => {
          const nextFrame = prev + 1;
          if (nextFrame >= animationData.animation.frames.length) {
            setIsPlaying(false);
            setCurrentFrame(0);
            setProgress(0);
            if (onAnimationComplete) onAnimationComplete();
            return 0;
          }
          return nextFrame;
        });
      }, animationData.animation.frames[currentFrame]?.duration * 1000 || 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentFrame, animationData]);

  useEffect(() => {
    if (animationData) {
      const totalFrames = animationData.animation.frames.length;
      setProgress((currentFrame / totalFrames) * 100);
    }
  }, [currentFrame, animationData]);

  const generateAnimation = async () => {
    setIsLoading(true);
    try {
      const { generateCraftingAnimation } = await import('../services/craftingAnimationService');
      const result = await generateCraftingAnimation(productData);
      setAnimationData(result);
    } catch (error) {
      console.error('Failed to generate animation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetAnimation = () => {
    setCurrentFrame(0);
    setIsPlaying(false);
    setProgress(0);
  };

  const goToFrame = (frameIndex) => {
    setCurrentFrame(frameIndex);
    setProgress((frameIndex / animationData.animation.frames.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mr-3"></div>
          <span className="text-purple-700 font-medium">Generating crafting animation...</span>
        </div>
      </div>
    );
  }

  if (!animationData) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600 text-center">No animation available</p>
      </div>
    );
  }

  const currentFrameData = animationData.animation.frames[currentFrame];

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
        <h3 className="text-xl font-semibold text-gray-800">{animationData.animation.title}</h3>
      </div>

      {/* Animation Display */}
      <div className="relative mb-4">
        <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFrame}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: currentFrameData.svg }}
            />
          </AnimatePresence>
        </div>

        {/* Frame Info */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded">
          <span className="text-sm font-medium">
            {currentFrame + 1} / {animationData.animation.frames.length}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Playback Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={resetAnimation}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            onClick={togglePlayPause}
            className="p-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-purple-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Frame Information */}
        <div className="text-center">
          <h4 className="font-semibold text-gray-800">{currentFrameData.title}</h4>
          <p className="text-sm text-gray-600">{currentFrameData.description}</p>
        </div>

        {/* Frame Thumbnails */}
        <div className="grid grid-cols-6 gap-2">
          {animationData.animation.frames.map((frame, index) => (
            <button
              key={index}
              onClick={() => goToFrame(index)}
              className={`relative aspect-video rounded overflow-hidden border-2 transition-colors ${
                index === currentFrame 
                  ? 'border-purple-500 bg-purple-100' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div 
                className="w-full h-full scale-50 origin-top-left"
                dangerouslySetInnerHTML={{ __html: frame.svg }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs text-center py-1">
                {index + 1}
              </div>
            </button>
          ))}
        </div>

        {/* Animation Stats */}
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Duration: {animationData.animation.totalDuration}s</span>
          <span>Frames: {animationData.animation.frames.length}</span>
          {animationData.isFallback && (
            <span className="text-orange-600">Fallback Animation</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CraftingAnimation;

