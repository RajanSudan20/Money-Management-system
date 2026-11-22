let transactions = JSON.parse(localStorage.getItem('transactions')) || [];



const balanceElement = document.getElementById('balance');
const incomeElement = document.getElementById('income');
const expenseElement = document.getElementById('expense');
const form = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transaction-list');
const typeinput = document.getElementById('type');

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

form.addEventListener('submit', function (e) {
    e.preventDefault(); 
if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Please enter both text and amount');
        return;
    }
const transaction = {
        id: Date.now(),
        text: textInput.value,
        amount: parseFloat(amountInput.value),
        category: typeinput.value
    };
    transactions.push(transaction);
    updateLocalStorage();
    form.reset();
});

function init() {
    transactionList.innerHTML = '';
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(function(item) {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.text} (${item.category}): $${item.amount.toFixed(2)}`;
        transactionList.appendChild(listItem);
        if (item.amount > 0) {
            totalIncome += item.amount;
        } else {
            totalExpense += Math.abs(item.amount);
        }
    });
    updateValues(totalIncome, totalExpense);
}
function updateValues(income, expense) {
    const balance = income - expense;
    balanceElement.textContent = `$${balance.toFixed(2)}`;
    incomeElement.textContent = `$${income.toFixed(2)}`;
    expenseElement.textContent = `$${expense.toFixed(2)}`;
}
