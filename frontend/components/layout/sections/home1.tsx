"use client";

import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
// import { Navbar } from "./navbar";
import { ChevronDown } from "lucide-react";

// ——————————————————————————————————————————————————
// VIDEO BACKGROUND COMPONENT
// ——————————————————————————————————————————————————
const VideoBackground = ({ src, poster }: { src: string; poster: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((err) => {
          console.warn("Autoplay failed:", err.message);
          setError("Video autoplay blocked or failed to load.");
        });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(handlePlay, 500);
    return () => clearTimeout(timer);
  }, [handlePlay]);

  if (error) {
    return (
      <Image
        src={poster}
        alt="Fallback background image"
        fill
        className="object-cover"
        priority
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

// ——————————————————————————————————————————————————
// FADE IN ANIMATION WRAPPER
// ——————————————————————————————————————————————————
const FadeIn = ({
  children,
  delay = 0,
  direction = "up",
  duration = 0.8,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
}) => {
  const getInitial = () => {
    switch (direction) {
      case "down":
        return { opacity: 0, y: -30 };
      case "left":
        return { opacity: 0, x: 40 };
      case "right":
        return { opacity: 0, x: -40 };
      default:
        return { opacity: 0, y: 30 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// ——————————————————————————————————————————————————
// HERO SECTION (FULLSCREEN VIDEO)
// ——————————————————————————————————————————————————
export const HeroSection = () => {
  const backgroundVideo = "/koore.mp4";
  const posterImage = "/chairman1.jpg";

  const handleScrollDown = () => {
    const nextSection = document.getElementById("content-section");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full h-screen">
      <Suspense fallback={<div className="w-full h-full bg-muted animate-pulse" />}>
        <VideoBackground src={backgroundVideo} poster={posterImage} />
      </Suspense>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#00150C]/90 to-transparent pointer-events-none"></div>

      {/* Overlay text */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <FadeIn>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Welcome to Koore Zone
          </h1>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-lg sm:text-xl md:text-2xl text-[#00C764] mt-4 drop-shadow-md">
            Driving Development, Unity, and Prosperity
          </p>
        </FadeIn>

        {/* Scroll down arrow */}
        <button
          onClick={handleScrollDown}
          className="absolute bottom-8 animate-bounce text-white hover:text-[#00C764] transition-colors"
          aria-label="Scroll down to content"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  );
};

// ——————————————————————————————————————————————————
// CONTENT SECTION
// ——————————————————————————————————————————————————
export const ContentSection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section id="content-section" className="w-full bg-[#00150C] text-white py-16 px-4 lg:px-0">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-12">
        <FadeIn>
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Tarekegn Bekele
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-[#00C764] mt-4 font-medium">
              Chief Administrator of Koore Zone
            </p>
          </div>
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Photo */}
          <div className="relative w-full lg:w-2/5 aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden shadow-xl group">
            <Image
              src="/chairman1.jpg"
              alt="Chief Administrator Tarekegn Bekele"
              fill
              className={`object-cover object-center transition-opacity duration-700 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              priority
            />
          </div>

          {/* Mission & Vision */}
          <div className="w-full lg:w-3/5 space-y-8">
            {/* Mission */}
            <FadeIn delay={0.2} direction="left">
              <div className="bg-[#001A0F]/80 backdrop-blur-md border border-[#002214] rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]">
                <h2 className="text-xl sm:text-2xl font-bold text-[#00C764] mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-[#00C764] rounded-full animate-pulse"></span>
                  Our Mission
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  By establishing the rule of law and democracy, ensuring equitable development benefits for all nations and peoples, and creating a region conducive to citizen well-being and progress, we aim to ensure sustainable economic growth and shared prosperity.
                </p>
              </div>
            </FadeIn>

            {/* Vision */}
            <FadeIn delay={0.4} direction="left">
              <div className="bg-[#001A0F]/80 backdrop-blur-md border border-[#002214] rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]">
                <h2 className="text-xl sm:text-2xl font-bold text-[#00C764] mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-[#00C764] rounded-full animate-pulse"></span>
                  Our Vision
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  To become a symbol of prosperity by building an economic and political society grounded in strong national unity, inclusive governance, and sustainable development.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

// ——————————————————————————————————————————————————
// HOME SECTION
// ——————————————————————————————————————————————————
export const Home1Section = () => {
  return (
    <div className="w-full m-0 p-0 bg-[#00150C] text-white">
      <HeroSection />
      <ContentSection />
    </div>
  );
};