import { BadRequestError } from '../errors';
import { CreateColumnDto } from '../types';

export const validateCreateColumn = (data: CreateColumnDto): void => {
  if (!data.title || data.title.trim() === '') {
    throw new BadRequestError('컬럼 제목은 필수입니다.', 'VALIDATION_ERROR');
  }
};

export const validateUpdateColumn = (id: string): void => {
  if (id !== undefined) {
    if (!id || id.trim() === '') {
      throw new BadRequestError('해당 컬럼을 찾을 수 없습니다.', 'NOT_FOUND');
    }
  }
};
