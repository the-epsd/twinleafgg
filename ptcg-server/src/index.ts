import CPUMonitor from './backend/services/cpu-monitor';

export * from './backend';
export * from './game';
export * from './utils/base64';

const monitor = new CPUMonitor({
  logToConsole: true,
  logToFile: true,
  threshold: 50, // Trigger detailed logging at 70% CPU usage
  logPath: 'logs/cpu-profile.log'
});

// Log every 3 minutes
monitor.start(180000);