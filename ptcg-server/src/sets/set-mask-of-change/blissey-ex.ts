import { CardTag, CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { Card, CardTarget, ConfirmPrompt, EnergyCard, GameMessage, MoveEnergyPrompt, PlayerType, PokemonCard, PowerType, SlotType, StateUtils } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

function* useBlissfulSwap(this: any, next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  
  const blockedMap: { source: CardTarget, blocked: number[] }[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
    store.reduceEffect(state, checkProvidedEnergy);
    const blockedCards: Card[] = [];
  
    checkProvidedEnergy.energyMap.forEach(em => {
      if (!em.provides.includes(CardType.ANY)) {
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
  
    if (blocked.length !== 0) {
      blockedMap.push({ source: target, blocked });
    }
  });
  
  let hasEnergyOnBench = false;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (cardList === player.active) {
      blockedTo.push(target);
      return;
    }
    blockedFrom.push(target);
    if (cardList.cards.some(c => c instanceof EnergyCard)) {
      hasEnergyOnBench = true;
    }
  });
  
  if (hasEnergyOnBench === false) {
    return state;
  }
  
  const blockedFrom: CardTarget[] = [];
  const blockedTo: CardTarget[] = [];
  
  return store.prompt(state, new MoveEnergyPrompt(
    player.id, 
    GameMessage.MOVE_ENERGY_CARDS,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH, SlotType.ACTIVE], // Only allow moving to active
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC }, 
    { allowCancel: true, blockedFrom, blockedTo, blockedMap, min: 1, max: 1 }
  ), transfers => {
  
    if (!transfers) {
      return;
    }
  
    for (const transfer of transfers) {
        
      // Can only move energy to the active Pokemon
      const target = player.active;  
      const source = StateUtils.getTarget(state, player, transfer.from);
      source.moveCardTo(transfer.card, target);
  
    }
  
  });
  
}

export class Blisseyex extends PokemonCard {
  
  public stage: Stage = Stage.BASIC;

  public evolvesFrom: string = 'Chansey';

  public tags = [ CardTag.POKEMON_ex ];

  public regulationMark = 'H';
  
  public cardType: CardType = CardType.COLORLESS;
  
  public weakness = [{ type: CardType.FIGHTING }];

  public hp: number = 310;
  
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];
  
  public powers = [{
    name: 'Blissful Swap',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may move 1 Basic Energy from 1 of your Pokémon to another of your Pokémon.'
  }];

  public attacks = [
    {
      name: 'Return',
      cost: [ ],
      damage: 120,
      text: 'You may draw until you have 6 cards in hand.'
    }
  ];
  
  public set: string = 'SV6';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '85';
  
  public name: string = 'Blissey ex';
  
  public fullName: string = 'Blissey ex SV6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useBlissfulSwap(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          while (player.hand.cards.length < 6) {
            player.deck.moveTo(player.hand, 1);
          }
        }
      });
    
    }
    return state;
  }

}