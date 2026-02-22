import { CardType, CoinFlipPrompt, GameMessage, PokemonCard, PowerType, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Combusken extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Torchic';
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Natural Cure',
    useWhenInPlay: false,
    powerType: PowerType.POKEBODY,
    text: 'When you attach a [R] Energy card from your hand to Combusken, remove all Special Conditions from Combusken.'
  }];

  public attacks = [{
    name: 'Lunge',
    cost: [C, C],
    damage: 50,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'RS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Combusken';
  public fullName: string = 'Combusken RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }

    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      if (effect.target.specialConditions.length === 0) {
        return state;
      }

      if (!effect.energyCard.provides.includes(CardType.FIRE)) {
        return state;
      }

      const pokemonCard = effect.target.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const conditions = effect.target.specialConditions.slice();
      conditions.forEach(condition => {
        effect.target.removeSpecialCondition(condition);
      });
    }

    return state;
  }
}