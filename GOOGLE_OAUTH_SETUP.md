# Setting Up Google OAuth for YourGoalApp

This guide will help you set up Google OAuth for the YourGoalApp to enable Google Drive sync functionality.

## Prerequisites

1. A Google account
2. Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click on "New Project"
4. Enter a name for your project (e.g., "YourGoalApp")
5. Click "Create"

## Step 2: Enable the Google Drive API

1. Select your newly created project
2. Go to "APIs & Services" > "Library"
3. Search for "Google Drive API"
4. Click on "Google Drive API"
5. Click "Enable"

## Step 3: Configure the OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (unless you have a Google Workspace account)
3. Click "Create"
4. Fill in the required information:
   - App name: "YourGoalApp"
   - User support email: Your email address
   - Developer contact information: Your email address
5. Click "Save and Continue"
6. Add the following scopes:
   - `https://www.googleapis.com/auth/drive.file`
7. Click "Save and Continue"
8. Add test users if you're in testing mode
9. Click "Save and Continue"
10. Review your settings and click "Back to Dashboard"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Name: "YourGoalApp Web Client"
5. Add authorized JavaScript origins:
   - For development: `http://localhost:3000`
   - For production: Your actual domain (e.g., `https://yourgoalapp.com`)
6. Click "Create"
7. Note down the Client ID and Client Secret

## Step 5: Update the Application Code

1. Open the file `lib/google-utils.ts`
2. Replace the placeholder values with your actual credentials:
   \`\`\`typescript
   const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your actual client ID
   const API_KEY = "YOUR_GOOGLE_API_KEY"; // Replace with your actual API key
   \`\`\`

## Step 6: Testing

1. Run your application
2. Go to the Settings page or the Backup tab in a goal detail page
3. Click "Sign in with Google"
4. You should be prompted to sign in and grant permissions
5. After signing in, you should be able to sync your goals to Google Drive

## Troubleshooting

### "The OAuth client was not found" Error

This error typically occurs when:
1. The Client ID is incorrect
2. The domain you're accessing the app from is not listed in the authorized JavaScript origins
3. The OAuth consent screen is not properly configured

### "Error 401: invalid_client" Error

This error occurs when:
1. The Client ID is incorrect
2. The OAuth client is not properly configured
3. The Google Cloud project is not properly set up

### Other Issues

If you encounter other issues:
1. Check the browser console for specific error messages
2. Verify that the Google Drive API is enabled
3. Ensure that the OAuth consent screen is properly configured
4. Confirm that the authorized JavaScript origins include the domain you're accessing the app from
\`\`\`

These updates will help users understand and resolve the "OAuth client was not found" error. The key changes include:

1. Better error handling in the Google utils library
2. Clear error messages in the UI explaining what went wrong
3. A comprehensive guide on how to set up Google OAuth properly
4. Checks to ensure the credentials are configured before attempting authentication

With these changes, users will have a much better experience when setting up Google Drive sync.
