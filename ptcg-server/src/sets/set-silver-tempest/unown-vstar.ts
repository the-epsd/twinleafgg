import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, PlayerType, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { ADD_MARKER, HAS_MARKER, IS_ABILITY_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonPowersEffect, CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';

export class UnownVSTAR extends PokemonCard {

  public tags = [CardTag.POKEMON_VSTAR];
  public regulationMark = 'F';
  public stage: Stage = Stage.VSTAR;
  public evolvesFrom = 'Unown V';
  public cardType: CardType = P;
  public hp: number = 250;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Tri Power',
      cost: [P],
      damage: 70,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 70 damage for each heads.'
    },
    {
      name: 'Star Cipher',
      cost: [C, C, C],
      damage: 0,
      text: 'Until this Pokémon leaves play, it gains an Ability that has the effect "The Weakness of each of your opponent\'s Pokémon in play is now [P]. (The amount of Weakness doesn\'t change.)" (You can\'t use more than 1 VSTAR Power in a game.)'
    },
  ];

  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Unown VSTAR';
  public fullName: string = 'Unown VSTAR SIT';

  public readonly STAR_CIPHER_MARKER = 'STAR_CIPHER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });
        effect.damage = 70 * heads;
      });
    }

    // Star Cipher
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      ADD_MARKER(this.STAR_CIPHER_MARKER, player, this);
      player.usedVSTAR = true;
    }

    if (effect instanceof CheckPokemonPowersEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      if (!HAS_MARKER(this.STAR_CIPHER_MARKER, player, this)) {
        return state;
      }

      // Add the power
      effect.powers.push({
        name: 'Star Cipher',
        powerType: PowerType.ABILITY,
        text: 'The Weakness of each of your opponent\'s Pokémon in play is now [P]. (The amount of Weakness doesn\'t change.)',
      });
    }

    if (effect instanceof CheckPokemonStatsEffect) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = effect.target;

      // Check for opponent's Unown VSTAR
      let isUnownInPlay = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isUnownInPlay = true;
        }
      });

      // Return if no Unown VSTAR 
      if (!isUnownInPlay) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      if (!HAS_MARKER(this.STAR_CIPHER_MARKER, opponent, this)) {
        return state;
      }

      // Check if weakness can be changed
      const canApplyAbility = new EffectOfAbilityEffect(opponent, this.powers[0], this, pokemonCard);
      store.reduceEffect(state, canApplyAbility);
      if (canApplyAbility.target) {
        effect.weakness = [{ type: CardType.PSYCHIC }];
      }
    }

    return state;
  }
}  