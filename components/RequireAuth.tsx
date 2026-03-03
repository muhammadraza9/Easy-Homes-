"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"



export default function RequireAuth({children}:{children: React.ReactNode}){
      const searchParams = useSearchParams()

      useEffect(() => {
        const error = searchParams.get("error")

        if(error){
            alert("Please singIn to access this page ! ")
        }
      },[searchParams])

      return(
         <> { children}</>
      )
}