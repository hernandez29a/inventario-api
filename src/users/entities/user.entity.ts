import { Person } from 'src/person/entities/person.entity';
import { Product } from 'src/products/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity({ name: 'Usuarios' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
    select: false,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  userName: string;

  @Column({
    type: 'bool',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  roles: string[];

  @Column({
    type: 'text',
    nullable: true,
    default: 'no posee imagen',
  })
  userImage: string;

  // ? columnas de fechas
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Person, (person) => person.id, {
    eager: true, // *para mostrar las relaciones
  })
  @JoinColumn()
  person: Person;

  @OneToMany(() => Product, (product) => product.checkSlugInsert)
  product: Product;

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }
}
