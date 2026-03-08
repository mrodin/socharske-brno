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
EXPO_PUBLIC_AUTH_IOS_GOOGLE_CLIENT_ID=<<GOOGLE_OAUTH_APPLE_TYPE>>
EXPO_PUBLIC_AUTH_ANDROID_GOOGLE_CLIENT_ID=<<GOOGLE_OAUTH_WEB_TYPE>>
EXPO_PUBLIC_GOOGLE_API_KEY=<<GOOGLE_API_KEY>>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<<SUPABASE_ANON_KEY>>
EXPO_PUBLIC_SUPABASE_URL=<<SUPABASE_URL>>
EXPO_PUBLIC_AMPLITUDE_API_KEY=<<AMPLITUDE_API_KEY>>
EXPO_PUBLIC_IMAGES_STORAGE_URL=<<GOOGLE_STORAGE_URL>>
EXPO_IOS_URL_SCHEME=<<IOS_URL_SCHEME>>
```

````

### Android Studio

1. Install Android Studio from (on MacOS `brew install --cask android-studio`)
2. Open Android Studio and accept the setup wizard to install the necessary SDKs and tools. You should see Welcome to Android Studio window.
3. Follow instructions of Expo setup https://docs.expo.dev/workflow/android-studio-emulator/
4. Create a build by running `npm run android` (it's necessary to run this command at least once to download required dependencies `npm start` alone is not enough)

### macOS used commands
```bash
brew install --cask android-studio
brew install --cask zulu@17
brew install watchman
echo "export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home" >> ~/.bash_profile # or ~/.zshrc
echo "export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
" >> ~/.bash_profile # or ~/.zshrc
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
````
