import { apiClient }    from "@/services";
import { NextResponse } from "next/server"

export async function POST(req: Request) {
   const { username, password } = await req.json()
   try {
      const response = await apiClient.POST('api/auth/login', { username, password })

      const setCookieHeader = response.headers.get('cookie') || ''

      if(!setCookieHeader) {
         return NextResponse.json({ error: true, redirect: 'http://192.168.2.201:3000/'}, { status: 400 }) // login
      }
      const nextResponse = NextResponse.json({ error: false, redirect: 'http://192.168.2.201:3001/', message: 'Login successful'}, { status: 200 })
      nextResponse.headers.set('Set-Cookie', setCookieHeader)
      return nextResponse
   } catch(error: any) {
      console.log(error)
      return NextResponse.json({ message: error.message }, { status: 500 })
   }
}