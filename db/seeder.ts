// db/seeder.ts
import { db } from ".";
import properties from "@/data/properties.json";
import {
  PropertyFor,
  PropertyType,
  BHK,
  Parking,
  PreferredTenants,
} from "@prisma/client";

const importData = async () => {
  try {
    // Delete existing data
    console.log("Deleting existing images, properties, and users...");
    await db.image.deleteMany();
    await db.property.deleteMany();
    await db.user.deleteMany();
    console.log("Existing data deleted.");

    for (const property of properties) {
      try {
        // Ensure owner exists
        let owner = await db.user.findUnique({
          where: { email: property.owner.email },
        });

        if (!owner) {
          owner = await db.user.create({
            data: {
              username: property.owner.username,
              email: property.owner.email,
            },
          });
        }

        // Map enums safely
        const type = PropertyFor[property.type as keyof typeof PropertyFor];
        const propertyType =
          PropertyType[property.propertyType as keyof typeof PropertyType];
        const bhk = BHK[property.bhk as keyof typeof BHK];
        const parking = Parking[property.parking as keyof typeof Parking];
        const preferredTenants =
          PreferredTenants[property.preferredTenants as keyof typeof PreferredTenants];

        // Skip if any enum is invalid
        if (!type || !propertyType || !bhk || !parking || !preferredTenants) {
          console.warn(`Skipping property "${property.name}" due to invalid enum.`);
          continue;
        }

        // Insert property
        await db.property.create({
          data: {
            type,
            propertyType,
            bhk,
            parking,
            preferredTenants,
            name: property.name,
            description: property.description,
            street: property.street,
            city: property.city,
            state: property.state,
            zipcode: property.zipcode,
            price: property.price,
            area: property.area,
            isSold: property.isSold ?? false,
            isFeatured: property.isFeatured ?? false,
            availableFrom: new Date(property.availableFrom),
            ownerId: owner.id,
            images: {
              create: property.images.map((img: { url: string }) => ({ url: img.url })),
            },
          },
        });

        console.log(`Inserted property: ${property.name}`);
      } catch (err) {
        console.error(`Failed to insert property "${property.name}":`, err);
      }
    }

    console.log("All properties processed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error importing properties:", error);
    process.exit(1);
  }
};

importData();