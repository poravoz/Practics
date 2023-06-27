import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Telegraf } from 'telegraf';
import { Repository } from 'typeorm'
import { Schedule } from './schedule/schedule.entity';

@Injectable()
export class AppService {
	private bot: Telegraf;
	constructor(
		@InjectRepository(Schedule)
		private readonly scheduleRepository: Repository<Schedule>,
	) {}

	async calculateTimeLeft() {
		const now = new Date();
	  
		const targetTime = new Date();
		targetTime.setHours(10, 20, 0);
	  
		if (now >= targetTime) {
		  const breakEndTime = new Date();
		  breakEndTime.setHours(10, 30, 0);
	  
		  if (now < breakEndTime) {
			return 'Зараз перерва, дурнику';
		  } else {
			const classEndTime = new Date();
			classEndTime.setHours(11, 50, 0);
	  
			if (now < classEndTime) {
			  const timeDiff = classEndTime.getTime() - now.getTime();
			  const minutesLeft = Math.ceil(timeDiff / (1000 * 60));
			  const hoursLeft = Math.floor(minutesLeft / 60);
			  const remainingMinutes = minutesLeft % 60;
	  
			  if (hoursLeft > 0) {
				return `${hoursLeft} година ${remainingMinutes} хвилин`;
			  } else {
				return `${remainingMinutes} хвилин`;
			  }
			} else {
			  const breakStartTime = new Date();
			  breakStartTime.setHours(11, 50, 0);
			  const breakEndTime = new Date();
			  breakEndTime.setHours(12, 30, 0);
	  
			  if (now >= breakStartTime && now < breakEndTime) {
				return 'Зараз перерва, дурнику';
			  } else {
				const nextClassStartTime = new Date();
				nextClassStartTime.setHours(12, 30, 0);
				const nextClassEndTime = new Date();
				nextClassEndTime.setHours(13, 50, 0);
	  
				if (now >= nextClassStartTime && now < nextClassEndTime) {
				  const timeDiff = nextClassEndTime.getTime() - now.getTime();
				  const minutesLeft = Math.ceil(timeDiff / (1000 * 60));
				  const hoursLeft = Math.floor(minutesLeft / 60);
				  const remainingMinutes = minutesLeft % 60;
	  
				  if (hoursLeft > 0) {
					return `${hoursLeft} година ${remainingMinutes} хвилин`;
				  } else {
					return `${remainingMinutes} хвилин`;
				  }
				} else {
				  const breakStartTime = new Date();
				  breakStartTime.setHours(13, 50, 0);
				  const breakEndTime = new Date();
				  breakEndTime.setHours(14, 0, 0);
	  
				  if (now >= breakStartTime && now < breakEndTime) {
					return 'Зараз перерва, дурнику';
				  } else {
					const classStartTime = new Date();
					classStartTime.setHours(14, 0, 0);
					const classEndTime = new Date();
					classEndTime.setHours(15, 30, 0);
	  
					if (now >= classStartTime && now < classEndTime) {
					  const timeDiff = classEndTime.getTime() - now.getTime();
					  const minutesLeft = Math.ceil(timeDiff / (1000 * 60));
					  const hoursLeft = Math.floor(minutesLeft / 60);
					  const remainingMinutes = minutesLeft % 60;
	  
					  if (hoursLeft > 0) {
						return `${hoursLeft} година ${remainingMinutes} хвилин`;
					  } else {
						return `${remainingMinutes} хвилин`;
					  }
					} else {
					  const afterClassEndTime = new Date();
					  afterClassEndTime.setHours(15, 30, 0);
	  
					  if (now >= afterClassEndTime) {
						return 'Йди до дому, дядь...';
					  }
					}
				  }
				}
			  }
			}
		  }
		}
	  
		const timeDiff = targetTime.getTime() - now.getTime();
		const minutesLeft = Math.ceil(timeDiff / (1000 * 60));
		const hoursLeft = Math.floor(minutesLeft / 60);
		const remainingMinutes = minutesLeft % 60;
	  
		if (hoursLeft > 0) {
		  return `${hoursLeft} година ${remainingMinutes} хвилин`;
		} else {
		  return `${remainingMinutes} хвилин`;
		}
	  }
	  
	  async getMondayScheduleInfo(): Promise<string> {
		const mondaySchedule = await this.getScheduleByDay('Понеділок')
		if (!mondaySchedule) {
		  throw new NotFoundException('Schedule not found for Monday');
		}
		
		const scheduleInfo = mondaySchedule.map(schedule => {
		  const { time, subjects, teachers, classroomLinks } = schedule;
		  const scheduleItems = time.map((timeSlot, index) => {
			const subject = subjects[index];
			const teacher = teachers[index];
			const classroomLink = classroomLinks[index];
			return `Час: ${timeSlot}\nПредмет: ${subject}\nВикладач: ${teacher}\nПосилання на пару: ${classroomLink}`;
		  });
		  return scheduleItems.join('\n\n');
		}).join('\n\n');
	  
		return scheduleInfo;
	  }

	  async getActionScheduleInfo(): Promise<string> {
		const actionSchedule = await this.getScheduleByDay('Консультації')
		if (!actionSchedule) {
		  throw new NotFoundException('Schedule not found for Monday');
		}
		
		const scheduleInfo = actionSchedule.map(schedule => {
		  const { time, subjects, teachers, classroomLinks } = schedule;
		  const scheduleItems = time.map((timeSlot, index) => {
			const subject = subjects[index];
			const teacher = teachers[index];
			const classroomLink = classroomLinks[index];
			return `${timeSlot}\nПредмет: ${subject}\nВикладач: ${teacher}\nПосилання на пару: ${classroomLink}`;
		  });
		  return scheduleItems.join('\n\n');
		}).join('\n\n');
	  
		return scheduleInfo;
	  }

	  async getScheduleInfoByDay(dayOfWeek: string): Promise<string> {
		const schedule = await this.getScheduleByDay(dayOfWeek);
		if (!schedule || schedule.length === 0) {
		  throw new NotFoundException(`Schedule not found for ${dayOfWeek}`);
		}
	  
		const scheduleInfo = schedule.map(scheduleItem => {
		  const { time, subjects, teachers, classroomLinks } = scheduleItem;
		  const scheduleItems = time.map((timeSlot, index) => {
			const subject = subjects[index];
			const teacher = teachers[index];
			const classroomLink = classroomLinks[index];
			return `Час: ${timeSlot}\nПредмет: ${subject}\nВикладач: ${teacher}\nПосилання на пару: ${classroomLink}`;
		  });
		  return scheduleItems.join('\n\n');
		}).join('\n\n');
	  
		return scheduleInfo;
	  }
	  
	  async getScheduleByDay(dayOfWeek: string): Promise<Schedule[]> {
		const schedule = await this.scheduleRepository.find({ where: { dayOfWeek } });
		if (!schedule || schedule.length === 0) {
		  throw new NotFoundException(`Schedule not found for ${dayOfWeek}`);
		}
		return schedule;
	  }
}
