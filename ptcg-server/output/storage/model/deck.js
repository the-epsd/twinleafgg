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
exports.Deck = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
let Deck = class Deck extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.user = new user_1.User();
        this.name = '';
        this.cards = '';
        this.isValid = false;
        this.cardTypes = '[]';
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Deck.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_1.User, user => user.decks),
    __metadata("design:type", user_1.User)
], Deck.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Deck.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: 'text' }),
    __metadata("design:type", String)
], Deck.prototype, "cards", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Deck.prototype, "isValid", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Deck.prototype, "cardTypes", void 0);
Deck = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(['user', 'name'])
], Deck);
exports.Deck = Deck;
