"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mailer = void 0;
const nodemailer_1 = require("nodemailer");
const config_1 = require("../config");
class Mailer {
    async sendEmail(email, template, params) {
        const transportOptions = config_1.config.email.transporter;
        const transporter = nodemailer_1.createTransport(transportOptions);
        let subject = template.subject;
        let text = template.body;
        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                subject = subject.replace('{' + key + '}', params[key]);
                text = text.replace('{' + key + '}', params[key]);
            }
        }
        const from = config_1.config.email.sender;
        const to = email;
        await transporter.sendMail({ from, to, subject, text });
    }
}
exports.Mailer = Mailer;
