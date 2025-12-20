import "./TimeTable.css";
import { DAYS, DAY_LABELS, FULL_DAY_LABELS, timetableData, SLOT_LABELS } from "../data/timeTableData";

function buildDaySlotMap(dayData) {
  const map = {};
  for (let i = 1; i <= 9; i++) map[i] = null;
  dayData.forEach(cls =>
    cls.slots.forEach(slot => (map[slot] = cls))
  );
  return map;
}

function TimeTable() {
  return (
    <div className="container">
      <div className="timetable-header">
        <h1>2nd Year AUTUMN 2025–2026</h1>
      </div>

      {/* Desktop Table */}
      <div className="desktop-table">
        <table>
          <thead>
            <tr>
              <th>Day Name</th>
              {Object.values(SLOT_LABELS).map(t => (
                <th key={t}>{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map(day => {
              const slots = buildDaySlotMap(timetableData[day]);
              return (
                <tr key={day}>
                  <td>{DAY_LABELS[day]}</td>
                  {Object.keys(SLOT_LABELS).map(slot => {
                    const cls = slots[slot];
                    return (
                      <td key={slot}>
                        {cls ? (
                          <>
                            <span className="subject">{cls.name}</span>
                            <br />
                            <span className="room">{cls.venue}</span>
                          </>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards">
        {DAYS.map(day => {
          const slots = buildDaySlotMap(timetableData[day]);
          return (
            <div className="day-card" key={day}>
              <div className="day-header">{FULL_DAY_LABELS[day]}</div>
              <div className="time-slots">
                {Object.keys(SLOT_LABELS).map(slot => {
                  const cls = slots[slot];
                  return (
                    <div
                      key={slot}
                      className={`time-slot ${cls ? "" : "empty"}`}
                    >
                      <div className="time">{SLOT_LABELS[slot]}</div>
                      <div className="subject-info">
                        {cls ? (
                          <>
                            <div className="subject">{cls.name}</div>
                            <div className="room">{cls.venue}</div>
                          </>
                        ) : (
                          <div className="empty-slot">Free</div>
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
