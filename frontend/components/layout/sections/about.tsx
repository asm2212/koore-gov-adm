import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Landmark, Coffee, Leaf, History, Shield } from "lucide-react";
import Image from "next/image";

const AboutSection = () => {
  return (
    <section className="min-h-screen bg-[#00150C] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Title */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00C764] mb-4 tracking-tight">
            About Koore Zone
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Discover the rich culture, history, and geography of Koore Zone —
            home to the resilient Koore people and their vibrant enset-based civilization.
          </p>
        </div>

        {/* Establishment & History Section */}
        <Card className="bg-[#002214] border border-[#004429] shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-[#00C764]">
              <Landmark className="w-6 h-6" />
              Establishment & History
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Koore refers to an ethnic group and the associated <strong>Koorete language</strong> in the Koore Zone (also known as Amaro Zone), located in the South Ethiopia Regional State.
              </p>
              <p>
                The Koore people are believed to be descendants of <strong>Christian missionaries</strong> who migrated from northern Ethiopia between the 11th and 13th centuries, bringing with them cultural and agricultural traditions that endure to this day.
              </p>
              <p>
                Administratively, <strong>Amaro Zone received its current zonal status in August 2023</strong> upon the formation of the South Ethiopia Regional State, marking a new chapter in local governance and development.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Location */}
        <Card className="bg-[#002214] border border-[#004429] shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-[#00C764]">
              <MapPin className="w-6 h-6" />
              Geographic Location
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                The Koore people primarily inhabit the <strong>Amaro special woreda (district)</strong> and the mountainous regions east of <strong>Lake Abaya</strong> — a landscape defined by fertile highlands, traditional irrigation, and breathtaking natural beauty.
              </p>
              <div className="w-full h-80 sm:h-96 relative rounded-xl overflow-hidden shadow-md border border-[#004429] mt-6">
                <Image
                  src="/map.jpg"
                  alt="Map highlighting Koore Zone in South Ethiopia Regional State"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                  Koore Zone, South Ethiopia
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Culture & Economy */}
        <Card className="bg-[#002214] border border-[#004429] shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-[#00C764]">
              <Leaf className="w-6 h-6" />
              Culture & Economy
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div>
                <h3 className="text-lg font-semibold text-[#00D96F] flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5" />
                  Enset Culture
                </h3>
                <p>
                  Enset, or “false banana,” is the <strong>staple crop</strong> of the Koore people, cultivated across diverse agro-ecological zones. This resilient plant forms the backbone of food security and cultural identity.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#00D96F] flex items-center gap-2 mb-2">
                  <Coffee className="w-5 h-5" />
                  Cash Crops
                </h3>
                <p>
                  Beyond enset, the Koore economy thrives on high-value exports: <strong>coffee, chili, chat (khat), and lemons</strong>. These crops connect local farmers to regional and global markets.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#00D96F] flex items-center gap-2 mb-2">
                  <History className="w-5 h-5" />
                  Agricultural Heritage
                </h3>
                <p>
                  The region features <strong>traditional irrigation systems</strong> passed down through generations. While terrace agriculture is practiced, it is less intensive than in neighboring Konso — reflecting unique local adaptations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conflict & Security */}
        <Card className="bg-[#002214] border border-[#004429] shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-[#00C764]">
              <Shield className="w-6 h-6" />
              Conflict & Security
            </h2>
            <p className="text-gray-300 leading-relaxed">
              The Koore Zone has, at times, experienced <strong>ethnic tensions and violence</strong> involving minority groups. Local and regional authorities continue to implement preventative security measures and community dialogue initiatives to ensure lasting peace and social cohesion.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;