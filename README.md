## Step by step
1. Initialized a new Expo project
 ```
    npx create-expo-app@latest
    npm run web
```
2. Created index.tsx with React Native components.
  Defined egg timer buttons with custom images and timer logic using React hooks.
  Used useState, useRef, and useEffect to manage timer and cleanup.
  Added vibration when timer finishes.
  Styled the app using StyleSheet and responsive dimensions.

3. Configured Expo Project. Edited app.json to set app name, icon, splash screen, and Android/iOS settings.
  Added icons with transparent backgrounds for better visuals.

4. Built the app, created the account in https://expo.dev/
```
   npm install -g eas-cli
   eas login
   npx eas build -p android     //for creating AAB version
   eas build -p android --profile preview     //for creating APK version
```

## How to run
```
   npm install
   npm run web
```
