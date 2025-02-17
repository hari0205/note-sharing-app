import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateNotesDto } from './dto/create-note.dto';
import { AuthenticatedRequest } from 'src/types/express/express';
import { UpdateNoteDto } from './dto/update-note.dto';
import { log } from 'console';
import { ShareNoteDto } from './dto/share-note.dto';
import { BadRequestExceptionFilter } from './filters/bad-request.filter';

@Controller('notes')
@UseFilters(new BadRequestExceptionFilter())
export class NotesController {
  private readonly logger = new Logger(NotesController.name);

  constructor(private readonly notesService: NotesService) {}

  @Post('')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createNote(
    @Body() createNote: CreateNotesDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;

    this.logger.log('Route accessed by user: ' + user, req.route);

    const note = this.notesService.createNotes(
      createNote.content,
      user.username,
    );
    return note;
  }

  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  async getNotes(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    this.logger.log('Route accessed by user: ' + user, req.route);
    const notes = this.notesService.getNotes(user.username);
    return notes;
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  async getNoteById(@Param('id') id: number, @Req() req: AuthenticatedRequest) {
    const { username } = req.user;
    const notes = this.notesService.getNoteById(id, username);
    return notes;
  }

  @Get('/version-history/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  async getVersionHistory(@Param('id') id: number) {
    return await this.notesService.getNoteHistory(id);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  async updateNote(
    @Param('id') id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;
    log(updateNoteDto);
    return await this.notesService.updateNote(
      id,
      updateNoteDto.content,
      user.username,
    );
  }

  @Post('/share')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async shareNote(
    @Body() shareNoteDto: ShareNoteDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { username } = req.user;

    await this.notesService.shareNoteWithUsers(
      shareNoteDto.noteId,
      shareNoteDto.usernames,
      username,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Note shared successfully!',
    };
  }
}
