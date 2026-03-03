'use client'

import { PropertyWithImages, PropertyWithImagesAndOwner } from '@/db'
import { Alert, Button, Card, Descriptions, Form, Input } from 'antd'
import { useSession } from 'next-auth/react'
import React from 'react'
import { sendMessage } from '../actions'
import { useMessage } from '../context/AlertContext'

export default function Contact({ property }: { property: PropertyWithImagesAndOwner }) {

        const {data: session} = useSession();  
        const {showMessage} = useMessage(); 
        const [form] = Form.useForm();

        if(!property){
            return <div>
                Property Not Found 404
            </div>
        }

        if(!session){
            return(
                <Alert message="Please sign in to contact with property Owner" type='info'  showIcon />
            )
        }

        if(+session.user.id === property.owner.id) return

        const handleSendMessage = async (value: {message: string }) =>{
            try {
                const response = await sendMessage(
                       value.message,
                       session?.user.id,
                       property.id,
                       property.ownerId
                )

                if(response){
                    showMessage("Message sent to the property owner","success")
                }
                console.log(response)
            } catch (error) {
                showMessage("Error sending message, try again","error")
            }
        }

    return (
        <Card>
            <h3 className='mb-1'> Contact Owner</h3>
            <Descriptions column={1} className='mb-2' items={[
                {
                    label: "Owner",
                    children: property.owner.username
                },
                {
                    label: "Email",
                    children: property.owner.email
                },
            ]} />

            <Form 
              form={form} 
              labelAlign='left' 
              labelCol={{span: 5}} 
              className='mt-1'
              onFinish={handleSendMessage}
              >
                <Form.Item  label="Message" name={'message'}>
                    <Input.TextArea />
                </Form.Item>
                <Button type='primary' htmlType='submit' block>
                    Send
                </Button>
           </Form>  
        </Card>
    )
}
