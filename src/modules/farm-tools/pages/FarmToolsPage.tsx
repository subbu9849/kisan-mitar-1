import { useEffect } from "react";
import { motion } from "framer-motion";
import { Beaker, CalendarDays, Sprout, Wallet } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FertilizerCalculator from "../components/FertilizerCalculator";
import SeasonPlanner from "../components/SeasonPlanner";
import ProfitEstimator from "../components/ProfitEstimator";

const FarmToolsPage = () => {
  useEffect(() => {
    document.title = "Farm Tools — KisanMitra";
  }, []);

  return (
    <div className="pt-24 pb-20">
      {/* ═══════════ HERO ═══════════ */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <div className="section-padding text-center max-w-3xl mx-auto relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4"
          >
            <Sprout className="w-3.5 h-3.5" /> Farm Tools
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
          >
            Plan your season, right here
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Quick, offline calculators for fertilizer needs, what to sow this month, and whether a crop is worth planting — no login, no waiting.
          </motion.p>
        </div>
      </section>

      {/* ═══════════ TOOLS ═══════════ */}
      <section className="section-padding">
        <Tabs defaultValue="fertilizer" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="h-auto p-1.5 gap-1 flex-wrap justify-center bg-muted/60 rounded-2xl">
              <TabsTrigger value="fertilizer" className="cursor-hover gap-1.5 rounded-xl px-4 py-2.5 data-[state=active]:shadow-sm">
                <Beaker className="w-4 h-4" /> Fertilizer Calculator
              </TabsTrigger>
              <TabsTrigger value="season" className="cursor-hover gap-1.5 rounded-xl px-4 py-2.5 data-[state=active]:shadow-sm">
                <CalendarDays className="w-4 h-4" /> Season Planner
              </TabsTrigger>
              <TabsTrigger value="profit" className="cursor-hover gap-1.5 rounded-xl px-4 py-2.5 data-[state=active]:shadow-sm">
                <Wallet className="w-4 h-4" /> Profit Estimator
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="fertilizer"><FertilizerCalculator /></TabsContent>
          <TabsContent value="season"><SeasonPlanner /></TabsContent>
          <TabsContent value="profit"><ProfitEstimator /></TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default FarmToolsPage;
