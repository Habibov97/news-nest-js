import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import type { AuthorizedRequest } from '../auth/auth.types';
import { AuthGuard } from 'src/guards/auth.guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../user/user.types';
import { Roles } from 'src/shared/decorator/role.decorator';

@Controller('news/:newsId/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  async list(@Param('newsId') newsId: number) {
    const result = await this.commentService.list(newsId);
    return result;
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.GUEST)
  @ApiBearerAuth()
  create(
    @Param('newsId') newsId: number,
    @Req() req: AuthorizedRequest,
    @Body() body: CreateCommentDto,
  ) {
    return this.commentService.create(newsId, body, req.user.id);
  }
}
