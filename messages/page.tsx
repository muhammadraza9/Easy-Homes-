'use client'

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUser, markAsRead } from "../actions";
import { Message } from "@prisma/client";
import { Avatar, Breadcrumb, Card, message, Tooltip } from "antd";
import { MessageType } from "@/db";
import { CheckCircleOutlined, LoadingOutlined, } from "@ant-design/icons";
import BackButton from "../components/BackButton";
//import { revalidatePath } from "next/cache";




export default function MessagesPage() {

    const { data: session } = useSession()
    const [messages, setMessages] = useState<MessageType[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        async function fetchMessages() {
            try {
                setIsLoading(true)
                const user = await getUser(parseInt(session?.user?.id!))
                if (user) {
                    setMessages(user.receivedMessages)
                }
                console.log(user)
            } catch (error) {
                console.log("Error fetching user", error)
            }finally{
                setIsLoading(false)
            }
        }
        fetchMessages();
    }, [session]);


    const handleMarkAsRead = async (messageId: number) => {
        try {
            const response = await markAsRead(messageId)

            setMessages((prevMessages) => prevMessages.map((message) => {
                if (message.id === messageId) {
                    return {
                        ...message,
                        isRead: true,
                    }
                }
                return message
            })
            )

            console.log(response)
        } catch (error) {
            console.error("Error marking message as read", error)
        }
    }


    return (

        <div className="container-sm" style={{ textAlign: "center", marginTop: "50px" }}>
            <h1 className="heading">Messages</h1>
            <Breadcrumb
                className="flex-center mb-1"
                items={[
                    {
                        title: "Home",
                        href: "/"
                    },
                    {
                        title: "Messages",
                    },
                ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
                <BackButton />
            </div>
            <p className="message-count">
                Your have {messages.filter(message => message.isRead === false).length}{" "} unread messages
            </p>
            {isLoading && <LoadingOutlined className="loading" />}
            <div className="card-item">
                {messages.map((message) => (
                    <Card className={!message.isRead ? "read w-full" : "w-full"}>
                        <div className="flex-align-center">
                            <div className="flex-justify-center">
                                <Avatar className="msg-avatar" src={message.sender.image} />

                                <div>
                                    <div className="username">{message.sender.username}</div>
                                    <div className="email">{message.sender.email}</div>
                                    <p>
                                        Property: <strong>{message.property.name}</strong>
                                    </p>
                                </div>
                            </div>
                            <p className="created-at">
                                {message.createdAt.toDateString()}
                            </p>
                        </div>
                        {
                            !message.isRead && (
                                <Tooltip title="Mark as read">
                                    <CheckCircleOutlined className="read-icon" onClick={() => handleMarkAsRead(message.id)} />
                                </Tooltip>
                            )
                        }
                        <p className="mt-1">{message.message}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}