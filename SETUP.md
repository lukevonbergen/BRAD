# Quick Setup Guide for DASH

Follow these steps in order to get DASH up and running.

## Checklist

- [ ] Google Cloud Project created
- [ ] Google Calendar API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Client ID added to index.html
- [ ] OpenAI API key obtained
- [ ] Vercel account created
- [ ] Project deployed to Vercel
- [ ] OpenAI API key added to Vercel
- [ ] Google OAuth redirect URIs updated with Vercel URL
- [ ] Tested the deployment

## Step-by-Step

### 1. Get Your Google Calendar Client ID (15 minutes)

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project called "DASH"
3. Go to "APIs & Services" → "Library"
4. Search for "Google Calendar API" and enable it
5. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
6. Set up consent screen:
   - User Type: External
   - App name: DASH
   - Add your email for support and developer contact
7. Create OAuth Client:
   - Type: Web application
   - Authorized origins: `https://lukevonbergen.github.io`
   - Redirect URIs: `https://lukevonbergen.github.io/BRAD/`
8. **Copy the Client ID** - you'll need this!

### 2. Update index.html

1. Open `index.html`
2. Find line 194 (search for `googleClientId`)
3. Replace `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID from step 1

### 3. Get OpenAI API Key (5 minutes)

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Name it "DASH"
5. **Copy the key** - you won't be able to see it again!
6. Add some credits to your account (minimum $5)

### 4. Deploy to Vercel (10 minutes)

#### If using GitHub:

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Click "Deploy" (default settings are fine)
6. Wait for deployment to complete
7. Go to "Settings" → "Environment Variables"
8. Add variable:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key from step 3
9. Go to "Deployments" and redeploy the latest deployment

#### If using Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /path/to/BRAD
vercel

# Add API key
vercel env add OPENAI_API_KEY
# Choose: Production
# Paste your OpenAI API key

# Redeploy
vercel --prod
```

### 5. Update Google OAuth (5 minutes)

After Vercel deployment, you'll get a URL like `https://your-project.vercel.app`

1. Go back to [Google Cloud Console](https://console.cloud.google.com) → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add to Authorized JavaScript origins:
   - `https://your-project.vercel.app`
4. Add to Authorized redirect URIs:
   - `https://your-project.vercel.app/`
5. Save

### 6. Test Everything

1. Visit your Vercel URL
2. Click "Connect Calendar" (should open Google sign-in)
3. Authorize the app
4. Try asking: "What's my schedule today?"
5. Try clicking the microphone button and speaking: "What's the tube status?"

## Common Issues

**"Redirect URI mismatch"**
- Make sure your Vercel URL is added to Google OAuth settings
- URLs must match exactly (with/without trailing slash matters!)

**"OpenAI API error"**
- Check you added the environment variable in Vercel
- Make sure you have credits in your OpenAI account
- Try redeploying after adding the environment variable

**Voice not working**
- Only works over HTTPS (Vercel provides this automatically)
- Use Chrome, Edge, or Safari (not Firefox)
- Allow microphone permissions when prompted

**Calendar shows no events**
- Make sure you have events in your Google Calendar
- Check you're signed in with the correct Google account
- Try disconnecting and reconnecting the calendar

## Next Steps

- Set up iOS Shortcut for quick voice access
- Customize DASH's personality in `api/openai-proxy.js`
- Add more suggested prompts in `index.html`
- Consider switching to GPT-3.5-turbo for faster/cheaper responses

## Need Help?

Check the full [README.md](README.md) for detailed troubleshooting and configuration options.
