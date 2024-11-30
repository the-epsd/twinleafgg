import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ConfirmPrompt, MoveEnergyPrompt, PlayerType, SlotType, StateUtils, GameError, PowerType, PokemonCardList, EnergyCard, CardTarget } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class IronLeavesex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 220;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Rapid Vernier',
    powerType: PowerType.ABILITY,
    exemptFromInitialize: true,
    text: 'Once during your turn, when you play this Pokémon from your hand onto your Bench, you may switch this Pokémon with your Active Pokémon. If you do, you may move any number of Energy from your Benched Pokémon to this Pokémon.'
  }];

  public attacks = [
    {
      name: 'Prism Edge',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 180,
      text: 'During your next turn, this Pokémon can\'t attack.',
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '25';

  public name: string = 'Iron Leaves ex';

  public fullName: string = 'Iron Leaves ex TEF';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard == this) {

      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

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

          const cardList = StateUtils.findCardList(state, this);
          const benchIndex = player.bench.indexOf(cardList as PokemonCardList);

          player.switchPokemon(player.bench[benchIndex]);

          const blockedFrom: CardTarget[] = [];
          const blockedTo: CardTarget[] = [];

          let hasEnergyOnBench = false;
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            if (cardList === player.active) {
              blockedFrom.push(target);
              return;
            }
            blockedTo.push(target);
            if (cardList.cards.some(c => c instanceof EnergyCard)) {
              hasEnergyOnBench = true;
            }
          });

          if (hasEnergyOnBench === false) {
            return state;
          }

          return store.prompt(state, new MoveEnergyPrompt(
            player.id,
            GameMessage.MOVE_ENERGY_CARDS,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH, SlotType.ACTIVE], // Only allow moving to active
            { superType: SuperType.ENERGY },
            { allowCancel: false, blockedFrom, blockedTo }
          ), transfers => {

            if (!transfers) {
              return;
            }

            for (const transfer of transfers) {

              // Can only move energy to the active Pokemon
              const target = player.active;
              const source = StateUtils.getTarget(state, player, transfer.from);
              transfers.forEach(transfer => {
                source.moveCardTo(transfer.card, target);
                return state;
              });
            }
          });
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
    }
    return state;
  }
}