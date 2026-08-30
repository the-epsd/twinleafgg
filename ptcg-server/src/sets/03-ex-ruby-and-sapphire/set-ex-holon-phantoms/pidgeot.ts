import {
  AttachEnergyPrompt,
  Card,
  CardTag,
  CardType,
  ChooseEnergyPrompt,
  GameMessage,
  Player,
  PlayerType,
  PokemonCard,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { HANDLE_ABILITY_BLOCK, POKEPOWER_TYPES } from '../../../game/store/prefabs/ability-lock';
import {
  CONFIRMATION_PROMPT,
  IS_POKEBODY_BLOCKED,
  MOVE_CARDS,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Pidgeot extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Pidgeotto';
  protected _tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType[] = [L, M];
  public hp: number = 100;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [
    {
      name: 'Delta Reserve',
      powerType: PowerType.POKEBODY,
      text: "As long as Pidgeot has any Holon Energy cards attached to it, each player's Pokémon (excluding Pokémon that has δ on its card) can't use any Poké-Powers.",
    },
  ];

  public attacks = [
    {
      name: 'Rotating Claws',
      cost: [L, M, C],
      damage: 50,
      text: 'You may discard an Energy card attached to Pidgeot. If you do, search your discard pile for an Energy card (excluding the one you discarded) and attach it to Pidgeot.',
    },
  ];

  public set: string = 'HP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Pidgeot';
  public fullName: string = 'Pidgeot HP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Refs: set-ex-legend-maker/muk.ts (HANDLE_ABILITY_BLOCK),
    // set-ex-holon-phantoms/latias.ts (in-play lock),
    // set-ex-delta-species/rayquaza.ts (Holon Energy check)
    HANDLE_ABILITY_BLOCK(
      effect,
      ({ player, card }) => {
        let isThisInPlay = false;
        let hasHolonEnergy = false;
        let owner: Player | undefined;

        [player, StateUtils.getOpponent(state, player)].forEach((p) => {
          p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemon) => {
            if (pokemon === this) {
              isThisInPlay = true;
              owner = p;
              hasHolonEnergy = cardList.cards.some(
                (c) => c.superType === SuperType.ENERGY && c.name.includes('Holon Energy'),
              );
            }
          });
        });

        if (!isThisInPlay || !hasHolonEnergy || !owner) {
          return false;
        }

        if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
          return false;
        }

        if (card.hasTag(CardTag.DELTA_SPECIES)) {
          return false;
        }

        return true;
      },
      {
        powerTypes: POKEPOWER_TYPES,
        error: GameMessage.BLOCKED_BY_ABILITY,
      },
    );

    // Ref: set-ex-dragon-frontiers/charizard-star.ts (Rotating Claws)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      if (checkProvidedEnergy.energyMap.length === 0) {
        return state;
      }

      CONFIRMATION_PROMPT(
        store,
        state,
        player,
        (result) => {
          if (!result) {
            return;
          }

          state = store.prompt(
            state,
            new ChooseEnergyPrompt(
              player.id,
              GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
              checkProvidedEnergy.energyMap,
              [CardType.COLORLESS],
              { allowCancel: false },
            ),
            (energy) => {
              const cards: Card[] = (energy || []).map((e) => e.card);
              if (cards.length === 0) {
                return;
              }

              const discarded = cards[0];
              const discardEnergy = new DiscardCardsEffect(effect, cards);
              discardEnergy.target = player.active;
              store.reduceEffect(state, discardEnergy);

              const blocked: number[] = [];
              player.discard.cards.forEach((card, index) => {
                if (card === discarded || card.superType !== SuperType.ENERGY) {
                  blocked.push(index);
                }
              });

              const hasOtherEnergy = player.discard.cards.some(
                (card, index) => !blocked.includes(index),
              );
              if (!hasOtherEnergy) {
                return;
              }

              state = store.prompt(
                state,
                new AttachEnergyPrompt(
                  player.id,
                  GameMessage.ATTACH_ENERGY_TO_ACTIVE,
                  player.discard,
                  PlayerType.BOTTOM_PLAYER,
                  [SlotType.ACTIVE],
                  { superType: SuperType.ENERGY },
                  { allowCancel: false, min: 1, max: 1, blocked },
                ),
                (transfers) => {
                  transfers = transfers || [];
                  if (transfers.length === 0) {
                    return;
                  }

                  for (const transfer of transfers) {
                    const target = StateUtils.getTarget(state, player, transfer.to);
                    MOVE_CARDS(store, state, player.discard, target, {
                      cards: [transfer.card],
                      sourceCard: this,
                      sourceEffect: this.attacks[0],
                    });
                  }
                },
              );
            },
          );
        },
        GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK,
      );
    }

    return state;
  }
}
