import "./TimeTable.css";
import { DAYS, DAY_LABELS, FULL_DAY_LABELS, TIMETABLE_DATA, SLOT_LABELS } from "../data/timeTableData";

function buildDaySlotMap(dayData) {
  const map = {};
  for (let i = 1; i <= 9; i++) map[i] = null;
  dayData.forEach(cls => cls.slots.forEach(slot => (map[slot] = cls)));
  return map;
}

function TimeTable() {
  return (
    <div className="tt-wrap">
      <div className="tt-eyebrow-row">
        <span className="tt-eyebrow">Timetable</span>
        <span className="tt-eyebrow-meta">2nd Year · Autumn 2025–2026</span>
      </div>

      {/* Desktop */}
      <div className="tt-desktop">
        <div className="tt-scroll">
          <table className="tt-table">
            <thead>
              <tr>
                <th className="tt-th tt-th--day">Day</th>
                {Object.values(SLOT_LABELS).map(t => (
                  <th key={t} className="tt-th">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, di) => {
                const slots = buildDaySlotMap(TIMETABLE_DATA[day]);
                return (
                  <tr key={day} className={di % 2 === 0 ? 'tt-tr--even' : 'tt-tr--odd'}>
                    <td className="tt-td tt-td--day">{DAY_LABELS[day]}</td>
                    {Object.keys(SLOT_LABELS).map(slot => {
                      const cls = slots[slot];
                      return (
                        <td key={slot} className={`tt-td ${cls ? 'tt-td--filled' : 'tt-td--empty'}`}>
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

      {/* Mobile */}
      <div className="tt-mobile">
        {DAYS.map(day => {
          const slots = buildDaySlotMap(TIMETABLE_DATA[day]);
          return (
            <div key={day} className="tt-day-card">
              <div className="tt-day-header">
                <span className="tt-day-label">{FULL_DAY_LABELS[day]}</span>
              </div>
              <div className="tt-slots">
                {Object.entries(SLOT_LABELS).map(([slot, time]) => {
                  const cls = slots[slot];
                  return (
                    <div key={slot} className={`tt-slot ${cls ? '' : 'tt-slot--empty'}`}>
                      <div className="tt-slot-time">{time}</div>
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
