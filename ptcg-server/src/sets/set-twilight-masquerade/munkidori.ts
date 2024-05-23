import { PokemonCard, Stage, CardType, StoreLike, State, CardTarget, GameMessage, PlayerType, SlotType, StateUtils, GameError, DamageMap, MoveDamagePrompt, PowerType } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Munkidori extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 110;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{type: CardType.FIGHTING, value: -30}];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Refinement',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'You must discard a card from your hand in order to use ' +
      'this Ability. Once during your turn, you may draw 2 cards.'
  }];

  public attacks = [
    {
      name: 'Damage Collector',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 0,
      text: 'Move any number of damage counters from your opponent\'s Benched Pokémon to their Active Pokémon.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '95';

  public name: string = 'Munkidori';

  public fullName: string = 'Munkidori TWM';

  public readonly REFINEMENT_MARKER = 'REFINEMENT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.REFINEMENT_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const blocked: CardTarget[] = [];

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          return state;
        } else {
          blocked.push(target);
        }
      });

      if (!blocked.length) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      if (blocked.length) {
        // Opponent has damaged benched Pokemon

        const maxAllowedDamage: DamageMap[] = [];
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
          const checkHpEffect = new CheckHpEffect(opponent, cardList);
          store.reduceEffect(state, checkHpEffect);
          maxAllowedDamage.push({ target, damage: 30 });
        });

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList == player.active || player.bench.includes(cardList)) {
            const source = StateUtils.getTarget(state, player, target);
            if (source.damage >= 30) {
              source.damage -= 30;
            }
          }
        });

        const blockedFrom: CardTarget[] = [];
        const blockedTo: CardTarget[] = [];

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList == player.active || player.bench.includes(cardList)) {
            blockedTo.push(target);
          }
        });

        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
          if (cardList == opponent.active || opponent.bench.includes(cardList)) {
            blockedFrom.push(target);
          }
        });

        return store.prompt(state, new MoveDamagePrompt(
          effect.player.id,
          GameMessage.MOVE_DAMAGE,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          maxAllowedDamage,
          { blockedFrom, blockedTo, max: 1, allowCancel: false }
        ), transfers => {
          if (transfers === null) {
            return state;
          }

          for (const transfer of transfers) {
            const source = StateUtils.getTarget(state, player, transfer.from);
            if (source.damage >= 30) {
              source.damage -= 30;
            }
          }


          return store.prompt(state, new MoveDamagePrompt(
            effect.player.id,
            GameMessage.MOVE_DAMAGE,
            PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            maxAllowedDamage,
            { blockedFrom, blockedTo, max: 1, allowCancel: false }
          ), transfers => {
            if (transfers === null) {
              return state;
            }

            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              target.damage += 30;
            }
          });
        });
      }
    }
    return state;
  }
}