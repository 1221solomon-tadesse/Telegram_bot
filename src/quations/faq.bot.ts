import { bot } from '../bot/bot.module';
bot.action(/^faq_(\w+)/, async (ctx) => {
  try {
    await ctx.answerCbQuery();

    const faqId = ctx.match[1];
    // Fetch the FAQ response from your service (you may need to import and inject the service)
    await ctx.reply(`You selected FAQ with id: ${faqId}`);
  } catch (err) {
    console.error("Error handling callback:", err);
    await ctx.reply("Something went wrong.");
  }
});
