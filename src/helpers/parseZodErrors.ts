import * as z from 'zod';

const parseZodErrors = (error: z.ZodError) => {
  const errors: string[] = [];
  const formatedErrors = error.format();
  Object.keys(formatedErrors).forEach((key: string) => {
    if (formatedErrors[key]._errors) {
      if (formatedErrors[key]._errors.length === 0) {
        const internalFormattedErrors = formatedErrors[key];
        delete internalFormattedErrors._errors;
        Object.keys(internalFormattedErrors).forEach((value: string) => {
          const errValue = internalFormattedErrors[value].groupId._errors[0];
          errors.push(`${String(key)}.groupId: ${errValue}`.trim());
        });
        return;
      }
      return (formatedErrors[key]._errors.forEach((ee: string) => { errors.push(`${String(key)}: ${ee}`.trim()); }));
    }
  });

  const uniqueErrors = [...new Set(errors)];
  return uniqueErrors;
};

export default parseZodErrors;
