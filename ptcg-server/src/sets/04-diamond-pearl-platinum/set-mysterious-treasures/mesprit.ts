import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PowerType, StateUtils, PlayerType, ConfirmPrompt } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { AFTER_ATTACK, IS_POKEBODY_BLOCKED, SWITCH_ACTIVE_WITH_BENCHED } from '../../../game/store/prefabs/prefabs';

export class Mesprit extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 60;
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Upper Material',
    powerType: PowerType.POKEBODY,
    text: 'If you have Uxie and Azelf in play, the Retreat Cost for each Uxie, Mesprit, and Azelf (both yours and your opponent\'s) is 0.'
  }];

  public attacks = [{
    name: 'Teleportation Burst',
    cost: [P, C],
    damage: 30,
    text: 'You may switch Mesprit with 1 of your Benched Pokémon.'
  }];

  public set: string = 'MT';
  public setNumber: string = '14';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mesprit';
  public fullName: string = 'Mesprit MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Upper Material
    if (effect instanceof CheckRetreatCostEffect) {
      const retreating = effect.player;
      const active = retreating.active.getPokemonCard();
      if (!active || (active.name !== 'Uxie' && active.name !== 'Mesprit' && active.name !== 'Azelf')) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      let hasThisMesprit = false;
      let hasUxie = false;
      let hasAzelf = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
        if (card === this) {
          hasThisMesprit = true;
        } else if (card.name === 'Uxie') {
          hasUxie = true;
        } else if (card.name === 'Azelf') {
          hasAzelf = true;
        }
      });

      if (!hasThisMesprit || !hasUxie || !hasAzelf) {
        return state;
      }

      if (!IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        effect.cost = [];
      }
      return state;
    }

    // Teleportation Burst
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      if (player.bench.length > 0) {
        store.prompt(state, new ConfirmPrompt(
          player.id,
          GameMessage.WANT_TO_SWITCH_POKEMON
        ), wantToSwitch => {
          if (wantToSwitch) {
            SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
          }
        });
      }
    }

    return state;
  }
}