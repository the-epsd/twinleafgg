import { Attack, CardType, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { CheckHpEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Kricketune extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Kricketot';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers: Power[] = [
    {
      name: 'Swelling Tune',
      powerType: PowerType.ABILITY,
      text: 'Your [G] Pokémon in play, except any Kricketune, get +40 HP. You can\'t apply more than 1 Swelling Tune Ability at a time.'
    }
  ];

  public attacks: Attack[] = [
    {
      name: 'Slash',
      cost: [G, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'ASR';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Kricketune';
  public fullName: string = 'Kricketune ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const player = StateUtils.findOwner(state, cardList);

      //console.log(`[KRICKETUNE]: reduceEffect called for CheckHpEffect:`);
      //console.log(`      [KRICKETUNE]: effect.player = ${effect.player.id}, effect.target = ${effect.target.getPokemonCard()?.name}`);
      //console.log(`      [KRICKETUNE]: effect.hp = ${effect.hp}, effect.hpBoosted = ${effect.hpBoosted}`);

      // Check if Kricketune is actually in play for "player"
      const isInPlay = player.active.cards.includes(this) || player.bench.some(b => b.cards.includes(this));
      //console.log(`[KRICKETUNE]: isInPlay? = ${isInPlay}`);

      if (!isInPlay) {
        //console.log(`[KRICKETUNE]: Not in play; returning without changes.`);
        return state;
      }

      // If HP boost already applied, skip
      if (effect.hpBoosted) {
        //console.log(`[KRICKETUNE]: HP boost already applied; returning without changes.`);
        return state;
      }

      // Check if the CheckHpEffect belongs to the same player who owns Kricketune
      // If effect.player is different, skip boosting.
      if (effect.player.id !== player.id) {
        //console.log(`[KRICKETUNE] effect.player.id (${effect.player.id}) != Kricketune owner.id (${player.id}). Skipping.`);
        return state;
      }

      // Instead of enumerating all Pokémon in the board
      // (which is not needed since it's already happening in findKoPokemons),
      // we identify which Pokemon is being checked right now
      const targetPokemonCard = effect.target.getPokemonCard();
      if (!targetPokemonCard) {
        //console.log('[KRICKETUNE] No PokemonCard found in effect.target. Skipping.');
        return state;
      }

      //console.log(`[KRICKETUNE] The Pokemon being checked is ${targetPokemonCard.name}.`);

      // If that Pokemon is not Grass or is Kricketune, skip
      // (we use checkPokemonTypeEffect instead of targetPokemonCard.cardType
      // to address additional types)
      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonTypeEffect);
      if (!checkPokemonTypeEffect.cardTypes.includes(CardType.GRASS) || targetPokemonCard.name === 'Kricketune') {
        //console.log(`[KRICKETUNE] ${targetPokemonCard.name} is not a valid Grass Pokemon for Swelling Tune. Skipping.`);
        return state;
      }

      // Check if the ability is disabled by calling PowerEffect stub
      try {
        //console.log('[KRICKETUNE] Attempting PowerEffect stub to confirm Ability is active...');
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
        //console.log('[KRICKETUNE] PowerEffect stub succeeded. Ability is active.');
      } catch {
        //console.log(`[KRICKETUNE] Caught error while checking Ability. Skipping HP boost.`);
        return state;
      }

      // Finally, if we haven't boosted HP in this CheckHpEffect yet, add +40
      if (!effect.hpBoosted) {
        //console.log(`[KRICKETUNE] ${targetPokemonCard.name} is valid for +40 HP. effect.hp was ${effect.hp}.`);
        effect.hp += 40;
        effect.hpBoosted = true;
        //console.log(`[KRICKETUNE] New effect.hp = ${effect.hp}, effect.hpBoosted = ${effect.hpBoosted}`);
      }
    }

    return state;
  }
}