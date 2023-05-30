const databaseURL = 'https://web-design-project-2023-default-rtdb.europe-west1.firebasedatabase.app/';

var urlParams = new URLSearchParams(window.location.search);

const getUser = async () => {
    const jsonData = await fetch(databaseURL + "korisnici/" + urlParams.get("id") + ".json")
                            .then(response => response.json());
    if (jsonData == null) {
        window.location.replace("error.html");
    }
    return jsonData;
}

const loadData = async () => {
    var user = await getUser();

    document.getElementById("edit_user_username").innerHTML = `<b>${user.korisnickoIme}</b>`
    document.getElementById("userEditForm").innerHTML = userEditTemplate(user);
}

const userEditTemplate = (user) => `<div class="col-md-12 mb-5" style="padding-left: 10rem; padding-right: 10rem;">
                                        <div class="text-center">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <input type="text" name="ime" id="firstnameEdit" class="form-control mb-4" value="${user.ime}" placeholder="Ime" required />
                                                </div>
                                                <div class="col-md-6">
                                                    <input type="text" name="prezime" id="lastnameEdit" class="form-control mb-4" value="${user.prezime}" placeholder="Prezime" required />
                                                </div>
                                            </div>

                                            <input type="text" name="korisnickoIme" id="usernameEdit" class="form-control mb-4" value="${user.korisnickoIme}" placeholder="Korisnicko ime (bez razmaka)" oninput="validateUsername()" required />

                                            <input type="text" name="lozinka" id="passwordEdit" class="form-control mb-4" value="${user.lozinka}" placeholder="Lozinka (min. 8 karaktera)" required />

                                            <input type="email" name="email" id="emailEdit" class="form-control mb-4" value="${user.email}" placeholder="Email" oninput="validateEmail()" required />
                                            
                                            <input type="date" name="datumRodjenja" id="birthdayEdit" class="form-control mb-4" value="${user.datumRodjenja}" placeholder="Datum rodjenja" required />
                                            
                                            <input type="text" name="adresa" id="addressEdit" class="form-control mb-4" value="${user.adresa}" placeholder="Adresa" required />

                                            <input type="text" name="telefon" id="phoneEdit" class="form-control mb-4" value="${user.telefon}" placeholder="Broj telefona" oninput="validatePhone()" required />
                                        </div>
                                        
                                        <div class="col-md text-center">
                                        <a href="admin_panel_users.html" class="btn btn-outline-danger">Odustani</a>
                                        <button type="submit" class="btn btn-outline-primary">Izmeni</button>
                                    </div>`;

document.addEventListener("DOMContentLoaded", loadData);

var userEditForm = document.getElementById("userEditForm");
userEditForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (userEditForm.checkValidity()) {
        var data = new FormData(event.target);
        var user = {};
        for (obj of data) {
            let [key, value] = obj;
            user[key] = value;
        }

        fetch(`${databaseURL}korisnici/${urlParams.get("id")}.json`, {
            method: 'PUT',
            body: JSON.stringify(user)
        })
        .then(resp => {
            if (resp.ok) {
                var alertHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                    Uspesno izmenjen korisnik.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
                                
                document.getElementById("alertPlaceholder").innerHTML = alertHTML;
            } else {
                window.location.replace("error.html");
            }
        })
    } else {
        userEditForm.classList.add("was-validated");
    }
});

const validateUsername = () => {
    var usernameEdit = document.getElementById("usernameEdit");
    if (usernameEdit.value.indexOf(' ') >= 0) {
        usernameEdit.setCustomValidity("error");
    }
    else {
        usernameEdit.setCustomValidity("");
    }
}

const validateEmail = () => {
    var emailEdit = document.getElementById("emailEdit");
    if (!emailValidation(emailEdit.value))
        emailEdit.setCustomValidity("error");
    else
        emailEdit.setCustomValidity("");
}

const validatePhone = () => {
    var phoneEdit = document.getElementById("phoneEdit");
    if (isNaN(phoneEdit.value))
        phoneEdit.setCustomValidity("error");
    else if (Number(phoneEdit.value) < 0)
        phoneEdit.setCustomValidity("error");
    else
        phoneEdit.setCustomValidity("");
}
