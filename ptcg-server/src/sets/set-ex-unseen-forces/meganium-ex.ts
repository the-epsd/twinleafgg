import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, GameError, AttachEnergyPrompt, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { HealEffect } from '../../game/store/effects/game-effects';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, MOVE_CARD_TO, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';

export class Meganiumex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Bayleef';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = G;
  public hp: number = 150;
  public weakness = [{ type: G }, { type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Nurture and Heal',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may attach a [G] Energy card from your hand to 1 of your Pokémon. If you do, remove 1 damage counter from that Pokémon. This power can\'t be used if Meganium ex is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Razor Leaf',
    cost: [C, C, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Power Poison',
    cost: [G, G, C, C, C],
    damage: 90,
    text: 'Discard 1 Energy attached to Meganium ex. The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Meganium ex';
  public fullName: string = 'Meganium ex UF';

  public readonly NURTURE_AND_HEAL_MARKER = 'NURTURE_AND_HEAL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      REMOVE_MARKER(this.NURTURE_AND_HEAL_MARKER, player, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (HAS_MARKER(this.NURTURE_AND_HEAL_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (!player.hand.cards.some(card => card.superType === SuperType.ENERGY && card.name === 'Grass Energy')) {
        return state;
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, name: 'Grass Energy' },
        { allowCancel: true, min: 1, max: 1 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {
          ADD_MARKER(this.NURTURE_AND_HEAL_MARKER, player, this);
          ABILITY_USED(player, this);

          //Attaching energy
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARD_TO(state, transfer.card, target);

          //Heal 30 from target
          const healEffect = new HealEffect(player, target, 10);
          state = store.reduceEffect(state, healEffect);
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.NURTURE_AND_HEAL_MARKER, this);

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    return state;
  }
}