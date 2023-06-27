import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find();
  }

  async getScheduleByDay(dayOfWeek: string) {
    const schedule = await this.scheduleRepository.findOne({ where: { dayOfWeek } });
    if (!schedule) {
      throw new Error('Schedule not found for the given day');
    }  
    return schedule;
  }

  async createSchedules(createScheduleDtoArray: Schedule[]): Promise<Schedule[]> {
    const createdSchedules: Schedule[] = [];

    for (const createScheduleDto of createScheduleDtoArray) {
      const { dayOfWeek, time, subjects, teachers, classroomLinks } = createScheduleDto;

      const schedule = new Schedule();
      schedule.dayOfWeek = dayOfWeek;
      schedule.time = time;
      schedule.subjects = subjects;
      schedule.teachers = teachers;
      schedule.classroomLinks = classroomLinks;

      const createdSchedule = await this.scheduleRepository.save(schedule);
      createdSchedules.push(createdSchedule);
    }

    return createdSchedules;
  }

  async update(id: number, updateScheduleDto: Schedule): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne( {where: {id}});

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    schedule.dayOfWeek = updateScheduleDto.dayOfWeek;
    schedule.time = updateScheduleDto.time;
    schedule.subjects = updateScheduleDto.subjects;
    schedule.teachers = updateScheduleDto.teachers;
    schedule.classroomLinks = updateScheduleDto.classroomLinks;

    return this.scheduleRepository.save(schedule);
  }

  async delete(id: number): Promise<void> {
    await this.scheduleRepository.delete(id);
  }
}