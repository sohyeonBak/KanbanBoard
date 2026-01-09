import { BadRequestError } from '../errors/errors';
import { CreateCardDto } from '../types';

export const validateCreateCard = (data: CreateCardDto): void => {
  if (!data.title || data.title.trim() === '') {
    throw new BadRequestError('카드 제목은 1~100자 이내로 입력해주세요.', 'VALIDATION_ERROR');
  }
};
