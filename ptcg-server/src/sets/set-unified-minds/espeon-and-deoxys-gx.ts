import { CardTag, CardType, DamageMap, GameMessage, PlayerType, PokemonCard, PutDamagePrompt, SlotType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class EspeonDeoxysGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 260;
  public weakness = [{ type: P }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Psychic Club',
      cost: [ P, C, C ],
      damage: 10,
      damageCalculation: '+',
      text: 'This attack does 30 more damage for each of your Benched [P] Pokémon.'
    },
    {
      name: 'Cross Division-GX',
      cost: [ P, C, C ],
      damage: 0,
      gxAttack: true,
      text: 'Put 10 damage counters on your opponent\'s Pokémon in any way you like. If this Pokémon has at least 3 extra Energy attached to it (in addition to this attack\'s cost), put 20 damage counters on them instead. (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set = 'UNM';
  public setNumber = '72';
  public cardImage = 'assets/cardback.png';
  public name = 'Espeon & Deoxys-GX';
  public fullName = 'Espeon & Deoxys-GX UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psychic Club
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      let psychics = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card.getPokemonCard()?.cardType === CardType.PSYCHIC){ psychics++; }
      });

      effect.damage += psychics * 30;
    }

    // Cross Division-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      let damage = 100;

      const extraEffectCost: CardType[] = [P, C, C, C, C, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        damage = 200;
      }
      
      const opponent = effect.opponent;
      
      const maxAllowedDamage: DamageMap[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        maxAllowedDamage.push({ target, damage: card.hp + damage });
      });
    
      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
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