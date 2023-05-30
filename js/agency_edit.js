const databaseURL = 'https://web-design-project-2023-default-rtdb.europe-west1.firebasedatabase.app/';

var urlParams = new URLSearchParams(window.location.search);

const getAgency = async () => {
    const jsonData = await fetch(databaseURL + "agencije/" + urlParams.get("id") + ".json")
                            .then(response => response.json());
    if (jsonData == null) {
        window.location.replace("error.html");
    }
    return jsonData;
}

const getDestinations = async (id) => {
    const jsonData = await fetch(databaseURL + "destinacije/" + id + ".json")
                            .then(response => response.json());
    if (jsonData == null) {
        window.location.replace("error.html");
    }
    return jsonData;
}

const loadData = async () => {
    var agency = await getAgency();

    document.getElementById("edit_agency_name").innerHTML = `<b>${agency.naziv}</b>`
    document.getElementById("agencyEditForm").innerHTML = agencyDataTemplate(agency);
}

const loadDestinationTable = async() => {
    var agency = await getAgency();
    var destinations = await getDestinations(agency.destinacije);

    var destination_table = document.getElementById("destinationTable");
    destination_table.innerHTML = "";
    for (var id in destinations) {
        destination_table.innerHTML += destinationTemplate(destinations[id], id);
    }
}

const agencyDataTemplate = (agency) => `<div class="col-md-12 mb-5" style="padding-left: 10rem; padding-right: 10rem;">
                                            <div class="text-center">
                                                <input type="text" name="naziv" id="nameEdit" class="form-control mb-4" value="${agency.naziv}" placeholder="Naziv" required />
                                                
                                                <input type="text" name="adresa" id="addressEdit" class="form-control mb-4" value="${agency.adresa}" placeholder="Adresa" required />
                                                
                                                <input type="text" name="logo" id="logoEdit" class="form-control mb-4" value="${agency.logo}" placeholder="Logo" oninput="validateLogo()" required />
                                                
                                                <input type="number" name="godina" id="yearEdit" class="form-control mb-4" value="${agency.godina}" placeholder="Godina" required />

                                                <input type="text" name="brojTelefona" id="phoneEdit" class="form-control mb-4" value="${agency.brojTelefona}" placeholder="Broj telefona" oninput="validateAgencyPhone()" required />
                                                
                                                <input type="email" name="email" id="emailEdit" class="form-control mb-4" value="${agency.email}" placeholder="Email" oninput="validateEmail()" required />
                                                
                                                <button type="button" class="btn btn-primary mb-1" data-mdb-toggle="modal" data-mdb-target="#destinationAddModal">Dodaj destinaciju</button>
                                                <button type="button" onclick="loadDestinationTable()" class="btn btn-danger mb-1" data-mdb-toggle="modal" data-mdb-target="#destinationDeleteModal">Izbrisi destinacije</button>
                                            </div>
                                        </div>
                                        <div class="col-md text-center">
                                            <a href="admin_panel_agencies.html" class="btn btn-outline-danger">Odustani</a>
                                            <button type="submit" class="btn btn-outline-primary">Izmeni</button>
                                        </div>`

const destinationTemplate = (destination, id) => `<tr>
                                                    <td><input type="checkbox" name="forDeletion" value="${id}"></td>
                                                    <td>${destination.naziv}</td>
                                                    <td>${destination.tip}</td>
                                                    <td>${destination.prevoz}</td>
                                                    <td>${destination.cena}</td>
                                                    <td>${destination.maxOsoba}</td>
                                                </tr>`

document.addEventListener("DOMContentLoaded", loadData);

var agencyEditForm = document.getElementById("agencyEditForm");
agencyEditForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (agencyEditForm.checkValidity()) {
        var oldAgency = await getAgency();
        var data = new FormData(event.target);
        var agency = {'destinacije': oldAgency.destinacije};
        for (obj of data) {
            let [key, value] = obj;
            agency[key] = value;
        }

        fetch(`${databaseURL}agencije/${urlParams.get("id")}.json`, {
            method: 'PUT',
            body: JSON.stringify(agency)
        })
        .then(resp => {
            if (resp.ok) {
                var alertHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                    Uspesno izmenjena agencija.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
                document.getElementById("alertPlaceholder").innerHTML = alertHTML;

                window.location.replace(`agency.html?id=${urlParams.get("id")}`);
                console.log(urlParams.get("id"))
            } else {
                window.location.replace("error.html");
            }
        })
    } else {
        agencyEditForm.classList.add("was-validated");
    }
});

const validateLogo = () => {
    var logoEdit = document.getElementById("logoEdit");
    if (!validateImageURL(logoEdit.value))
        logoEdit.setCustomValidity("error");
    else
        logoEdit.setCustomValidity("");
}

const validateEmail = () => {
    var emailEdit = document.getElementById("emailEdit");
    if (!emailValidation(emailEdit.value))
        emailEdit.setCustomValidity("error");
    else
        emailEdit.setCustomValidity("");
}

const validateAgencyPhone = () => {
    var agencyPhoneEdit = document.getElementById("phoneEdit");
    var phoneInput = agencyPhoneEdit.value.replace("/", "").replace("-", "");
    if (isNaN(phoneInput))
        agencyPhoneEdit.setCustomValidity("error");
    else
        agencyPhoneEdit.setCustomValidity("");
}


var destinationAddForm = document.getElementById("destinationAddForm");
var imagesAddInput = document.getElementById("imagesAdd");

destinationAddForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (destinationAddForm.checkValidity()) {
        var agency = await getAgency();

        var data = new FormData(event.target);
        var destination = {};
        for (obj of data) {
            let [key, value] = obj;
            if (key === "slike") {
                destination[key] = value.split("\n");
                continue;
            }
            destination[key] = value;
        }

        fetch(`${databaseURL}destinacije/${agency.destinacije}.json`, {
            method: 'POST',
            body: JSON.stringify(destination)
        })
        .then(resp => {
            if (resp.ok) {
                let destinationAddModal = document.getElementById("destinationAddModal");
                destinationAddModal.getElementsByClassName("btn-close")[0].click();

                var alertHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                    Uspesno dodata agencija.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
                document.getElementById("alertPlaceholder").innerHTML = alertHTML;

                destinationAddForm.reset();
                destinationAddForm.classList.remove("was-validated");
            } else {
                window.location.replace("error.html");
            }
        })
    } else {
        destinationAddForm.classList.add("was-validated");
    }
});

imagesAddInput.addEventListener("input", () => {
    var urls = imagesAddInput.value.split("\n");
    var invalid = false;
    for (url of urls) {
        if (!validateImageURL(url)) {
            invalid = true;
            imagesAddInput.setCustomValidity("error");
            break;
        }
    }
    if (!invalid)
        imagesAddInput.setCustomValidity("");
})

const validateImageURL = (url) => new RegExp(/\bhttps?:[^)''"]+\.(?:jpg|jpeg|gif|png)/).test(url);


var destinationDeleteModal = document.getElementById("destinationDeleteModal");
var destinationDeleteButton = document.getElementById("destinationDeleteModalButton");
var destinationDeleteConfirmationButton = document.getElementById("destinationDeleteConfirmationButton");

destinationDeleteConfirmationButton.addEventListener("click", async () => {
    var agency = await getAgency();

    var checkboxes = destinationDeleteModal.querySelectorAll('input[type="checkbox"]');
    
    for (var checkbox of checkboxes) {
        if (checkbox.checked)
            fetch(`${databaseURL}destinacije/${agency.destinacije}/${checkbox.value}.json`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    window.location.replace("error.html");
                    return;
                }
            })
    }
    destinationDeleteModal.getElementsByClassName("btn-close")[0].click();
    var alertHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                        Uspesna obrisane destinacije.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
    document.getElementById("alertPlaceholder").innerHTML = alertHTML;
});
