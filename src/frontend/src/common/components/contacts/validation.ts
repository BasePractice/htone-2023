import {TypeOf, z} from 'zod';

export const contactsSchema = z.object({
    name: z.string().min(1, 'Значение не может быть пустым'),
    desc: z.string().optional(),
    email: z.string()
        .min(1, 'Значение не может быть пустым')
        .email('Неверный формат email')
        .trim(),
    phone: z.string().min(1, 'Значение не может быть пустым'),
});

export type TContactsSchema = TypeOf<typeof contactsSchema>;
