const API =
"http://127.0.0.1:5000";

document
.getElementById("loginForm")
.addEventListener(
"submit",
loginUser
);

async function loginUser(e){

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    const response =
    await fetch(
        `${API}/api/login`,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email,
                password
            })
        }
    );

    const data =
    await response.json();

    if(data.success){

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        window.location.href =
        "dashboard.html";
    }
    else{

        alert(
            data.message
        );
    }
}