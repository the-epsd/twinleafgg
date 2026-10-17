import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, GameLog, PowerType, State, StateUtils, StoreLike, PokemonCardList } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { PREVENT_EFFECTS_OF_ATTACKS, THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class DeoxysDefenseForme extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 100;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Form Change',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may search your deck for any Deoxys and switch it with Deoxys Defense Forme. (Any cards attached to Deoxys Defense Forme, damage counters, Special Conditions, and effects on it are now on the new Pokémon.) If you do, put Deoxys Defense Forme on top of your deck. Shuffle your deck afterward. You can\'t use more than 1 Form Change Poké-Power each turn.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Psychic Defense',
    cost: [P, C, C],
    damage: 40,
    text: 'During your opponent\'s next turn, prevent all effects of an attack, and any damage done to Deoxys by attacks is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Deoxys Defense Forme';
  public fullName: string = 'Deoxys Defense Forme LA';

  public readonly FORME_CHANGE_MARKER = 'FORME_CHANGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect && HAS_MARKER(this.FORME_CHANGE_MARKER, effect.player)) {
      REMOVE_MARKER(this.FORME_CHANGE_MARKER, effect.player);
    }

    // Form Change
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const targetCardList = StateUtils.findCardList(state, this);
      if (!(targetCardList instanceof PokemonCardList)) {
        throw new GameError(GameMessage.INVALID_TARGET);
      }

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (HAS_MARKER(this.FORME_CHANGE_MARKER, player)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard) || !card.name.includes('Deoxys')) {
          blocked.push(index);
        }
      });

      state = store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          player.deck,
          { superType: SuperType.POKEMON },
          { min: 1, max: 1, allowCancel: true, blocked },
        ),
        (selection) => {
          if (selection.length <= 0) {
            return state;
          }

          const pokemonCard = selection[0];
          if (!(pokemonCard instanceof PokemonCard)) {
            return state;
          }

          store.log(state, GameLog.LOG_PLAYER_TRANSFORMS_INTO_POKEMON, {
            name: player.name,
            pokemon: this.name,
            card: pokemonCard.name,
            effect: effect.power.name,
          });
          MOVE_CARDS(store, state, player.deck, targetCardList, { cards: [pokemonCard], sourceCard: this });
          MOVE_CARDS(store, state, targetCardList, player.deck, { cards: [this], sourceCard: this });

          SHUFFLE_DECK(store, state, player);
          ADD_MARKER(this.FORME_CHANGE_MARKER, player, this);
          ABILITY_USED(player, this);
        },
      );
    }

    // Psychic Defense
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 20);
    }

    return state;
  }
}
