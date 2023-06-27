import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: string;

  @Column('varchar', { array: true })
  time: string[];

  @Column('varchar', { array: true })
  subjects: string[]; 

  @Column('varchar', { array: true })
  teachers: string[];

  @Column('varchar', { array: true })
  classroomLinks: string[]; 
}

