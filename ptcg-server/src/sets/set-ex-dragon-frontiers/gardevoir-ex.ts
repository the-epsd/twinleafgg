import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, MOVE_CARD_TO, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { PowerEffect } from '../../game/store/effects/game-effects';

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

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, name: 'Fire Energy' },
        { allowCancel: false, min: 0, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARD_TO(state, transfer.card, target);
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.IMPRISON_USED_MARKER, this);

    return state;
  }
}