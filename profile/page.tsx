'use client'

import { PropertyWithImages } from '@/db'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { getUserProperties } from '../actions'
import { Card, Col, Empty, Row } from 'antd'
import Image from 'next/image'
import PropertyCards from '../components/PropertyCards'
import BackButton from '../components/BackButton'
import { LoadingOutlined } from '@ant-design/icons'

export default function Profile() {
  const { data: session } = useSession()
  const [properties, setProperties] = useState<PropertyWithImages[]>([])
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    fetchUserProperties()
  }, [session])

  const fetchUserProperties = async () => {
    if (session?.user) {
      setIsLoading(true)
      const properties = await getUserProperties(+session.user.id)

      if (properties) {
        setProperties(properties)
        setIsLoading(false)
      }
    }
  }
  console.log(properties);

  return (
    <div className='container'>
      <Row gutter={[32, 32]}>
        <Col sm={24} lg={8}>
          <h1 className='heading'> My Profile </h1>

          <div style={{ flexDirection: 'column', gap: '16px', padding: '16px' }}>
            <BackButton />
          </div>

          <Card>
            <Image
              src={session?.user.image as string}
              alt='User'
              width={100}
              height={100}
              className='profile-img mb-1'
            />
            <h3 className='mb-1 mt-1'>
              {session?.user.name}
            </h3>
            <p>{session?.user.email}</p>
          </Card>
        </Col>

        <Col sm={24} lg={16}>
          <h1 className='heading'> My Property Listings </h1>

          {isLoading && <LoadingOutlined className='loading' />}

          {properties.length !== 0 ? (
            <PropertyCards properties={properties} layout={"horizontal"} />
          ) : (
            <Empty description="No Listed Properties" />
          )}
        </Col>
      </Row>
    </div>
  )
}
