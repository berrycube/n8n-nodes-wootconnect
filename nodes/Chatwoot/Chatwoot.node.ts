import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IHttpRequestMethods,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

export class Chatwoot implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Chatwoot',
    name: 'chatwoot',
    group: ['communication'],
    version: 1,
    description: 'Chatwoot integration for managing contacts, conversations, and messages',
    defaults: {
      name: 'Chatwoot',
    },
    inputs: [{ type: NodeConnectionType.Main }],
    outputs: [{ type: NodeConnectionType.Main }],
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
            name: 'Update Conversation',
            value: 'updateConversation',
            description: 'Update conversation status or assignment',
          },
        ],
        default: 'getContacts',
        description: 'The operation to perform',
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
            operation: ['getContact', 'updateContact', 'deleteContact', 'getConversations'],
          },
        },
        description: 'Contact ID to work with',
      },
      {
        displayName: 'Conversation ID',
        name: 'conversationId',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['getMessages', 'sendMessage', 'updateConversation'],
          },
        },
        description: 'Conversation ID to work with',
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

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;
      const baseUrl = this.getNodeParameter('baseUrl', i) as string;
      const accountId = this.getNodeParameter('accountId', i) as string;
      const apiToken = this.getNodeParameter('apiToken', i) as string;

      try {
        let result: any = {};
        
        switch (operation) {
          case 'getContacts':
            try {
              const options = {
                method: 'GET' as IHttpRequestMethods,
                url: `${baseUrl}/api/v1/accounts/${accountId}/contacts`,
                headers: {
                  'api_access_token': apiToken,
                  'Content-Type': 'application/json',
                },
                json: true,
              };

              const response = await this.helpers.request(options);
              
              result = {
                operation: 'getContacts',
                success: true,
                contacts: response.payload || [],
                meta: response.meta,
              };
            } catch (error) {
              result = {
                operation: 'getContacts',
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get contacts',
              };
            }
            break;
            
          case 'createContact':
            const contactData = this.getNodeParameter('contactData', i) as any;
            try {
              const options = {
                method: 'POST' as IHttpRequestMethods,
                url: `${baseUrl}/api/v1/accounts/${accountId}/contacts`,
                headers: {
                  'api_access_token': apiToken,
                  'Content-Type': 'application/json',
                },
                body: contactData,
                json: true,
              };

              const response = await this.helpers.request(options);
              
              result = {
                operation: 'createContact',
                success: true,
                contact: response.payload,
              };
            } catch (error) {
              result = {
                operation: 'createContact',
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create contact',
                contactData,
              };
            }
            break;
            
          case 'getContact':
            const contactId = this.getNodeParameter('contactId', i) as string;
            try {
              const options = {
                method: 'GET' as IHttpRequestMethods,
                url: `${baseUrl}/api/v1/accounts/${accountId}/contacts/${contactId}`,
                headers: {
                  'api_access_token': apiToken,
                  'Content-Type': 'application/json',
                },
                json: true,
              };

              const response = await this.helpers.request(options);
              
              result = {
                operation: 'getContact',
                success: true,
                contact: response.payload,
              };
            } catch (error) {
              result = {
                operation: 'getContact',
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get contact',
                contactId,
              };
            }
            break;
            
          case 'sendMessage':
            const conversationId = this.getNodeParameter('conversationId', i) as string;
            const messageContent = this.getNodeParameter('messageContent', i) as string;
            try {
              const options = {
                method: 'POST' as IHttpRequestMethods,
                url: `${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
                headers: {
                  'api_access_token': apiToken,
                  'Content-Type': 'application/json',
                },
                body: {
                  content: messageContent,
                  message_type: 'outgoing',
                },
                json: true,
              };

              const response = await this.helpers.request(options);
              
              result = {
                operation: 'sendMessage',
                success: true,
                message: response,
                conversationId,
              };
            } catch (error) {
              result = {
                operation: 'sendMessage',
                success: false,
                error: error instanceof Error ? error.message : 'Failed to send message',
                conversationId,
                messageContent,
              };
            }
            break;
            
          case 'updateContact':
            const updateContactId = this.getNodeParameter('contactId', i) as string;
            const updateContactData = this.getNodeParameter('contactData', i) as any;
            try {
              const options = {
                method: 'PUT' as IHttpRequestMethods,
                url: `${baseUrl}/api/v1/accounts/${accountId}/contacts/${updateContactId}`,
                headers: {
                  'api_access_token': apiToken,
                  'Content-Type': 'application/json',
                },
                body: updateContactData,
                json: true,
              };

              const response = await this.helpers.request(options);
              
              result = {
                operation: 'updateContact',
                success: true,
                contact: response.payload,
              };
            } catch (error) {
              result = {
                operation: 'updateContact',
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update contact',
                contactId: updateContactId,
                updateContactData,
              };
            }
            break;
            
          case 'deleteContact':
            const deleteContactId = this.getNodeParameter('contactId', i) as string;
            try {
              const options = {
                method: 'DELETE' as IHttpRequestMethods,
                url: `${baseUrl}/api/v1/accounts/${accountId}/contacts/${deleteContactId}`,
                headers: {
                  'api_access_token': apiToken,
                  'Content-Type': 'application/json',
                },
                json: true,
              };

              const response = await this.helpers.request(options);
              
              result = {
                operation: 'deleteContact',
                success: true,
                message: 'Contact deleted successfully',
                contactId: deleteContactId,
              };
            } catch (error) {
              result = {
                operation: 'deleteContact',
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete contact',
                contactId: deleteContactId,
              };
            }
            break;
            
          case 'getConversations':
            const conversationsContactId = this.getNodeParameter('contactId', i) as string;
            try {
              const options = {
                method: 'GET' as IHttpRequestMethods,
                url: `${baseUrl}/api/v1/accounts/${accountId}/contacts/${conversationsContactId}/conversations`,
                headers: {
                  'api_access_token': apiToken,
                  'Content-Type': 'application/json',
                },
                json: true,
              };

              const response = await this.helpers.request(options);
              
              result = {
                operation: 'getConversations',
                success: true,
                conversations: response.payload || [],
                contactId: conversationsContactId,
                meta: response.meta,
              };
            } catch (error) {
              result = {
                operation: 'getConversations',
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get conversations',
                contactId: conversationsContactId,
              };
            }
            break;
            
          case 'getMessages':
            const messagesConversationId = this.getNodeParameter('conversationId', i) as string;
            try {
              const options = {
                method: 'GET' as IHttpRequestMethods,
                url: `${baseUrl}/api/v1/accounts/${accountId}/conversations/${messagesConversationId}/messages`,
                headers: {
                  'api_access_token': apiToken,
                  'Content-Type': 'application/json',
                },
                json: true,
              };

              const response = await this.helpers.request(options);
              
              result = {
                operation: 'getMessages',
                success: true,
                messages: response.payload || [],
                conversationId: messagesConversationId,
                meta: response.meta,
              };
            } catch (error) {
              result = {
                operation: 'getMessages',
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get messages',
                conversationId: messagesConversationId,
              };
            }
            break;
            
          case 'updateConversation':
            const updateConversationId = this.getNodeParameter('conversationId', i) as string;
            const conversationUpdateData = this.getNodeParameter('conversationData', i, {}) as any;
            try {
              const options = {
                method: 'PUT' as IHttpRequestMethods,
                url: `${baseUrl}/api/v1/accounts/${accountId}/conversations/${updateConversationId}`,
                headers: {
                  'api_access_token': apiToken,
                  'Content-Type': 'application/json',
                },
                body: conversationUpdateData,
                json: true,
              };

              const response = await this.helpers.request(options);
              
              result = {
                operation: 'updateConversation',
                success: true,
                conversation: response.payload,
                conversationId: updateConversationId,
              };
            } catch (error) {
              result = {
                operation: 'updateConversation',
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update conversation',
                conversationId: updateConversationId,
                conversationUpdateData,
              };
            }
            break;
            
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