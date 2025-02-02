import { EmailTemplate } from './email-template';
export declare class Mailer {
    sendEmail(email: string, template: EmailTemplate, params: {
        [key: string]: string;
    }): Promise<void>;
}
