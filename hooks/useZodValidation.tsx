import { useState } from 'react';

export const useZodValidation = (schema: any) => {
    const [error, setError] = useState(null);

    const validate = (value: any) => {
        const result = schema.safeParse(value);
        if (!result.success) {
            setError(result.error.issues[0]?.message || 'Invalid input');
            return false;
        }
        setError(null);
        return true;
    };

    const resetError = () => setError(null);

    return { error, validate, resetError };
};
