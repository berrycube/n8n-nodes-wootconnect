import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Chatwoot } from './Chatwoot.node';

// Mock the n8n-workflow module
vi.mock('n8n-workflow', () => ({
  NodeOperationError: class extends Error {
    constructor(node: any, error: Error | string, options?: any) {
      const message = typeof error === 'string' ? error : error.message;
      super(message);
      this.name = 'NodeOperationError';
    }
  }
}));

describe('Chatwoot Node - Business Logic Tests', () => {
  let chatwoot: Chatwoot;
  let mockExecuteFunctions: any;

  beforeEach(() => {
    chatwoot = new Chatwoot();
    mockExecuteFunctions = {
      getInputData: vi.fn(() => [{ json: { test: 'data' } }]),
      getNodeParameter: vi.fn(),
      getNode: vi.fn(() => ({ name: 'Test Chatwoot Node' })),
      continueOnFail: vi.fn(() => false),
      helpers: {
        request: vi.fn()
      }
    };
  });

  describe('Contact Operations', () => {
    describe('Get Contacts', () => {
      it('should successfully retrieve all contacts', async () => {
        const mockResponse = {
          payload: [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
          ],
          meta: { total: 2, page: 1 }
        };

        mockExecuteFunctions.getNodeParameter
          .mockReturnValueOnce('getContacts') // operation
          .mockReturnValueOnce('https://chat.example.com') // baseUrl
          .mockReturnValueOnce('123') // accountId
          .mockReturnValueOnce('test-api-token'); // apiToken

        mockExecuteFunctions.helpers.request.mockResolvedValue(mockResponse);

        const result = await chatwoot.execute.call(mockExecuteFunctions);

        expect(result[0]).toHaveLength(1);
        expect(result[0][0].json.success).toBe(true);
        expect(result[0][0].json.operation).toBe('getContacts');
        expect(result[0][0].json.contacts).toEqual(mockResponse.payload);
        expect(result[0][0].json.meta).toEqual(mockResponse.meta);

        // Verify API request structure
        const requestCall = mockExecuteFunctions.helpers.request.mock.calls[0][0];
        expect(requestCall.method).toBe('GET');
        expect(requestCall.url).toBe('https://chat.example.com/api/v1/accounts/123/contacts');
        expect(requestCall.headers['api_access_token']).toBe('test-api-token');
        expect(requestCall.headers['Content-Type']).toBe('application/json');
      });

      it('should handle contacts API failure', async () => {
        mockExecuteFunctions.getNodeParameter
          .mockReturnValueOnce('getContacts')
          .mockReturnValueOnce('https://chat.example.com')
          .mockReturnValueOnce('123')
          .mockReturnValueOnce('invalid-token');

        mockExecuteFunctions.helpers.request.mockRejectedValue(new Error('Unauthorized'));

        const result = await chatwoot.execute.call(mockExecuteFunctions);

        expect(result[0][0].json.success).toBe(false);
        expect(result[0][0].json.operation).toBe('getContacts');
        expect(result[0][0].json.error).toBe('Unauthorized');
      });
    });

    describe('Create Contact', () => {
      it('should successfully create a new contact', async () => {
        const contactData = {
          name: 'New User',
          email: 'newuser@example.com',
          phone_number: '+1234567890'
        };

        const mockResponse = {
          payload: { id: 3, ...contactData, created_at: '2024-01-01T00:00:00Z' }
        };

        mockExecuteFunctions.getNodeParameter
          .mockReturnValueOnce('createContact')
          .mockReturnValueOnce('https://chat.example.com')
          .mockReturnValueOnce('123')
          .mockReturnValueOnce('test-api-token')
          .mockReturnValueOnce(contactData); // contactData

        mockExecuteFunctions.helpers.request.mockResolvedValue(mockResponse);

        const result = await chatwoot.execute.call(mockExecuteFunctions);

        expect(result[0][0].json.success).toBe(true);
        expect(result[0][0].json.operation).toBe('createContact');
        expect(result[0][0].json.contact).toEqual(mockResponse.payload);

        // Verify request body
        const requestCall = mockExecuteFunctions.helpers.request.mock.calls[0][0];
        expect(requestCall.method).toBe('POST');
        expect(requestCall.body).toEqual(contactData);
      });

      it('should handle contact creation failure', async () => {
        const contactData = { email: 'invalid-email' };

        mockExecuteFunctions.getNodeParameter
          .mockReturnValueOnce('createContact')
          .mockReturnValueOnce('https://chat.example.com')
          .mockReturnValueOnce('123')
          .mockReturnValueOnce('test-api-token')
          .mockReturnValueOnce(contactData);

        mockExecuteFunctions.helpers.request.mockRejectedValue(new Error('Invalid email format'));

        const result = await chatwoot.execute.call(mockExecuteFunctions);

        expect(result[0][0].json.success).toBe(false);
        expect(result[0][0].json.error).toBe('Invalid email format');
        expect(result[0][0].json.contactData).toEqual(contactData);
      });
    });

    describe('Get Contact', () => {
      it('should retrieve specific contact by ID', async () => {
        const mockResponse = {
          payload: { id: 1, name: 'John Doe', email: 'john@example.com' }
        };

        mockExecuteFunctions.getNodeParameter
          .mockReturnValueOnce('getContact')
          .mockReturnValueOnce('https://chat.example.com')
          .mockReturnValueOnce('123')
          .mockReturnValueOnce('test-api-token')
          .mockReturnValueOnce('1'); // contactId

        mockExecuteFunctions.helpers.request.mockResolvedValue(mockResponse);

        const result = await chatwoot.execute.call(mockExecuteFunctions);

        expect(result[0][0].json.success).toBe(true);
        expect(result[0][0].json.contact).toEqual(mockResponse.payload);

        const requestCall = mockExecuteFunctions.helpers.request.mock.calls[0][0];
        expect(requestCall.url).toBe('https://chat.example.com/api/v1/accounts/123/contacts/1');
      });

      it('should handle contact not found', async () => {
        mockExecuteFunctions.getNodeParameter
          .mockReturnValueOnce('getContact')
          .mockReturnValueOnce('https://chat.example.com')
          .mockReturnValueOnce('123')
          .mockReturnValueOnce('test-api-token')
          .mockReturnValueOnce('999');

        mockExecuteFunctions.helpers.request.mockRejectedValue(new Error('Contact not found'));

        const result = await chatwoot.execute.call(mockExecuteFunctions);

        expect(result[0][0].json.success).toBe(false);
        expect(result[0][0].json.error).toBe('Contact not found');
        expect(result[0][0].json.contactId).toBe('999');
      });
    });

    describe('Update Contact', () => {
      it('should successfully update contact', async () => {
        const updateData = { name: 'Updated Name', phone_number: '+9876543210' };
        const mockResponse = {
          payload: { id: 1, name: 'Updated Name', email: 'john@example.com', phone_number: '+9876543210' }
        };

        mockExecuteFunctions.getNodeParameter
          .mockReturnValueOnce('updateContact')
          .mockReturnValueOnce('https://chat.example.com')
          .mockReturnValueOnce('123')
          .mockReturnValueOnce('test-api-token')
          .mockReturnValueOnce('1') // contactId
          .mockReturnValueOnce(updateData); // contactData

        mockExecuteFunctions.helpers.request.mockResolvedValue(mockResponse);

        const result = await chatwoot.execute.call(mockExecuteFunctions);

        expect(result[0][0].json.success).toBe(true);
        expect(result[0][0].json.contact).toEqual(mockResponse.payload);

        const requestCall = mockExecuteFunctions.helpers.request.mock.calls[0][0];
        expect(requestCall.method).toBe('PUT');
        expect(requestCall.body).toEqual(updateData);
      });
    });

    describe('Delete Contact', () => {
      it('should successfully delete contact', async () => {
        mockExecuteFunctions.getNodeParameter
          .mockReturnValueOnce('deleteContact')
          .mockReturnValueOnce('https://chat.example.com')
          .mockReturnValueOnce('123')
          .mockReturnValueOnce('test-api-token')
          .mockReturnValueOnce('1'); // contactId

        mockExecuteFunctions.helpers.request.mockResolvedValue({});

        const result = await chatwoot.execute.call(mockExecuteFunctions);

        expect(result[0][0].json.success).toBe(true);
        expect(result[0][0].json.message).toBe('Contact deleted successfully');
        expect(result[0][0].json.contactId).toBe('1');

        const requestCall = mockExecuteFunctions.helpers.request.mock.calls[0][0];
        expect(requestCall.method).toBe('DELETE');
      });
    });
  });

  describe('Conversation Operations', () => {
    describe('Get Conversations', () => {
      it('should retrieve conversations for a contact', async () => {
        const mockResponse = {
          payload: [
            { id: 1, status: 'open', messages_count: 5 },
            { id: 2, status: 'resolved', messages_count: 3 }
          ],
          meta: { total: 2 }
        };

        mockExecuteFunctions.getNodeParameter
          .mockReturnValueOnce('getConversations')
          .mockReturnValueOnce('https://chat.example.com')
          .mockReturnValueOnce('123')
          .mockReturnValueOnce('test-api-token')
          .mockReturnValueOnce('1'); // contactId

        mockExecuteFunctions.helpers.request.mockResolvedValue(mockResponse);

        const result = await chatwoot.execute.call(mockExecuteFunctions);

        expect(result[0][0].json.success).toBe(true);
        expect(result[0][0].json.conversations).toEqual(mockResponse.payload);
        expect(result[0][0].json.contactId).toBe('1');

        const requestCall = mockExecuteFunctions.helpers.request.mock.calls[0][0];
        expect(requestCall.url).toBe('https://chat.example.com/api/v1/accounts/123/contacts/1/conversations');
      });
    });

    describe('Update Conversation', () => {
      it('should update conversation status and assignment', async () => {
        const conversationData = {
          status: 'resolved',
          assignee_id: '5',
          priority: 'high'
        };

        const mockResponse = {
          payload: { id: 1, status: 'resolved', assignee_id: 5, priority: 'high' }
        };

        mockExecuteFunctions.getNodeParameter
          .mockReturnValueOnce('updateConversation')
          .mockReturnValueOnce('https://chat.example.com')
          .mockReturnValueOnce('123')
          .mockReturnValueOnce('test-api-token')
          .mockReturnValueOnce('1') // conversationId
          .mockReturnValueOnce(conversationData); // conversationData

        mockExecuteFunctions.helpers.request.mockResolvedValue(mockResponse);

        const result = await chatwoot.execute.call(mockExecuteFunctions);

        expect(result[0][0].json.success).toBe(true);
        expect(result[0][0].json.conversation).toEqual(mockResponse.payload);

        const requestCall = mockExecuteFunctions.helpers.request.mock.calls[0][0];
        expect(requestCall.method).toBe('PUT');
        expect(requestCall.body).toEqual(conversationData);
        expect(requestCall.url).toBe('https://chat.example.com/api/v1/accounts/123/conversations/1');
      });
    });
  });

  describe('Message Operations', () => {
    describe('Get Messages', () => {
      it('should retrieve messages from conversation', async () => {
        const mockResponse = {
          payload: [
            { id: 1, content: 'Hello!', message_type: 'incoming' },
            { id: 2, content: 'Hi there!', message_type: 'outgoing' }
          ],
          meta: { total: 2 }
        };

        mockExecuteFunctions.getNodeParameter
          .mockReturnValueOnce('getMessages')
          .mockReturnValueOnce('https://chat.example.com')
          .mockReturnValueOnce('123')
          .mockReturnValueOnce('test-api-token')
          .mockReturnValueOnce('1'); // conversationId

        mockExecuteFunctions.helpers.request.mockResolvedValue(mockResponse);

        const result = await chatwoot.execute.call(mockExecuteFunctions);

        expect(result[0][0].json.success).toBe(true);
        expect(result[0][0].json.messages).toEqual(mockResponse.payload);
        expect(result[0][0].json.conversationId).toBe('1');

        const requestCall = mockExecuteFunctions.helpers.request.mock.calls[0][0];
        expect(requestCall.url).toBe('https://chat.example.com/api/v1/accounts/123/conversations/1/messages');
      });
    });

    describe('Send Message', () => {
      it('should send message to conversation', async () => {
        const messageContent = 'This is a test message';
        const mockResponse = {
          id: 3,
          content: messageContent,
          message_type: 'outgoing',
          created_at: '2024-01-01T00:00:00Z'
        };

        mockExecuteFunctions.getNodeParameter
          .mockReturnValueOnce('sendMessage')
          .mockReturnValueOnce('https://chat.example.com')
          .mockReturnValueOnce('123')
          .mockReturnValueOnce('test-api-token')
          .mockReturnValueOnce('1') // conversationId
          .mockReturnValueOnce(messageContent); // messageContent

        mockExecuteFunctions.helpers.request.mockResolvedValue(mockResponse);

        const result = await chatwoot.execute.call(mockExecuteFunctions);

        expect(result[0][0].json.success).toBe(true);
        expect(result[0][0].json.message).toEqual(mockResponse);
        expect(result[0][0].json.conversationId).toBe('1');

        const requestCall = mockExecuteFunctions.helpers.request.mock.calls[0][0];
        expect(requestCall.method).toBe('POST');
        expect(requestCall.body.content).toBe(messageContent);
        expect(requestCall.body.message_type).toBe('outgoing');
        expect(requestCall.url).toBe('https://chat.example.com/api/v1/accounts/123/conversations/1/messages');
      });

      it('should handle message sending failure', async () => {
        mockExecuteFunctions.getNodeParameter
          .mockReturnValueOnce('sendMessage')
          .mockReturnValueOnce('https://chat.example.com')
          .mockReturnValueOnce('123')
          .mockReturnValueOnce('test-api-token')
          .mockReturnValueOnce('999') // invalid conversationId
          .mockReturnValueOnce('Test message');

        mockExecuteFunctions.helpers.request.mockRejectedValue(new Error('Conversation not found'));

        const result = await chatwoot.execute.call(mockExecuteFunctions);

        expect(result[0][0].json.success).toBe(false);
        expect(result[0][0].json.error).toBe('Conversation not found');
        expect(result[0][0].json.conversationId).toBe('999');
        expect(result[0][0].json.messageContent).toBe('Test message');
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('unknownOperation')
        .mockReturnValueOnce('https://chat.example.com')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('test-api-token');

      let thrownError;
      try {
        await chatwoot.execute.call(mockExecuteFunctions);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).toBeDefined();
      expect(thrownError.message).toBe('Unknown operation: unknownOperation');
      expect(thrownError.name).toBe('NodeOperationError');
    });

    it('should handle continueOnFail mode', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getContacts')
        .mockReturnValueOnce('https://invalid-url')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('test-api-token');

      mockExecuteFunctions.helpers.request.mockRejectedValue(new Error('Network error'));

      const result = await chatwoot.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json.success).toBe(false);
      expect(result[0][0].json.error).toBe('Network error');
    });

    it('should include timestamp and operation in all responses', async () => {
      const beforeTime = new Date().toISOString();

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getContacts')
        .mockReturnValueOnce('https://chat.example.com')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('test-api-token');

      mockExecuteFunctions.helpers.request.mockResolvedValue({ payload: [] });

      const result = await chatwoot.execute.call(mockExecuteFunctions);
      const afterTime = new Date().toISOString();

      expect(result[0][0].json.timestamp).toBeDefined();
      expect(result[0][0].json.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(result[0][0].json.timestamp >= beforeTime).toBe(true);
      expect(result[0][0].json.timestamp <= afterTime).toBe(true);
      expect(result[0][0].json.operation).toBe('getContacts');
    });

    it('should properly structure API authentication', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getContacts')
        .mockReturnValueOnce('https://enterprise.chatwoot.com')
        .mockReturnValueOnce('enterprise-account-123')
        .mockReturnValueOnce('secure-api-token-xyz');

      mockExecuteFunctions.helpers.request.mockResolvedValue({ payload: [] });

      await chatwoot.execute.call(mockExecuteFunctions);

      const requestCall = mockExecuteFunctions.helpers.request.mock.calls[0][0];
      expect(requestCall.headers['api_access_token']).toBe('secure-api-token-xyz');
      expect(requestCall.headers['Content-Type']).toBe('application/json');
      expect(requestCall.json).toBe(true);
      expect(requestCall.url).toBe('https://enterprise.chatwoot.com/api/v1/accounts/enterprise-account-123/contacts');
    });

    it('should handle different contact data structures', async () => {
      const complexContactData = {
        name: 'Enterprise User',
        email: 'enterprise@company.com',
        phone_number: '+1-555-0123',
        avatar_url: 'https://company.com/avatar.jpg',
        identifier: 'EMP-12345',
        custom_attributes: { department: 'Engineering', role: 'Senior Developer' }
      };

      const mockResponse = { payload: { id: 10, ...complexContactData } };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createContact')
        .mockReturnValueOnce('https://chat.example.com')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('test-api-token')
        .mockReturnValueOnce(complexContactData);

      mockExecuteFunctions.helpers.request.mockResolvedValue(mockResponse);

      const result = await chatwoot.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.success).toBe(true);
      expect(result[0][0].json.contact).toEqual(mockResponse.payload);

      const requestCall = mockExecuteFunctions.helpers.request.mock.calls[0][0];
      expect(requestCall.body).toEqual(complexContactData);
    });
  });
});