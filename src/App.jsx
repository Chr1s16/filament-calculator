import { useMemo, useState } from "react";

function toNumber(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

const DEFAULTS = {
  filamentPrice: "",
  filamentWeight: 1000,
  usedWeight: 50,
  powerWatt: 110,
  printTime: 3,
  electricityCost: 1.3,
  printerUsageCost: 0.5,
  labourRate: 10,
  labourTime: 0,
  currency: "RON",
};

export default function App() {
  const [filamentPrice, setFilamentPrice] = useState(DEFAULTS.filamentPrice);
  const [filamentWeight, setFilamentWeight] = useState(DEFAULTS.filamentWeight);
  const [usedWeight, setUsedWeight] = useState(DEFAULTS.usedWeight);
  const [powerWatt, setPowerWatt] = useState(DEFAULTS.powerWatt);
  const [printTime, setPrintTime] = useState(DEFAULTS.printTime);
  const [electricityCost, setElectricityCost] = useState(DEFAULTS.electricityCost);
  const [printerUsageCost, setPrinterUsageCost] = useState(DEFAULTS.printerUsageCost);
  const [labourRate, setLabourRate] = useState(DEFAULTS.labourRate);
  const [labourTime, setLabourTime] = useState(DEFAULTS.labourTime);
  const [currency, setCurrency] = useState(DEFAULTS.currency);

  const priceNum = toNumber(filamentPrice);
  const weightNum = toNumber(filamentWeight);
  const usedNum = toNumber(usedWeight);
  const wattNum = toNumber(powerWatt);
  const timeNum = toNumber(printTime);
  const elecNum = toNumber(electricityCost);
  const printerUsageNum = toNumber(printerUsageCost);
  const labourRateNum = toNumber(labourRate);
  const labourTimeNum = toNumber(labourTime);

  const costPerGram = useMemo(() => {
    if (priceNum <= 0 || weightNum <= 0) return 0;
    return priceNum / weightNum;
  }, [priceNum, weightNum]);

  const filamentCost = useMemo(() => {
    return costPerGram * Math.max(0, usedNum);
  }, [costPerGram, usedNum]);

  const kWhUsed = useMemo(() => {
    if (wattNum <= 0 || timeNum <= 0) return 0;
    return (wattNum * timeNum) / 1000;
  }, [wattNum, timeNum]);

  const powerCost = useMemo(() => {
    return kWhUsed * Math.max(0, elecNum);
  }, [kWhUsed, elecNum]);

  const printerUsageTotal = useMemo(() => {
    return Math.max(0, printerUsageNum) * Math.max(0, timeNum);
  }, [printerUsageNum, timeNum]);

  const labourCost = useMemo(() => {
    return Math.max(0, labourRateNum) * Math.max(0, labourTimeNum);
  }, [labourRateNum, labourTimeNum]);

  const totalCost = useMemo(
    () => filamentCost + powerCost + printerUsageTotal + labourCost,
    [filamentCost, powerCost, printerUsageTotal, labourCost]
  );

  const reset = () => {
    setFilamentPrice(DEFAULTS.filamentPrice);
    setFilamentWeight(DEFAULTS.filamentWeight);
    setUsedWeight(DEFAULTS.usedWeight);
    setPowerWatt(DEFAULTS.powerWatt);
    setPrintTime(DEFAULTS.printTime);
    setElectricityCost(DEFAULTS.electricityCost);
    setPrinterUsageCost(DEFAULTS.printerUsageCost);
    setLabourRate(DEFAULTS.labourRate);
    setLabourTime(DEFAULTS.labourTime);
    setCurrency(DEFAULTS.currency);
  };

  const loadExample = () => {
    setFilamentPrice(25);
    setFilamentWeight(1000);
    setUsedWeight(80);
    setPowerWatt(140);
    setPrintTime(5.5);
    setElectricityCost(1.3);
    setPrinterUsageCost(0.5);
    setLabourRate(10);
    setLabourTime(0.25);
    setCurrency("RON");
  };

  return (
    <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-3xl font-extrabold text-center">3D Print Cost Calculator</h1>

        <div className="section space-y-4">
          <div>
            <label className="label">Currency symbol</label>
            <input
              type="text"
              inputMode="text"
              maxLength={3}
              className="input-box w-32 text-center"
              value={currency}
              onChange={(e) => setCurrency(e.target.value || "$")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Filament price per spool</label>
              <div className="flex gap-2">
                <span className="px-3 py-4 rounded-2xl bg-gray-100 border">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 25"
                  value={filamentPrice}
                  onChange={(e) => setFilamentPrice(e.target.value)}
                  className="input-box"
                />
              </div>
            </div>

            <div>
              <label className="label">Spool weight (g)</label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 1000"
                value={filamentWeight}
                onChange={(e) => setFilamentWeight(e.target.value)}
                className="input-box"
              />
            </div>

            <div>
              <label className="label">Used weight for this print (g)</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 80"
                value={usedWeight}
                onChange={(e) => setUsedWeight(e.target.value)}
                className="input-box"
              />
            </div>

            <div>
              <label className="label">Average printer power (W)</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 140"
                value={powerWatt}
                onChange={(e) => setPowerWatt(e.target.value)}
                className="input-box"
              />
            </div>

            <div>
              <label className="label">Print time (hours)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g. 5.5"
                value={printTime}
                onChange={(e) => setPrintTime(e.target.value)}
                className="input-box"
              />
            </div>

            <div>
              <label className="label">Electricity cost ({currency}/kWh)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 0.25"
                value={electricityCost}
                onChange={(e) => setElectricityCost(e.target.value)}
                className="input-box"
              />
            </div>

            <div>
              <label className="label">Printer usage fee ({currency}/hour)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 0.50"
                value={printerUsageCost}
                onChange={(e) => setPrinterUsageCost(e.target.value)}
                className="input-box"
              />
            </div>

            <div>
              <label className="label">Labour rate ({currency}/hour)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 10"
                value={labourRate}
                onChange={(e) => setLabourRate(e.target.value)}
                className="input-box"
              />
            </div>

            <div>
              <label className="label">Labour time (hours)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g. 0.25"
                value={labourTime}
                onChange={(e) => setLabourTime(e.target.value)}
                className="input-box"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button className="button bg-gray-100" onClick={reset}>Reset</button>
            <button className="button bg-blue-600 text-white" onClick={loadExample}>Load example</button>
          </div>
        </div>

        <div className="section">
          <h2 className="text-xl font-bold mb-3">Breakdown</h2>
          <ul className="space-y-2 text-lg">
            <li>Cost per gram: <strong>{currency}{costPerGram.toFixed(4)}</strong></li>
            <li>Filament cost: <strong>{currency}{filamentCost.toFixed(2)}</strong></li>
            <li>Energy used: <strong>{kWhUsed.toFixed(3)} kWh</strong></li>
            <li>Power cost: <strong>{currency}{powerCost.toFixed(2)}</strong></li>
            <li>Printer usage: <strong>{currency}{printerUsageTotal.toFixed(2)}</strong></li>
            <li>Labour: <strong>{currency}{labourCost.toFixed(2)}</strong></li>
          </ul>
          <hr className="my-3" />
          <div className="text-center text-2xl font-extrabold">
            Total: <span>{currency}{totalCost.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Printer usage is charged per print hour. Labour is charged separately using the labour time you enter.
        </p>
      </div>
    </div>
  );
}
