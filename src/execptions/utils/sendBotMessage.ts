import { Telegraf, Context } from 'telegraf';

export async function sendBotMessage(err: any) {
  let bot: Telegraf<Context>;

  return await bot.telegram.sendMessage(879727058, err.toString());
}
