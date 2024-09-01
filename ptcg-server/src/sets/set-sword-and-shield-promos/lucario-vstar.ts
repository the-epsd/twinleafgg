import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType, EnergyCard, GameError, GameMessage } from '../../game';


export class LucarioVSTAR extends PokemonCard {

  public stage: Stage = Stage.VSTAR;

  public tags = [CardTag.POKEMON_VSTAR];

  public evolvesFrom = 'Lucario V';

  public cardType: CardType = CardType.FIGHTING;

  public regulationMark = 'F';

  public hp: number = 270;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Fighting Knuckle',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is a Pokémon V, this attack does 120 more damage.'
    },
    {
      name: 'Aura Star',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 70,
      damageCalculation: 'x',
      text: 'This attack does 70 damage for each Energy attached to all of your opponent\'s Pokémon. (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];

  public set: string = 'SWSH';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '214';

  public name: string = 'Lucario VSTAR';

  public fullName: string = 'Lucario VSTAR SWSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const defending = opponent.active.getPokemonCard();
      if (defending && defending.tags.includes(CardTag.POKEMON_V) || defending && defending.tags.includes(CardTag.POKEMON_VSTAR) || defending && defending.tags.includes(CardTag.POKEMON_VMAX)) {
        effect.damage += 120;
        return state;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      let totalEnergy = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        totalEnergy += cardList.cards.filter(c => c instanceof EnergyCard).length;
      });
      effect.damage += totalEnergy * 70;
      player.usedVSTAR = true;
    }
    return state;
  }
}
