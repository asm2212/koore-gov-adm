"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Building2, Clock, Mail, Phone, Send } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Subject options
const subjectOptions = [
  "General Inquiry",
  "Service Request",
  "Feedback or Suggestion",
  "Report an Issue",
  "Media or Press",
  "Community Event",
  "Other",
] as const;

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, "First name is required").max(100),
  lastName: z.string().min(2, "Last name is required").max(100),
  email: z.string().email("Please enter a valid email"),
  subject: z.enum(subjectOptions),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">("idle");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setStatus("loading");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send message");
      }

      setStatus("success");
      form.reset();
    } catch (error: any) {
      console.error("Contact form error:", error);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="bg-[#00150C] py-24 sm:py-32 text-white">
      <div className="container mx-auto px-6 lg:px-8 grid gap-10 lg:gap-16 md:grid-cols-2">
        {/* Info Section */}
        <div className="space-y-6">
          <p className="text-lg text-[#00C764] font-medium tracking-wider">Contact</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Connect With Us</h2>
          <p className="text-gray-200 mb-8">
            We’re here to serve the people of Koore Zone. Reach out for inquiries, feedback, or assistance.
          </p>

          <div className="space-y-6 text-sm md:text-base">
            <div>
              <div className="flex items-center gap-2 font-semibold mb-1 text-white">
                <Building2 className="text-[#00C764]" /> Office Address
              </div>
              <p className="text-gray-300">
                Koore Zone Administration Office<br />
                Amaro Kelle Town, Southern Ethiopia<br />
                P.O. Box 123
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 font-semibold mb-1 text-white">
                <Phone className="text-[#00C764]" /> Phone
              </div>
              <p className="text-gray-300">
                +251 960 994160<br />
                +251 468 123456 (Admin)
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 font-semibold mb-1 text-white">
                <Mail className="text-[#00C764]" /> Email
              </div>
              <a href="mailto:info@koore.gov.et" className="text-[#00C764] hover:underline transition-colors">
                info@koore.gov.et
              </a>
            </div>

            <div>
              <div className="flex items-center gap-2 font-semibold mb-1 text-white">
                <Clock className="text-[#00C764]" /> Office Hours
              </div>
              <p className="text-gray-300">
                Mon – Fri: 8:00 AM – 4:00 PM<br />
                Closed on public holidays
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <Card className="bg-[#001A0F] border border-[#002214] shadow-sm hover:shadow-lg hover:shadow-[#00C764]/20 transition-all duration-300">
          <CardHeader>
            <h3 className="text-xl font-semibold text-white">Send a Message</h3>
            <p className="text-sm text-gray-400">
              We’ll get back to you within 2 business days.
            </p>
          </CardHeader>
          <CardContent>
            {status === "success" && (
              <Alert className="mb-4 bg-[#00C764]/10 border border-[#00C764]/30">
                <AlertTitle className="text-[#00C764]">Message Sent!</AlertTitle>
                <AlertDescription className="text-gray-200">
                  Thank you for your message. We’ll respond as soon as possible.
                </AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive" className="mb-4 bg-red-900/20 border border-red-800/30">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="text-red-200">
                  Something went wrong. Please try again later.
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-gray-200">First Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tadesse"
                            {...field}
                            className="bg-[#002214] border-[#003322] text-white placeholder:text-gray-500 focus:border-[#00C764] focus:ring-[#00C764]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-gray-200">Last Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Gebremariam"
                            {...field}
                            className="bg-[#002214] border-[#003322] text-white placeholder:text-gray-500 focus:border-[#00C764] focus:ring-[#00C764]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tadesse@koore.et"
                          {...field}
                          className="bg-[#002214] border-[#003322] text-white placeholder:text-gray-500 focus:border-[#00C764] focus:ring-[#00C764]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Subject *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger
                            className="bg-[#003322] border-[#003322] text-white focus:border-[#00C764]"
                          >
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#001A0F] border-[#003322] text-white">
                          {subjectOptions.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="focus:bg-[#003322] focus:text-[#00C764]"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Message *</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="How can we help you today?"
                          {...field}
                          className="bg-[#002214] border-[#003322] text-white placeholder:text-gray-500 focus:border-[#00C764] focus:ring-[#00C764]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto bg-[#00C764] hover:bg-[#00D96F] text-white font-medium transition-all duration-200 transform hover:scale-105"
                >
                  {status === "loading" ? (
                    <>
                      <span className="mr-2 animate-spin">●●●</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-xs text-gray-500">
            All communications are handled with confidentiality and respect.
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}