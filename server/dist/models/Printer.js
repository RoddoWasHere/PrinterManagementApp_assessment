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
exports.Printer = void 0;
const typeorm_1 = require("typeorm");
let Printer = class Printer {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Printer.prototype, "id", void 0);
__decorate([
    typeorm_1.Column() //varchar(255)
    ,
    __metadata("design:type", String)
], Printer.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ length: 15 }),
    __metadata("design:type", String)
], Printer.prototype, "ipAddress", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Printer.prototype, "isActive", void 0);
Printer = __decorate([
    typeorm_1.Entity()
], Printer);
exports.Printer = Printer;
//# sourceMappingURL=Printer.js.map