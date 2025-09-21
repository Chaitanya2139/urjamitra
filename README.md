# UrjaMitra - AI-Powered Sustainability Companion

UrjaMitra is a modern, interactive web application that helps users optimize their solar energy usage, track carbon footprint, monitor water consumption, and engage with gamified sustainability challenges. The app is powered by Google Gemini AI to provide intelligent recommendations and insights.

## Features

### 🌟 Core Modules

1. **Solar Energy PowerCheck**
   - AI-powered energy optimization
   - Interactive device management
   - Real-time energy usage visualization
   - Optimal scheduling recommendations

2. **Carbon Footprint Analyzer**
   - Product analysis via photo upload
   - AI-powered carbon footprint calculation
   - Eco-friendly alternative suggestions
   - Environmental impact tracking

3. **Water Safety & Usage Tracker**
   - Water consumption monitoring
   - Quality status indicators
   - Conservation recommendations
   - Usage pattern analysis

4. **Eco Challenges & Gamification**
   - Interactive sustainability challenges
   - Points and badge system
   - AI-powered personalized suggestions
   - Progress tracking and achievements

### 🎨 UI/UX Features

- **3D Globe Visualization** - Interactive Three.js globe showing renewable energy impact
- **GSAP Animations** - Smooth scroll effects and transitions
- **Responsive Design** - Mobile-first approach with modern UI
- **Real-time Updates** - Live data visualization and progress tracking

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: CSS3 with modern features
- **3D Graphics**: Three.js
- **Animations**: GSAP (ScrollTrigger, scrub, pin)
- **AI Integration**: Google Gemini API
- **Authentication**: Mock Authentication System
- **Database**: Local State Management
- **Routing**: React Router v6

## Prerequisites

- Node.js 16+ and npm
- Google Gemini API key (optional for AI features)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd urjamitra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup (Optional)**
   - Copy `env.example` to `.env`
   - Add your Gemini API key for AI features:
   ```env
   REACT_APP_GEMINI_API_KEY=AIzaSyAZqimBViNUgKUAXfM2i_nHnTNH-hbhQcE
   ```

4. **Google Gemini Setup (Optional)**
   - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add the key to your `.env` file
   - Note: The app works without this, but AI features will be disabled

## Running the Application

1. **Start development server**
   ```bash
   npm start
   ```

2. **Open your browser**
   Navigate to `http://localhost:3000`

3. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── modules/
│   │   ├── SolarEnergy.tsx
│   │   ├── CarbonFootprint.tsx
│   │   ├── WaterTracker.tsx
│   │   └── EcoChallenges.tsx
│   ├── LandingPage.tsx
│   ├── Dashboard.tsx
│   ├── AuthModal.tsx
│   └── Globe.tsx
├── firebase.ts
├── App.tsx
└── index.tsx
```

## Key Features Implementation

### AI Integration
- **Gemini API** for intelligent recommendations
- **Context-aware responses** based on user data
- **Multi-modal analysis** (text, images, structured data)

### 3D Visualization
- **Three.js globe** with renewable energy data
- **Interactive animations** and real-time updates
- **Responsive 3D graphics** for all screen sizes

### Authentication
- **Firebase Auth** with email/password
- **Protected routes** and user state management
- **Seamless login/logout** experience

### Data Management
- **Firestore** for user data persistence
- **Real-time updates** and synchronization
- **Offline support** with local state management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Google Gemini** for AI capabilities
- **Firebase** for backend services
- **Three.js** for 3D graphics
- **GSAP** for animations
- **React** community for excellent tooling

## Support

For support, email support@urjamitra.com or create an issue in the repository.

---

**Built with ❤️ for a sustainable future**