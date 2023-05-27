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

    var agency_data_edit = document.getElementById("agency_data_edit");
    var row = document.createElement("div");
    row.classList.add("row");
    row.innerHTML = agencyDataTemplate(agency);
    agency_data_edit.insertBefore(row, agency_data_edit.getElementsByClassName("mb-5")[0]);
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
                                                <input type="text" name="naziv" id="nameEdit" class="form-control mb-4" value="${agency.naziv}" placeholder="Naziv" />
                                                
                                                <input type="text" name="adresa" id="addressEdit" class="form-control mb-4" value="${agency.adresa}" placeholder="Adresa" />
                                                
                                                <input type="text" name="logo" id="logoEdit" class="form-control mb-4" value="${agency.logo}" placeholder="Logo" />
                                                
                                                <input type="number" name="godina" id="yearEdit" class="form-control mb-4" value="${agency.godina}" placeholder="Godina" />

                                                <input type="text" name="brojTelefona" id="phoneEdit" class="form-control mb-4" value="${agency.brojTelefona}" placeholder="Broj telefona" />
                                                
                                                <input type="email" name="email" id="emailEdit" class="form-control mb-4" value="${agency.email}" placeholder="Email" />
                                                
                                                <button class="btn btn-primary" data-mdb-toggle="modal" data-mdb-target="#destinationAddModal">Dodaj destinaciju</button>
                                                <button onclick="loadDestinationTable()" class="btn btn-danger" data-mdb-toggle="modal" data-mdb-target="#destinationDeleteModal">Izbrisi destinacije</button>
                                            </div>
                                        </div>
                                        <div class="col-md text-center">
                                            <a href="admin_panel_agencies.html" class="btn btn-outline-danger">Odustani</a>
                                            <button class="btn btn-outline-primary">Izmeni</button>
                                        </div>`

const destinationTemplate = (destination, id) => `<tr>
                                                    <td><input type="checkbox" value="${id}"></td>
                                                    <td>${destination.naziv}</td>
                                                    <td>${destination.tip}</td>
                                                    <td>${destination.prevoz}</td>
                                                    <td>${destination.cena}</td>
                                                    <td>${destination.maxOsoba}</td>
                                                </tr>`

document.addEventListener("DOMContentLoaded", loadData);
// document.getElementById("obrisiDestinacijeBtn").addEventListener("click", loadDestinationTable);