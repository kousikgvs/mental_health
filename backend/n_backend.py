from fastapi import FastAPI, HTTPException, Depends
from database import users_collection
import os
from models.usermodel import UserCreate, UserLogin
from dotenv import load_dotenv
load_dotenv()
from fastapi.middleware.cors import CORSMiddleware
from models.usermodel import Appointment
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

app_10 = FastAPI()

app_10.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)
# Signup
@app_10.post("/signup")
async def signup(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    await users_collection.insert_one({"email": user.email, "password": user.password})
    return {"message": "User registered successfully"}

# Login
@app_10.post("/login")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or user.password != db_user["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "User Logged in successfully"}


class AppointmentCreate(BaseModel):
    email: str
    doctor_name: str
    specialization: str
    appointment_date: datetime
    notes: Optional[str] = None

@app_10.post("/appointments")
async def make_appointment(appt: AppointmentCreate):
    user = await users_collection.find_one({"email": appt.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_appt = {
        "doctor_name": appt.doctor_name,
        "specialization": appt.specialization,
        "appointment_date": appt.appointment_date,
        "notes": appt.notes,
        "status": "Scheduled"
    }

    result = await users_collection.update_one(
        {"email": appt.email},
        {"$push": {"appointments": new_appt}}
    )

    if result.modified_count == 1:
        return {"message": "Appointment booked successfully", "appointment": new_appt}
    else:
        raise HTTPException(status_code=500, detail="Failed to book appointment")