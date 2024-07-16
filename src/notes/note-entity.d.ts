import { User } from 'src/user/user.entity';
import { Notes } from './notes.entity';

export interface INoteHistory {
  id: number;

  timestamp: Date;

  changedContent: string;

  note: Partial<Notes>;

  changedBy: User;
}
