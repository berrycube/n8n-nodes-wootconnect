// Mock n8n-workflow as ES module
export const NodeConnectionType = {
  Main: 'main',
  AiAgent: 'ai_agent',
};

export class NodeOperationError extends Error {
  constructor(node, error, options = {}) {
    super(typeof error === 'string' ? error : error.message);
    this.name = 'NodeOperationError';
  }
}

export class IExecuteFunctions {}
export class INodeExecutionData {}
export class INodeType {}
export class INodeTypeDescription {}

export const IHttpRequestMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
};

export const sleep = async () => undefined;