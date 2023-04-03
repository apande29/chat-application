import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  senderId: string;

  @Column('uuid')
  groupId: string;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne('User', 'Message')
  @JoinColumn({
    name: 'senderId',
    referencedColumnName: 'id',
  })
  User: User;

  @ManyToOne('Group', 'Message')
  @JoinColumn({
    name: 'groupId',
    referencedColumnName: 'id',
  })
  Group: Group;
}
