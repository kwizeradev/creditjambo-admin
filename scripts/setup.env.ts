import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

const COLORS = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

// Check if we're on Windows to handle different shell behavior
const isWindows = os.platform() === 'win32';

const log = {
  info: (msg: string) => console.log(`${COLORS.yellow}ℹ${COLORS.reset} ${msg}`),
  success: (msg: string) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  error: (msg: string) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  header: (msg: string) => {
    console.log(`${COLORS.blue}═══════════════════════════════════════════${COLORS.reset}`);
    console.log(`${COLORS.blue}  ${msg}${COLORS.reset}`);
    console.log(`${COLORS.blue}═══════════════════════════════════════════${COLORS.reset}\n`);
  },
};

function checkDocker() {
  try {
    log.info('Checking Docker installation...');
    const dockerVersion = execSync('docker --version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    console.log(`   ${dockerVersion.trim()}`);
    
    log.info('Checking Docker daemon...');
    execSync('docker info', { stdio: ['pipe', 'ignore', 'pipe'] });
    log.success('Docker is installed and running');
  } catch (error) {
    log.error('Docker not installed or not running. Please start Docker Desktop.');
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

function checkDockerCompose() {
  try {
    log.info('Checking Docker Compose...');
    // Try newer docker compose command first, fallback to legacy
    try {
      const composeVersion = execSync('docker compose version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
      console.log(`   ${composeVersion.trim()}`);
    } catch {
      const composeVersion = execSync('docker-compose version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
      console.log(`   ${composeVersion.trim()}`);
    }
    log.success('Docker Compose is available');
  } catch (error) {
    log.error('Docker Compose is missing.');
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

function checkBackend() {
  log.info('Checking if backend is running...');
  try {
    execSync('curl -s http://localhost:4000/api/health', { stdio: 'ignore' });
    log.success('Backend is running at http://localhost:4000');
  } catch (error) {
    log.error('Backend is not running at http://localhost:4000');
    console.log('');
    console.log('Please start the backend first:');
    console.log('  cd ../creditjambo-client');
    console.log('  npm run setup');
    console.log('');
    process.exit(1);
  }
}

function setupEnvFile() {
  const envPath = path.resolve('.env');
  const dockerEnv = path.resolve('.env.docker');
  if (!fs.existsSync(envPath)) {
    log.info('Creating .env from .env.docker...');
    fs.copyFileSync(dockerEnv, envPath);
    log.success('.env created');
  } else {
    log.info('.env already exists');
  }
}

function buildServices() {
  log.info('Building Docker image...');
  try {
    execSync('docker compose build --no-cache', { stdio: 'inherit' });
    log.success('Docker image built successfully');
  } catch (error) {
    log.error('Failed to build Docker image');
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

function startServices() {
  log.info('Starting admin frontend...');
  try {
    execSync('docker compose up -d', { stdio: 'inherit' });
    log.success('Admin frontend started');
  } catch (error) {
    log.error('Failed to start admin frontend');
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

function waitForService() {
  log.info('Waiting for admin frontend to be ready...');
  
  const maxAttempts = 30;
  let attempt = 0;
  
  while (attempt < maxAttempts) {
    try {
      execSync('curl -s http://localhost:5174', { stdio: 'ignore' });
      log.success('Admin frontend is ready');
      return;
    } catch (error) {
      // Service not ready yet
    }
    attempt++;
    // Sleep for 1 second
    const waitTill = new Date(new Date().getTime() + 1000);
    while (waitTill > new Date()) {}
  }
  
  log.error('Admin frontend did not become ready in time');
  process.exit(1);
}

function showStatus() {
  console.log('');
  log.header('Service Status');
  try {
    const status = execSync('docker compose ps', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    console.log(status);
  } catch (error) {
    log.error('Failed to get service status');
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    }
  }
}

function showCredentials() {
  console.log('');
  log.header('Access Information');
  console.log('');
  console.log(`${COLORS.green}Admin Dashboard:${COLORS.reset}  http://localhost:5174`);
  console.log(`${COLORS.green}Backend API:${COLORS.reset}      http://localhost:4000`);
  console.log('');
  console.log(`${COLORS.yellow}Admin Credentials:${COLORS.reset}`);
  console.log('  Email:    admin@creditjambo.com');
  console.log('  Password: Admin123!');
  console.log('');
}

function showNextSteps() {
  console.log('');
  log.header('Next Steps');
  console.log('');
  console.log('1. Open http://localhost:5174 in your browser');
  console.log('2. Login with admin credentials above');
  console.log('3. Verify customer devices and manage accounts');
  console.log('');
  console.log('Useful commands:');
  console.log('  npm run logs      - View logs');
  console.log('  npm run teardown  - Stop service');
  console.log('  npm run docker:restart - Restart service');
  console.log('');
}

function main() {
  try {
    log.header('Credit Jambo Admin - TypeScript Setup');
    
    console.log(`Platform: ${os.platform()} ${os.arch()}`);
    console.log(`Node.js: ${process.version}\n`);
    
    checkDocker();
    checkDockerCompose();
    checkBackend();
    
    console.log('');
    setupEnvFile();
    
    console.log('');
    buildServices();
    
    console.log('');
    startServices();
    
    console.log('');
    waitForService();
    
    showStatus();
    showCredentials();
    showNextSteps();
    
    log.success('Setup completed successfully!');
  } catch (error) {
    log.error('Setup failed');
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
    }
    process.exit(1);
  }
}

// Ensure we handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log.error('Uncaught exception occurred');
  console.error(error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled promise rejection');
  console.error('At:', promise, 'reason:', reason);
  process.exit(1);
});

main();