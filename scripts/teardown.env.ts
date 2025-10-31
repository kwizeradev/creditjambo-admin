import { execSync } from 'child_process';
import os from 'os';

const COLORS = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

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

function stopService() {
  log.info('Stopping admin frontend...');
  try {
    execSync('docker compose down', { stdio: 'inherit' });
    log.success('Admin frontend stopped');
  } catch (error) {
    log.error('Failed to stop admin frontend');
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

function removeImage(removeAll: boolean) {
  if (removeAll) {
    log.info('Removing Docker images...');
    try {
      execSync('docker compose down --rmi all', { stdio: 'inherit' });
      log.success('Images removed');
    } catch (error) {
      log.error('Failed to remove Docker images');
      if (error instanceof Error) {
        console.error(`   Error: ${error.message}`);
      }
      process.exit(1);
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const removeAll = args.includes('--all');
  const removeImageFlag = args.includes('--image');
  
  log.header('Credit Jambo Admin - Teardown');
  
  if (removeAll) {
    log.info('Performing complete cleanup...');
    try {
      execSync('docker compose down --rmi all', { stdio: 'inherit' });
      log.success('Complete cleanup done');
    } catch (error) {
      log.error('Failed to perform complete cleanup');
      if (error instanceof Error) {
        console.error(`   Error: ${error.message}`);
      }
      process.exit(1);
    }
  } else {
    stopService();
    removeImage(removeImageFlag);
  }
  
  console.log('');
  log.success('Teardown completed');
  console.log('');
  console.log('Options:');
  console.log('  npm run teardown           Stop service only');
  console.log('  npm run teardown -- --image   Stop and remove Docker image');
  console.log('  npm run teardown -- --all     Complete cleanup');
  console.log('');
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