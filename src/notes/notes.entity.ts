import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoteHistory } from './note-history.entity';

@Entity()
export class Notes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn()
  createdBy: User;

  @OneToMany(() => NoteHistory, (history) => history.note)
  histories: NoteHistory[];

  @ManyToMany(() => User, (user) => user.sharedNotes)
  @JoinTable()
  sharedWith: User[];
}
