'use client';

import { FloatButton, Tooltip } from "antd";
import Icon, {
    CheckCircleFilled,
    CheckCircleOutlined,
    EditOutlined,
    HeartFilled,
    HeartOutlined,
    ShareAltOutlined
} from "@ant-design/icons";
import { PropertyWithImages } from "@/db";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUser, saveProperty, togglePropertySold } from "../actions";
import { useMessage } from "../context/AlertContext";
import { useRouter } from "next/navigation";



export default function FloatIcons({
    property,
}: {
    property: PropertyWithImages;
}) {
    const { data: session } = useSession();
    const { showMessage } = useMessage();
    const [savedProperties, setSavedProperties] = useState<PropertyWithImages[]>([]);
    const [isSold, setIsSold] = useState<boolean>(property.isSold);
    const router = useRouter();


    // FETCH USER SAVED PROPERTIES

    const fetchUserProperties = async () => {
        if (!session?.user?.id) return;

        try {
            const user = await getUser(Number(session.user.id));

            if (user?.savedProperties) {
                setSavedProperties(
                    user.savedProperties as PropertyWithImages[]
                );
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {
        if (session?.user?.id) {
            fetchUserProperties();
        }
    }, [session]);


    // CHECK STATES

    const isPropertySaved = savedProperties.some(
        (p) => p.id === property.id
    );

    const isPropertyOwner =
        !!session?.user?.id &&
        Number(session.user.id) === property.ownerId;


    const handleSaveProperty = async () => {
        if (!session?.user?.email) {
            showMessage("Please sign in to save properties", "info");
            return;
        }

        try {
            await saveProperty(property.id, session.user.email);
            await fetchUserProperties();

            showMessage(
                isPropertySaved ? "Property unsaved" : "Property saved",
                "success"
            );
        } catch (error) {
            console.error("Error saving property:", error);
            showMessage("Something went wrong", "error");
        }
    };



    return isPropertyOwner ? (
        <>
            <CopyLink />
            <Tooltip title="Edit Property">
                <FloatButton
                    icon={<EditOutlined />}
                    style={{
                        // position: "absolute",
                        // top: "10px",
                        // right: "70px",
                        // zIndex: 10,
                        bottom: 100,
                    }}
                    onClick={() => router.push(`/properties/${property.id}/edit`)}
                />
            </Tooltip>

        </>
    ) : (
        <>
            <CopyLink />
            <Tooltip title="Save Property">
                <FloatButton
                    icon={
                        isPropertySaved ? (
                            <HeartFilled style={{ color: "red" }} />
                        ) : (
                            <HeartOutlined />
                        )
                    }
                    style={{
                        // position: "absolute",
                        // top: "10px",
                        // right: "10px",
                        // zIndex: 10,
                        bottom: 100
                    }}
                    onClick={handleSaveProperty}
                />
            </Tooltip>
        </>
    );
}

function CopyLink() {
    const {showMessage} = useMessage()
    return (
        <Tooltip title="Copy Link">
            <FloatButton
                icon={<ShareAltOutlined />}
                type="primary"
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    showMessage("Link copied to clipboard", "success")
                }}
            />
        </Tooltip>
    )
}