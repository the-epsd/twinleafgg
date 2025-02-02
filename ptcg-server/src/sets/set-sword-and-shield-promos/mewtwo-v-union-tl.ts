import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, CardTarget, DamageMap, EnergyCard, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, PutDamagePrompt, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AbstractAttackEffect, ApplyWeaknessEffect, DealDamageEffect, HealTargetEffect, PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { MewtwoVUNIONTopRight } from './mewtwo-v-union-tr';
import { MewtwoVUNIONBottomLeft } from './mewtwo-v-union-bl';
import { MewtwoVUNIONBottomRight } from './mewtwo-v-union-br';

export class MewtwoVUNIONTopLeft extends PokemonCard {
  public stage: Stage = Stage.VUNION;
  public tags = [ CardTag.POKEMON_VUNION ];
  public cardType: CardType = P;
  public hp: number = 310;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C, C ];

  public powers = [
    {
      name: 'Mewtwo V-UNION Assembly',
      text: 'Once per game during your turn, combine 4 different Mewtwo V-UNION from your discard pile and put them onto your bench.',
      useFromDiscard: true,
      exemptFromAbilityLock: true,
      powerType: PowerType.ABILITY
    },
    {
      name: 'Photon Barrier',
      text: 'Prevent all effects of attacks from your opponent\'s Pokémon done to this Pokémon. (Damage is not an effect.)',
      powerType: PowerType.ABILITY
    }
  ];

  public attacks = [
    {
      name: 'Union Gain',
      cost: [ C ],
      damage: 0,
      text: 'Attach up to 2 [P] Energy cards from your discard pile to this Pokémon.'
    },
    {
      name: 'Super Regeneration',
      cost: [ P, P, C ],
      damage: 0,
      text: 'Heal 200 damage from this Pokémon.'
    },
    {
      name: 'Psyplosion',
      cost: [ P, P, C ],
      damage: 0,
      text: 'Put 16 damage counters on your opponent\'s Pokémon in any way you like.'
    },
    {
      name: 'Final Burn',
      cost: [ P, P, P, C ],
      damage: 300,
      text: ''
    }
  ];

  public set: string = 'SP';
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '308';
  public name: string = 'Mewtwo V-UNION';
  public fullName: string = 'Mewtwo V-UNION (Top Left) SP';

  public readonly MEWTWO_ASSEMBLED = 'MEWTWO_ASSEMBLED';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // assemblin the v-union
    if (effect instanceof PowerEffect && effect.power === this.powers[0]){
      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (player.assembledMewtwo){
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      if (slots.length === 0){
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let topLeftPiece = false;
      let topRightPiece = false;
      let bottomLeftPiece = false;
      let bottomRightPiece = false;
      player.discard.cards.forEach(card => {
        if (card instanceof MewtwoVUNIONTopLeft){ topLeftPiece = true; }
        if (card instanceof MewtwoVUNIONTopRight){ topRightPiece = true; }
        if (card instanceof MewtwoVUNIONBottomLeft){ bottomLeftPiece = true; }
        if (card instanceof MewtwoVUNIONBottomRight){ bottomRightPiece = true; }
      });

      if (topLeftPiece && topRightPiece && bottomLeftPiece && bottomRightPiece){
        if (slots.length > 0) {
          player.discard.cards.forEach(card => { if (card instanceof MewtwoVUNIONTopRight){ player.discard.moveCardTo(card, slots[0]); }});
          player.discard.cards.forEach(card => { if (card instanceof MewtwoVUNIONBottomLeft){ player.discard.moveCardTo(card, slots[0]); }});
          player.discard.cards.forEach(card => { if (card instanceof MewtwoVUNIONBottomRight){ player.discard.moveCardTo(card, slots[0]); }});
          // gotta make sure the actual mon ends up on top
          player.discard.cards.forEach(card => { if (card instanceof MewtwoVUNIONTopLeft){ player.discard.moveCardTo(card, slots[0]); }});
          player.assembledMewtwo = true;
          slots[0].pokemonPlayedTurn = state.turn;
        }
      } else {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
    }

    // Photon Barrier
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const sourceCard = effect.source.getPokemonCard();

      if (sourceCard) {
        // Allow Weakness & Resistance
        if (effect instanceof ApplyWeaknessEffect) {
          return state;
        }
        // Allow damage
        if (effect instanceof PutDamageEffect) {
          return state;
        }
        if (effect instanceof DealDamageEffect) {
          return state;
        }
        effect.preventDefault = true;
      }
    }

    // Union Gain
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;

      let psychicsInDiscard = 0;
      // checking for energies in the discard
      player.discard.cards.forEach(card => {
        if (card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Psychic Energy'){
          psychicsInDiscard++;
        }
      })

      if (psychicsInDiscard > 0){
        const blocked: CardTarget[] = [];
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
          if (card !== this) {
            blocked.push(target);
          }
        });

        state = store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Psychic Energy' },
          { allowCancel: false, min: 0, max: Math.min(2, psychicsInDiscard), blockedTo: blocked }
        ), transfers => {
          transfers = transfers || [];
          // cancelled by user
          if (transfers.length === 0) {
            return;
          }
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target);
          }
        });   
      }
    } 

    // Super Regeneration
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]){
      const player = effect.player;

      const healing = new HealTargetEffect(effect, 200);
      healing.target = player.active;
      store.reduceEffect(state, healing);
    }

    // Psyplosion
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const maxAllowedDamage: DamageMap[] = [];
      let damageLeft = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        damageLeft += checkHpEffect.hp - cardList.damage;
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      const damage = Math.min(160, damageLeft);

      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        damage,
        maxAllowedDamage,
        { allowCancel: false }
      ), targets => {
        const results = targets || [];
        for (const result of results) {
          const target = StateUtils.getTarget(state, player, result.target);
          const putCountersEffect = new PutCountersEffect(effect, result.damage);
          putCountersEffect.target = target;
          store.reduceEffect(state, putCountersEffect);
        }
      });
    }

    return state;
  }
}