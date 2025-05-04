
# Firebase Integration for Furniture Quote App

This document outlines the steps to deploy and configure Firebase for the Furniture Quote application.

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "Furniture Quote")
4. Follow the setup wizard (enable Google Analytics if desired)

### 2. Configure Web App

1. In the Firebase console, click the web icon (</>) to add a web app
2. Register the app with a nickname (e.g., "Furniture Quote Web")
3. Copy the Firebase configuration object
4. Replace the placeholder configuration in `src/lib/firebase.ts` with your actual Firebase config

### 3. Set Up Authentication

1. In Firebase Console, go to Authentication → Get Started
2. Enable Email/Password sign-in method
3. Create an admin user:
   - Go to Authentication → Users → Add User
   - Enter email and password for admin

### 4. Configure Firestore Database

1. In Firebase Console, go to Firestore Database → Create database
2. Start in production mode
3. Choose a location closest to your users
4. Create an admin document:
   - Go to Firestore Database
   - Create a collection called "admins"
   - Add a document with the ID matching the UID of your admin user (from Authentication)
   - Add a field `isAdmin: true`

### 5. Set Up Storage

1. In Firebase Console, go to Storage → Get Started
2. Follow setup steps, choosing a location closest to your users

### 6. Deploy Security Rules

#### Firestore Rules

1. In Firebase Console, go to Firestore Database → Rules
2. Copy and paste the rules from `firestore.rules`
3. Click Publish

#### Storage Rules

1. In Firebase Console, go to Storage → Rules
2. Copy and paste the rules from `storage.rules`
3. Click Publish

## Data Migration

When a user logs in for the first time, the app will automatically attempt to migrate their local database to Firestore. The migration process includes:

1. Creating a user document in Firestore
2. Storing categories from localStorage to Firestore
3. Storing current quote from localStorage to Firestore

## Administrator Access

To grant administrator access to a user:

1. Get the user's UID from Firebase Authentication console
2. Create a document in the "admins" collection with the document ID matching the user's UID
3. Add a field `isAdmin: true` to the document

## Security Considerations

- Firebase Rules are configured to restrict access based on authentication status and ownership
- Only authenticated users can access their own data
- Admin users have access to all user data
- Storage is configured to only allow image uploads up to 5MB per file

## Troubleshooting

If you encounter issues:

1. Verify Firebase configuration in `src/lib/firebase.ts` matches your Firebase project
2. Ensure Firestore and Storage rules are published
3. Check Firebase Authentication is properly set up with Email/Password provider
4. Verify admin user's UID is correctly added to the "admins" collection
