"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Factory,
  Cpu,
  PiggyBank,
  Building2,
  Leaf,
  Landmark,
  Users,
  Scale,
  Globe2,
} from "lucide-react";
import { motion } from "framer-motion";

interface PillarProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const pillarList: PillarProps[] = [
  { icon: TrendingUp, title: "Quality Economic Growth and Shared Prosperity", description: "Achieving inclusive and sustainable economic growth that raises living standards and ensures shared prosperity for all citizens." },
  { icon: Factory, title: "Economic Productivity and Competitiveness", description: "Boosting industrial output, agricultural productivity, and trade competitiveness in local and global markets." },
  { icon: Cpu, title: "Technological Capability and Digital Economy", description: "Building digital infrastructure, fostering innovation, and strengthening technological capacity across sectors." },
  { icon: PiggyBank, title: "Sustainable Development Financing", description: "Mobilizing domestic and international financing to ensure long-term sustainability of development projects." },
  { icon: Building2, title: "Private Sector-led Economic Growth", description: "Encouraging entrepreneurship, investment, and private sector participation in driving the national economy." },
  { icon: Leaf, title: "Resilient Green Economy", description: "Promoting climate resilience, environmental protection, and green growth strategies for sustainable livelihoods." },
  { icon: Landmark, title: "Institutional Transformation", description: "Strengthening governance, transparency, and accountability through modernized institutions and service delivery." },
  { icon: Users, title: "Gender and Social Inclusion", description: "Advancing equity, empowerment, and participation of women, youth, and marginalized communities in development." },
  { icon: Scale, title: "Access to Justice and Efficient Civil Services", description: "Expanding justice accessibility, strengthening rule of law, and modernizing civil service systems." },
  { icon: Globe2, title: "Regional Peace Building and Economic Integration", description: "Enhancing regional cooperation, peace, and economic integration for mutual growth and stability." },
];

export const FeaturesSection = () => {
  return (
    <section
      id="pillars"
      className="w-full bg-background py-24 sm:py-32 px-4 lg:px-0"
      aria-labelledby="pillars-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <p
            id="pillars-heading"
            className="text-lg text-accent font-semibold tracking-wider uppercase"
          >
            Strategic Pillars
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Ten-Year Development Plan
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The vision is to achieve improved welfare and raise the standard of living by addressing macroeconomic, sectoral, and institutional challenges.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {pillarList.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="h-full border border-border bg-card/80 backdrop-blur-md shadow-md hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group">
                  <CardHeader className="flex flex-col items-center space-y-3 pb-4">
                    <div className="p-3 bg-accent/20 text-accent rounded-full group-hover:bg-accent/30 transition-colors">
                      <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground text-center px-2">
                      {pillar.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed text-center">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
