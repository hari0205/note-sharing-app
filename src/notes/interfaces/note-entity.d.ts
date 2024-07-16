import { User } from 'src/user/user.entity';

export interface INote {
  content: string;

  createdBy: User;

  histories: Array<NoteHistory>;

  sharedWith: Array<User>;
}
