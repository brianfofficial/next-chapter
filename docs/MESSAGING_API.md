# Messaging API Documentation

## Overview
The messaging system enables direct communication between employers and athletes. All endpoints require authentication and implement Row Level Security (RLS) policies to ensure users can only access their own conversations.

## Database Schema

### `conversations` Table
Tracks one-to-one conversations between an employer and an athlete.

```sql
- id: UUID (Primary Key)
- employer_id: UUID (Foreign Key → employers.id)
- athlete_id: UUID (Foreign Key → athletes.id)
- last_message_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
- UNIQUE(employer_id, athlete_id) -- One conversation per employer-athlete pair
```

**Indexes:**
- `idx_conversations_employer` on `employer_id`
- `idx_conversations_athlete` on `athlete_id`
- `idx_conversations_last_message` on `last_message_at DESC`

### `messages` Table
Stores individual messages within conversations.

```sql
- id: UUID (Primary Key)
- conversation_id: UUID (Foreign Key → conversations.id)
- sender_id: UUID (User ID of sender)
- sender_type: TEXT ('employer' | 'athlete')
- content: TEXT (Message content)
- is_read: BOOLEAN (Default: false)
- created_at: TIMESTAMPTZ
```

**Indexes:**
- `idx_messages_conversation` on `conversation_id`
- `idx_messages_created_at` on `created_at DESC`
- `idx_messages_unread` on `(conversation_id, is_read)` WHERE `is_read = FALSE`

**Triggers:**
- Automatically updates `conversations.last_message_at` when a new message is sent

## API Endpoints

### 1. Get All Conversations
**GET** `/api/conversations`

Returns all conversations for the authenticated user (employer or athlete).

**Response:**
```typescript
{
  conversations: Array<{
    id: string
    employer_id: string
    athlete_id: string
    last_message_at: string
    created_at: string
    updated_at: string
    employer: {
      id: string
      company_name: string
      contact_email: string
    }
    athlete: {
      id: string
      full_name: string
      sport: string
      email: string
    }
    unread_count: number
    last_message: {
      content: string
      created_at: string
      sender_type: 'employer' | 'athlete'
    } | null
  }>
}
```

**Example:**
```typescript
const response = await fetch('/api/conversations')
const { conversations } = await response.json()
```

---

### 2. Create or Get Conversation
**POST** `/api/conversations`

Employers can initiate a conversation with an athlete. Returns existing conversation if one already exists.

**Requirements:**
- User must be an employer
- Employer must have Pro subscription tier

**Request Body:**
```typescript
{
  athlete_id: string // UUID of the athlete
}
```

**Response (201 Created or 200 OK):**
```typescript
{
  conversation: {
    id: string
    employer_id: string
    athlete_id: string
    last_message_at: string
    created_at: string
    updated_at: string
  }
}
```

**Error Response (403 Forbidden):**
```typescript
{
  error: "Pro subscription required",
  upgrade_required: true
}
```

**Example:**
```typescript
const response = await fetch('/api/conversations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ athlete_id: 'athlete-uuid' })
})

if (response.status === 403) {
  const { upgrade_required } = await response.json()
  if (upgrade_required) {
    // Redirect to /employers/upgrade
  }
}

const { conversation } = await response.json()
```

---

### 3. Get Conversation Messages
**GET** `/api/conversations/[id]/messages`

Retrieves all messages for a specific conversation.

**Path Parameters:**
- `id`: Conversation UUID

**Response:**
```typescript
{
  messages: Array<{
    id: string
    conversation_id: string
    sender_id: string
    sender_type: 'employer' | 'athlete'
    content: string
    is_read: boolean
    created_at: string
  }>
}
```

**Example:**
```typescript
const response = await fetch(`/api/conversations/${conversationId}/messages`)
const { messages } = await response.json()
```

---

### 4. Send Message
**POST** `/api/conversations/[id]/messages`

Sends a new message in the conversation.

**Path Parameters:**
- `id`: Conversation UUID

**Request Body:**
```typescript
{
  content: string // Message text (required, non-empty)
}
```

**Response (201 Created):**
```typescript
{
  message: {
    id: string
    conversation_id: string
    sender_id: string
    sender_type: 'employer' | 'athlete'
    content: string
    is_read: false
    created_at: string
  }
}
```

**Example:**
```typescript
const response = await fetch(`/api/conversations/${conversationId}/messages`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: 'Hello! I saw your profile...' })
})

const { message } = await response.json()
```

---

### 5. Mark Messages as Read
**PATCH** `/api/conversations/[id]/read`

Marks all unread messages from the other participant as read.

**Path Parameters:**
- `id`: Conversation UUID

**Response:**
```typescript
{
  success: true,
  updated_count: number // Number of messages marked as read
}
```

**Example:**
```typescript
const response = await fetch(`/api/conversations/${conversationId}/read`, {
  method: 'PATCH'
})

const { updated_count } = await response.json()
console.log(`Marked ${updated_count} messages as read`)
```

---

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with the following policies:

**Conversations:**
- Employers can only view/create conversations where `employer_id = auth.uid()`
- Athletes can only view conversations where `athlete_id = auth.uid()`
- Both participants can update conversation timestamps

**Messages:**
- Users can only view messages in conversations they're part of
- Users can only send messages in their conversations
- Users can only mark messages as read if they're the recipient

### Subscription Enforcement
- Only Pro employers can initiate conversations
- API returns `upgrade_required: true` when subscription tier is insufficient
- Frontend should redirect to `/employers/upgrade` page

---

## Frontend Integration Examples

### React Hook for Conversations List
```typescript
import { useEffect, useState } from 'react'

export function useConversations() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchConversations() {
      const res = await fetch('/api/conversations')
      const data = await res.json()
      setConversations(data.conversations)
      setLoading(false)
    }

    fetchConversations()
  }, [])

  return { conversations, loading }
}
```

### React Hook for Messages
```typescript
export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch(`/api/conversations/${conversationId}/messages`)
      const data = await res.json()
      setMessages(data.messages)
      setLoading(false)
    }

    fetchMessages()
  }, [conversationId])

  const sendMessage = async (content: string) => {
    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    const { message } = await res.json()
    setMessages(prev => [...prev, message])
  }

  const markAsRead = async () => {
    await fetch(`/api/conversations/${conversationId}/read`, {
      method: 'PATCH'
    })
  }

  return { messages, loading, sendMessage, markAsRead }
}
```

---

## Optional: Real-time Updates with Supabase

To enable real-time message updates, use Supabase Realtime:

```typescript
import { createClient } from '@/lib/supabase/client'

// Subscribe to new messages
const supabase = createClient()

const channel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    },
    (payload) => {
      console.log('New message:', payload.new)
      setMessages(prev => [...prev, payload.new])
    }
  )
  .subscribe()

// Cleanup
return () => {
  supabase.removeChannel(channel)
}
```

---

## Testing Checklist

- [ ] Employer can create conversation with athlete
- [ ] Free tier employer gets `upgrade_required` error
- [ ] Pro employer can send messages
- [ ] Athlete can reply to messages
- [ ] Messages appear in correct order (oldest first)
- [ ] Unread count updates correctly
- [ ] Mark as read works for recipient only
- [ ] Conversation list shows most recent first
- [ ] Users cannot access other people's conversations (RLS)
- [ ] Real-time updates work (if implemented)

---

## Next Steps

To complete the messaging feature:

1. **UI Components** (Next task)
   - Conversations list page
   - Chat interface component
   - Message composer
   - Unread badges

2. **Notifications**
   - Email notification when athlete receives first message
   - In-app notification badges
   - Browser push notifications (optional)

3. **Enhancements**
   - Message attachments/images
   - Typing indicators
   - Read receipts timestamps
   - Message search
   - Archive conversations
