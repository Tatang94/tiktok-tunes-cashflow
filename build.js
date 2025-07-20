import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Build the client
console.log('Building client...');
execSync('vite build', { stdio: 'inherit' });

// Move files from dist/public to dist for Vercel compatibility
console.log('Restructuring for Vercel deployment...');
if (fs.existsSync('./dist/public')) {
  // Copy all files from dist/public to dist/
  execSync('cp -r ./dist/public/* ./dist/', { stdio: 'inherit' });
  
  // Remove the public folder
  execSync('rm -rf ./dist/public', { stdio: 'inherit' });
  
  console.log('Files moved from dist/public to dist/');
}

console.log('Build complete! Frontend built to ./dist');