import { CardTag, CardType, PlayerType, PokemonCard, PowerType, Stage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterDamageEffect } from '../../../game/store/effects/attack-effects';
import { PowerEffect, PutDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { GamePhase } from '../../../game/store/state/state';
import { DRAW_CARDS, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Mausholdex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tandemaus';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = C;
  public hp: number = 230;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [];

  public powers = [{
    name: 'Solidarity',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), put 3 damage counters on the Attacking Pokémon for each of your Tandemaus, Maushold, and Maushold ex in play.'
  }];

  public attacks = [{
    name: 'Nom-Nom-Nom Incisors',
    cost: [C, C],
    damage: 120,
    text: 'Draw 2 cards.'
  }];

  public regulationMark = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '155';
  public name: string = 'Maushold ex';
  public fullName: string = 'Maushold ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-pokemon-151/hitmonchan.ts (Counterattack), set-breakthrough/piloswine.ts (Gathering Footsteps),
    //      set-astral-radiance/hisuian-samurott-vstar.ts (PutDamageCountersEffect)
    if (effect instanceof AfterDamageEffect && effect.target.getPokemonCard() === this && state.phase === GamePhase.ATTACK) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = effect.player;

      if (player === opponent || player.active !== effect.target) {
        return state;
      }

      if (!StateUtils.isPokemonInPlay(player, this)) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const solidarityNames = ['Tandemaus', 'Maushold', 'Maushold ex'];
      let count = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        const pokemonCard = cardList.getPokemonCard();
        if (pokemonCard && solidarityNames.includes(pokemonCard.name)) {
          count++;
        }
      });

      if (count === 0) {
        return state;
      }

      const powerEffect = new PowerEffect(player, this.powers[0], this, effect.source);
      const putDamage = new PutDamageCountersEffect(powerEffect, 30 * count);
      store.reduceEffect(state, putDamage);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 2);
    }

    return state;
  }
}
