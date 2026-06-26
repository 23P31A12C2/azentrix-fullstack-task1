const API = "http://127.0.0.1:5000";

document
    .getElementById("registerForm")
    .addEventListener("submit", registerUser);

async function registerUser(e) {

    e.preventDefault();
    console.log("Register clicked");

    const first_name =
        document.getElementById("firstName").value.trim();

    const last_name =
        document.getElementById("lastName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    // Password validation
    if (password !== confirmPassword) {

        showMessage(
    "error",
    "Passwords do not match."
);

        return;
    }

    try {

        const response = await fetch(
            `${API}/api/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    first_name,
                    last_name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if(data.success){

    showMessage(
    "success",
    "✅ Registration successful! You can now login."
);

document.getElementById("registerForm").reset();

} else {

            showMessage(
    "error",
    data.message || "Registration failed."
);

        }

    } catch (error) {

        showMessage(
    "error",
    "Server error. Please try again."
);

        console.error(error);
    }
}

let registrationSuccess = false;

function showToast(type, title, message) {

    registrationSuccess =
        type === "success";

    const toast =
        document.getElementById("toast");

    document.getElementById("toastTitle").innerText =
        title;

    document.getElementById("toastMessage").innerText =
        message;

    document.getElementById("toastIcon").innerHTML =
        type === "success" ? "✅" : "❌";

    toast.classList.add("show");
}

function closeToast() {

    document
        .getElementById("toast")
        .classList.remove("show");

    if (registrationSuccess) {

        window.location.href = "login.html";

    }
}

function closeToast() {

    document
        .getElementById("toast")
        .classList.remove("show");

    window.location.href = "login.html";
}

function showMessage(type, text){

    const message =
        document.getElementById("message");

    message.innerText = text;

    message.className =
        `form-message ${type}`;

    message.style.display = "block";
}