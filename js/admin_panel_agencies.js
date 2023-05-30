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

const getAgencies = async () => {
    const jsonData = await fetch(databaseURL + "agencije.json")
                            .then(response => response.json());
    return jsonData;
}

const loadData = async () => {
    var agencies = await getAgencies();

    var count = 1;
    var agency_table = document.getElementById("agencyTable");
    agency_table.innerHTML = "";
    for (var id in agencies) {
        agency_table.innerHTML += agencyTemplate(agencies[id], id, count);
        count++;
    }
}

const agencyTemplate = (agency, id, count) => `<tr>
                                                    <th scope="row">${count}</th>
                                                    <td>${agency.naziv}</td>
                                                    <td>${agency.adresa}</td>
                                                    <td>${agency.godina}</td>
                                                    <td>${agency.brojTelefona}</td>
                                                    <td>${agency.email}</td>
                                                    <td>
                                                        <a href="agency_edit.html?id=${id}" class="btn btn-outline-primary" type="button"><i class="bi bi-pencil"></i></a>
                                                        <button class="btn btn-outline-danger" type="button" data-mdb-toggle="modal" data-mdb-target="#agencyDelete" data-agencyid="${id}" data-name="${agency.naziv}"><i class="bi bi-trash"></i></button>
                                                    </td>
                                                </tr>`

document.addEventListener("DOMContentLoaded", loadData);

$('#agencyDelete').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var id = button.data('agencyid')
    var name = button.data('name')
    var modal = $(this)
    modal.find('#agencyDeleteName').text(`${name}`)
    $('#agencyDeleteButton').data("agencyid", id)
})

$("#agencyDeleteButton").on("click", () => {
    var button = $("#agencyDeleteButton")
    var id = button.data("agencyid");

    fetch(`${databaseURL}/agencije/${id}.json`, {
        method: "DELETE"
    })
    .then(resp => {
        if (resp.ok) {
            // window.location.reload();
            loadData();
            var alertHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                Uspesno izbrisana agencija.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>`;
            $("#alertPlaceholder").html(alertHTML);
        }
        else {
            window.location.replace("error.html");
        }
    });
})