import { IsNotEmpty, IsString } from 'class-validator';
import { IUpdateNotes } from '../interfaces/update-notes';

export class UpdateNoteDto implements IUpdateNotes {
  @IsNotEmpty()
  @IsString()
  content: string;
}
