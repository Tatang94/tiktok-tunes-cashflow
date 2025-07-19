import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Build the client
console.log('Building client...');
execSync('vite build', { stdio: 'inherit' });

// Ensure the api directory exists and copy files
console.log('Setting up API...');
if (!fs.existsSync('api')) {
  fs.mkdirSync('api');
}

// Copy necessary files for deployment
const filesToCopy = [
  'server/routes.ts',
  'server/storage.ts', 
  'shared/schema.ts'
];

filesToCopy.forEach(file => {
  const srcPath = file;
  const destPath = path.join('api', path.basename(file));
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcPath} to ${destPath}`);
  }
});

console.log('Build complete!');