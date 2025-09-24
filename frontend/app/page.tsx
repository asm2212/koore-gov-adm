import { HomeSection } from "@/components/layout/sections/home";

import { ServicesSection } from "@/components/layout/sections/services";
import { ContactSection } from "@/components/layout/sections/contact";
import { FooterSection } from "@/components/layout/sections/footer";

import { NewsSection } from "@/components/layout/sections/NewsSection";
import { ChiefVoiceSection } from "@/components/layout/sections/chiefvoice";
import { FeaturesSection } from "@/components/layout/sections/features";
import { Home1Section } from "@/components/layout/sections/home1";

export const metadata = {
  title: "Home | Koore Zone Government Administration office",
  description: "Welcome to the official communication portal of Koore Zone. Access public services, news, and announcements.",
};

export default function HomePage() {
  return (
    <>
    <Home1Section />
      <HomeSection />
       <NewsSection />
<FeaturesSection />
<ChiefVoiceSection />

      <ContactSection />
      <FooterSection />
    </>
  );
}