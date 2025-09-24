"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const ChiefVoiceSection = () => {
  const backgroundImage = "/chairman2.jpg";
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      id="chief-voice"
      className="relative w-full overflow-hidden bg-[#00150C] text-white"
      aria-labelledby="chief-voice-heading"
    >
      <div className="flex flex-col lg:flex-row min-h-screen lg:h-[90vh]">
        {/* Image Section */}
        <div className="relative w-full lg:w-2/5 h-64 sm:h-80 md:h-96 lg:h-full">
          <Image
            src={backgroundImage}
            alt="Koore Government Chief delivering a community talk"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover object-center"
            quality={90}
          />

          {/* Mobile Overlay Text */}
          <div className="absolute inset-0 flex items-center justify-center lg:hidden bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-center px-6"
            >
              <h1
                id="chief-voice-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
              >
                Chief’s Voice
              </h1>
              <p className="text-sm sm:text-base text-gray-200 mt-1 max-w-xs mx-auto">
                Koore Government Chief Talk
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 w-full lg:w-3/5 xl:w-2/3 px-6 sm:px-10 lg:px-16 py-12 lg:py-0 flex flex-col justify-center">
          <div className="max-w-2xl space-y-6 sm:space-y-8">
            {/* Chief Name & Title */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:block"
            >
              <h1
                id="chief-voice-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              >
                Tarekegn Bekele
              </h1>
              <p className="text-lg md:text-xl text-[#00C764] mt-2 font-medium">
                Chief Administrator of Koore Zone
              </p>
            </motion.div>

            {/* Core Message */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-[#001A0F]/80 backdrop-blur-md border border-[#002214] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-[#00C764] mb-2">
                Diversity is our Strength for Growth!
              </h2>
              <p className="italic leading-relaxed text-gray-300">
                “Building instead of tearing down: it should be part of our daily practice to move closer to each other with love and understanding. By nurturing our relationships with each other, we can achieve growth and prosperity. This requires the willingness of every citizen to take responsibility for this activity. Through coming together and supporting one another, we can climb the tower of success much faster.”
              </p>
            </motion.div>

            {/* Brotherhood & Sisterhood Message */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-[#001A0F]/80 backdrop-blur-md border border-[#002214] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-[#00C764] mb-2">
                Brotherhood and Sisterhood
              </h2>
              <p className="italic leading-relaxed text-gray-300">
                “As brotherhood and sisterhood continue to strengthen, our peace will be unbreakable. Their role is irreplaceable for rapid development and common prosperity. Therefore, every citizen should fulfill their responsibility so that our solidarity can develop.”
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Vertical Line (Desktop Only) */}
      <div className="hidden lg:block absolute top-1/3 left-[40%] w-px h-1/3 bg-[#00C764]/30 pointer-events-none"></div>
    </section>
  );
};