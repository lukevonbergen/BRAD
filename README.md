# DASH - Digital Assistant for Scheduling and Home

A voice-enabled personal assistant web app that integrates with Google Calendar and provides London Underground status updates. Built with a British personality inspired by JARVIS.

## Features

- **Voice Input & Output**: British English voice recognition and text-to-speech
- **Google Calendar Integration**: Query your schedule with natural language
- **TfL Tube Status**: Real-time London Underground line status
- **Chat Interface**: Text or voice interaction with suggested prompts
- **Mobile Optimized**: Works great on mobile with iOS Shortcuts support
- **Secure**: OpenAI API key protected via serverless backend

## Quick Start

### 1. Prerequisites

- [Vercel Account](https://vercel.com) (free tier is fine)
- [OpenAI API Key](https://platform.openai.com/api-keys)
- [Google Cloud Project](https://console.cloud.google.com) with Calendar API enabled

### 2. Google Calendar Setup

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

#### Step 2: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Configure the consent screen if prompted:
   - User Type: External
   - App name: DASH
   - User support email: Your email
   - Developer contact: Your email
4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: DASH Web Client
   - Authorized JavaScript origins:
     ```
     https://lukevonbergen.github.io
     http://localhost:3000 (for local testing)
     ```
   - Authorized redirect URIs:
     ```
     https://lukevonbergen.github.io/BRAD/
     http://localhost:3000 (for local testing)
     ```
5. Copy the **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)

#### Step 3: Update index.html
1. Open [`index.html`](index.html)
2. Find line 194 with `googleClientId`
3. Replace `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID

```javascript
const CONFIG = {
    googleClientId: 'YOUR-ACTUAL-CLIENT-ID.apps.googleusercontent.com',
    apiEndpoint: window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api'
        : '/api'
};
```

### 3. OpenAI API Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. You'll add this to Vercel in the next step (don't put it in any files!)

### 4. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project directory:
   ```bash
   cd /path/to/BRAD
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Set environment variable:
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   - Select "Production"
   - Paste your OpenAI API key when prompted

6. Redeploy with environment variables:
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
5. Add Environment Variable:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
6. Click "Deploy"

### 5. Update Google OAuth Redirect URIs

After deployment, Vercel will give you a URL (e.g., `https://your-project.vercel.app`)

1. Go back to Google Cloud Console > Credentials
2. Edit your OAuth 2.0 Client ID
3. Add your Vercel URL to both:
   - Authorized JavaScript origins: `https://your-project.vercel.app`
   - Authorized redirect URIs: `https://your-project.vercel.app/`

### 6. Test Your Deployment

1. Visit your Vercel URL
2. Click "Connect Calendar" and authorize Google Calendar
3. Try asking:
   - "What's my schedule today?"
   - "When am I next golfing?"
   - "What's the tube status like?"
   - "Am I free tomorrow afternoon?"

## iOS Shortcuts Integration

To use voice input via iOS Shortcuts:

1. Create a new Shortcut on your iPhone
2. Add action: "Open URLs"
3. URL: `https://your-project.vercel.app/?autoListen=true`
4. Add to Home Screen for quick access

The app will automatically start listening when opened with the `?autoListen=true` parameter.

## Local Development

1. Clone the repository
2. Install Vercel CLI: `npm install -g vercel`
3. Create a `.env.local` file:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
4. Run development server:
   ```bash
   vercel dev
   ```
5. Open `http://localhost:3000`

## Configuration

### Changing the OpenAI Model

Edit [`api/openai-proxy.js`](api/openai-proxy.js) line 107:

```javascript
model: 'gpt-4', // or 'gpt-3.5-turbo' for faster/cheaper responses
```

**Model Options:**
- `gpt-4`: Best quality, slower, more expensive
- `gpt-3.5-turbo`: Fast, cheaper, good quality

### Customizing DASH's Personality

Edit the system prompt in [`api/openai-proxy.js`](api/openai-proxy.js) around line 26 to change DASH's tone and behavior.

### Adding More Calendar Data

By default, DASH fetches the next 2 weeks of events. To change this, edit [`index.html`](index.html) line 492:

```javascript
const endOfWeek = moment().endOf('week').add(7, 'days').toISOString();
```

## Troubleshooting

### Voice Recognition Not Working
- Make sure you're using HTTPS (required for Web Speech API)
- Use Chrome, Edge, or Safari (Firefox doesn't support Web Speech API)
- Check microphone permissions in browser settings

### Calendar Not Connecting
- Verify your Google Client ID is correct in `index.html`
- Check that your redirect URIs match exactly in Google Cloud Console
- Make sure Calendar API is enabled in your Google Cloud project

### OpenAI Errors
- Check that your API key is set correctly in Vercel
- Verify you have credits in your OpenAI account
- Check the Vercel function logs for detailed errors

### CORS Errors
- Ensure your domain is listed in Google OAuth settings
- Redeploy after changing environment variables in Vercel

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth and 100GB-hours of serverless function execution
- **Google Calendar API**: Free (1,000,000 queries/day)
- **OpenAI API**: Pay-per-use (~$0.002 per interaction with GPT-3.5-turbo, ~$0.03 with GPT-4)
- **TfL API**: Free

## Privacy & Security

- Your OpenAI API key is stored securely in Vercel environment variables (never in code)
- Google OAuth tokens are stored in browser memory only (not persisted)
- No database - all data is fetched in real-time from Google Calendar
- All communication happens over HTTPS

## Future Enhancements

- Add Gmail integration
- Support for Google Tasks
- Weather integration
- Multiple calendar support
- Custom wake word
- Persistent conversation history
- Smart home integrations

## License

MIT License - feel free to fork and customize!

## Credits

Built with:
- [Tailwind CSS](https://tailwindcss.com)
- [Font Awesome](https://fontawesome.com)
- [Moment.js](https://momentjs.com)
- [Google Calendar API](https://developers.google.com/calendar)
- [OpenAI API](https://openai.com)
- [TfL Unified API](https://api.tfl.gov.uk)
