import { EmailTemplate } from '../email-template';

const en: EmailTemplate = {
  subject: 'twinleaf.gg Password Reset',
  body:
    `You are receiving this because you (or someone else) have requested the reset of the password for your account.
Please click on the following link, or paste this into your browser to complete the process:

{publicAddress}/reset-password/{token}

If you did not request this, please ignore this email and your password will remain unchanged.`
};

export const resetPasswordTemplates: { [key: string]: EmailTemplate } = { en };
