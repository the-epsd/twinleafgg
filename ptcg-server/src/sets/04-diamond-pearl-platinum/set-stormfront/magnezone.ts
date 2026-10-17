import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterDamageEffect } from '../../../game/store/effects/attack-effects';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHUFFLE_DECK, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class Magnezone extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Magneton';
  public hp: number = 120;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +30 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Magnetic Search',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may search your deck for a Lightning or Metal Pokémon, show it to your opponent, and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Magnezone is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Speed Shot',
    cost: [L, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on that Pokémon.'
  },
  {
    name: 'Crush Volt',
    cost: [L, C, C],
    damage: 80,
    text: 'Discard an Energy attached to Magnezone.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Magnezone';
  public fullName: string = 'Magnezone SF';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Magnetic Search
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      if (player.deck.cards.length === 0) {
        return state;
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard)) {
          blocked.push(index);
          return;
        }
        const isLightningOrMetal = card.cardType.includes(CardType.LIGHTNING)
          || card.cardType.includes(CardType.METAL);
        if (!isLightningOrMetal) {
          blocked.push(index);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 1, allowCancel: true, blocked },
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          SHUFFLE_DECK(store, state, player);
          return;
        }
        MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
        SHUFFLE_DECK(store, state, player);
      });
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
        afterDamage.target = target;
        store.reduceEffect(state, afterDamage);
      });
    }

    // Crush Volt
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
