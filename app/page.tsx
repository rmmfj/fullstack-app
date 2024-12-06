"use client";

import HeroSection from "@/components/landing-page/hero-section";
import ImageSearchSection from "@/components/landing-page/image-search-section";
import OverviewSection from "@/components/landing-page/overview-section";
import RecommendationSection from "@/components/landing-page/recommendation-section";
import TestimonialSection from "@/components/landing-page/testimonial-section";
import TextSearchSection from "@/components/landing-page/text-search-section";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const [showButton, setShowButton] = useState(true)
  const overviewSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = window.innerHeight * 0.5;

      if (scrollPosition > threshold) {
        setShowButton(false);
      } else {
        setShowButton(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSecondSection = () => {
    console.log('scroll')
    overviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    setShowButton(false);
  }

  return (
    <div className='min-h-screen w-full bg-gray-50 flex flex-col pt-8'>
      <HeroSection />
      
      <section ref={overviewSectionRef}>
        <OverviewSection  />
      </section>
      <RecommendationSection />
      <TextSearchSection />
      <ImageSearchSection />
      <TestimonialSection />
      {/* Floating Button */}
      
      {showButton && (
        <div className="w-full fixed bottom-4 flex items-center justify-center">
          <Button
            className="rounded-full p-3 shadow-lg animate-bounce opacity-50"
            onClick={scrollToSecondSection}
            variant='outline'
          >
            <ChevronDown className="h-6 w-6" />
            <span className="sr-only">Scroll to next section</span>
          </Button>
        </div>
      )}
    </div>
  );
}
