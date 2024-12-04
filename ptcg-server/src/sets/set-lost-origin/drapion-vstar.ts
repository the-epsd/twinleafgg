/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, BoardEffect } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class DrapionVSTAR extends PokemonCard {

  public tags = [CardTag.POKEMON_VSTAR];

  public evolvesFrom = 'Drapion V';

  public regulationMark = 'F';

  public stage: Stage = Stage.VSTAR;

  public cardType: CardType = CardType.DARK;

  public hp: number = 270;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Hazard Star',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'During your turn, you may make your opponent\'s Active Pokémon Paralyzed and Poisoned. During Pokémon Checkup, put 3 damage counters on that Pokémon instead of 1. (You can\'t use more than 1 VSTAR Power in a game.)'
  }];

  public attacks = [
    {
      name: 'Big Bang Arm',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: 250,
      damageCalculation: '-',
      text: 'This attack does 10 less damage for each damage counter on this Pokémon.'
    }
  ];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '119';

  public name: string = 'Drapion VSTAR';

  public fullName: string = 'Drapion VSTAR LOR';

  // Implement ability
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.usedVSTAR) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      player.usedVSTAR = true;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });
      opponent.active.addSpecialCondition(SpecialCondition.POISONED);
      opponent.active.addSpecialCondition(SpecialCondition.PARALYZED);
      opponent.active.poisonDamage = 60;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage -= effect.player.active.damage;
      return state;
    }

    return state;
  }
}
