import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../../game/store/card/card-types';
import { GameError, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ApplyWeaknessEffect, AfterDamageEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class AlolanVulpixVSTAR extends PokemonCard {
  public stage = Stage.VSTAR;
  public evolvesFrom = 'Alolan Vulpix V';
  public cardType = W;
  public hp = 240;
  public tags = [CardTag.POKEMON_VSTAR];
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Snow Mirage',
    cost: [W, C, C],
    damage: 160,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon. During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Pokémon that have an Ability.'
  },
  {
    name: 'Silvery Snow Star',
    cost: [],
    damage: 70,
    text: 'This attack does 70 damage for each of your opponent\'s Pokémon V in play. This damage isn\'t affected by Weakness or Resistance. (You can\'t use more than 1 VSTAR Power in a game.)'
  }];

  public regulationMark = 'F';
  public set = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '34';
  public name = 'Alolan Vulpix VSTAR';
  public fullName = 'Alolan Vulpix VSTAR SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Snow Mirage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 160);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);

        PREVENT_DAMAGE(store, state, effect, this, { sourceHasAbility: true });
      }
    }

    // Silvery Snow Star
    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
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
}
