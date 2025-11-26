# Instructions to run the app in the ios emulator on macOS:

1. Clone the repository to your local machine.
2. Install Node JS LTS version, Xcode and Xcode Command Line Tools
3. Go to `mobile` folder (`cd <project_dir>/mobile`).
4. Install dependencies by running `npm install`.
5. Prepare prebuild `npx expo prebuild --clean`
6. Run the project in dev mode by running `npx expo run:ios`.
7. Log-in to the app using test account user = `pololanikp@gmail.com`, password = `traktor`.

# App Build and TestFlight Deployment

1. Checkout the branch you would like to build.
2. Go to `mobile` folder (`cd <project_dir>/mobile`).
3. Run `eas build --platform=ios` to start the Expo build. You can see the running build and its result in Expo: `https://expo.dev/accounts/kulturni-lenochodi/projects/mobile/builds`. Alternatively, you can run the build from Expo GUI by using button `Build from GitHub`.
4. Publish build to TestFlight by running `eas submit --platform=ios`. This can only be done from command line and you need to have Apple dev account credentials (registered to Katka at the moment).
5. TestFlight builds can be checked in App Store Connect `https://appstoreconnect.apple.com/teams/fb266649-098d-4d89-8b98-c7eeea58e6c1/apps/6743340624/testflight/ios`. Publish to TestFlight might take some time.

# Supabase deploy

`npx supabase functions deploy` - Deploy / Update edge functions
