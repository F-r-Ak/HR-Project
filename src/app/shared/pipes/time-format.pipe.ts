import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeFormat',
    standalone: true
})
export class TimeFormatPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            return '';
        }

        // Handle formats like "14:21 pm" or "14:21"
        const timeRegex = /^(\d{1,2}):(\d{2})\s*(am|pm)?$/i;
        const match = value.match(timeRegex);

        if (!match) {
            return value; // Return original value if it doesn't match expected format
        }

        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        const period = match[3] ? match[3].toLowerCase() : '';

        // Validate hours
        if (hours > 23 || hours < 0) {
            return value; // Invalid hours
        }

        // Convert 24-hour to 12-hour format if needed
        let formattedPeriod = period;
        if (!period) {
            // If no AM/PM, assume 24-hour format and convert to 12-hour
            formattedPeriod = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12 || 12; // Convert to 12-hour format
        } else {
            // If AM/PM is provided, ensure hours are in 12-hour range
            if (hours > 12) {
                hours = hours % 12 || 12;
            }
        }

        return `${hours}:${minutes} ${formattedPeriod.toUpperCase()}`;
    }
}
