"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

async function geocodeAddress(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );

  const data = await response.json();
  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}

export default async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated ...");
    // TODO: add a toast notification for every singel user messages(error, warning, success ...)
  }

  const address = formData.get("address")?.toString();
  if (!address) {
    throw new Error("Missing address ..");
  }

  const { lat, lng } = await geocodeAddress(address);
  const count = await prisma.location.count({
    where: { tripId },
  });

  await prisma.location.create({
    data: {
      locationTitle: address,
      lat,
      lng,
      tripId,
      order: count,
    },
  });
  redirect(`/trips/${tripId}`);
}

/* 
Notes:
 - API DOC: https://developers.google.com/maps/documentation/geocoding/start 
*/
