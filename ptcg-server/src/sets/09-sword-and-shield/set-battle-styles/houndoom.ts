import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag, EnergyType } from '../../../game/store/card/card-types';
import {
  PowerType,
  GameMessage,
  PlayerType,
  SlotType,
  AttachEnergyPrompt,
  StateUtils,
  State,
  StoreLike,
  CardTarget,
  GameError,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import {
  ABILITY_USED,
  IS_ABILITY_BLOCKED,
  MOVE_CARDS,
  REMOVE_MARKER_AT_END_OF_TURN,
  SHUFFLE_DECK,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class Houndoom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  protected _tags = [CardTag.SINGLE_STRIKE];
  public evolvesFrom = 'Houndour';
  public hp: number = 130;
  public cardType: CardType[] = [D];
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Single Strike Roar',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for a Single Strike Energy card and attach it to 1 of your Single Strike Pokémon. Then, shuffle your deck. If you attached Energy to a Pokémon in this way, put 2 damage counters on that Pokémon.',
  }];

  public attacks = [{
    name: 'Darkness Fang',
    cost: [D, C],
    damage: 50,
    text: '',
  }];

  public regulationMark = 'E';
  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Houndoom';
  public fullName: string = 'Houndoom BST';

  public readonly SINGLE_STRIKE_ROAR_MARKER = 'SINGLE_STRIKE_ROAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.SINGLE_STRIKE_ROAR_MARKER, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SINGLE_STRIKE_ROAR_MARKER, this);

    // Single Strike Roar
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (player.marker.hasMarker(this.SINGLE_STRIKE_ROAR_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.hasTag(CardTag.SINGLE_STRIKE)) {
          blocked2.push(target);
        }
      });

      state = store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.deck,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          {
            superType: SuperType.ENERGY,
            energyType: EnergyType.SPECIAL,
            name: 'Single Strike Energy',
          },
          { allowCancel: false, min: 0, max: 1, blockedTo: blocked2 },
        ),
        (transfers) => {
          transfers = transfers || [];
          ABILITY_USED(player, this);
          if (transfers.length === 0) {
            SHUFFLE_DECK(store, state, player);
            return;
          }
          player.marker.addMarker(this.SINGLE_STRIKE_ROAR_MARKER, this);
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, player.deck, target, { cards: [transfer.card], sourceCard: this });
            SHUFFLE_DECK(store, state, player);
            store.reduceEffect(
              state,
              new PlaceDamageCountersEffect(player, target, 20, this, this.powers[0]),
            );
          }
        },
      );

      return state;
    }

    return state;
  }
}
