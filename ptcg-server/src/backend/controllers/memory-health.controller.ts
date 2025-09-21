import { Request, Response } from 'express';
import { MemoryOptimizationService } from '../services/memory-optimization.service';
import { MemoryMonitorService } from '../services/memory-monitor.service';
import { logger, LogLevel } from '../../utils/logger';
import { Controller, Get, Post } from './controller';

export class MemoryHealthController extends Controller {

  private memoryOptimization: MemoryOptimizationService;
  private memoryMonitor: MemoryMonitorService;

  constructor(path: string, app: any, db: any, core: any) {
    super(path, app, db, core);
    this.memoryOptimization = MemoryOptimizationService.getInstance();
    this.memoryMonitor = MemoryMonitorService.getInstance();
  }

  /**
   * Get current memory health status
   */
  @Get('/health')
  public async getMemoryHealth(req: Request, res: Response): Promise<void> {
    try {
      const memoryStats = this.memoryOptimization.getMemoryStats();
      const optimizationStatus = this.memoryOptimization.getStatus();

      const response = {
        status: 'success',
        data: {
          current: memoryStats.current,
          health: memoryStats.health,
          trend: memoryStats.trend,
          optimization: {
            isRunning: optimizationStatus.isRunning,
            lastOptimization: optimizationStatus.lastOptimization
          },
          timestamp: Date.now()
        }
      };

      res.json(response);

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'memory-health',
        message: 'Error getting memory health status',
        error: error as Error
      });

      res.status(500).json({
        status: 'error',
        message: 'Failed to get memory health status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get memory history and trends
   */
  @Get('/history')
  public async getMemoryHistory(req: Request, res: Response): Promise<void> {
    try {
      const memoryStats = this.memoryOptimization.getMemoryStats();
      const history = memoryStats.history;

      const response = {
        status: 'success',
        data: {
          history: history.map(stat => ({
            timestamp: stat.timestamp,
            heapUsedMb: stat.heapUsedMb,
            rssMb: stat.rssMb,
            externalMb: stat.externalMb
          })),
          trend: memoryStats.trend,
          count: history.length
        }
      };

      res.json(response);

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'memory-health',
        message: 'Error getting memory history',
        error: error as Error
      });

      res.status(500).json({
        status: 'error',
        message: 'Failed to get memory history',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Force memory optimization
   */
  @Post('/optimize')
  public async forceOptimization(req: Request, res: Response): Promise<void> {
    try {
      await this.memoryOptimization.performOptimization();

      const response = {
        status: 'success',
        message: 'Memory optimization completed',
        data: {
          timestamp: Date.now()
        }
      };

      res.json(response);

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'memory-health',
        message: 'Error during forced memory optimization',
        error: error as Error
      });

      res.status(500).json({
        status: 'error',
        message: 'Failed to perform memory optimization',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Force garbage collection
   */
  @Post('/gc')
  public async forceGarbageCollection(req: Request, res: Response): Promise<void> {
    try {
      const memoryFreed = this.memoryMonitor.forceGarbageCollection();

      const response = {
        status: 'success',
        message: 'Garbage collection completed',
        data: {
          memoryFreedMb: Math.round(memoryFreed / (1024 * 1024)),
          timestamp: Date.now()
        }
      };

      res.json(response);

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'memory-health',
        message: 'Error during forced garbage collection',
        error: error as Error
      });

      res.status(500).json({
        status: 'error',
        message: 'Failed to perform garbage collection',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Update memory optimization configuration
   */
  @Post('/config')
  public async updateConfig(req: Request, res: Response): Promise<void> {
    try {
      const { config } = req.body;

      if (!config || typeof config !== 'object') {
        res.status(400).json({
          status: 'error',
          message: 'Invalid configuration provided'
        });
        return;
      }

      this.memoryOptimization.updateConfig(config);

      const response = {
        status: 'success',
        message: 'Memory optimization configuration updated',
        data: {
          config: this.memoryOptimization.getStatus().config,
          timestamp: Date.now()
        }
      };

      res.json(response);

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'memory-health',
        message: 'Error updating memory optimization configuration',
        error: error as Error
      });

      res.status(500).json({
        status: 'error',
        message: 'Failed to update configuration',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get memory optimization status
   */
  @Get('/status')
  public async getOptimizationStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = this.memoryOptimization.getStatus();

      const response = {
        status: 'success',
        data: status
      };

      res.json(response);

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'memory-health',
        message: 'Error getting optimization status',
        error: error as Error
      });

      res.status(500).json({
        status: 'error',
        message: 'Failed to get optimization status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
