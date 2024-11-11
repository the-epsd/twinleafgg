import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, SpecialCondition } from '../../game/store/card/card-types';
import {
  StoreLike, State, Card, PowerType, StateUtils,
  CardTarget, PlayerType, MoveEnergyPrompt, SlotType
} from '../../game';
import { GameMessage } from '../../game/game-message';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

function* useFireOff(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;

  const blockedMap: { source: CardTarget, blocked: number[] }[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
    store.reduceEffect(state, checkProvidedEnergy);
    const blockedCards: Card[] = [];

    checkProvidedEnergy.energyMap.forEach(em => {
      if (!em.provides.includes(CardType.FIRE) && !em.provides.includes(CardType.ANY)) {
        blockedCards.push(em.card);
      }
    });

    const blocked: number[] = [];
    blockedCards.forEach(bc => {
      const index = cardList.cards.indexOf(bc);
      if (index !== -1 && !blocked.includes(index)) {
        blocked.push(index);
      }
    });

    if (blocked.length !== 0 || target.slot === SlotType.ACTIVE) {
      blockedMap.push({ source: target, blocked: target.slot === SlotType.ACTIVE ? cardList.cards.map((_, i) => i) : blocked });
    }
  });

  const blocked2: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    if (player.active.cards[0] !== card) {
      blocked2.push(target);
    }
  });

  return store.prompt(state, new MoveEnergyPrompt(
    effect.player.id,
    GameMessage.MOVE_ENERGY_CARDS,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH, SlotType.ACTIVE], // Only allow moving from bench
    { superType: SuperType.ENERGY },
    { allowCancel: false, min: 0, blockedMap, blockedTo: blocked2 }
  ), transfers => {
    if (transfers === null) {
      return;
    }

    for (const transfer of transfers) {
      const source = StateUtils.getTarget(state, player, transfer.from);
      const target = player.active; // Always move to active Pokémon
      source.moveCardTo(transfer.card, target);
    }
  });
}

export class Armarouge extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public evolvesFrom = 'Charcadet';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 130;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Fire Off',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn, you may move a ' +
      'R Energy from 1 of your Benched Pokémon to your Active ' +
      'Pokémon.'
  }];
  public attacks = [{
    name: 'Flame Cannon',
    cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
    damage: 90,
    text: 'Your opponent\'s Active Pokémon is now Burned.'
  }];
  public set = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '41';

  public name = 'Armarouge';

  public fullName: string = 'Armarouge SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useFireOff(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }

}
