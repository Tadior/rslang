import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  toResponse() {
    const { id, name, email } = this;
    return { id, name, email };
  }
}
