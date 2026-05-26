import { ReorderBenchAction } from '../actions/reorder-actions';
export function playerStateReducer(state, action) {
    if (action instanceof ReorderBenchAction) {
        const player = state.players.find(p => p.id === action.id);
        if (player === undefined || player.bench[action.from] === undefined) {
            return state;
        }
        const temp = player.bench[action.from];
        player.bench[action.from] = player.bench[action.to];
        player.bench[action.to] = temp;
        return state;
    }
    // if (action instanceof ReorderHandAction) {
    //   const player = state.players.find(p => p.id === action.id);
    //   if (player === undefined || player.hand.cards.length !== action.order.length) {
    //     return state;
    //   }
    //   player.hand.applyOrder(action.order);
    //   return state;
    // }
    return state;
}
