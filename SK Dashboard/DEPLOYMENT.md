# Deploying Svanik's Dashboard to Render

## Quick Deployment Steps

1. **Push your code to GitHub**
   - Create a new repository on GitHub
   - Push your project files to the repository

2. **Deploy on Render**
   - Go to [render.com](https://render.com) and create an account
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:

### Render Configuration

**Build Settings:**
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Environment:** `Node`
- **Node Version:** `18` (or higher)

**Environment Variables:**
- `NODE_ENV` = `production`
- `PORT` = `5000` (Render will override this automatically)

**Advanced Settings:**
- **Auto-Deploy:** Yes (recommended)
- **Health Check Path:** `/` (optional)

## Files Created for Deployment

✅ `render.yaml` - Render configuration file
✅ `Dockerfile` - Container configuration (backup option)
✅ Your app is already configured to:
   - Use the PORT environment variable
   - Serve static files in production
   - Handle both API and frontend routes

## Alternative: Manual Deployment

If you prefer Docker deployment:

```bash
# Build the Docker image
docker build -t svanik-dashboard .

# Run locally to test
docker run -p 5000:5000 svanik-dashboard
```

## Important Notes

- Your app uses in-memory storage, so data resets on each deployment
- The app serves both the React frontend and Express API from a single port
- All dependencies are properly configured for production builds
- No database setup required since you're using in-memory storage

## Deployment URL

Once deployed, your dashboard will be available at:
`https://your-service-name.onrender.com`

The deployment should complete in 3-5 minutes. Render will automatically detect your Node.js app and use the build/start commands specified.