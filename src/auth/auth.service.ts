import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { ErrorHandleService } from '../common/exception/exception.controller';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly errorHandler: ErrorHandleService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...restoData } = createUserDto;

      const user = this.userRepository.create({
        ...restoData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      // ? retornar el jwt de acceso
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
      //return user;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
    //return 'This action adds a new auth';
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 1 } = paginationDto;
    const pagination = (offset - 1) * limit;
    const builder = this.userRepository.createQueryBuilder('user');
    const totalRegistros = await builder.getCount();
    const totalPaginas = Math.ceil((totalRegistros * 1) / limit);
    const users = await this.userRepository.find({
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
    return { users, paginar };
    //return this.userModel.find();
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user)
      throw new UnauthorizedException(`Credenciales no son validas email`);
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(`Credenciales no son validas password`);

    /*const data = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    };*/

    delete user.password;

    // ? retornar el jwt
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
    //return 'This action adds a new auth';
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async findOne(id: string) {
    let user: User;
    if (isUUID(id)) {
      user = await this.userRepository.findOneBy({ id: id });
    } // else {
    //const builder = this.userRepository.createQueryBuilder('user');
    //user = await builder
    //  .where(`UPPER(title) =:title or slug =:slug`, {
    //    title: term.toUpperCase(),
    //    slug: term.toLowerCase(),
    //  })
    //  .leftJoinAndSelect('prod.images', 'prodImages')
    //  .getOne();
    // }
    //const product = await this.productRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id: ${id} not in data base`);
    }
    return user;
    //return `This action returns a #${id} product`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user: User;
    let pass: string;

    const { password, ...restoData } = updateUserDto;

    if (restoData.fullName) {
      updateUserDto.fullName = updateUserDto.fullName.toLocaleLowerCase();
    }

    // ? validar que la contraseña enviada es diferente a la que esta en la bd y actualizarla
    if (password) {
      pass = bcrypt.hashSync(password, 10);
      //console.log(pass);
    }

    const data = {
      password: pass,
      ...restoData,
    };

    // eslint-disable-next-line prefer-const
    user = await this.userRepository.preload({
      id,
      ...data,
    });

    this.findOne(id);

    try {
      await this.userRepository.update(id, data); //* Guardar en la Base de datos
      return user;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async remove(id: string) {
    this.findOne(id);
    try {
      await this.userRepository.update(id, {
        isActive: false,
      });
      return `usuario ha sido removido con exito`;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }
}
