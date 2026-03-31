import slugify from 'slugify';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './Category.entity';
import { NewsActionHistoryEntity } from './NewsActionHistory.entity';

@Entity('news')
export class NewsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  thumbnail: string;

  @Column()
  slug: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  like: number;

  @Column({ default: 0 })
  dislike: number;

  @ManyToOne(() => CategoryEntity, (item: CategoryEntity) => item.news, {
    onDelete: 'CASCADE',
  })
  category: CategoryEntity;

  @Column()
  categoryId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => NewsActionHistoryEntity,
    (item: NewsActionHistoryEntity) => item.news,
  )
  actionHistory: NewsActionHistoryEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  beforeUpsert() {
    if (!this.slug && this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true });
    }
  }
}
