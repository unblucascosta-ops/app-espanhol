// Datas e "dias de estudo". O dia vira às 4h da manhã (como no Anki),
// para que estudar à 1h da madrugada conte para o dia anterior.

export const DAY_MS = 24 * 60 * 60 * 1000;
export const DAY_START_HOUR = 4;

/** Início (timestamp) do dia de estudo que contém `ts`. */
export function startOfDay(ts = Date.now()) {
  const d = new Date(ts - DAY_START_HOUR * 3600 * 1000);
  d.setHours(DAY_START_HOUR, 0, 0, 0);
  return d.getTime();
}

/** Soma `n` dias de calendário (seguro com horário de verão). */
export function addDays(ts, n) {
  const d = new Date(ts);
  d.setDate(d.getDate() + n);
  return d.getTime();
}

/** Chave "AAAA-MM-DD" do dia de estudo. */
export function dayKey(ts = Date.now()) {
  const d = new Date(ts - DAY_START_HOUR * 3600 * 1000);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Chave do dia anterior a uma chave "AAAA-MM-DD". */
export function prevDayKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d - 1, 12);
  return dayKey(date.getTime() + DAY_START_HOUR * 3600 * 1000);
}

/** Formata uma duração curta: "1 min", "10 min", "3 h", "4 d", "2 m", "1,5 a". */
export function formatInterval(ms) {
  const min = ms / 60000;
  if (min < 60) return `${Math.max(1, Math.round(min))} min`;
  const h = min / 60;
  if (h < 24) return `${Math.round(h)} h`;
  const d = h / 24;
  if (d < 30) return `${Math.round(d)} d`;
  const mo = d / 30;
  if (mo < 12) return `${Math.round(mo)} m`;
  return `${(d / 365).toFixed(1).replace('.', ',')} a`;
}
