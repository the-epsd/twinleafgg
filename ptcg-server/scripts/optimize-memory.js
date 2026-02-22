#!/usr/bin/env node

/**
 * Memory Optimization Script for PTCG Elite Server
 * 
 * This script helps optimize memory usage by:
 * 1. Adjusting memory thresholds
 * 2. Enabling garbage collection
 * 3. Configuring cleanup intervals
 * 4. Setting up monitoring
 */

const fs = require('fs');
const path = require('path');

// Configuration updates
const memoryOptimizations = {
  // Update package.json to ensure --expose-gc flag
  packageJson: {
    scripts: {
      start: "node --expose-gc --max-old-space-size=2048 start.js",
      "start:prod": "node --expose-gc --max-old-space-size=2048 start.js"
    }
  },

  // Environment variables for memory optimization
  envVars: {
    NODE_OPTIONS: "--expose-gc --max-old-space-size=2048",
    NODE_ENV: "production",
    UV_THREADPOOL_SIZE: "16"
  },

  // Memory monitoring configuration
  memoryConfig: {
    cleanupIntervalMs: 300000, // 5 minutes
    memoryCleanupThresholdMb: 700,
    maxSessionAge: 6 * 60 * 60 * 1000, // 6 hours
    enableStateCompression: true,
    maxStateSize: 1024 * 1024 // 1MB
  }
};

console.log('🚀 PTCG Elite Memory Optimization Script');
console.log('=====================================\n');

// Function to update package.json
function updatePackageJson() {
  const packagePath = path.join(__dirname, '..', 'package.json');

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    // Update scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      ...memoryOptimizations.packageJson.scripts
    };

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json with memory optimization flags');
  } catch (error) {
    console.error('❌ Error updating package.json:', error.message);
  }
}

// Function to create .env file with memory optimizations
function createEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  const envContent = Object.entries(memoryOptimizations.envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n') + '\n';

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with memory optimization variables');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }
}

// Function to create memory monitoring configuration
function createMemoryConfig() {
  const configPath = path.join(__dirname, '..', 'src', 'config', 'memory.config.ts');
  const configContent = `export const memoryConfig = ${JSON.stringify(memoryOptimizations.memoryConfig, null, 2)};
`;

  try {
    // Ensure config directory exists
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(configPath, configContent);
    console.log('✅ Created memory configuration file');
  } catch (error) {
    console.error('❌ Error creating memory config:', error.message);
  }
}

// Function to create systemd service file for production
function createSystemdService() {
  const servicePath = path.join(__dirname, '..', 'ptcg-elite.service');
  const serviceContent = `[Unit]
Description=PTCG Elite Server
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=${path.join(__dirname, '..')}
ExecStart=/usr/bin/node --expose-gc --max-old-space-size=2048 start.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=NODE_OPTIONS=--expose-gc --max-old-space-size=2048
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=ptcg-elite

# Memory limits
MemoryLimit=2G
MemoryAccounting=true

[Install]
WantedBy=multi-user.target
`;

  try {
    fs.writeFileSync(servicePath, serviceContent);
    console.log('✅ Created systemd service file for production deployment');
  } catch (error) {
    console.error('❌ Error creating systemd service:', error.message);
  }
}

// Function to create Docker optimization
function createDockerOptimization() {
  const dockerfilePath = path.join(__dirname, '..', 'Dockerfile.memory-optimized');
  const dockerfileContent = `FROM node:18-alpine

# Set memory optimization environment variables
ENV NODE_OPTIONS="--expose-gc --max-old-space-size=2048"
ENV NODE_ENV=production
ENV UV_THREADPOOL_SIZE=16

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Build the application
RUN npm run build:prod

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Expose port
EXPOSE 8080

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application with memory optimizations
CMD ["node", "--expose-gc", "--max-old-space-size=2048", "start.js"]
`;

  try {
    fs.writeFileSync(dockerfilePath, dockerfileContent);
    console.log('✅ Created memory-optimized Dockerfile');
  } catch (error) {
    console.error('❌ Error creating Dockerfile:', error.message);
  }
}

// Function to create monitoring script
function createMonitoringScript() {
  const monitorPath = path.join(__dirname, '..', 'scripts', 'monitor-memory.js');
  const monitorContent = `#!/usr/bin/env node

/**
 * Memory Monitoring Script
 * Monitors memory usage and triggers optimizations when needed
 */

const http = require('http');
const fs = require('fs');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8080';
const LOG_FILE = process.env.LOG_FILE || './memory-monitor.log';

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = \`[\${timestamp}] \${message}\n\`;
  console.log(logMessage.trim());
  fs.appendFileSync(LOG_FILE, logMessage);
}

function checkMemoryHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get(\`\${SERVER_URL}/v1/memory/health\`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function forceOptimization() {
  return new Promise((resolve, reject) => {
    const req = http.get(\`\${SERVER_URL}/v1/memory/optimize\`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function monitor() {
  try {
    const health = await checkMemoryHealth();
    const memoryUsage = health.data.current.heapUsedMb;
    const isHealthy = health.data.health.isHealthy;

    log(\`Memory usage: \${memoryUsage}MB, Healthy: \${isHealthy}\`);

    if (!isHealthy && memoryUsage > 600) {
      log('Memory usage critical, forcing optimization...');
      try {
        await forceOptimization();
        log('Optimization completed');
      } catch (error) {
        log(\`Optimization failed: \${error.message}\`);
      }
    }
  } catch (error) {
    log(\`Monitor error: \${error.message}\`);
  }
}

// Run monitoring every 30 seconds
setInterval(monitor, 30000);

// Initial check
monitor();

log('Memory monitor started');
`;

  try {
    // Ensure scripts directory exists
    const scriptsDir = path.dirname(monitorPath);
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }

    fs.writeFileSync(monitorPath, monitorContent);
    fs.chmodSync(monitorPath, '755'); // Make executable
    console.log('✅ Created memory monitoring script');
  } catch (error) {
    console.error('❌ Error creating monitoring script:', error.message);
  }
}

// Main execution
async function main() {
  console.log('Starting memory optimization...\n');

  updatePackageJson();
  createEnvFile();
  createMemoryConfig();
  createSystemdService();
  createDockerOptimization();
  createMonitoringScript();

  console.log('\n🎉 Memory optimization completed!');
  console.log('\nNext steps:');
  console.log('1. Restart your server with: npm run start');
  console.log('2. Monitor memory usage with: node scripts/monitor-memory.js');
  console.log('3. Check memory health at: http://localhost:8080/v1/memory/health');
  console.log('\nFor production deployment:');
  console.log('1. Use the generated systemd service file');
  console.log('2. Use the memory-optimized Dockerfile');
  console.log('3. Set up monitoring with the monitoring script');
}

main().catch(console.error);
