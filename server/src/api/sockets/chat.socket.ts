import {
  ConnectedSocket,
  OnConnect,
  OnDisconnect,
  SocketController,
} from 'socket-controllers';
import { Service } from 'typedi';

import { Logger, LoggerInterface } from 'decorators/logger.decorator';

@Service()
@SocketController('/socket/chat/:chatId')
export class UserSocket {
  constructor(@Logger(__filename) private log: LoggerInterface) {}

  @OnConnect()
  async connection(@ConnectedSocket() socket: any) {
    this.log.info('Client connected: ' + socket.id);
  }

  @OnDisconnect()
  async disconnect(@ConnectedSocket() socket: any) {
    this.log.info('Client disconnected: ' + socket.id);
  }
}
