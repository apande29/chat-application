import { HttpStatus } from '../enums/global.enum';

export interface IApiResponse<T> {
  success: boolean;
  status?: HttpStatus;
  message: string;
  data?: T;
  error?: any;
}
