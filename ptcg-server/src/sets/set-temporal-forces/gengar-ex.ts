import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType, StateUtils, PowerType, AttachEnergyPrompt } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class Gengarex extends PokemonCard {

  public regulationMark = 'H';

  public tags = [ CardTag.POKEMON_ex ];

  public stage: Stage = Stage.BASIC;

  public evolvesFrom = 'Haunter';

  public cardType: CardType = CardType.DARK;

  public hp: number = 310;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Gnawing Curse',
    powerType: PowerType.ABILITY,
    text: 'Whenever your opponent attaches an Energy card from their hand to 1 of their Pokémon, put 2 damage counters on that Pokémon.'
  }]; 

  public attacks = [
    {
      name: 'Tricky Steps',
      cost: [CardType.DARK, CardType.DARK],
      damage: 160,
      text: 'You may move an Energy from your opponent\'s Active Pokémon to 1 of their Benched Pokémon.'
    }
  ];

  public set: string = 'SV5K';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '47';

  public name: string = 'Gengar ex';

  public fullName: string = 'Gengar ex SV5K';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        opponent.active,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          opponent.active.moveCardTo(transfer.card, target);
        }
      });
    }


    if (effect instanceof AttachEnergyEffect) {

      const player = effect.player;
      // const opponent = StateUtils.getOpponent(state, player);

      let isGengarInPlay = false;
      if (player.active.cards[0] === this || player.bench.some(b => b.cards[0] === this)) {
        isGengarInPlay = true;
      }

      if (!isGengarInPlay) {
        return state;
      }


      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }



      // const cardList = [opponent.active, ...opponent.bench].filter(b => b.cards.length > 0);
      // if (cardList.length === 0) {
      //   return state;
      // }


      const target = effect.target;

      target.damage += 20;
    }
    return state;
  }
}
