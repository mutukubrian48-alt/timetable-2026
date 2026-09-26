import { AssessmentItem, AppNotification } from '../types';
import { playNotificationChime } from './sound';

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return 'denied';
  }
}

export function canSendBrowserNotification(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
}

export function sendBrowserPushNotification(
  title: string,
  options?: NotificationOptions,
  playSound = true
) {
  if (playSound) {
    playNotificationChime('alert');
  }

  if (canSendBrowserNotification()) {
    try {
      new Notification(title, {
        badge: '/vite.svg',
        icon: '/vite.svg',
        ...options,
      });
    } catch (e) {
      console.warn('Browser push notification could not be shown:', e);
    }
  }
}

export function generateAutomatedNotifications(items: AssessmentItem[], now = new Date()): AppNotification[] {
  const notifications: AppNotification[] = [];
  const nowMs = now.getTime();

  for (const item of items) {
    if (item.status === 'completed' || item.status === 'graded') continue;

    const dueMs = new Date(item.dueDate).getTime();
    const scheduledMs = new Date(item.scheduledDate).getTime();
    const diffHoursDue = (dueMs - nowMs) / (1000 * 60 * 60);
    const diffHoursScheduled = (scheduledMs - nowMs) / (1000 * 60 * 60);

    const modeText = item.deliveryMode === 'online' ? '🌐 ONLINE CLASS' : '📍 OFFLINE VENUE';

    // 1. Scheduled session starting soon (within 2 hours)
    if (diffHoursScheduled > 0 && diffHoursScheduled <= 2) {
      const minutesLeft = Math.max(1, Math.round(diffHoursScheduled * 60));
      notifications.push({
        id: `sched-soon-${item.id}`,
        assessmentId: item.id,
        courseCode: item.courseCode,
        deliveryMode: item.deliveryMode,
        type: 'urgent',
        title: `${item.courseCode}: ${item.title} Starting Soon!`,
        message: `${modeText} begins in ${minutesLeft} mins. Location: ${item.deliveryMode === 'online' ? item.meetingLink || item.venueOrPlatform : item.physicalRoom || item.venueOrPlatform}`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }

    // 2. Due date urgent (within 24 hours)
    if (diffHoursDue > 0 && diffHoursDue <= 24) {
      const hoursLeft = Math.max(1, Math.round(diffHoursDue));
      notifications.push({
        id: `due-urgent-${item.id}`,
        assessmentId: item.id,
        courseCode: item.courseCode,
        deliveryMode: item.deliveryMode,
        type: 'urgent',
        title: `URGENT: ${item.title} Due in ${hoursLeft}h`,
        message: `Final deadline is ${new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Make sure all requirements are submitted!`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }
    // 3. Due within 3 days
    else if (diffHoursDue > 24 && diffHoursDue <= 72) {
      const daysLeft = Math.ceil(diffHoursDue / 24);
      notifications.push({
        id: `due-soon-${item.id}`,
        assessmentId: item.id,
        courseCode: item.courseCode,
        deliveryMode: item.deliveryMode,
        type: 'warning',
        title: `Upcoming: ${item.title} (${daysLeft} days left)`,
        message: `Scheduled ${modeText}. Prepare your submission materials.`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }
    // 4. Overdue check
    else if (diffHoursDue < 0 && Math.abs(diffHoursDue) < 48) {
      notifications.push({
        id: `overdue-${item.id}`,
        assessmentId: item.id,
        courseCode: item.courseCode,
        deliveryMode: item.deliveryMode,
        type: 'urgent',
        title: `Overdue: ${item.title}`,
        message: `Deadline passed on ${new Date(item.dueDate).toLocaleDateString()}. Please check with lecturer if late submission is open.`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }
  }

  return notifications;
}
