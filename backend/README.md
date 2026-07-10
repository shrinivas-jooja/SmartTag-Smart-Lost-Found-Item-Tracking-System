# SmartTag Backend

This is the backend API for the SmartTag application, built with Python, FastAPI, and Supabase.

## Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with your Supabase credentials (already created):
   ```
   SUPABASE_URL=https://sxfhhhyyizxfqnlkwlfh.supabase.co
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_HGuC88NWggjO0T19mdHKfg_2THhg85U
   ```

4. Start the server:
   ```bash
   python main.py
   ```

   The server will run on `http://127.0.0.1:8001`.

## API Endpoints

### POST /api/signup
Creates a new owner account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Signup successful",
  "owner": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2023-..."
  }
}
```

### POST /api/login
Authenticates an existing owner.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "owner": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2023-..."
  }
}
```

## Database Schema

The backend connects to Supabase with the following tables:
- `owners`: Stores owner information
- `members`: Stores member information linked to owners
- `qr_codes`: Stores QR code data linked to owners and members