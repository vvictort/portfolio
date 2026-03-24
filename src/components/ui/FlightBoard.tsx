import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// ── Data ───────────────────────────────────────────
interface Flight {
  time: string;
  flight: string;
  iata: string;
  destination: string;
  gate: string;
  remarks: string;
}

const INITIAL_FLIGHTS: Flight[] = [
  { time: "00:05", flight: "AY706", iata: "HEL", destination: "HELSINKI", gate: "A5", remarks: "CLOSED" },
  { time: "00:20", flight: "LH849", iata: "FRA", destination: "FRANKFURT", gate: "A12", remarks: "BOARDING" },
  { time: "00:55", flight: "AY1337", iata: "LHR", destination: "LONDON", gate: "B6", remarks: "BOARDING" },
  { time: "01:35", flight: "JL6849", iata: "FCO", destination: "ROME", gate: "A1", remarks: "ON TIME" },
  { time: "01:40", flight: "AY813", iata: "ARN", destination: "STOCKHOLM", gate: "D14", remarks: "ON TIME" },
  { time: "02:00", flight: "AY1585", iata: "CDG", destination: "PARIS", gate: "A15", remarks: "ON TIME" },
  { time: "03:30", flight: "AY715", iata: "SVO", destination: "MOSCOW", gate: "A8", remarks: "DELAYED" },
  { time: "04:45", flight: "KL1164", iata: "AMS", destination: "AMSTERDAM", gate: "B1", remarks: "ON TIME" },
  { time: "05:10", flight: "AY913", iata: "OSL", destination: "OSLO", gate: "B3", remarks: "ON TIME" },
  { time: "06:00", flight: "AY807", iata: "TLV", destination: "TEL AVIV", gate: "C1", remarks: "ON TIME" },
  { time: "06:10", flight: "AY707", iata: "LED", destination: "ST PETERSBURG", gate: "A10", remarks: "ON TIME" },
  { time: "06:30", flight: "FI343", iata: "RKV", destination: "REYKJAVIK", gate: "C12", remarks: "ON TIME" },
];

const WELCOME: Flight[] = [
  { time: "", flight: "", iata: "", destination: "WELCOME TO", gate: "MY", remarks: "" },
  { time: "", flight: "", iata: "", destination: "", gate: "", remarks: "" },
  { time: "", flight: "", iata: "", destination: "", gate: "", remarks: "" },
  { time: "", flight: "", iata: "", destination: "PORTFOLIO", gate: "", remarks: "" },
  { time: "", flight: "", iata: "", destination: "", gate: "", remarks: "" },
  { time: "", flight: "", iata: "", destination: "", gate: "", remarks: "" },
  { time: "HOWDY", flight: "", iata: "", destination: "", gate: "", remarks: "" },
  { time: "", flight: "THANKS", iata: "", destination: "FOR", gate: "", remarks: "" },
  { time: "", flight: "", iata: "", destination: "STOPPING", gate: "", remarks: "BY" },
  { time: "", flight: "", iata: "", destination: "", gate: "", remarks: "" },
  { time: "", flight: "", iata: "", destination: "VIEW", gate: "MY", remarks: "WORK" },
  { time: "", flight: "", iata: "", destination: "", gate: "", remarks: "" },
];

const WELCOME_MOBILE: Flight[] = [
  { time: "", flight: "", iata: "", destination: "WELCOME TO MY", gate: "", remarks: "" },
  { time: "", flight: "", iata: "", destination: "", gate: "", remarks: "" },
  { time: "", flight: "", iata: "", destination: "", gate: "", remarks: "" },
  { time: "PORT", flight: "FOLIO", iata: "", destination: "", gate: "", remarks: "" },
  { time: "", flight: "", iata: "", destination: "", gate: "", remarks: "" },
  { time: "", flight: "", iata: "", destination: "", gate: "", remarks: "" },
  { time: "HOWDY", flight: "", iata: "", destination: "", gate: "", remarks: "" },
  { time: "", flight: "THANKS", iata: "", destination: "FOR", gate: "", remarks: "" },
  { time: "", flight: "", iata: "", destination: "STOPPING BY", gate: "", remarks: "" },
  { time: "", flight: "", iata: "", destination: "", gate: "", remarks: "" },
  { time: "VIEW", flight: "MY", iata: "", destination: "WORK", gate: "", remarks: "" },
  { time: "", flight: "", iata: "", destination: "", gate: "", remarks: "" },
];

const FLIP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const rand = () => FLIP[Math.floor(Math.random() * FLIP.length)];
const INITIAL_SWITCH_DELAY_MS = 2500;
const LOOP_INTERVAL_MS = 6000;
const FLIP_RESET_DELAY_MS = 1200;
const ROW_STAGGER_DELAY_MS = 60;

interface FlapFieldProps {
  value: string;
  width: number;
  color?: string;
  scramble?: boolean;
  delay?: number;
}

const FlapField: React.FC<FlapFieldProps> = ({ value, width, color = "#e4e4e7", scramble = false, delay = 0 }) => {
  const padded = value.padEnd(width).slice(0, width);
  const [text, setText] = useState(padded);
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!scramble) {
      setText(padded);
      return;
    }
    let n = 8;
    ref.current = setTimeout(function go() {
      if (n-- > 0) {
        setText(
          padded
            .split("")
            .map((c) => (c.trim() ? rand() : " "))
            .join(""),
        );
        ref.current = setTimeout(go, 45);
      } else {
        setText(padded);
      }
    }, delay);
    return () => {
      if (ref.current) clearTimeout(ref.current);
    };
  }, [padded, scramble, delay]);

  return (
    <span className="flap-field">
      {text.split("").map((ch, i) => (
        <span key={i} className="flap-cell" style={{ color }}>
          {ch}
        </span>
      ))}
    </span>
  );
};

function remColor(r: string): string {
  const t = r.trim();
  if (t === "DELAYED") return "#f87171";
  if (t === "BOARDING") return "#4ade80";
  if (t === "CLOSED") return "#71717a";
  return "#e4e4e7";
}

export const FlightBoard: React.FC = () => {
  const [data, setData] = useState(INITIAL_FLIGHTS);
  const [flip, setFlip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);

    return () => {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const welcomeRows = isMobile ? WELCOME_MOBILE : WELCOME;

  useEffect(() => {
    let showingWelcome = false;

    // Initial jump to welcome text after a shorter delay
    const initialTimeout = setTimeout(() => {
      setFlip(true);
      setData(welcomeRows);
      showingWelcome = true;
      setTimeout(() => setFlip(false), FLIP_RESET_DELAY_MS);
    }, INITIAL_SWITCH_DELAY_MS);

    // Then continuously loop a bit faster
    const interval = setInterval(() => {
      setFlip(true);
      if (showingWelcome) {
        setData(INITIAL_FLIGHTS);
      } else {
        setData(welcomeRows);
      }
      showingWelcome = !showingWelcome;
      setTimeout(() => setFlip(false), FLIP_RESET_DELAY_MS);
    }, LOOP_INTERVAL_MS);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [welcomeRows]);

  return (
    <div className="fb">
      <div className="fb-header">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}>
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}>
            Departures
          </motion.span>{" "}
          <motion.span
            className="fb-arrow"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}>
            ↗
          </motion.span>
        </motion.h1>
      </div>

      {/* Scrollable container for mobile */}
      <div className="w-full overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
        <div className="fb-grid min-w-max pr-2 md:pr-0">
          {/* Column labels as first row */}
          <span className="fb-label">Time</span>
          <span className="fb-label">Flight</span>
          <span className="fb-label">IATA</span>
          <span className="fb-label">To</span>
          <span className="fb-label">Gate</span>
          <span className="fb-label">Remarks</span>

          {/* Data rows: each FlapField is a grid cell */}
          {data.map((f, i) => (
            <React.Fragment key={i}>
              <FlapField value={f.time} width={5} scramble={flip} delay={i * ROW_STAGGER_DELAY_MS} />
              <FlapField value={f.flight} width={6} scramble={flip} delay={i * ROW_STAGGER_DELAY_MS + 20} />
              <FlapField value={f.iata} width={3} color="#facc15" scramble={flip} delay={i * ROW_STAGGER_DELAY_MS + 40} />
              <FlapField value={f.destination} width={13} scramble={flip} delay={i * ROW_STAGGER_DELAY_MS + 60} />
              <FlapField value={f.gate} width={3} scramble={flip} delay={i * ROW_STAGGER_DELAY_MS + 80} />
              <FlapField value={f.remarks} width={8} color={remColor(f.remarks)} scramble={flip} delay={i * ROW_STAGGER_DELAY_MS + 100} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
