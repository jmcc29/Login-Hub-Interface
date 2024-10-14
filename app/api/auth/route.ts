import { apiClient } from '@/services';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const host = process.env.NEXT_PUBLIC_SERVER_FRONTEND || 'localhost';
  const loginPort = process.env.NEXT_PUBLIC_SERVER_PORT_FRONTEND || 3002;
  const beneficiariePort = process.env.BENEFICIARIE_FRONTEND_PORT || 3001;

  try {
    const response = await apiClient.POST('api/auth/login', {
      username,
      password,
    });

    const setCookieHeader = response.headers.get('cookie') || '';

    if (!setCookieHeader) {
      return NextResponse.json(
        { error: true, redirect: `http://${host}:${loginPort}/` },
        { status: 400 },
      ); // login
    }
    const nextResponse = NextResponse.json(
      {
        error: false,
        redirect: `http://${host}:${beneficiariePort}/`,
        message: 'Login successful',
      },
      { status: 200 },
    );
    nextResponse.headers.set('Set-Cookie', setCookieHeader);
    return nextResponse;
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
