import { Controller, Get, Post, Delete, Put, Body, Param, Query, NotFoundException } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from './schedule.entity';

@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  findAll(): Promise<Schedule[]> {
    return this.scheduleService.findAll();
  }

  @Get('day')
  async getScheduleByDay(@Query('dayOfWeek') dayOfWeek: string): Promise<Schedule> {
    const schedule = await this.scheduleService.getScheduleByDay(dayOfWeek);
    if (!schedule) {
      throw new NotFoundException('Schedule not found for the given day');
    }
    return schedule;
  }

  @Post()
  async createSchedules(@Body() createScheduleDtoArray: Schedule[]): Promise<Schedule[]> {
    return this.scheduleService.createSchedules(createScheduleDtoArray);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateScheduleDto: Schedule): Promise<Schedule> {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.scheduleService.delete(id);
  }
}