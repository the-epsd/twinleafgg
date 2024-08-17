import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, State, StateUtils, StoreLike } from '../../game';
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
      cost: [],
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

  public readonly PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER = 'PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER';
  public readonly CLEAR_PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER = 'CLEAR_PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
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

        const oppActive = opponent.active.getPokemonCard();

        if (oppActive && oppActive?.powers.length > 0) {

          player.active.marker.addMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this);
          console.log('marker added');
        }
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

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

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      if (effect.target.marker.hasMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this)) {
        effect.preventDefault = true;
        return state;
      }
    }

    if (effect instanceof EndTurnEffect
      && effect.player.active.marker.hasMarker(this.CLEAR_PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this)) {
      effect.player.active.marker.removeMarker(this.CLEAR_PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER, this);
      });
      console.log('marker removed');
    }

    return state;
  }
}
