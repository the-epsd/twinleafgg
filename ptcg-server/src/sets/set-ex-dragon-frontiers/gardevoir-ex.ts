import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { Card, CardTarget, ChoosePokemonPrompt, GameError, GameMessage, MoveEnergyPrompt, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Gardevoirex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Kirlia';
  public tags = [CardTag.POKEMON_ex, CardTag.DELTA_SPECIES];
  public cardType: CardType = R;
  public hp: number = 150;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Imprison',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if Gardevoir ex is your Active Pokémon, you may put an Imprison marker on 1 of your opponent\'s Pokémon. Any Pokémon that has any Imprison markers on it can\'t use any Poké-Powers or Poké-Bodies. This power can\'t be used if Gardevoir ex is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Flame Ball',
    cost: [R, C, C],
    damage: 80,
    text: 'You may move a [R] Energy card attached to Gardevoir ex to 1 of your Benched Pokémon.'
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Gardevoir ex';
  public fullName: string = 'Gardevoir ex DF';

  public readonly IMPRISON_MARKER = 'IMPRISON_MARKER';
  public readonly IMPRISON_USED_MARKER = 'IMPRISON_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER)
      }
      if (HAS_MARKER(this.IMPRISON_USED_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];

        const pokemonList = targets[0]
        if (pokemonList !== undefined) {
          ADD_MARKER(this.IMPRISON_MARKER, pokemonList, this);
        }

        ADD_MARKER(this.IMPRISON_USED_MARKER, player, this);
        ABILITY_USED(player, this);
        return state;
      });
    }
    if (effect instanceof PowerEffect
      && (effect.power.powerType === PowerType.POKEPOWER || effect.power.powerType === PowerType.POKEBODY)) {
      // Find the PokemonCardList that contains effect.card (probably a better way to do this tbh)
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const allLists = [player.active, ...player.bench, ...opponent.active ? [opponent.active] : [], ...opponent.bench];
      const pokemonCardList = allLists.find(list => list.cards.includes(effect.card));
      if (pokemonCardList && HAS_MARKER(this.IMPRISON_MARKER, pokemonCardList, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      const blockedFrom: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList !== player.active) {
          blockedFrom.push(target);
        }
      });

      const blockedMap: { source: CardTarget, blocked: number[] }[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergy);

        const blockedCards: Card[] = [];
        checkProvidedEnergy.energyMap.forEach(em => {
          if (!em.provides.includes(CardType.FIRE) && !em.provides.includes(CardType.ANY)) {
            blockedCards.push(em.card);
          }
        });

        cardList.cards.forEach(em => {
          if (cardList.getPokemons().includes(em as PokemonCard)) {
            blockedCards.push(em);
          }
        });

        const blocked: number[] = [];
        blockedCards.forEach(bc => {
          const index = cardList.cards.indexOf(bc);
          if (index !== -1 && !blocked.includes(index)) {
            blocked.push(index);
          }
        });

        if (blocked.length !== 0) {
          blockedMap.push({ source: target, blocked });
        }
      });

      store.prompt(state, new MoveEnergyPrompt(
        effect.player.id,
        GameMessage.MOVE_ENERGY_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        {},
        { allowCancel: true, blockedMap, blockedFrom, min: 0, max: 1 }
      ), transfers => {
        if (transfers === null) {
          return;
        }

        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          source.moveCardTo(transfer.card, target);

          if (transfer.card instanceof PokemonCard) {
            // Remove it from the source
            source.removePokemonAsEnergy(transfer.card);

            // Reposition it to be with energy cards (at the beginning of the card list)
            target.cards.unshift(target.cards.splice(target.cards.length - 1, 1)[0]);

            // Register this card as energy in the PokemonCardList
            target.addPokemonAsEnergy(transfer.card);
          }
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.IMPRISON_USED_MARKER, this);

    return state;
  }
}