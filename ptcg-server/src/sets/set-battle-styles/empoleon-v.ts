import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, AttachEnergyPrompt, PlayerType, SlotType, GameError, PokemonCardList, PowerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { GameMessage } from '../../game/game-message';

export class EmpoleonV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V, CardTag.RAPID_STRIKE ];

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public cardType: CardType = CardType.WATER;

  public hp: number = 210;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Emperor\'s Eyes',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is your Active Pokémon, each Pokémon in ' +
      'play, in each player\'s hand, and in each player\'s discard pile has ' +
      'no Abilities (except for P Pokémon).'
  }];

  public attacks = [
    {
      name: 'Swirling Slice',
      cost: [ CardType.WATER, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 130,
      text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
    },
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

  public name: string = 'Empoleon V';

  public fullName: string = 'Empoleon V BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
    }

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Empoleon is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, effect.card);
      if (cardList instanceof PokemonCardList) {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
      }

      // We are not blocking the Abilities from Non-Basic Pokemon
      if (effect.card.stage !== Stage.BASIC) {
        return state;
      }
      // We are not blocking the Abilities from Pokemon V, VMAX or VSTAR
      //if (CardTag.POKEMON_V || CardTag.POKEMON_VMAX || CardTag.POKEMON_VSTAR || CardTag.POKEMON_EX || CardTag.POKEMON_GX || CardTag.POKEMON_ex || CardTag.POKEMON_LV_X || CardTag.RADIANT) {
      //  return state;
      //}

      // Try reducing ability for each player  
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);

      } catch {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
      return state;
    }
    return state;
  }
}

  