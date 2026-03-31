import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NewsEntity } from './News.entity';
import { NewsActionType } from 'src/modules/news/news-types';
import { UserEntity } from './User.entity';

@Entity('news_action_history')
export class NewsActionHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  newsId: number;

  @ManyToOne(() => NewsEntity, (item: NewsEntity) => item.actionHistory)
  @JoinColumn({
    name: 'newsId',
  })
  news: NewsEntity;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'userId',
  })
  user: UserEntity;

  @Column({ type: 'enum', enum: NewsActionType })
  actionType: NewsActionType;
}
