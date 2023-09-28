export const isValidISODateWithoutHours = (dateString: string): boolean => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!isoDateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);

  return !isNaN(date.getTime());
};
