import { Attack, CardType, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { CheckHpEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

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

      // Check if Kricketune is actually in play for "player"
      const isInPlay = player.active.cards.includes(this) || player.bench.some(b => b.cards.includes(this));

      if (!isInPlay) {
        return state;
      }

      // If HP boost already applied, skip
      if (effect.nonstackingBoosts.includes(this.powers[0].name)) {
        return state;
      }

      // Check if the CheckHpEffect belongs to the same player who owns Kricketune
      // If effect.player is different, skip boosting.
      if (effect.player.id !== player.id) {
        return state;
      }

      // Instead of enumerating all Pokémon in the board
      // (which is not needed since it's already happening in findKoPokemons),
      // we identify which Pokemon is being checked right now
      const targetPokemonCard = effect.target.getPokemonCard();
      if (!targetPokemonCard) {
        return state;
      }

      // If that Pokemon is not Grass or is Kricketune, skip
      // (we use checkPokemonTypeEffect instead of targetPokemonCard.cardType
      // to address additional types)
      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonTypeEffect);
      if (!checkPokemonTypeEffect.cardTypes.includes(CardType.GRASS) || targetPokemonCard.name === 'Kricketune') {
        return state;
      }

      // Check if the ability is disabled by calling PowerEffect stub
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Finally, if we haven't boosted HP in this CheckHpEffect yet, add +40
      effect.hp += 40;
      effect.nonstackingBoosts.push(this.powers[0].name);
    }

    return state;
  }
}