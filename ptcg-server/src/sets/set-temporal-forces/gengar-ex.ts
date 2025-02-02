import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType, StateUtils, PowerType, AttachEnergyPrompt } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class Gengarex extends PokemonCard {

  public regulationMark = 'H';

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Haunter';

  public cardType: CardType = CardType.DARK;

  public hp: number = 310;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

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

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '104';

  public name: string = 'Gengar ex';

  public fullName: string = 'Gengar ex TEF';

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
      const opponent = StateUtils.getOpponent(state, player);

      let isGengarInPlay = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isGengarInPlay = true;
        }
      });

      if (!isGengarInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      effect.target.damage += 20;
    }
    return state;
  }
}