// ACCOUNT DATA
const account1 = {
  owner: "Anna Anderson",
  username: "aa",
  movements: [200, 450, -400.5, 3000, -650, -130, 70, 1300],
  pin: 1234,
};

const account2 = {
  owner: "Bijan Bell",
  username: "bb",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 1111,
};

const account3 = {
  owner: "Celeste Carter",
  username: "cc",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 5555,
};

const accounts = [account1, account2, account3];

// ELEMENTS
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");

let currentAccount;
let receiverAccount;

const matchUser = (username, pin) => {
  const matchedAccount = accounts.find((acc) => username === acc.username);
  if (matchedAccount && matchedAccount.pin === pin) {
    return matchedAccount;
  } else {
    throw new Error("Couldn't match user");
  }
};

const matchReceiver = (username) => {
  const matchedAccount = accounts.find((acc) => username === acc.username);
  if (matchedAccount) {
    return matchedAccount;
  } else {
    throw new Error("This user don't exist");
  }
}

const message = (text, error) => {
  labelWelcome.textContent = text;
  error
    ? (labelWelcome.style.color = "var(--withdrawal)")
    : (labelWelcome.style.color = "var(--deposit)");
};

const displayAccount = (acc) => {
  if (acc) {
    containerApp.style.opacity = "100";
  } else {
    throw new Error("No account to display");
  }
};

//1. État général du compte
const matchMoney = (acc) => {
  if (acc) {
    //Soldes
    let balance = acc.reduce((accum, element) => accum + +element, 0);
    labelBalance.textContent = `CHF ${balance}`;

    //Les entrées
    let sumIn = acc.filter((el) => el >= 0).reduce((accum, element) => accum + +element, 0);
    labelSumIn.textContent = `CHF ${sumIn}`;

    //Les sorties
    let sumOut = acc.filter((el) => el < 0).reduce((accum, element) => accum - +element, 0);
    labelSumOut.textContent = `CHF ${sumOut}`;
  } else {
    throw new Error("No account with money");
  }
};

//2. Liste des transactions
const matchTransaction = (accMovements) => {
  if (accMovements) {
    //Supprimer les transactions
    containerMovements.replaceChildren();

    //Afficher les transactions avec la bonne disposition
    accMovements.forEach((el, index) => {
      const movementType = el > 0 ? "deposit" : "withdrawal"; 
        containerMovements.insertAdjacentHTML(
          "afterbegin",`
          <div class="movements__row">
          <div class="movements__type movements__type--${movementType}">${index+1} ${movementType}</div>
          <div class="movements__value">CHF ${el}</div>
          </div> `
        );
    });
  } else {
    throw new Error("No account with transactions");
  }
};

//3. Transfer de fonds
const transferMoney = (acc, receiver, amount) => {
  //Prend le solde
  let solde = +labelBalance.textContent.slice(4);
  if(amount > 0 && amount <= solde){
    //Ajoute l'argent au transaction dans les deux comptes
    acc.push(-amount);
    receiver.push(amount);

    //Modifie l'affiche
    matchTransaction(acc);
    matchMoney(acc);
  } else {
    throw new Error("Couldn't transfer")
  }
}

btnLogin.addEventListener("click", function (e) {
  try {
    e.preventDefault();
    currentAccount = matchUser(inputLoginUsername.value, +inputLoginPin.value);
    displayAccount(currentAccount);
    message(`Welcome ${currentAccount.owner}`);
    matchMoney(currentAccount.movements);
    matchTransaction(currentAccount.movements);
  } catch (err) {
    message(err.message, true);
  }
});

btnTransfer.addEventListener("click", function (e){
  try{
    e.preventDefault();
    receiverAccount = matchReceiver(inputTransferTo.value);
    transferMoney(currentAccount.movements, receiverAccount.movements, inputTransferAmount.value);
    message(`Transfered CHF ${inputTransferAmount.value} to ${inputTransferTo.value}`);
  } catch (err){
    message(err.message, true)
  }
});
