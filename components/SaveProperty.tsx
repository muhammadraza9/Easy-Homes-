'use client';

import { FloatButton, Tooltip } from "antd";
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined
} from "@ant-design/icons";
import { PropertyWithImages } from "@/db";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUser, saveProperty, togglePropertySold } from "../actions";
import { useMessage } from "../context/AlertContext";
import { useRouter } from "next/navigation";



export default function SaveProperty({
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

  async function handleTogglePropertySold(propertyId: number) {
           try {
            const response = await togglePropertySold(propertyId)
                if(response) {
                   setIsSold((prev) => !prev)
                   showMessage(response, "success")
                }
           } catch (error) {
                    console.error("Error updating Property", "error")
           }
  }

  
  return isPropertyOwner ? (
    <>
      <Tooltip title="Edit Property">
        <FloatButton
          icon={<EditOutlined />}
          style={{
            position: "absolute",
            top: "10px",
            right: "70px",
            zIndex: 10,
          }}
          onClick={() => router.push(`/properties/${property.id}/edit`)}
        />
      </Tooltip>

      {isSold ? (
        <Tooltip title="Activate Property">
          <FloatButton
            icon={<CheckCircleFilled />}
            onClick={() => handleTogglePropertySold(property.id)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 10,
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Mark As Sold">
          <FloatButton
          onClick={() => handleTogglePropertySold(property.id)}
            icon={<CheckCircleOutlined />}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 10,
            }}
          />
        </Tooltip>
      )}
    </>
  ) : (
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
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 10,
        }}
        onClick={handleSaveProperty}
      />
    </Tooltip>
  );
}