import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity()
@Unique(['userId', 'groupId'])
export class UserGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  groupId: string;

  @ManyToOne('User', 'UserGroup')
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  User: User;

  @ManyToOne('Group', 'UserGroup')
  @JoinColumn({
    name: 'groupId',
    referencedColumnName: 'id',
  })
  Group: Group;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
