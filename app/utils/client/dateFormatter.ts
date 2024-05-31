import { format } from 'date-fns';

export function createDateTime(date: Date) {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}
