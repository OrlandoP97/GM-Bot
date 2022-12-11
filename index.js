const { Telegraf } = require('telegraf')

const TOKEN = `5980263420:AAE2vyhZCKFEmP1o7UOmeOtaT0PRxfI3_HI`
const bot = new Telegraf(TOKEN)

async function run(){
    try {
         // Set up a message handler that will send a "Good morning" message to users
        bot.on('message', (ctx) => {
          const timezoneOffset = ctx.message.from.timezone_offset;
          const currentTime = new Date().getTime();
          const localTime = new Date(currentTime + timezoneOffset * 1000);
          
          if (localTime.getHours() === 7 && localTime.getMinutes() === 0) {
            bot.sendMessage(ctx.message.from.id, 'Good morning!');
          } else if (localTime.getHours() === 13 && localTime.getMinutes() === 0) {
            bot.sendMessage(ctx.message.from.id, 'Good afternoon!');
          }
        
        });
        
        // Start the bot
        bot.startPolling();
        console.log("Bot running with new changes...");
    } catch(err) {
        console.log(err)
    }
}


run()