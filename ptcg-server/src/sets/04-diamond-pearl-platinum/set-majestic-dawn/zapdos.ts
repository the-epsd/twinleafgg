import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Zapdos extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 100;
  public cardType: CardType[] = [L];
  public weakness = [{ type: L, value: +30 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Sheet Lightning',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Zapdos from your hand onto your Bench, you may flip a coin. If heads, put 1 damage counter on each of your opponent\'s Pokémon.',
  }];

  public attacks = [{
    name: 'Raging Thunder',
    cost: [L, L, C],
    damage: 80,
    text: 'Does 40 damage to 1 of your Pokémon, and don\'t apply Weakness and Resistance to this damage.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Zapdos';
  public fullName: string = 'Zapdos MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sheet Lightning
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      state = CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          return state;
        }

        COIN_FLIP_PROMPT(store, state, player, result => {
          if (!result) {
            return;
          }
          opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
            store.reduceEffect(
              state,
              new PlaceDamageCountersEffect(player, cardList, 10, this, this.powers[0]),
            );
          });
        });
      });
    }

    // Raging Thunder
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false, min: 1, max: 1 },
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const target = targets[0];
        if (target === player.active) {
          effect.ignoreWeakness = true;
          effect.ignoreResistance = true;
          const damageEffect = new DealDamageEffect(effect, 40);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        } else {
          const damageEffect = new PutDamageEffect(effect, 40);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}
