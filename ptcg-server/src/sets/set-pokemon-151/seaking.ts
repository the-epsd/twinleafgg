import { CoinFlipPrompt, GameMessage, PlayerType, PokemonCard, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Seaking extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Goldeen';

  public cardType: CardType = W;

  public hp: number = 110;

  public weakness = [{ type: L }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Swim Freely',
      cost: [CardType.WATER],
      damage: 10,
      text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
    },
    {
      name: 'Aqua Horn',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      damageCalculation: '+',
      text: 'This attack does 30 more damage for each [W] Energy attached to this Pokémon.'
    },
  ];

  public regulationMark = 'H';

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '119';

  public name: string = 'Seaking';

  public fullName: string = 'Seaking MEW';

  public readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
    public readonly CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
  
    public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
  
      if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
        const player = effect.player;
        
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
        store.reduceEffect(state, checkProvidedEnergyEffect);

        let energyCount = 0;
        checkProvidedEnergyEffect.energyMap.forEach(em => {
          energyCount += em.provides.filter(cardType =>
            cardType === CardType.WATER || cardType === CardType.ANY
          ).length;
        });

        effect.damage += energyCount * 30;
        
        return state;
      }
      
      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
        state = store.prompt(state, new CoinFlipPrompt(
          player.id, GameMessage.COIN_FLIP
        ), flipResult => {
          if (flipResult) {
            player.active.attackMarker.addMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
            opponent.attackMarker.addMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
          }
        });

        return state;
      }

      if (effect instanceof AbstractAttackEffect
        && effect.target.attackMarker.hasMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER)) {
        effect.preventDefault = true;
        return state;
      }

      if (effect instanceof EndTurnEffect
        && effect.player.attackMarker.hasMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {

        effect.player.attackMarker.removeMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);

        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.attackMarker.removeMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
        });
      }

    return state;
  }
}
