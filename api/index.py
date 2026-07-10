from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
import uuid

app = FastAPI(title="SmartTag Backend API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase connection
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

supabase = None
if supabase_url and supabase_key:
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
    except Exception as e:
        print(f"Supabase connection failed: {e}")

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class MemberRequest(BaseModel):
    owner_id: str
    name: str
    role: str = "Student"
    image_url: str = ""

class QRCodeRequest(BaseModel):
    owner_id: str
    code: str
    data: str
    name: str
    item: str
    mobile: str

@app.get("/api")
async def root():
    return {"message": "SmartTag Backend API"}

@app.post("/api/signup")
async def signup(request: SignupRequest):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database not configured")
        try:
            response = supabase.table('owners').select('*').eq('email', request.email).execute()
            if response.data:
                raise HTTPException(status_code=400, detail="Email already exists")
        except HTTPException:
            raise
        except:
            pass

        owner_data = {"name": request.name, "email": request.email, "password": request.password}
        response = supabase.table('owners').insert(owner_data).execute()
        return {"message": "Signup successful", "owner": response.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/login")
async def login(request: LoginRequest):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database not configured")
        response = supabase.table('owners').select('*').eq('email', request.email).execute()
        if not response.data:
            raise HTTPException(status_code=401, detail="Invalid email")
        owner = response.data[0]
        if owner.get("password") != request.password:
            raise HTTPException(status_code=401, detail="Invalid password")
        return {"message": "Login successful", "owner": owner}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/members")
async def get_members(owner_id: str):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database not configured")
        response = supabase.table('members').select('*').eq('owner_id', owner_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/members")
async def add_member(request: MemberRequest):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database not configured")
        response = supabase.table('members').insert(request.dict()).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/qrcodes")
async def get_qrcodes(owner_id: str):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database not configured")
        response = supabase.table('qr_codes').select('*').eq('owner_id', owner_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/qrcodes")
async def add_qrcode(request: QRCodeRequest):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database not configured")
        response = supabase.table('qr_codes').insert(request.dict()).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
