import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TelegrafModule } from 'nestjs-telegraf'
import * as LocalSession from 'telegraf-session-local'
import { AppService } from './app.service'
import { AppUpdate } from './app.update'
import { TG_TOKEN } from './config'
import { DatabaseModule } from './database/database.module'
import { Schedule } from './schedule/schedule.entity'
import { ScheduleModule } from './schedule/schedule.module'
import { ScheduleService } from './schedule/schedule.service'
import * as Joi from "joi";
import { ConfigModule } from '@nestjs/config'
import { VideosController } from './youtube-api/youtube-api.controller'

const sessions = new LocalSession({ database: 'session_db.json' })

@Module({
	imports: [
		TelegrafModule.forRoot({
			middlewares: [sessions.middleware()],
			token: TG_TOKEN
		}),

		ConfigModule.forRoot({ 
			validationSchema: Joi.object({
				TYPEORM_HOST: Joi.string().required(),
				TYPEORM_PORT: Joi.string().required(),
				TYPEORM_DATABASE: Joi.string().required(),
				TYPEORM_USERNAME: Joi.string().required(),
				TYPEORM_PASSWORD: Joi.string().required(),
			})
		}),
		DatabaseModule,
		ScheduleModule,

		TypeOrmModule.forFeature([Schedule])
	],
	providers: [AppService, AppUpdate, ScheduleService],
	controllers: [VideosController],

})
export class AppModule {}
