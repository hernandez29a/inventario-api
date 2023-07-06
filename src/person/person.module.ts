import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';

@Module({
  controllers: [PersonController],
  providers: [PersonService],
  imports: [
    ConfigModule,
    CommonModule,
    AuthModule,
    TypeOrmModule.forFeature([Person]),
  ],
  exports: [PersonModule],
})
export class PersonModule {}
