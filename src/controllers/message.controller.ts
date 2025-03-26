import { Request, Response } from 'express';
import { SQSService, MessagePayload } from '../services/sqs.service';

export class MessageController {
  static async sendMessage(req: Request, res: Response) {
    try {
      const payload: MessagePayload = req.body;
      
      if (!payload.message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      console.log('Received message payload:', payload);
      const messageId = await SQSService.sendMessage(payload);
      
      res.status(200).json({
        success: true,
        messageId,
        message: 'Message sent successfully to SQS'
      });
    } catch (error) {
      console.error('Error in sendMessage controller:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message to SQS',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
} 