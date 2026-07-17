import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Beaker, Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { CROPS, FERTILIZERS } from "../data";

const round = (n: number) => Math.round(n * 10) / 10;

const FertilizerCalculator = () => {
  const [cropName, setCropName] = useState(CROPS[0].name);
  const [area, setArea] = useState("1");

  const crop = useMemo(() => CROPS.find((c) => c.name === cropName) ?? CROPS[0], [cropName]);
  const acres = Math.max(0, parseFloat(area) || 0);

  const result = useMemo(() => {
    const totalN = crop.npkPerAcre.n * acres;
    const totalP = crop.npkPerAcre.p * acres;
    const totalK = crop.npkPerAcre.k * acres;

    // DAP supplies both N and P; account for the N it contributes, then top up the rest with Urea.
    const dapKg = totalP / FERTILIZERS.dap.content;
    const nFromDap = dapKg * 0.18; // DAP is ~18% N alongside its 46% P2O5
    const ureaKg = Math.max(0, (totalN - nFromDap) / FERTILIZERS.urea.content);
    const mopKg = totalK / FERTILIZERS.mop.content;

    return {
      totalN, totalP, totalK,
      ureaKg: round(ureaKg),
      dapKg: round(dapKg),
      mopKg: round(mopKg),
    };
  }, [crop, acres]);

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="rounded-3xl border-border/30">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Crop</Label>
              <Select value={cropName} onValueChange={setCropName}>
                <SelectTrigger className="cursor-hover"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CROPS.map((c) => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Land area (acres)</Label>
              <Input
                type="number" min={0} step="0.1" value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. 2.5"
              />
            </div>
          </div>

          {crop.notes && (
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {crop.notes}
            </p>
          )}

          <motion.div
            key={`${cropName}-${area}`}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="rounded-2xl bg-primary/[0.04] border border-primary/10 p-5 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><Beaker className="w-4.5 h-4.5 text-primary" /></div>
              <h3 className="font-semibold">Recommended for {acres || 0} acre{acres === 1 ? "" : "s"} of {crop.name}</h3>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-3 rounded-xl bg-card border border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Nitrogen (N)</p>
                <p className="text-lg font-bold">{round(result.totalN)} <span className="text-xs font-normal text-muted-foreground">kg</span></p>
              </div>
              <div className="text-center p-3 rounded-xl bg-card border border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Phosphorus (P)</p>
                <p className="text-lg font-bold">{round(result.totalP)} <span className="text-xs font-normal text-muted-foreground">kg</span></p>
              </div>
              <div className="text-center p-3 rounded-xl bg-card border border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Potassium (K)</p>
                <p className="text-lg font-bold">{round(result.totalK)} <span className="text-xs font-normal text-muted-foreground">kg</span></p>
              </div>
            </div>

            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Suggested as common fertilizers</p>
            <div className="space-y-2">
              {[
                { label: "Urea", qty: result.ureaKg },
                { label: "DAP", qty: result.dapKg },
                { label: "MOP (Muriate of Potash)", qty: result.mopKg },
              ].map((f) => (
                <div key={f.label} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-card border border-border/30">
                  <span className="text-sm font-medium">{f.label}</span>
                  <span className="text-sm font-bold text-primary">{f.qty} kg</span>
                </div>
              ))}
            </div>
          </motion.div>

          <p className="text-xs text-muted-foreground border-t border-border/30 pt-4">
            These are general planning estimates based on typical recommendations for this crop — actual needs vary with your soil's existing nutrient levels. Get a soil test done and confirm quantities and split-application timing with your local agriculture extension officer before applying.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FertilizerCalculator;
