import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, ArrowRight, Eye, AlertCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { puzzles } from "@shared/schema";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function Puzzle() {
  const params = useParams<{ id: string }>();
  const puzzleId = parseInt(params.id || "1");
  const [, navigate] = useLocation();
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState(false);
  const [solved, setSolved] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [checking, setChecking] = useState(false);

  const puzzle = puzzles.find((p) => p.id === puzzleId);
  const totalPuzzles = puzzles.length;
  const progress = ((puzzleId - 1) / totalPuzzles) * 100;

  useDocumentTitle(`Lock ${puzzleId} of ${totalPuzzles} - The Heist`);

  useEffect(() => {
    setAnswer("");
    setShowHint(false);
    setError(false);
    setSolved(false);
    setChecking(false);
  }, [puzzleId]);

  if (!puzzle) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checking) return;
    setChecking(true);

    const normalized = answer.trim().toLowerCase();
    const accepted = puzzle.acceptedAnswers || [puzzle.answer.toLowerCase()];
    const correct = accepted.some((a) => normalized === a.toLowerCase());

    if (correct) {
      setSolved(true);
      setError(false);
      setTimeout(() => {
        if (puzzleId < totalPuzzles) {
          navigate(`/puzzle/${puzzleId + 1}`);
        } else {
          navigate("/invitation");
        }
      }, 1500);
    } else {
      setError(true);
      setShakeKey((k) => k + 1);
      setTimeout(() => setError(false), 2000);
    }
    setChecking(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full h-1 bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: `${((puzzleId - 1) / totalPuzzles) * 100}%` }}
          animate={{ width: solved ? `${(puzzleId / totalPuzzles) * 100}%` : `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => puzzleId > 1 ? navigate(`/puzzle/${puzzleId - 1}`) : navigate("/")}
          data-testid="button-back"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <span
          className="text-xs font-mono tracking-widest text-muted-foreground uppercase"
          data-testid="text-puzzle-progress"
        >
          Lock {puzzleId} of {totalPuzzles}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/invitation")}
          className="text-muted-foreground"
          data-testid="button-skip"
        >
          Skip
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={puzzleId}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <div className="text-center mb-10">
              <motion.div
                className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center mx-auto mb-6"
                animate={solved ? { borderColor: "hsl(43 85% 55%)", scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {solved ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Unlock className="w-6 h-6 text-primary" />
                  </motion.div>
                ) : (
                  <Lock className="w-6 h-6 text-primary/60" />
                )}
              </motion.div>

              <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary mb-2" data-testid="text-puzzle-subtitle">
                {puzzle.subtitle}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8" data-testid="text-puzzle-title">
                {puzzle.title}
              </h2>

              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-px bg-primary/20" />
                <p className="text-lg text-foreground/80 leading-relaxed pl-4 text-left italic" data-testid="text-riddle">
                  &ldquo;{puzzle.riddle}&rdquo;
                </p>
              </div>
            </div>

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="flex items-start gap-3 p-4 rounded-md bg-primary/5 border border-primary/10">
                    <Eye className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-primary/80" data-testid="text-hint">{puzzle.hint}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!solved && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div key={shakeKey} animate={error ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
                  <Input
                    type="text"
                    placeholder="Enter your answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className={`text-center text-lg font-mono tracking-wider h-14 ${error ? "border-destructive" : ""}`}
                    data-testid="input-answer"
                    autoFocus
                  />
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2 text-destructive text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span data-testid="text-error">Wrong answer. Try again.</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowHint(!showHint)}
                    data-testid="button-hint"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showHint ? "Hide Hint" : "Need a Hint?"}
                  </Button>
                  <Button type="submit" className="flex-1" disabled={checking} data-testid="button-submit-answer">
                    {checking ? "Checking..." : "Submit"}
                    {!checking && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </form>
            )}

            {solved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <p className="font-serif text-2xl text-primary mb-2" data-testid="text-success">
                  Lock Cracked
                </p>
                <p className="text-sm text-muted-foreground">
                  {puzzleId < totalPuzzles
                    ? "Moving to the next lock..."
                    : "All locks cracked. Welcome to the briefing..."}
                </p>
              </motion.div>
            )}

            <div className="flex justify-center gap-2 mt-10">
              {puzzles.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx + 1 < puzzleId
                      ? "bg-primary"
                      : idx + 1 === puzzleId
                      ? solved
                        ? "bg-primary"
                        : "bg-primary/50"
                      : "bg-muted"
                  }`}
                  data-testid={`indicator-puzzle-${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
