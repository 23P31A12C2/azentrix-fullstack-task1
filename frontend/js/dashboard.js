const API =
"http://127.0.0.1:5000";

const user =
JSON.parse(
    localStorage.getItem("user")
);

if(user){

    document.getElementById(
        "userName"
    ).innerText =
    `${user.first_name} ${user.last_name}`;

    document.getElementById(
        "userAvatar"
    ).innerText =
    user.first_name
        .charAt(0)
        .toUpperCase();
}

if(!user){

    window.location.href =
    "login.html";
}

let chartInstance;

loadDashboard();

document
.querySelectorAll(
'input[name="period"], input[name="chart"]'
)
.forEach(radio => {

    radio.addEventListener(
        "change",
        loadDashboard
    );

});

async function loadDashboard(){

    const period =
document.querySelector(
'input[name="period"]:checked'
).value;

    const response =
    await fetch(
        `${API}/api/dashboard/${user.id}?period=${period}`
    );

    const data =
    await response.json();

    document.getElementById(
        "incomeCard"
    ).innerText =
    `₹${data.total_income}`;

    document.getElementById(
        "expenseCard"
    ).innerText =
    `₹${data.total_expense}`;

    document.getElementById(
        "balanceCard"
    ).innerText =
    `₹${data.balance}`;

    drawChart(
        data.total_income,
        data.total_expense
    );
}

function drawChart(income, expense) {

    income = Number(income);
    expense = Number(expense);

    const chartType =
        document.querySelector(
            'input[name="chart"]:checked'
        ).value;

    const ctx =
        document.getElementById("summaryChart");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {

        type: chartType,

        data: {

            labels: [
                "Income",
                "Expense"
            ],

            datasets: [{

                label: "Amount",

                data: [
                    income,
                    expense
                ],

                backgroundColor: [
                    "#22c55e",
                    "#ef4444"
                ],

                borderColor: [
                    "#22c55e",
                    "#ef4444"
                ],

                borderWidth: 1,

                borderRadius:
                    chartType === "bar" ? 8 : 0

            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: chartType === "pie"
                }

            },

            scales: chartType === "bar"
                ? {
                    y: {
                        beginAtZero: true
                    }
                }
                : {}

        }

    });

}

function logout(){

    localStorage.removeItem(
        "user"
    );

    window.location.href =
    "login.html";
}

function toggleMenu(){

    document
    .getElementById("profileMenu")
    .classList
    .toggle("show");
}

document.addEventListener(
    "click",
    function(e){

        const menu =
        document.getElementById(
            "profileMenu"
        );

        const btn =
        document.querySelector(
            ".menu-btn"
        );

        if(
            menu &&
            !menu.contains(e.target) &&
            !btn.contains(e.target)
        ){
            menu.classList.remove(
                "show"
            );
        }
    }
);