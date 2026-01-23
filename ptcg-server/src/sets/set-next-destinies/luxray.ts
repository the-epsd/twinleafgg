import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

export class Luxray extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Luxio';
  public cardType: CardType = L;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [
    {
      name: 'Flash Impact',
      cost: [L],
      damage: 60,
      text: 'Does 20 damage to 1 of your Benched Pokemon.'
    },
    {
      name: 'Crunch',
      cost: [L, L, C],
      damage: 80,
      text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokemon.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Luxray';
  public fullName: string = 'Luxray NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flash Impact - 60 damage to active, 20 to own benched
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const myBenched = player.bench.filter(b => b.cards.length > 0);

      if (myBenched.length > 0) {
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false }
        ), (selected) => {
          if (selected && selected.length > 0) {
            const damageEffect = new PutDamageEffect(effect, 20);
            damageEffect.target = selected[0];
            store.reduceEffect(state, damageEffect);
          }
        });
      }
    }

    // Crunch - flip for energy discard
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const opponentActive = opponent.active;
          const energyCards = opponentActive.cards.filter(c => c.superType === SuperType.ENERGY);
          if (energyCards.length > 0) {
            const discardEffect = new DiscardCardsEffect(effect, energyCards.slice(0, 1));
            discardEffect.target = opponentActive;
            store.reduceEffect(state, discardEffect);
          }
        }
      });
    }

    return state;
  }
}
