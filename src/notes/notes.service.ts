import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notes } from './notes.entity';
import { In, Repository } from 'typeorm';

import { User } from 'src/user/user.entity';
import { NoteHistory } from './note-history.entity';
import { EntityNotFoundException } from 'src/utils/exceptions/not-found.exception';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(
    @InjectRepository(Notes)
    private readonly notesRepository: Repository<Notes>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(NoteHistory)
    private readonly noteHistoryRepository: Repository<NoteHistory>,
  ) {}

  async createNotes(content: string, author: string) {
    const user = await this.userRepository.findOne({
      where: { username: author },
    });

    this.logger.debug(JSON.stringify(user));

    if (!user) {
      throw new EntityNotFoundException('User');
    }

    const new_note = this.notesRepository.create({
      content: content,
      createdBy: user,
    });

    this.logger.debug(new_note);
    await this.notesRepository.save(new_note);

    // Add note to notes history
    const history = new NoteHistory();
    history.note = new_note;
    history.timestamp = new Date();
    history.changedContent = content; // For creation, this is the initial content
    history.changedBy = user;

    this.logger.log('Before saving history');
    this.logger.debug(history);

    await this.noteHistoryRepository.save(history);

    return new_note;
  }

  async getNotes(author: string) {
    const notes = await this.notesRepository.find({
      where: { createdBy: { username: author } },
    });

    this.logger.debug(notes);
    return notes;
  }

  async getNoteById(id: number) {
    const note = await this.notesRepository
      .findOneBy({ id })
      .catch((err) => this.logger.error(err));

    this.logger.debug(note);

    if (!note) {
      this.logger.error(`Note with ${id} does not exist`);
      throw new EntityNotFoundException(
        'Note',
        `The note with ${id} does not exist`,
      );
    }
    return note;
  }

  async getNoteHistory(noteId: number): Promise<NoteHistory[]> {
    const note = await this.getNoteById(noteId);

    this.logger.debug(`Note with ${noteId}` + JSON.stringify(note));

    const history = await this.noteHistoryRepository.find({
      where: { note: { id: noteId } },
      relations: ['changedBy'],
    });

    this.logger.debug('Notes history', JSON.stringify(history));
    if (!history) {
      this.logger.error(`History details for ${noteId} not found`);
      throw new NotFoundException('No history found for this note');
    }
    return history;
  }

  async updateNote(noteId: number, content: string, author: string) {
    const note = await this.notesRepository.findOne({ where: { id: noteId } });
    if (!note) {
      this.logger.error(`Noted for ${noteId} not found`);

      throw new EntityNotFoundException(
        'Note',
        `The note with ${noteId} does not exist`,
      );
    }
    this.logger.debug(JSON.stringify(note));
    const user = await this.userRepository.findOne({
      where: { username: author },
    });

    this.logger.debug(user);
    if (!user) {
      this.logger.error(`User with ${author} not found`);
      throw new EntityNotFoundException(
        'User not found',
        `The user with ${author} does not exist`,
      );
    }

    const history = new NoteHistory();

    this.logger.log('Before changing');
    this.logger.debug(history);

    history.note = note;
    history.timestamp = new Date();
    history.changedContent = content;
    history.changedBy = user;

    this.logger.log('After changing');
    this.logger.debug(history);

    await this.noteHistoryRepository.save(history);

    note.content = content;
    await this.notesRepository.save(note);

    return note;
  }

  async shareNoteWithUsers(noteId: number, usernames: string[]): Promise<void> {
    const note = await this.notesRepository.findOne({
      where: { id: noteId },
      relations: ['sharedWith'],
    });

    this.logger.debug(note);
    if (!note)
      throw new EntityNotFoundException(
        'Note not found',
        `Note ${noteId} not found`,
      );

    const users = await this.userRepository.find({
      where: { username: In(usernames) },
    });

    this.logger.debug(users);
    // If one of the users in the user list is invalid
    if (users.length !== usernames.length) {
      throw new EntityNotFoundException('One or more users not found');
    }

    note.sharedWith = users;
    await this.notesRepository.save(note);
  }
}
