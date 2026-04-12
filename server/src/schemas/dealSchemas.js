const { z } = require('zod');

const createDealSchema = z.object({
    body: z.object({
        amount: z.number().positive('Сумма должна быть положительным числом'),
        freelancerId: z.string().uuid('Некорректный ID исполнителя'),
        kworkId: z.string().uuid().optional(),
        projectId: z.string().uuid().optional(),
    }).refine(data => data.kworkId || data.projectId, {
        message: "Необходимо указать либо kworkId, либо projectId",
    })
});

const updateDealStatusSchema = z.object({
    params: z.object({
        id: z.string().uuid('Некорректный ID сделки'),
    }),
    body: z.object({
        status: z.enum(['active', 'submitted', 'completed', 'dispute'], {
            errorMap: () => ({ message: 'Некорректный статус сделки' })
        })
    })
});

module.exports = {
    createDealSchema,
    updateDealStatusSchema
};
