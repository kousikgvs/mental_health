from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    groups: Optional[List[str]] = [] 
    appointments: Optional[List[Appointment]] = []

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class Appointment(BaseModel):
    doctor_name: str
    specialization: str
    appointment_date: datetime
    notes: Optional[str] = None
    status: Optional[str] = "Scheduled" 