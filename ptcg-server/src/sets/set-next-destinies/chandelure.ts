import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

export class Chandelure extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Lampent';
  public cardType: CardType = R;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Flame Burst',
      cost: [R],
      damage: 30,
      text: 'Does 30 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Inferno',
      cost: [R, C],
      damage: 80,
      text: 'Discard all Energy attached to this Pokémon. The Defending Pokémon is now Burned.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '20';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chandelure';
  public fullName: string = 'Chandelure NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flame Burst - 30 damage to active, 30 to 2 benched
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Get benched Pokémon
      const benchedPokemon = opponent.bench.filter(b => b.cards.length > 0);

      if (benchedPokemon.length === 0) {
        return state;
      }

      // If only 1 or 2 benched, damage all of them
      if (benchedPokemon.length <= 2) {
        benchedPokemon.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      }

      // Otherwise, prompt player to choose 2
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 2, max: 2, allowCancel: false }
      ), (selected) => {
        if (selected && selected.length > 0) {
          selected.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, 30);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
        }
      });
    }

    // Inferno - discard all energy and burn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Discard all energy
      const energyCards = player.active.cards.filter(c => c.superType === SuperType.ENERGY);

      if (energyCards.length > 0) {
        const discardEffect = new DiscardCardsEffect(effect, energyCards);
        store.reduceEffect(state, discardEffect);
      }

      // Burn the defender
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
    }

    return state;
  }
}
