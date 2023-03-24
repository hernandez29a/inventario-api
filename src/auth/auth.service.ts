import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { ErrorHandleService } from '../common/exception/exception.controller';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

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
}
