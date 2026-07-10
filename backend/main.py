from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import (
    create_owner, get_owner_by_email, 
    create_member, get_members_by_owner,
    create_qr_code, get_qr_codes_by_owner
)
import uvicorn

app = FastAPI(title="SmartTag Backend API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/")
async def root():
    return {"message": "SmartTag Backend API"}

@app.post("/api/signup")
async def signup(request: SignupRequest):
    try:
        # Check if owner already exists
        try:
            existing_owner = get_owner_by_email(request.email)
            raise HTTPException(status_code=400, detail="Email already exists")
        except (IndexError, TypeError):
            # Owner not found, proceed to create
            pass

        owner_data = {"name": request.name, "email": request.email, "password": request.password}
        new_owner = create_owner(owner_data)

        return {"message": "Signup successful", "owner": new_owner}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/login")
async def login(request: LoginRequest):
    try:
        owner = get_owner_by_email(request.email)
        
        # Check password
        if owner.get("password") != request.password:
            raise HTTPException(status_code=401, detail="Invalid password")
            
        return {"message": "Login successful", "owner": owner}
    except HTTPException:
        raise
    except (IndexError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid email")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/members")
async def get_members(owner_id: str):
    try:
        members = get_members_by_owner(owner_id)
        return members
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/members")
async def add_member(request: MemberRequest):
    try:
        member = create_member(request.dict())
        return member
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/qrcodes")
async def get_qrcodes(owner_id: str):
    try:
        qrcodes = get_qr_codes_by_owner(owner_id)
        return qrcodes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/qrcodes")
async def add_qrcode(request: QRCodeRequest):
    try:
        qrcode = create_qr_code(request.dict())
        return qrcode
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)