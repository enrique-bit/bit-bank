/**
 * Creamos las variables de nuestra aplicación
 */
let account, form, inputName, inputBalance, signUp, atm, userInfo, userName, consignButton, withdrawalsButton

/**
 * Inicializa todas nuestras variables y crea los eventos de la interfaz
 */
function initialize() {
  account = {
    name: '',
    balance: 0
  }

  // Inicializamos los elementos de HTML
  form = document.querySelector('#signUp')
  form.addEventListener('submit', () => openAccount(event))

  inputName = document.querySelector('input#name')
  inputBalance = document.querySelector('input#balance')

  signUp = document.querySelector('.card-form')
  atm = document.querySelector('.atm')
  userInfo = document.querySelector('.header-user_info')
  userName = document.querySelector('#userName')
  balanceAccount = document.querySelector('#balanceAccount')

  // ATM Buttons
  consignButton = document.querySelector('#consignButton')
  consignButton.addEventListener('click', consign)

  withdrawalsButton = document.querySelector('#withdrawalsButton')
  withdrawalsButton.addEventListener('click', withdrawals)

  loadDataFromDatabase()
}

/**
 * Carga los datos almacenados en nuestra base de datos (localStorage)
 */
function loadDataFromDatabase() {
  // Cargamos desde localStorage la información de la cuenta
  const accountDB = JSON.parse(localStorage.getItem('account'))

  // Validamos si en el localStorage habia información valida sobre la cuenta
  if (accountDB !== undefined && accountDB !== null && typeof accountDB.name === 'string' && accountDB.name !== '') {
    account = accountDB
    showATM()
  }
}

/**
 * Crea un objeto cuenta y lo almacena en la base de datos (localStorage)
 * @param {Event} event 
 */
function openAccount(event) {
  // Detiene el envio del formulario (Lo que sería su normal funcionamiento)
  event.preventDefault()
  event.stopPropagation()

  // Leemos los datos de los campos
  const nameFromInput = inputName.value
  const balanceFromInput = inputBalance.value

  // Guardamos los datos leídos en nuestro objeto account
  account.name = nameFromInput
  account.balance = parseInt(balanceFromInput)

  // Imprimimos nuestro objeto account
  // console.log(account)

  // Actualizar nuestra base de datos
  updateDatabase(account)
  showATM()
}

/**
 * Actualiza el saldo en la interfaz
 * @param {Number} balance 
 */
function updateBalance(balance) {
  balanceAccount.innerHTML = `$ ${balance}`
}

/**
 * Almacena una cuenta en la base de datos
 * @param {Account} account 
 */
function updateDatabase(account) {
  // Guardar datos en localStorage
  // localStorage.setItem('Identificador para buscarlo mas adelante', 'El valor, lo que vamos a almacenar')
  localStorage.setItem('account', JSON.stringify(account))
}

/**
 * Oculta la interfaz de apertura de cuentas y muestra la del cajero automatico
 */
function showATM() {
  signUp.style.display = 'none'
  atm.style.display = 'block'

  // Actualizamos los valores de nombre y saldo en la interfaz del ATM (Cajero)
  userName.innerHTML = account.name
  updateBalance(account.balance)

  // Mostramos la información del usuario en la cabecera (header)
  userInfo.style.display = 'flex'
}

/**
 * Crea y muestra una ventana emergente que nos permite realizar una consignación
 */
function consign() {
  swal({
    title: 'Consignación',
    content: {
      element: "input",
      attributes: {
        placeholder: "Monto a consignar....",
        type: "number",
        min: 1,
        required: 'required'
      },
    },
  }).then((result) => {
    const consignmentValue = parseInt(result)

    if (!Number.isNaN(consignmentValue) && consignmentValue > 0) {
      account.balance = account.balance + consignmentValue
      updateBalance(account.balance)
      updateDatabase(account)
    } else {
      swal({
        title: 'Error',
        text: 'No ingresaste un valor válido',
        icon: 'error'
      })
    }
  })
}

/**
 * Crea y muestra una ventana emergente que nos permite realizar un retiro
 */
function withdrawals() {
  swal({
    title: 'Retiro',
    content: {
      element: "input",
      attributes: {
        placeholder: "Monto a retirar....",
        type: "number",
        min: 1,
        required: 'required'
      },
    },
  }).then((result) => {
    const withdrawalsValue = parseInt(result)

    if (!Number.isNaN(withdrawalsValue) && withdrawalsValue > 0) {
      if ((account.balance - withdrawalsValue) >= 0) {
        account.balance = account.balance - withdrawalsValue
        updateBalance(account.balance)
        updateDatabase(account)
      } else {
        swal({
          title: 'Error',
          text: 'Fondos insuficientes',
          icon: 'error'
        })
      }
    } else {
      swal({
        title: 'Error',
        text: 'No ingresaste un valor válido',
        icon: 'error'
      })
    }
  })
}

// Inicializamos nuestra aplicación
initialize()
