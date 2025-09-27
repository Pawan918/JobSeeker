import { z } from "zod"
import { reactive } from "vue"

export function useValidation<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
    const errors = reactive<Record<string, string | undefined>>({})

    function validate(data: any): boolean {
        Object.keys(errors).forEach((key) => (errors[key] = undefined))
        const result = schema.safeParse(data)
        if (!result.success) {
            result.error.errors.forEach((err) => {
                const field = err.path[0] as string
                errors[field] = err.message
            })
            return false
        }
        return true
    }

    return { validate, errors }
}
