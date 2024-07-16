import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Notes } from 'src/notes/notes.entity';
import { Exclude } from 'class-transformer';
import { IUser } from './interfaces/user';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @OneToMany(() => Notes, (notes) => notes.createdBy)
  @JoinColumn()
  notes: Notes[];

  @ManyToMany(() => Notes, (notes) => notes.sharedWith)
  sharedNotes: Notes[];

  @BeforeInsert()
  async hashPassword() {
    const hashedPass = await bcrypt.hash(this.password, 10);
    this.password = hashedPass;
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
