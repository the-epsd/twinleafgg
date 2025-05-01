import { CardTag, CardTarget, CardType, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { KnockOutOpponentEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import {AttachPokemonToolEffect, PlayItemEffect, PlayStadiumEffect, PlaySupporterEffect} from '../../game/store/effects/play-card-effects';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';


export class UmbreonDarkraiGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 270;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Black Lance',
      cost: [ D, D, C ],
      damage: 150,
      text: 'This attack does 60 damage to 1 of your opponent\'s Benched Pokémon-GX or Benched Pokémon-EX. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Dark Moon-GX',
      cost: [ C ],
      damage: 0,
      gxAttack: true,
      text: 'Your opponent can\'t play any Trainer cards from their hand during their next turn. If this Pokémon has at least 5 extra [D] Energy attached to it (in addition to this attack\'s cost), your opponent\'s Active Pokémon is Knocked Out. (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set = 'UNM';
  public setNumber = '125';
  public cardImage = 'assets/cardback.png';
  public name = 'Umbreon & Darkrai-GX';
  public fullName = 'Umbreon & Darkrai-GX UNM';

  public readonly DARK_MOON_MARKER = 'DARK_MOON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Black Lance
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      const opponent = effect.opponent;

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      let gxsEXsOnBench = 0;
      const blockedTo: CardTarget[] = [];
      opponent.bench.forEach((bench, index) => {
        if (bench.cards.length === 0) {
          return;
        }

        if (bench.getPokemonCard()?.tags.includes(CardTag.POKEMON_EX) || bench.getPokemonCard()?.tags.includes(CardTag.POKEMON_GX) || bench.getPokemonCard()?.tags.includes(CardTag.TAG_TEAM)) {
          gxsEXsOnBench++;
        } else {
          const target: CardTarget = {
            player: PlayerType.BOTTOM_PLAYER,
            slot: SlotType.BENCH,
            index
          };
          blockedTo.push(target);
        }
      });

      if (!gxsEXsOnBench){
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked: blockedTo }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        
        for (const target of targets){
          const damageEffect = new PutDamageEffect(effect, 60);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        }
        
      });
    }

    // Dark Moon-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      opponent.marker.addMarker(this.DARK_MOON_MARKER, this);

      const extraEffectCost: CardType[] = [D, D, D, D, D, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        const activePokemon = opponent.active.getPokemonCard();
  
        if (activePokemon) {
          const dealDamage = new KnockOutOpponentEffect(effect, 999);
          dealDamage.target = opponent.active;
          store.reduceEffect(state, dealDamage);
        }
      }
    }

    if ((effect instanceof PlayItemEffect 
      || effect instanceof PlaySupporterEffect 
      || effect instanceof PlayStadiumEffect 
      || effect instanceof AttachPokemonToolEffect) && effect.player.marker.hasMarker(this.DARK_MOON_MARKER, this)){
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.DARK_MOON_MARKER, this)){
      effect.player.marker.removeMarker(this.DARK_MOON_MARKER, this);
    }

    return state;
  }
}