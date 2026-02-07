import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Users, Send, Check, PartyPopper, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertRsvpSchema, type InsertRsvp } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function Invitation() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  useDocumentTitle("Mission Briefing - The Heist");

  const form = useForm<InsertRsvp>({
    resolver: zodResolver(insertRsvpSchema),
    defaultValues: {
      name: "",
      attendees: 1,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertRsvp) => {
      const res = await apiRequest("POST", "/api/rsvp", data);
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRsvp) => {
    mutation.mutate(data);
  };

  const details = [
    {
      icon: Calendar,
      label: "Date",
      value: "Monday, March 9, 2026",
    },
    {
      icon: Clock,
      label: "Time",
      value: "6:30 PM",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "The Secret Vault — our house. Exact coordinates disclosed upon confirmed RSVP.",
    },
    {
      icon: Users,
      label: "Dress Code",
      value: "Come disguised as your favorite thief. From Ocean\u2019s 8 to Dhoom 2, Bunty Aur Bubli to the Louvre heist masterminds, Money Heist to Team Diamond \u2014 the aliases are endless.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 rounded-full"
          style={{ background: "radial-gradient(circle, hsl(43 85% 55% / 0.03) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 sm:py-24">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            data-testid="button-back-home"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Button>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-primary mb-4">
              Mission Briefing
            </p>
            <h1
              className="font-serif text-4xl sm:text-6xl font-bold mb-4"
              data-testid="text-invitation-title"
            >
              You&apos;re <span className="text-primary">In</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
              The crew has been assembled. Your presence is required for the most
              risqu&eacute; heist of the year. Be ready to eat, drink, and crack
              some clues to acquire a very special crystal.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 sm:p-8 mb-8">
              <div className="space-y-5">
                {details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <detail.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-1">
                        {detail.label}
                      </p>
                      <p className="text-foreground font-medium" data-testid={`text-detail-${detail.label.toLowerCase()}`}>
                        {detail.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            {!submitted ? (
              <Card className="p-6 sm:p-8">
                <h2 className="font-serif text-2xl font-bold mb-2" data-testid="text-rsvp-heading">
                  Confirm Your Spot
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Let us know you&apos;re coming. Every heist needs its crew.
                </p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name (Code Name Accepted)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your name..."
                              {...field}
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="attendees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Crew Size</FormLabel>
                          <Select
                            onValueChange={(val) => field.onChange(parseInt(val))}
                            defaultValue={String(field.value)}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-attendees">
                                <SelectValue placeholder="How many?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6].map((num) => (
                                <SelectItem key={num} value={String(num)}>
                                  {num} {num === 1 ? "person" : "people"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={mutation.isPending}
                      data-testid="button-submit-rsvp"
                    >
                      {mutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          />
                          Securing your spot...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Confirm RSVP
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              </Card>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card className="p-8 sm:p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h2 className="font-serif text-3xl font-bold mb-3" data-testid="text-confirmation">
                    You&apos;re on the crew
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Your RSVP has been locked in. See you at the heist.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <PartyPopper className="w-5 h-5" />
                    <span className="font-mono text-sm tracking-widest uppercase">
                      Mission Accepted
                    </span>
                    <PartyPopper className="w-5 h-5" />
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-12">
            <p className="text-xs text-muted-foreground/60 font-mono">
              This invitation is confidential. Do not forward to non-crew members.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
