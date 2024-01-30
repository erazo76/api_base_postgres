import { MailerOptions } from "@nest-modules/mailer";
import { HandlebarsAdapter } from "@nest-modules/mailer/dist/adapters/handlebars.adapter";

export const mailerConfig: MailerOptions = {
  transport: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "puntoazulpanaderia@gmail.com",
      pass: "lwew cbyp ezrm fwfz",
    },
  },
  defaults: {
    from: '"Panaderia Punto Azul" <no-reply@localhost>',
  },
  template: {
    dir: process.cwd() + "/template",
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
