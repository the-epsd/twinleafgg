import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, PlayerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Kingambit extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Bisharp';

  public cardType: CardType = CardType.DARK;

  public hp: number = 170;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Leadership',
    powerType: PowerType.ABILITY,
    text: 'Your Basic Pokémon\'s attacks do 30 more damage to your opponent’s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Hack At',
      cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: 160,
      text: ''
    }
  ];

  public set: string = 'SVI';

  public setNumber = '134';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Kingambit';

  public fullName: string = 'Kingambit SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Leadership
    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // checking if this pokemon is in play
      let isThisInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });
      if (!isThisInPlay) {
        return state;
      }

      // making this only affect our pokemon's damage if it's a basic 
      // (wow this is actually garbage in standard why does it only affect basics and not every stage of pokemon)
      const oppActive = opponent.active.getPokemonCard();
      const damageSource = effect.source.getPokemonCard();

      if (damageSource && damageSource.stage === Stage.BASIC && damageSource !== oppActive) {
        effect.damage += 30;
        return state;
      }
    }

    return state;
  }
}