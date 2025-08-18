import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
 import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }
}
//this is the user controller page user controller is the main service for request anf response , the request sent to the server the controller check the request and send the response based on thier request ,