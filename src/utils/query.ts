export const getQueryParamValue = (
  search: string,
  queryParamKey: string
): string | null => {
  const regexPattern = new RegExp(`^${queryParamKey}=`, 'i');

  const queryParam = search
    .replace('?', '')
    .split('&')
    .find(q => regexPattern.test(q));

  return queryParam ? queryParam.split('=')[1] : null;
};
