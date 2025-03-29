# Music Feedback Tool

A powerful web application that provides AI-powered feedback and analysis for your music tracks. Upload your audio files and get detailed insights, performance metrics, and suggestions for improvement.

## Features

- 🎵 Audio Upload & Analysis
  - Support for various audio file formats
  - Real-time audio visualization
  - Waveform display for visual analysis

- 🤖 AI-Powered Feedback
  - Detailed track analysis using Gemini AI
  - Performance metrics and insights
  - Suggestions for improvement

- 📊 Analysis Dashboard
  - Key insights visualization
  - Performance metrics display
  - Track overview with detailed breakdowns

- 🔒 User Authentication
  - Secure login with Google
  - Personal dashboard for your tracks
  - Save and manage your analysis history

## Technologies Used

- **Frontend**: Next.js 14 with App Router, React, and TailwindCSS
- **Backend**: Next.js API Routes
- **AI Integration**: Google Gemini AI for audio analysis
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage for audio files
- **Database**: Firebase Realtime Database for user data

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/twosyntaxerrors/music-feedback-tool.git
```

2. Install dependencies:
```bash
cd music-feedback-tool
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GOOGLE_AI_API_KEY=
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign in with your Google account
2. Upload your audio file using the upload zone
3. Wait for the analysis to complete
4. View detailed feedback and insights in the dashboard
5. Download or share your analysis results

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.