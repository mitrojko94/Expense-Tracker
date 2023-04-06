const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// const dummyTransactions = [
//   {
//     id: 1,
//     text: "Flower",
//     amount: -20,
//   },
//   {
//     id: 2,
//     text: "Salary",
//     amount: 300,
//   },
//   {
//     id: 3,
//     text: "Book",
//     amount: -10,
//   },
//   {
//     id: 4,
//     text: "Camera",
//     amount: 150,
//   },
// ];

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(event) {
  event.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount!");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");

  // Add clas based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${
          transaction.id
        })">x</button>
    `;
  list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (item += acc), 0).toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((item, acc) => (item += acc), 0)
    .toFixed(2);

  const expense = (
    amounts.filter((item) => item < 0).reduce((item, acc) => (item += acc), 0) *
    -1
  ).toFixed(2);

  // Insert amounts to DOM
  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

// Event listeners
form.addEventListener("submit", addTransaction);

// Kratko objasnjenje:
// Ako je novac manji od 0 da bude znak -, u suprotnom da bude znak +
// Da ne bih imao negativne ili pozitivne brojeve, stavim u Math.abs() koji mi vraca apsolutnu vrednost, bez predznaka. Predznak je definisan pomocu sign varijable
// Mnozim na kraju sa -1, da bih imao pozitivan broj kao ispis na ekranu korisnika
// Kad pravim novi objekat, sa novim vrednostima, moram da pretvorim amount u Number, jer mi stavlja string i izbacuje mi gresku. Da bih pretvorio u broj, koristim ili Number ili samo +
// Kad sam pravio f-ju za brisanje, prosledim sam ID, jer na osnovu toga brisem, a nakon toga pozvao f-ju init(), jer mi ona poziva sve ostale f-je koje su neophodne za pravilan rad aplikacije
// Za localStorage, proveravam da li postoji nesto u njemu, ako postoji onda se to prikaze, a ako ne postoji, onda se pravi u localStorage pomocu f-je koju sam napravio za to
