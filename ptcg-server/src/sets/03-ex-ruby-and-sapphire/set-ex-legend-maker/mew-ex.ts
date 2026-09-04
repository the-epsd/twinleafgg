import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../../game/store/card/card-types';
import {
  PowerType,
  StoreLike,
  State,
  StateUtils,
  GameError,
  GameMessage,
  PlayerType,
  SlotType,
  AttachEnergyPrompt,
  ShuffleDeckPrompt,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COPY_ATTACK_VIA_ABILITY } from '../../../game/store/prefabs/copy-attack-prefabs';
import {
  CONFIRMATION_PROMPT,
  IS_POKEBODY_BLOCKED,
  MOVE_CARDS,
  SWITCH_ACTIVE_WITH_BENCHED,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class Mewex extends PokemonCard {
  protected _tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [
    {
      name: 'Versatile',
      useWhenInPlay: true,
      powerType: PowerType.POKEBODY,
      text: 'Mew ex can use the attacks of all Pokémon in play as its own. (You still need the necessary Energy to use each attack.)',
    },
  ];

  public attacks = [
    {
      name: 'Power Move',
      cost: [P, C],
      damage: 0,
      text: 'Search your deck for an Energy card and attach it to Mew ex. Shuffle your deck afterward. Then, you may switch Mew ex with 1 of your Benched Pokémon.',
    },
  ];

  public set: string = 'LM';
  public name: string = 'Mew ex';
  public fullName: string = 'Mew ex LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.ABILITY_BLOCKED);
      }
      return COPY_ATTACK_VIA_ABILITY(store, state, effect, {
        copycatCard: this,
        includeOpponent: true,
        filter: (_cardList, card) => !(card instanceof Mewex),
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.deck,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE],
          { superType: SuperType.ENERGY },
          { allowCancel: false, min: 0, max: 1 },
        ),
        (transfers) => {
          transfers = transfers || [];
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, player.deck, target, {
              cards: [transfer.card],
              sourceCard: this,
              sourceEffect: this.attacks[0],
            });
          }

          state = store.prompt(state, new ShuffleDeckPrompt(player.id), (order) => {
            player.deck.applyOrder(order);
          });

          CONFIRMATION_PROMPT(store, state, player, (result) => {
            if (result) {
              SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
            }
          });
        },
      );
    }
    return state;
  }
}
