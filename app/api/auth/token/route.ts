import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
    
    // Llamar al backend para login
    const response = await axios.post(
      `${backendUrl}/auth/login-google`,
      { email },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const { accessToken, user } = response.data || {};

    return NextResponse.json({
      accessToken,
      user
    });
  } catch (error: any) {
    console.error('[API /auth/token] Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Error al obtener token' },
      { status: 401 }
    );
  }
}