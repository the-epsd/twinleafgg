import { CardType, EnergyType, Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { Effect } from '../../../game/store/effects/effect';
import {
  AttachEnergyPrompt,
  CardTarget,
  Player,
  PlayerType,
  SlotType,
  StoreLike,
  State,
  StateUtils,
  TrainerCard,
  GameMessage,
  GameError,
  pokemonHasCardType,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class TheMaskedRoyal extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '139';
  public name: string = 'The Masked Royal';
  public fullName: string = 'The Masked Royal CES';
  public text: string =
    'Attach a basic Energy card from your hand to one of your Stage 2 Grass, Fire, or Water Pokémon. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    // Need a basic Energy card in hand
    const hasBasicEnergy = player.hand.cards.some(
      (c) => c instanceof EnergyCard && c.energyType === EnergyType.BASIC,
    );
    if (!hasBasicEnergy) {
      return false;
    }
    // Need a Stage 2 Grass, Fire, or Water Pokémon in play
    let hasValidTarget = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      const pokemonCard = cardList.getPokemonCard();
      if (
        pokemonCard &&
        pokemonCard.stage === Stage.STAGE_2 &&
        (pokemonHasCardType(pokemonCard, CardType.GRASS) ||
          pokemonHasCardType(pokemonCard, CardType.FIRE) ||
          pokemonHasCardType(pokemonCard, CardType.WATER))
      ) {
        hasValidTarget = true;
      }
    });
    return hasValidTarget;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Check if player has basic energy in hand
      const hasBasicEnergy = player.hand.cards.some(
        (c) => c instanceof EnergyCard && c.energyType === EnergyType.BASIC,
      );

      // Check if player has a Stage 2 Grass, Fire, or Water Pokemon in play
      let hasValidTarget = false;
      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const pokemonCard = cardList.getPokemonCard();
        if (
          pokemonCard &&
          pokemonCard.stage === Stage.STAGE_2 &&
          (pokemonHasCardType(pokemonCard, CardType.GRASS) ||
            pokemonHasCardType(pokemonCard, CardType.FIRE) ||
            pokemonHasCardType(pokemonCard, CardType.WATER))
        ) {
          hasValidTarget = true;
        } else {
          blocked.push(target);
        }
      });

      if (!hasBasicEnergy || !hasValidTarget) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.hand,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 1, max: 1, allowCancel: false, blockedTo: blocked },
        ),
        (transfers) => {
          transfers = transfers || [];
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, player.hand, target, {
              cards: [transfer.card],
              sourceCard: this,
            });
          }
        },
      );
    }

    return state;
  }
}
