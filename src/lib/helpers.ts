export const hasOwnProperty = <X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> => {
  return obj.hasOwnProperty(prop);
};

export const isValidISODateWithoutHours = (dateString: string) => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!isoDateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  const isValidDate = !isNaN(date.getTime());

  return isValidDate;
};
