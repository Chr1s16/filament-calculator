import { useState, useMemo } from "react";

function toNumber(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

export default function App() {
  const [filamentPrice, setFilamentPrice] = useState("");
  const [filamentWeight, setFilamentWeight] = useState(1000); // g per spool default
  const [usedWeight, setUsedWeight] = useState(50); // g used in print
  const [powerWatt, setPowerWatt] = useState(110); // average W
  const [printTime, setPrintTime] = useState(3); // hours
  const [electricityCost, setElectricityCost] = useState(1.3); // RON/kWh (or your currency)
  const [currency, setCurrency] = useState("RON"); // just a symbol for display

  const priceNum = toNumber(filamentPrice);
  const weightNum = toNumber(filamentWeight);
  const usedNum = toNumber(usedWeight);
  const wattNum = toNumber(powerWatt);
  const timeNum = toNumber(printTime);
  const elecNum = toNumber(electricityCost);

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

  const totalCost = useMemo(() => filamentCost + powerCost, [filamentCost, powerCost]);

  const reset = () => {
    setFilamentPrice("");
    setFilamentWeight(1000);
    setUsedWeight(50);
    setPowerWatt(110);
    setPrintTime(3);
    setElectricityCost(1.3);
    setCurrency("RON"); 
  };

  const loadExample = () => {
    setFilamentPrice(25);
    setFilamentWeight(1000);
    setUsedWeight(80);
    setPowerWatt(140);
    setPrintTime(5.5);
    setElectricityCost(1.3);
    setCurrency("$"); 
  };

  return (
    <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-3xl font-extrabold text-center">Filament Power Cost Calculator</h1>

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
                  min="0" step="0.01"
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
                type="number" min="1" step="1"
                placeholder="e.g. 1000"
                value={filamentWeight}
                onChange={(e) => setFilamentWeight(e.target.value)}
                className="input-box"
              />
            </div>

            <div>
              <label className="label">Used weight for this print (g)</label>
              <input
                type="number" min="0" step="1"
                placeholder="e.g. 80"
                value={usedWeight}
                onChange={(e) => setUsedWeight(e.target.value)}
                className="input-box"
              />
            </div>

            <div>
              <label className="label">Average printer power (W)</label>
              <input
                type="number" min="0" step="1"
                placeholder="e.g. 140"
                value={powerWatt}
                onChange={(e) => setPowerWatt(e.target.value)}
                className="input-box"
              />
            </div>

            <div>
              <label className="label">Print time (hours)</label>
              <input
                type="number" min="0" step="0.1"
                placeholder="e.g. 5.5"
                value={printTime}
                onChange={(e) => setPrintTime(e.target.value)}
                className="input-box"
              />
            </div>

            <div>
              <label className="label">Electricity cost ({currency}/kWh)</label>
              <input
                type="number" min="0" step="0.01"
                placeholder="e.g. 0.25"
                value={electricityCost}
                onChange={(e) => setElectricityCost(e.target.value)}
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
          </ul>
          <hr className="my-3" />
          <div className="text-center text-2xl font-extrabold">
            Total: <span>{currency}{totalCost.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Tip: average power is usually between 80–200 W for many printers and depends on temps, bed size and speed.
        </p>
      </div>
    </div>
  );
}
