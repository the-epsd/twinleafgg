import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType, PowerType, GameError } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Rowlet extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 50;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Sky Circus',
      powerType: PowerType.ABILITY,
      text: 'If you played Bird Keeper from your hand during this turn, ignore all Energy in this Pokemon\'s attack costs.',
    }
  ];

  public attacks = [
    {
      name: 'Wind Shard',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 60 damage to 1 of your opponent\'s Benched Pokemon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public regulationMark = 'D';

  public set: string = 'DAA';

  public setNumber: string = '11';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Rowlet';

  public fullName: string = 'Rowlet DAA';

  private readonly ROWLET_SKY_CIRCUS_MARKER = 'ROWLET_SKY_CIRCUS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sky Circus
    if (effect instanceof TrainerEffect && effect.trainerCard.name == 'Bird Keeper') {
      // Put a "played Bird Keeper this turn" marker on ourselves.
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      effect.player.marker.addMarker(this.ROWLET_SKY_CIRCUS_MARKER, effect.trainerCard);
    }

    if (effect instanceof CheckAttackCostEffect && effect.player.marker.hasMarker(this.ROWLET_SKY_CIRCUS_MARKER)) {
      // If we have the marker, the attack cost will be free.
      effect.cost = [];
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      // Remove marker at the end of turn.
      effect.player.marker.removeMarker(this.ROWLET_SKY_CIRCUS_MARKER);
    }

    // Wind Shard
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Can't use the attack if opponent has no bench.
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) { throw new GameError(GameMessage.CANNOT_USE_POWER); }

      // Choose a benched pokemon and then put 60 damage on it.
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 60);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }

}