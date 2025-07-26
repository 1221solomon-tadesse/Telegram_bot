// // src/telegram/telegram.bot.ts

// import { Scenes, session } from 'telegraf';
// import { Telegraf } from 'telegraf';
// import { UsersService } from 'src/users/users.service';
// import { Injectable, OnModuleInit } from '@nestjs/common';
// import * as dotenv from 'dotenv';
// dotenv.config();

// interface MyWizardContext extends Scenes.WizardContext {
//   wizard: Scenes.WizardContext['wizard'] & {
//     state: {
//       username?: string;
//     };
//   };
// }

// @Injectable()
// export class TelegramBotService implements OnModuleInit {
//   constructor(private readonly userService: UsersService) {}

//   private bot: Telegraf<MyWizardContext>;

//   async onModuleInit() {
//     const token = process.env.TELEGRAM_BOT_TOKEN;
//     if (!token) {
//       console.error('Telegram bot token missing in env!');
//       return;
//     }

//     this.bot = new Telegraf<MyWizardContext>(token);

//     const wizard = new Scenes.WizardScene<MyWizardContext>(
//       'auth_wizard',

//       // Step 1: Ask for full name (username)
//       async (ctx) => {
//         await ctx.reply('👋 Welcome! Please enter your full name:');
//         return ctx.wizard.next();
//       },

//       // Step 2: Capture name and ask for email
//       async (ctx) => {
//         if (!ctx.message || !('text' in ctx.message)) {
//           await ctx.reply('❌ Please enter a valid name.');
//           return;
//         }

//         ctx.wizard.state.username = ctx.message.text;
//         await ctx.reply('📧 Now, please enter your email:');
//         return ctx.wizard.next();
//       },

//       // Step 3: Check user credentials
//       async (ctx) => {
//         if (!ctx.message || !('text' in ctx.message)) {
//           await ctx.reply('❌ Please enter a valid email address.');
//           return;
//         }

//         const email = ctx.message.text;
//         const username:any = ctx.wizard.state.username;

//         const user = await this.userService.findByNameAndEmail(username, email);

//         if (user) {
//           await ctx.reply(`✅ Hello ${username}, you're verified!`);
//           await ctx.reply('📋 Choose an option:\n1. FAQ\n2. Contact Support\n3. Exit');
//         } else {
//           await ctx.reply('❌ You are not a registered user. Access denied.');
//         }

//         return ctx.scene.leave();
//       }
//     );

//     const stage = new Scenes.Stage<MyWizardContext>([wizard]);
//     this.bot.use(session());
//     this.bot.use(stage.middleware());

//     this.bot.start((ctx) => ctx.scene.enter('auth_wizard'));

//     await this.bot.launch();
//     console.log('✅ Telegram bot started');
//   }
// }
