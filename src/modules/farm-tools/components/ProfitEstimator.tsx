import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { CROPS } from "../data";

const num = (v: string) => Math.max(0, parseFloat(v) || 0);
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const ProfitEstimator = () => {
  const [cropName, setCropName] = useState(CROPS[0].name);
  const [area, setArea] = useState("1");
  const [yieldPerAcre, setYieldPerAcre] = useState(String(CROPS[0].typicalYieldQtlPerAcre[0]));
  const [pricePerQtl, setPricePerQtl] = useState("2000");
  const [seedCost, setSeedCost] = useState("2000");
  const [fertilizerCost, setFertilizerCost] = useState("4000");
  const [labourCost, setLabourCost] = useState("8000");
  const [otherCost, setOtherCost] = useState("3000");

  const crop = useMemo(() => CROPS.find((c) => c.name === cropName) ?? CROPS[0], [cropName]);

  const handleCropChange = (name: string) => {
    setCropName(name);
    const c = CROPS.find((x) => x.name === name);
    if (c) setYieldPerAcre(String(c.typicalYieldQtlPerAcre[0]));
  };

  const result = useMemo(() => {
    const acres = num(area);
    const totalYieldQtl = num(yieldPerAcre) * acres;
    const revenue = totalYieldQtl * num(pricePerQtl);
    const costPerAcre = num(seedCost) + num(fertilizerCost) + num(labourCost) + num(otherCost);
    const totalCost = costPerAcre * acres;
    const profit = revenue - totalCost;
    return { acres, totalYieldQtl, revenue, costPerAcre, totalCost, profit, profitPerAcre: acres > 0 ? profit / acres : 0 };
  }, [area, yieldPerAcre, pricePerQtl, seedCost, fertilizerCost, labourCost, otherCost]);

  const isProfit = result.profit >= 0;

  const costFields: [string, string, (v: string) => void][] = [
    ["Seeds / saplings (₹/acre)", seedCost, setSeedCost],
    ["Fertilizer & inputs (₹/acre)", fertilizerCost, setFertilizerCost],
    ["Labour (₹/acre)", labourCost, setLabourCost],
    ["Other (irrigation, transport, etc.) (₹/acre)", otherCost, setOtherCost],
  ];

  return (
    <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-6">
      <Card className="rounded-3xl border-border/30 lg:col-span-3">
        <CardContent className="p-6 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Crop</Label>
              <Select value={cropName} onValueChange={handleCropChange}>
                <SelectTrigger className="cursor-hover"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CROPS.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Land area (acres)</Label>
              <Input type="number" min={0} step="0.1" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expected yield (quintals/acre)</Label>
              <Input type="number" min={0} step="0.5" value={yieldPerAcre} onChange={(e) => setYieldPerAcre(e.target.value)} />
              <p className="text-xs text-muted-foreground">Typical range for {crop.name}: {crop.typicalYieldQtlPerAcre[0]}–{crop.typicalYieldQtlPerAcre[1]} qtl/acre</p>
            </div>
            <div className="space-y-2">
              <Label>Expected price (₹/quintal)</Label>
              <Input type="number" min={0} step="10" value={pricePerQtl} onChange={(e) => setPricePerQtl(e.target.value)} />
              <p className="text-xs text-muted-foreground">Check the Market Price Dashboard for today's rate</p>
            </div>
          </div>

          <div className="border-t border-border/30 pt-5 space-y-4">
            <p className="text-sm font-semibold">Estimated costs</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {costFields.map(([label, value, setter]) => (
                <div key={label} className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-normal">{label}</Label>
                  <Input type="number" min={0} step="100" value={value} onChange={(e) => setter(e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <motion.div
        key={`${cropName}-${result.profit}`}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="lg:col-span-2"
      >
        <Card className={`rounded-3xl border-2 h-full ${isProfit ? "border-primary/20 bg-primary/[0.03]" : "border-destructive/20 bg-destructive/[0.03]"}`}>
          <CardContent className="p-6 sm:p-8 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isProfit ? "bg-primary/10" : "bg-destructive/10"}`}>
                {isProfit ? <TrendingUp className="w-4.5 h-4.5 text-primary" /> : <TrendingDown className="w-4.5 h-4.5 text-destructive" />}
              </div>
              <h3 className="font-semibold">Estimated Result</h3>
            </div>

            <div className="space-y-3 text-sm flex-1">
              <div className="flex justify-between"><span className="text-muted-foreground">Total yield</span><span className="font-medium">{result.totalYieldQtl.toFixed(1)} qtl</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span className="font-medium">{inr(result.revenue)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total cost</span><span className="font-medium">{inr(result.totalCost)}</span></div>
              <div className="h-px bg-border/50 my-1" />
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">{isProfit ? "Estimated Profit" : "Estimated Loss"}</span>
                <span className={`text-2xl font-bold flex items-center gap-1 ${isProfit ? "text-primary" : "text-destructive"}`}>
                  <IndianRupee className="w-4 h-4" />{Math.abs(Math.round(result.profit)).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Per acre</span><span>{inr(Math.abs(result.profitPerAcre))}{isProfit ? "" : " loss"}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground border-t border-border/30 pt-4 mt-6">
              A planning estimate only — real yield, price, and costs vary with weather, mandi conditions, and local labour rates.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfitEstimator;
