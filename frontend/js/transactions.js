const API =
"http://127.0.0.1:5000";

const user =
JSON.parse(
    localStorage.getItem("user")
);

const RECORDS_PER_PAGE = 5;

let currentPage = 1;
let filteredTransactions = [];

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

let editId = null;

loadTransactions();

async function loadTransactions() {

    const response = await fetch(
        `${API}/api/transactions/${user.id}`
    );

    const data = await response.json();

    const typeFilter =
        document.getElementById("typeFilter").value;

    const dateFilter =
        document.getElementById("dateFilter").value || "";

    const amountFilter =
        document.getElementById("amountFilter").value || "";

    filteredTransactions = data.filter(item => {

        const typeMatch =
            !typeFilter ||
            item.transaction_type === typeFilter;

        const dateMatch =
            !dateFilter ||
            item.transaction_date === dateFilter;

        const amountMatch =
            !amountFilter ||
            Number(item.amount) >= Number(amountFilter);

        return typeMatch && dateMatch && amountMatch;

    });

    currentPage = 1;

    renderTable();
}

function renderTable() {

    const tbody =
        document.querySelector("#transactionTable tbody");

    tbody.innerHTML = "";

    if (filteredTransactions.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="10"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#6b7280;">
                    No Transactions Found
                </td>
            </tr>
        `;

        document.getElementById("pagination").innerHTML = "";

        return;
    }

    const start =
        (currentPage - 1) * RECORDS_PER_PAGE;

    const end =
        start + RECORDS_PER_PAGE;

    const pageData =
        filteredTransactions.slice(start, end);

    pageData.forEach(item => {

        tbody.innerHTML += `
        <tr>

            <td>${item.title}</td>

            <td>
                <span class="${
                    item.transaction_type === "INCOME"
                        ? "income-badge"
                        : "expense-badge"
                }">
                    ${item.transaction_type}
                </span>
            </td>

            <td>${item.category}</td>

            <td>₹${item.amount}</td>

            <td>${item.transaction_date}</td>

            <td>${item.payment_method || "-"}</td>

            <td>${item.merchant || "-"}</td>

            <td>${item.description || "-"}</td>

            <td>
                <span class="status-badge">
                    ${item.status || "Completed"}
                </span>
            </td>

            <td class="action-cell">

                <span
                    class="edit-icon"
                    onclick="editTransaction(${item.id})">

                    <i class="fa-solid fa-pen"></i>

                </span>

                <span
                    class="delete-icon"
                    onclick="deleteTransaction(${item.id})">

                    <i class="fa-solid fa-trash"></i>

                </span>

            </td>

        </tr>
        `;

    });

    renderPagination();
}

function renderPagination() {

    const totalPages =
        Math.ceil(filteredTransactions.length / RECORDS_PER_PAGE);

    const container =
        document.getElementById("pagination");

    container.innerHTML = "";

    if (totalPages <= 1)
        return;

    // First Page
    container.innerHTML += `
        <button
            class="page-btn"
            ${currentPage === 1 ? "disabled" : ""}
            onclick="changePage(1)">
            |&lt;
        </button>
    `;

    // Previous
    container.innerHTML += `
        <button
            class="page-btn"
            ${currentPage === 1 ? "disabled" : ""}
            onclick="changePage(${currentPage - 1})">
            &lt;
        </button>
    `;

    // Page Numbers
    for(let i = 1; i <= totalPages; i++){

        container.innerHTML += `
            <button
                class="page-btn ${
                    currentPage === i ? "active-page" : ""
                }"
                onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    // Next
    container.innerHTML += `
        <button
            class="page-btn"
            ${currentPage === totalPages ? "disabled" : ""}
            onclick="changePage(${currentPage + 1})">
            &gt;
        </button>
    `;

    // Last Page
    container.innerHTML += `
        <button
            class="page-btn"
            ${currentPage === totalPages ? "disabled" : ""}
            onclick="changePage(${totalPages})">
            &gt;|
        </button>
    `;
}

function changePage(page) {

    currentPage = page;

    renderTable();

}

function openModal(){

    document
    .getElementById(
        "transactionModal"
    )
    .style.display = "flex";
}

function closeModal(){

    document
    .getElementById(
        "transactionModal"
    )
    .style.display = "none";
}

async function saveTransaction(){

    const payload = {

        user_id:user.id,

        transaction_type:
        document.getElementById(
            "transactionType"
        ).value,

        title:
        document.getElementById(
            "title"
        ).value,

        category:
        document.getElementById(
            "category"
        ).value,

        amount:
        document.getElementById(
            "amount"
        ).value,

        transaction_date:
        document.getElementById(
            "transactionDate"
        ).value,

        payment_method:
        document.getElementById(
            "paymentMethod"
        ).value,

        merchant:
        document.getElementById(
            "merchant"
        ).value,

        description:
        document.getElementById(
            "description"
        ).value,

        status:"Completed"
    };

    if(editId !== null){

        await fetch(
            `${API}/api/transaction/${editId}`,
            {
                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(payload)
            }
        );
    }
    else{

        await fetch(
            `${API}/api/transaction`,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(payload)
            }
        );
    }

    closeModal();

    loadTransactions();
}

async function deleteTransaction(id){

    const result = await Swal.fire({
        title: "Delete Transaction?",
        text: "Are you sure you want to proceed?",
        icon: "warning",

        width: "380px",

        showCancelButton: true,

        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",

        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",

        reverseButtons: true
    });

    if(!result.isConfirmed){
        return;
    }

    await fetch(
        `${API}/api/transaction/${id}`,
        {
            method:"DELETE"
        }
    );

    loadTransactions();

    Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Transaction removed successfully",
        width: "350px",
        timer: 1500,
        showConfirmButton: false
    });
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

async function editTransaction(id){

    const response =
    await fetch(
        `${API}/api/transactions/${user.id}`
    );

    const data =
    await response.json();

    const tx =
    data.find(
        x => x.id === id
    );

    editId = id;

    document.getElementById(
    "modalTitle"
).innerText =
"Edit Transaction";

    document.getElementById(
        "title"
    ).value = tx.title;

    document.getElementById(
        "category"
    ).value = tx.category;

    document.getElementById(
        "transactionType"
    ).value =
    tx.transaction_type;

    document.getElementById(
        "amount"
    ).value =
    tx.amount;

    document.getElementById(
        "transactionDate"
    ).value =
    tx.transaction_date;

    document.getElementById(
        "paymentMethod"
    ).value =
    tx.payment_method || "";

    document.getElementById(
        "merchant"
    ).value =
    tx.merchant || "";

    document.getElementById(
        "description"
    ).value =
    tx.description || "";

    openModal();
}

function addTransaction(){

    editId = null;

    document.getElementById(
        "modalTitle"
    ).innerText =
    "Add Transaction";

    document.getElementById("title").value = "";
    document.getElementById("category").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("transactionDate").value = "";
    document.getElementById("paymentMethod").value = "";
    document.getElementById("merchant").value = "";
    document.getElementById("description").value = "";

    document.getElementById(
        "transactionType"
    ).value = "INCOME";

    openModal();
}

function logout(){

    localStorage.removeItem(
        "user"
    );

    window.location.href =
    "login.html";
}