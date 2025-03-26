import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqsClient, QUEUE_URL } from '../config/aws.config';

export interface MessagePayload {
  message: string;
}

export class SQSService {
  static async sendMessage(payload: MessagePayload): Promise<string> {
    try {
      // Validate AWS configuration
      if (!QUEUE_URL) {
        throw new Error('AWS SQS Queue URL is not configured');
      }

      console.log('Attempting to send message to SQS:', {
        queueUrl: QUEUE_URL,
        message: payload.message
      });

      const command = new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify(payload),
      });

      const response = await sqsClient.send(command);
      console.log('Message sent successfully:', response);
      return response.MessageId || 'Message sent but no ID returned';
    } catch (error) {
      console.error('Detailed SQS Error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        queueUrl: QUEUE_URL
      });
      throw new Error(`Failed to send message to SQS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 