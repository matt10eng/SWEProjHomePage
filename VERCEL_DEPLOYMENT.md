# Vercel Deployment Guide

This document provides step-by-step instructions for deploying this React application to Vercel.

## Manual Configuration Steps

1. **Log in to your Vercel Dashboard**: Go to [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Import your GitHub repository**:
   - Click "Add New..." → "Project"
   - Select the GitHub repository (`SWEProjHomePage`)
   - Click "Import"

3. **Configure the project settings**:
   - **Framework Preset**: Select "Create React App"
   - **Root Directory**: Enter `my-resume-site`
   - **Build Command**: Leave as default (`npm run build`)
   - **Output Directory**: Leave as default (`build`)
   - **Install Command**: Leave as default (`npm install`)

4. **Set Environment Variables** (if needed):
   - Add `REACT_APP_API_URL` pointing to your backend API
   - Add any other required environment variables

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build and deployment to complete

## Troubleshooting

If you encounter a blank page after deployment:

1. **Clear Browser Cache**:
   - Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Or open in an incognito/private window

2. **Check Build Logs**:
   - In the Vercel dashboard, click on your deployment
   - Go to "Logs" to see if there were any build errors

3. **Verify Project Settings**:
   - Double-check that the root directory is set to `my-resume-site`
   - Ensure the correct framework preset is selected

4. **Force a Manual Deploy**:
   - From the dashboard, click the three dots menu next to your latest deployment
   - Select "Redeploy" with "Clear cache and redeploy" option checked

## Important Notes

- The repository contains a `vercel.json` file with proper configuration for handling client-side routing
- The homepage in `package.json` is set to `/` for proper asset path resolution
- This project uses React Router v6+ which requires proper URL rewrite configuration (handled in vercel.json) 