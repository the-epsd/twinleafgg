import { CardTarget, CardType, ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCard, PokemonCardList, SlotType, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';

export class Cutiefly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 30;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];

  public attacks = [{
    name: 'Sweet Scent',
    cost: [C],
    damage: 0,
    text: 'Heal 30 damage from 1 of your Pokémon.'
  }];

  public set: string = 'LOT';
  public name: string = 'Cutiefly';
  public fullName: string = 'Cutiefly LOT';
  public setNumber: string = '145';
  public cardImage: string = 'assets/cardback.png';

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
          const healEffect = new HealEffect(player, target, 30);
          store.reduceEffect(state, healEffect);
        });
        return state;
      });


    }

    return state;
  }
}
