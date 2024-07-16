import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { User } from '../user/user.entity';
import { Notes } from './notes.entity';
import { INoteHistory } from './note-entity';

@Entity()
export class NoteHistory implements INoteHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @Column()
  changedContent: string;

  @ManyToOne(() => Notes, (note) => note.histories)
  note: Notes;

  @ManyToOne(() => User)
  changedBy: User;
}
