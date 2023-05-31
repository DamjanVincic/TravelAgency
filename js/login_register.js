var registerForm = document.getElementById("registerForm");
var usernameRegister = document.getElementById("usernameRegister");
var passwordRegister = document.getElementById("passwordRegister");
var emailRegister = document.getElementById("email");
var phoneRegister = document.getElementById("phone");
var birthdayRegister = document.getElementById("birthday");

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (registerForm.checkValidity()) {
        var data = new FormData(event.target);

        user = {}
        for (obj of data) {
            let [key, value] = obj
            user[key] = value
        }

        fetch(`${databaseURL}korisnici.json`, {
            method: 'POST',
            body: JSON.stringify(user)
        })
        .then(resp => {
            if (resp.ok) {
                let registerModal = document.getElementById("registerModal");
                registerModal.getElementsByClassName("btn-close")[0].click();

                var alertHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                    Uspesna registracija.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
                document.getElementById("alertPlaceholder").innerHTML = alertHTML;

                registerForm.reset();
                registerForm.classList.remove("was-validated");
            } else {
                window.location.replace("error.html");
            }
        })
    } else {
        registerForm.classList.add("was-validated")
    }
});

usernameRegister.addEventListener("input", () => {
    if (usernameRegister.value.indexOf(' ') >= 0) {
        usernameRegister.setCustomValidity("error");
    }
    else {
        usernameRegister.setCustomValidity("");
    }
})

passwordRegister.addEventListener("input", () => {
    if (passwordRegister.value.length < 8) {
        passwordRegister.setCustomValidity("error");
    }
    else {
        passwordRegister.setCustomValidity("");
    }
})

emailRegister.addEventListener("input", () => {
    if (!emailValidation(emailRegister.value))
        emailRegister.setCustomValidity("error");
    else
        emailRegister.setCustomValidity("");
})

phoneRegister.addEventListener("input", () => {
    if (isNaN(phoneRegister.value)) {
        phoneRegister.setCustomValidity("error");
    }
    else if (Number(phoneRegister.value) < 0) {
        phoneRegister.setCustomValidity("error");
    } else {
        phoneRegister.setCustomValidity("");
    }
})

birthdayRegister.addEventListener("input", () => {
    if (new Date(birthdayRegister.value) > new Date())
        birthdayRegister.setCustomValidity("error");
    else
        birthdayRegister.setCustomValidity("");
})

const emailValidation = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


var loginForm = document.getElementById("loginForm");
var usernameLogin = document.getElementById("usernameLogin");
var passwordLogin = document.getElementById("passwordLogin");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (loginForm.checkValidity()) {
        var users = await fetch(`${databaseURL}korisnici.json`)
                            .then(response => response.json());
        var found = false;
        for (let id in users) {
            let user = users[id];
            if (user['korisnickoIme'] === usernameLogin.value && user['lozinka'] === passwordLogin.value) {
                found = true;
                break;
            }
        }
        
        var alertHTML = null;
        if (found) {
            loginModal.getElementsByClassName("btn-close")[0].click();

            alertHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                            Uspesno ste se ulogovali.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
            loginForm.reset();
            loginForm.classList.remove("was-validated");
        } else {
            alertHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                            Korisnik sa unetim podacima ne postoji.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
        }
        document.getElementById("alertPlaceholder").innerHTML = alertHTML;

    } else {
        loginForm.classList.add("was-validated");
    }
})
