import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, AttachEnergyPrompt, PlayerType, SlotType, EnergyCard, GameError, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';

export class SylveonVMAX extends PokemonCard {

  public tags = [ CardTag.POKEMON_VMAX, CardTag.RAPID_STRIKE ];

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Sylveon V';

  public regulationMark = 'E';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 310;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = 
    [
      {
        name: 'Precious Touch',
        cost: [ CardType.PSYCHIC ],
        damage: 0,
        text: 'Attach an Energy card from your hand to 1 of your Benched Pokémon. If you do, heal 120 damage from that Pokémon.'
      },
      {
        name: 'Max Harmony',
        cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
        damage: 70,
        text: 'This attack does 30 more damage for each different type of Pokémon on your Bench.'
      }
    ];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '75';

  public name: string = 'Sylveon VMAX';

  public fullName: string = 'Sylveon VMAX EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard;
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
  
      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1 },
      ), transfers => {
        transfers = transfers || [];

        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target); 

          const healEffect = new HealEffect(player, target, 120);
          store.reduceEffect(state, healEffect);
        }
      });

      if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

        const player = effect.player;

        let damage = 70;

        let types = 0;

        const countedTypes = new Set();

        if (player.active?.getPokemonCard()?.cardType !== CardType.PSYCHIC) {
          countedTypes.add(player.active.getPokemonCard()?.cardType);
        }

        player.bench.forEach(benchSpot => {
          const card = benchSpot.getPokemonCard();
          if (card?.cardType !== CardType.PSYCHIC && !countedTypes.has(card?.cardType)) {
            countedTypes.add(card?.cardType);
            types++;
          }
        });

        damage += types * 30;

        effect.damage = damage;

        return state;
      }

      return state;
    }
    return state;
  }
}