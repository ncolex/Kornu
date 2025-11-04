# Kornu Project Context

## Project Overview

Kornu is a React-based web application designed to create a social reputation index that allows users to verify and leave reviews about people (partners, friends, etc.) using identifiers like Instagram usernames, full names, or phone numbers. The platform aims to provide a tool for caution and transparency in interpersonal relationships.

The application is built with:
- React 19.1.1
- TypeScript
- React Router DOM for routing
- Google Gemini AI integration
- Vite as the build tool
- Tailwind CSS for styling

## Architecture & Structure

### Core Files
- `App.tsx`: Main application component that sets up routing and context providers
- `index.tsx`: Entry point that renders the App component with React StrictMode
- `vite.config.ts`: Vite configuration including port settings (3000) and environment variables
- `package.json`: Contains dependencies and scripts for development/build

### Components
- `Header.tsx`: Navigation header with links to different sections and authentication state
- `Footer.tsx`: Application footer
- `PrivateRoute.tsx`: Component to protect routes requiring authentication

### Pages
- `HomePage`: Main page for reputation verification
- `NewReviewPage`: Page for submitting new reviews
- `ResultsPage`: Displays search results for profiles
- `RankingPage`: Shows top positive and negative profiles
- `LoginPage`: User authentication page
- `RegisterPage`: User registration page
- `ProfilePage`: User profile management

### Contexts
- `AuthContext.tsx`: Manages user authentication state
- `ThemeProvider.tsx`: Manages dark/light theme
- `NotificationContext.tsx`: Handles application notifications

### Types and Constants
- `types.ts`: Contains TypeScript interfaces and enums for reviews, profiles, users, etc.
- `constants.ts`: Defines categories and reputation levels with their properties

## Key Features and Functionality

### Reputation System
The application uses a scoring system where different types of reviews have different point values:
- 💔 Infidelity: -3 points
- 💰 Theft: -4 points
- 🔪 Betrayal: -3 points
- ☢️ Toxicity: -2 points
- 💖 Positive: +2 points

Based on the total score, profiles are categorized as:
- Confiable (Positive): Score > 0
- Alerta (Warning): Score > -3
- Riesgo Alto (High Risk): Score ≤ -3

### Main Functionalities
1. **Verification**: Search for people using Instagram username, full name, or phone number
2. **Reporting**: Submit anonymous reviews with categories and optional evidence
3. **Ranking**: View top positive and negative profiles on the platform
4. **Authentication**: User registration/login with phone number and password
5. **AI Integration**: Uses Google Gemini for content generation and verification

### Data Management
The application currently uses localStorage to simulate a backend service, with three main data stores:
- Profiles database
- Reviews database
- Users database

## Building and Running

### Development Commands:
- `npm run dev`: Starts the development server on port 3000
- `npm run build`: Builds the application for production
- `npm run preview`: Previews the production build

### Environment Variables:
- `GEMINI_API_KEY`: Required for Google Gemini AI integration (configured in .env.local)

## Development Conventions

### Code Style:
- TypeScript with React functional components and hooks
- Context API for state management
- React Router for navigation
- Tailwind CSS for styling with dark mode support
- Responsive design principles

### Project Structure:
- `components/`: Reusable UI components
- `contexts/`: React context providers
- `hooks/`: Custom React hooks
- `pages/`: Route components
- `services/`: API and business logic services
- `types.ts`: Type definitions
- `constants.ts`: Constant values

### External Services:
- Google Gemini API for AI features
- Instagram API for profile data (simulated)
- Airtable-like service (simulated with localStorage)

## Key Dependencies

### Runtime Dependencies:
- `react` and `react-dom`: Core UI library
- `react-router-dom`: Client-side routing
- `@google/genai`: Google Gemini AI integration

### Development Dependencies:
- `typescript`: Type checking
- `vite`: Build tool and dev server
- `@vitejs/plugin-react`: React plugin for Vite
- `@types/node`: Node.js type definitions

## Special Notes

1. The application is designed as a PWA (Progressive Web App)
2. It includes automatic Instagram profile searching when a profile is found
3. It provides web verification checks across multiple platforms (Google, Facebook, TikTok, etc.)
4. The authentication system supports both social login and traditional phone/password login
5. All review submissions are anonymous with verification contact information stored separately
6. The application includes a notification system for real-time updates
7. Theme switching (light/dark mode) is implemented through context provider