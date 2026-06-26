const API="http://127.0.0.1:5000";

document
.getElementById("transactionForm")
.addEventListener("submit", addTransaction);

async function addTransaction(e){

e.preventDefault();

const body={
user_id:1,
title:document.getElementById("title").value,
amount:document.getElementById("amount").value,
transaction_type:document.getElementById("type").value,
category:"General",
transaction_date:document.getElementById("date").value
};

await fetch(`${API}/api/transaction`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(body)
});

loadTransactions();
}

async function loadTransactions(){

const response=
await fetch(`${API}/api/transactions/1`);

const data=
await response.json();

let html=
`
<tr>
<th>Title</th>
<th>Amount</th>
<th>Type</th>
</tr>
`;

let income=0;
let expense=0;

data.forEach(item=>{

html+=`
<tr>
<td>${item.title}</td>
<td>${item.amount}</td>
<td>${item.transaction_type}</td>
</tr>
`;

if(item.transaction_type==="INCOME")
income+=Number(item.amount);

else
expense+=Number(item.amount);

});

document.getElementById(
"transactionTable"
).innerHTML=html;

drawChart(income,expense);
}

function drawChart(income,expense){

new Chart(
document.getElementById("expenseChart"),
{
type:"pie",
data:{
labels:["Income","Expense"],
datasets:[{
data:[income,expense]
}]
}
}
);
}

loadTransactions();