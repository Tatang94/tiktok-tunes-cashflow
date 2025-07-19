import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Build the client
console.log('Building client...');
execSync('vite build', { stdio: 'inherit' });

console.log('Build complete! Frontend built to ./dist');