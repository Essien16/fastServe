import { getMaxListeners } from 'events';
import * as nodeMailer from 'nodemailer';
import * as sendGrid from 'nodemailer-sendgrid-transport'
import { getEnvironmentVariables } from '../environments/environment';

export class NodeMailer {

    private static initiateTransport() {
    //     return nodeMailer.createTransport(
    //       // sendGrid({
    //       //     auth: {
    //       //         api_key: getEnvironmentVariables().sendgrid_api
    //       //     }
    //       // })
    //     //   {
    //     //     service: "gmail",
    //     //     auth: {
    //     //       user: getEnvironmentVariables().gmail_auth.user,
    //     //       pass: getEnvironmentVariables().gmail_auth.pass,
    //     //     },
    //     //   }
    //     );
    return nodeMailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: getEnvironmentVariables().mailtrap_auth.user,
        pass: getEnvironmentVariables().mailtrap_auth.pass,
      },
    });
    }

    static sendMail(data: {to: [string], subject: string, html: string}): Promise<any> {
        return NodeMailer.initiateTransport().sendMail({
            from: 'essienjustice@gmail.com',
            to: data.to,
            subject: data.subject,
            html: data.html
        });
    }
}