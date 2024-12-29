import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { MoveDamagePrompt, DamageMap } from '../../game/store/prompts/move-damage-prompt';
import { GameMessage } from '../../game/game-message';
import { GameError } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class RadiantAlakazam extends PokemonCard {

  public tags = [CardTag.RADIANT];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 130;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Painful Spoons',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may move up to 2 damage ' +
      'counters from 1 of your opponent\'s Pokémon to another of ' +
      'their Pokémon.'
  }];

  public attacks = [{
    name: 'Mind Ruler',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 20,
    damageCalculation: 'x',
    text: 'This attack does 20 damage for each card in your ' +
      'opponent\'s hand.'
  }];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '59';

  public name: string = 'Radiant Alakazam';

  public fullName: string = 'Radiant Alakazam SIT';

  public readonly PAINFUL_SPOONS_MARKER = 'PAINFUL_SPOONS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const damagedPokemon = [
        ...opponent.bench.filter(b => b.cards.length > 0 && b.damage > 0),
        ...(opponent.active.damage > 0 ? [opponent.active] : [])
      ];

      if (player.marker.hasMarker(this.PAINFUL_SPOONS_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (damagedPokemon.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const maxAllowedDamage: DamageMap[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      return store.prompt(state, new MoveDamagePrompt(
        effect.player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        maxAllowedDamage,
        { min: 1, max: 2, allowCancel: false, singleDestinationTarget: true }
      ), transfers => {

        player.marker.addMarker(this.PAINFUL_SPOONS_MARKER, this);

        if (transfers === null) {
          return;
        }

        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          if (source.damage == 10) {
            source.damage -= 10;
            target.damage += 10;
          }
          if (source.damage >= 10) {
            source.damage -= 20;
            target.damage += 20;
          }

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addBoardEffect(BoardEffect.ABILITY_USED);
            }
          });

          return state;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const oppHand = opponent.hand.cards.length;

      effect.damage = 20 * oppHand;
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.PAINFUL_SPOONS_MARKER);
      return state;
    }
    return state;
  }
}