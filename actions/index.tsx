"use server";

import {  db, PropertyWithImages } from "@/db";
import cloudinary from "@/utils/cloudinary";
import { PropertyFor, Prisma, Property } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server'



type SortOption = "latest" | "asc" | "desc";

// GET PROPERTIES
async function getProperties(
  filters: Record<string, any> = {},
  sortOrder: SortOption = "latest",
  propertyCount: number = 0
) {
  try {
    let orderBy: { createdAt?: "asc" | "desc"; price?: "asc" | "desc" } = {};

    if (sortOrder === "latest") {
      orderBy = { createdAt: "desc" };
    } else if (sortOrder === "asc" || sortOrder === "desc") {
      orderBy = { price: sortOrder };
    }

    const filterConditions = {
      type: filters.type,
      propertyType: filters.apartment_type,
      bhk: filters.bhk ? { in: filters.bhk } : undefined,
      price: filters.price
        ? { gte: +filters.price.split("-")[0], lte: +filters.price.split("-")[1] }
        : undefined,
      area: filters.area
        ? { gte: +filters.area.split("-")[0], lte: +filters.area.split("-")[1] }
        : undefined,
      preferredTenants: filters.preferred_tenants,
      isSold: false,
    };

    return await db.property.findMany({
      where: filterConditions,
      include: { images: true },
      take: propertyCount,
      orderBy,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
}

// CREATE PROPERTY
async function postProperty(
  data: Omit<Property, "id" | "createdAt" | "updatedAt">,
  userId: number,
  images: string[]
) {
  try {
    const uploadedImages = await Promise.all(
      images.map(async (imgBase64) => {
        const result = await cloudinary.uploader.upload(imgBase64, {
          folder: "Easy-Homes",
        });
        return result.url;
      })
    );

    const plainData = {
      ...data,
      availableFrom:
        data.availableFrom && typeof data.availableFrom !== "string"
          ? (data.availableFrom as any).toISOString()
          : data.availableFrom,
    };

    return await db.property.create({
      data: {
        ...plainData,
        ownerId: userId,
        images: { create: uploadedImages.map((url) => ({ url })) },
        isFeatured: false,
        isSold: false,
      },
      include: { images: true },
    });
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
}

// EDIT PROPERTY
async function editProperty(
  data: Omit<Property, "id" | "createdAt" | "updatedAt">,
  propertyId: number,
  images: string[] // mix of old URLs and new base64 images
) {
  try {
    const existingProperty = await db.property.findUnique({
      where: { id: propertyId },
      include: { images: true },
    });

    if (!existingProperty) {
      throw new Error("Property not found");
    }

    const existingImageUrls = existingProperty.images.map((img) => img.url);

    // Separate new images (base64) from old URLs
    const newBase64Images = images.filter((img) => !existingImageUrls.includes(img));

    // Upload only new images
    const uploadedImages = await Promise.all(
      newBase64Images.map(async (imgBase64) => {
        const result = await cloudinary.uploader.upload(imgBase64, {
          folder: "Easy-Homes",
        });
        return result.url;
      })
    );

    // Keep old images that are still selected
    const keptOldImages = existingImageUrls.filter((url) => images.includes(url));

    const finalImageUrls = [...keptOldImages, ...uploadedImages];

    const plainData = {
      ...data,
      availableFrom:
        data.availableFrom && typeof data.availableFrom !== "string"
          ? (data.availableFrom as any).toISOString()
          : data.availableFrom,
    };

    return await db.property.update({
      where: { id: propertyId },
      data: {
        ...plainData,
        images: {
          deleteMany: {}, // remove all and recreate with final list
          create: finalImageUrls.map((url) => ({ url })),
        },
        isFeatured: false,
        isSold: false,
      },
      include: { images: true },
    });
  } catch (error) {
    console.error("Error editing property:", error);
    throw error;
  }
}

// SAVE / UNSAVE PROPERTY
async function saveProperty(propertyId: number, email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
      include: { savedProperties: true },
    });

    if (!user) throw new Error("User not found");

    const isSaved = user.savedProperties.some((p) => p.id === propertyId);

    await db.user.update({
      where: { email },
      data: {
        savedProperties: isSaved
          ? { disconnect: { id: propertyId } }
          : { connect: { id: propertyId } },
      },
    });

    return { status: isSaved ? "Property unsaved" : "Property saved" };
  } catch (error) {
    console.error("Error saving property:", error);
    throw error;
  }
}

// GET USER BY ID
async function getUser(userId: number) {
  try {
    return await db.user.findUnique({
      where: { id: Number(userId) },
      include: {
        savedProperties: { include: { images: true } },
        receivedMessages: {
          include: {
            sender: true,
            receiver: true,
            property: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

// GET PROPERTY BY ID
async function getPropertyById(id: number | string) {
  try {
    const propertyId = Number(id);
    if (isNaN(propertyId)) return null;

    return await db.property.findUnique({
      where: { id: propertyId },
      include: { images: true, owner: true },
    });
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    throw error;
  }
}

// SEND MESSAGE
async function sendMessage(
  message: string,
  senderId: string,
  propertyId: number,
  receiverId: number
) {
  try {
    return await db.message.create({
      data: {
        message,
        senderId: +senderId,
        propertyId: +propertyId,
        receiverId: +receiverId,
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// MARK AS READ
async function markAsRead(messageId: number) {
  try {
    return await db.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
}

// GET USER PROPERTIES
async function getUserProperties(userId: number) {
  try {
    return await db.property.findMany({
      where: { ownerId: userId, },
      include: { images: true },
    });
  } catch (error) {
    console.error("Error fetching user properties:", error);
    throw error;
  }
}

// TOGGLE PROPERTY SOLD
async function togglePropertySold(propertyId: number) {
  try {
    const property = await db.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) throw new Error("Property not found");

    await db.property.update({
      where: { id: propertyId },
      data: { isSold: !property.isSold },
    });

    return property.isSold
      ? "Property Activated"
      : "Property marked as Sold";
  } catch (error) {
    console.error("Error toggling property sold:", error);
    throw error;
  }
}



 async function searchResults(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const propertyType = searchParams.get("propertyType")
    const location = searchParams.get("location")?.trim() || ""

    let propertyEnum: PropertyFor | undefined

    if (propertyType) {
      const upper = propertyType.toUpperCase().trim()

      if (upper === "RENT") propertyEnum = PropertyFor.RENT
      else if (upper === "SALE") propertyEnum = PropertyFor.SALE
      else return NextResponse.json([], { status: 200 })
    }

    const where: Prisma.PropertyWhereInput = {}

    // Filter by type
    if (propertyEnum) {
      where.type = propertyEnum
    }

    // Filter by location
    if (location) {
      where.OR = [
        { city: { contains: location } },
        { state: { contains: location } },
        { street: { contains: location } },
        { zipcode: { contains: location } },
      ]
    }

    const results = await db.property.findMany({
      where,
      include: { images: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export {
  sendMessage,
  getUser,
  getPropertyById,
  getProperties,
  saveProperty,
  postProperty,
  markAsRead,
  getUserProperties,
  togglePropertySold,
  editProperty,
  searchResults
  
};