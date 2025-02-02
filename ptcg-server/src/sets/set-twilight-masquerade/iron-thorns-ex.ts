import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, AttachEnergyPrompt, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class IronThornsex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 230;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Initialization',
    powerType: PowerType.ABILITY,
    exemptFromInitialize: true,
    text: 'While this Pokémon is in the Active Spot, Pokémon with a Rule Box in play (except any Future Pokémon) don\'t have any Abilities.'
  }];

  public attacks = [
    {
      name: 'Volt Cyclone',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 140,
      text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '77';

  public name: string = 'Iron Thorns ex';

  public fullName: string = 'Iron Thorns ex TWM';

  private readonly BOLT_CYCLONE_MARKER = 'BOLT_CYCLONE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY && effect.power.name !== 'Initialization') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const ruleBoxTags = [
        CardTag.POKEMON_ex,
        CardTag.POKEMON_V,
        CardTag.POKEMON_VSTAR,
        CardTag.POKEMON_VMAX,
        CardTag.RADIANT
      ];

      // Iron Thorns ex is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      // Pokemon isn't a rule box - don't bother checking to block ability
      if (!ruleBoxTags.some(tag => effect.card.tags.includes(tag))) {
        return state;
      }

      // Try reducing ability for each player  
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }
      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.player.marker.addMarker(this.BOLT_CYCLONE_MARKER, this);
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.BOLT_CYCLONE_MARKER, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      // Then prompt for energy movement
      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
        effect.player.marker.removeMarker(this.BOLT_CYCLONE_MARKER, this);
      });
    }

    return state;
  }
}
