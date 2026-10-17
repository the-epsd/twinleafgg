import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, ChoosePokemonPrompt, GameError, GameMessage, GameLog, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike, PokemonCardList } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterDamageEffect } from '../../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class DeoxysSpeedForme extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P }];
  public retreat = [];

  public powers = [{
    name: 'Form Change',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may search your deck for any Deoxys and switch it with Deoxys Speed Forme. (Any cards attached to Deoxys Speed Forme, damage counters, Special Conditions, and effects on it are now on the new Pokémon.) If you do, put Deoxys Speed Forme on top of your deck. Shuffle your deck afterward. You can\'t use more than 1 Form Change Poké-Power each turn.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Speed Shot',
    cost: [C, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on that Pokémon.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Deoxys Speed Forme';
  public fullName: string = 'Deoxys Speed Forme LA';

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

    // Speed Shot
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
      ), selected => {
        const target = selected[0];
        target.damage += 30;
        const afterDamage = new AfterDamageEffect(effect, 30);
        state = store.reduceEffect(state, afterDamage);
      });
    }

    return state;
  }
}
