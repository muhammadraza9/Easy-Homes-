'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PropertyWithImages } from '@/db'
import PropertyCards from '../components/PropertyCards'

export default function SearchResultsPage() {
  const searchParams = useSearchParams()

  const propertyType = searchParams.get('propertyType')
  const location = searchParams.get('location') ?? ''

  const [properties, setProperties] = useState<PropertyWithImages[]>([])

  useEffect(() => {
    const fetchProperties = async () => {
      const paramsObj: Record<string, string> = {}

      if (propertyType) paramsObj.propertyType = propertyType
      if (location) paramsObj.location = location

      const params = new URLSearchParams(paramsObj)

      const res = await fetch(`/api/search-properties?${params.toString()}`)
      const data: PropertyWithImages[] = await res.json()

      setProperties(data)
    }

    fetchProperties()
  }, [propertyType, location])

  return (
    <div className="container">
      <h1 className="heading">
        {properties.length} properties in {location || 'all locations'} 
        {propertyType ? ` for ${propertyType}` : ''}
      </h1>

      {properties.length > 0 ? (
        <PropertyCards properties={properties} layout="vertical" />
      ) : (
        <p>No properties found for this search.</p>
      )}
    </div>
  )
}