from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'xclusive-auto-secret-change-me')
JWT_ALGO = 'HS256'
JWT_EXPIRY_HOURS = 24 * 30  # 30 days

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ------------- MODELS -------------
class AdminLogin(BaseModel):
    email: str
    password: str

class VehicleIn(BaseModel):
    year: int
    make: str
    model: str
    trim: str = ""
    body: str = "Sedan"
    mileage: int = 0
    price: int = 0
    color: str = ""
    fuel: str = "Gasoline"
    transmission: str = "Automatic"
    features: List[str] = []
    description: str = ""
    sold: bool = False
    photos: List[str] = []  # base64 data URIs

class Vehicle(VehicleIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeadIn(BaseModel):
    kind: str  # 'contact' | 'financing'
    name: str = ""
    email: str = ""
    phone: str = ""
    message: str = ""
    # financing fields
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    income: Optional[str] = None
    employment: Optional[str] = None
    down_payment: Optional[str] = None
    comment: Optional[str] = None
    vehicle_id: Optional[str] = None

class Lead(LeadIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    read: bool = False

# ------------- HELPERS -------------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False

def create_token(email: str) -> str:
    payload = {
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

async def require_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        return payload.get("email")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def _clean(doc):
    if doc and "_id" in doc:
        doc.pop("_id")
    return doc

# ------------- SEED -------------
async def seed_admin_and_vehicles():
    # Admin
    if not await db.admins.find_one({}):
        await db.admins.insert_one({
            "email": "vipanaquee7@gmail.com",
            "password_hash": hash_password("#Ipanaque030207"),
            "notification_email": "vipanaquee7@gmail.com",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user vipanaquee7@gmail.com")

    # Vehicles seed only if empty
    count = await db.vehicles.count_documents({})
    if count == 0:
        seed_vehicles = [
            {"year": 2024, "make": "Toyota", "model": "Camry", "trim": "LE", "body": "Sedan", "mileage": 79670, "price": 21995, "color": "Silver", "fuel": "Gasoline", "transmission": "Automatic", "features": ["Bluetooth", "Backup Camera", "Cruise Control"], "photos": ["https://cdn05.carsforsale.com/00a93ed72bd5cdac39eb1fea628f992540/480x360/2024-toyota-camry-le-4dr-sedan.jpg"], "description": ""},
            {"year": 2023, "make": "Toyota", "model": "Tundra", "trim": "SR 4x4", "body": "Pickup Truck", "mileage": 71991, "price": 34995, "color": "White", "fuel": "Gasoline", "transmission": "Automatic", "features": ["4WD", "Tow Package", "Apple CarPlay"], "photos": ["https://cdn05.carsforsale.com/00983f1db900f2429437f2a456946a6c5c/480x360/2023-toyota-tundra-sr-4x4-4dr-double-cab-pickup-lb.jpg"], "description": ""},
            {"year": 2023, "make": "Dodge", "model": "Charger", "trim": "GT", "body": "Sedan", "mileage": 52177, "price": 26495, "color": "Black", "fuel": "Gasoline", "transmission": "Automatic", "features": ["Leather Seats", "Sunroof", "Sport Mode"], "photos": ["https://cdn05.carsforsale.com/1550857f924bba4e46496569de917cba/480x360/2023-dodge-charger-gt-4dr-sedan.jpg"], "description": ""},
            {"year": 2022, "make": "Honda", "model": "Civic", "trim": "Sport Hatchback", "body": "Hatchback", "mileage": 64189, "price": 19995, "color": "Blue", "fuel": "Gasoline", "transmission": "Manual", "features": ["Manual", "Sport Package", "Honda Sensing"], "photos": ["https://cdn05.carsforsale.com/219743573ab9d8255384d950d3a5f4fc/480x360/2022-honda-civic-sport-4dr-hatchback-6m.jpg"], "description": ""},
            {"year": 2021, "make": "Toyota", "model": "Tacoma", "trim": "TRD Sport 4x4", "body": "Pickup Truck", "mileage": 60110, "price": 32995, "color": "Gray", "fuel": "Gasoline", "transmission": "Automatic", "features": ["4WD", "TRD Package", "Off-Road Ready"], "photos": ["https://cdn05.carsforsale.com/00c46b5d9b1e7918e41730cd4a715855a5/480x360/2021-toyota-tacoma-trd-sport-4x4-4dr-double-cab-6-1-ft-lb.jpg"], "description": ""},
            {"year": 2020, "make": "Chevrolet", "model": "Silverado 1500", "trim": "LT 4x4", "body": "Pickup Truck", "mileage": 130412, "price": 24995, "color": "Red", "fuel": "Gasoline", "transmission": "Automatic", "features": ["4WD", "Tow Package", "Bed Liner"], "photos": ["https://cdn05.carsforsale.com/56a1a9c6fc3b46da97dad0223ff6bf30/480x360/2020-chevrolet-silverado-1500-lt-4x4-4dr-double-cab-6-6-ft-sb.jpg"], "description": ""},
            {"year": 2024, "make": "Toyota", "model": "Tacoma", "trim": "SR", "body": "Pickup Truck", "mileage": 57172, "price": 29995, "color": "White", "fuel": "Gasoline", "transmission": "Automatic", "features": ["Backup Camera", "Bluetooth", "Air Conditioning"], "photos": ["https://cdn05.carsforsale.com/195dc73296ea45576e628ead597c65ed/480x360/2024-toyota-tacoma-sr-4x2-4dr-double-cab-5-0-ft-sb.jpg"], "description": ""},
            {"year": 2021, "make": "Toyota", "model": "RAV4", "trim": "XLE AWD", "body": "SUV", "mileage": 106818, "price": 22495, "color": "Silver", "fuel": "Gasoline", "transmission": "Automatic", "features": ["AWD", "Sunroof", "Heated Seats"], "photos": ["https://cdn05.carsforsale.com/00f34d853b15996dae5a336266143878b3/480x360/2021-toyota-rav4-xle-awd-4dr-suv.jpg"], "description": ""},
            {"year": 2019, "make": "Toyota", "model": "Tacoma", "trim": "SR5 V6", "body": "Pickup Truck", "mileage": 133266, "price": 21495, "color": "Black", "fuel": "Gasoline", "transmission": "Automatic", "features": ["V6 Engine", "Crew Cab", "Alloy Wheels"], "photos": ["https://cdn05.carsforsale.com/0bf34d1587fbd5b9881bf7059c33468a/480x360/2019-toyota-tacoma-sr5-v6-4x2-4dr-double-cab-5-0-ft-sb.jpg"], "description": ""},
            {"year": 2017, "make": "Nissan", "model": "Titan", "trim": "SV 4x4", "body": "Pickup Truck", "mileage": 115991, "price": 18995, "color": "Gray", "fuel": "Gasoline", "transmission": "Automatic", "features": ["4WD", "Crew Cab", "Backup Camera"], "photos": ["https://cdn05.carsforsale.com/70861211d724235782d1f9eeccc809ab/480x360/2017-nissan-titan-sv-4x4-4dr-crew-cab.jpg"], "description": ""},
            {"year": 2022, "make": "Toyota", "model": "Tacoma", "trim": "SR5 V6 4x4", "body": "Pickup Truck", "mileage": 109297, "price": 27995, "color": "Silver", "fuel": "Gasoline", "transmission": "Automatic", "features": ["4WD", "V6", "Long Bed"], "photos": ["https://cdn05.carsforsale.com/4ee05afb26789e940b0fccc19bd2cffa/480x360/2022-toyota-tacoma-sr5-v6-4x4-4dr-double-cab-6-1-ft-lb.jpg"], "description": ""},
            {"year": 2020, "make": "Toyota", "model": "Corolla", "trim": "SE", "body": "Sedan", "mileage": 66033, "price": 16995, "color": "Blue", "fuel": "Gasoline", "transmission": "Automatic", "features": ["CVT", "Toyota Safety Sense", "Bluetooth"], "photos": ["https://cdn05.carsforsale.com/4ecd70b011cd3f06ef882202681a3ae5/480x360/2020-toyota-corolla-se-4dr-sedan-cvt.jpg"], "description": ""},
        ]
        docs = []
        for v in seed_vehicles:
            veh = Vehicle(**v)
            d = veh.model_dump()
            d['created_at'] = d['created_at'].isoformat()
            d['updated_at'] = d['updated_at'].isoformat()
            docs.append(d)
        await db.vehicles.insert_many(docs)
        logger.info(f"Seeded {len(docs)} vehicles")

# ------------- AUTH ENDPOINTS -------------
@api_router.post("/auth/login")
async def login(body: AdminLogin):
    admin = await db.admins.find_one({"email": body.email.lower().strip()})
    if not admin or not verify_password(body.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(admin["email"])
    return {"token": token, "email": admin["email"]}

@api_router.get("/auth/me")
async def me(email: str = Depends(require_admin)):
    return {"email": email}

# ------------- VEHICLE ENDPOINTS -------------
@api_router.get("/vehicles")
async def list_vehicles(include_sold: bool = True):
    q = {} if include_sold else {"sold": False}
    docs = await db.vehicles.find(q, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs

@api_router.get("/vehicles/{vid}")
async def get_vehicle(vid: str):
    doc = await db.vehicles.find_one({"id": vid}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return doc

@api_router.post("/vehicles", dependencies=[Depends(require_admin)])
async def create_vehicle(body: VehicleIn):
    veh = Vehicle(**body.model_dump())
    d = veh.model_dump()
    d['created_at'] = d['created_at'].isoformat()
    d['updated_at'] = d['updated_at'].isoformat()
    await db.vehicles.insert_one(d)
    d.pop('_id', None)
    return d

@api_router.put("/vehicles/{vid}", dependencies=[Depends(require_admin)])
async def update_vehicle(vid: str, body: VehicleIn):
    update = body.model_dump()
    update['updated_at'] = datetime.now(timezone.utc).isoformat()
    result = await db.vehicles.update_one({"id": vid}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    doc = await db.vehicles.find_one({"id": vid}, {"_id": 0})
    return doc

@api_router.delete("/vehicles/{vid}", dependencies=[Depends(require_admin)])
async def delete_vehicle(vid: str):
    result = await db.vehicles.delete_one({"id": vid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"ok": True}

# ------------- LEAD ENDPOINTS -------------
@api_router.post("/leads")
async def create_lead(body: LeadIn):
    lead = Lead(**body.model_dump())
    d = lead.model_dump()
    d['created_at'] = d['created_at'].isoformat()
    await db.leads.insert_one(d)
    d.pop('_id', None)
    # TODO: send email/SMS when configured
    return d

@api_router.get("/leads", dependencies=[Depends(require_admin)])
async def list_leads():
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs

@api_router.patch("/leads/{lid}/read", dependencies=[Depends(require_admin)])
async def mark_lead_read(lid: str):
    await db.leads.update_one({"id": lid}, {"$set": {"read": True}})
    return {"ok": True}

@api_router.delete("/leads/{lid}", dependencies=[Depends(require_admin)])
async def delete_lead(lid: str):
    await db.leads.delete_one({"id": lid})
    return {"ok": True}

# ------------- SETTINGS -------------
@api_router.get("/settings", dependencies=[Depends(require_admin)])
async def get_settings():
    admin = await db.admins.find_one({}, {"_id": 0, "password_hash": 0})
    return admin or {}

@api_router.put("/settings", dependencies=[Depends(require_admin)])
async def update_settings(body: dict):
    allowed = {k: v for k, v in body.items() if k in ("notification_email",)}
    if allowed:
        await db.admins.update_one({}, {"$set": allowed})
    return await get_settings()

@api_router.get("/")
async def root():
    return {"message": "Xclusive Auto API"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await seed_admin_and_vehicles()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
