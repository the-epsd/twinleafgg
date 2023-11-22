import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { ChoosePokemonPrompt, PlayerType, PokemonCard, SlotType, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class HisuianGoodraV extends PokemonCard {
  
  public stage: Stage = Stage.BASIC;

  public cardTag = [ CardTag.POKEMON_V ];

  public regulationMark = 'F';
  
  public cardType: CardType = CardType.DRAGON;
  
  public hp: number = 220;
  
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];
  
  public attacks = [
    {
      name: 'Slip-\'n\'-Trip',
      cost: [ CardType.WATER, CardType.METAL ],
      damage: 60,
      text: 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.'
    },
    {
      name: 'Rolling Shell',
      cost: [ CardType.WATER, CardType.METAL, CardType.COLORLESS ],
      damage: 140,
      text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
    }
  ];
  
  public set: string = 'LOR';

  public set2: string = 'lostorigin';

  public setNumber: string = '135';
  
  public name: string = 'Hisuian Goodra V';
  
  public fullName: string = 'Hisuian Goodra V LOR';

  ROLLING_SHELL_MARKER = 'ROLLING_SHELL_MARKER';

  CLEAR_ROLLING_SHELL_MARKER = 'CLEAR_ROLLING_SHELL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentHasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!opponentHasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { allowCancel: false },
      ), selected => {
        if (!selected || selected.length === 0) {
          return state;
        }
        const target = selected[0];
        opponent.switchPokemon(target);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.ROLLING_SHELL_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_ROLLING_SHELL_MARKER, this);

      if (effect instanceof PutDamageEffect 
        && effect.target.marker.hasMarker(this.ROLLING_SHELL_MARKER)) {
        effect.damage -= 30;
        return state;
      }
      if (effect instanceof EndTurnEffect 
        && effect.player.marker.hasMarker(this.CLEAR_ROLLING_SHELL_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_ROLLING_SHELL_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.ROLLING_SHELL_MARKER, this);
        });
      }
      return state;
    }
    return state;
  }
}