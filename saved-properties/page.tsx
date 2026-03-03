'use client'


import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { useMessage } from '../context/AlertContext';
import { PropertyWithImages } from '@/db';
import { getUser } from '../actions';
import PropertyCards from '../components/PropertyCards';
import BackButton from '../components/BackButton';
import { LoadingOutlined } from '@ant-design/icons';



export default function SavedProperties({property}:{property: PropertyWithImages}) {

    const { data: session } = useSession();
    const { showMessage } = useMessage();
    const [savedProperties, setSavedProperties] = useState<PropertyWithImages[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    console.log(savedProperties);

    useEffect(() => {
        fetchUserProperties()
    }, [session])

    const fetchUserProperties = async () => {
        if (session?.user) {
            setIsLoading(true)
            const user = await getUser(+session.user.id)
            if (user) {
                setSavedProperties(user.savedProperties || [])
                setIsLoading(false)
            }
        }
    }


    return (
        <div className='container'>
            <div className='heading'>Saved Properties</div>

            <BackButton />
            {isLoading && <LoadingOutlined className='loading' />}

            <PropertyCards properties={savedProperties} layout={"vertical"} />

        </div>
    )
}


