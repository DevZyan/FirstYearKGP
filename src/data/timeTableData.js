// the timetable data shall be kept here

export const SLOT_TIMES = {
  1: { start: 8 * 60, end: 8 * 60 + 55 },
  2: { start: 9 * 60, end: 9 * 60 + 55 },
  3: { start: 10 * 60, end: 10 * 60 + 55 },
  4: { start: 11 * 60, end: 11 * 60 + 55 },
  5: { start: 12 * 60, end: 12 * 60 + 55 },
  6: { start: 14 * 60, end: 14 * 60 + 55 },
  7: { start: 15 * 60, end: 15 * 60 + 55 },
  8: { start: 16 * 60, end: 16 * 60 + 55 },
  9: { start: 17 * 60, end: 17 * 60 + 55 },
};

export const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];

export const DAY_LABELS = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thur",
  friday: "Fri",
};

export const FULL_DAY_LABELS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

export const SLOT_LABELS = {
  1: "8:00–8:55 AM",
  2: "9:00–9:55 AM",
  3: "10:00–10:55 AM",
  4: "11:00–11:55 AM",
  5: "12:00–12:55 PM",
  6: "2:00–2:55 PM",
  7: "3:00–3:55 PM",
  8: "4:00–4:55 PM",
  9: "5:00–5:55 PM",
};


export const TIMETABLE_DATA = {
  monday: [
    { name: "Prob & Stats", venue: "NR321", slots: [1, 2] },
    { name: "Algo", venue: "NC231", slots: [5] },
  ],
  tuesday: [
    { name: "Algo", venue: "NC231", slots: [3, 4] },
    { name: "Prob & Stats", venue: "NR321", slots: [5] },
  ],
  wednesday: [
    { name: "AI", venue: "NC231", slots: [3] },
    { name: "ML", venue: "NC231", slots: [5] },
    { name: "ML Lab", venue: "CIC Lab VI", slots: [6, 7, 8] },
  ],
  thursday: [
    { name: "Algo", venue: "NC231", slots: [1] },
    { name: "AI", venue: "NC231", slots: [2] },
    { name: "ML", venue: "NC231", slots: [4] },
    { name: "Algo Lab", venue: "CIC Lab VI", slots: [6, 7, 8] },
  ],
  friday: [
    { name: "ML", venue: "NC231", slots: [2, 3] },
    { name: "AI", venue: "NC231", slots: [4, 5] },
    { name: "Lin Alg", venue: "NC234", slots: [6, 7, 8, 9] },
  ],
  saturday: [],
  sunday: [],
};
