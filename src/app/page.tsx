"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { AudioAnalysis } from "@/components/AudioAnalysis"
import { Features } from "@/components/features"
import { TestimonialsComponent } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { type Analysis } from "@/types/analysis"
import { FaqSection } from "@/components/ui/faq-section"
import { ApiQuotaProvider } from "@/lib/contexts/ApiQuotaContext"

export default function AIAudioAnalysisLanding() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    let animationFrameId: number | null = null;

    const updateMousePosition = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        document.documentElement.style.setProperty("--mouse-x", x.toString());
        document.documentElement.style.setProperty("--mouse-y", y.toString());
      });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  const handleAnalysisComplete = (data: Analysis, file: File, url: string) => {
    console.log('🔍 Main Page - handleAnalysisComplete called with data:', data);
    console.log('🔍 Main Page - Analysis keys:', Object.keys(data));
    console.log('🔍 Main Page - File:', file.name, file.size);
    console.log('🔍 Main Page - URL:', url);
    
    setAnalysis(data);
    setError(null);
    setAudioFile(file);
    setAudioUrl(url);
  };

  const handleError = (error: string) => {
    console.error('Analysis error:', error);
    setError(error);
    setAnalysis(null);
    setAudioFile(null);
    setAudioUrl(null);
  };

  const handleRetry = () => {
    setError(null);
    setAnalysis(null);
    setAudioFile(null);
    setAudioUrl(null);
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
    setAudioFile(null);
    setAudioUrl(null);
    // Scroll back to the top of the hero section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ApiQuotaProvider>
      <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />
        <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-white/20 origin-left z-50 shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ scaleX }} />
        
        <Header />

        <main className="flex flex-col w-full">
          {!analysis && !error && (
            <HeroSection 
              onUploadComplete={handleAnalysisComplete}
              onError={handleError}
              onReset={handleReset}
              showUploader={true}
            />
          )}

          {(analysis || error) && (
            <motion.section
              className="pt-32 pb-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="container mx-auto px-4">
                {analysis && <AudioAnalysis analysis={analysis} audioFile={audioFile} audioUrl={audioUrl} onReset={handleReset} />}
                {error && (
                  <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8 backdrop-blur-sm">
                      <div className="text-red-400 text-6xl mb-4">⚠️</div>
                      <h2 className="text-2xl font-bold text-white mb-4">Analysis Failed</h2>
                      <p className="text-gray-300 mb-6">
                        {error.includes('Could not find valid JSON') 
                          ? "The AI analysis couldn't process your audio file properly. This might be due to file format issues or the AI service being temporarily unavailable."
                          : error.includes('API key') 
                          ? "There's an issue with the API configuration. Please check your settings."
                          : "Something went wrong while analyzing your audio file. Please try again."
                        }
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={handleRetry}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                          Try Again
                        </button>
                        <button
                          onClick={handleReset}
                          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                          Upload Different File
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {!analysis && !error && (
            <>
              <section id="features" className="w-full">
                <Features />
              </section>
              
              {/* <section id="testimonials" className="w-full">
                <TestimonialsComponent />
              </section>
              
              <section id="pricing" className="w-full">
                <Pricing />
              </section> */}

              <section id="faq" className="w-full">
                <FaqSection />
              </section>
            </>
          )}
        </main>

        <Footer />
      </div>
    </ApiQuotaProvider>
  );
}

