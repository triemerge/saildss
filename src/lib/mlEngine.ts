// src/lib/mlEngine.ts
import preds from "./data/ml_predictions.json";

type Pred = { order_id: string; on_time_probability: number };
const map = new Map<string, number>();
(preds as Pred[]).forEach(p => map.set(p.order_id, p.on_time_probability));

// Priority mapping: your Order.priority is numeric (1 highest)
function priorityToScore(priority: number | undefined) {
  if (priority === 1) return 1.0;
  if (priority === 2) return 0.6;
  return 0.3; // default for 3 or unknown
}

// Normalize quantity by a max (tuneable)
function quantityNorm(quantity: number) {
  const MAX = 3000; // tune to real max order size
  return Math.min(1, quantity / MAX);
}

// days to deadline (order.deadline is ISO string)
function daysToDeadline(deadline?: string) {
  if (!deadline) return 30;
  const d = new Date(deadline);
  const diff = (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return Math.round(diff);
}

export function getOnTimeProb(orderId: string): number | null {
  const v = map.get(orderId);
  return v === undefined ? null : v;
}

/**
 * calculateFinalScore(order)
 * Returns object including: onTimeProb, delayProb, priorityScore, quantityNorm, rakeSuitability, finalScore
 */
export function calculateFinalScore(order: {
  id: string;
  quantity: number;
  priority: number;
  deadline?: string;
  mode?: "rail" | "road";
  product?: string;
}) {
  const id = order.id;
  const ml = getOnTimeProb(id); // may be null

  // fallback heuristic if no ML pred
  const fallbackOnTime = (() => {
    const p = priorityToScore(order.priority);
    const days = daysToDeadline(order.deadline);
    let base = 0.6;
    // higher priority => slightly better on-time (depends on your business; adjust)
    base += (p - 0.3) * 0.25; // transforms [0.3..1] -> [~0..~0.175]
    if (days < 0) base -= 0.5; // past due -> much worse
    return Math.max(0.05, Math.min(0.95, base));
  })();

  const onTimeProb = ml ?? fallbackOnTime;
  const delayProb = 1 - onTimeProb;

  const qnorm = quantityNorm(order.quantity);
  const pscore = priorityToScore(order.priority);
  const modeScore = (order.mode === "rail") ? 1.0 : 0.7;
  const rakeSuitability = qnorm; // simple; expand with stockyard match later

  // weights (tune these)
  const w1 = 0.35, w2 = 0.30, w3 = 0.20, w4 = 0.10, w5 = 0.05;

  const finalScore =
    w1 * onTimeProb +
    w2 * pscore +
    w3 * rakeSuitability +
    w4 * qnorm +
    w5 * modeScore;

  return {
    onTimeProb,
    delayProb,
    priorityScore: pscore,
    quantityNorm: qnorm,
    rakeSuitability,
    modeScore,
    finalScore
  };
}