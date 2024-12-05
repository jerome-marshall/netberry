# Netberry
Netberry is a dashboard built using the [T3 Stack](https://create.t3.gg/). It is designed to help users manage deployments across multiple Netlify accounts. With Netberry, you get a single dashboard to access all your sites hosted on different Netlify accounts.

### Features
- User authentication: Any person with a "starberry" organization account can log in.
- Site overview: You can view all your live or development sites under one interface.
- Environment variables: You can view and download environment variables.
- Manual builds: Netberry offers the ability to trigger manual builds, clear cache builds, and cancel any ongoing deploys.
- Site favorites: Users can favorite specific sites for quick access.
- Permalinks: Netberry gives access to a permalink for each successful deploy.
- Lock/Unlock Deployments: Allows users to lock or unlock deployments, either to lock onto a specific deploy or to avoid accidental deploys.

### Tech Stack - [T3 Stack](https://create.t3.gg/)
- [Next.js](https://nextjs.org/)
- [tRPC](https://trpc.io/)
- [Auth.js](https://authjs.dev/)
- [Prisma ORM](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Netlify API](https://open-api.netlify.com/)

### Setup
1. Clone the repository.
2. Install dependencies using npm install.
3. Create a .env file with the necessary environment variables as in the .env.example file.
4. Start the development server using npm run dev.

### Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
