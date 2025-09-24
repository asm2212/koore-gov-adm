"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

enum ServiceStatus {
  ACTIVE = "active",
  UPCOMING = "upcoming",
}

interface ServiceProps {
  title: string;
  status: ServiceStatus;
  description: string;
  href?: string;
}

const serviceList: ServiceProps[] = [
  { 
    title: "Local News Updates", 
    description: "Stay informed with real-time news and announcements from Koore Zone administrators.", 
    status: ServiceStatus.ACTIVE, 
    href: "/news" 
  },
  { 
    title: "Public Event Calendar", 
    description: "Access an updated list of community meetings, celebrations, and government events.", 
    status: ServiceStatus.ACTIVE, 
    href: "/events" 
  },
  { 
    title: "Online Document Requests", 
    description: "Apply for letters, certificates, and documents directly through the website.", 
    status: ServiceStatus.UPCOMING 
  },
  { 
    title: "Community Feedback Portal", 
    description: "Submit questions, suggestions, or issues for direct response from communication officers.", 
    status: ServiceStatus.ACTIVE ,
    href: "/contact" 

  },
];

export const ServicesSection = () => {
  return (
    <section 
      id="services" 
      className="bg-[#00150C] py-28 sm:py-36"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-6 px-6">
        <p className="text-[#00C764] font-semibold tracking-widest uppercase text-sm">
          Public Services
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white">
          What We Offer to Koore Citizens
        </h2>
        <p className="text-lg text-gray-200 mx-auto max-w-2xl leading-relaxed">
          Our goal is to improve transparency, communication, and accessibility between citizens and the local government of Koore Zone.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 gap-8 mt-16 max-w-6xl mx-auto px-6 lg:px-8">
        {serviceList.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            <Card className="group bg-[#001A0F] border border-[#002214] rounded-2xl shadow-sm hover:shadow-lg hover:shadow-[#00C764]/20 transform transition-all duration-300 hover:scale-105 relative overflow-hidden h-full">
              <CardHeader className="pb-6">
                {service.href ? (
                  <h3 className="flex items-center justify-between text-xl font-semibold text-white group-hover:text-[#00D96F] transition-colors cursor-pointer">
                    <Link href={service.href} className="flex-1 flex items-center">
                      {service.title}
                      <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                    </Link>
                  </h3>
                ) : (
                  <CardTitle className="text-xl font-semibold text-white">
                    {service.title}
                  </CardTitle>
                )}
                <CardDescription className="mt-2 text-gray-300 leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>

              {/* Status Badge */}
              <Badge
                variant="secondary"
                className={`absolute -top-2 -right-2 px-3 py-1 text-xs font-semibold rounded-full
                  ${service.status === ServiceStatus.ACTIVE
                    ? "bg-[#00C764]/20 text-[#00C764]"
                    : "bg-orange-500/20 text-orange-400"
                  }`}
              >
                {service.status === ServiceStatus.ACTIVE ? "Active" : "Upcoming"}
              </Badge>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};