import { IsNotEmpty, IsString } from 'class-validator';
import { ICreateNotes } from '../interfaces/create-note';

export class CreateNotesDto implements ICreateNotes {
  @IsString()
  @IsNotEmpty()
  content: string;
}
