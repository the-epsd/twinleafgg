import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, GameError, ConfirmPrompt, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';

export class Gastly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: D, value: 10 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Pitch Dark',
      cost: [],
      damage: 0,
      text: 'You opponent can\'t play any Trainer cards from his or her hand during your opponent\'s next turn.',
    },
    {
      name: 'Trick Gas',
      cost: [P],
      damage: 10,
      text: 'You may switch Gastly with 1 of your Benched Pokémon.',
    }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '62';
  public name: string = 'Gastly';
  public fullName: string = 'Gastly SF';

  public readonly OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    }

    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
            PlayerType.BOTTOM_PLAYER,
            [ SlotType.BENCH ],
            { allowCancel: true },
          ), selected => {
            if (!selected || selected.length === 0) {
              return state;
            }
            const target = selected[0];
            player.switchPokemon(target);
          });
        }
        return state;
      });
    }
    return state;
  }
}