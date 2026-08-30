import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class ShadowRiderCalyrexV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'E';
  public cardType: CardType[] = [P];
  protected _tags = [CardTag.POKEMON_V];
  public hp: number = 210;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Shadow Mist',
    cost: [P],
    damage: 10,
    text: 'During your opponent\'s next turn, they can\'t play any Special Energy or Stadium cards from their hand.'
  },
  {
    name: 'Astral Barrage',
    cost: [C, C, C],
    damage: 0,
    text: 'Choose 2 of your opponent\'s Pokémon and put 5 damage counters on each of them.'
  }];

  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Shadow Rider Calyrex V';
  public fullName: string = 'Shadow Rider Calyrex V CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shadow Mist
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { specialEnergy: true, stadium: true });
    }

    // Astral Barrage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      if (benched === 0) {
        return state;
      }
      const max = Math.min(2, benched);
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: max, max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutCountersEffect(effect, 50);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
      });
    }
    return state;
  }
}
