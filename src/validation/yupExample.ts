import * as yup from 'yup';

export const userSchema = yup.object({
  name: yup.string().required('이름 필수').min(2, '2글자 이상'),
  age: yup.number().min(0).max(120),
});
