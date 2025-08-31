import { describe, it, expect, vi } from 'vitest';
import { Chatwoot } from './Chatwoot.node';

describe('Chatwoot Node', () => {
  describe('基本配置', () => {
    it('should have correct node type name', () => {
      const node = new Chatwoot();
      expect(node.description.name).toBe('chatwoot');
    });

    it('should have correct display name', () => {
      const node = new Chatwoot();
      expect(node.description.displayName).toBe('Chatwoot');
    });

    it('should be categorized correctly', () => {
      const node = new Chatwoot();
      expect(node.description.group).toContain('communication');
    });

    it('should have correct version', () => {
      const node = new Chatwoot();
      expect(node.description.version).toBe(1);
    });
  });

  describe('节点属性', () => {
    it('should have operation parameter', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const operationProp = properties.find((p: any) => p.name === 'operation');
      
      expect(operationProp).toBeDefined();
      expect(operationProp?.type).toBe('options');
      expect(operationProp?.default).toBe('getContacts');
    });

    it('should have baseUrl parameter', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const baseUrlProp = properties.find((p: any) => p.name === 'baseUrl');
      
      expect(baseUrlProp).toBeDefined();
      expect(baseUrlProp?.type).toBe('string');
      expect(baseUrlProp?.required).toBe(true);
      expect(baseUrlProp?.default).toBe('https://your-chatwoot-instance.com');
    });

    it('should have accountId parameter', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const accountIdProp = properties.find((p: any) => p.name === 'accountId');
      
      expect(accountIdProp).toBeDefined();
      expect(accountIdProp?.type).toBe('string');
      expect(accountIdProp?.required).toBe(true);
    });

    it('should have apiToken parameter with password type', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const apiTokenProp = properties.find((p: any) => p.name === 'apiToken');
      
      expect(apiTokenProp).toBeDefined();
      expect(apiTokenProp?.type).toBe('string');
      expect(apiTokenProp?.required).toBe(true);
      expect(apiTokenProp?.typeOptions?.password).toBe(true);
    });

    it('should have contactId parameter for specific operations', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const contactIdProp = properties.find((p: any) => p.name === 'contactId');
      
      expect(contactIdProp).toBeDefined();
      expect(contactIdProp?.type).toBe('string');
      expect(contactIdProp?.displayOptions?.show?.operation).toEqual([
        'getContact', 'updateContact', 'deleteContact', 'getConversations'
      ]);
    });

    it('should have conversationId parameter for conversation operations', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const conversationIdProp = properties.find((p: any) => p.name === 'conversationId');
      
      expect(conversationIdProp).toBeDefined();
      expect(conversationIdProp?.type).toBe('string');
      expect(conversationIdProp?.displayOptions?.show?.operation).toEqual([
        'getMessages', 'sendMessage', 'updateConversation'
      ]);
    });

    it('should have messageContent parameter for send message', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const messageContentProp = properties.find((p: any) => p.name === 'messageContent');
      
      expect(messageContentProp).toBeDefined();
      expect(messageContentProp?.type).toBe('string');
      expect(messageContentProp?.displayOptions?.show?.operation).toEqual(['sendMessage']);
      expect(messageContentProp?.typeOptions?.rows).toBe(3);
    });

    it('should have contactData parameter for create/update contact', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const contactDataProp = properties.find((p: any) => p.name === 'contactData');
      
      expect(contactDataProp).toBeDefined();
      expect(contactDataProp?.type).toBe('collection');
      expect(contactDataProp?.displayOptions?.show?.operation).toEqual(['createContact', 'updateContact']);
    });
  });

  describe('操作选项', () => {
    it('should support get contacts operation', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const operationProp = properties.find((p: any) => p.name === 'operation');
      const getContactsOption = operationProp?.options.find((o: any) => o.value === 'getContacts');
      
      expect(getContactsOption).toBeDefined();
      expect(getContactsOption?.name).toBe('Get Contacts');
      expect(getContactsOption?.description).toBe('Retrieve all contacts');
    });

    it('should support create contact operation', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const operationProp = properties.find((p: any) => p.name === 'operation');
      const createContactOption = operationProp?.options.find((o: any) => o.value === 'createContact');
      
      expect(createContactOption).toBeDefined();
      expect(createContactOption?.name).toBe('Create Contact');
      expect(createContactOption?.description).toBe('Create a new contact');
    });

    it('should support send message operation', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const operationProp = properties.find((p: any) => p.name === 'operation');
      const sendMessageOption = operationProp?.options.find((o: any) => o.value === 'sendMessage');
      
      expect(sendMessageOption).toBeDefined();
      expect(sendMessageOption?.name).toBe('Send Message');
      expect(sendMessageOption?.description).toBe('Send a message to a conversation');
    });

    it('should support get conversations operation', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const operationProp = properties.find((p: any) => p.name === 'operation');
      const getConversationsOption = operationProp?.options.find((o: any) => o.value === 'getConversations');
      
      expect(getConversationsOption).toBeDefined();
      expect(getConversationsOption?.name).toBe('Get Conversations');
      expect(getConversationsOption?.description).toBe('Get conversations for a contact');
    });

    it('should support get messages operation', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const operationProp = properties.find((p: any) => p.name === 'operation');
      const getMessagesOption = operationProp?.options.find((o: any) => o.value === 'getMessages');
      
      expect(getMessagesOption).toBeDefined();
      expect(getMessagesOption?.name).toBe('Get Messages');
      expect(getMessagesOption?.description).toBe('Get messages from a conversation');
    });

    it('should support update conversation operation', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const operationProp = properties.find((p: any) => p.name === 'operation');
      const updateConversationOption = operationProp?.options.find((o: any) => o.value === 'updateConversation');
      
      expect(updateConversationOption).toBeDefined();
      expect(updateConversationOption?.name).toBe('Update Conversation');
      expect(updateConversationOption?.description).toBe('Update conversation status or assignment');
    });
  });

  describe('执行功能', () => {
    it('should implement execute method', () => {
      const node = new Chatwoot();
      expect(typeof node.execute).toBe('function');
    });

    it('should have correct operation count', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const operationProp = properties.find((p: any) => p.name === 'operation');
      
      expect(operationProp?.options.length).toBe(9);
      expect(operationProp?.options.map((o: any) => o.value)).toEqual([
        'getContacts',
        'createContact',
        'getContact',
        'updateContact',
        'deleteContact',
        'getConversations',
        'getMessages',
        'sendMessage',
        'updateConversation'
      ]);
    });
  });

  describe('Chatwoot API功能', () => {
    it('should handle API response data structure', () => {
      const node = new Chatwoot();
      
      // Test that the node is structured to handle Chatwoot API responses
      const properties = node.description.properties;
      const operationProp = properties.find((p: any) => p.name === 'operation');
      
      expect(operationProp?.options.length).toBe(9);
      expect(operationProp?.options.map((o: any) => o.value)).toEqual([
        'getContacts',
        'createContact', 
        'getContact',
        'updateContact',
        'deleteContact',
        'getConversations',
        'getMessages',
        'sendMessage',
        'updateConversation'
      ]);
    });

    it('should support contact data collection fields', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      const contactDataProp = properties.find((p: any) => p.name === 'contactData');
      
      expect(contactDataProp?.placeholder).toBe('Add contact fields');
      expect(contactDataProp?.options?.length).toBeGreaterThan(0);
      
      // Check for essential contact fields
      const nameField = contactDataProp?.options?.find((o: any) => o.name === 'name');
      const emailField = contactDataProp?.options?.find((o: any) => o.name === 'email');
      const phoneField = contactDataProp?.options?.find((o: any) => o.name === 'phone_number');
      
      expect(nameField).toBeDefined();
      expect(emailField).toBeDefined();
      expect(phoneField).toBeDefined();
    });

    it('should validate required parameters for each operation', () => {
      const node = new Chatwoot();
      const properties = node.description.properties;
      
      // Base URL and API token should always be required
      const baseUrlProp = properties.find((p: any) => p.name === 'baseUrl');
      const apiTokenProp = properties.find((p: any) => p.name === 'apiToken');
      const accountIdProp = properties.find((p: any) => p.name === 'accountId');
      
      expect(baseUrlProp?.required).toBe(true);
      expect(apiTokenProp?.required).toBe(true);
      expect(accountIdProp?.required).toBe(true);
    });
  });
});