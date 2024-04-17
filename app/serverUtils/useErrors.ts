export function useErrors() {
  const errors: string[] = [];

  function pushErrors(error: string) {
    errors.push(error);
  }

  function requiredParams(params: { [key: string]: FormDataEntryValue | null }) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) {
        pushErrors(`${key} is required`);
      }
    });
  }

  return {
    errors,
    pushErrors,
    requiredParams,
  };
}
