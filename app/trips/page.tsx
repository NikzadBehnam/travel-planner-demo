import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TripsPage() {
  const session = await auth();
  const trips = await prisma.trip.findMany({
    where: { userId: session?.user?.id },
  });

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upCommingTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) >= today
  );

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Please sign In.
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div className="flex items-center justify-between ">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href={"/trips/new"}>
          <Button>New Trip</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back {session.user?.name} </CardTitle>
          {/* TODO: Show only the first 
              - make an state of a simple variable to seprate the name, surename and the last name usint Split() and keep them in different global state variables
              - the text should be differnt in case if the user have the name || surname || last name || null 
           */}
        </CardHeader>
        <CardContent>
          <p>
            {trips.length === 0
              ? "Start planning your first trip by clicking the button above"
              : `You have the ${trips.length} ${
                  trips.length === 1 ? "trip" : "trips"
                } planned. ${
                  upCommingTrips.length > 0
                    ? `${upCommingTrips.length} upcomming.`
                    : ""
                } `}
          </p>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-xl font-semibol mb-4">Your Recent Trips</h2>
        {trips.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <h3 className="text-xl  font-medium mb-2">No trips yet.</h3>
              <p className="text-center mb-4  max-w-md">
                Start planning your adventure by creating your first trip.
              </p>
              <Link href={"/trips/new"}>
                <Button>Create Trip</Button>
                {/*TODO: this button should be removed and a new idea should be applied here (ex: a link combined with text above ) */}
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTrips.slice(0, 6).map((trip, key) => (
              <Link key={key} href={""}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-2">
                      {trip.description}
                    </p>
                    <div className="text-sm">
                      {`${new Date(
                        trip.startDate
                      ).toLocaleDateString()} - ${new Date(
                        trip.endDate
                      ).toLocaleDateString()}`}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/*
- this page is only accesable if the use logged in
- this is a server component then we 

*/
