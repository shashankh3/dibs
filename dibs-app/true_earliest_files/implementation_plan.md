# Integrate Firebase backend to DIBS App

The goal is to transition the DIBS app from mock data to a live Firebase backend, specifically by configuring Firebase, installing dependencies, and modifying `AddItem.js` and `ChatBox.js` to use Firestore. `ThemeContext.js`, `App.js`, and `ScrapRoute.js` already implement the requested global Light/Dark mode.

## Proposed Changes

### Configuration
#### [NEW] [firebaseConfig.js](file:///d:/dibs/dibs-app/firebaseConfig.js)
Create the Firebase initialization file with placeholder credentials, exporting the initialized `db` instance.

### Components
#### [MODIFY] [AddItem.js](file:///d:/dibs/dibs-app/components/AddItem.js)
- Import Firestore functions (`collection`, `addDoc`, `serverTimestamp`) and `db`.
- Add a `loading` state using `useState`.
- Update `handleSubmit` to push `title`, `price`, `address`, and `pincode` to a Firestore collection named `items`, wrapping the logic in a try-catch to toggle the loading state.
- Add an `ActivityIndicator` to the submit button while writing to the DB.

#### [MODIFY] [ChatBox.js](file:///d:/dibs/dibs-app/components/ChatBox.js)
- Import Firestore functions (`collection`, `addDoc`, `query`, `orderBy`, `onSnapshot`, `serverTimestamp`) and `db`.
- Implement a `useEffect` hook to listen to the `messages` collection in real-time, order by creation time, and set local state.
- Update `sendMessage` to `addDoc` to the Firestore collection instead of appending to local state array.

### Commands to Run
- `npx expo install firebase`

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
- Start the app using `npx expo start` and verify that the app does not crash.
- Submit a new item in the Add Item tab and verify the loading indicator appears and successfully adds the document (mocking/verifying Firestore behavior might require placing actual API keys first).
- Send a message in the Chat tab and verify that the `messages` collection snapshot works.
