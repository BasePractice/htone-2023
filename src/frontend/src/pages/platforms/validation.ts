import {TypeOf, z} from 'zod';

export const platformSchema = z.object({
    category: z.string().min(1, 'Значение не может быть пустым'),
    name: z.string().min(1, 'Значение не может быть пустым'),
    description: z.string().min(1, 'Значение не может быть пустым'),
    address: z.string().min(1, 'Значение не может быть пустым'),
    working: z.string().min(1, 'Значение не может быть пустым'),
    url: z.string().min(1, 'Значение не может быть пустым'),
    email: z.string().min(1, 'Значение не может быть пустым'),
    phone: z.string().min(1, 'Значение не может быть пустым'),
    latitude: z.string().min(1, 'Значение не может быть пустым'),
    longitude: z.string().min(1, 'Значение не может быть пустым'),
    unit_price: z.string().min(1, 'Значение не может быть пустым').or(z.number()),
});

export type TPlatformSchema = TypeOf<typeof platformSchema>;


