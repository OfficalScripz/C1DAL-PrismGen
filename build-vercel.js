#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building for Vercel deployment...');

// Build frontend
console.log('Building frontend...');
execSync('npm run build:frontend', { stdio: 'inherit' });

// Copy server files for Vercel
console.log('Preparing server files...');
const serverDir = path.join(__dirname, 'server');
const apiDir = path.join(__dirname, 'api');

// Ensure api directory exists
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// Copy server files to api directory for Vercel
execSync(`cp -r ${serverDir}/* ${apiDir}/`, { stdio: 'inherit' });

// Create Vercel-compatible entry point
const entryPoint = `
import express from 'express';
import cors from 'cors';
import { registerRoutes } from './routes';

const app = express();
app.use(cors());
app.use(express.json());

registerRoutes(app);

export default app;
`;

fs.writeFileSync(path.join(apiDir, 'index.ts'), entryPoint);

console.log('Vercel build complete!');