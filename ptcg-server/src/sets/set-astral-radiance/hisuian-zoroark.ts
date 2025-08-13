import { State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AFTER_ATTACK, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';


export class HisuianZoroark extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Hisuian Zoroark';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Doom Curse',
      cost: [],
      damage: 0,
      text: 'At the end of your opponent\'s next turn, the Defending Pokémon will be Knocked Out.'
    },
    {
      name: 'Call Back',
      cost: [CardType.PSYCHIC],
      damage: 10,
      text: 'Put a card from your discard pile into your hand.'
    }
  ];
  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '76';

  public name: string = 'Hisuian Zoroark';

  public fullName: string = 'Hisuian Zoroark ASR';

  public CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
  public KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AbstractAttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.active.marker.addMarker(this.KNOCKOUT_MARKER, this);

      if (effect instanceof EndTurnEffect
        && opponent.active.marker.hasMarker(this.KNOCKOUT_MARKER, this)) {
        opponent.active.marker.addMarker(this.CLEAR_KNOCKOUT_MARKER, this);
      }

      if (effect instanceof EndTurnEffect
        && opponent.active.marker.hasMarker(this.CLEAR_KNOCKOUT_MARKER, this)) {
        opponent.active.hp = 0;
      }
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, effect.player, this, {}, { min: 1, max: 1, allowCancel: false }, this.attacks[1]);
    }

    return state;
  }

}
