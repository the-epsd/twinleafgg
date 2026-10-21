import { CardTag, CardType, ChooseCardsPrompt, EnergyType, GameError, GameMessage, PokemonCard, pokemonHasCardType, PowerType, Stage, State, StateUtils, StoreLike, SuperType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class HisuianLilligantVstar extends PokemonCard {
  public stage: Stage = Stage.VSTAR;
  protected _tags = [CardTag.POKEMON_VSTAR];
  public evolvesFrom: string = 'Hisuian Lilligant V';
  public hp: number = 260;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Star Perfume',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'During your turn, you may search your deck for up to 5 in any combination of Grass Pokémon and [G] Energy cards, reveal them, and put them into your hand. Then, shuffle your deck. (You can\'t use more than 1 VSTAR Power in a game.)',
  }];

  public attacks = [{
    name: 'Parallel Spin',
    cost: [G, G, C],
    damage: 130,
    damageCalculation: '+',
    text: 'You may put an Energy attached to this Pokémon into your hand. If you do, this attack does 100 more damage.',
  }];

  public regulationMark: string = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Hisuian Lilligant VSTAR';
  public fullName: string = 'Hisuian Lilligant VSTAR ASR 18';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Star Perfume
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      player.usedVSTAR = true;

      if (player.deck.cards.length === 0) {
        return state;
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        const isGrassPokemon = c instanceof PokemonCard && pokemonHasCardType(c, G);
        const isGrassEnergy =
          c.superType === SuperType.ENERGY &&
          c.energyType === EnergyType.BASIC &&
          c.name === 'Grass Energy';
        if (!isGrassPokemon && !isGrassEnergy) {
          blocked.push(index);
        }
      });

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.deck,
          {},
          { min: 0, max: 5, allowCancel: false, blocked },
        ),
        (selected) => {
          const cards = selected || [];
          if (cards.length > 0) {
            MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
            SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          }
          SHUFFLE_DECK(store, state, player);
        },
      );
    }

    // Parallel Spin
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const energyCards = player.active.cards.filter((c) => c.superType === SuperType.ENERGY);
      if (energyCards.length === 0) {
        return state;
      }

      store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.active,
          { superType: SuperType.ENERGY },
          { min: 0, max: 1, allowCancel: false },
        ),
        (selected) => {
          const cards = selected || [];
          if (cards.length > 0) {
            MOVE_CARDS(store, state, player.active, player.hand, { cards, sourceCard: this });
            effect.damage += 100;
          }
        },
      );
    }

    return state;
  }
}
