"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { AudioAnalysis } from "@/components/AudioAnalysis"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { type Analysis } from "@/types/analysis"

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
    setAnalysis(data);
    setError(null);
    setAudioFile(file);
    setAudioUrl(url);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50" style={{ scaleX }} />
      
      <Header />

      <main>
        <HeroSection 
          onUploadComplete={handleAnalysisComplete}
          onError={handleError}
          onReset={handleReset}
          showUploader={!analysis && !error}
        />

        {(analysis || error) && (
          <motion.section
            className="analysis pt-4 pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-4">
              {analysis && <AudioAnalysis analysis={analysis} audioFile={audioFile} audioUrl={audioUrl} onReset={handleReset} />}
            </div>
          </motion.section>
        )}

        <div id="features">
          <Features />
        </div>
        
        <div id="testimonials">
          <Testimonials />
        </div>
        
        <div id="pricing">
          <Pricing />
        </div>
      </main>

      <Footer />
    </div>
  );
}

