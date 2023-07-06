/* eslint-disable prefer-const */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ErrorHandleService } from 'src/common/exception/exception.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class PersonService {
  constructor(
    private readonly errorHandler: ErrorHandleService,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const person = this.personRepository.create(createPersonDto);
      await this.personRepository.save(person);
      return person;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 1 } = paginationDto;
    console.log(limit);
    const pagination = (offset - 1) * limit;
    const builder = this.personRepository.createQueryBuilder('person');
    const totalRegistros = await builder.getCount();
    const totalPaginas = Math.ceil((totalRegistros * 1) / limit);
    const persons = await this.personRepository.find({
      take: limit,
      skip: pagination,
    });
    const paginar = {
      antes: offset - 1,
      actual: offset,
      despues: offset + 1,
      totalRegistros,
      totalPaginas,
    };
    return { persons, paginar };
    //return `This action returns all person`;
  }

  async findOne(id: string) {
    let person: Person;
    if (isUUID(id)) {
      person = await this.personRepository.findOneBy({ id: id });
    }

    if (!person) {
      throw new NotFoundException(`Person with id: ${id} not in data base`);
    }
    return person;
    //return `This action returns a #${id} person`;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    let person: Person;
    person = await this.personRepository.preload({
      id,
      ...updatePersonDto,
    });

    this.findOne(id);

    try {
      await this.personRepository.update(id, updatePersonDto);
      return person;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async remove(id: string) {
    this.findOne(id);
    try {
      await this.personRepository.update(id, {
        isActive: false,
      });
      return `person has been remove with success`;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
    //return `This action removes a #${id} person`;
  }
}
