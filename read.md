#Product Data Explorer – World of Books
Overview

Product Data Explorer is a full-stack application that allows users to browse collections and products from World of Books. Data is scraped on demand, stored in a database, and displayed through a responsive frontend.
The project demonstrates backend scraping, API design, database persistence, and frontend integration using modern web technologies.

#Tech Stack

-Frontend
Next.js (App Router)
TypeScript
Tailwind CSS

-Backend
NestJS
TypeScript
Playwright (scraping)
Prisma ORM

-Database
PostgreSQL

#Architecture & Design Decisions

-Navigation data is fetched from World of Books and stored.
-Categories are derived from navigation because World of Books exposes flat collections, not hierarchical categories.
-Products are scraped on demand per category.
-Scraped data is cached in PostgreSQL to avoid repeated requests.
-Frontend consumes backend REST APIs and renders real data.

#Ethical Scraping
-Scraping is triggered only by user requests.
-No background or aggressive crawling.
-Results are cached to minimize repeated scraping.
-Reasonable timeouts and delays are used.

#Running Locally
-Backend
cd backend
npm install
npm run start:dev

Backend runs at:
http://localhost:3000

-Frontend
cd frontend
npm install
npm run dev

Frontend runs at:
http://localhost:3001

#Environment Variables
Backend (.env)
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>

Frontend (.env.local)
NEXT_PUBLIC_API_BASE=http://localhost:3000

#Database

-Database schema is defined using Prisma:
backend/prisma/schema.prisma

-Categories are seeded dynamically from navigation using:
POST /navigation/categories/seed

#API Endpoints

-GET /navigation – fetch navigation collections
-POST /navigation/categories/seed – seed categories from    navigation
-GET /navigation/:slug/categories – fetch categories
-POST /navigation/:slug/products/scrape – scrape products on demand
-GET /navigation/:slug/products – fetch cached products

#CI

A basic GitHub Actions CI pipeline is included to:

-Install dependencies
-Build backend
-Build frontend

#Deployment

-Frontend: Deployed on Vercel (live URL provided at submission)

-Backend: Deployed on a managed Node.js platform (Render / Railway)


#Project Status

-Core requirements implemented
-Backend and frontend integrated
-Real data scraping working
-Database persistence enabled
-Ready for assessment review

