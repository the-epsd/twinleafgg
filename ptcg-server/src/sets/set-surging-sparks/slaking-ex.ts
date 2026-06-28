import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {
  StoreLike,
  State,
  PokemonCardList,
  StateUtils,
  GameMessage,
  Power,
  PowerType,
  ChooseEnergyPrompt,
  Card,
  PlayerType,
  GameError,
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Slakingex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Vigoroth';
  public tags: string[] = [CardTag.POKEMON_ex];
  public cardType: CardType = C;
  public hp: number = 340;
  public weakness = [{ type: F }];
  public retreat = [C, C, C, C];

  public powers: Power[] = [
    {
      name: 'Born to Slack',
      powerType: PowerType.ABILITY,
      text: "If your opponent has no Pokémon ex or Pokémon V in play, this Pokémon can't attack.",
    },
  ];

  public attacks = [
    {
      name: 'Great Swing',
      cost: [C, C],
      damage: 280,
      text: 'Discard an Energy from this Pokémon.',
    },
  ];

  public set: string = 'SSP';
  public setNumber = '147';
  public cardImage = 'assets/cardback.png';
  public regulationMark: string = 'H';
  public name: string = 'Slaking ex';
  public fullName: string = 'Slaking ex SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check each of our opponent's Pokemon to see if they have an ex or V.
      let hasSpecialPokemon = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (
          card.tags.includes(CardTag.POKEMON_ex) ||
          card.tags.includes(CardTag.POKEMON_V) ||
          card.tags.includes(CardTag.POKEMON_VMAX) ||
          card.tags.includes(CardTag.POKEMON_VSTAR) ||
          card.tags.includes(CardTag.POKEMON_VUNION)
        ) {
          hasSpecialPokemon = true;
        }
      });

      // If we don't have a ex or V in play, block the attack.
      if (!IS_ABILITY_BLOCKED(store, state, player, this) && !hasSpecialPokemon) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    // Great Swing
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
      state = store.reduceEffect(state, checkProvidedEnergy);

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
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
        },
      );
    }

    return state;
  }
}
