import {
  MixerHorizontalIcon,
  SpeakerLoudIcon,
  BarChartIcon,
  LightningBoltIcon,
  StarIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: MixerHorizontalIcon,
    name: "Smart Analytics",
    description: "Breaks down your track to spot muddy lows, clashing melodies, or overworked drums.",
    href: "#",
    cta: "Get Started",
    background: (
      <video
        className="absolute left-0 top-0 h-full w-full object-cover opacity-30"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/avatars/20250410_2052_Futuristic Audio Visualization_loop_01jrh5bhazf12syrgkfn0ev7ge.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: SpeakerLoudIcon,
    name: "Genre Recognition",
    description: "Detects your track's genre and highlights subtle influences like lo-fi or trap.",
    href: "#",
    cta: "Get Started",
    background: (
      <img
        src="/avatars/Futuristic_Music_Producer.png"
        alt="Futuristic Music Producer"
        className="absolute left-0 top-0 h-full w-full object-cover opacity-40"
      />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: BarChartIcon,
    name: "Performance Metrics",
    description: "Scores your mix, melody, rhythm, and harmony to show where you're strong or slipping.",
    href: "#",
    cta: "Get Started",
    background: null,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: LightningBoltIcon,
    name: "Detailed Feedback",
    description: "Get precise tips like \"lower reverb\" or \"tighten your snare timing\" to improve your mix.",
    href: "#",
    cta: "Get Started",
    background: null,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: StarIcon,
    name: "Music Enhancement",
    description: "Get suggestions to sharpen your sound, structure your song, and finish with confidence.",
    href: "#",
    cta: "Get Started",
    background: (
      <img
        src="/avatars/Mesmerizing_Aurora.gif"
        alt="Mesmerizing Aurora background"
        className="absolute left-0 top-0 h-full w-full object-cover opacity-10"
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export function BentoDemo() {
  const scrollToUpload = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Powerful Features</h2>
          <p className="text-lg text-neutral-400">
            Discover how our audio analysis tools help you create better music
          </p>
        </div>
        <BentoGrid className="lg:grid-rows-3">
          {features.map((feature) => (
            <BentoCard 
              key={feature.name} 
              {...feature} 
              onClick={scrollToUpload}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
} 