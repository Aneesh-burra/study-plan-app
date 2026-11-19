const canvasRow = /^(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+([A-Za-z]{3}\s+\d{1,2},\s+\d{4})\s+)?(Assignment|Quiz|Exam|Discussion Topic)\s+(.+?)\s+due by\s+(.+)$/i;

export function canvasDeadlines(syllabus, today) {
  const rows = syllabus.split(/\r?\n/);
  const header = rows.findIndex(line => /^Date\s+Details\s+Due\s*$/i.test(line.trim()));
  if (header < 0) return [];
  let date;
  let dateLabel;
  const deadlines = [];
  for (const line of rows.slice(header + 1)) {
    const row = canvasRow.exec(line.trim());
    if (!row) continue;
    const [, explicitDate, type, title, time] = row;
    if (explicitDate) {
      const parsed = new Date(explicitDate + " UTC");
      date = Number.isFinite(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : null;
      dateLabel = explicitDate;
    }
    if (!date || date < today || /^Extra Credit:/i.test(title)) continue;
    const kind = /quiz|exam/i.test(type) ? "Exam" : /\b(project|showcase|presentation)\b/i.test(title) ? "Project" : "Assignment";
    deadlines.push({ title, kind, date, source: dateLabel + " · " + title + " · due by " + time });
  }
  return deadlines;
}
