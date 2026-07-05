import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly accessTokenSecret: string,
    private readonly refreshTokenSecret: string,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.accessTokenSecret = configService.getOrThrow<string>(
      'ACCESS_TOKEN_SECRET',
    );
    this.refreshTokenSecret = configService.getOrThrow<string>(
      'REFRESH_TOKEN_SECRET',
    );
  }

  parseBaseToken(basicToken: string) {
    const basicSplit = basicToken.split('.');

    if (basicSplit.length !== 2) throw new BadRequestException();

    const [_, token] = basicSplit;

    const decoded = Buffer.from(token, 'base64').toString('utf-8');

    const tokenSplit = decoded.split(':');

    if (tokenSplit.length !== 2) throw new BadRequestException();

    const [email, password] = tokenSplit;

    return { email, password };
  }

  async register(token: string) {
    const { email, password } = this.parseBaseToken(token);

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) throw new ConflictException();

    await bcrypt.hash(password, 10);

    await this.userRepository.save({ email, password });
  }

  async login(token: string) {
    const { email, password } = this.parseBaseToken(token);

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) throw new BadRequestException();

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new BadRequestException();

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        role: user.role,
        type: 'refresh',
      },
      {
        secret: this.refreshTokenSecret,
        expiresIn: '7d',
      },
    );

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        role: user.role,
        type: 'access',
      },
      {
        secret: this.accessTokenSecret,
        expiresIn: '15m',
      },
    );

    return { refreshToken, accessToken };
  }
}
