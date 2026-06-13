import { isValidCnpj, isValidCpf, maskCep, maskCnpj, maskCpf, maskPhone, onlyDigits } from './masks';

test('formats Brazilian registration fields', () => {
  expect(maskCpf('52998224725')).toBe('529.982.247-25');
  expect(maskCnpj('11222333000181')).toBe('11.222.333/0001-81');
  expect(maskPhone('48999999999')).toBe('(48) 99999-9999');
  expect(maskCep('88000000')).toBe('88000-000');
});

test('sanitizes and validates documents', () => {
  expect(onlyDigits('(48) 99999-9999')).toBe('48999999999');
  expect(isValidCpf('529.982.247-25')).toBe(true);
  expect(isValidCpf('111.111.111-11')).toBe(false);
  expect(isValidCnpj('11.222.333/0001-81')).toBe(true);
});
