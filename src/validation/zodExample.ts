import { z } from 'zod';

export const userSchema = z.object({
  name: z
    .string()
    .min(2, { message: '2글자 이상' })
    .regex(/^[가-힣]+$/, { message: '한글만 입력하세요' }),
  age: z.number().min(0).max(120),
});
