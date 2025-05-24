import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from './lib/auth0';


type Admin = {
  id: number,
  attributes: {
    Name: string,
    email: string,
  }
}

export async function middleware(request: NextRequest) {

  const authRes = await auth0.middleware(request);

  return authRes
}

