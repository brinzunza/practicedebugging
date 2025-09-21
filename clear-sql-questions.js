#!/usr/bin/env node

// Script to clear localStorage for the PracticeDebugging app
// This will remove any cached SQL questions

console.log('Clearing localStorage to remove cached SQL questions...');

// Since this is a Node.js script and localStorage is browser-specific,
// we'll provide instructions for manual clearing

console.log(`
To remove any cached SQL questions from your browser:

Option 1 - Use the App UI:
1. Go to http://localhost:5174 (or your dev server URL)
2. Navigate to the Statistics page
3. Click "Reseed Questions" button
4. Confirm the action

Option 2 - Manual Browser Clearing:
1. Open your browser's Developer Tools (F12)
2. Go to the Application/Storage tab
3. Find "Local Storage" for your app domain
4. Delete these keys:
   - debug_practice_questions
   - debug_practice_progress
   - debug_practice_stats
5. Refresh the page

Option 3 - Quick localStorage clear:
Open browser console and run:
localStorage.clear();
location.reload();

The app will automatically reseed with the updated question set (without SQL questions).
`);