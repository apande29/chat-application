import { IsString, IsOptional } from 'class-validator';

export class JwtDetailsDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  email?: string;
}
