import request from 'supertest';
import app from '../app';
import { SQSService } from '../services/sqs.service';

// Mock the SQS service
jest.mock('../services/sqs.service', () => ({
  SQSService: {
    sendMessage: jest.fn(),
  },
}));

describe('Message API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/messages/send', () => {
    it('should successfully send a message to SQS', async () => {
      const mockMessageId = 'test-message-id';
      (SQSService.sendMessage as jest.Mock).mockResolvedValue(mockMessageId);

      const response = await request(app)
        .post('/api/messages/send')
        .send({ message: 'Test message' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        messageId: mockMessageId,
        message: 'Message sent successfully to SQS'
      });
      expect(SQSService.sendMessage).toHaveBeenCalledWith({ message: 'Test message' });
    });

    it('should return 400 if message is missing', async () => {
      const response = await request(app)
        .post('/api/messages/send')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Message is required' });
      expect(SQSService.sendMessage).not.toHaveBeenCalled();
    });

    it('should handle SQS errors', async () => {
      (SQSService.sendMessage as jest.Mock).mockRejectedValue(new Error('SQS Error'));

      const response = await request(app)
        .post('/api/messages/send')
        .send({ message: 'Test message' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Failed to send message to SQS'
      });
    });
  });
}); 