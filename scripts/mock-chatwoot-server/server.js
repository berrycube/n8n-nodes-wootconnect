#!/usr/bin/env node

const http = require('http');
const url = require('url');

// Mock数据存储
let contacts = [];
let conversations = [];
let messages = [];
let contactIdCounter = 1;
let conversationIdCounter = 1;
let messageIdCounter = 1;

// 环境变量
const PORT = process.env.PORT || 4021;
const TOKEN = process.env.TOKEN || 'testtoken';

// 初始化一些示例数据
function initializeMockData() {
  // 创建示例联系人
  const sampleContact = {
    id: contactIdCounter++,
    name: 'John Doe',
    email: 'john@example.com',
    phone_number: '+1234567890',
    avatar_url: 'https://example.com/avatar.jpg',
    identifier: 'user_001',
    custom_attributes: {
      department: 'Engineering'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  contacts.push(sampleContact);

  // 创建示例对话
  const sampleConversation = {
    id: conversationIdCounter++,
    contact_id: sampleContact.id,
    status: 'open',
    assignee_id: null,
    team_id: null,
    priority: 'medium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  conversations.push(sampleConversation);

  // 创建示例消息
  const sampleMessage = {
    id: messageIdCounter++,
    conversation_id: sampleConversation.id,
    content: 'Hello! How can I help you today?',
    message_type: 'outgoing',
    created_at: new Date().toISOString()
  };
  messages.push(sampleMessage);
}

// 验证API令牌
function validateToken(req) {
  const authHeader = req.headers['api_access_token'];
  return authHeader === TOKEN;
}

// 发送JSON响应
function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,api_access_token'
  });
  res.end(JSON.stringify(data));
}

// 处理CORS预检请求
function handleCORS(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,api_access_token'
    });
    res.end();
    return true;
  }
  return false;
}

// 解析请求体
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const trimmedBody = body.trim();
        resolve(trimmedBody ? JSON.parse(trimmedBody) : {});
      } catch (err) {
        console.error('JSON parsing error:', err, 'Body:', body);
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// 创建HTTP服务器
const server = http.createServer(async (req, res) => {
  try {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    // 处理CORS
    if (handleCORS(req, res)) return;

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // 健康检查
    if (path === '/health' || path === '/') {
      return sendJSON(res, {
        status: 'ok',
        service: 'mock-chatwoot-api',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    }

    // 验证API令牌
    if (!validateToken(req)) {
      return sendJSON(res, {
        error: 'Unauthorized',
        message: 'Invalid API token'
      }, 401);
    }

    // 解析请求体
    let body = {};
    if (method === 'POST' || method === 'PUT') {
      try {
        body = await parseBody(req);
      } catch (err) {
        return sendJSON(res, {
          error: 'Bad Request',
          message: 'Invalid JSON in request body'
        }, 400);
      }
    }

    // 路由处理
    const pathParts = path.split('/').filter(p => p);

    // GET /api/v1/accounts/:accountId/contacts
    if (method === 'GET' && pathParts.length === 5 && pathParts[4] === 'contacts') {
      return sendJSON(res, {
        payload: contacts,
        meta: {
          count: contacts.length,
          current_page: 1,
          total_pages: 1
        }
      });
    }

    // POST /api/v1/accounts/:accountId/contacts
    if (method === 'POST' && pathParts.length === 5 && pathParts[4] === 'contacts') {
      const newContact = {
        id: contactIdCounter++,
        name: body.name || 'Unnamed Contact',
        email: body.email || '',
        phone_number: body.phone_number || '',
        avatar_url: body.avatar_url || '',
        identifier: body.identifier || `contact_${Date.now()}`,
        custom_attributes: body.custom_attributes || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      contacts.push(newContact);
      
      return sendJSON(res, {
        payload: newContact
      }, 201);
    }

    // GET /api/v1/accounts/:accountId/contacts/:contactId
    if (method === 'GET' && pathParts.length === 6 && pathParts[4] === 'contacts') {
      const contactId = parseInt(pathParts[5]);
      const contact = contacts.find(c => c.id === contactId);
      
      if (!contact) {
        return sendJSON(res, {
          error: 'Not Found',
          message: 'Contact not found'
        }, 404);
      }
      
      return sendJSON(res, {
        payload: contact
      });
    }

    // PUT /api/v1/accounts/:accountId/contacts/:contactId
    if (method === 'PUT' && pathParts.length === 6 && pathParts[4] === 'contacts') {
      const contactId = parseInt(pathParts[5]);
      const contactIndex = contacts.findIndex(c => c.id === contactId);
      
      if (contactIndex === -1) {
        return sendJSON(res, {
          error: 'Not Found',
          message: 'Contact not found'
        }, 404);
      }
      
      // 更新联系人
      contacts[contactIndex] = {
        ...contacts[contactIndex],
        ...body,
        id: contactId, // 保持ID不变
        updated_at: new Date().toISOString()
      };
      
      return sendJSON(res, {
        payload: contacts[contactIndex]
      });
    }

    // DELETE /api/v1/accounts/:accountId/contacts/:contactId
    if (method === 'DELETE' && pathParts.length === 6 && pathParts[4] === 'contacts') {
      const contactId = parseInt(pathParts[5]);
      const contactIndex = contacts.findIndex(c => c.id === contactId);
      
      if (contactIndex === -1) {
        return sendJSON(res, {
          error: 'Not Found',
          message: 'Contact not found'
        }, 404);
      }
      
      contacts.splice(contactIndex, 1);
      return sendJSON(res, {
        message: 'Contact deleted successfully'
      });
    }

    // GET /api/v1/accounts/:accountId/contacts/:contactId/conversations
    if (method === 'GET' && pathParts.length === 7 && pathParts[4] === 'contacts' && pathParts[6] === 'conversations') {
      const contactId = parseInt(pathParts[5]);
      const contactConversations = conversations.filter(c => c.contact_id === contactId);
      
      return sendJSON(res, {
        payload: contactConversations,
        meta: {
          count: contactConversations.length,
          current_page: 1,
          total_pages: 1
        }
      });
    }

    // GET /api/v1/accounts/:accountId/conversations/:conversationId/messages
    if (method === 'GET' && pathParts.length === 7 && pathParts[4] === 'conversations' && pathParts[6] === 'messages') {
      const conversationId = parseInt(pathParts[5]);
      const conversationMessages = messages.filter(m => m.conversation_id === conversationId);
      
      return sendJSON(res, {
        payload: conversationMessages,
        meta: {
          count: conversationMessages.length,
          current_page: 1,
          total_pages: 1
        }
      });
    }

    // POST /api/v1/accounts/:accountId/conversations/:conversationId/messages
    if (method === 'POST' && pathParts.length === 7 && pathParts[4] === 'conversations' && pathParts[6] === 'messages') {
      const conversationId = parseInt(pathParts[5]);
      
      // 验证对话是否存在
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) {
        return sendJSON(res, {
          error: 'Not Found',
          message: 'Conversation not found'
        }, 404);
      }
      
      const newMessage = {
        id: messageIdCounter++,
        conversation_id: conversationId,
        content: body.content || '',
        message_type: body.message_type || 'outgoing',
        created_at: new Date().toISOString()
      };
      messages.push(newMessage);
      
      return sendJSON(res, newMessage, 201);
    }

    // PUT /api/v1/accounts/:accountId/conversations/:conversationId
    if (method === 'PUT' && pathParts.length === 6 && pathParts[4] === 'conversations') {
      const conversationId = parseInt(pathParts[5]);
      const conversationIndex = conversations.findIndex(c => c.id === conversationId);
      
      if (conversationIndex === -1) {
        return sendJSON(res, {
          error: 'Not Found',
          message: 'Conversation not found'
        }, 404);
      }
      
      // 更新对话
      conversations[conversationIndex] = {
        ...conversations[conversationIndex],
        ...body,
        id: conversationId, // 保持ID不变
        updated_at: new Date().toISOString()
      };
      
      return sendJSON(res, {
        payload: conversations[conversationIndex]
      });
    }

    // 404 - 路由未找到
    return sendJSON(res, {
      error: 'Not Found',
      message: `Route ${method} ${path} not found`,
      available_routes: [
        'GET /api/v1/accounts/:accountId/contacts',
        'POST /api/v1/accounts/:accountId/contacts',
        'GET /api/v1/accounts/:accountId/contacts/:contactId',
        'PUT /api/v1/accounts/:accountId/contacts/:contactId',
        'DELETE /api/v1/accounts/:accountId/contacts/:contactId',
        'GET /api/v1/accounts/:accountId/contacts/:contactId/conversations',
        'GET /api/v1/accounts/:accountId/conversations/:conversationId/messages',
        'POST /api/v1/accounts/:accountId/conversations/:conversationId/messages',
        'PUT /api/v1/accounts/:accountId/conversations/:conversationId'
      ]
    }, 404);

  } catch (error) {
    console.error('Server error:', error);
    return sendJSON(res, {
      error: 'Internal Server Error',
      message: error.message
    }, 500);
  }
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`🚀 Chatwoot Mock API Server running on http://localhost:${PORT}`);
  console.log(`📝 API Token: ${TOKEN}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('📚 Available endpoints:');
  console.log('  GET    /api/v1/accounts/:accountId/contacts');
  console.log('  POST   /api/v1/accounts/:accountId/contacts');
  console.log('  GET    /api/v1/accounts/:accountId/contacts/:contactId');
  console.log('  PUT    /api/v1/accounts/:accountId/contacts/:contactId');
  console.log('  DELETE /api/v1/accounts/:accountId/contacts/:contactId');
  console.log('  GET    /api/v1/accounts/:accountId/contacts/:contactId/conversations');
  console.log('  GET    /api/v1/accounts/:accountId/conversations/:conversationId/messages');
  console.log('  POST   /api/v1/accounts/:accountId/conversations/:conversationId/messages');
  console.log('  PUT    /api/v1/accounts/:accountId/conversations/:conversationId');
  console.log('');
  
  // 初始化模拟数据
  initializeMockData();
  console.log('✅ Mock data initialized');
  console.log(`   - ${contacts.length} sample contacts`);
  console.log(`   - ${conversations.length} sample conversations`);
  console.log(`   - ${messages.length} sample messages`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});