"use client"
import { Form, Input, Select, Space, } from 'antd'
import React, { useState } from 'react'
import { useMessage } from '../context/AlertContext'
import { useRouter } from 'next/navigation'


export default function SearchProperties() {
        const [location, setLocation] = useState("")
        const [type, setType] = useState("RENT")
        const {showMessage} = useMessage()
        const router = useRouter()


        const handleGetProperties = () => {
            if(location.trim() === ""){
                return showMessage("Please Enter a location", "error")
            }
            else{
                const queryString = `?location=${location}&propertyType=${type}`
                router.push("/search-results" + queryString) 
            }
        }

    return (
        <div className='flex-center px-1'>
            <Form
                onFinish={handleGetProperties}
                initialValues={{ type: "RENT", location: "" }} // set defaults here
            >
                <Space.Compact>
                    <Form.Item name="type">
                        <Select
                            options={[
                                { value: "RENT", label: "For Rent" },
                                { value: "SALE", label: "For Sale" }
                            ]}
                            style={{ width: 120 }}
                            size="large"
                            value={type}
                            onChange={val => setType(val)}
                        />
                    </Form.Item>

                    <Form.Item name="location">
                        <Input.Search
                         size="large" 
                         enterButton="Search" 
                         placeholder="Search for a location..." 
                         value={location}
                         onChange={e => setLocation(e.target.value)}
                         onSearch={handleGetProperties}
                        /> 
                    </Form.Item>
                </Space.Compact>
            </Form>

        </div>
    )
}
