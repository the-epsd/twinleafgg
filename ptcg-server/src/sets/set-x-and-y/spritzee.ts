import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCardList, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';

export class Spritzee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 50;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sweet Scent',
    cost: [Y],
    damage: 0,
    text: 'Heal 20 damage from 1 of your Pokémon.'
  },
  {
    name: 'Flop',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'XY';
  public name: string = 'Spritzee';
  public fullName: string = 'Spritzee XY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const blocked: CardTarget[] = [];
      let hasPokemonWithDamage: boolean = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage === 0) {
          blocked.push(target);
        } else {
          hasPokemonWithDamage = true;
        }
      });

      if (hasPokemonWithDamage === false) {
        return state;
      }

      // Do not discard the card yet
      effect.preventDefault = true;

      let targets: PokemonCardList[] = [];
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false, blocked }
      ), results => {
        targets = results || [];
        if (targets.length === 0) {
          return state;
        }

        targets.forEach(target => {
          // Heal Pokemon
          const healEffect = new HealEffect(player, target, 20);
          store.reduceEffect(state, healEffect);
        });
        return state;
      });


    }

    return state;
  }
}