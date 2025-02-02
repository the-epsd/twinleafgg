"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decks = void 0;
const services_1 = require("../services");
const game_1 = require("../../game");
const controller_1 = require("./controller");
const errors_1 = require("../common/errors");
const storage_1 = require("../../storage");
class Decks extends controller_1.Controller {
    async onList(req, res) {
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId, { relations: ['decks'] });
        if (user === undefined) {
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const decks = user.decks.map(deck => ({
            id: deck.id,
            name: deck.name,
            isValid: deck.isValid,
            cards: JSON.parse(deck.cards),
            cardTypes: JSON.parse(deck.cardTypes)
        }));
        res.send({ ok: true, decks });
    }
    async onGet(req, res) {
        const userId = req.body.userId;
        const deckId = parseInt(req.params.id, 10);
        const entity = await storage_1.Deck.findOne(deckId, { relations: ['user'] });
        if (entity === undefined || entity.user.id !== userId) {
            res.send({ error: errors_1.ApiErrorEnum.DECK_INVALID });
            return;
        }
        const deck = {
            id: entity.id,
            name: entity.name,
            isValid: entity.isValid,
            cardTypes: JSON.parse(entity.cardTypes),
            cards: JSON.parse(entity.cards)
        };
        res.send({ ok: true, deck });
    }
    async onSave(req, res) {
        const body = req.body;
        // optional id parameter, without ID new deck will be created
        if (body.id !== undefined && typeof body.id !== 'number') {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM, param: 'id' });
            return;
        }
        // check if all cards exist in our database
        if (!this.validateCards(body.cards)) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM, param: 'cards' });
            return;
        }
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        let deck = body.id !== undefined
            ? await storage_1.Deck.findOne(body.id, { relations: ['user'] })
            : (() => { const d = new storage_1.Deck(); d.user = user; return d; })();
        if (deck === undefined || deck.user.id !== user.id) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.DECK_INVALID });
            return;
        }
        const deckUtils = new game_1.DeckAnalyser(body.cards);
        deck.name = body.name.trim();
        deck.cards = JSON.stringify(body.cards);
        deck.isValid = deckUtils.isValid();
        deck.cardTypes = JSON.stringify(deckUtils.getDeckType());
        try {
            deck = await deck.save();
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.NAME_DUPLICATE });
            return;
        }
        res.send({
            ok: true, deck: {
                id: deck.id,
                name: deck.name,
                cards: body.cards
            }
        });
    }
    async onDelete(req, res) {
        const body = req.body;
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const deck = await storage_1.Deck.findOne(body.id, { relations: ['user'] });
        if (deck === undefined || deck.user.id !== user.id) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.DECK_INVALID });
            return;
        }
        await deck.remove();
        res.send({ ok: true });
    }
    async onRename(req, res) {
        const body = req.body;
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        let deck = await storage_1.Deck.findOne(body.id, { relations: ['user'] });
        if (deck === undefined || deck.user.id !== user.id) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.DECK_INVALID });
            return;
        }
        try {
            deck.name = body.name.trim();
            deck = await deck.save();
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.NAME_DUPLICATE });
            return;
        }
        res.send({
            ok: true, deck: {
                id: deck.id,
                name: deck.name
            }
        });
    }
    async onDuplicate(req, res) {
        const body = req.body;
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const deck = await storage_1.Deck.findOne(body.id, { relations: ['user'] });
        if (deck === undefined || deck.user.id !== user.id) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.DECK_INVALID });
            return;
        }
        delete body.id;
        body.cards = JSON.parse(deck.cards);
        return this.onSave(req, res);
    }
    validateCards(deck) {
        if (!(deck instanceof Array)) {
            return false;
        }
        const cardManager = game_1.CardManager.getInstance();
        for (let i = 0; i < deck.length; i++) {
            if (typeof deck[i] !== 'string' || !cardManager.isCardDefined(deck[i])) {
                return false;
            }
        }
        return true;
    }
}
__decorate([
    controller_1.Get('/list'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onList", null);
__decorate([
    controller_1.Get('/get/:id'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onGet", null);
__decorate([
    controller_1.Post('/save'),
    services_1.AuthToken(),
    services_1.Validate({
        name: services_1.check().minLength(3).maxLength(32),
        cards: services_1.check().required()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onSave", null);
__decorate([
    controller_1.Post('/delete'),
    services_1.AuthToken(),
    services_1.Validate({
        id: services_1.check().isNumber()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onDelete", null);
__decorate([
    controller_1.Post('/rename'),
    services_1.AuthToken(),
    services_1.Validate({
        id: services_1.check().isNumber(),
        name: services_1.check().minLength(3).maxLength(32),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onRename", null);
__decorate([
    controller_1.Post('/duplicate'),
    services_1.AuthToken(),
    services_1.Validate({
        id: services_1.check().isNumber(),
        name: services_1.check().minLength(3).maxLength(32),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onDuplicate", null);
exports.Decks = Decks;
