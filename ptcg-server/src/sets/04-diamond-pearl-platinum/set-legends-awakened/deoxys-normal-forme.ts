import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, GameLog, PlayerType, PowerType, State, StateUtils, StoreLike, PokemonCardList } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class DeoxysNormalForme extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Form Change',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may search your deck for any Deoxys and switch it with Deoxys Normal Forme. (Any cards attached to Deoxys Normal Forme, damage counters, Special Conditions, and effects on it are now on the new Pokémon.) If you do, put Deoxys Normal Forme on top of your deck. Shuffle your deck afterward. You can\'t use more than 1 Form Change Poké-Power each turn.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Energy Crush',
    cost: [P, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Does 20 damage plus 10 more damage for each Energy attached to all of your opponent\'s Pokémon.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Deoxys Normal Forme';
  public fullName: string = 'Deoxys Normal Forme LA';

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

    // Energy Crush
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let totalEnergy = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const checkEnergy = new CheckProvidedEnergyEffect(opponent, cardList);
        store.reduceEffect(state, checkEnergy);
        totalEnergy += checkEnergy.energyMap.reduce((sum, e) => sum + e.provides.length, 0);
      });

      effect.damage += 10 * totalEnergy;
    }

    return state;
  }
}
