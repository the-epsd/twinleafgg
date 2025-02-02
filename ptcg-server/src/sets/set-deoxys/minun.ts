import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, GameError, PowerType, StateUtils, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Minun extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Sniff Out',
    cost: [C],
    damage: 0,
    text: 'Put any 1 card from your discard pile into your hand.'
  },
  {
    name: 'Negative Spark',
    cost: [L],
    damage: 0,
    text: 'Does 20 damage to each of your opponent\'s Pokémon that has any Poké- Bodies. Don\'t apply Weakness and Resistance.'
  }];

  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Minun';
  public fullName: string = 'Minun DX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.discard.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), cards => {
        player.discard.moveCardsTo(cards, player.hand);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let benchPokemon: PokemonCardList[] = [];
      const pokemonWithAbilities: PokemonCardList[] = [];
      const opponentActive = opponent.active.getPokemonCard();

      const stubPowerEffectForActive = new PowerEffect(opponent, {
        name: 'test',
        powerType: PowerType.POKEBODY,
        text: ''
      }, opponent.active.getPokemonCard()!);

      try {
        store.reduceEffect(state, stubPowerEffectForActive);

        if (opponentActive && opponentActive.powers.length) {
          pokemonWithAbilities.push(opponent.active);
        }
      } catch {
        // no abilities in active
      }

      if (opponent.bench.some(b => b.cards.length > 0)) {
        const stubPowerEffectForBench = new PowerEffect(opponent, {
          name: 'test',
          powerType: PowerType.POKEBODY,
          text: ''
        }, opponent.bench.filter(b => b.cards.length > 0)[0].getPokemonCard()!);

        try {
          store.reduceEffect(state, stubPowerEffectForBench);

          benchPokemon = opponent.bench.map(b => b).filter(card => card !== undefined) as PokemonCardList[];
          pokemonWithAbilities.push(...benchPokemon.filter(card => card.getPokemonCard()?.powers.length));
        } catch {
          // no abilities on bench
        }
      }

      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;

      pokemonWithAbilities.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });

      return state;
    }

    return state;
  }
}