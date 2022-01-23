
export const validateModel = function (model, vm, allowNull, cb) {
  var letNull = allowNull || false
  if (model) {
    _modelAttributeValidation(model, vm, letNull, cb)
  }
}

export const validateNonNestedField = function (fieldNameString, vm, cb) {
  if (fieldNameString) {
    _fieldValidation(fieldNameString, vm, cb)
  }
}

export const validateExists = function (key, value, vm) {
  if (value && value !== 'default' && value !== '') {
    vm.valid[key] = true
  } else {
    vm.valid[key] = false
  }
}

export const validateBoolean = function (key, value, vm) {
  if (value) {
    vm.valid[key] = true
  } else {
    vm.valid[key] = false
  }
}

export const validatePhone = function (key, value, moreThan, lessThan, dataObj, vm) {
  if (value) {
    var punctuationless = value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
    var phoneNospaces = punctuationless.replace(/\s{2,}/g," ")
    vm[dataObj].phone = phoneNospaces
    var numberizedVal = Number(phoneNospaces)

    if (!Number.isNaN(numberizedVal)) {
      if (String(numberizedVal).length > moreThan && String(numberizedVal).length < lessThan) {
        vm.valid[key] = true
      } else {
        vm.valid[key] = false
      }
    } else {
      vm.valid[key] = false
    }
  } else {
    vm.valid[key] = false
  }
}
