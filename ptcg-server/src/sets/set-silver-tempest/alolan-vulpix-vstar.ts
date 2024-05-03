import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GameError, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ApplyWeaknessEffect, AfterDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class AlolanVulpixVSTAR extends PokemonCard {
  
  public stage = Stage.VSTAR;

  public evolvesFrom = 'Alolan Vulpix V';

  public cardType = CardType.WATER;

  public hp = 240;
  
  public tags = [CardTag.POKEMON_VSTAR];
  
  public weakness = [{ type: CardType.METAL }];
  
  public retreat = [CardType.COLORLESS];
  
  public attacks = [
    {
      name: 'Snow Mirage',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 160,
      text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon. During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Pokémon that have an Ability.'
    },
    {
      name: 'Silvery Snow Star',
      cost: [ ],
      damage: 70,
      text: 'This attack does 70 damage for each of your opponent\'s Pokémon V in play. This damage isn\'t affected by Weakness or Resistance. (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];

  public set = 'SIT';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber = '34';

  public name = 'Alolan Vulpix VSTAR';

  public fullName = 'Alolan Vulpix VSTAR SIT';

  public readonly PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES = 'PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.marker.addMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES, this);

      const applyWeakness = new ApplyWeaknessEffect(effect, 160);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);

        if (player.marker.hasMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES, this)) {
          const opponent = StateUtils.getOpponent(state, player);

          if (opponent.active) {
            const opponentActive = opponent.active.getPokemonCard();

            if (opponentActive && opponentActive.powers.length > 0) {
              if (effect instanceof PutDamageEffect) {
                effect.preventDefault = true;
              }
            }
          }
        }
      }

      if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
        
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);

        if (player.usedVSTAR === true) {
          throw new GameError(GameMessage.POWER_ALREADY_USED);
        }

        const benchPokemon = opponent.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined) as PokemonCard[];
        const vPokemons = benchPokemon.filter(card => card.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VSTAR || CardTag.POKEMON_VMAX));
        const opponentActive = opponent.active.getPokemonCard();
        if (opponentActive && opponentActive.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VSTAR || CardTag.POKEMON_VMAX || CardTag.POKEMON_ex)) {
          vPokemons.push(opponentActive);
        }
  
        let vPokes = vPokemons.length;
  
        if (opponentActive) {
          vPokes++;
        }

        effect.ignoreResistance = true;
        effect.ignoreWeakness = true;
        effect.damage *= vPokes;
        player.usedVSTAR = true;
  
      }
      return state;
    }
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES, this);
    }
    return state;
  }
}
