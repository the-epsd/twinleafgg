import { Request, Response } from 'express';
import { AuthToken, Validate, check, requireAdmin, validateToken, ADMIN_ROLE_ID } from '../services';
import {
  findCurrentBattlePassSeason,
  findSeasonWithRewards,
  serializeRewards,
} from '../services/battle-pass-helpers';
import { Controller, Get, Post } from './controller';
import {
  BattlePassSeason, UserBattlePass, User, UserUnlockedItem, MatchXpAward
} from '../../storage';
import { ApiErrorEnum } from '../common/errors';
import { Not } from 'typeorm';
import { Application } from 'express';
import { Core } from '../../game/core/core';
import { Storage } from '../../storage';

function includeDraftsQuery(req: Request): boolean {
  const raw = req.query.includeDrafts;
  if (raw === undefined || raw === null) {
    return false;
  }
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === '1' || value === 'true' || value === 'yes';
}

/** True when includeDrafts query is set and the caller is an authenticated admin. */
async function adminWantsDrafts(req: Request): Promise<boolean> {
  if (!includeDraftsQuery(req)) {
    return false;
  }
  // Prefer userId injected by @AuthToken(); otherwise validate Auth-Token header.
  let userId: number | undefined = typeof req.body?.userId === 'number' ? req.body.userId : undefined;
  if (!userId) {
    userId = validateToken(req.header('Auth-Token') || '') || undefined;
  }
  if (!userId) {
    return false;
  }
  const user = await User.findOne(userId);
  return !!user && user.roleId === ADMIN_ROLE_ID;
}

async function isAdminUser(userId: number): Promise<boolean> {
  const user = await User.findOne(userId);
  return !!user && user.roleId === ADMIN_ROLE_ID;
}

function canAccessSeason(season: BattlePassSeason | undefined | null, allowDrafts: boolean): boolean {
  if (!season) {
    return false;
  }
  if (season.status === 'draft' && !allowDrafts) {
    return false;
  }
  return true;
}

export class BattlePass extends Controller {

  constructor(path: string, app: Application, db: Storage, core: Core) {
    super(path, app, db, core);
  }

  @Get('/current')
  public async onGetCurrent(req: Request, res: Response) {
    try {
      const currentSeason = await findCurrentBattlePassSeason();

      if (!currentSeason) {
        res.status(404).send({ error: 'No active battle pass season' });
        return;
      }

      res.send({
        ok: true,
        season: {
          id: currentSeason.id,
          seasonId: currentSeason.seasonId,
          name: currentSeason.name,
          startDate: currentSeason.startDate,
          endDate: currentSeason.endDate ?? null,
          status: currentSeason.status,
          rewards: await serializeRewards(currentSeason.rewards || []),
          maxLevel: currentSeason.maxLevel
        }
      });
    } catch (error) {
      console.error('Error fetching current season:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Get('/active-season')
  @AuthToken()
  public async onGetActiveSeason(req: Request, res: Response) {
    try {
      const userId: number = req.body.userId;
      const user = await User.findOne(userId);
      if (!user) {
        res.status(400).send({ error: ApiErrorEnum.PROFILE_INVALID });
        return;
      }
      res.send({ ok: true, seasonId: user.activeBattlePassSeasonId ?? null });
    } catch (error) {
      console.error('Error fetching active battle pass season:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Post('/active-season')
  @AuthToken()
  @Validate({ seasonId: check().isString() })
  public async onSetActiveSeason(req: Request, res: Response) {
    try {
      const userId: number = req.body.userId;
      const seasonId: string = req.body.seasonId;
      const user = await User.findOne(userId);
      if (!user) {
        res.status(400).send({ error: ApiErrorEnum.PROFILE_INVALID });
        return;
      }
      const season = await BattlePassSeason.findOne({ where: { seasonId } });
      // Drafts cannot become the persisted active season (match XP).
      if (!season || season.status === 'draft') {
        res.status(404).send({ error: 'Season not found' });
        return;
      }
      user.activeBattlePassSeasonId = seasonId;
      await user.save();
      res.send({ ok: true });
    } catch (error) {
      console.error('Error setting active battle pass season:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Get('/season/:seasonId')
  public async onGetSeason(req: Request, res: Response) {
    try {
      const allowDrafts = await adminWantsDrafts(req);
      const season = await findSeasonWithRewards(req.params.seasonId);

      if (!canAccessSeason(season, allowDrafts)) {
        res.status(404).send({ error: 'Season not found' });
        return;
      }

      res.send({
        ok: true,
        season: {
          id: season!.id,
          seasonId: season!.seasonId,
          name: season!.name,
          startDate: season!.startDate,
          endDate: season!.endDate ?? null,
          status: season!.status,
          rewards: await serializeRewards(season!.rewards || []),
          maxLevel: season!.maxLevel
        }
      });
    } catch (error) {
      console.error('Error fetching season:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Get('/progress')
  @AuthToken()
  public async onGetProgress(req: Request, res: Response) {
    try {
      const userId: number = req.body.userId;
      const seasonIdParam = req.query.seasonId as string | undefined;
      const allowDrafts = await adminWantsDrafts(req);

      const season = seasonIdParam
        ? await findSeasonWithRewards(seasonIdParam)
        : await findCurrentBattlePassSeason();

      if (!canAccessSeason(season, allowDrafts)) {
        res.status(404).send({ error: seasonIdParam ? 'Season not found' : 'No active battle pass season' });
        return;
      }

      const user = await User.findOne(userId);
      if (!user) {
        res.status(400).send({ error: ApiErrorEnum.PROFILE_INVALID });
        return;
      }

      let progress = await UserBattlePass.findOne({
        where: { userId, seasonId: season!.seasonId },
        relations: ['season']
      });

      if (!progress) {
        progress = new UserBattlePass();
        progress.userId = userId;
        progress.seasonId = season!.seasonId;
        progress.season = season!;
        progress.user = user;
        progress.exp = 0;
        progress.level = 1;
        progress.claimedRewards = [];
        await progress.save();
      }

      const availableRewards = await serializeRewards(season!.getRewardsForLevel(progress.level));

      res.send({
        ok: true,
        progress: {
          exp: progress.exp,
          level: progress.level,
          claimedRewards: progress.claimedRewards,
          nextLevelXp: season!.getXpForLevel(progress.level),
          totalXpForCurrentLevel: season!.getTotalXpForLevel(progress.level),
          availableRewards
        }
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Post('/claim')
  @AuthToken()
  @Validate({
    level: check().isNumber().required(),
    seasonId: check().isString().required()
  })
  public async onClaim(req: Request, res: Response) {
    try {
      const userId: number = req.body.userId;
      const level: number = req.body.level;
      const seasonId: string = req.body.seasonId;

      const season = await findSeasonWithRewards(seasonId);
      const allowDraft = season?.status === 'draft' ? await isAdminUser(userId) : true;
      if (!canAccessSeason(season, allowDraft)) {
        res.status(404).send({ error: 'Season not found' });
        return;
      }

      const user = await User.findOne(userId);
      if (!user) {
        res.status(400).send({ error: ApiErrorEnum.PROFILE_INVALID });
        return;
      }

      const progress = await UserBattlePass.findOne({
        where: { userId, seasonId },
        relations: ['season', 'user']
      });

      if (!progress) {
        res.status(400).send({ error: 'No battle pass progress found' });
        return;
      }

      if (!(await progress.canClaimReward(level))) {
        res.status(400).send({ error: 'Cannot claim reward' });
        return;
      }

      const rewards = season!.getRewardsForLevel(level);
      if (rewards.length === 0) {
        res.status(400).send({ error: 'No available rewards' });
        return;
      }

      await progress.claimReward(level);

      for (const reward of rewards) {
        const unlockedItem = new UserUnlockedItem();
        unlockedItem.userId = userId;
        unlockedItem.itemId = reward.itemId;
        unlockedItem.itemType = reward.rewardType;
        await unlockedItem.save();
      }

      await progress.save();

      res.send({
        ok: true,
        rewards: await serializeRewards(rewards),
        progress: {
          exp: progress.exp,
          level: progress.level,
          claimedRewards: progress.claimedRewards,
        }
      });
    } catch (error) {
      console.error('Error claiming reward:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Post('/debug/add-exp')
  @AuthToken()
  @Validate({
    exp: check().isNumber().required(),
    seasonId: check().optional().isString()
  })
  public async onAddDebugExp(req: Request, res: Response) {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    try {
      const userId: number = req.body.userId;
      const exp: number = req.body.exp;
      const seasonIdParam: string | undefined = req.body.seasonId;

      const season = seasonIdParam
        ? await findSeasonWithRewards(seasonIdParam)
        : await findCurrentBattlePassSeason();
      // Admins may add XP to draft seasons while previewing.
      if (!season) {
        return res.status(404).send({ error: seasonIdParam ? 'Season not found' : 'No active battle pass season' });
      }

      const user = await User.findOne(userId);
      if (!user) {
        return res.status(400).send({ error: ApiErrorEnum.PROFILE_INVALID });
      }

      let progress = await UserBattlePass.findOne({
        where: {
          userId,
          seasonId: season.seasonId
        },
        relations: ['season']
      });

      if (!progress) {
        progress = new UserBattlePass();
        progress.userId = userId;
        progress.seasonId = season.seasonId;
        progress.exp = 0;
        progress.level = 1;
        progress.claimedRewards = [];
        progress.season = season;
      }

      await progress.addExp(exp);
      await progress.save();

      res.send({ ok: true });

    } catch (error) {
      console.error('Error adding debug exp:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Post('/exp')
  @AuthToken()
  @Validate({
    exp: check().isNumber().required()
  })
  public async onAddExp(req: Request, res: Response) {
    try {
      const userId: number = req.body.userId;
      const exp: number = req.body.exp;

      const currentSeason = await findCurrentBattlePassSeason();
      if (!currentSeason) {
        res.status(404).send({ error: 'No active battle pass season' });
        return;
      }

      const user = await User.findOne(userId);
      if (!user) {
        res.status(400).send({ error: ApiErrorEnum.PROFILE_INVALID });
        return;
      }

      let progress = await UserBattlePass.findOne({
        where: {
          userId,
          seasonId: currentSeason.seasonId
        },
        relations: ['season', 'user']
      });

      if (!progress) {
        progress = new UserBattlePass();
        progress.userId = userId;
        progress.seasonId = currentSeason.seasonId;
        progress.season = currentSeason;
        progress.user = user;
        progress.exp = 0;
        progress.level = 1;
        progress.claimedRewards = [];
      }

      const oldLevel = progress.level;
      await progress.addExp(exp);
      await progress.save();

      const leveledUp = progress.level > oldLevel;
      const availableRewards = leveledUp
        ? await serializeRewards(currentSeason.getRewardsForLevel(progress.level))
        : [];

      res.send({
        ok: true,
        progress: {
          exp: progress.exp,
          level: progress.level,
          claimedRewards: progress.claimedRewards,
          leveledUp,
          nextLevelXp: currentSeason.getXpForLevel(progress.level),
          totalXpForCurrentLevel: currentSeason.getTotalXpForLevel(progress.level),
          availableRewards
        }
      });
    } catch (error) {
      console.error('Error adding exp:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Get('/pending-match-reward')
  @AuthToken()
  public async onGetPendingMatchReward(req: Request, res: Response) {
    try {
      const userId: number = req.body.userId;

      const award = await MatchXpAward.findOne({
        where: { userId, viewed: false },
        order: { id: 'DESC' }
      });

      if (!award) {
        res.send({ ok: true, reward: null });
        return;
      }

      award.viewed = true;
      await award.save();

      let season = award.seasonId
        ? await findSeasonWithRewards(award.seasonId)
        : null;
      if (!season) {
        season = await findCurrentBattlePassSeason();
      }

      const xpForNextLevel = season
        ? season.getXpForLevel(award.newLevel)
        : 1000;
      const xpForPreviousLevel = season
        ? season.getXpForLevel(award.previousLevel)
        : 1000;
      const totalXpForPreviousLevel = season
        ? season.getTotalXpForLevel(award.previousLevel)
        : 0;
      const totalXpForNewLevel = season
        ? season.getTotalXpForLevel(award.newLevel)
        : 0;

      res.send({
        ok: true,
        reward: {
          xpGained: award.xpGained,
          previousExp: award.previousExp,
          newExp: award.newExp,
          previousLevel: award.previousLevel,
          newLevel: award.newLevel,
          leveledUp: award.newLevel > award.previousLevel,
          xpForNextLevel,
          xpForPreviousLevel,
          totalXpForPreviousLevel,
          totalXpForNewLevel,
          seasonName: season?.name ?? 'Battle Pass'
        }
      });
    } catch (error) {
      console.error('Error fetching pending match reward:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Get('/seasons')
  public async onGetSeasons(req: Request, res: Response) {
    try {
      const allowDrafts = await adminWantsDrafts(req);
      const seasons = allowDrafts
        ? await BattlePassSeason.find({ order: { startDate: 'DESC' } })
        : await BattlePassSeason.find({
            where: { status: Not('draft') },
            order: { startDate: 'DESC' }
          });

      res.send({
        ok: true,
        seasons: seasons.map(season => ({
          id: season.id,
          seasonId: season.seasonId,
          name: season.name,
          startDate: season.startDate,
          endDate: season.endDate ?? null,
          status: season.status,
          maxLevel: season.maxLevel
        }))
      });
    } catch (error) {
      console.error('Error fetching seasons:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }
}
