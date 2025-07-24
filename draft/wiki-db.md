# to setup prisma with neon

- (1) create a project in neon

  - https://console.neon.tech/app/org-billowing-field-15775025/projects

- (2) go to the code base terminal and in order to create prisma project run (npx parisma init)

  - it will generate the ecosystem of prisma at the root of our project
  - and it will create a folder in your project base folder named prisma and inside it have a file called schema.prisma
    - this is where we will generate our dababase tables
    - we can also create the table manually with neon
  - it is highly recomended to install the 'Prisma' extention in vscode

- (3) steps to connect with database using noen

  - go to neon
  - select your created neon project
  - on Connect to your database press connect and copy the connection string
  - past the copied string inside .env file as DATABASE_URL = "...connection string..."
    - .env file created for us through the prisma init
  - now the databse should be successfully connected which if hosted by neon for our project

- (4) setting up the Auth

  - in order to do this settup we have the next-auth installed
  - we have to create a auth.ts file at the root of our project
  - do the recomended setup in this file for next-auth

    ```js
    import NextAuth from "next-auth";
    import GitHub from "next-auth/providers/github";
    import { PrismaAdapter } from "@auth/prisma-adapter";
    import { prisma } from "@/lib/prisma";
    export const { auth, handlers, signIn, signOut } = NextAuth({
      providers: [GitHub],
      adapter: PrismaAdapter(prisma),
    });
    ```

    - The providers option is used to configure the authentication methods you want to support in your app in out case GitHub
    - The adapter tells NextAuth how to store and retrieve data (like users, sessions, verification tokens) in your database.
    - What does PrismaAdapter do?

      - Saves user info (from GitHub) in your database.
      - Manages sessions and accounts.
      - Connects NextAuth with your prisma instance and schema.

    - We pass prisma as a parameter to PrismaAdapter(prisma) because the Prisma Adapter needs a Prisma client instance in order to interact with your database.
    - to create Prisma client instance

      - in the project root create a folder named lib (folder name optional)
      - inside of it we should create a file called prisma.ts
      - now inside of this file we will be generting an instance of prisma client
        - basicly the prisma cliet is gona create type safty for our different tables in models in our project
      - you can copy the code for prisma.ts to generate the insance of prisma client from documentation.

      ```js
      import { PrismaClient } from "@prisma/client";
        const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
        export const prisma = globalForPrisma.prisma || new PrismaClient();
        if (proc  ess.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
      ```

    - and at the end import this file in auth.ts and use if in PrismaAdapter() as a parameter

- (5) now we have created our next-auth and we can get a couple of thing from function NextAuth like {auth, handlers, signIn, signOut}

  - auth -> this is a function which when ever we call it is gona return as back information about the session of the user who is currently signed in
  - handlers -> to handle redirecting when the user signedIn
  - signIn and signOut -> functions the from the names you mignt assume thier usage

- (6) APIs

  - inside the app folder create an api named folder
  - the api folder will allow us to create API endpoints

    - more spescificly if you are working with next-auth in a next.js project to make the authentication flow work you need to create a folder inside the api called auth
    - inside of the the auth folder create another folder named [...nextauth]
    - inside of [...nextauth] you need to create a route.ts
    - inside this file import the handlers we created by NextAuth in auth.ts and from that handlers export {GET, POST} requests

    ```js
    import { handlers } from "@/auth";
    export const { GET, POST } = handlers;
    ```

  - this file is just for next-auth to work

- (7) signIn

  - now we have successfully settup the infrastructure for out authentication to work in our project
  - the only thig which is left is we need yo actually allow the user to click on sign in button an login to thier account
  - in order to do this, inside the lib folder create a file called auth-actions
  - and in this file we will create the two functions that will be called when the user logs in when the user logs out

  ```js
  "use server";
  import { signIn, signOut } from "@/auth";
  export const login = async () => {
    await signIn("github", { redirectTo: "/" });
  };
  export const logout = async () => {
    await signOut({ redirectTo: "/" });
  };
  ```

  - now we have this two function that we can call anywhere in our app
  - the place we wana call it is in signin button in NavBar with an onClick eventListner

- (8) defining user models

  - define the structure of the tables that gona be exist in neon database
  - in order to do that, the next auth library actually provides us with the model that we need for when we are using prisma with there service
    - linke is here https://authjs.dev/getting-started/adapters/prisma#schema
  - now after we create the models we just need to migrate the models to have acces to them as tables on neon
    - npx prisma migrate dev
    - npx prisma generate
    - at the end in lib\prisma.ts change the import { PrismaClient } from "@prisma/client"; to import { PrismaClient } from "@/app/generated/prisma/client";

- (9) setup a github acount to have an API key that we can connect to our project

  - sign in to your github account and follow bellow steps
    - click on your profile picture
    - click on settings
    - click on developer settings
    - click on OAuth Apps
    - click on new OAuth App
    - with new OAuth you will get a Client ID and Client secrets
  - now come back to code base on root directory create a file named .env.local
    - and on that file add
      AUTH_GITHUB_ID = .....
      AUTH_GITHUB_SECRET = .....
    - and then run npm exec auth secret to generate AUTH_SECRET in .env.local

  NOW YOU CAN CLICK ON LOGIN BUTTON AND LOG IN YO THE APP
