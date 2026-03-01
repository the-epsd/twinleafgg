import { Request, Response } from 'express';
import { AuthToken, Validate, check } from '../services';
import { Controller, Get, Post } from './controller';
import {
  BattlePassSeason, UserBattlePass, User, UserUnlockedItem, MatchXpAward
} from '../../storage';
import { ApiErrorEnum } from '../common/errors';
import { LessThanOrEqual } from 'typeorm';
import { Application } from 'express';
import { Core } from '../../game/core/core';
import { Storage } from '../../storage';

/** Newest season = latest startDate where startDate <= today */
async function getNewestSeason(): Promise<BattlePassSeason | null> {
  const today = new Date().toISOString().slice(0, 10);
  const season = await BattlePassSeason.findOne({
    where: { startDate: LessThanOrEqual(today) },
    order: { startDate: 'DESC' }
  });
  return season ?? null;
}

export class BattlePass extends Controller {

  constructor(path: string, app: Application, db: Storage, core: Core) {
    super(path, app, db, core);
  }

  // GET /v1/battlepass/current
  @Get('/current')
  public async onGetCurrent(req: Request, res: Response) {
    try {
      const currentSeason = await getNewestSeason();

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
          rewards: currentSeason.rewards,
          maxLevel: currentSeason.maxLevel
        }
      });
    } catch (error) {
      console.error('Error fetching current season:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  // GET /v1/battlepass/active-season
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

  // POST /v1/battlepass/active-season
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
      if (!season) {
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

  // GET /v1/battlepass/season/:seasonId
  @Get('/season/:seasonId')
  public async onGetSeason(req: Request, res: Response) {
    try {
      const seasonId = req.params.seasonId;
      const season = await BattlePassSeason.findOne({ where: { seasonId } });

      if (!season) {
        res.status(404).send({ error: 'Season not found' });
        return;
      }

      res.send({
        ok: true,
        season: {
          id: season.id,
          seasonId: season.seasonId,
          name: season.name,
          startDate: season.startDate,
          rewards: season.rewards,
          maxLevel: season.maxLevel
        }
      });
    } catch (error) {
      console.error('Error fetching season:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  // GET /v1/battlepass/progress?seasonId=xxx (optional)
  @Get('/progress')
  @AuthToken()
  public async onGetProgress(req: Request, res: Response) {
    try {
      const userId: number = req.body.userId;
      const seasonIdParam = req.query.seasonId as string | undefined;

      const season = seasonIdParam
        ? await BattlePassSeason.findOne({ where: { seasonId: seasonIdParam } })
        : await getNewestSeason();

      if (!season) {
        res.status(404).send({ error: seasonIdParam ? 'Season not found' : 'No active battle pass season' });
        return;
      }

      const user = await User.findOne(userId);
      if (!user) {
        res.status(400).send({ error: ApiErrorEnum.PROFILE_INVALID });
        return;
      }

      let progress = await UserBattlePass.findOne({
        where: { userId, seasonId: season.seasonId },
        relations: ['season']
      });

      if (!progress) {
        progress = new UserBattlePass();
        progress.userId = userId;
        progress.seasonId = season.seasonId;
        progress.season = season;
        progress.user = user;
        progress.exp = 0;
        progress.level = 1;
        progress.claimedRewards = [];
        await progress.save();
      }

      const availableRewards = season.getRewardsForLevel(progress.level, false);

      res.send({
        ok: true,
        progress: {
          exp: progress.exp,
          level: progress.level,
          claimedRewards: progress.claimedRewards,
          nextLevelXp: season.getXpForLevel(progress.level),
          totalXpForCurrentLevel: season.getTotalXpForLevel(progress.level),
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

      const season = await BattlePassSeason.findOne({ where: { seasonId } });
      if (!season) {
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

      // Check if reward can be claimed
      if (!(await progress.canClaimReward(level))) {
        res.status(400).send({ error: 'Cannot claim reward' });
        return;
      }

      const rewards = season.getRewardsForLevel(level, false);
      if (rewards.length === 0) {
        res.status(400).send({ error: 'No available rewards' });
        return;
      }

      // Save the claimed reward
      await progress.claimReward(level);

      // Grant the items to the user
      for (const reward of rewards) {
        switch (reward.type) {
          case 'avatar':
          case 'card_back':
          case 'playmat':
          case 'marker': {
            const unlockedItem = new UserUnlockedItem();
            unlockedItem.userId = userId;
            unlockedItem.itemId = reward.item;
            unlockedItem.itemType = reward.type;
            await unlockedItem.save();
            break;
          }
        }
      }

      await progress.save();

      res.send({
        ok: true,
        rewards,
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
    exp: check().isNumber().required()
  })
  public async onAddDebugExp(req: Request, res: Response) {
    try {
      const userId: number = req.body.userId;
      const exp: number = req.body.exp;

      const currentSeason = await getNewestSeason();
      if (!currentSeason) {
        return res.status(404).send({ error: 'No active battle pass season' });
      }

      // Get user and ensure they are an admin
      const user = await User.findOne(userId);
      if (!user) {
        return res.status(400).send({ error: ApiErrorEnum.PROFILE_INVALID });
      }

      // Get or create user progress
      let progress = await UserBattlePass.findOne({
        where: {
          userId,
          seasonId: currentSeason.seasonId
        },
        relations: ['season']
      });

      if (!progress) {
        progress = new UserBattlePass();
        progress.userId = userId;
        progress.seasonId = currentSeason.seasonId;
        progress.exp = 0;
        progress.level = 1;
        progress.claimedRewards = [];
        progress.season = currentSeason;
      }

      // Add experience and save
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

      const currentSeason = await getNewestSeason();
      if (!currentSeason) {
        res.status(404).send({ error: 'No active battle pass season' });
        return;
      }

      // Get user
      const user = await User.findOne(userId);
      if (!user) {
        res.status(400).send({ error: ApiErrorEnum.PROFILE_INVALID });
        return;
      }

      // Get or create user progress
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

      // Check for level up
      const leveledUp = progress.level > oldLevel;

      // Get available rewards if leveled up (premium removed)
      const availableRewards = leveledUp ?
        currentSeason.getRewardsForLevel(progress.level, false) :
        [];

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

  // GET /v1/battlepass/pending-match-reward
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
        ? await BattlePassSeason.findOne({ where: { seasonId: award.seasonId } })
        : null;
      if (!season) {
        season = await getNewestSeason();
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

  // GET /v1/battlepass/seasons
  @Get('/seasons')
  public async onGetSeasons(req: Request, res: Response) {
    try {
      const seasons = await BattlePassSeason.find({
        order: { startDate: 'DESC' }
      });

      res.send({
        ok: true,
        seasons: seasons.map(season => ({
          id: season.id,
          seasonId: season.seasonId,
          name: season.name,
          startDate: season.startDate,
          maxLevel: season.maxLevel
        }))
      });
    } catch (error) {
      console.error('Error fetching seasons:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }
} 