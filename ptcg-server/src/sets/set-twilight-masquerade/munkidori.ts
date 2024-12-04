import { PokemonCard, Stage, CardType, PowerType, DamageMap, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike, CardTarget, RemoveDamagePrompt, GameError, SpecialCondition, EnergyCard, BoardEffect } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Munkidori extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 110;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Adrena-Brain',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon has any [D] Energy attached, you may move up to 3 damage counters from 1 of your Pokémon to 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Mind Bend',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: 60,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '95';

  public name: string = 'Munkidori';

  public fullName: string = 'Munkidori TWM';

  public readonly ADRENA_BRAIN_MARKER = 'ADRENA_BRAIN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.ADRENA_BRAIN_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.ADRENA_BRAIN_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const maxAllowedDamage: DamageMap[] = [];
      const blockedFrom: CardTarget[] = [];
      const blockedTo: CardTarget[] = [];

      if (player.marker.hasMarker(this.ADRENA_BRAIN_MARKER, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Check if any Pokémon have damage
      let hasDamagedPokemon = false;
      const damagedPokemon: DamageMap[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          hasDamagedPokemon = true;
          damagedPokemon.push({ target, damage: cardList.damage });
        }
      });

      if (!hasDamagedPokemon) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        blockedTo.push(target);
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        blockedFrom.push(target);
      });

      let hasDarkAttached = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {

          const checkEnergy = new CheckProvidedEnergyEffect(player, cardList);
          store.reduceEffect(state, checkEnergy);

          checkEnergy.energyMap.forEach(em => {
            if (em.provides.includes(CardType.ANY)) {
              hasDarkAttached = true;
            }
            if (em.provides.includes(CardType.DARK)) {
              hasDarkAttached = true;
            }
            const energyCard = em.card;
            if (energyCard instanceof EnergyCard && energyCard.provides.includes(CardType.DARK)) {
              hasDarkAttached = true;
            }
            if (energyCard instanceof EnergyCard && energyCard.provides.includes(CardType.ANY)) {
              hasDarkAttached = true;
            }
            if (energyCard instanceof EnergyCard && energyCard.blendedEnergies?.includes(CardType.DARK)) {
              hasDarkAttached = true;
            }
          });

          if (!hasDarkAttached) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }

          return store.prompt(state, new RemoveDamagePrompt(
            effect.player.id,
            GameMessage.MOVE_DAMAGE,
            PlayerType.ANY,
            [SlotType.ACTIVE, SlotType.BENCH],
            maxAllowedDamage,
            { min: 1, max: 3, allowCancel: false, sameTarget: true, blockedTo: blockedTo, blockedFrom: blockedFrom }
          ), transfers => {
            if (transfers === null) {
              return state;
            }

            let totalDamageMoved = 0;
            for (const transfer of transfers) {

              const source = StateUtils.getTarget(state, player, transfer.from);
              const target = StateUtils.getTarget(state, player, transfer.to);

              // if (source.cards.length > 1) {
              //   throw new GameError(GameMessage.INVALID_TARGET);
              // }

              // if (target.cards.length > 1) {
              //   throw new GameError(GameMessage.INVALID_TARGET);
              // }

              player.marker.addMarker(this.ADRENA_BRAIN_MARKER, this);

              player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                  cardList.addBoardEffect(BoardEffect.ABILITY_USED);
                }
              });

              /*blockedFrom.forEach(blocked => {
                if (transfer.from === blocked && transfer.to === blocked) {
                  throw new GameError(GameMessage.CANNOT_USE_POWER);;
                }
              });
    
              if (blockedFrom.includes(transfer.from)) {
                throw new GameError(GameMessage.CANNOT_USE_POWER);
              }*/

              const damageToMove = Math.min(30 - totalDamageMoved, Math.min(10, source.damage));
              if (damageToMove > 0) {
                source.damage -= damageToMove;
                target.damage += damageToMove;
                totalDamageMoved += damageToMove;
              }
              if (totalDamageMoved >= 30) break;
            }
          });
        }
      });
    }
    return state;
  }
}
