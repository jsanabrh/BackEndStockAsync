import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entities/users.entity';
import { Model } from 'mongoose';
import { hashingService } from '../../../../infrastructure/adapters/hashing/hashing.service';
import { ErrorService } from '../../../../errors/errors.service';

//Services are created for the user module

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly HashingService: hashingService,
    private readonly errorService: ErrorService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await this.HashingService.hash(
        createUserDto.password.trim(),
      );
      const newRecord = new this.userModel(createUserDto);
      return await newRecord.save();
    } catch (error) {
      this.errorService.createError(error);
    }
  }
  async findAll() {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async findOne(userIdentification: string): Promise<User> {
    try {
      const record = await this.userModel
        .findOne({ userIdentification })
        .exec();
      if (!record) {
        throw new NotFoundException('User not found');
      }
      return record;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(userIdentification: string): Promise<any> {
    try {
      const user = await this.userModel
        .findOneAndDelete({ userIdentification: userIdentification })
        .exec();
      if (!user) {
        throw new NotFoundException(
          `User with id ${userIdentification} not found`,
        );
      }
      return await {
        message: `The user with identification number ${user.userIdentification} has been successfully deleted.`,
      };
    } catch (error) {
      this.errorService.createError(error);
    }
  }
}
