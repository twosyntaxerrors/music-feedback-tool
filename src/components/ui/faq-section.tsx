"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "What happens to my uploaded audio?",
    answer: "Your uploaded audio files are processed securely and temporarily stored only for the duration of the analysis. Once the analysis is complete, the files are automatically deleted. We prioritize your privacy and data security.",
    category: "Privacy & Security"
  },
  {
    question: "How accurate is the feedback?",
    answer: "While no automated system is perfect, our feedback is designed to be actionable and helpful for improving your music, focusing on key aspects like mix balance and overall sound quality. There may be some inaccuracies when it comes to lyrics or arrangement, but we're always working to improve.",
    category: "Analysis Quality"
  },
  {
    question: "What genres do you support?",
    answer: "We support all music genres! Our system has been trained on a wide variety of musical styles, from hip-hop and electronic to rock, classical, jazz, and everything in between. The analysis adapts to the specific characteristics of each genre.",
    category: "Features"
  },
  {
    question: "Do I need to be a professional?",
    answer: "Not at all! Our platform is designed for musicians at all skill levels, from beginners to professionals. Whether you're just starting out or you're an experienced producer, our feedback is tailored to help you improve your music production skills.",
    category: "Accessibility"
  },
  {
    question: "How long does the analysis take?",
    answer: "The analysis typically takes just a few seconds to complete. The exact time depends on the length of your track and the current server load, but you'll usually receive your detailed feedback within 15 seconds of uploading.",
    category: "Performance"
  },
  {
    question: "Can I use this on unfinished songs or rough drafts?",
    answer: "Absolutely! In fact, we encourage using our analysis tool throughout your production process. Getting feedback on rough drafts and works-in-progress can help guide your production decisions and save time in the long run.",
    category: "Usage"
  },
  {
    question: "Can I use this on loops or beats without vocals?",
    answer: "Yes! Our system can analyze any type of audio content, including instrumental tracks, loops, beats, and full songs with or without vocals. The feedback will be tailored to the specific type of content you upload.",
    category: "Features"
  }
];

export function FaqSection() {
  return (
    <section className="py-24 bg-gray-900/50 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-[#00fff2]/5 to-gray-900/0 pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-righteous mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00fff2] to-[#00c8ff] drop-shadow-[0_0_10px_rgba(0,255,242,0.3)]">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Find answers to common questions about our music analysis service
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={cn(
                  "mb-4 rounded-xl",
                  "backdrop-blur-sm bg-gray-800/30",
                  "border border-gray-700 hover:border-[#00fff2]/40",
                  "transition-all duration-300 group"
                )}
              >
                <AccordionTrigger 
                  className={cn(
                    "px-6 py-4 text-left hover:no-underline",
                    "data-[state=open]:border-b data-[state=open]:border-[#00fff2]/20"
                  )}
                >
                  <div className="flex flex-col gap-2">
                    {item.category && (
                      <Badge
                        variant="secondary"
                        className="w-fit text-xs font-normal bg-[#00fff2]/10 text-[#00fff2] border-[#00fff2]/20"
                      >
                        {item.category}
                      </Badge>
                    )}
                    <h3 className="text-lg font-medium text-gray-100 group-hover:text-[#00fff2] transition-colors">
                      {item.question}
                    </h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pt-4 pb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-gray-300 mb-4">
              Still have questions?
            </p>
            <p className="text-sm text-gray-400 mb-4">
              We're here to help! Reach out to our support team for assistance.
            </p>
            <Button 
              size="sm" 
              onClick={() => window.location.href = '/contact'}
              className="bg-[#00fff2] hover:bg-[#00c8ff] text-black font-semibold"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 