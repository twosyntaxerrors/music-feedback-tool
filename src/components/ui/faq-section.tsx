"use client";

import { FaqSectionWithCategories } from "./faq-with-categories";

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
    answer: "The analysis typically takes a few seconds to first listen. The exact time depends on the length of your track and the current server load, but you'll usually receive your detailed feedback within 25 seconds of uploading.",
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
    <FaqSectionWithCategories
      id="faq"
      title="Frequently Asked Questions"
      description="Find answers to common questions about our music analysis service"
      items={FAQ_ITEMS}
      contactInfo={{
        title: "Still have questions?",
        description: "Feel free to reach out to me directly via email.",
        buttonText: "Email Me",
        onContact: () => window.location.href = 'mailto:ervnoelproduction@gmail.com'
      }}
    />
  );
} 