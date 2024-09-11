import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, AttachEnergyPrompt, PlayerType, SlotType, StateUtils, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

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

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Iron Thorns ex is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, effect.card);
      if (cardList instanceof PokemonCardList) {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
      }

      // We are not blocking the Abilities from Future Pokemon
      // if (effect.power.exemptFromInitialize) {
      //   return state;
      // }

      // Try reducing ability for each player  
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {

        if (effect.card.tags.includes(CardTag.POKEMON_ex) ||
          effect.card.tags.includes(CardTag.POKEMON_V) ||
          effect.card.tags.includes(CardTag.POKEMON_VSTAR) ||
          effect.card.tags.includes(CardTag.POKEMON_VMAX) ||
          effect.card.tags.includes(CardTag.RADIANT) && !effect.power.exemptFromInitialize) {

          if (!effect.power.exemptFromAbilityLock) {
            throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
          }
        }
        return state;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.player.attackMarker.addMarker(this.BOLT_CYCLONE_MARKER, this);
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.BOLT_CYCLONE_MARKER, this)) {
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
        effect.player.attackMarker.removeMarker(this.BOLT_CYCLONE_MARKER, this);
      });
    }

    return state;
  }
}
