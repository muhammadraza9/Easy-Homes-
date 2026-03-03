'use client'

import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useMessage } from '../context/AlertContext'
import { PropertyWithImages } from '@/db'
import { getUserProperties } from '../actions'
import PropertyCards from '../components/PropertyCards'
import BackButton from '../components/BackButton'
import { LoadingOutlined } from '@ant-design/icons'

export default function SoldProperties() {
    const { data: session } = useSession()
    const { showMessage } = useMessage()
    const [soldProperties, setSoldProperties] = useState<PropertyWithImages[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchSoldProperties()
    }, [session])

    const fetchSoldProperties = async () => {
        if (!session?.user) return

        setIsLoading(true)
        try {
            
            const properties = await getUserProperties(+session.user.id)
            //const sold = (properties || []).filter(p => p.isSold) 
            //setSoldProperties(sold)
            setSoldProperties(properties)
        } catch (err) {
            console.error(err)
            showMessage?.('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='container'>
            <div className='heading'>Sold Properties</div>

            <BackButton />

            {isLoading && <LoadingOutlined className='loading' />}

            {soldProperties.length === 0 ? (
                <div>No sold properties found</div>
            ) : (
                <PropertyCards properties={soldProperties} layout="vertical" />
            )}
        </div>
    )
}