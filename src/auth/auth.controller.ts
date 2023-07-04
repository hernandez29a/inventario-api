import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  ParseUUIDPipe,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('create')
  @Auth(ValidRoles.admin)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('renewToken')
  @Auth()
  checkAutoStatus(
    @GetUser() user: User, //* decorador de parametros
  ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('listUsers')
  @Auth(ValidRoles.user, ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    //console.log(paginationDto);
    return this.authService.findAll(paginationDto);
  }

  @Get('user/:id')
  @Auth(ValidRoles.admin)
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.findOne(id);
  }

  // ? actualizar un usuario
  @Patch(':id')
  @Auth(ValidRoles.admin) // * Solo usuario permitidos tiene acceso
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.update(id, updateUserDto);
  }

  // TODO eliminar un usuario
  @Delete('user/:id')
  @Auth(ValidRoles.admin) // * Solo usuario permitidos tiene acceso
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }
}
