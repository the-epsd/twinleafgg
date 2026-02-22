import { PokemonCard } from '../../game/store/card/pokemon-card';
import { MoveDamagePrompt, PlayerType, GameError } from '../../game';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { DamageMap } from '../../game';
import { SlotType } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';

import { TrainerCard, TrainerType } from '../../game';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Banetteex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shuppet';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Shady Move',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Banette ex is your Active Pokémon, you may move 1 damage counter from either player\'s Pokémon to another Pokémon (yours or your opponent\'s). This power can\'t be used if Banette ex is affected by a Special Condition.'
  }];

  public attacks = [
    {
      name: 'Shadow Chant',
      cost: [P, C],
      damage: 30,
      damageCalculation: '+',
      text: 'Does 30 damage plus 10 more damage for each Supporter card in your discard pile. You can\'t add more than 60 damage in this way.'
    }
  ];

  public set: string = 'LM';
  public setNumber: string = '85';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Banette ex';
  public fullName: string = 'Banette ex LM';

  public readonly SHADY_MARKER = 'SHADY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SHADY_MARKER, this);
    }

    // Shady Move
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (player.marker.hasMarker(this.SHADY_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      // damage map gaming
      const maxAllowedDamage: DamageMap[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      if (maxAllowedDamage.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // doing the actual moving of cards
      return store.prompt(state, new MoveDamagePrompt(
        effect.player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.ANY,
        [SlotType.ACTIVE, SlotType.BENCH],
        maxAllowedDamage,
        { min: 1, max: 1, allowCancel: false }
      ), transfers => {
        if (transfers === null) {
          return;
        }
        player.marker.addMarker(this.SHADY_MARKER, this);
        ABILITY_USED(player, this);

        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          if (source.damage >= 10) {
            source.damage -= 10;
            target.damage += 10;
          }
        }
      });
    }

    // Shadow Chant
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let supportersInDiscard = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER) {
          supportersInDiscard += 1;
        }
      });

      // no doing too much damage bozo
      if (supportersInDiscard > 6) {
        supportersInDiscard = 6;
      }

      effect.damage += supportersInDiscard * 10;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SHADY_MARKER, this);

    return state;
  }
}