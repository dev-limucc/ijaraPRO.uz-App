-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('APARTMENT', 'HOUSE', 'OFFICE', 'MARKET', 'SCHOOL', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastCityName" TEXT,
ADD COLUMN     "lastLocationLat" DOUBLE PRECISION,
ADD COLUMN     "lastLocationLng" DOUBLE PRECISION,
ADD COLUMN     "lastRegionName" TEXT,
ADD COLUMN     "lastSeenAt" TIMESTAMP(3),
ADD COLUMN     "phoneNumber" TEXT;

-- CreateTable
CREATE TABLE "Listing" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ListingType" NOT NULL,
    "rooms" INTEGER,
    "floor" INTEGER,
    "sizeM2" INTEGER,
    "isPetAllowed" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER NOT NULL,
    "capacity" INTEGER,
    "peopleNeeded" INTEGER,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "videos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "classroomsCount" INTEGER,
    "officeRoomsCount" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
