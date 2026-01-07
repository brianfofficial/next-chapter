# Testing Guide: In-App Messaging System

## Prerequisites

Before testing, ensure you have:
- ✅ Docker Desktop running (for local Supabase)
- ✅ Environment variables configured in `.env.local`
- ✅ Migration files ready to run

---

## Step 1: Run Database Migration

### Start Supabase Locally
```bash
# Make sure Docker Desktop is running

# Start Supabase (if not already running)
npx supabase start

# Run the migration
npx supabase db reset --local
```

**Expected Output:**
```
Applying migration 001_create_athletes_table.sql...
Applying migration 002_create_employers_tables.sql...
Applying migration 003_add_stripe_fields.sql...
Applying migration 004_create_messaging_system.sql...
✓ Database reset complete
```

### Verify Tables Created
```bash
# Check tables exist
npx supabase db diff

# Or connect to database
psql postgresql://postgres:postgres@localhost:54322/postgres

# Then run:
\dt public.*

# Should show:
# - athletes
# - employers
# - saved_athletes
# - conversations
# - messages
```

---

## Step 2: Start Development Server

```bash
npm run dev
```

Server should start at `http://localhost:3005` (or your configured port).

---

## Step 3: Create Test Accounts

### Create Employer Account (Pro Subscription Required)

1. Navigate to `http://localhost:3005/employers/signup`
2. Fill in employer details:
   - Email: `employer@test.com`
   - Company: `Test Company`
   - Industry: `Technology`
   - Password: `testpass123`
3. Sign up and verify account created

### Upgrade Employer to Pro

**Option 1: Directly in Database**
```sql
-- Connect to local Supabase
UPDATE employers
SET subscription_tier = 'pro',
    subscription_status = 'active'
WHERE contact_email = 'employer@test.com';
```

**Option 2: Test Stripe Integration**
- Navigate to `/employers/upgrade`
- Use Stripe test card: `4242 4242 4242 4242`
- Any future expiry, any CVC

### Create Athlete Account

1. Navigate to `http://localhost:3005`
2. Click "Translate Your Experience"
3. Fill in athlete details:
   - Email: `athlete@test.com`
   - Name: `John Doe`
   - Sport: `Basketball`
   - Position: `Point Guard`
   - School: `UCLA`
   - Grad Year: `2025`
   - GPA: `3.8`
4. Complete translation flow
5. Sign up with password: `testpass123`

---

## Step 4: Test Messaging Flow (End-to-End)

### As Employer

#### 4.1 Browse Athletes
1. Login as `employer@test.com`
2. Navigate to `/employers/browse`
3. You should see the test athlete `John Doe`

#### 4.2 Initiate Conversation
1. On John Doe's athlete card, click **"Message"** button
2. **Expected**: Redirected to `/employers/messages?conversation=<id>`
3. **Expected**: Chat interface opens with John Doe's conversation

#### 4.3 Send First Message
1. Type in message composer: `Hi John! I saw your profile and I'm interested in discussing opportunities.`
2. Press **Enter** (or click Send)
3. **Expected**: Message appears instantly in blue bubble (right side)
4. **Expected**: Timestamp shows "just now"

#### 4.4 Verify Conversations List
1. Navigate to `/employers/messages` (remove URL param)
2. **Expected**: Conversation with John Doe appears in left sidebar
3. **Expected**: Preview shows your last message
4. **Expected**: No unread badge (you sent the message)

### As Athlete

#### 4.5 Check Messages
1. **Open new incognito window** (or different browser)
2. Login as `athlete@test.com`
3. Navigate to `/profile/messages`
4. **Expected**: Conversation with "Test Company" appears
5. **Expected**: Unread badge shows `1` new message
6. Click the conversation
7. **Expected**: Employer's message appears in gray bubble (left side)
8. **Expected**: Badge disappears (marked as read)

#### 4.6 Reply to Employer
1. Type: `Hi! Thanks for reaching out. I'd love to learn more!`
2. Press **Enter**
3. **Expected**: Message appears in blue bubble (right side)
4. **Expected**: Auto-scrolls to bottom

### Back to Employer

#### 4.7 Receive Reply
1. Switch back to employer's browser window
2. Navigate to `/employers/messages`
3. **Expected**: Conversation shows unread badge `1`
4. Click conversation
5. **Expected**: Athlete's reply appears
6. **Expected**: Badge disappears

#### 4.8 Continue Conversation
1. Send another message: `Great! Let's schedule a call.`
2. **Expected**: Works seamlessly
3. Switch to athlete's window
4. Refresh `/profile/messages`
5. **Expected**: New message appears with unread badge

---

## Step 5: Test Edge Cases

### 5.1 Free Tier Employer (Should Fail)

```sql
-- Downgrade employer to free tier
UPDATE employers
SET subscription_tier = 'free_trial',
    subscription_status = null
WHERE contact_email = 'employer@test.com';
```

1. As employer, try to click "Message" on athlete card
2. **Expected**: Redirected to `/employers/upgrade`
3. **Expected**: Sees upgrade prompt

### 5.2 Duplicate Conversation (Should Reuse)

1. Upgrade employer back to Pro
2. Browse athletes and click "Message" on John Doe again
3. **Expected**: Opens existing conversation (doesn't create duplicate)
4. **Expected**: See full message history

### 5.3 Multiple Conversations

Create second athlete:
```sql
-- Manually insert test athlete
INSERT INTO athletes (id, email, full_name, sport, position, school, graduation_year, gpa, is_public)
VALUES (
  gen_random_uuid(),
  'athlete2@test.com',
  'Jane Smith',
  'volleyball',
  'Outside Hitter',
  'Stanford',
  2026,
  '3.9',
  true
);
```

1. As employer, message Jane Smith
2. **Expected**: New conversation created
3. Navigate to `/employers/messages`
4. **Expected**: Both conversations appear in sidebar
5. Switch between conversations
6. **Expected**: Message history loads correctly for each

### 5.4 Message Validation

1. Try to send empty message (just spaces)
2. **Expected**: Send button disabled
3. Try Shift+Enter for new line
4. **Expected**: Creates new line (doesn't send)
5. Press Enter without Shift
6. **Expected**: Sends message

### 5.5 Unauthorized Access

1. Try to access conversation as different user:
   - Create third account: `employer2@test.com`
   - Try to fetch messages from John Doe conversation
   - Use browser dev tools to call API directly:
   ```javascript
   fetch('/api/conversations/<other-conversation-id>/messages')
   ```
2. **Expected**: 404 error (RLS blocks access)

---

## Step 6: Test API Endpoints Directly

### 6.1 GET Conversations
```bash
# Get auth token from browser cookies (or Supabase Dashboard)
curl http://localhost:3005/api/conversations \
  -H "Cookie: sb-access-token=YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "employer_id": "uuid",
      "athlete_id": "uuid",
      "last_message_at": "2026-01-07T...",
      "unread_count": 0,
      "last_message": {
        "content": "...",
        "sender_type": "employer"
      },
      "employer": {...},
      "athlete": {...}
    }
  ]
}
```

### 6.2 POST Create Conversation
```bash
curl -X POST http://localhost:3005/api/conversations \
  -H "Cookie: sb-access-token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "ATHLETE_UUID"}'
```

**Expected**: 201 Created with conversation object

### 6.3 POST Send Message
```bash
curl -X POST http://localhost:3005/api/conversations/CONVERSATION_ID/messages \
  -H "Cookie: sb-access-token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message via API"}'
```

**Expected**: 201 Created with message object

---

## Step 7: Performance Testing

### 7.1 Large Conversation
```sql
-- Insert 100 test messages
DO $$
DECLARE
  conv_id UUID := 'YOUR_CONVERSATION_ID';
  user_id UUID := 'YOUR_USER_ID';
BEGIN
  FOR i IN 1..100 LOOP
    INSERT INTO messages (conversation_id, sender_id, sender_type, content)
    VALUES (
      conv_id,
      user_id,
      'employer',
      'Test message ' || i
    );
  END LOOP;
END $$;
```

1. Open conversation in browser
2. **Expected**: All 100 messages load quickly (< 1 second)
3. **Expected**: Auto-scrolls to bottom
4. Send new message
5. **Expected**: Appears instantly at bottom

### 7.2 Multiple Conversations
- Create 20 conversations
- Navigate to `/employers/messages`
- **Expected**: Sidebar loads quickly with all conversations
- **Expected**: Sorted by most recent message first

---

## Step 8: UI/UX Testing

### 8.1 Responsive Design
1. Open messages page
2. Resize browser window to mobile width (< 768px)
3. **Expected**: Layout adapts (consider adding mobile view if not present)

### 8.2 Loading States
1. Throttle network in Chrome DevTools (Slow 3G)
2. Navigate to `/employers/messages`
3. **Expected**: Loading spinner shows while fetching conversations
4. Click conversation
5. **Expected**: Loading spinner shows while fetching messages

### 8.3 Error Handling
1. Stop Supabase (`npx supabase stop`)
2. Try to load messages
3. **Expected**: Error message displayed gracefully
4. Restart Supabase
5. Refresh page
6. **Expected**: Works again

---

## Step 9: Security Testing

### 9.1 Row Level Security (RLS)
```sql
-- Test as unauthenticated user
SET ROLE anon;
SELECT * FROM conversations;
-- Expected: 0 rows

SELECT * FROM messages;
-- Expected: 0 rows

-- Test as authenticated user (not in conversation)
SET ROLE authenticated;
SET request.jwt.claims.sub = 'different-user-id';
SELECT * FROM conversations WHERE id = 'some-conversation-id';
-- Expected: 0 rows
```

### 9.2 Subscription Enforcement
1. Downgrade employer to free tier
2. Try POST `/api/conversations` with athlete_id
3. **Expected**: 403 Forbidden with `upgrade_required: true`

---

## Troubleshooting

### Messages Not Appearing
- Check browser console for errors
- Verify Supabase connection: `npx supabase status`
- Check RLS policies are applied: `SELECT * FROM pg_policies;`

### "Conversation not found" Error
- Verify conversation exists: `SELECT * FROM conversations;`
- Check user is participant: Verify employer_id or athlete_id matches auth user

### TypeScript Errors
```bash
npm run type-check
# or
npx tsc --noEmit
```

### Migration Failed
```bash
# Reset completely
npx supabase db reset --local

# Re-run specific migration
npx supabase migration up --limit 1
```

---

## Success Criteria Checklist

- [ ] Database migration runs successfully
- [ ] Employer can create conversation with athlete
- [ ] Free employer redirected to upgrade page
- [ ] Pro employer can send messages
- [ ] Athlete receives messages
- [ ] Athlete can reply
- [ ] Unread badges show/hide correctly
- [ ] Messages appear in correct order (chronological)
- [ ] Auto-scroll to bottom works
- [ ] Mark as read works automatically
- [ ] Conversations list shows most recent first
- [ ] Can't access other users' conversations (RLS)
- [ ] Empty messages can't be sent
- [ ] Enter sends, Shift+Enter adds new line
- [ ] Timestamps format correctly
- [ ] Multiple conversations work
- [ ] Deep linking works (`?conversation=id`)
- [ ] Navigation links work for both user types

---

## Next Steps After Testing

Once all tests pass:

1. **Deploy to Production**
   ```bash
   # Push migration to production database
   npx supabase db push

   # Deploy to Vercel
   git push origin main
   ```

2. **Monitor Production**
   - Check Supabase dashboard for errors
   - Monitor Vercel logs
   - Test with real users

3. **Optional Enhancements**
   - Add email notifications
   - Implement real-time updates with Supabase Realtime
   - Add message attachments
   - Add typing indicators

---

## Test Data Cleanup

To reset test data:
```sql
-- Delete all test messages
DELETE FROM messages;

-- Delete all test conversations
DELETE FROM conversations;

-- Delete test athletes
DELETE FROM athletes WHERE email LIKE '%@test.com';

-- Delete test employers
DELETE FROM employers WHERE contact_email LIKE '%@test.com';
```

Or full reset:
```bash
npx supabase db reset --local
```

---

**Happy Testing! 🚀**
