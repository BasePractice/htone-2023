import {TypeOf, z} from 'zod';

export const companySchema = z.object({
    name: z.string().min(1, 'Значение не может быть пустым'),
    inn: z.string().min(1, 'Значение не может быть пустым'),
    ogrn: z.string().min(1, 'Значение не может быть пустым'),
    legal_address: z.string().min(1, 'Значение не может быть пустым'),
    postal_address: z.string().min(1, 'Значение не может быть пустым'),
    director: z.string().min(1, 'Значение не может быть пустым'),
});

export type TCompanySchema = TypeOf<typeof companySchema>;


