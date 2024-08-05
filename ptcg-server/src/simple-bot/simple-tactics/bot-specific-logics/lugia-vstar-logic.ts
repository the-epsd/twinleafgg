import { State, Player, Action, PokemonCard, CardTarget, PlayerType, SlotType, UseAbilityAction, PlayCardAction } from '../../../game';
import { SimpleTactic } from '../simple-tactics';

export class LugiaVStarTactic extends SimpleTactic {
  public override useTactic(state: State, player: Player): Action | undefined {
    let bestScore = 0;
    let bestAction: Action | undefined;

    const lugiaVStarInPlay = player.bench.some(b => b.cards[0] instanceof PokemonCard && b.cards[0].name === 'Lugia VSTAR')
      || (player.active.cards[0] instanceof PokemonCard && player.active.cards[0].name === 'Lugia VSTAR');

    if (lugiaVStarInPlay) {
      bestScore += 5000;
    }

    const archeopsInDiscard = player.discard.cards.filter(c => c instanceof PokemonCard && c.name === 'Archeops').length;
    const emptyBenchSlots = player.bench.filter(b => b.cards.length === 0).length;

    if (lugiaVStarInPlay && archeopsInDiscard > 0 && emptyBenchSlots > 0) {
      const lugiaVStarIndex = player.bench.findIndex(b => b.cards[0] instanceof PokemonCard && b.cards[0].name === 'Lugia VSTAR');
      const lugiaVStarActive = player.active.cards[0] instanceof PokemonCard && player.active.cards[0].name === 'Lugia VSTAR';

      if (lugiaVStarActive || lugiaVStarIndex !== -1) {
        let ability;
        let target: CardTarget;

        if (lugiaVStarActive) {
          ability = (player.active.cards[0] as PokemonCard).powers.find(p => p.name === 'Summoning Star');
          target = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
        } else {
          ability = (player.bench[lugiaVStarIndex].cards[0] as PokemonCard).powers.find(p => p.name === 'Summoning Star');
          target = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: lugiaVStarIndex };
        }

        if (ability) {
          const action = new UseAbilityAction(player.id, ability.name, target);
          const score = 10000 + (archeopsInDiscard >= 2 ? 5000 : 0);
          if (score > bestScore) {
            bestScore = score;
            bestAction = action;
          }
        }
      }
    }

    if (!lugiaVStarInPlay) {
      if (archeopsInDiscard < 2 && state.turn <= 2) {
        const discardActions = [
          this.discardWithUltraBall(player, 'Archeops'),
          this.discardWithCarmine(player, 'Archeops'),
          this.discardWithResearch(player, 'Archeops')
        ];
        const discardAction = discardActions.find(action => action !== undefined);
        if (discardAction) {
          const score = this.evaluateAction(state, player.id, discardAction);
          if (score !== undefined && score > bestScore) {
            bestScore = score;
            bestAction = discardAction;
          }
        }
      }

      const lugiaVInPlay = player.bench.some(b => b.cards[0] instanceof PokemonCard && b.cards[0].name === 'Lugia V')
        || (player.active.cards[0] instanceof PokemonCard && player.active.cards[0].name === 'Lugia V');
      const lugiaVStarInHand = player.hand.cards.some(c => c instanceof PokemonCard && c.name === 'Lugia VSTAR');

      if (lugiaVInPlay && !lugiaVStarInHand) {
        const searchActions = [
          this.searchWithUltraBall(player, ['Lugia VSTAR']),
          this.searchWithGreatBall(player, ['Lugia VSTAR']),
          this.searchWithMesagoza(player, ['Lugia VSTAR'])
        ];
        const searchAction = searchActions.find(action => action !== undefined);
        if (searchAction) {
          const score = this.evaluateAction(state, player.id, searchAction);
          if (score !== undefined && score > bestScore) {
            bestScore = score;
            bestAction = searchAction;
          }
        }
      } else {
        const lugiaVInHand = player.hand.cards.findIndex(c => c instanceof PokemonCard && c.name === 'Lugia V');
        if (lugiaVInHand !== -1) {
          const action = new PlayCardAction(player.id, lugiaVInHand, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 });
          const score = this.evaluateAction(state, player.id, action);
          if (score !== undefined && score > bestScore) {
            bestScore = score;
            bestAction = action;
          }
        }
        const searchActions = [
          this.searchWithUltraBall(player, ['Lugia V']),
          this.searchWithGreatBall(player, ['Lugia V']),
          this.searchWithMesagoza(player, ['Lugia V'])
        ];
        const searchAction = searchActions.find(action => action !== undefined);
        if (searchAction) {
          const score = this.evaluateAction(state, player.id, searchAction);
          if (score !== undefined && score > bestScore) {
            bestScore = score;
            bestAction = searchAction;
          }
        }
      }
    } else {
      const searchActions = [
        this.searchWithUltraBall(player, ['Archeops', 'Lugia V', 'Lugia VSTAR', 'Minccino', 'Cinccino']),
        this.searchWithGreatBall(player, ['Archeops', 'Lugia V', 'Lugia VSTAR', 'Minccino', 'Cinccino']),
        this.searchWithMesagoza(player, ['Archeops', 'Lugia V', 'Lugia VSTAR', 'Minccino', 'Cinccino'])
      ];
      const searchAction = searchActions.find(action => action !== undefined);
      if (searchAction) {
        const score = this.evaluateAction(state, player.id, searchAction);
        if (score !== undefined && score > bestScore) {
          bestScore = score;
          bestAction = searchAction;
        }
      }
    }

    return bestAction;
  }

  private discardWithUltraBall(player: Player, cardName: string): Action | undefined {
    const ultraBallIndex = player.hand.cards.findIndex(c => c.name === 'Ultra Ball');
    if (ultraBallIndex !== -1) {
      const targetCardIndex = player.hand.cards.findIndex(c => c instanceof PokemonCard && c.name === cardName);
      if (targetCardIndex !== -1) {
        const otherCardIndex = player.hand.cards.findIndex((c, i) => i !== targetCardIndex && i !== ultraBallIndex);
        if (otherCardIndex !== -1) {
          return new PlayCardAction(player.id, ultraBallIndex, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 });
        }
      }
    }
    return undefined;
  }

  private discardWithCarmine(player: Player, cardName: string): Action | undefined {
    const carmineIndex = player.hand.cards.findIndex(c => c.name === 'Carmine');
    if (carmineIndex !== -1) {
      const targetCardIndex = player.hand.cards.findIndex(c => c instanceof PokemonCard && c.name === cardName);
      if (targetCardIndex !== -1) {
        return new PlayCardAction(player.id, carmineIndex, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 });
      }
    }
    return undefined;
  }

  private discardWithResearch(player: Player, cardName: string): Action | undefined {
    const researchIndex = player.hand.cards.findIndex(c => c.name === 'Professor\'s Research');
    if (researchIndex !== -1) {
      const targetCardIndex = player.hand.cards.findIndex(c => c instanceof PokemonCard && c.name === cardName);
      if (targetCardIndex !== -1) {
        return new PlayCardAction(player.id, researchIndex, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 });
      }
    }
    return undefined;
  }

  private searchWithUltraBall(player: Player, cardNames: string[]): Action | undefined {
    const ultraBallIndex = player.hand.cards.findIndex(c => c.name === 'Ultra Ball');
    if (ultraBallIndex !== -1) {
      const discardableCards = player.hand.cards.filter((c, i) => i !== ultraBallIndex).slice(0, 2);
      if (discardableCards.length === 2) {
        return new PlayCardAction(player.id, ultraBallIndex, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 });
      }
    }
    return undefined;
  }

  private searchWithGreatBall(player: Player, cardNames: string[]): Action | undefined {
    const greatBallIndex = player.hand.cards.findIndex(c => c.name === 'Great Ball');
    if (greatBallIndex !== -1) {
      return new PlayCardAction(player.id, greatBallIndex, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 });
    }
    return undefined;
  }

  private searchWithMesagoza(player: Player, cardNames: string[]): Action | undefined {
    const mesagozaIndex = player.hand.cards.findIndex(c => c.name === 'Mesagoza');
    if (mesagozaIndex !== -1) {
      return new PlayCardAction(player.id, mesagozaIndex, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 });
    }
    return undefined;
  }
}
