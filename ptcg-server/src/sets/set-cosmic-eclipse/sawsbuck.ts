import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, ConfirmPrompt, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Sawsbuck extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 100;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Deerling';

  public powers = [{
    name: 'Seasonal Blessings',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may draw a card. '
  }];

  public attacks = [{
    name: 'Bounce',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 60,
    text: 'You may switch this Pokémon with 1 of your Benched Pokémon. '
  }];

  public set = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name = 'Sawsbuck';
  public fullName = 'Sawsbuck CEC';

  public bounceMarker = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.deck.moveTo(player.hand, 1);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      this.bounceMarker = true;
    }

    if (effect instanceof EndTurnEffect && this.bounceMarker == true) {
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_SWITCH_POKEMON,
      ), wantToUse => {
        if (wantToUse) {

          return state = store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false },
          ), selected => {
            if (!selected || selected.length === 0) {
              return state;
            }
            const target = selected[0];
            player.switchPokemon(target);
            this.bounceMarker = false;
          });
        }
      });
    }

    return state;
  }
}