import { CardTag, CardType, ChoosePokemonPrompt, GameError, GameMessage, GamePhase, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';


export class PheromosaBuzzwoleGX extends PokemonCard {
  public tags = [CardTag.TAG_TEAM, CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 260;
  public weakness = [{ type: R }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Jet Punch',
      cost: [ G ],
      damage: 30,
      text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Elegant Sole',
      cost: [ G, G, C ],
      damage: 190,
      text: 'During your next turn, this Pokémon\'s Elegant Sole attack\'s base damage is 60.'
    },
    {
      name: 'Beast Game-GX',
      cost: [ G ],
      damage: 50,
      shred: false,
      gxAttack: true,
      text: 'If your opponent\'s Pokémon is Knocked Out by damage from this attack, take 1 more Prize card. If this Pokémon has at least 7 extra Energy attached to it (in addition to this attack\'s cost), take 3 more Prize cards instead. (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name = 'Pheromosa & Buzzwole-GX';
  public fullName = 'Pheromosa & Buzzwole-GX UNB';

  public readonly ELEGANT_SOLE_MARKER = 'ELEGANT_SOLE_MARKER';
  public readonly ELEGANT_SOLE_MARKER_2 = 'ELEGANT_SOLE_MARKER_2';

  private usedBaseBeastGame = false;
  private usedEnhancedBeastGame = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Jet Punch (literally just buzzwole-gx's first attack)
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      this.usedBaseBeastGame = false;
      this.usedEnhancedBeastGame = false;

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    // Elegant Sole
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      this.usedBaseBeastGame = false;
      this.usedEnhancedBeastGame = false;

      const marker = effect.player.marker;
      if (marker.hasMarker(this.ELEGANT_SOLE_MARKER_2, this)) {
        effect.damage = 60;
      }
      marker.addMarker(this.ELEGANT_SOLE_MARKER, this);
    }

    // Elegant Sole marker gaming
    if (effect instanceof EndTurnEffect) {
      const marker = effect.player.marker;
      marker.removeMarker(this.ELEGANT_SOLE_MARKER_2, this);
      if (marker.hasMarker(this.ELEGANT_SOLE_MARKER, this)) {
        marker.removeMarker(this.ELEGANT_SOLE_MARKER, this);
        marker.addMarker(this.ELEGANT_SOLE_MARKER_2, this);
      }
    }

    // Beast Game-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;

      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      player.usedGX = true;

      this.usedBaseBeastGame = true;

      const extraEffectCost: CardType[] = [G, C, C, C, C, C, C, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        this.usedEnhancedBeastGame = true;
      }
    }

    // Beast Game extra prizes thing
    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Iron Hands wasn't attacking
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      // check if the gx attack killed
      if (this.usedBaseBeastGame === true) {
        if (effect.prizeCount > 0) {
          effect.prizeCount += 1;
          this.usedBaseBeastGame = false;

          // additional effect from gx attack
          if (this.usedEnhancedBeastGame){
            effect.prizeCount += 2;
            this.usedEnhancedBeastGame = false;
          }
        }
      }

      return state;
    }

    return state;
  }
}