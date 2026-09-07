import * as fs from 'fs';
import * as pathModule from 'path';
import * as multer from 'multer';
import { Request, Response } from 'express';
import { Application } from 'express';
import { AuthToken, Validate, check, requireAdmin, validateToken } from '../services';
import {
  findSeasonWithRewards,
  serializeRewards,
  serializeSeasonSummary,
} from '../services/battle-pass-helpers';
import { Controller, Delete, Get, Post, Put } from './controller';
import {
  AvatarCatalog,
  BattlePassReward,
  BattlePassRewardType,
  BattlePassSeason,
  Sleeve,
  Storage,
} from '../../storage';
import { ApiErrorEnum } from '../common/errors';
import { Core } from '../../game/core/core';
import { config } from '../../config';

const ALLOWED_REWARD_TYPES: BattlePassRewardType[] = [
  'avatar', 'sleeve', 'playmat', 'deck_box', 'card_art'
];

const ALLOWED_STATUSES = ['draft', 'published', 'archived'] as const;

function sanitizeUploadName(original: string): string {
  const base = pathModule.basename(original).replace(/[^a-zA-Z0-9._-]/g, '_');
  const ext = pathModule.extname(base).toLowerCase();
  const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
  const safeExt = allowed.includes(ext) ? ext : '.png';
  const stem = pathModule.basename(base, ext).slice(0, 64) || 'upload';
  return `${stem}-${Date.now()}${safeExt}`;
}

function parseAuthUserId(req: Request): number {
  return validateToken(req.header('Auth-Token') || '');
}

function createImageUpload(destinationDir: string, maxBytes: number) {
  return multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        fs.mkdirSync(destinationDir, { recursive: true });
        cb(null, destinationDir);
      },
      filename: (_req, file, cb) => cb(null, sanitizeUploadName(file.originalname)),
    }),
    limits: { fileSize: maxBytes },
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        cb(new Error('Only image uploads are allowed'));
        return;
      }
      cb(null, true);
    },
  });
}

export class AdminBattlePass extends Controller {

  constructor(path: string, app: Application, db: Storage, core: Core) {
    super(path, app, db, core);
  }

  @Get('/seasons')
  @AuthToken()
  public async onListSeasons(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const seasons = await BattlePassSeason.find({ order: { startDate: 'DESC' } });
      const payload = await Promise.all(seasons.map(async season => {
        const rewardCount = await BattlePassReward.count({ where: { seasonId: season.seasonId } });
        return serializeSeasonSummary(season, rewardCount);
      }));
      res.send({ ok: true, seasons: payload });
    } catch (error) {
      console.error('Admin list seasons error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Post('/seasons')
  @AuthToken()
  @Validate({
    seasonId: check().isString().minLength(1).maxLength(64),
    name: check().isString().minLength(1).maxLength(128),
    startDate: check().isString(),
    endDate: check().optional(),
    status: check().optional().isString(),
    baseXpPerLevel: check().optional().isNumber(),
    xpIncreasePerLevel: check().optional().isNumber(),
    maxLevel: check().optional().isNumber(),
  })
  public async onCreateSeason(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const body = req.body;
      const existing = await BattlePassSeason.findOne({ where: { seasonId: body.seasonId } });
      if (existing) {
        res.status(400).send({ error: 'Season ID already exists' });
        return;
      }
      const season = new BattlePassSeason();
      season.seasonId = String(body.seasonId).trim();
      season.name = String(body.name).trim();
      season.startDate = body.startDate;
      season.endDate = body.endDate || null;
      season.status = ALLOWED_STATUSES.includes(body.status) ? body.status : 'draft';
      season.baseXpPerLevel = body.baseXpPerLevel ?? 1000;
      season.xpIncreasePerLevel = body.xpIncreasePerLevel ?? 0;
      season.maxLevel = body.maxLevel ?? 100;
      await season.save();
      res.send({ ok: true, season: serializeSeasonSummary(season, 0) });
    } catch (error) {
      console.error('Admin create season error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Put('/seasons/:seasonId')
  @AuthToken()
  public async onUpdateSeason(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const season = await BattlePassSeason.findOne({ where: { seasonId: req.params.seasonId } });
      if (!season) {
        res.status(404).send({ error: 'Season not found' });
        return;
      }
      const body = req.body;
      if (body.name != null) {
        season.name = String(body.name).trim();
      }
      if (body.startDate != null) {
        season.startDate = body.startDate;
      }
      if (body.endDate !== undefined) {
        season.endDate = body.endDate || null;
      }
      if (body.status != null && ALLOWED_STATUSES.includes(body.status)) {
        season.status = body.status;
      }
      if (body.baseXpPerLevel != null) {
        season.baseXpPerLevel = Number(body.baseXpPerLevel);
      }
      if (body.xpIncreasePerLevel != null) {
        season.xpIncreasePerLevel = Number(body.xpIncreasePerLevel);
      }
      if (body.maxLevel != null) {
        season.maxLevel = Number(body.maxLevel);
      }
      await season.save();
      const rewardCount = await BattlePassReward.count({ where: { seasonId: season.seasonId } });
      res.send({ ok: true, season: serializeSeasonSummary(season, rewardCount) });
    } catch (error) {
      console.error('Admin update season error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Delete('/seasons/:seasonId')
  @AuthToken()
  public async onDeleteSeason(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const season = await BattlePassSeason.findOne({ where: { seasonId: req.params.seasonId } });
      if (!season) {
        res.status(404).send({ error: 'Season not found' });
        return;
      }
      if (season.status !== 'draft') {
        season.status = 'archived';
        await season.save();
        res.send({ ok: true, archived: true, season: serializeSeasonSummary(season) });
        return;
      }
      await BattlePassReward.delete({ seasonId: season.seasonId });
      await season.remove();
      res.send({ ok: true, deleted: true });
    } catch (error) {
      console.error('Admin delete season error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Get('/seasons/:seasonId/rewards')
  @AuthToken()
  public async onGetRewards(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const season = await findSeasonWithRewards(req.params.seasonId);
      if (!season) {
        res.status(404).send({ error: 'Season not found' });
        return;
      }
      res.send({
        ok: true,
        season: serializeSeasonSummary(season),
        rewards: await serializeRewards(season.rewards || []),
      });
    } catch (error) {
      console.error('Admin get rewards error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Put('/seasons/:seasonId/rewards')
  @AuthToken()
  public async onReplaceRewards(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const season = await BattlePassSeason.findOne({ where: { seasonId: req.params.seasonId } });
      if (!season) {
        res.status(404).send({ error: 'Season not found' });
        return;
      }
      const rewardsInput = Array.isArray(req.body.rewards) ? req.body.rewards : null;
      if (!rewardsInput) {
        res.status(400).send({ error: 'rewards array required' });
        return;
      }

      await BattlePassReward.delete({ seasonId: season.seasonId });
      const created: BattlePassReward[] = [];
      let sortOrder = 0;
      for (const entry of rewardsInput) {
        const rewardType = entry.type || entry.rewardType;
        if (!ALLOWED_REWARD_TYPES.includes(rewardType)) {
          continue;
        }
        const itemId = String(entry.item || entry.itemId || '').trim();
        if (!itemId) {
          continue;
        }
        const reward = new BattlePassReward();
        reward.seasonId = season.seasonId;
        reward.seasonInternalId = season.id;
        reward.level = Math.max(1, Number(entry.level) || 1);
        reward.rewardType = rewardType;
        reward.itemId = itemId;
        reward.name = String(entry.name || itemId).trim();
        reward.sortOrder = entry.sortOrder != null ? Number(entry.sortOrder) : sortOrder;
        sortOrder++;
        await reward.save();
        created.push(reward);
      }

      res.send({
        ok: true,
        rewards: await serializeRewards(created),
      });
    } catch (error) {
      console.error('Admin replace rewards error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }
}

export class AdminAvatars extends Controller {

  private upload = createImageUpload(
    config.backend.avatarsDir || pathModule.join(process.cwd(), 'avatars'),
    config.backend.avatarFileSize
  );

  constructor(path: string, app: Application, db: Storage, core: Core) {
    super(path, app, db, core);
  }

  public init(): void {
    super.init();
    this.app.post(
      `${this.path}/upload`,
      this.upload.single('image'),
      async (req: Request, res: Response) => {
        const tokenUserId = parseAuthUserId(req);
        if (!tokenUserId) {
          res.status(403).send({ error: ApiErrorEnum.AUTH_TOKEN_INVALID });
          return;
        }
        req.body = req.body || {};
        req.body.userId = tokenUserId;
        if (!(await requireAdmin(req, res))) {
          return;
        }
        if (!req.file) {
          res.status(400).send({ error: 'No image uploaded' });
          return;
        }
        res.send({ ok: true, fileName: req.file.filename });
      }
    );
  }

  @Get('/list')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const avatars = await AvatarCatalog.find({ order: { sortOrder: 'ASC', name: 'ASC' } });
      res.send({
        ok: true,
        avatars: avatars.map(a => ({
          id: a.id,
          identifier: a.identifier,
          name: a.name,
          fileName: a.fileName,
          isDefault: a.isDefault,
          sortOrder: a.sortOrder,
          imageUrl: config.backend.avatarsUrl.replace('{name}', a.fileName),
        })),
      });
    } catch (error) {
      console.error('Admin list avatars error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Post('/create')
  @AuthToken()
  @Validate({
    identifier: check().isString().minLength(1).maxLength(64),
    name: check().isString().minLength(1).maxLength(128),
    fileName: check().isString().minLength(1).maxLength(255),
    isDefault: check().optional(),
    sortOrder: check().optional().isNumber(),
  })
  public async onCreate(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const existing = await AvatarCatalog.findOne({ where: { identifier: req.body.identifier } });
      if (existing) {
        res.status(400).send({ error: 'Identifier already exists' });
        return;
      }
      const row = new AvatarCatalog();
      row.identifier = String(req.body.identifier).trim();
      row.name = String(req.body.name).trim();
      row.fileName = String(req.body.fileName).trim();
      row.isDefault = !!req.body.isDefault;
      row.sortOrder = req.body.sortOrder != null ? Number(req.body.sortOrder) : 0;
      await row.save();
      res.send({
        ok: true,
        avatar: {
          id: row.id,
          identifier: row.identifier,
          name: row.name,
          fileName: row.fileName,
          isDefault: row.isDefault,
          sortOrder: row.sortOrder,
          imageUrl: config.backend.avatarsUrl.replace('{name}', row.fileName),
        },
      });
    } catch (error) {
      console.error('Admin create avatar error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Put('/:id')
  @AuthToken()
  public async onUpdate(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const row = await AvatarCatalog.findOne(parseInt(req.params.id, 10));
      if (!row) {
        res.status(404).send({ error: 'Avatar not found' });
        return;
      }
      if (req.body.name != null) {
        row.name = String(req.body.name).trim();
      }
      if (req.body.fileName != null) {
        row.fileName = String(req.body.fileName).trim();
      }
      if (req.body.isDefault != null) {
        row.isDefault = !!req.body.isDefault;
      }
      if (req.body.sortOrder != null) {
        row.sortOrder = Number(req.body.sortOrder);
      }
      if (req.body.identifier != null && req.body.identifier !== row.identifier) {
        const clash = await AvatarCatalog.findOne({ where: { identifier: req.body.identifier } });
        if (clash) {
          res.status(400).send({ error: 'Identifier already exists' });
          return;
        }
        row.identifier = String(req.body.identifier).trim();
      }
      await row.save();
      res.send({
        ok: true,
        avatar: {
          id: row.id,
          identifier: row.identifier,
          name: row.name,
          fileName: row.fileName,
          isDefault: row.isDefault,
          sortOrder: row.sortOrder,
          imageUrl: config.backend.avatarsUrl.replace('{name}', row.fileName),
        },
      });
    } catch (error) {
      console.error('Admin update avatar error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Delete('/:id')
  @AuthToken()
  public async onDelete(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const row = await AvatarCatalog.findOne(parseInt(req.params.id, 10));
      if (!row) {
        res.status(404).send({ error: 'Avatar not found' });
        return;
      }
      await row.remove();
      res.send({ ok: true });
    } catch (error) {
      console.error('Admin delete avatar error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }
}

export class AdminSleeves extends Controller {

  private upload = createImageUpload(
    config.backend.sleevesDir || pathModule.join(process.cwd(), 'sleeves'),
    config.backend.avatarFileSize * 4
  );

  constructor(path: string, app: Application, db: Storage, core: Core) {
    super(path, app, db, core);
  }

  public init(): void {
    super.init();
    this.app.post(
      `${this.path}/upload`,
      this.upload.single('image'),
      async (req: Request, res: Response) => {
        const tokenUserId = parseAuthUserId(req);
        if (!tokenUserId) {
          res.status(403).send({ error: ApiErrorEnum.AUTH_TOKEN_INVALID });
          return;
        }
        req.body = req.body || {};
        req.body.userId = tokenUserId;
        if (!(await requireAdmin(req, res))) {
          return;
        }
        if (!req.file) {
          res.status(400).send({ error: 'No image uploaded' });
          return;
        }
        res.send({ ok: true, imagePath: req.file.filename });
      }
    );
  }

  @Get('/list')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const sleeves = await Sleeve.find({ order: { sortOrder: 'ASC', name: 'ASC' } });
      res.send({
        ok: true,
        sleeves: sleeves.map(s => ({
          id: s.id,
          identifier: s.identifier,
          name: s.name,
          imagePath: s.imagePath,
          isDefault: s.isDefault,
          requiresUnlock: s.requiresUnlock,
          sortOrder: s.sortOrder,
          imageUrl: config.backend.sleevesUrl.replace('{path}', s.imagePath),
        })),
      });
    } catch (error) {
      console.error('Admin list sleeves error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Post('/create')
  @AuthToken()
  @Validate({
    identifier: check().isString().minLength(1).maxLength(64),
    name: check().isString().minLength(1).maxLength(128),
    imagePath: check().isString().minLength(1).maxLength(255),
    isDefault: check().optional(),
    requiresUnlock: check().optional(),
    sortOrder: check().optional().isNumber(),
  })
  public async onCreate(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const existing = await Sleeve.findOne({ where: { identifier: req.body.identifier } });
      if (existing) {
        res.status(400).send({ error: 'Identifier already exists' });
        return;
      }
      const row = new Sleeve();
      row.identifier = String(req.body.identifier).trim();
      row.name = String(req.body.name).trim();
      row.imagePath = String(req.body.imagePath).trim();
      row.isDefault = !!req.body.isDefault;
      row.requiresUnlock = req.body.requiresUnlock != null ? !!req.body.requiresUnlock : !row.isDefault;
      row.sortOrder = req.body.sortOrder != null ? Number(req.body.sortOrder) : 0;
      await row.save();
      res.send({
        ok: true,
        sleeve: {
          id: row.id,
          identifier: row.identifier,
          name: row.name,
          imagePath: row.imagePath,
          isDefault: row.isDefault,
          requiresUnlock: row.requiresUnlock,
          sortOrder: row.sortOrder,
          imageUrl: config.backend.sleevesUrl.replace('{path}', row.imagePath),
        },
      });
    } catch (error) {
      console.error('Admin create sleeve error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Put('/:id')
  @AuthToken()
  public async onUpdate(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const row = await Sleeve.findOne(parseInt(req.params.id, 10));
      if (!row) {
        res.status(404).send({ error: 'Sleeve not found' });
        return;
      }
      if (req.body.name != null) {
        row.name = String(req.body.name).trim();
      }
      if (req.body.imagePath != null) {
        row.imagePath = String(req.body.imagePath).trim();
      }
      if (req.body.isDefault != null) {
        row.isDefault = !!req.body.isDefault;
      }
      if (req.body.requiresUnlock != null) {
        row.requiresUnlock = !!req.body.requiresUnlock;
      }
      if (req.body.sortOrder != null) {
        row.sortOrder = Number(req.body.sortOrder);
      }
      if (req.body.identifier != null && req.body.identifier !== row.identifier) {
        const clash = await Sleeve.findOne({ where: { identifier: req.body.identifier } });
        if (clash) {
          res.status(400).send({ error: 'Identifier already exists' });
          return;
        }
        row.identifier = String(req.body.identifier).trim();
      }
      await row.save();
      res.send({
        ok: true,
        sleeve: {
          id: row.id,
          identifier: row.identifier,
          name: row.name,
          imagePath: row.imagePath,
          isDefault: row.isDefault,
          requiresUnlock: row.requiresUnlock,
          sortOrder: row.sortOrder,
          imageUrl: config.backend.sleevesUrl.replace('{path}', row.imagePath),
        },
      });
    } catch (error) {
      console.error('Admin update sleeve error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Delete('/:id')
  @AuthToken()
  public async onDelete(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const row = await Sleeve.findOne(parseInt(req.params.id, 10));
      if (!row) {
        res.status(404).send({ error: 'Sleeve not found' });
        return;
      }
      await row.remove();
      res.send({ ok: true });
    } catch (error) {
      console.error('Admin delete sleeve error:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }
}
