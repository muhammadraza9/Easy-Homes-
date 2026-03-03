
import { NextRequest, NextResponse } from "next/server";


const  protectedRoutes = [
    "/Properties/add", 
    "/saved-properties", 
    "/messages", 
    "/profile",
    "/sold-properties",
    
]

const editPropertyRouteRegex = /^\/properties\/\d+\/edit$/

export function middleware(req: NextRequest){
    const token = req.cookies.get("next-auth.session-token")?.value
    console.log(token)


    const isProptectedRoute =
                protectedRoutes.includes(req.nextUrl.pathname) ||
                editPropertyRouteRegex.test(req.nextUrl.pathname)
                              

    if(!token && isProptectedRoute){
        const loginUrl = new URL("/",req.url)
        loginUrl.searchParams.set("error", "login_required")
        return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
}