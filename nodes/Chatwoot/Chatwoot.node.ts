import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IHttpRequestMethods,
  NodeOperationError,
} from 'n8n-workflow';

export class Chatwoot implements INodeType {
  /**
   * Create a standardized HTTP request to the Chatwoot API
   * @param baseUrl - Chatwoot instance base URL
   * @param accountId - Account ID
   * @param apiToken - API access token
   * @param endpoint - API endpoint (e.g., '/contacts')
   * @param method - HTTP method
   * @param body - Request body for POST/PUT requests
   * @returns HTTP request options
   */
  public createApiRequest(
    baseUrl: string, 
    accountId: string, 
    apiToken: string, 
    endpoint: string, 
    method: IHttpRequestMethods,
    body?: any,
    query?: Record<string, string | number | boolean | undefined>
  ) {
    let url = `${baseUrl}/api/v1/accounts/${accountId}${endpoint}`;
    if (query && Object.keys(query).length > 0) {
      const u = new URL(url);
      const sp = new URLSearchParams(u.search);
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null) sp.set(k, String(v));
      }
      u.search = sp.toString();
      url = u.toString();
    }
    const options: any = {
      method,
      url,
      headers: {
        'api_access_token': apiToken,
        'Content-Type': 'application/json',
      },
      json: true,
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = body;
    }
    
    return options;
  }
  
  /**
   * Execute API request with standardized error handling
   * @param requestHelper - n8n request helper
   * @param requestOptions - HTTP request options
   * @param operation - Operation name for error context
   * @param additionalData - Additional data to include in error response
   * @returns Standardized API response
   */
  public async executeApiRequest(
    requestHelper: any,
    requestOptions: any,
    operation: string,
    additionalData: any = {}
  ): Promise<{ success: boolean; [key: string]: any }> {
    try {
      const response = await requestHelper.request(requestOptions);
      return {
        operation,
        success: true,
        ...additionalData,
        ...(response.payload ? { [this.getResponseKey(operation)]: response.payload } : (operation === 'sendMessage' ? { message: response } : {})),
        ...(response.meta ? { meta: response.meta } : {}),
      };
    } catch (error) {
      return {
        operation,
        success: false,
        error: error instanceof Error ? error.message : `Failed to ${operation}`,
        ...additionalData,
      };
    }
  }
  
  /**
   * Get the appropriate response key based on operation
   * @param operation - Operation name
   * @returns Response key name
   */
  public getResponseKey(operation: string): string {
    const keyMap: { [key: string]: string } = {
      'getContacts': 'contacts',
      'createContact': 'contact',
      'getContact': 'contact', 
      'updateContact': 'contact',
      'deleteContact': 'message',
      'getConversations': 'conversations',
      'updateConversation': 'conversation',
      'getMessages': 'messages',
      'sendMessage': 'message',
      'listTeams': 'teams',
      'listContactTags': 'tags',
      'addContactTag': 'tag',
      'removeContactTag': 'message'
    };
    return keyMap[operation] || 'data';
  }

  description: INodeTypeDescription = {
    displayName: 'Chatwoot',
    name: 'chatwoot',
    group: ['transform'],
    version: 1,
    description: 'Chatwoot integration for managing contacts, conversations, and messages',
    defaults: {
      name: 'Chatwoot',
    },
    inputs: [{ type: 'main' }],
    outputs: [{ type: 'main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: false,
        options: [
          {
            name: 'Get Contacts',
            value: 'getContacts',
            description: 'Retrieve all contacts',
          },
          {
            name: 'Create Contact',
            value: 'createContact',
            description: 'Create a new contact',
          },
          {
            name: 'Get Contact',
            value: 'getContact',
            description: 'Get a specific contact',
          },
          {
            name: 'Update Contact',
            value: 'updateContact',
            description: 'Update a contact',
          },
          {
            name: 'Delete Contact',
            value: 'deleteContact',
            description: 'Delete a contact',
          },
          {
            name: 'Get Conversations',
            value: 'getConversations',
            description: 'Get conversations for a contact',
          },
          {
            name: 'Get Messages',
            value: 'getMessages',
            description: 'Get messages from a conversation',
          },
          {
            name: 'Send Message',
            value: 'sendMessage',
            description: 'Send a message to a conversation',
          },
          {
            name: 'Send Attachment',
            value: 'sendAttachment',
            description: 'Send an attachment to a conversation',
          },
          {
            name: 'Update Conversation',
            value: 'updateConversation',
            description: 'Update conversation status or assignment',
          },
          {
            name: 'List Teams',
            value: 'listTeams',
            description: 'List teams in the account',
          },
          {
            name: 'List Contact Tags',
            value: 'listContactTags',
            description: 'List all tags for a contact',
          },
          {
            name: 'Add Contact Tag',
            value: 'addContactTag',
            description: 'Add a tag to a contact',
          },
          {
            name: 'Remove Contact Tag',
            value: 'removeContactTag',
            description: 'Remove a tag from a contact',
          },
        ],
        default: 'getContacts',
        description: 'The operation to perform',
      },
      {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        displayOptions: {
          show: {
            operation: ['getContacts', 'getConversations', 'getMessages'],
          },
        },
        description: 'Page number for pagination',
      },
      {
        displayName: 'Per Page',
        name: 'perPage',
        type: 'number',
        default: 20,
        displayOptions: {
          show: {
            operation: ['getContacts', 'getConversations', 'getMessages'],
          },
        },
        description: 'Items per page',
      },
      {
        displayName: 'Chatwoot Base URL',
        name: 'baseUrl',
        type: 'string',
        default: 'https://your-chatwoot-instance.com',
        required: true,
        description: 'Chatwoot instance base URL',
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        required: true,
        description: 'Chatwoot account ID',
      },
      {
        displayName: 'API Token',
        name: 'apiToken',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        required: true,
        description: 'Chatwoot API access token',
      },
      {
        displayName: 'Contact ID',
        name: 'contactId',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['getContact', 'updateContact', 'deleteContact', 'getConversations', 'listContactTags', 'addContactTag', 'removeContactTag'],
          },
        },
        description: 'Contact ID to work with',
      },
      {
        displayName: 'Tag',
        name: 'tag',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['addContactTag', 'removeContactTag'],
          },
        },
        description: 'Tag to add or remove',
      },
      {
        displayName: 'Conversation ID',
        name: 'conversationId',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['getMessages', 'sendMessage', 'updateConversation', 'sendAttachment'],
          },
        },
        description: 'Conversation ID to work with',
      },
      {
        displayName: 'Attachment Source',
        name: 'attachmentSource',
        type: 'options',
        options: [
          { name: 'URL', value: 'url' },
          { name: 'Base64', value: 'base64' },
        ],
        default: 'url',
        displayOptions: { show: { operation: ['sendAttachment'] } },
        description: 'Where to read the attachment from',
      },
      {
        displayName: 'Attachment URL',
        name: 'attachmentUrl',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['sendAttachment'], attachmentSource: ['url'] } },
        description: 'Public URL of the file to attach',
      },
      {
        displayName: 'File Name',
        name: 'fileName',
        type: 'string',
        default: 'file.bin',
        displayOptions: { show: { operation: ['sendAttachment'], attachmentSource: ['base64'] } },
        description: 'File name for the base64 attachment',
      },
      {
        displayName: 'Content Type',
        name: 'contentType',
        type: 'string',
        default: 'application/octet-stream',
        displayOptions: { show: { operation: ['sendAttachment'], attachmentSource: ['base64'] } },
        description: 'MIME type of the base64 attachment',
      },
      {
        displayName: 'File (Base64)',
        name: 'attachmentBase64',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
        displayOptions: { show: { operation: ['sendAttachment'], attachmentSource: ['base64'] } },
        description: 'Base64-encoded content of the file',
      },
      {
        displayName: 'Message Content',
        name: 'messageContent',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        displayOptions: {
          show: {
            operation: ['sendMessage'],
          },
        },
        description: 'Content of the message to send',
      },
      {
        displayName: 'Contact Data',
        name: 'contactData',
        type: 'collection',
        placeholder: 'Add contact fields',
        default: {},
        displayOptions: {
          show: {
            operation: ['createContact', 'updateContact'],
          },
        },
        options: [
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            description: 'Contact name',
          },
          {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            default: '',
            description: 'Contact email address',
          },
          {
            displayName: 'Phone Number',
            name: 'phone_number',
            type: 'string',
            default: '',
            description: 'Contact phone number',
          },
          {
            displayName: 'Avatar URL',
            name: 'avatar_url',
            type: 'string',
            default: '',
            description: 'Contact avatar image URL',
          },
          {
            displayName: 'Identifier',
            name: 'identifier',
            type: 'string',
            default: '',
            description: 'External identifier for the contact',
          },
          {
            displayName: 'Custom Attributes',
            name: 'custom_attributes',
            type: 'json',
            default: '{}',
            description: 'Custom attributes as JSON object',
          },
        ],
        description: 'Contact data fields',
      },
      {
        displayName: 'Conversation Data',
        name: 'conversationData',
        type: 'collection',
        placeholder: 'Add conversation fields',
        default: {},
        displayOptions: {
          show: {
            operation: ['updateConversation'],
          },
        },
        options: [
          {
            displayName: 'Status',
            name: 'status',
            type: 'options',
            options: [
              {
                name: 'Open',
                value: 'open',
              },
              {
                name: 'Resolved',
                value: 'resolved',
              },
              {
                name: 'Pending',
                value: 'pending',
              },
            ],
            default: 'open',
            description: 'Conversation status',
          },
          {
            displayName: 'Assignee ID',
            name: 'assignee_id',
            type: 'string',
            default: '',
            description: 'Agent ID to assign conversation to',
          },
          {
            displayName: 'Team ID',
            name: 'team_id',
            type: 'string',
            default: '',
            description: 'Team ID to assign conversation to',
          },
          {
            displayName: 'Priority',
            name: 'priority',
            type: 'options',
            options: [
              {
                name: 'None',
                value: 'none',
              },
              {
                name: 'Low',
                value: 'low',
              },
              {
                name: 'Medium',
                value: 'medium',
              },
              {
                name: 'High',
                value: 'high',
              },
              {
                name: 'Urgent',
                value: 'urgent',
              },
            ],
            default: 'none',
            description: 'Conversation priority',
          },
        ],
        description: 'Conversation update data',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const chatwootInstance = new Chatwoot();

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;
      const baseUrl = this.getNodeParameter('baseUrl', i) as string;
      const accountId = this.getNodeParameter('accountId', i) as string;
      const apiToken = this.getNodeParameter('apiToken', i) as string;

      try {
        let result: any = {};
        
        switch (operation) {
          case 'getContacts':
            const page = this.getNodeParameter('page', i) as number;
            const perPage = this.getNodeParameter('perPage', i) as number;
            const requestOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, '/contacts', 'GET', undefined, { page, per_page: perPage });
            result = await chatwootInstance.executeApiRequest(this.helpers, requestOptions, 'getContacts');
            break;
            
          case 'createContact':
            const contactData = this.getNodeParameter('contactData', i) as any;
            const createContactOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, '/contacts', 'POST', contactData);
            result = await chatwootInstance.executeApiRequest(this.helpers, createContactOptions, 'createContact', { contactData });
            break;
            
          case 'getContact':
            const contactId = this.getNodeParameter('contactId', i) as string;
            const getContactOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, `/contacts/${contactId}`, 'GET');
            result = await chatwootInstance.executeApiRequest(this.helpers, getContactOptions, 'getContact', { contactId });
            break;
            
          case 'sendMessage':
            const conversationId = this.getNodeParameter('conversationId', i) as string;
            const messageContent = this.getNodeParameter('messageContent', i) as string;
            const messageBody = { content: messageContent, message_type: 'outgoing' };
            const sendMessageOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, `/conversations/${conversationId}/messages`, 'POST', messageBody);
            result = await chatwootInstance.executeApiRequest(this.helpers, sendMessageOptions, 'sendMessage', { conversationId, messageContent });
            break;
          
          case 'sendAttachment': {
            const convId = this.getNodeParameter('conversationId', i) as string;
            const source = this.getNodeParameter('attachmentSource', i) as string;
            const attachOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, `/conversations/${convId}/attachments`, 'POST');
            if (source === 'url') {
              const attachmentUrl = this.getNodeParameter('attachmentUrl', i) as string;
              (attachOptions as any).formData = { file_url: attachmentUrl };
            } else {
              const fileName = this.getNodeParameter('fileName', i) as string;
              const contentType = this.getNodeParameter('contentType', i) as string;
              const attachmentBase64 = this.getNodeParameter('attachmentBase64', i) as string;
              (attachOptions as any).formData = { file_name: fileName, file_base64: attachmentBase64, content_type: contentType };
            }
            result = await chatwootInstance.executeApiRequest(this.helpers, attachOptions, 'sendAttachment', { conversationId: convId });
            break;
          }
            
          case 'updateContact':
            const updateContactId = this.getNodeParameter('contactId', i) as string;
            const updateContactData = this.getNodeParameter('contactData', i) as any;
            const updateContactOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, `/contacts/${updateContactId}`, 'PUT', updateContactData);
            result = await chatwootInstance.executeApiRequest(this.helpers, updateContactOptions, 'updateContact', { contactId: updateContactId, updateContactData });
            break;
            
          case 'deleteContact':
            const deleteContactId = this.getNodeParameter('contactId', i) as string;
            const deleteContactOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, `/contacts/${deleteContactId}`, 'DELETE');
            result = await chatwootInstance.executeApiRequest(this.helpers, deleteContactOptions, 'deleteContact', { contactId: deleteContactId, message: 'Contact deleted successfully' });
            break;
            
          case 'getConversations':
            const conversationsContactId = this.getNodeParameter('contactId', i) as string;
            const pageConv = this.getNodeParameter('page', i) as number;
            const perPageConv = this.getNodeParameter('perPage', i) as number;
            const getConversationsOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, `/contacts/${conversationsContactId}/conversations`, 'GET', undefined, { page: pageConv, per_page: perPageConv });
            result = await chatwootInstance.executeApiRequest(this.helpers, getConversationsOptions, 'getConversations', { contactId: conversationsContactId });
            break;
            
          case 'getMessages':
            const messagesConversationId = this.getNodeParameter('conversationId', i) as string;
            const pageMsg = this.getNodeParameter('page', i) as number;
            const perPageMsg = this.getNodeParameter('perPage', i) as number;
            const getMessagesOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, `/conversations/${messagesConversationId}/messages`, 'GET', undefined, { page: pageMsg, per_page: perPageMsg });
            result = await chatwootInstance.executeApiRequest(this.helpers, getMessagesOptions, 'getMessages', { conversationId: messagesConversationId });
            break;
            
          case 'updateConversation':
            const updateConversationId = this.getNodeParameter('conversationId', i) as string;
            const conversationUpdateData = this.getNodeParameter('conversationData', i, {}) as any;
            const updateConversationOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, `/conversations/${updateConversationId}`, 'PUT', conversationUpdateData);
            result = await chatwootInstance.executeApiRequest(this.helpers, updateConversationOptions, 'updateConversation', { conversationId: updateConversationId, conversationUpdateData });
            break;

          case 'listTeams': {
            const pageTeams = this.getNodeParameter('page', i) as number;
            const perTeams = this.getNodeParameter('perPage', i) as number;
            const listTeamsOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, `/teams`, 'GET', undefined, { page: pageTeams, per_page: perTeams });
            result = await chatwootInstance.executeApiRequest(this.helpers, listTeamsOptions, 'listTeams');
            break;
          }

          case 'listContactTags': {
            const contactIdTags = this.getNodeParameter('contactId', i) as string;
            const listTagsOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, `/contacts/${contactIdTags}/tags`, 'GET');
            result = await chatwootInstance.executeApiRequest(this.helpers, listTagsOptions, 'listContactTags', { contactId: contactIdTags });
            break;
          }

          case 'addContactTag': {
            const contactIdAdd = this.getNodeParameter('contactId', i) as string;
            const tagToAdd = this.getNodeParameter('tag', i) as string;
            const addTagOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, `/contacts/${contactIdAdd}/tags`, 'POST', { tag: tagToAdd });
            result = await chatwootInstance.executeApiRequest(this.helpers, addTagOptions, 'addContactTag', { contactId: contactIdAdd, tag: tagToAdd });
            break;
          }

          case 'removeContactTag': {
            const contactIdRemove = this.getNodeParameter('contactId', i) as string;
            const tagToRemove = this.getNodeParameter('tag', i) as string;
            const removeTagOptions = chatwootInstance.createApiRequest(baseUrl, accountId, apiToken, `/contacts/${contactIdRemove}/tags/${encodeURIComponent(tagToRemove)}`, 'DELETE');
            result = await chatwootInstance.executeApiRequest(this.helpers, removeTagOptions, 'removeContactTag', { contactId: contactIdRemove, tag: tagToRemove, message: 'Tag removed' });
            break;
          }
            
          default:
            throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
        }

        returnData.push({
          json: {
            operation,
            timestamp: new Date().toISOString(),
            success: !result.error,
            ...result,
          },
        });
        
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              operation,
              timestamp: new Date().toISOString(),
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
              item: i,
            },
          });
        } else {
          throw new NodeOperationError(
            this.getNode(),
            error instanceof Error ? error : new Error('Unknown error'),
            { itemIndex: i }
          );
        }
      }
    }

    return [returnData];
  }
}
