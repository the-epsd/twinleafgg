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
exports.Avatar = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
let Avatar = class Avatar extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.user = new user_1.User();
        this.name = '';
        this.fileName = '';
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Avatar.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_1.User, user => user.avatars),
    __metadata("design:type", user_1.User)
], Avatar.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Avatar.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Avatar.prototype, "fileName", void 0);
Avatar = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(['user', 'name'])
], Avatar);
exports.Avatar = Avatar;
