import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock, ArrowRight, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function Home() {
  const [, navigate] = useLocation();
  useDocumentTitle("The Heist - You've Been Recruited");

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0">
        <img
          src="/images/heist-hero.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
      </div>

      <div className="absolute top-6 left-0 right-0 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex items-center gap-2"
        >
          <span
            className="text-xs font-mono tracking-[0.3em] uppercase text-primary/70"
            data-testid="text-classified"
          >
            Classified
          </span>
          <div className="w-12 h-px bg-primary/40" />
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-primary/70">
            Top Secret
          </span>
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-primary" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-sm font-mono tracking-[0.25em] uppercase text-primary mb-4"
          data-testid="text-subtitle"
        >
          You&apos;ve been recruited
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-6"
          data-testid="text-title"
        >
          <span className="text-foreground">The</span>{" "}
          <span className="text-primary">Heist</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-muted-foreground text-lg sm:text-xl max-w-md mb-12 leading-relaxed"
          data-testid="text-description"
        >
          Your mission, if you choose to accept it, awaits. Prove you&apos;re worthy to join the crew — or skip straight to the briefing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Button
            size="lg"
            onClick={() => navigate("/puzzle/1")}
            className="group text-base px-8 font-semibold"
            data-testid="button-start-heist"
          >
            <Lock className="w-4 h-4 mr-2" />
            Start the Heist
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate("/invitation")}
            className="text-muted-foreground text-base"
            data-testid="button-skip-invitation"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Skip to Invitation
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-0 right-0 flex justify-center"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-primary/40" />
            <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
              Mala &amp; Abhishek&apos;s Birthday — Top Secret
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute top-1/4 left-8 w-px h-32 bg-gradient-to-b from-transparent via-primary/20 to-transparent"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/3 right-12 w-px h-24 bg-gradient-to-b from-transparent via-primary/15 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
    </div>
  );
}
