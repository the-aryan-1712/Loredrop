import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { organizationsAPI } from "@/lib/api.ts";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { motion } from "motion/react";

type Organization = any;

type FeedOnboardingProps = {
  organizations: Organization[];
  initialSelectedIds?: string[];
  onComplete: () => void;
};

export default function FeedOnboarding({ organizations, initialSelectedIds = [], onComplete }: FeedOnboardingProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(initialSelectedIds));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSelection = (id: string) => {
    const newParams = new Set(selectedIds);
    if (newParams.has(id)) {
      newParams.delete(id);
    } else {
      newParams.add(id);
    }
    setSelectedIds(newParams);
  };

  const handleSave = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one organization to follow!");
      return;
    }
    setIsSubmitting(true);
    try {
      await organizationsAPI.followMany(Array.from(selectedIds));
      toast.success(`Successfully subscribed to ${selectedIds.size} organizations!`);
      onComplete();
    } catch (e) {
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8 rounded-[2rem] border border-border/60 bg-card p-6 shadow-xl sm:p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[80px]"></div>
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-[80px]"></div>

      <div className="relative z-10">
        <div className="mb-6 max-w-2xl px-2">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground pb-2" style={{ fontFamily: "var(--font-display)" }}>
            Customize your campus experience
          </h2>
          <p className="text-base text-muted-foreground/90">
            Follow the councils, clubs, and organizations you care about. We'll curate your feed to show you exactly what matters to you.
          </p>
        </div>

        <div className="relative mb-8">
          {/* Top fade for scroll */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-card to-transparent"></div>
          
          <div className="max-h-[45vh] overflow-y-auto px-1 py-2 no-scrollbar sm:max-h-[50vh] md:max-h-[55vh]">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {organizations.map((org, i) => {
                const isSelected = selectedIds.has(org._id);
                return (
                  <motion.button
                    key={org._id}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: Math.min(i * 0.03, 0.5) 
                    }}
                    onClick={() => toggleSelection(org._id)}
                    className={cn(
                      "group flex flex-col items-center gap-3 rounded-2xl border p-4 text-center transition-all duration-300 hover:scale-[1.03]",
                      isSelected 
                        ? "border-primary bg-primary/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-primary/20 scale-[1.02]" 
                        : "border-border/60 bg-background/50 hover:border-primary/50 hover:bg-accent/5 hover:shadow-lg"
                    )}
                  >
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-muted/50 p-0.5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                  {org.logo ? (
                    <img src={org.logo} alt={org.name} className="h-full w-full rounded-[0.85rem] object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-[0.85rem] bg-gradient-to-br from-primary/20 to-accent/20 font-bold text-primary">
                      {org.name.charAt(0)}
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-[0.85rem] bg-primary/80 text-primary-foreground backdrop-blur-[2px]">
                      <Check className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <p className="line-clamp-2 text-xs font-medium leading-tight">
                    {org.name}
                  </p>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
          
          {/* Bottom fade for scroll */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-card to-transparent"></div>
        </div>

        <div className="flex items-center justify-between border-t border-border/50 pt-5">
          <p className="text-sm text-muted-foreground">
            {selectedIds.size > 0 
              ? `${selectedIds.size} organizations selected` 
              : "Select organizations to continue"}
          </p>
          <Button 
            onClick={handleSave} 
            disabled={isSubmitting || selectedIds.size === 0}
            className="rounded-full px-8 py-6 text-sm font-semibold shadow-lg transition-all hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save my feed preferences"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
