#!/usr/bin/env node

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
  const logMessage = `[${timestamp}] ${message}
`;
  console.log(logMessage.trim());
  fs.appendFileSync(LOG_FILE, logMessage);
}

function checkMemoryHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${SERVER_URL}/v1/memory/health`, (res) => {
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
    const req = http.get(`${SERVER_URL}/v1/memory/optimize`, (res) => {
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

    log(`Memory usage: ${memoryUsage}MB, Healthy: ${isHealthy}`);

    if (!isHealthy && memoryUsage > 600) {
      log('Memory usage critical, forcing optimization...');
      try {
        await forceOptimization();
        log('Optimization completed');
      } catch (error) {
        log(`Optimization failed: ${error.message}`);
      }
    }
  } catch (error) {
    log(`Monitor error: ${error.message}`);
  }
}

// Run monitoring every 30 seconds
setInterval(monitor, 30000);

// Initial check
monitor();

log('Memory monitor started');
