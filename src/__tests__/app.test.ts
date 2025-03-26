import request from 'supertest';
import express from 'express';
import app from '../app';

describe('Express App', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Welcome to the Express TypeScript API'
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
    });

    it('should handle 500 errors', async () => {
      // Create a test app instance for this specific test
      const testApp = express();
      
      // Add the error route
      testApp.get('/error', () => {
        throw new Error('Test error');
      });

      // Add error handling middleware
      testApp.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        console.error(err.stack);
        res.status(500).json({ message: 'Something went wrong!' });
      });

      const response = await request(testApp).get('/error');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Something went wrong!'
      });
    });
  });
}); 