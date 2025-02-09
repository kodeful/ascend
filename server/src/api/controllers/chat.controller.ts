import { PickType } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Exclude, Type, plainToInstance } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParams,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { ChatMessage } from 'api/models/chat-message.model';
import { Chat } from 'api/models/chat.model';
import { User } from 'api/models/user.model';
import { ChatMessageService } from 'api/services/chat-message.service';
import { ChatService } from 'api/services/chat.service';
import { FilterQueryParams } from 'api/types/filter.types';
import { mongoId } from 'utils/mongoId';

// Response Types
// ?|> filterChats
class filterChatsData extends Chat {
  @ValidateNested()
  @Type(() => ChatMessage)
  firstMessage: ChatMessage;
}

class filterChatsResponse {
  @ValidateNested({ each: true })
  @Type(() => filterChatsData)
  data: filterChatsData[];
}

// ?|> startChat
class startChatBody {
  @IsString()
  message: string;
}

// ?|> sendMessageChat
class sendMessageChatBody {
  @IsString()
  message: string;
}

class sendMessageChatData extends PickType(ChatMessage, ['message']) {
  @Exclude()
  @IsOptional()
  protected _: null;
}

// Controller
@Authorized()
@JsonController('/chat')
@OpenAPI({})
export class ChatController {
  constructor(
    private chatService: ChatService,
    private chatMessageService: ChatMessageService,
  ) {}

  @Get()
  @ResponseSchema(filterChatsResponse)
  public async filterChats(
    @CurrentUser() user: User,
    @QueryParams() queryParams: FilterQueryParams<User>,
  ) {
    const { limit, page, sort, filter } = plainToInstance(
      FilterQueryParams,
      queryParams,
    );

    const { data: chats, meta } = await this.chatService.filter({
      limit,
      page,
      sort,
      filter,
      defaultFilter: {
        user: mongoId(user._id),
      },
      Model: filterChatsData,
    });

    const data = await Promise.all(
      chats.map(async (chat) => {
        // @ts-expect-error
        chat.firstMessage = await this.chatMessageService.findOne({
          filter: {
            chat: chat._id,
          },
          sort: { createdAt: 1 },
        });

        return chat;
      }),
    );

    return { data, meta };
  }

  @Get('/messages/:chatId')
  @ResponseSchema(ChatMessage, { isArray: true })
  public async getChatMessages(@Param('chatId') chatId: string) {
    return this.chatMessageService.find({
      filter: {
        chat: chatId,
      },
      sort: { createdAt: 1 },
    });
  }

  @Post()
  @OpenAPI({
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  public async startChat(
    @CurrentUser() user: User,
    @Body() { message }: startChatBody,
  ) {
    const chat = await this.chatService.create({
      user: user._id,
    });

    await this.chatMessageService.create({
      chat: chat._id,
      user: user._id,
      message: message,
    });

    return chat._id.toString();
  }

  @Put('/:chatId')
  @ResponseSchema(sendMessageChatData)
  public async sendMessageChat(
    @CurrentUser() user: User,
    @Param('chatId') chatId: Ref<Chat>,
    @Body() { message }: sendMessageChatBody,
  ) {
    await this.chatMessageService.create({
      chat: chatId,
      user: user._id,
      message: message,
    });

    return message;
  }
}
