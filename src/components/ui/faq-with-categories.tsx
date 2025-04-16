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
import { motion } from "framer-motion";

interface FaqSectionWithCategoriesProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  items: {
    question: string;
    answer: string;
    category?: string;
  }[];
  contactInfo?: {
    title: string;
    description?: string;
    buttonText: string;
    onContact?: () => void;
  };
}

const FaqSectionWithCategories = React.forwardRef<HTMLElement, FaqSectionWithCategoriesProps>(
  ({ className, title, description, items, contactInfo, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("py-24 bg-black/50 relative overflow-hidden", className)}
        {...props}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-white/[0.02] to-black/0 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4 text-white"
              >
                {title}
              </motion.h2>
              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-xl text-gray-400 max-w-2xl mx-auto"
                >
                  {description}
                </motion.p>
              )}
            </div>

            {/* FAQ Items */}
            <Accordion type="single" collapsible>
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="relative p-0 border-white/10 overflow-hidden rounded-2xl mb-4 last:mb-0"
                  >
                    <AccordionTrigger 
                      className="px-6 py-6 text-left hover:no-underline bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 rounded-t-2xl"
                    >
                      <div className="flex flex-col gap-2">
                        {item.category && (
                          <Badge
                            variant="secondary"
                            className="w-fit text-xs font-normal bg-white/10 text-white hover:bg-white/20 rounded-full"
                          >
                            {item.category}
                          </Badge>
                        )}
                        <h3 className="text-lg font-medium text-white">
                          {item.question}
                        </h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pt-4 pb-6 text-gray-400 bg-white/[0.01] rounded-b-2xl">
                      <p className="leading-relaxed">
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            {/* Contact Section */}
            {contactInfo && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: items.length * 0.1 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <p className="text-white mb-4">
                  {contactInfo.title}
                </p>
                {contactInfo.description && (
                  <p className="text-sm text-gray-400 mb-4">
                    {contactInfo.description}
                  </p>
                )}
                <Button 
                  size="sm" 
                  onClick={contactInfo.onContact}
                  className="bg-white/[0.02] border border-white/10 text-white hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
                >
                  {contactInfo.buttonText}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    );
  }
);
FaqSectionWithCategories.displayName = "FaqSectionWithCategories";

export { FaqSectionWithCategories }; 