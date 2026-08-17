import { useMemo, useState } from "react";

function toNumber(value) {
  const number = parseFloat(value);
  return Number.isFinite(number) ? number : 0;
}

const DEFAULTS = {
  filamentPrice: "",
  filamentWeight: 1000,
  usedWeight: 50,
  powerWatt: 110,
  printTime: 3,
  electricityCost: 1.3,
  printerPrice: 3000,
  printerLifetime: 5000,
  labourRate: 10,
  labourTime: 0,
  currency: "RON",
};

const field = (value, setter) => (event) => setter(event.target.value);

export default function App() {
  const [filamentPrice, setFilamentPrice] = useState(DEFAULTS.filamentPrice);
  const [filamentWeight, setFilamentWeight] = useState(DEFAULTS.filamentWeight);
  const [usedWeight, setUsedWeight] = useState(DEFAULTS.usedWeight);
  const [powerWatt, setPowerWatt] = useState(DEFAULTS.powerWatt);
  const [printTime, setPrintTime] = useState(DEFAULTS.printTime);
  const [electricityCost, setElectricityCost] = useState(DEFAULTS.electricityCost);
  const [printerPrice, setPrinterPrice] = useState(DEFAULTS.printerPrice);
  const [printerLifetime, setPrinterLifetime] = useState(DEFAULTS.printerLifetime);
  const [labourRate, setLabourRate] = useState(DEFAULTS.labourRate);
  const [labourTime, setLabourTime] = useState(DEFAULTS.labourTime);
  const [currency, setCurrency] = useState(DEFAULTS.currency);

  const values = {
    filamentPrice: toNumber(filamentPrice),
    filamentWeight: toNumber(filamentWeight),
    usedWeight: toNumber(usedWeight),
    powerWatt: toNumber(powerWatt),
    printTime: toNumber(printTime),
    electricityCost: toNumber(electricityCost),
    printerPrice: toNumber(printerPrice),
    printerLifetime: toNumber(printerLifetime),
    labourRate: toNumber(labourRate),
    labourTime: toNumber(labourTime),
  };

  const calculations = useMemo(() => {
    const {
      filamentPrice: price,
      filamentWeight: spoolWeight,
      usedWeight: used,
      powerWatt: watts,
      printTime: hours,
      electricityCost: electricity,
      printerPrice: machinePrice,
      printerLifetime: lifetime,
      labourRate: labour,
      labourTime: labourHours,
    } = values;

    const costPerGram =
      price > 0 && spoolWeight > 0 ? price / spoolWeight : 0;

    const filamentCost = costPerGram * Math.max(0, used);
    const kWhUsed =
      watts > 0 && hours > 0 ? (watts * hours) / 1000 : 0;
    const powerCost = kWhUsed * Math.max(0, electricity);

    const printerWearPerHour =
      machinePrice > 0 && lifetime > 0 ? machinePrice / lifetime : 0;
    const printerWear = printerWearPerHour * Math.max(0, hours);

    const labourCost =
      Math.max(0, labour) * Math.max(0, labourHours);

    const total =
      filamentCost + powerCost + printerWear + labourCost;

    return {
      costPerGram,
      filamentCost,
      kWhUsed,
      powerCost,
      printerWearPerHour,
      printerWear,
      labourCost,
      total,
    };
  }, [JSON.stringify(values)]);

  const reset = () => {
    setFilamentPrice(DEFAULTS.filamentPrice);
    setFilamentWeight(DEFAULTS.filamentWeight);
    setUsedWeight(DEFAULTS.usedWeight);
    setPowerWatt(DEFAULTS.powerWatt);
    setPrintTime(DEFAULTS.printTime);
    setElectricityCost(DEFAULTS.electricityCost);
    setPrinterPrice(DEFAULTS.printerPrice);
    setPrinterLifetime(DEFAULTS.printerLifetime);
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
    setPrinterPrice(3000);
    setPrinterLifetime(5000);
    setLabourRate(30);
    setLabourTime(0.25);
    setCurrency("RON");
  };

  const money = (value, digits = 2) =>
    `${currency}${value.toFixed(digits)}`;

  return (
    <main className="min-h-screen px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto w-full max-w-3xl space-y-5">
        <header className="text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <span className="text-lg font-black">3D</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
            3D Print Cost Calculator
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Costul se actualizează instant pe măsură ce modifici valorile.
          </p>
        </header>

        <section className="section">
          <div className="section-heading">
            <div>
              <h2>Print</h2>
              <p>Material, consum și energie.</p>
            </div>
            <div className="currency-control">
              <label className="label" htmlFor="currency">Monedă</label>
              <input
                id="currency"
                type="text"
                inputMode="text"
                maxLength={4}
                className="input-box currency-input"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase() || "RON")}
              />
            </div>
          </div>

          <div className="field-grid">
            <div>
              <label className="label" htmlFor="filament-price">Preț filament / rolă</label>
              <div className="input-with-prefix">
                <span>{currency}</span>
                <input id="filament-price" type="number" min="0" step="0.01" placeholder="25" value={filamentPrice} onChange={field(filamentPrice, setFilamentPrice)} className="input-box" />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="filament-weight">Greutate rolă (g)</label>
              <input id="filament-weight" type="number" min="1" step="1" placeholder="1000" value={filamentWeight} onChange={field(filamentWeight, setFilamentWeight)} className="input-box" />
            </div>

            <div>
              <label className="label" htmlFor="used-weight">Consum filament (g)</label>
              <input id="used-weight" type="number" min="0" step="1" placeholder="80" value={usedWeight} onChange={field(usedWeight, setUsedWeight)} className="input-box" />
            </div>

            <div>
              <label className="label" htmlFor="power">Consum imprimantă (W)</label>
              <input id="power" type="number" min="0" step="1" placeholder="140" value={powerWatt} onChange={field(powerWatt, setPowerWatt)} className="input-box" />
            </div>

            <div>
              <label className="label" htmlFor="print-time">Timp print (ore)</label>
              <input id="print-time" type="number" min="0" step="0.1" placeholder="5.5" value={printTime} onChange={field(printTime, setPrintTime)} className="input-box" />
            </div>

            <div>
              <label className="label" htmlFor="electricity">Electricitate ({currency}/kWh)</label>
              <input id="electricity" type="number" min="0" step="0.01" placeholder="1.30" value={electricityCost} onChange={field(electricityCost, setElectricityCost)} className="input-box" />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <h2>Imprimantă &amp; manoperă</h2>
              <p>Doar costurile care contează pentru prețul real.</p>
            </div>
          </div>

          <div className="field-grid">
            <div>
              <label className="label" htmlFor="printer-price">Preț imprimantă ({currency})</label>
              <input id="printer-price" type="number" min="0" step="50" placeholder="3000" value={printerPrice} onChange={field(printerPrice, setPrinterPrice)} className="input-box" />
            </div>

            <div>
              <label className="label" htmlFor="printer-life">Durată de viață (ore)</label>
              <input id="printer-life" type="number" min="1" step="100" placeholder="5000" value={printerLifetime} onChange={field(printerLifetime, setPrinterLifetime)} className="input-box" />
            </div>

            <div>
              <label className="label" htmlFor="labour-rate">Manoperă ({currency}/oră)</label>
              <input id="labour-rate" type="number" min="0" step="1" placeholder="30" value={labourRate} onChange={field(labourRate, setLabourRate)} className="input-box" />
            </div>

            <div>
              <label className="label" htmlFor="labour-time">Timp manoperă (ore)</label>
              <input id="labour-time" type="number" min="0" step="0.05" placeholder="0.25" value={labourTime} onChange={field(labourTime, setLabourTime)} className="input-box" />
              <p className="hint">Ex.: 15 minute = 0,25 ore.</p>
            </div>
          </div>
        </section>

        <section className="result-card" aria-live="polite">
          <div className="result-header">
            <div>
              <p className="eyebrow">COST TOTAL</p>
              <div className="total">{money(calculations.total)}</div>
            </div>
            <div className="total-pill">LIVE</div>
          </div>

          <div className="breakdown">
            <div><span>Filament</span><strong>{money(calculations.filamentCost)}</strong></div>
            <div><span>Electricitate</span><strong>{money(calculations.powerCost)}</strong></div>
            <div>
              <span>
                Uzură imprimantă
                <small>{money(calculations.printerWearPerHour, 2)}/oră</small>
              </span>
              <strong>{money(calculations.printerWear)}</strong>
            </div>
            <div><span>Manoperă</span><strong>{money(calculations.labourCost)}</strong></div>
          </div>

          <div className="result-meta">
            <span>Consum energie: <strong>{calculations.kWhUsed.toFixed(3)} kWh</strong></span>
            <span>Filament: <strong>{money(calculations.costPerGram, 4)}/g</strong></span>
          </div>
        </section>

        <div className="actions">
          <button className="button secondary" onClick={reset}>Reset</button>
          <button className="button primary" onClick={loadExample}>Încarcă exemplu</button>
        </div>

        <p className="footer-note">
          Toate calculele sunt făcute local în browser. Nu există backend și rezultatul se actualizează instant.
        </p>
      </div>
    </main>
  );
}
