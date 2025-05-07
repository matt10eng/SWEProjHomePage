# E-commerce Project

This is a full-stack e-commerce project with a React frontend and Node.js/Express backend.

## Project Structure

- `my-resume-site/`: Frontend React application
- `backend/`: Backend Express API

## Quick Start

For a streamlined setup experience:

```bash
# Install dependencies and set up environment files
npm run setup

# Start both backend and frontend (requires concurrently)
npm run dev
```

The setup script will:
1. Create `.env` files from templates
2. Install dependencies for both backend and frontend
3. Guide you through the next steps

## Manual Setup Instructions

If you prefer to set up each component manually:

### Backend Setup

1. Navigate to the backend directory
   ```
   cd backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file (two options)
   - Option 1: Use the setup script
     ```
     npm run setup
     ```
   - Option 2: Manually copy the template
     ```
     cp .env.template .env
     ```
   
4. Edit the `.env` file with your actual credentials:
   - MongoDB connection string (create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account)
   - Mailgun API credentials (sign up for a free [Mailgun](https://www.mailgun.com/) account)
   - JWT secret (generate a random string)

5. Seed the database with initial product data (optional)
   ```
   npm run seed
   ```

6. Start the backend server
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory
   ```
   cd my-resume-site
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file (two options)
   - Option 1: Use the setup script
     ```
     npm run setup
     ```
   - Option 2: Manually copy the template
     ```
     cp .env.template .env
     ```

4. Edit the `.env` file to point to your backend API

5. Start the frontend development server
   ```
   npm start
   ```

## Environment Variables

### Backend

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `CLIENT_URL`: URL of the frontend application
- `MAILGUN_API_KEY`: Mailgun API key for sending emails
- `MAILGUN_DOMAIN`: Mailgun domain for sending emails

### Frontend

- `REACT_APP_API_URL`: URL of the backend API

## Features

- User authentication (register, login, password recovery)
- Product browsing and searching
- Shopping cart functionality
- Checkout process
- Order tracking
- Email confirmation for orders

## API Documentation

The backend includes Swagger documentation accessible at `/api-docs` when the server is running.

## Deployment

### Frontend Deployment

1. Build the production bundle:
   ```
   cd my-resume-site
   npm run build
   ```

2. Deploy the `build` folder to your hosting service (Netlify, Vercel, GitHub Pages, etc.)
   
   For GitHub Pages:
   ```
   npm run deploy
   ```

### Backend Deployment

For backend deployment, you can use services like:

1. **Heroku**:
   - Install Heroku CLI
   - Login with `heroku login`
   - Create app with `heroku create`
   - Deploy with `git push heroku main`
   - Set environment variables in Heroku dashboard

2. **Render**:
   - Connect GitHub repository
   - Set build command to `npm install`
   - Set start command to `npm start`
   - Add environment variables in dashboard

3. **Railway**:
   - Connect GitHub repository
   - Railway will auto-detect Node.js app
   - Add environment variables in dashboard

Remember to use MongoDB Atlas for your database in production. 