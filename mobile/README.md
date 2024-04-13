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
3. Scan the QR code with the Expo Go app on your phone

## Structure
### Folders

* app: This folder contains the core components of your application.
  * screens: Individual screens of your app (e.g., HomeScreen, SearchScreen). Each screen is typically a separate JavaScript file.
  * components: Reusable UI components (buttons, cards, headers).
  * navigation (optional): Navigation logic if using a third-party library like React Navigation.
* api (optional): Logic related to fetching data from APIs.
* assets: Stores static assets like images, fonts, or icons used within the app.
assets (root level): Stores additional static assets.
* App.js: The root file of your Expo app, rendering the main application component.
* app.json: Configuration options for your Expo app (name, icons, splash screen).
* App.config.js (optional): Environment variables specific to development/staging/production environments.
* babel.config.js (optional): Configures Babel for compatibility with Expo's runtime environment.
### Tips
* Separation of Concerns: Separate UI components, data fetching, and business logic for better maintainability.
* Naming Conventions: Use consistent naming conventions for files and components to improve readability.
* Scalability: Structure your code to accommodate future growth.
* Third-Party Libraries: Additional folders or files might be associated with third-party libraries you use.