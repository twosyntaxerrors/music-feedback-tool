"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

interface Testimonial {
  image: string
  name: string
  username: string
  text: string
  social: string
}

interface TestimonialsProps {
  testimonials?: Testimonial[]
  className?: string
  title?: string
  description?: string
  maxDisplayed?: number
}

const placeholderColors = [
  "34D399", // Emerald
  "FBBF24", // Amber
  "EC4899", // Pink
  "8B5CF6", // Violet
  "60A5FA", // Blue
  "A78BFA", // Purple
];

const generatePlaceholderUrl = (index: number) => {
  const color = placeholderColors[index % placeholderColors.length];
  return `https://placehold.co/40x40/${color}/FFFFFF/?text=%20`; // 40x40, chosen color bg, white text (space)
};

const existingTestimonials: Testimonial[] = [
  {
    name: "Erv Noel",
    username: "@ervnoel",
    text: "This actually gave me good feedback on how to improve my mix. DO NOT SLEEP! This is fire.",
    image: generatePlaceholderUrl(0),
    social: "https://i.imgur.com/VRtqhGC.png",
  },
  {
    name: "Leonardo Givenchy",
    username: "@leogivenchy",
    text: "Crazy how accurate this is when it comes to listening to my lyrics and understanding what I'm going for. Honestly I'm impressed.",
    image: generatePlaceholderUrl(1),
    social: "https://i.imgur.com/VRtqhGC.png",
  },
  {
    name: "Alex Tumay",
    username: "@alextumay",
    text: "I use this as a second ear nowadays. It's great to get an idea on subtle improvements that can really elevate the music I'm working on.",
    image: generatePlaceholderUrl(2),
    social: "https://i.imgur.com/VRtqhGC.png",
  },
];

const demoTestimonials: Testimonial[] = [
    {
    image: generatePlaceholderUrl(3),
    text: 'Been stuck on this chorus melody for days. Used this and BAM! Flowing like water now. This thing is wild.',
    name: 'Alice Johnson',
    username: '@alicejohnson',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: generatePlaceholderUrl(4),
    text: 'Mind blown at how this thing really listens to my music🤯.',
    name: 'David Smith',
    username: '@davidsmith',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: generatePlaceholderUrl(5),
    text: 'The fact that this is free and I don\'t have to sign in is everything. I can just use it.',
    name: 'Emma Brown',
    username: '@emmabrown',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: generatePlaceholderUrl(0), // Cycle colors
    text: 'Was skeptical, but this actually helped tighten up my low end. Mixes are sounding cleaner already. Legit impressed.',
    name: 'James Wilson',
    username: '@jameswilson',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: generatePlaceholderUrl(1),
    text: 'This is like having a secret weapon for improving my drum bounces. It suggested a perc loop, and now my beat is soooo much better.',
    name: 'Sophia Lee',
    username: '@sophialee',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: generatePlaceholderUrl(2),
    text: 'Helped me pinpoint why my vocal wasn\'t sitting right. Small tweak, huge difference. This is essential.',
    name: 'Michael Davis',
    username: '@michaeldavis',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: generatePlaceholderUrl(3),
    text: 'If you make beats, you NEED to check this out. Seriously sped up my process for finding the right drum groove.',
    name: 'Emily Chen',
    username: '@emilychen',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: generatePlaceholderUrl(4),
    text: 'Uploaded something from Udio just to see what it would say. It got the vibe of the song so well. Lowkey shocked.',
    name: 'Robert Lee',
    username: '@robertlee',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: generatePlaceholderUrl(5),
    text: 'This is becoming my go-to for a quick vibe check. Surprisingly insightful feedback every time.',
    name: 'Sarah Taylor',
    username: '@sarahtaylor',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
];

const allTestimonials = [...existingTestimonials, ...demoTestimonials];

export function TestimonialsComponent({
  testimonials = allTestimonials,
  className,
  title = "Read what people are saying",
  description = "Feedback from music professionals and virtual customers using our platform.",
  maxDisplayed = 8,
}: TestimonialsProps) {
  const openInNewTab = (url: string) => {
    window.open(url, "_blank")?.focus()
  }

  return (
    <section id="testimonials" className={cn("py-24 bg-black/50 relative overflow-hidden", className)}>
       {/* Gradient background - kept from original */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-white/[0.02] to-black/0 pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center pt-5">
          <div className="flex flex-col gap-5 mb-16"> {/* Increased mb from 8 to 16 */}
            <h2 className="text-center text-3xl md:text-4xl font-bold text-white">{title}</h2> {/* Kept original styles */}
            <p className="text-center text-xl text-gray-400 max-w-2xl mx-auto"> {/* Kept original styles */}
              {description.split("<br />").map((line, i) => (
                <span key={i}>
                  {line}
                  {i !== description.split("<br />").length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="relative">
          <div
            className={cn(
              "flex justify-center items-center gap-8 flex-wrap", // Increased gap from 5 to 8
            )}
          >
            {testimonials
              .slice(0, maxDisplayed)
              .map((testimonial, index) => (
                <Card
                  key={index}
                  className="w-80 h-auto p-6 relative bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 group backdrop-blur-sm" // Adjusted padding and kept original styles
                >
                   <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> {/* Kept from original */}
                   <div className="relative z-10"> {/* Added relative z-10 from original */}
                    <div className="flex items-center">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={40} // Reduced size
                        height={40} // Reduced size
                        className="rounded-full"
                      />
                      <div className="flex flex-col pl-3"> {/* Reduced padding */}
                        <span className="font-medium text-white"> {/* Adjusted styles */}
                          {testimonial.name}
                        </span>
                        <span className="text-sm text-gray-500"> {/* Adjusted styles */}
                          {testimonial.username}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 mb-4"> {/* Adjusted margin */}
                      <p className="text-gray-400 text-sm leading-relaxed"> {/* Adjusted styles */}
                        {testimonial.text}
                      </p>
                    </div>
                    <button
                      onClick={() => openInNewTab(testimonial.social)}
                      className="absolute top-4 right-4 hover:opacity-80 transition-opacity text-gray-400 hover:text-white" // Adjusted styles
                    >
                      <Icons.twitter className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}

