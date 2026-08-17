import { useEffect, useMemo, useState } from "react";

const formatMoney = (value, currency = "EUR", locale = "en-US") =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const STORAGE_KEY = "filament-calculator-settings-v2";
const RATES_KEY = "filament-calculator-rates-v1";
const RATES_URL = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

const CURRENCIES = [
  { code: "USD", name: "US Dollar", region: "United States" },
  { code: "EUR", name: "Euro", region: "Euro area" },
  { code: "RON", name: "Romanian Leu", region: "Romania" },
  { code: "PLN", name: "Polish Zloty", region: "Poland" },
  { code: "TRY", name: "Turkish Lira", region: "Türkiye" },
  { code: "CNY", name: "Chinese Yuan", region: "China" },
  { code: "JPY", name: "Japanese Yen", region: "Japan" },
  { code: "KRW", name: "South Korean Won", region: "South Korea" },
];

const LANGUAGES = [
  { code: "en", label: "English", currency: "USD", locale: "en-US" },
  { code: "ro", label: "Română", currency: "RON", locale: "ro-RO" },
  { code: "es", label: "Español", currency: "EUR", locale: "es-ES" },
  { code: "fr", label: "Français", currency: "EUR", locale: "fr-FR" },
  { code: "de", label: "Deutsch", currency: "EUR", locale: "de-DE" },
  { code: "it", label: "Italiano", currency: "EUR", locale: "it-IT" },
  { code: "pt", label: "Português", currency: "EUR", locale: "pt-PT" },
  { code: "pl", label: "Polski", currency: "PLN", locale: "pl-PL" },
  { code: "tr", label: "Türkçe", currency: "TRY", locale: "tr-TR" },
  { code: "zh", label: "中文", currency: "CNY", locale: "zh-CN" },
  { code: "ja", label: "日本語", currency: "JPY", locale: "ja-JP" },
  { code: "ko", label: "한국어", currency: "KRW", locale: "ko-KR" },
];

const FALLBACK_EUR_RATES = {
  EUR: 1,
  USD: 1.1593,
  RON: 5.2395,
  PLN: 4.3063,
  TRY: 55.5326,
  CNY: 7.813,
  JPY: 184.59,
  KRW: 1636.83,
};

const DEFAULTS = {
  language: "en",
  currency: "USD",
  filamentPrice: 5.53,
  filamentWeight: 1000,
  usedWeight: 50,
  powerWatt: 110,
  printTime: 3,
  electricityCost: 0.29,
  printerPrice: 663.78,
  printerLifetime: 5000,
  labourRate: 2.21,
  labourTime: 0,
};

const MONEY_FIELDS = ["filamentPrice", "electricityCost", "printerPrice", "labourRate"];

const TRANSLATIONS = {
  en: {
    title: "3D Print Cost Calculator",
    subtitle: "The cost updates instantly as you change the values.",
    language: "Language",
    currency: "Currency",
    print: "Print",
    printDesc: "Material, consumption and energy.",
    filamentPrice: "Filament price / spool",
    filamentWeight: "Spool weight (g)",
    usedWeight: "Filament used (g)",
    power: "Printer consumption (W)",
    printTime: "Print time (hours)",
    electricity: "Electricity ({currency}/kWh)",
    printerLabour: "Printer & labour",
    printerLabourDesc: "Only the costs that matter for the real price.",
    printerPrice: "Printer price ({currency})",
    printerLife: "Expected lifetime (hours)",
    labourRate: "Labour rate ({currency}/hour)",
    labourTime: "Labour time (hours)",
    labourHint: "Example: 15 minutes = 0.25 hours.",
    total: "TOTAL COST",
    live: "LIVE",
    filament: "Filament",
    powerCost: "Electricity",
    printerWear: "Printer wear",
    labour: "Labour",
    perHour: "/hour",
    energy: "Energy use",
    filamentCost: "Filament",
    reset: "Reset",
    example: "Load example",
    footer: "All calculations run locally in your browser. The result updates instantly.",
    rates: "Exchange rates from ECB reference data. Cached locally for fast startup.",
    saved: "Settings saved on this device",
  },
  ro: {
    title: "Calculator cost printare 3D",
    subtitle: "Costul se actualizează instant pe măsură ce modifici valorile.",
    language: "Limbă", currency: "Monedă", print: "Print", printDesc: "Material, consum și energie.",
    filamentPrice: "Preț filament / rolă", filamentWeight: "Greutate rolă (g)", usedWeight: "Consum filament (g)",
    power: "Consum imprimantă (W)", printTime: "Timp print (ore)", electricity: "Electricitate ({currency}/kWh)",
    printerLabour: "Imprimantă & manoperă", printerLabourDesc: "Doar costurile care contează pentru prețul real.",
    printerPrice: "Preț imprimantă ({currency})", printerLife: "Durată de viață estimată (ore)", labourRate: "Manoperă ({currency}/oră)",
    labourTime: "Timp manoperă (ore)", labourHint: "Ex.: 15 minute = 0,25 ore.", total: "COST TOTAL", live: "LIVE",
    filament: "Filament", powerCost: "Electricitate", printerWear: "Uzură imprimantă", labour: "Manoperă", perHour: "/oră",
    energy: "Consum energie", filamentCost: "Filament", reset: "Reset", example: "Încarcă exemplu",
    footer: "Toate calculele sunt făcute local în browser. Rezultatul se actualizează instant.",
    rates: "Cursuri de schimb din datele de referință BCE. Salvate local pentru pornire rapidă.", saved: "Setările sunt salvate pe acest dispozitiv",
  },
  es: { title: "Calculadora de coste de impresión 3D", subtitle: "El coste se actualiza al instante al cambiar los valores.", language: "Idioma", currency: "Moneda", print: "Impresión", printDesc: "Material, consumo y energía.", filamentPrice: "Precio de filamento / bobina", filamentWeight: "Peso de bobina (g)", usedWeight: "Filamento usado (g)", power: "Consumo de impresora (W)", printTime: "Tiempo de impresión (horas)", electricity: "Electricidad ({currency}/kWh)", printerLabour: "Impresora y mano de obra", printerLabourDesc: "Solo los costes que importan para el precio real.", printerPrice: "Precio de impresora ({currency})", printerLife: "Vida útil estimada (horas)", labourRate: "Mano de obra ({currency}/hora)", labourTime: "Tiempo de mano de obra (horas)", labourHint: "Ej.: 15 minutos = 0,25 horas.", total: "COSTE TOTAL", live: "EN VIVO", filament: "Filamento", powerCost: "Electricidad", printerWear: "Desgaste de impresora", labour: "Mano de obra", perHour: "/hora", energy: "Consumo de energía", filamentCost: "Filamento", reset: "Restablecer", example: "Cargar ejemplo", footer: "Todos los cálculos se realizan localmente en el navegador. El resultado se actualiza al instante.", rates: "Tipos de cambio de referencia del BCE. Guardados localmente para un inicio rápido.", saved: "Ajustes guardados en este dispositivo" },
  fr: { title: "Calculateur de coût d'impression 3D", subtitle: "Le coût se met à jour instantanément lorsque vous modifiez les valeurs.", language: "Langue", currency: "Devise", print: "Impression", printDesc: "Matériau, consommation et énergie.", filamentPrice: "Prix du filament / bobine", filamentWeight: "Poids de la bobine (g)", usedWeight: "Filament utilisé (g)", power: "Consommation de l'imprimante (W)", printTime: "Temps d'impression (heures)", electricity: "Électricité ({currency}/kWh)", printerLabour: "Imprimante et main-d'œuvre", printerLabourDesc: "Uniquement les coûts qui comptent pour le prix réel.", printerPrice: "Prix de l'imprimante ({currency})", printerLife: "Durée de vie estimée (heures)", labourRate: "Main-d'œuvre ({currency}/heure)", labourTime: "Temps de main-d'œuvre (heures)", labourHint: "Ex. : 15 minutes = 0,25 heure.", total: "COÛT TOTAL", live: "DIRECT", filament: "Filament", powerCost: "Électricité", printerWear: "Usure de l'imprimante", labour: "Main-d'œuvre", perHour: "/heure", energy: "Consommation d'énergie", filamentCost: "Filament", reset: "Réinitialiser", example: "Charger un exemple", footer: "Tous les calculs sont effectués localement dans le navigateur. Le résultat se met à jour instantanément.", rates: "Taux de change de référence de la BCE. Mis en cache localement pour un démarrage rapide.", saved: "Paramètres enregistrés sur cet appareil" },
  de: { title: "3D-Druckkosten-Rechner", subtitle: "Die Kosten werden sofort aktualisiert, wenn du Werte änderst.", language: "Sprache", currency: "Währung", print: "Druck", printDesc: "Material, Verbrauch und Energie.", filamentPrice: "Filamentpreis / Spule", filamentWeight: "Spulengewicht (g)", usedWeight: "Verbrauchtes Filament (g)", power: "Druckerverbrauch (W)", printTime: "Druckzeit (Stunden)", electricity: "Strom ({currency}/kWh)", printerLabour: "Drucker & Arbeitszeit", printerLabourDesc: "Nur die Kosten, die für den echten Preis zählen.", printerPrice: "Druckerpreis ({currency})", printerLife: "Geschätzte Lebensdauer (Stunden)", labourRate: "Arbeitslohn ({currency}/Stunde)", labourTime: "Arbeitszeit (Stunden)", labourHint: "Beispiel: 15 Minuten = 0,25 Stunden.", total: "GESAMTKOSTEN", live: "LIVE", filament: "Filament", powerCost: "Strom", printerWear: "Druckerverschleiß", labour: "Arbeitszeit", perHour: "/Stunde", energy: "Energieverbrauch", filamentCost: "Filament", reset: "Zurücksetzen", example: "Beispiel laden", footer: "Alle Berechnungen laufen lokal im Browser. Das Ergebnis wird sofort aktualisiert.", rates: "EZB-Referenzwechselkurse. Lokal zwischengespeichert für einen schnellen Start.", saved: "Einstellungen auf diesem Gerät gespeichert" },
  it: { title: "Calcolatore dei costi di stampa 3D", subtitle: "Il costo si aggiorna istantaneamente quando cambi i valori.", language: "Lingua", currency: "Valuta", print: "Stampa", printDesc: "Materiale, consumo ed energia.", filamentPrice: "Prezzo filamento / bobina", filamentWeight: "Peso bobina (g)", usedWeight: "Filamento usato (g)", power: "Consumo stampante (W)", printTime: "Tempo di stampa (ore)", electricity: "Elettricità ({currency}/kWh)", printerLabour: "Stampante e manodopera", printerLabourDesc: "Solo i costi che contano per il prezzo reale.", printerPrice: "Prezzo stampante ({currency})", printerLife: "Durata stimata (ore)", labourRate: "Manodopera ({currency}/ora)", labourTime: "Tempo di manodopera (ore)", labourHint: "Es.: 15 minuti = 0,25 ore.", total: "COSTO TOTALE", live: "LIVE", filament: "Filamento", powerCost: "Elettricità", printerWear: "Usura stampante", labour: "Manodopera", perHour: "/ora", energy: "Consumo energetico", filamentCost: "Filamento", reset: "Ripristina", example: "Carica esempio", footer: "Tutti i calcoli vengono eseguiti localmente nel browser. Il risultato si aggiorna istantaneamente.", rates: "Tassi di cambio di riferimento BCE. Salvati localmente per un avvio rapido.", saved: "Impostazioni salvate su questo dispositivo" },
  pt: { title: "Calculadora de custo de impressão 3D", subtitle: "O custo é atualizado instantaneamente quando altera os valores.", language: "Idioma", currency: "Moeda", print: "Impressão", printDesc: "Material, consumo e energia.", filamentPrice: "Preço do filamento / bobina", filamentWeight: "Peso da bobina (g)", usedWeight: "Filamento usado (g)", power: "Consumo da impressora (W)", printTime: "Tempo de impressão (horas)", electricity: "Eletricidade ({currency}/kWh)", printerLabour: "Impressora e mão de obra", printerLabourDesc: "Apenas os custos que importam para o preço real.", printerPrice: "Preço da impressora ({currency})", printerLife: "Vida útil estimada (horas)", labourRate: "Mão de obra ({currency}/hora)", labourTime: "Tempo de mão de obra (horas)", labourHint: "Ex.: 15 minutos = 0,25 horas.", total: "CUSTO TOTAL", live: "AO VIVO", filament: "Filamento", powerCost: "Eletricidade", printerWear: "Desgaste da impressora", labour: "Mão de obra", perHour: "/hora", energy: "Consumo de energia", filamentCost: "Filamento", reset: "Repor", example: "Carregar exemplo", footer: "Todos os cálculos são feitos localmente no navegador. O resultado é atualizado instantaneamente.", rates: "Taxas de câmbio de referência do BCE. Guardadas localmente para arranque rápido.", saved: "Definições guardadas neste dispositivo" },
  pl: { title: "Kalkulator kosztu druku 3D", subtitle: "Koszt aktualizuje się natychmiast po zmianie wartości.", language: "Język", currency: "Waluta", print: "Druk", printDesc: "Materiał, zużycie i energia.", filamentPrice: "Cena filamentu / szpula", filamentWeight: "Masa szpuli (g)", usedWeight: "Zużyty filament (g)", power: "Pobór drukarki (W)", printTime: "Czas druku (godziny)", electricity: "Energia ({currency}/kWh)", printerLabour: "Drukarka i robocizna", printerLabourDesc: "Tylko koszty, które mają znaczenie dla rzeczywistej ceny.", printerPrice: "Cena drukarki ({currency})", printerLife: "Szacowana żywotność (godziny)", labourRate: "Stawka robocizny ({currency}/godz.)", labourTime: "Czas pracy (godziny)", labourHint: "Np. 15 minut = 0,25 godz.", total: "KOSZT CAŁKOWITY", live: "NA ŻYWO", filament: "Filament", powerCost: "Energia", printerWear: "Zużycie drukarki", labour: "Robocizna", perHour: "/godz.", energy: "Zużycie energii", filamentCost: "Filament", reset: "Reset", example: "Załaduj przykład", footer: "Wszystkie obliczenia są wykonywane lokalnie w przeglądarce. Wynik aktualizuje się natychmiast.", rates: "Referencyjne kursy wymiany EBC. Zapisywane lokalnie dla szybkiego startu.", saved: "Ustawienia zapisane na tym urządzeniu" },
  tr: { title: "3D Baskı Maliyet Hesaplayıcı", subtitle: "Değerleri değiştirdikçe maliyet anında güncellenir.", language: "Dil", currency: "Para birimi", print: "Baskı", printDesc: "Malzeme, tüketim ve enerji.", filamentPrice: "Filament fiyatı / makara", filamentWeight: "Makara ağırlığı (g)", usedWeight: "Kullanılan filament (g)", power: "Yazıcı tüketimi (W)", printTime: "Baskı süresi (saat)", electricity: "Elektrik ({currency}/kWh)", printerLabour: "Yazıcı ve işçilik", printerLabourDesc: "Gerçek fiyat için önemli olan maliyetler.", printerPrice: "Yazıcı fiyatı ({currency})", printerLife: "Tahmini kullanım ömrü (saat)", labourRate: "İşçilik ({currency}/saat)", labourTime: "İşçilik süresi (saat)", labourHint: "Örn.: 15 dakika = 0,25 saat.", total: "TOPLAM MALİYET", live: "CANLI", filament: "Filament", powerCost: "Elektrik", printerWear: "Yazıcı yıpranması", labour: "İşçilik", perHour: "/saat", energy: "Enerji tüketimi", filamentCost: "Filament", reset: "Sıfırla", example: "Örnek yükle", footer: "Tüm hesaplamalar tarayıcıda yerel olarak yapılır. Sonuç anında güncellenir.", rates: "ECB referans döviz kurları. Hızlı başlangıç için yerel olarak önbelleğe alınır.", saved: "Ayarlar bu cihazda kaydedildi" },
  zh: { title: "3D 打印成本计算器", subtitle: "修改数值后成本会立即更新。", language: "语言", currency: "货币", print: "打印", printDesc: "材料、用量和能源。", filamentPrice: "耗材价格 / 卷", filamentWeight: "卷重量 (g)", usedWeight: "耗材用量 (g)", power: "打印机功耗 (W)", printTime: "打印时间（小时）", electricity: "电费 ({currency}/kWh)", printerLabour: "打印机与人工", printerLabourDesc: "只计算影响实际价格的成本。", printerPrice: "打印机价格 ({currency})", printerLife: "预计寿命（小时）", labourRate: "人工费 ({currency}/小时)", labourTime: "人工时间（小时）", labourHint: "例如：15 分钟 = 0.25 小时。", total: "总成本", live: "实时", filament: "耗材", powerCost: "电费", printerWear: "打印机损耗", labour: "人工", perHour: "/小时", energy: "能源消耗", filamentCost: "耗材", reset: "重置", example: "加载示例", footer: "所有计算都在浏览器本地完成，结果即时更新。", rates: "欧洲央行参考汇率。已在本地缓存以便快速启动。", saved: "设置已保存在此设备" },
  ja: { title: "3Dプリント原価計算", subtitle: "値を変更するとコストが即座に更新されます。", language: "言語", currency: "通貨", print: "印刷", printDesc: "材料、使用量、電力。", filamentPrice: "フィラメント価格 / スプール", filamentWeight: "スプール重量 (g)", usedWeight: "使用フィラメント (g)", power: "プリンター消費電力 (W)", printTime: "印刷時間（時間）", electricity: "電気代 ({currency}/kWh)", printerLabour: "プリンターと人件費", printerLabourDesc: "実際の価格に必要なコストだけを計算します。", printerPrice: "プリンター価格 ({currency})", printerLife: "想定寿命（時間）", labourRate: "人件費 ({currency}/時間)", labourTime: "人件費時間（時間）", labourHint: "例：15分 = 0.25時間。", total: "合計コスト", live: "リアルタイム", filament: "フィラメント", powerCost: "電気代", printerWear: "プリンター消耗", labour: "人件費", perHour: "/時間", energy: "電力使用量", filamentCost: "フィラメント", reset: "リセット", example: "例を読み込む", footer: "計算はすべてブラウザ内で行われ、結果は即座に更新されます。", rates: "ECB基準為替レート。高速起動のためローカルに保存されます。", saved: "設定をこの端末に保存しました" },
  ko: { title: "3D 프린트 비용 계산기", subtitle: "값을 변경하면 비용이 즉시 업데이트됩니다.", language: "언어", currency: "통화", print: "출력", printDesc: "재료, 사용량 및 전력.", filamentPrice: "필라멘트 가격 / 롤", filamentWeight: "롤 무게 (g)", usedWeight: "사용 필라멘트 (g)", power: "프린터 소비전력 (W)", printTime: "출력 시간(시간)", electricity: "전기요금 ({currency}/kWh)", printerLabour: "프린터 및 인건비", printerLabourDesc: "실제 가격에 필요한 비용만 계산합니다.", printerPrice: "프린터 가격 ({currency})", printerLife: "예상 수명(시간)", labourRate: "인건비 ({currency}/시간)", labourTime: "인건 시간(시간)", labourHint: "예: 15분 = 0.25시간.", total: "총 비용", live: "실시간", filament: "필라멘트", powerCost: "전기", printerWear: "프린터 감가/마모", labour: "인건비", perHour: "/시간", energy: "에너지 사용량", filamentCost: "필라멘트", reset: "초기화", example: "예제 불러오기", footer: "모든 계산은 브라우저에서 로컬로 처리되며 결과가 즉시 업데이트됩니다.", rates: "ECB 기준 환율. 빠른 시작을 위해 로컬에 캐시됩니다.", saved: "설정이 이 기기에 저장되었습니다" },
};

function toNumber(value) {
  const number = parseFloat(value);
  return Number.isFinite(number) ? number : 0;
}

function getLanguage(code) {
  return LANGUAGES.find((item) => item.code === code) || LANGUAGES[0];
}

function loadSavedSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...DEFAULTS, ...saved } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function loadSavedRates() {
  try {
    const saved = JSON.parse(localStorage.getItem(RATES_KEY));
    return saved?.rates ? saved.rates : FALLBACK_EUR_RATES;
  } catch {
    return FALLBACK_EUR_RATES;
  }
}

function convertAmount(amount, from, to, rates) {
  if (!Number.isFinite(amount) || from === to) return amount;
  const fromRate = rates[from] || 1;
  const toRate = rates[to] || 1;
  return (amount / fromRate) * toRate;
}

function currencyLabel(currency) {
  const item = CURRENCIES.find((entry) => entry.code === currency);
  return item ? `${item.code} — ${item.region}` : currency;
}

export default function App() {
  const [settings, setSettings] = useState(loadSavedSettings);
  const [rates, setRates] = useState(loadSavedRates);
  const [ratesDate, setRatesDate] = useState(null);
  const [settingsReady, setSettingsReady] = useState(false);

  const language = getLanguage(settings.language);
  const strings = TRANSLATIONS[language.code] || TRANSLATIONS.en;
  const t = (key, replacements = {}) => {
    let value = strings[key] || TRANSLATIONS.en[key] || key;
    Object.entries(replacements).forEach(([name, replacement]) => {
      value = value.replaceAll(`{${name}}`, replacement);
    });
    return value;
  };

  useEffect(() => {
    let cancelled = false;

    fetch("/api/settings")
      .then((response) => {
        if (!response.ok) throw new Error("Settings request failed");
        return response.json();
      })
      .then((saved) => {
        if (cancelled) return;

        if (saved && typeof saved === "object" && Object.keys(saved).length > 0) {
          setSettings((current) => ({ ...current, ...saved }));
        }
      })
      .catch(() => {
        // If server storage is unavailable, keep the locally cached settings.
      })
      .finally(() => {
        if (!cancelled) setSettingsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!settingsReady) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Local cache is optional; server storage remains authoritative.
    }

    const timer = setTimeout(() => {
      fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      }).catch(() => {
        // The calculator keeps working even if persistence is temporarily unavailable.
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [settings, settingsReady]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(RATES_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Exchange rate request failed");
        return response.text();
      })
      .then((xmlText) => {
        const xml = new DOMParser().parseFromString(xmlText, "application/xml");
        const nextRates = { EUR: 1 };
        xml.querySelectorAll("Cube[currency][rate]").forEach((cube) => {
          nextRates[cube.getAttribute("currency")] = Number(cube.getAttribute("rate"));
        });
        const supported = Object.keys(nextRates).filter((code) => CURRENCIES.some((item) => item.code === code));
        if (supported.length < CURRENCIES.length - 1) return;
        setRates(nextRates);
        const date = xml.querySelector("Cube[time]")?.getAttribute("time");
        setRatesDate(date || null);
        localStorage.setItem(RATES_KEY, JSON.stringify({ rates: nextRates, date }));
      })
      .catch(() => {
        try {
          const saved = JSON.parse(localStorage.getItem(RATES_KEY));
          setRatesDate(saved?.date || null);
        } catch {
          // Bundled fallback rates remain active.
        }
      });
    return () => controller.abort();
  }, []);

  const updateSetting = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  const changeCurrency = (nextCurrency) => {
    if (nextCurrency === settings.currency) return;
    setSettings((current) => {
      const next = { ...current, currency: nextCurrency };
      MONEY_FIELDS.forEach((key) => {
        next[key] = convertAmount(toNumber(current[key]), current.currency, nextCurrency, rates);
      });
      return next;
    });
  };

  const changeLanguage = (nextLanguage) => {
    const targetCurrency = getLanguage(nextLanguage).currency;
    setSettings((current) => {
      const next = { ...current, language: nextLanguage, currency: targetCurrency };
      if (current.currency !== targetCurrency) {
        MONEY_FIELDS.forEach((key) => {
          next[key] = convertAmount(toNumber(current[key]), current.currency, targetCurrency, rates);
        });
      }
      return next;
    });
  };

  const values = useMemo(() => Object.fromEntries(
    Object.entries(settings)
      .filter(([key]) => !["language", "currency"].includes(key))
      .map(([key, value]) => [key, toNumber(value)])
  ), [settings]);

  const calculations = useMemo(() => {
    const costPerGram = values.filamentPrice > 0 && values.filamentWeight > 0 ? values.filamentPrice / values.filamentWeight : 0;
    const filamentCost = costPerGram * Math.max(0, values.usedWeight);
    const kWhUsed = values.powerWatt > 0 && values.printTime > 0 ? (values.powerWatt * values.printTime) / 1000 : 0;
    const powerCost = kWhUsed * Math.max(0, values.electricityCost);
    const printerWearPerHour = values.printerPrice > 0 && values.printerLifetime > 0 ? values.printerPrice / values.printerLifetime : 0;
    const printerWear = printerWearPerHour * Math.max(0, values.printTime);
    const labourCost = Math.max(0, values.labourRate) * Math.max(0, values.labourTime);
    const total = filamentCost + powerCost + printerWear + labourCost;
    return { costPerGram, filamentCost, kWhUsed, powerCost, printerWearPerHour, printerWear, labourCost, total };
  }, [values]);

  const money = (value, digits) => new Intl.NumberFormat(language.locale, {
    style: "currency",
    currency: settings.currency,
    minimumFractionDigits: digits ?? (settings.currency === "JPY" || settings.currency === "KRW" ? 0 : 2),
    maximumFractionDigits: digits ?? (settings.currency === "JPY" || settings.currency === "KRW" ? 0 : 2),
  }).format(value);

  const reset = () => setSettings(DEFAULTS);

  const loadExample = () => {
    const exampleRON = { filamentPrice: 25, electricityCost: 1.3, printerPrice: 3000, labourRate: 30 };
    const nextCurrency = settings.currency;
    const example = { ...settings, filamentWeight: 1000, usedWeight: 80, powerWatt: 140, printTime: 5.5, printerLifetime: 5000, labourTime: 0.25 };
    Object.entries(exampleRON).forEach(([key, value]) => {
      example[key] = convertAmount(value, "RON", nextCurrency, rates);
    });
    setSettings(example);
  };

  const field = (key) => (event) => updateSetting(key, event.target.value);

  return (
    <main className="min-h-screen px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto w-full max-w-3xl space-y-5">
        <header className="text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <span className="text-lg font-black">3D</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 md:text-4xl">{t("title")}</h1>
          <p className="mt-2 text-sm text-gray-500">{t("subtitle")}</p>
        </header>

        <section className="section settings-section">
          <div className="settings-grid">
            <div>
              <label className="label" htmlFor="language">{t("language")}</label>
              <select id="language" className="input-box select-box" value={settings.language} onChange={(e) => changeLanguage(e.target.value)}>
                {LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="currency">{t("currency")}</label>
              <select id="currency" className="input-box select-box" value={settings.currency} onChange={(e) => changeCurrency(e.target.value)}>
                {CURRENCIES.map((item) => <option key={item.code} value={item.code}>{currencyLabel(item.code)}</option>)}
              </select>
            </div>
          </div>
          <p className="settings-note">{t("saved")}. {t("rates")}{ratesDate ? ` ${ratesDate}.` : ""}</p>
        </section>

        <section className="section">
          <div className="section-heading"><div><h2>{t("print")}</h2><p>{t("printDesc")}</p></div></div>
          <div className="field-grid">
            <div><label className="label" htmlFor="filament-price">{t("filamentPrice")}</label><div className="input-with-prefix"><span>{settings.currency}</span><input id="filament-price" type="number" min="0" step="0.01" value={settings.filamentPrice} onChange={field("filamentPrice")} className="input-box" /></div></div>
            <div><label className="label" htmlFor="filament-weight">{t("filamentWeight")}</label><input id="filament-weight" type="number" min="1" step="1" value={settings.filamentWeight} onChange={field("filamentWeight")} className="input-box" /></div>
            <div><label className="label" htmlFor="used-weight">{t("usedWeight")}</label><input id="used-weight" type="number" min="0" step="1" value={settings.usedWeight} onChange={field("usedWeight")} className="input-box" /></div>
            <div><label className="label" htmlFor="power">{t("power")}</label><input id="power" type="number" min="0" step="1" value={settings.powerWatt} onChange={field("powerWatt")} className="input-box" /></div>
            <div><label className="label" htmlFor="print-time">{t("printTime")}</label><input id="print-time" type="number" min="0" step="0.1" value={settings.printTime} onChange={field("printTime")} className="input-box" /></div>
            <div><label className="label" htmlFor="electricity">{t("electricity", { currency: settings.currency })}</label><input id="electricity" type="number" min="0" step="0.01" value={settings.electricityCost} onChange={field("electricityCost")} className="input-box" /></div>
          </div>
        </section>

        <section className="section">
          <div className="section-heading"><div><h2>{t("printerLabour")}</h2><p>{t("printerLabourDesc")}</p></div></div>
          <div className="field-grid">
            <div><label className="label" htmlFor="printer-price">{t("printerPrice", { currency: settings.currency })}</label><input id="printer-price" type="number" min="0" step="50" value={settings.printerPrice} onChange={field("printerPrice")} className="input-box" /></div>
            <div><label className="label" htmlFor="printer-life">{t("printerLife")}</label><input id="printer-life" type="number" min="1" step="100" value={settings.printerLifetime} onChange={field("printerLifetime")} className="input-box" /></div>
            <div><label className="label" htmlFor="labour-rate">{t("labourRate", { currency: settings.currency })}</label><input id="labour-rate" type="number" min="0" step="1" value={settings.labourRate} onChange={field("labourRate")} className="input-box" /></div>
            <div><label className="label" htmlFor="labour-time">{t("labourTime")}</label><input id="labour-time" type="number" min="0" step="0.05" value={settings.labourTime} onChange={field("labourTime")} className="input-box" /><p className="hint">{t("labourHint")}</p></div>
          </div>
        </section>

        <section className="result-card" aria-live="polite">
          <div className="result-header"><div><p className="eyebrow">{t("total")}</p><div className="total">{money(calculations.total)}</div></div><div className="total-pill">{t("live")}</div></div>
          <div className="breakdown">
            <div><span>{t("filament")}</span><strong>{money(calculations.filamentCost)}</strong></div>
            <div><span>{t("powerCost")}</span><strong>{money(calculations.powerCost)}</strong></div>
            <div><span>{t("printerWear")}<small>{money(calculations.printerWearPerHour, 2)}{t("perHour")}</small></span><strong>{money(calculations.printerWear)}</strong></div>
            <div><span>{t("labour")}</span><strong>{money(calculations.labourCost)}</strong></div>
          </div>
          <div className="result-meta"><span>{t("energy")}: <strong>{calculations.kWhUsed.toFixed(3)} kWh</strong></span><span>{t("filamentCost")}: <strong>{money(calculations.costPerGram, 4)}/g</strong></span></div>
        </section>

        <div className="actions"><button className="button secondary" onClick={reset}>{t("reset")}</button><button className="button primary" onClick={loadExample}>{t("example")}</button></div>
        <p className="footer-note">{t("footer")}</p>
      </div>
    </main>
  );
}
