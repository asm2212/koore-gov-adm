"use client";

import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebook,
  FaTelegram,
  FaTwitter,
  FaTiktok,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";

// --- Social Links ---
const socialLinks = [
  {
    href: "https://www.facebook.com/kzc.koore?mibextid=ZbWKwL",
    label: "Follow us on Facebook",
    icon: <FaFacebook className="text-white group-hover:text-[#00C764] transition-colors" size={18} />,
    desc: "Connect with us on Facebook for official updates and community engagement.",
  },
  {
    href: "https://t.me/koorezonegovtcom",
    label: "Join us on Telegram (Official)",
    icon: <FaTelegram className="text-white group-hover:text-[#00C764] transition-colors" size={18} />,
    desc: "Real-time announcements and emergency alerts via Telegram.",
  },
  {
    href: "https://x.com/koorezone2024",
    label: "Follow us on X (Twitter)",
    icon: <FaTwitter className="text-white group-hover:text-[#00C764] transition-colors" size={18} />,
    desc: "Latest news and updates from Koore Zone Government.",
  },
  {
    href: "https://www.tiktok.com/@koorezonegovecommunicati",
    label: "Follow us on TikTok",
    icon: <FaTiktok className="text-white group-hover:text-[#00C764] transition-colors" size={18} />,
    desc: "Engaging public awareness videos and campaigns.",
  },
  {
    href: "https://www.instagram.com/koorezonegovecommunication.123/",
    label: "Follow us on Instagram",
    icon: <FaInstagram className="text-white group-hover:text-[#00C764] transition-colors" size={18} />,
    desc: "Visual stories from Koore Zone: events, tourism, and culture.",
  },
  {
    href: "https://whatsapp.com/channel/0029VauIpRIBvvsh2ymxyD09",
    label: "Join us on WhatsApp",
    icon: <FaWhatsapp className="text-white group-hover:text-[#00C764] transition-colors" size={18} />,
    desc: "Get instant updates and contact support via WhatsApp.",
  },
];

export const FooterSection = () => {
  return (
    <footer
      id="footer"
      className="bg-[#00150C] w-full py-12 sm:py-16 lg:py-20"
      aria-labelledby="footer-heading"
    >
      <div className="container px-6 lg:px-8 mx-auto">
        <h2 id="footer-heading" className="sr-only">
          Site Footer
        </h2>

        {/* === FULL-WIDTH MAP SECTION === */}
        <div className="w-full mb-16">
          <h3 className="font-semibold text-lg sm:text-xl text-center text-white mb-6">
            Our Location
          </h3>
          <div className="w-full overflow-hidden rounded-xl border border-[#002214] shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7938.281157304204!2d37.89946209085643!3d5.8357995615124985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17baf5f7dd4a5591%3A0x8097ac007b25be0c!2sKoore%20Zone%20Administration%20Office!5e0!3m2!1sen!2set!4v1755531920819!5m2!1sen!2set"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Koore Zone Administration Office Location"
              aria-label="Map showing location of Koore Zone Administration Office in Amaro Kelle, Ethiopia"
              className="w-full h-auto min-h-[300px] sm:h-[400px] lg:h-[450px]"
            ></iframe>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-12">
          {/* Logo & Brand */}
          <div className="col-span-1 lg:col-span-2">
<Link href="/" className="flex items-center font-bold text-white">
  <Image
    src="/logo.jpg"
    alt="Koore Zone Logo"
    width={70}   // bigger size
    height={70}
    className="rounded-full mr-2 border-2 border-[#00C764] object-cover"
  />
</Link>


            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Government Communication Administration Office
              <br />
              <span className="opacity-80">
                Serving the people with transparency, access, and trust.
              </span>
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-white">Contact Us</h3>
            <address className="not-italic space-y-3 text-sm text-gray-300">
              <div>
                <span className="font-medium text-gray-200">Phone:</span>{" "}
                <Link
                  href="tel:+251960994160"
                  className="hover:text-[#00C764] transition-colors underline-offset-2 hover:underline ml-1"
                >
                  +251 960 994 160
                </Link>
              </div>
              <div>
                <span className="font-medium text-gray-200">Email:</span>{" "}
                <Link
                  href="mailto:info@koore.gov.et"
                  className="hover:text-[#00C764] transition-colors underline-offset-2 hover:underline ml-1"
                >
                  info@koore.gov.et
                </Link>
              </div>
              <div>
                <span className="font-medium text-gray-200">Address:</span>
                <p className="mt-1 text-gray-300">
                  Koore Zone Administration Office
                  <br />
                  Amaro Kelle, Ethiopia
                  <br />
                  P.O. Box 123
                </p>
              </div>
            </address>
          </div>

          {/* Related Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-white">Related Links</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link
                  href="https://www.southethiopiarspo.gov.et/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block hover:text-[#00C764] transition-colors underline-offset-2 hover:underline"
                >
                  South Ethiopia Region President Office
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-block hover:text-[#00C764] transition-colors underline-offset-2 hover:underline"
                >
                  Koore Zone  Communication Bureau
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.segocom.gov.et/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block hover:text-[#00C764] transition-colors underline-offset-2 hover:underline"
                >
                  South Ethiopia Region Communication Bureau
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="col-span-1 lg:col-span-2 xl:col-span-1">
            <h3 className="font-semibold text-lg text-white mb-4">Follow Us</h3>
            <ul className="space-y-3">
              {socialLinks.map((social, index) => (
                <li key={index}>
                  <Link
                    href={social.href.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#002214] transition-all group border border-transparent hover:border-[#00C764]/30"
                    aria-label={social.label}
                    title={social.desc}
                  >
                    <span className="text-[#00C764] group-hover:scale-110 transition-transform">
                      {social.icon}
                    </span>
                    <span className="text-sm text-gray-300 group-hover:text-[#00C764] transition-colors font-medium">
                      {social.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};