# Flash card built with Next.js

This is a simple flash card built with Next.js.

## Initialization

#### Clone the repository and go to the project directory

```bash
git clone git@github.com:yukio5347/nextjs-flashcard.git YOUR_PROJECT_NAME
cd YOUR_PROJECT_NAME
```

#### Install packages

```bash
npm install
```

#### Run local server

```bash
npm run dev
```

## Configurations

### Database

#### .env

Create `.env` file and set `DATABASE_URL` variable.

```bash
cp .env.example .env
```

#### Push the schema to your database

```bash
npx prisma db push
```
