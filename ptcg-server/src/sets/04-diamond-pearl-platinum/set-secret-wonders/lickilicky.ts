import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Lickilicky extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Lickitung';
  public hp: number = 110;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +30 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Tongue Reel',
    cost: [C, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. If you choose a Benched Pokémon, switch the Defending Pokémon with that Pokémon. This attack does 20 damage to the Pokémon you chose. Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Boundless Power',
    cost: [C, C, C, C],
    damage: 80,
    text: 'During your next turn, Lickilicky can\'t attack.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Lickilicky';
  public fullName: string = 'Lickilicky SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tongue Reel
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const target = selected && selected[0];
        if (!target) {
          return;
        }

        if (target !== opponent.active) {
          opponent.switchPokemon(target);
        }

        const dealDamage = new DealDamageEffect(effect, 20);
        dealDamage.target = opponent.active;
        store.reduceEffect(state, dealDamage);

        COIN_FLIP_PROMPT(store, state, player, result => {
          if (result) {
            YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
          }
        });
      });
    }

    // Boundless Power
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
