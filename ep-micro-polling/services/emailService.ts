import { logger, ejsUtils, nodemailerUtils } from "ep-micro-common";

export const emailService = {
    sendEmail: async (subject: string, template: string, toEmail: string, data: any) => {
        try {
            logger.info(`emailService :: sendEmail :: template :: ${template} :: toEmail :: ${toEmail} :: data :: ${JSON.stringify(data)}`);
            const emailTemplateHtml = await ejsUtils.generateHtml(template, data);
            await nodemailerUtils.sendEmail(subject, emailTemplateHtml, toEmail);
        } catch (error) {
            logger.error(`emailService :: sendEmail :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}