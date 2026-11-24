let transactions = JSON.parse(localStorage.getItem('transactions')) || [];



const balanceElement = document.getElementById('balance');
const incomeElement = document.getElementById('income');
const expenseElement = document.getElementById('expense');
const form = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transaction-list');
const typeinput = document.getElementById('type');
const adviceTextEl = document.getElementById('advice-text');

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

form.addEventListener('submit', function (e) {
    e.preventDefault(); 
if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Please enter both text and amount');
        return;
    }
    let rawamount = parseFloat(amountInput.value);
    if (isNaN(rawamount)) {
        alert('Please enter a valid number for amount');
        return;
    }
    let finalamount = Math.abs(rawamount);
    if (typeinput.value !== 'Income/Earning' && typeinput.value !== 'Salary') {
        finalamount = -finalamount;
    }
const transaction = {
        id: Date.now(),
        text: textInput.value,
        amount: finalamount,
        category: typeinput.value
    };
    transactions.push(transaction);
    updateLocalStorage();
    form.reset();
    init();
});
function removeTransaction(id) {
    transactions = transactions.filter(function(item) {
        return item.id !== id;
    });
    updateLocalStorage();
    init();
}

function init() {
    transactionList.innerHTML = '';
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(function(item) {
        const sign = item.amount > 0 ? '+' : '-';
        const itemclass = item.amount > 0 ? 'plus' : '.minus';
        const listItem = document.createElement('li');
 
        listItem.classList.add(itemclass);
        listItem.innerHTML = `
        <div>
            <strong>${item.text}</strong>
            <small style="display:block; color: #64748b; font-size: 11px;">${item.category}</small>
           
         </div>
         <div style="display:flex; align-item: center;">
         <span style="font-weight:600; color:${item.amount < 0 ? '#dc2626' : '#16a34a'};">
         ${sign}₹${Math.abs(item.amount).toFixed(2)}
                </span>
                <button class="delete-btn" onclick="removeTransaction(${item.id})">&times;</button>
            </div>
            `;
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
    balanceElement.textContent = `₹${balance.toFixed(2)}`;
    incomeElement.textContent = `₹${income.toFixed(2)}`;
    expenseElement.textContent = `₹${expense.toFixed(2)}`;

    updateSmartAdvice(income, expense, balance);
}


function updateSmartAdvice(income, expense, total) {
    if (!adviceTextEl) return;
    
    if (income === 0 && expense === 0) {
        adviceTextEl.innerText = 'Start by adding your pocket money or income above!';
    } else if (total < 0) {
        adviceTextEl.innerText = 'Warning: Your expenses have exceeded your income. Cut down on extra spending!';
    } else if (income > 0 && expense > income * 0.8) {
        adviceTextEl.innerText = 'Heads up: You have spent over 80% of your income. Save the rest carefully!';
    } else if (income > 0 && expense <= income * 0.5) {
        adviceTextEl.innerText = 'Great job! You are saving more than 50% of your income.';
    } else {
        adviceTextEl.innerText = 'Your budget is balanced. Keep up the good work!';
    }
    init();
}


