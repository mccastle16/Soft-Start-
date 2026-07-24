import type { TemplateBlock, Weekday } from '../types';
import { getAllDayTemplates, saveDayTemplate } from './repository';

const WEEKDAYS_WITH_WORK: readonly Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const MEETING_DAYS: readonly Weekday[] = ['tuesday', 'thursday'];

function buildWeekdayBlocks(weekday: Weekday): TemplateBlock[] {
  const hasMeeting = MEETING_DAYS.includes(weekday);
  const blocks: TemplateBlock[] = [
    { id: `${weekday}-ease-in`, title: 'Ease in', category: 'ease-in', tier: 'protected', startMinute: 480, endMinute: 540 },
    {
      id: `${weekday}-deep-work`,
      title: 'Deep work',
      category: 'work',
      tier: 'flexible',
      startMinute: 540,
      endMinute: 600,
      minDurationMinutes: 15,
    },
  ];

  if (hasMeeting) {
    blocks.push({
      id: `${weekday}-team-meeting`,
      title: 'Team meeting',
      category: 'work',
      tier: 'anchored',
      startMinute: 600,
      endMinute: 660,
    });
  }

  blocks.push(
    {
      id: `${weekday}-client-work`,
      title: 'Client work',
      category: 'work',
      tier: 'flexible',
      startMinute: hasMeeting ? 660 : 600,
      endMinute: 750,
      minDurationMinutes: 15,
    },
    {
      id: `${weekday}-lunch`,
      title: 'Lunch',
      category: 'life',
      tier: 'protected',
      startMinute: 750,
      endMinute: 810,
      minDurationMinutes: 30,
    },
    {
      id: `${weekday}-spanish`,
      title: 'Spanish',
      category: 'spanish',
      tier: 'flexible',
      startMinute: 810,
      endMinute: 855,
      minDurationMinutes: 15,
    },
    {
      id: `${weekday}-side-project`,
      title: 'Side project',
      category: 'side-project',
      tier: 'flexible',
      startMinute: 860,
      endMinute: 960,
      minDurationMinutes: 15,
    },
    {
      id: `${weekday}-workout`,
      title: 'Workout',
      category: 'workout',
      tier: 'flexible',
      startMinute: 960,
      endMinute: 1020,
      minDurationMinutes: 15,
    },
  );

  return blocks;
}

/**
 * Placeholder rhythm standing in for the not-yet-built First Run / Rhythm
 * setup: Monday-Friday get the PRD's example day (Tue/Thu keep the 10am
 * anchored meeting), Saturday/Sunday stay blank per the weekends-are-blank
 * hard rule. Only seeds when every template is still empty, so it never
 * clobbers real edits once Rhythm exists.
 */
export async function seedExampleRhythm(): Promise<void> {
  const templates = await getAllDayTemplates();
  const allEmpty = templates.every((template) => template.blocks.length === 0);
  if (!allEmpty) return;

  await Promise.all(
    WEEKDAYS_WITH_WORK.map((weekday) => saveDayTemplate({ weekday, blocks: buildWeekdayBlocks(weekday) })),
  );
}
