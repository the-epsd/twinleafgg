import { CardTag, CardType, GameMessage, PlayerType, PokemonCard, PokemonCardList, PowerType, Stage, State, StateUtils, StoreLike } from "../../../game";
import { CheckPokemonTypeEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { HANDLE_ABILITY_BLOCK, POKEPOWER_TYPES } from "../../../game/store/prefabs/ability-lock";
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from "../../../game/store/prefabs/attack-effects";
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, COIN_FLIP_PROMPT } from "../../../game/store/prefabs/prefabs";

export class Solrock extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [
    {
      name: 'Luna Shade',
      powerType: PowerType.POKEBODY,
      text: "As long as you have Lunatone in play, each player's [C] Pokémon (excluding Pokémon-ex) can't use any Poké-Powers.",
    },
  ];

  public attacks = [{
    name: 'Call for Family',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Lunatone and put it onto your Bench. Shuffle your deck afterward.'
  }, {
    name: 'Hyper Beam',
    cost: [F],
    damage: 0,
    text: 'Flip a coin. If heads, discard an Energy card attached to the Defending Pokémon.'
  }];

  public set: string = 'LM';
  public name: string = 'Solrock';
  public fullName: string = 'Solrock LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    HANDLE_ABILITY_BLOCK(
      effect,
      ({ player, card }) => {
        const thisCardList = StateUtils.findCardList(state, this);
        const owner = StateUtils.findOwner(state, thisCardList);
        const opponent = StateUtils.getOpponent(state, player);

        if (IS_POKEBODY_BLOCKED(store, state, opponent, this)) {
          return false;
        }

        let isLunatoneInPlay = false;
        let isThisInPlay = false;
        owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemon) => {
          if (pokemon.name === 'Lunatone') {
            isLunatoneInPlay = true;
          }
          if (pokemon === this) {
            isThisInPlay = true;
          }
        });

        if (!isLunatoneInPlay || !isThisInPlay) {
          return false;
        }

        if (card.hasTag(CardTag.POKEMON_ex)) {
          return false;
        }

        try {
          const cardList = StateUtils.findCardList(state, card);
          if (cardList instanceof PokemonCardList) {
            const checkPokemonType = new CheckPokemonTypeEffect(cardList);
            store.reduceEffect(state, checkPokemonType);
            return checkPokemonType.cardTypes.includes(CardType.COLORLESS);
          }
        } catch {
          return false;
        }
        return card.cardType === CardType.COLORLESS;
      },
      {
        powerTypes: POKEPOWER_TYPES,
        error: GameMessage.BLOCKED_BY_EFFECT,
      },
    );

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.name === 'Lunatone') {
          return;
        } else {
          blocked.push(index);
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store,
        state,
        effect.player,
        {},
        { min: 0, max: 1, blocked },
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        }
      });
    }

    return state;
  }
}
