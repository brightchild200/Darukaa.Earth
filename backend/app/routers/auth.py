from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from supabase import create_client, Client
from uuid import UUID

from app.core.config import settings
from app.core.database import get_db
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


def get_supabase() -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY)


@router.post("/register", response_model=TokenResponse)
async def register(
    user_data: UserRegister,
    supabase: Client = Depends(get_supabase),
):
    try:
        # Register with Supabase Auth
        response = supabase.auth.admin.create_user({
            "email": user_data.email,
            "password": user_data.password,
            "email_confirm": True,
            "user_metadata": {"full_name": user_data.full_name} if user_data.full_name else {}
        })
        
        if not response.user:
            raise HTTPException(status_code=400, detail="Failed to create user")
        
        # Create session
        session_response = supabase.auth.sign_in_with_password({
            "email": user_data.email,
            "password": user_data.password,
        })
        
        return TokenResponse(
            access_token=session_response.session.access_token,
            expires_in=session_response.session.expires_in,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(
    user_data: UserLogin,
    supabase: Client = Depends(get_supabase),
):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": user_data.email,
            "password": user_data.password,
        })
        
        if not response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return TokenResponse(
            access_token=response.session.access_token,
            expires_in=response.session.expires_in,
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@router.post("/logout")
async def logout(
    supabase: Client = Depends(get_supabase),
):
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/me")
async def get_current_user(
    authorization: str = Depends(lambda x: x.headers.get("Authorization") if hasattr(x, 'headers') else x),
    supabase: Client = Depends(get_supabase),
):
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
        
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        
        if not user.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return {
            "id": user.user.id,
            "email": user.user.email,
            "full_name": user.user.user_metadata.get("full_name") if user.user.user_metadata else None,
            "created_at": user.user.created_at,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str,
    supabase: Client = Depends(get_supabase),
):
    try:
        response = supabase.auth.refresh_session(refresh_token)
        return TokenResponse(
            access_token=response.session.access_token,
            expires_in=response.session.expires_in,
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid refresh token")