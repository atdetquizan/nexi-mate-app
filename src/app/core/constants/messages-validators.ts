export const MessagesValidators = {
  required: () => 'Campo obligatorio.',
  email: () => 'El correo electrónico no es válido.',
  minlength: (validatorValue?: { requiredLength: number }) =>
    `Este campo debe tener al menos ${validatorValue?.requiredLength} caracteres.`,
  maxlength: (validatorValue?: { requiredLength: number }) =>
    `Este campo no puede exceder los ${validatorValue?.requiredLength} caracteres.`,
  min: (validatorValue?: { min: number }) =>
    `El valor debe ser mayor o igual a ${validatorValue?.min}.`,
  max: (validatorValue?: { max: number }) =>
    `El valor debe ser menor o igual a ${validatorValue?.max}.`,
  pattern: () => 'El formato del campo no es válido.',
  customError: (validatorValue?: { name: string; type: string }) =>
    `Error personalizado: ${validatorValue?.name} (${validatorValue?.type}).`,
  maxAmount: (validatorValue?: { maxAmount: number }) =>
    `El monto no puede exceder ${validatorValue?.maxAmount}.`,
  rucInvalid: () => 'El número de RUC ingresado no es válido.',
  invalidPhone: () => 'El número de celular ingresado no es correcto.',
  invalidDNI: () => 'Numero de DNI invalido.',
  invalidCE: () => 'Numero de Carnet de extranjería invalido.',
};
