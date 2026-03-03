import { Prisma, PrismaClient } from "@prisma/client";


export const db = new PrismaClient();

export type PropertyWithImages = Prisma.PropertyGetPayload<{
       include: {
        images : true
       }
}>


export type PropertyWithImagesAndOwner = Prisma.PropertyGetPayload<{
       include: {
        images : true
        owner : true
       }
}>


export type MessageType = Prisma.MessageGetPayload<{
       include: {
              sender: true
              receiver: true
              property: true
       }
}>
