import { IsArray, IsInt, IsNotEmpty } from 'class-validator';
import { IShareNotes } from '../interfaces/share-note';

export class ShareNoteDto implements IShareNotes {
  @IsInt()
  @IsNotEmpty()
  noteId: number;

  @IsArray()
  @IsNotEmpty()
  usernames: string[];
}
