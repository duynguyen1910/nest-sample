import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const accessPayload = {
      username: user.username,
      sub: user.userId,
      type: 'access',
    };
    const refreshPayload = { sub: user.userId, type: 'refresh' };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
