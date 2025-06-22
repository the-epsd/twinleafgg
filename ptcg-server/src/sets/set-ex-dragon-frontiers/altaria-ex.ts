import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, GameError, AttachEnergyPrompt, PlayerType, SlotType, StateUtils, CardTarget } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { HealEffect } from '../../game/store/effects/game-effects';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, MOVE_CARD_TO, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Altariaex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Swablu';
  public tags = [CardTag.POKEMON_ex, CardTag.DELTA_SPECIES];
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: C }];
  public resistance = [{ type: G, value: -30 }, { type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Extra Boost',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may attach a basic Energy card from your hand to 1 of your Stage 2 Pokémon-ex. This power can\'t be used if Altaria ex is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Healing Light',
    cost: [W, C, C],
    damage: 60,
    text: 'Remove 1 damage counter from each of your Pokémon.'
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';
  public name: string = 'Altaria ex';
  public fullName: string = 'Altaria ex DF';

  public readonly EXTRA_BOOST_MARKER = 'EXTRA_BOOST_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      REMOVE_MARKER(this.EXTRA_BOOST_MARKER, player, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (HAS_MARKER(this.EXTRA_BOOST_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (!player.hand.cards.some(card => card.superType === SuperType.ENERGY && card.energyType === EnergyType.BASIC)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let hasStage2Ex = false;
      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        // Block if not Stage 2 or doesn't have POKEMON_ex tag
        if (card.stage !== Stage.STAGE_2 && !card.tags?.includes(CardTag.POKEMON_ex)) {
          blockedTo.push(target);
        } else {
          hasStage2Ex = true;
        }
      });

      if (!hasStage2Ex) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: true, min: 1, max: 1, blockedTo },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {
          ADD_MARKER(this.EXTRA_BOOST_MARKER, player, this);
          ABILITY_USED(player, this);

          //Attaching energy
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARD_TO(state, transfer.card, target);
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.EXTRA_BOOST_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const healEffect = new HealEffect(effect.player, cardList, 10);
        state = store.reduceEffect(state, healEffect);
      });
    }

    return state;
  }
}