import { User, Match } from '../../storage';
import { MoreThan, LessThan } from 'typeorm';
import { GameWinner } from '../store/state/state';
import { Rank, rankLevels } from '../../backend';
import { config } from '../../config';

export class RankingCalculator {
  constructor() { }

  public calculateMatch(match: Match): User[] {
    const player1 = match.player1;
    const player2 = match.player2;

    if (player1.id === player2.id) {
      return [];
    }

    const rank1 = player1.getRank();
    const rank2 = player2.getRank();

    const rankDifference = Math.abs(player2.ranking - player1.ranking);
    const kValue = rankDifference > 400 ? 75 : 50;
    const diff = Math.max(-400, Math.min(400, player2.ranking - player1.ranking));
    const winExp = 1.0 / (1 + Math.pow(10.0, diff / 500.0));
    let outcome: number;

    switch (match.winner) {
      case GameWinner.PLAYER_1:
        outcome = 1;
        break;
      case GameWinner.PLAYER_2:
        outcome = 0;
        break;
      default:
      case GameWinner.DRAW:
        outcome = 0.5;
        break;
    }

    const stake = kValue * (outcome - winExp);
    const rankMultiplier1 = this.getRankMultiplier(player1.ranking);
    const rankMultiplier2 = this.getRankMultiplier(player2.ranking);

    const diff1 = this.getRankingDiff(rank1, rank2, Math.round(stake * rankMultiplier1));
    const diff2 = this.getRankingDiff(rank1, rank2, Math.round(stake * rankMultiplier2));

    player1.ranking = Math.max(0, player1.ranking + diff1);
    player2.ranking = Math.max(0, player2.ranking - diff2);

    const today = Date.now();
    player1.lastRankingChange = today;
    player2.lastRankingChange = today;

    return [player1, player2];
  }

  private getRankingDiff(rank1: Rank, rank2: Rank, diff: number): number {
    const rankGap = Math.abs(this.getRankPoints(rank2) - this.getRankPoints(rank1));
    const sign = diff >= 0 ? 1 : -1;

    let scaleFactor = 1;
    if (rankGap >= 2000) scaleFactor = 2.75;
    else if (rankGap >= 1000) scaleFactor = 2.25;
    else if (rankGap >= 500) scaleFactor = 1.8;

    // Increased base minimum points
    const minPoints = 10;
    const maxPoints = 40;

    const adjustedDiff = Math.max(minPoints, Math.min(maxPoints * scaleFactor, Math.abs(diff)));
    return sign * adjustedDiff;
  }

  private getRankMultiplier(rankPoints: number): number {
    if (rankPoints <= 250) return 2.0;
    if (rankPoints <= 1000) return 1.5;
    if (rankPoints <= 2500) return 1.0;
    return 0.5;
  }

  private getRankPoints(rank: Rank): number {
    const rankLevel = rankLevels.find(level => level.rank === rank);
    return rankLevel ? rankLevel.points : 0;
  }

  public async decreaseRanking(): Promise<User[]> {
    const rankingDecreaseRate = config.core.rankingDecraseRate;
    const oneDay = config.core.rankingDecraseTime;
    const today = Date.now();
    const yesterday = today - oneDay;

    const users = await User.find({
      where: {
        lastRankingChange: LessThan(yesterday),
        ranking: MoreThan(0)
      }
    });

    users.forEach(user => {
      user.lastRankingChange = today;
      user.ranking = Math.floor(user.ranking * rankingDecreaseRate);
    });

    await User.update({
      lastRankingChange: LessThan(yesterday),
      ranking: MoreThan(0)
    }, {
      lastRankingChange: today,
      ranking: () => `ROUND(${rankingDecreaseRate} * ranking - 0.5)`
    });

    return users;
  }
}
