import {
  AttachEnergyPrompt,
  Attack,
  CardTarget,
  GameError,
  GameMessage,
  PlayerType,
  ShuffleDeckPrompt,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '../../game';
import { CardType, EnergyType, TrainerType } from '../../game/store/card/card-types';
import { ColorlessCostReducer } from '../../game/store/card/pokemon-interface';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckAttackCostEffect, CheckPokemonAttacksEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';

type CapHolder = { target: CardTarget };

function buildCapHolders(player: State['players'][number], capName: string): CapHolder[] {
  const holders: CapHolder[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
    if (cardList.tools.some(tool => tool.name === capName)) {
      holders.push({ target });
    }
  });
  return holders;
}

function buildBlockedTo(player: State['players'][number], allowed: CardTarget): CardTarget[] {
  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, _card, target) => {
    if (target.slot !== allowed.slot || target.index !== allowed.index) {
      blocked.push(target);
    }
  });
  return blocked;
}

function* deltaGift(
  next: Function,
  store: StoreLike,
  state: State,
  player: typeof state.players[0],
  holders: CapHolder[],
  index: number,
): IterableIterator<State> {
  if (index >= holders.length) {
    yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
      next();
    });
    return state;
  }

  if (player.deck.cards.length > 0) {
    const { target } = holders[index];
    const blockedTo = buildBlockedTo(player, target);

    yield store.prompt(state, new AttachEnergyPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_ATTACH,
      player.deck,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH, SlotType.ACTIVE],
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { allowCancel: false, min: 0, max: 1, blockedTo },
    ), transfers => {
      transfers = transfers || [];
      for (const transfer of transfers) {
        const attachTarget = StateUtils.getTarget(state, player, transfer.to);
        player.deck.moveCardTo(transfer.card, attachTarget);
      }
      next();
    });
  }

  const generator = deltaGift(() => generator.next(), store, state, player, holders, index + 1);
  return generator.next().value;
}

export class MegaRayquazaCap extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public regulationMark: string = 'J';
  public set: string = 'M6';
  public setNumber: string = '66';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Rayquaza Cap';
  public fullName: string = 'Mega Rayquaza Cap M6';

  public attacks: Attack[] = [{
    name: 'Delta Gift',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'For each of your Pokémon in play that has a Mega Rayquaza Cap attached to it, search your deck for a Basic Energy and attach it to that Pokémon. Then, shuffle your deck.',
  }];

  public text: string = 'The Pokémon this card is attached to can use the attack on this card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-paradox-rift/technical-machine-blindside.ts (tool attack grant)
    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const pokemonCard = effect.player.active.getPokemonCard();
      if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
        const reduction = (pokemonCard as ColorlessCostReducer).getColorlessReduction(state);
        for (let i = 0; i < reduction && effect.cost.includes(CardType.COLORLESS); i++) {
          const index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          }
        }
      }
    }

    if (effect instanceof CheckPokemonAttacksEffect
      && effect.player.active.tools.includes(this)
      && !effect.attacks.includes(this.attacks[0])) {
      effect.attacks.push(this.attacks[0]);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (IS_TOOL_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      const holders = buildCapHolders(player, this.name);

      if (holders.length === 0) {
        return state;
      }

      const generator = deltaGift(() => generator.next(), store, state, player, holders, 0);
      return generator.next().value;
    }

    return state;
  }
}
