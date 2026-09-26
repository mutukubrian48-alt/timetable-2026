import { AssessmentItem } from '../types';

function formatICSDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function generateICSForItems(items: AssessmentItem[]): string {
  const calendarLines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CourseTrack Pro//Student Coursework Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const item of items) {
    const startDate = formatICSDate(item.scheduledDate);
    const endDate = formatICSDate(item.dueDate || item.scheduledDate);
    const location = item.deliveryMode === 'online' 
      ? (item.meetingLink || item.venueOrPlatform || 'Online Class')
      : (item.physicalRoom || item.venueOrPlatform || 'Campus Venue');

    calendarLines.push(
      'BEGIN:VEVENT',
      `UID:${item.id}@coursetrack.pro`,
      `DTSTAMP:${formatICSDate(new Date().toISOString())}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:[${item.courseCode}] ${item.title} (${item.deliveryMode.toUpperCase()})`,
      `DESCRIPTION:${item.description.replace(/\n/g, '\\n')}\\nMode: ${item.deliveryMode.toUpperCase()}\\nVenue/Link: ${location}\\nWeight: ${item.weightPercentage}%`,
      `LOCATION:${location.replace(/,/g, '\\,')}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT'
    );
  }

  calendarLines.push('END:VCALENDAR');
  return calendarLines.join('\r\n');
}

export function downloadICS(items: AssessmentItem[], filename = 'coursework-schedule.ics') {
  const icsData = generateICSForItems(items);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(item: AssessmentItem): string {
  const title = encodeURIComponent(`[${item.courseCode}] ${item.title}`);
  const details = encodeURIComponent(
    `${item.description}\nMode: ${item.deliveryMode.toUpperCase()}\nVenue/Link: ${item.deliveryMode === 'online' ? item.meetingLink || item.venueOrPlatform : item.physicalRoom || item.venueOrPlatform}\nWeight: ${item.weightPercentage}%`
  );
  const location = encodeURIComponent(
    item.deliveryMode === 'online'
      ? item.meetingLink || item.venueOrPlatform || 'Online'
      : item.physicalRoom || item.venueOrPlatform || 'Campus'
  );

  const start = formatICSDate(item.scheduledDate);
  const end = formatICSDate(item.dueDate || item.scheduledDate);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}
