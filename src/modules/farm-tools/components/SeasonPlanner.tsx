import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Sprout } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { CROPS, MONTH_TO_SEASON, SEASON_INFO, type Season } from "../data";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const SEASONS: Season[] = ["Kharif", "Rabi", "Zaid (Summer)"];

const SeasonPlanner = () => {
  const currentMonthIndex = new Date().getMonth();
  const [monthIndex, setMonthIndex] = useState(String(currentMonthIndex));

  const season = MONTH_TO_SEASON[Number(monthIndex)];
  const info = SEASON_INFO[season];

  const suitableCrops = useMemo(
    () => CROPS.filter((c) => c.season.includes(season)),
    [season],
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="rounded-3xl border-border/30 mb-6">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" /> Planning for month
              </label>
              <Select value={monthIndex} onValueChange={setMonthIndex}>
                <SelectTrigger className="cursor-hover"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MONTH_NAMES.map((m, i) => (
                    <SelectItem key={m} value={String(i)}>{m}{i === currentMonthIndex ? " (current)" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-56 rounded-2xl bg-primary/[0.06] border border-primary/10 px-4 py-3">
              <p className="text-xs text-muted-foreground">Season</p>
              <p className="text-lg font-bold text-primary">{season}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{info.months}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">{info.description}</p>
        </CardContent>
      </Card>

      <motion.div
        key={season}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {suitableCrops.map((crop) => (
          <Card key={crop.name} className="rounded-2xl border-border/30 hover:border-primary/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Sprout className="w-4.5 h-4.5 text-primary" /></div>
                <h3 className="font-semibold leading-tight">{crop.name}</h3>
              </div>
              <dl className="space-y-1.5 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Sow</dt>
                  <dd className="font-medium text-right">{crop.sowingMonths}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Harvest</dt>
                  <dd className="font-medium text-right">{crop.harvestMonths}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="font-medium text-right">{crop.durationDays}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <p className="text-xs text-muted-foreground text-center mt-6 max-w-xl mx-auto">
        Sowing windows are general guidance for Andhra Pradesh & Telangana — confirm exact timing against this year's rainfall and your local agriculture department's crop calendar.
      </p>
    </div>
  );
};

export default SeasonPlanner;
