export const serialize = (obj?: object | null) => {
  return JSON.parse(JSON.stringify(obj));
};

export const getErrorMessage = (error: Error | unknown): string => {
  return error instanceof Error ? error.message : 'Unknown error occurred.. Please reload the page and try again.';
};
