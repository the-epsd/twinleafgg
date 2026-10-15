import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, ChoosePokemonPrompt, EnergyCard, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Smoochum extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'Baby Evolution',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may put Jynx from your hand onto Smoochum (this counts as evolving Smoochum) and remove all damage counters from Smoochum.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Psykiss',
    cost: [],
    damage: 0,
    text: 'Flip a coin. If heads, choose a Special Energy card attached to 1 of your opponent\'s Pokémon and have your opponent shuffle that card into his or her deck.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Smoochum';
  public fullName: string = 'Smoochum SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Baby Evolution
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const hasEvolution = player.hand.cards.some(card => card instanceof PokemonCard && card.name === 'Jynx');
      if (!hasEvolution) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.name !== 'Jynx') {
          blocked.push(index);
        }
      });
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_EVOLVE,
        player.hand,
        { superType: SuperType.POKEMON },
        { min: 1, max: 1, allowCancel: true, blocked }
      ), selected => {
        const selectedCards = selected || [];
        if (selectedCards.length === 0) {
          return;
        }
        const evolution = selectedCards[0] as PokemonCard;
        const target = StateUtils.findCardList(state, this);
        MOVE_CARDS(store, state, player.hand, target, { cards: [evolution], sourceCard: this });
        const pokemonTarget = target as PokemonCardList;
        pokemonTarget.clearEffects();
        pokemonTarget.pokemonPlayedTurn = state.turn;
        const healEffect = new HealEffect(player, pokemonTarget, pokemonTarget.damage);
        store.reduceEffect(state, healEffect);
      });
    }

    // Psykiss
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }

        const blocked: any[] = [];
        let hasSpecial = false;
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
          const specialEnergies = cardList.cards.filter(c =>
            c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL
          );
          if (specialEnergies.length === 0) {
            blocked.push(target);
          } else {
            hasSpecial = true;
          }
        });

        if (!hasSpecial) {
          return;
        }

        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false, blocked }
        ), selected => {
          const target = selected && selected[0];
          if (!target) {
            return;
          }
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DECK,
            target,
            { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
            { min: 1, max: 1, allowCancel: false }
          ), cards => {
            const chosen = cards || [];
            if (chosen.length > 0) {
              MOVE_CARDS(store, state, target, opponent.deck, { cards: chosen, sourceCard: this });
              SHUFFLE_DECK(store, state, opponent);
            }
          });
        });
      });
    }

    return state;
  }
}
