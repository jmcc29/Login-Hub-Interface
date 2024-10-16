import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'


export const middleware = (req: NextRequest) => {
   const cookieStore = cookies()
   const cookie = cookieStore.get('Set-Cookie')
   const token = cookie?.value
   // console.log(`token middleware 🔐: ${token}`, req.nextUrl.pathname)

   try {
      if (req.nextUrl.pathname == '/') { // si estamos en '/
         if (token) {
            const url = req.nextUrl.clone()
            url.pathname = '/apphub'
            return NextResponse.redirect(url)
         } else {
            const url = req.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
         }
      }
      if (req.nextUrl.pathname == '/login') {
         if(token) {
            const url = req.nextUrl.clone()
            url.pathname = '/apphub'
            return NextResponse.redirect(url)
         } else {
            return NextResponse.next()
         }
      }

      if (req.nextUrl.pathname.startsWith('/apphub')) {
         if (token) {
            return NextResponse.next()
         } else {
            const url = req.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
         }
      }

   } catch (e) {
      console.log('Error verificando token en middleware')
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
   }
}