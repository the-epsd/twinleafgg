import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, StateUtils, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class SalazzleGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Salandit';

  public cardType: CardType = R;

  public hp: number = 200;

  public weakness = [{ type: W }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Diabolical Claws',
      cost: [R, R],
      damage: 50,
      text: ' This attack does 50 damage for each Prize card you have taken.'
    },
    {
      name: 'Heat Blast',
      cost: [R, R],
      damage: 110,
      text: ''
    },
    {
      name: 'Queen\'s Haze-GX',
      cost: [R, R],
      damage: 0,
      gxAttack: true,
      text: 'Discard all Energy from your opponent\'s Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'BUS';

  public setNumber: string = '25';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Salazzle-GX';

  public fullName: string = 'Salazzle-GX BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Diabolical Claws
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      effect.damage = (6 - player.getPrizeLeft()) * 50;
    }

    // Queen's Haze-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      const opponentEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      state = store.reduceEffect(state, opponentEnergy);

      const oppCards: Card[] = [];

      opponentEnergy.energyMap.forEach(em => {
        oppCards.push(em.card);
      });

      const discardEnergy2 = new DiscardCardsEffect(effect, oppCards);
      discardEnergy2.target = opponent.active;
      store.reduceEffect(state, discardEnergy2);
    }

    return state;
  }
}