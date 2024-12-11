import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { Messaging } from 'firebase-admin/lib/messaging/messaging';
import {
  MulticastMessage,
  TokenMessage,
  TopicMessage,
} from 'firebase-admin/lib/messaging/messaging-api';
import { SendMultipleNotificationDto, SendNotificationDto, TopicSubscriptionDto, UpdateNotificationDto } from './dto';
import { Firestore } from 'firebase-admin/firestore';

@Injectable()
export class NotificationService {
  fcm: Messaging;
  db: Firestore;
  
  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.fcm = this.firebaseApp.messaging();
    this.db = this.firebaseApp.firestore();
  }

  /**
   *
   * @param sendNotificationDto
   * @returns
   */
  async sendToDevice(sendNotificationDto: SendNotificationDto) {
    const { title, body, receiver, data } = sendNotificationDto;
    const message: TokenMessage = {
      notification: {
        title,
        body,
      },
      data,
      token: receiver,
    };
    const res = await this.fcm.send(message);
    const users = await this.db.collection('users').where('token', '==', receiver).get();
    if (users.docs.length > 0) {
      users.docs.forEach((user) => {
        user.ref.collection('notifications').add({
          title,
          body,
          data,
          createdAt: new Date(),
        });
      });
    }
    return res;
  }

  /**
   *
   * @param sendMultipleNotificationDto
   * @returns
   */
  async sendToMultipleDevices(
    sendMultipleNotificationDto: SendMultipleNotificationDto,
  ) {
    const { title, body, receivers, data } = sendMultipleNotificationDto;
    const message: MulticastMessage = {
      notification: {
        title,
        body,
      },
      data,
      tokens: receivers,
    };
    const res = await this.fcm.sendEachForMulticast(message);
    return res;
  }

  async sendToTopic(sendNotificationDto: SendNotificationDto) {
    const { receiver, title, body, data } = sendNotificationDto;
    const message: TopicMessage = {
      notification: {
        title,
        body,
      },
      data,
      topic: receiver,
    };
    const res = await this.fcm.send(message);
    const users = await this.db.collection('users').where('topics', 'array-contains', receiver).get();
    if (users.docs.length > 0) {
      users.docs.forEach((user) => {
        user.ref.collection('notifications').add({
          title,
          body,
          data,
          createdAt: new Date(),
        });
      });
    }
    return res;
  }

  async sendToMultipleTopics(
    sendMultipleNotificationDto: SendMultipleNotificationDto,
  ) {
    const { receivers, title, body, data } = sendMultipleNotificationDto;
    const promises = receivers.map((receiver) => {
      return this.sendToTopic({ receiver, title, body, data });
    });
    const res = await Promise.all(promises);
    return res;
  }

  async subscribeToTopic(topicSubscriptionDto: TopicSubscriptionDto) {
    const { tokens, token, topic } = topicSubscriptionDto;
    const recipients = tokens || [token];
    return await this.fcm.subscribeToTopic(recipients, topic);
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
