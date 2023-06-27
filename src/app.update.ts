import {
	Hears,
	Start,
	Update
} from 'nestjs-telegraf'
import { actionButtons } from './app.buttons'
import { AppService } from './app.service'
import { Context } from './context.interface'
import { Action } from 'nestjs-telegraf';
import axios from 'axios';

let lastVideoUrl = null;

@Update()
export class AppUpdate {

	constructor(
		private readonly appService: AppService,	
	) {}

	@Start()
	async startCommand(ctx: Context) {
	  await ctx.reply('Привіт, студенте! 👋');
	  await ctx.reply('Що ти сьогодні хочешь дізнатись ?', actionButtons());
	
	  const response = await axios.get('http://localhost:3000/videos/');
	  const videoUrl = response.data;
	  if (videoUrl !== lastVideoUrl) {
		await ctx.reply(`На каналі Іванєу новий відос, подивись першим 😏: ${videoUrl}`);
		lastVideoUrl = videoUrl;
	  } else {
		return "На каналі Іванєу нових відео не виходило 😢";
	  }
	}

	@Hears('🕐 Скільки до кінця пари ?')
	async timeToEnd(ctx: Context) {
	  const timeLeft = await this.appService.calculateTimeLeft();
	  
	  if(timeLeft === 'Йди до дому, дядь...') {
		await ctx.reply('Йди до дому, дядь...');
	  } else if(timeLeft !== 'Зараз перерва, дурнику') {
		await ctx.reply(`До кінця пари залишилось ${timeLeft}`);
	  } else {
		await ctx.reply(timeLeft);
	  }

	}
	
	@Hears('📋 Розклад')
	async schedule(ctx: Context) {
	  const buttons = [
		[{ text: 'Понеділок', callback_data: 'monday' }],
		[{ text: 'Вівторок', callback_data: 'tuesday' }],
		[{ text: 'Середа', callback_data: 'wednesday' }],
		[{ text: 'Четвер', callback_data: 'thursday' }],
		[{ text: 'Пʼятниця', callback_data: 'friday' }],

	  ];
	
	  const replyText = 'Обери день:';
	
	  await ctx.reply(replyText, {
		reply_markup: {
		  inline_keyboard: buttons
		}
	  });

	}

	@Hears('📖 Консультація')
	async action(ctx: Context) {
		const scheduleInfo = await this.appService.getActionScheduleInfo();
		const replyText = `Консультації:\n\n${scheduleInfo}`;
		  await ctx.reply(replyText);
	}

	@Hears('🔎 Канали Викладачів')
	async SecretButton(ctx: Context) {
		const buttons = [
		[{ text: 'Канал Іванєу', callback_data: 'сhannel_ivane' }],
		[{ text: 'Канал Борі', callback_data: 'сhannel_borya' }]
		];

		const replyText = 'Є 2 викладача які ведуть свої YouTube канали ти можешь подивитися що на цих каналах 🙂:';
	
		await ctx.reply(replyText, {
		  reply_markup: {
			inline_keyboard: buttons
		  }
		});
	}
	
	@Action('monday')
	async handleMondaySchedule(ctx: Context) {
	  const scheduleInfo = await this.appService.getMondayScheduleInfo();
	  const replyText = `Розклад на понеділок:\n\n${scheduleInfo}`;
	  await ctx.reply(replyText);
	}
	
	@Action('tuesday')
	async handleTuesdaySchedule(ctx: Context) {
  	  const scheduleInfo = await this.appService.getScheduleInfoByDay('Вівторок');
  	  const replyText = `Розклад на вівторок:\n\n${scheduleInfo}`;
  	  await ctx.reply(replyText);
	}

	@Action('wednesday')
	async handleWednesdaySchedule(ctx: Context) {
      const scheduleInfo = await this.appService.getScheduleInfoByDay('Середа');
  	  const replyText = `Розклад на середу:\n\n${scheduleInfo}`;
 	 await ctx.reply(replyText);
	}

	@Action('thursday')
	async handleThursdaySchedule(ctx: Context) {
  	  const scheduleInfo = await this.appService.getScheduleInfoByDay('Четверг');
      const replyText = `Розклад на четвер:\n\n${scheduleInfo}`;
  	  await ctx.reply(replyText);
	}

	@Action('friday')
	async handleFridaySchedule(ctx: Context) {
  	  const scheduleInfo = await this.appService.getScheduleInfoByDay('П\'ятниця');
	  const replyText = `Розклад на пʼятницю:\n\n${scheduleInfo}`;
  	  await ctx.reply(replyText);
	}

	@Action('сhannel_ivane')
	async handleChannelIvane(ctx: Context) {
		return 'https://www.youtube.com/@devreactor';
	}
	@Action('сhannel_borya')
	async handleChannelBorya() {
		return 'https://www.youtube.com/@programmer7947';
	}
	

}


