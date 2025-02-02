"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alert_prompt_1 = require("../store/prompts/alert-prompt");
const prompt_1 = require("../store/prompts/prompt");
const prompt_serializer_1 = require("./prompt.serializer");
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
class UnknownPrompt extends prompt_1.Prompt {
    constructor() {
        super(...arguments);
        this.type = 'Unknown';
    }
}
describe('PromptSerializer', () => {
    let promptSerializer;
    let context;
    beforeEach(() => {
        promptSerializer = new prompt_serializer_1.PromptSerializer();
        context = { cards: [] };
    });
    it('Should restore prompt instance', () => {
        // given
        const prompt = new alert_prompt_1.AlertPrompt(1, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND);
        // when
        const serialized = promptSerializer.serialize(prompt);
        const restored = promptSerializer.deserialize(serialized, context);
        // then
        expect(restored.playerId).toEqual(1);
        expect(restored.message).toEqual(game_message_1.GameMessage.CHOOSE_CARD_TO_HAND);
        expect(restored instanceof alert_prompt_1.AlertPrompt).toBeTruthy();
        expect(restored instanceof prompt_1.Prompt).toBeTruthy();
    });
    it('Should throw exception when unknown prompt type', () => {
        // given
        const prompt = new UnknownPrompt(1);
        const message = 'Unknown prompt type \'Unknown\'.';
        // then
        expect(function () {
            promptSerializer.serialize(prompt);
        }).toThrow(new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, message));
    });
    it('Should throw exception when unknown object type', () => {
        // given
        const serialized = { _type: 'Unknown' };
        const message = 'Unknown prompt type \'Unknown\'.';
        // then
        expect(function () {
            promptSerializer.deserialize(serialized, context);
        }).toThrow(new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, message));
    });
});
