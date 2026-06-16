export const onlyDigits = (value = '') => String(value).replace(/\D/g, '');

const limit = (value, length) => onlyDigits(value).slice(0, length);

export const maskCpf = (value) => limit(value, 11)
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

export const maskCnpj = (value) => limit(value, 14)
  .replace(/(\d{2})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1/$2')
  .replace(/(\d{4})(\d{1,2})$/, '$1-$2');

export const maskCep = (value) => limit(value, 8).replace(/(\d{5})(\d)/, '$1-$2');

export const maskPhone = (value) => {
  const digits = limit(value, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
};

const validateDocument = (value, length, weights) => {
  const digits = limit(value, length);
  if (digits.length !== length || /^(\d)\1+$/.test(digits)) return false;

  return weights.every((weightSet, index) => {
    const source = digits.slice(0, weightSet.length);
    const sum = source.split('').reduce((total, digit, i) => total + Number(digit) * weightSet[i], 0);
    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? 0 : 11 - remainder;
    return checkDigit === Number(digits[weightSet.length]);
  });
};

export const isValidCpf = (value) => validateDocument(value, 11, [
  [10, 9, 8, 7, 6, 5, 4, 3, 2],
  [11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
]);

export const isValidCnpj = (value) => validateDocument(value, 14, [
  [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
]);

