# Sochařské brno

## Technologies

- React Native
- Expo
- Supabase
- Google cloud functions (python)
- Google cloud storage

## Setup

1. Install dependencies

```bash
npm install
```

2. Start the app

```bash
npm start
```

3. Setup environment variables
   Create a file named `.env` in the root of the `mobile` directory and add the
   following variables:

```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=<<GOOGLE_MAPS_API_KEY>>
EXPO_PUBLIC_ANDROID_GOOGLE_MAPS_API_KEY=<<GOOGLE_ANDROID_API_KEY>>
EXPO_PUBLIC_NEARBY_PLACES_API=<<NEARBY_PLACES_API_KEY>>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<<SUPABASE_ANON_KEY>>
EXPO_PUBLIC_SUPABASE_URL=<<SUPABASE_URL>>
EXPO_PUBLIC_AMPLITUDE_API_KEY=<<AMPLITUDE_API_KEY>>
EXPO_PUBLIC_AMPLITUDE_USER_ID=<<AMPLITUDE_USER_ID>>
```

## Structure

### Folders

- app: This folder contains the core components of your application.
  - screens: Individual screens of your app (e.g., HomeScreen, SearchScreen). Each screen is typically a separate JavaScript file.
  - components: Reusable UI components (buttons, cards, headers).
  - navigation (optional): Navigation logic if using a third-party library like React Navigation.
- api (optional): Logic related to fetching data from APIs.
- assets: Stores static assets like images, fonts, or icons used within the app.
  assets (root level): Stores additional static assets.
- App.js: The root file of your Expo app, rendering the main application component.
- app.json: Configuration options for your Expo app (name, icons, splash screen).
- App.config.js (optional): Environment variables specific to development/staging/production environments.
- babel.config.js (optional): Configures Babel for compatibility with Expo's runtime environment.

### Tips

- Separation of Concerns: Separate UI components, data fetching, and business logic for better maintainability.
- Naming Conventions: Use consistent naming conventions for files and components to improve readability.
- Scalability: Structure your code to accommodate future growth.
- Third-Party Libraries: Additional folders or files might be associated with third-party libraries you use.
