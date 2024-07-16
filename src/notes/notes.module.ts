import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notes } from './notes.entity';
import { User } from 'src/user/user.entity';
import { NoteHistory } from './note-history.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [NotesService],
  controllers: [NotesController],
  imports: [TypeOrmModule.forFeature([Notes, User, NoteHistory]), JwtModule],
})
export class NotesModule {}
