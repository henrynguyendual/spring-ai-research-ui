# Spring AI Research - API Specification

## Overview

This API provides AI chat functionalities and document management with Retrieval-Augmented Generation (RAG) capabilities. The application is built with Spring Boot 3.5.4, using Spring AI with Ollama and WebFlux for reactive programming.

**Base URL**: `http://localhost:8080` (configurable)

## General Information

### Content-Type

- **Request**: `application/json`
- **Response**: `application/json`
- **Streaming Response**: `text/plain` or `text/event-stream`

### Validation Rules

- All fields with the `@NotBlank` annotation are required.
- Size limits are applied to text fields.
- Temperature must be between 0.0 and 2.0.

### Error Handling

- **400 Bad Request**: Validation errors, missing required parameters.
- **404 Not Found**: Resource does not exist.
- **500 Internal Server Error**: Server errors.

---

## 1. Chat API

Base path: `/api/v1/chat`

### 1.1 Basic Chat

**Endpoint**: `POST /api/v1/chat`

**Description**: Send a message to the AI and receive an immediate response.

**Request Body**:

```json
{
  "message": "string (required, max 4000 chars)",
  "sessionId": "string (optional, max 255 chars)",
  "model": "string (optional, max 50 chars)",
  "temperature": "number (optional, 0.0-2.0)",
  "streaming": "boolean (optional)",
  "systemPrompt": "string (optional)"
}
```

**Response**:

```json
{
  "response": "string",
  "sessionId": "string",
  "model": "string",
  "temperature": "number",
  "tokensUsed": "integer",
  "responseTimeMs": "integer",
  "timestamp": "string (ISO 8601)",
  "metadata": "object",
  "fromCache": "boolean"
}
```

**Example Request**:

```bash
curl -X POST http://localhost:8080/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how can you help me?",
    "sessionId": "session_123",
    "temperature": 0.7
  }'
```

### 1.2 Streaming Chat

**Endpoint**: `POST /api/v1/chat/stream`

**Description**: Send a message and receive a real-time streaming response.

**Request Body**: Same as basic chat.

**Response**: `Flux<String>` - A stream of AI response tokens.

**Example**:

```bash
curl -X POST http://localhost:8080/api/v1/chat/stream \
  -H "Content-Type: application/json" \
  -H "Accept: text/plain" \
  -d '{
    "message": "Tell me a long story",
    "sessionId": "session_123"
  }'
```

### 1.3 Chat with RAG

**Endpoint**: `POST /api/v1/chat/rag`

**Description**: Chat with the ability to retrieve information from the knowledge base.

**Request Body**: Same as basic chat.

**Response**: Same as basic chat.

**Example**:

```bash
curl -X POST http://localhost:8080/api/v1/chat/rag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Find information about the Java Spring Framework",
    "sessionId": "session_123"
  }'
```

### 1.4 Get Chat History

**Endpoint**: `GET /api/v1/chat/history/{sessionId}`

**Description**: Get the entire chat history of a session.

**Parameters**:

- `sessionId` (path): The ID of the session.

**Response**:

```json
[
  {
    "id": "integer",
    "sessionId": "string",
    "userMessage": "string",
    "aiResponse": "string",
    "modelUsed": "string",
    "temperature": "number",
    "tokensUsed": "integer",
    "responseTimeMs": "integer",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]
```

**Example**:

```bash
curl -X GET http://localhost:8080/api/v1/chat/history/session_123
```

### 1.5 Delete Chat History

**Endpoint**: `DELETE /api/v1/chat/history/{sessionId}`

**Description**: Delete the entire chat history of a session.

**Parameters**:

- `sessionId` (path): The ID of the session.

**Response**: `204 No Content`

**Example**:

```bash
curl -X DELETE http://localhost:8080/api/v1/chat/history/session_123
```

### 1.6 Health Check

**Endpoint**: `GET /api/v1/chat/health`

**Description**: Check the operational status of the chat service.

**Response**: `"Chat service is healthy"`

---

## 2. Document API

Base path: `/api/v1/documents`

### 2.1 Create Document

**Endpoint**: `POST /api/v1/documents`

**Description**: Create a new document in the knowledge base.

**Request Body**:

```json
{
  "title": "string (required, max 255 chars)",
  "content": "string (required)",
  "sourceUrl": "string (optional)",
  "documentType": "string (optional, max 50 chars)",
  "metadata": "object (optional)",
  "autoIndex": "boolean (optional)"
}
```

**Response**: `201 Created`

```json
{
  "id": "integer",
  "title": "string",
  "content": "string",
  "sourceUrl": "string",
  "documentType": "string",
  "metadata": "string",
  "embeddings": "array",
  "indexed": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Example**:

```bash
curl -X POST http://localhost:8080/api/v1/documents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spring Boot Tutorial",
    "content": "Spring Boot is a framework...",
    "documentType": "tutorial",
    "autoIndex": true
  }'
```

### 2.2 Index Document

**Endpoint**: `POST /api/v1/documents/{documentId}/index`

**Description**: Create an embedding vector for the document to be used in RAG.

**Parameters**:

- `documentId` (path): The ID of the document.

**Response**: `202 Accepted`

**Example**:

```bash
curl -X POST http://localhost:8080/api/v1/documents/1/index
```

### 2.3 Index All Documents

**Endpoint**: `POST /api/v1/documents/index-all`

**Description**: Index all un-indexed documents.

**Response**: `202 Accepted`

**Example**:

```bash
curl -X POST http://localhost:8080/api/v1/documents/index-all
```

### 2.4 Get Document Information

**Endpoint**: `GET /api/v1/documents/{id}`

**Description**: Get detailed information about a document.

**Parameters**:

- `id` (path): The ID of the document.

**Response**: Same as the create document response.

**Example**:

```bash
curl -X GET http://localhost:8080/api/v1/documents/1
```

### 2.5 Search Documents

**Endpoint**: `GET /api/v1/documents/search`

**Description**: Search for documents by keyword or document type.

**Query Parameters**:

- `q` (optional): Search keyword.
- `type` (optional): Document type.

**Note**: At least one of the two parameters must be provided.

**Response**: Array of documents.

**Examples**:

```bash
# Search by keyword
curl -X GET "http://localhost:8080/api/v1/documents/search?q=Spring Boot"

# Search by type
curl -X GET "http://localhost:8080/api/v1/documents/search?type=tutorial"
```

### 2.6 Find Relevant Documents

**Endpoint**: `GET /api/v1/documents/relevant`

**Description**: Find relevant documents using similarity search with embeddings.

**Query Parameters**:

- `query` (required): The query string.
- `maxResults` (optional, default=5): Maximum number of results.

**Response**: Array of relevant documents.

**Example**:

```bash
curl -X GET "http://localhost:8080/api/v1/documents/relevant?query=Java programming&maxResults=10"
```

### 2.7 Delete Document

**Endpoint**: `DELETE /api/v1/documents/{id}`

**Description**: Delete a document from the knowledge base.

**Parameters**:

- `id` (path): The ID of the document.

**Response**: `204 No Content`

**Example**:

```bash
curl -X DELETE http://localhost:8080/api/v1/documents/1
```

### 2.8 Health Check

**Endpoint**: `GET /api/v1/documents/health`

**Description**: Check the operational status of the document service.

**Response**: `"Document service is healthy"`

---

## 3. Monitoring & Management

### 3.1 Actuator Endpoints

- **Health**: `GET /actuator/health`
- **Info**: `GET /actuator/info`
- **Metrics**: `GET /actuator/metrics`

### 3.2 Database Console (Development)

- **H2 Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: (empty)

---

## 4. Configuration

### 4.1 Environment Variables

- `OLLAMA_BASE_URL`: URL of the Ollama server (default: <http://localhost:11434>)
- `OLLAMA_MODEL`: Default chat model (default: gpt-oss:20b)
- `OLLAMA_EMBEDDING_MODEL`: Embedding model (default: nomic-embed-text)
- `OLLAMA_TEMPERATURE`: Default temperature (default: 0.7)

### 4.2 AI Models

- **Chat Model**: gpt-oss:20b (configurable)
- **Embedding Model**: nomic-embed-text
- **Max Tokens**: 2000
- **Temperature Range**: 0.0 - 2.0

---

## 5. Data Models

### 5.1 ChatMessage Entity

```json
{
  "id": "Long",
  "sessionId": "String (max 255)",
  "userMessage": "String (required)",
  "aiResponse": "String",
  "modelUsed": "String",
  "temperature": "Double",
  "tokensUsed": "Integer",
  "responseTimeMs": "Long",
  "createdAt": "Instant",
  "updatedAt": "Instant"
}
```

### 5.2 Document Entity

```json
{
  "id": "Long",
  "title": "String (required, max 255)",
  "content": "String (required)",
  "sourceUrl": "String",
  "documentType": "String (max 50)",
  "metadata": "String (JSON)",
  "embeddings": "List<Float>",
  "indexed": "Boolean",
  "createdAt": "Instant",
  "updatedAt": "Instant"
}
```

---

## 6. Frontend Integration Guidelines

### 6.1 Session Management

- Create a unique sessionId for each conversation.
- Store the sessionId in localStorage or sessionStorage.
- Use the same sessionId for all requests within a conversation.

### 6.2 Streaming Implementation

- Use Server-Sent Events (SSE) or WebSocket.
- Handle the stream response from the `/chat/stream` endpoint.
- Implement a progressive loading UI for the stream response.

### 6.3 Document Upload Flow

1. Upload the document via the `/documents` endpoint.
2. If `autoIndex=true`, the document will be indexed automatically.
3. If not, call `/documents/{id}/index` to index it manually.
4. Use in RAG chat after indexing is complete.

### 6.4 Error Handling

- Implement retry logic for network errors.
- Show user-friendly error messages.
- Handle validation errors from the server response.

### 6.5 Performance Optimization

- Implement pagination for the document list.
- Cache chat history locally.
- Debounce search requests.
- Use loading states for async operations.

---

## 7. Testing Endpoints

Use the health check endpoints to verify the API:

```bash
# Test chat service
curl http://localhost:8080/api/v1/chat/health

# Test document service
curl http://localhost:8080/api/v1/documents/health

# Test overall application health
curl http://localhost:8080/actuator/health
```

## 8. Notes for the Frontend Team

1. **Authentication**: Currently, there is no authentication. Implement if necessary.
2. **CORS**: CORS needs to be configured for the frontend domain.
3. **Rate Limiting**: There is no rate limiting. Consider implementing for production.
4. **File Upload**: File upload is not supported, only text content is accepted.
5. **WebSocket**: WebSocket can be implemented for a better real-time chat experience.
6. **Pagination**: Document endpoints do not have pagination yet. Implement for large datasets.

---

_This document is automatically generated from the source code. Please update it when the API changes._
