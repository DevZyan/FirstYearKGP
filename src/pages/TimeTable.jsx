import { useState, useEffect, useCallback } from "react";
import "./TimeTable.css";
import { DAYS, DAY_LABELS, FULL_DAY_LABELS, TIMETABLE_DATA, SLOT_LABELS } from "../data/timeTableData";
import { useToast } from "../components/notificationSystem";

// ─── Helpers ──────────────────────────────────────────────────

function buildDaySlotMap(dayData) {
  const map = {};
  for (let i = 1; i <= 9; i++) map[i] = null;
  dayData.forEach(cls => cls.slots.forEach(s => (map[s] = cls)));
  return map;
}

// Parse "8:00-9:00", "8:00 – 9:00", "8AM-9AM", etc. → { start, end } in minutes
function parseSlotMins(label) {
  const m = label.match(/(\d{1,2})(?::(\d{2}))?\s*(?:AM|PM)?\s*[-–to]+\s*(\d{1,2})(?::(\d{2}))?\s*(?:AM|PM)?/i);
  if (!m) return null;
  return {
    start: parseInt(m[1]) * 60 + parseInt(m[2] ?? '0'),
    end:   parseInt(m[3]) * 60 + parseInt(m[4] ?? '0'),
  };
}

// Map JS getDay() → DAYS key (tries common naming conventions)
const JS_DAY_ABBR = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function getTodayKey() {
  const abbr = JS_DAY_ABBR[new Date().getDay()];
  return DAYS.find(d => d.toLowerCase().startsWith(abbr)) ?? null;
}

function getCurrentSlotKey() {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (const [slot, label] of Object.entries(SLOT_LABELS)) {
    const range = parseSlotMins(label);
    if (range && nowMins >= range.start && nowMins < range.end) return slot;
  }
  return null;
}

// Format today's schedule as plain text
function formatTodaySchedule(dayKey) {
  if (!dayKey) return null;
  const slots = buildDaySlotMap(TIMETABLE_DATA[dayKey]);
  const lines = [`${FULL_DAY_LABELS[dayKey]} — AI 2024 Timetable`, ''];
  Object.entries(SLOT_LABELS).forEach(([slot, time]) => {
    const cls = slots[slot];
    lines.push(`${time.padEnd(18)} ${cls ? `${cls.name} · ${cls.venue}` : '—'}`);
  });
  return lines.join('\n');
}

// ─── Component ────────────────────────────────────────────────

function TimeTable() {
  const { toast } = useToast();
  const [todayKey, setTodayKey]         = useState(getTodayKey);
  const [currentSlot, setCurrentSlot]   = useState(getCurrentSlotKey);
  const [activeDayFilter, setActiveDayFilter] = useState(null); // null = show all

  // Refresh current slot every 60 s
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlot(getCurrentSlotKey());
      setTodayKey(getTodayKey());
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const copyToday = useCallback(async () => {
    const text = formatTodaySchedule(todayKey);
    if (!text) { toast.info('No classes found for today'); return; }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Today's schedule copied!");
    } catch {
      toast.error('Clipboard access denied');
    }
  }, [todayKey, toast]);

  const filteredDays = activeDayFilter ? [activeDayFilter] : DAYS;

  return (
    <div className="tt-wrap">
      {/* Header row */}
      <div className="tt-eyebrow-row">
        <div className="tt-eyebrow-left">
          <span className="tt-eyebrow">Timetable</span>
          <span className="tt-eyebrow-meta">2nd Year · Autumn 2025–2026</span>
        </div>
        <button className="tt-copy-btn" onClick={copyToday} title="Copy today's schedule">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy Today
        </button>
      </div>

      {/* Desktop table */}
      <div className="tt-desktop">
        <div className="tt-scroll">
          <table className="tt-table">
            <thead>
              <tr>
                <th className="tt-th tt-th--day">Day</th>
                {Object.entries(SLOT_LABELS).map(([slot, t]) => (
                  <th key={slot} className={`tt-th ${slot == currentSlot ? 'tt-th--current' : ''}`}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, di) => {
                const slots   = buildDaySlotMap(TIMETABLE_DATA[day]);
                const isToday = day === todayKey;
                return (
                  <tr key={day} className={`${di % 2 === 0 ? 'tt-tr--even' : 'tt-tr--odd'} ${isToday ? 'tt-tr--today' : ''}`}>
                    <td className={`tt-td tt-td--day ${isToday ? 'tt-td--today-label' : ''}`}>
                      {DAY_LABELS[day]}
                      {isToday && <span className="tt-today-dot" />}
                    </td>
                    {Object.keys(SLOT_LABELS).map(slot => {
                      const cls        = slots[slot];
                      const isCurrent  = isToday && slot == currentSlot;
                      return (
                        <td key={slot} className={`tt-td ${cls ? 'tt-td--filled' : 'tt-td--empty'} ${isCurrent ? 'tt-td--current' : ''}`}>
                          {cls ? (
                            <>
                              <span className="tt-subject">{cls.name}</span>
                              <span className="tt-room">{cls.venue}</span>
                            </>
                          ) : (
                            <span className="tt-free">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: day filter pills */}
      <div className="tt-mobile">
        <div className="tt-day-pills" role="group" aria-label="Filter by day">
          <button
            className={`tt-pill ${activeDayFilter === null ? 'tt-pill--active' : ''}`}
            onClick={() => setActiveDayFilter(null)}
          >
            All
          </button>
          {DAYS.map(day => (
            <button
              key={day}
              className={`tt-pill ${activeDayFilter === day ? 'tt-pill--active' : ''} ${day === todayKey ? 'tt-pill--today' : ''}`}
              onClick={() => setActiveDayFilter(activeDayFilter === day ? null : day)}
            >
              {DAY_LABELS[day]}
              {day === todayKey && <span className="tt-pill-dot" />}
            </button>
          ))}
        </div>

        {filteredDays.map(day => {
          const slots   = buildDaySlotMap(TIMETABLE_DATA[day]);
          const isToday = day === todayKey;
          return (
            <div key={day} className={`tt-day-card ${isToday ? 'tt-day-card--today' : ''}`}>
              <div className="tt-day-header">
                <span className="tt-day-label">{FULL_DAY_LABELS[day]}</span>
                {isToday && <span className="tt-today-badge">Today</span>}
              </div>
              <div className="tt-slots">
                {Object.entries(SLOT_LABELS).map(([slot, time]) => {
                  const cls       = slots[slot];
                  const isCurrent = isToday && slot == currentSlot;
                  return (
                    <div
                      key={slot}
                      className={`tt-slot ${!cls ? 'tt-slot--empty' : ''} ${isCurrent ? 'tt-slot--current' : ''}`}
                    >
                      <div className="tt-slot-time">
                        {time}
                        {isCurrent && <span className="tt-now-indicator">NOW</span>}
                      </div>
                      <div className="tt-slot-info">
                        {cls ? (
                          <>
                            <div className="tt-subject">{cls.name}</div>
                            <div className="tt-room">{cls.venue}</div>
                          </>
                        ) : (
                          <div className="tt-free">Free</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimeTable;
