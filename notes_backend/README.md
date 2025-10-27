# Notes Backend (Express)

Simple Express backend providing a REST API to create, read, update, and delete notes using in-memory storage.

- Server port: 3001 (change using PORT env var)
- API base path: /api/notes
- Swagger UI: /docs
- Health check: GET /

## Getting Started

Install dependencies and run:

```bash
npm install
npm run dev   # for hot-reload with nodemon
# or
npm start
```

Server starts on http://localhost:3001

## Endpoints

- GET /api/notes
  - Query params: q (optional) filter by title/content substring
  - Response: { items: Note[], count: number }

- GET /api/notes/:id
  - Response: Note
  - 404 if not found

- POST /api/notes
  - Body: { title: string, content: string }
  - 201 on success, returns created Note
  - 400 if validation fails

- PUT /api/notes/:id
  - Body: { title?: string, content?: string } (at least one required)
  - 200 on success, returns updated Note
  - 400 if validation fails
  - 404 if not found

- DELETE /api/notes/:id
  - 200 on success, returns { success: true, deletedId }
  - 404 if not found

### Note schema

```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## cURL Examples

Create:
```bash
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"First note","content":"Hello world"}'
```

List:
```bash
curl http://localhost:3001/api/notes
```

Get by id:
```bash
curl http://localhost:3001/api/notes/<ID>
```

Update:
```bash
curl -X PUT http://localhost:3001/api/notes/<ID> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title"}'
```

Delete:
```bash
curl -X DELETE http://localhost:3001/api/notes/<ID>
```

## CORS

CORS is enabled for all origins and common methods/headers. Adjust in src/app.js if needed.

## Swagger Docs

- Open the interactive API docs at http://localhost:3001/docs
