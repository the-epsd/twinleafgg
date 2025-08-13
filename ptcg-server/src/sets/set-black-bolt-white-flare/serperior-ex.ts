import { PokemonCard, Stage, CardType, StoreLike, State, CardTag, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, IS_ABILITY_BLOCKED, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Serperiorex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Servine';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = G;
  public hp: number = 320;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Royal Cheer',
    powerType: PowerType.ABILITY,
    text: 'Attacks used by your Pokémon do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Grass Order',
    cost: [G, C, C, C],
    damage: 150,
    text: 'You may search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck.'
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Serperior ex';
  public fullName: string = 'Serperior ex SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Royal Cheer ability - increase damage by 20
    if (effect instanceof PutDamageEffect && effect.target === effect.opponent.active) {
      const player = effect.player;

      // Check if this card is in play
      const isInPlay = player.bench.some(b => b.cards.some(c => c === this)) ||
        player.active.cards.some(c => c === this);

      if (isInPlay && !IS_ABILITY_BLOCKED(store, state, player, this)) {
        effect.damage += 20;
      }
    }

    // Grass Order attack
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, {}, { min: 0, max: 3, allowCancel: false }, this.attacks[0]);
    }
    return state;
  }
}
