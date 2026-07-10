from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_PUBLISHABLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")


import uuid

supabase = None
if supabase_url and supabase_key:
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        print("Connected to Supabase successfully")
    except Exception as e:
        print(f"Warning: Supabase connection failed: {e}")
        print("System: Using local database persistence (Fallback mode)")
        supabase = None
else:
    print("System: Using local database persistence (Fallback mode)")



import json

# Files for persistence
OWNERS_FILE = "owners_db.json"
MEMBERS_FILE = "members_db.json"
QR_CODES_FILE = "qrcodes_db.json"

def load_json(filename):
    if os.path.exists(filename):
        try:
            with open(filename, "r") as f:
                return json.load(f)
        except:
            return []
    return []

def save_json(filename, data):
    with open(filename, "w") as f:
        json.dump(data, f)

# Owners
def create_owner(owner_data: dict):
    if not supabase:
        owners = load_json(OWNERS_FILE)
        new_id = str(uuid.uuid4())
        new_owner = {
            "id": new_id, 
            "name": owner_data["name"], 
            "email": owner_data["email"], 
            "password": owner_data.get("password"),
            "created_at": "2023-01-01T00:00:00Z"
        }
        owners.append(new_owner)
        save_json(OWNERS_FILE, owners)
        print(f"DEBUG: Created local owner: {owner_data['email']} with ID {new_id}")
        return new_owner
    try:
        response = supabase.table('owners').insert(owner_data).execute()
        print(f"DEBUG: Created Supabase owner: {owner_data['email']}")
        return response.data[0]
    except Exception as e:
        print(f"Supabase Error (Insert Owner): {e}")
        raise e

def get_owner_by_email(email: str):
    if not supabase:
        owners = load_json(OWNERS_FILE)
        print(f"DEBUG: Searching local owners for {email} (Total: {len(owners)})")
        for owner in owners:
            if owner["email"].lower() == email.lower():
                return owner
        raise IndexError("Owner not found")
    try:
        response = supabase.table('owners').select('*').eq('email', email).execute()
        if not response.data:
            raise IndexError("Owner not found")
        return response.data[0]
    except Exception as e:
        print(f"Supabase Error (Get Owner): {e}")
        raise e


# Members
def create_member(member_data: dict):
    if not supabase:
        members = load_json(MEMBERS_FILE)
        new_member = {
            "id": str(uuid.uuid4()),
            **member_data,
            "created_at": "2023-01-01T00:00:00Z"
        }
        members.append(new_member)
        save_json(MEMBERS_FILE, members)
        return new_member
    try:
        response = supabase.table('members').insert(member_data).execute()
        return response.data[0]
    except Exception as e:
        print(f"Supabase Error (Insert Member): {e}")
        raise e

def get_members_by_owner(owner_id: str):
    if not supabase:
        members = load_json(MEMBERS_FILE)
        return [m for m in members if str(m.get("owner_id")) == str(owner_id)]
    try:
        response = supabase.table('members').select('*').eq('owner_id', owner_id).execute()
        return response.data
    except Exception as e:
        print(f"Supabase Error (Get Members): {e}")
        raise e

# QR Codes
def create_qr_code(qr_data: dict):
    if not supabase:
        qrs = load_json(QR_CODES_FILE)
        new_qr = {
            "id": str(uuid.uuid4()),
            **qr_data,
            "created_at": "2023-01-01T00:00:00Z"
        }
        qrs.append(new_qr)
        save_json(QR_CODES_FILE, qrs)
        return new_qr
    try:
        response = supabase.table('qr_codes').insert(qr_data).execute()
        return response.data[0]
    except Exception as e:
        print(f"Supabase Error (Insert QR): {e}")
        raise e

def get_qr_codes_by_owner(owner_id: str):
    if not supabase:
        qrs = load_json(QR_CODES_FILE)
        return [q for q in qrs if str(q.get("owner_id")) == str(owner_id)]
    try:
        response = supabase.table('qr_codes').select('*').eq('owner_id', owner_id).execute()
        return response.data
    except Exception as e:
        print(f"Supabase Error (Get QRs): {e}")
        raise e


