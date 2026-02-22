import { PlayerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AFTER_ATTACK, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class HisuianZoroark extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Hisuian Zorua';

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

  // Two-phase KO marker: after Doom Curse, mark the opponent's active.
  // At end of opponent's next turn, transition to CLEAR marker.
  // At end of THAT same EndTurnEffect, KO the marked pokemon.
  // Ref: set-forbidden-light/aegislash.ts (Ticking Knock Out - 2-marker KO)
  public readonly DOOM_CURSE_MARKER = 'HISUIAN_ZOROARK_ASR_DOOM_CURSE_MARKER';
  public readonly CLEAR_DOOM_CURSE_MARKER = 'HISUIAN_ZOROARK_ASR_CLEAR_DOOM_CURSE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Doom Curse: mark opponent's active pokemon with doom marker
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.DOOM_CURSE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;

      // Phase 2: CLEAR marker present on any pokemon → KO it
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.marker.hasMarker(this.CLEAR_DOOM_CURSE_MARKER, this)) {
          const checkHp = new CheckHpEffect(player, cardList);
          store.reduceEffect(state, checkHp);
          cardList.damage = checkHp.hp;
          cardList.marker.removeMarker(this.DOOM_CURSE_MARKER, this);
          cardList.marker.removeMarker(this.CLEAR_DOOM_CURSE_MARKER, this);
        }
      });

      // Phase 1: DOOM marker present → transition to CLEAR marker
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.marker.hasMarker(this.DOOM_CURSE_MARKER, this)
          && !cardList.marker.hasMarker(this.CLEAR_DOOM_CURSE_MARKER, this)) {
          cardList.marker.addMarker(this.CLEAR_DOOM_CURSE_MARKER, this);
        }
      });
    }

    // Call Back: put a card from discard pile into hand
    if (AFTER_ATTACK(effect, 1, this)) {
      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, effect.player, this, {}, { min: 1, max: 1, allowCancel: false }, this.attacks[1]);
    }

    return state;
  }

}
