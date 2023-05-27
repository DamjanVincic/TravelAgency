const databaseURL = 'https://web-design-project-2023-default-rtdb.europe-west1.firebasedatabase.app/';

const getAgencies = async () => {
    const jsonData = await fetch(databaseURL + "agencije.json")
                            .then(response => response.json());
    return jsonData;
}

const loadData = async () => {
    var agencies = await getAgencies();
    var count = 0;
    var agency_list = document.getElementById("agency_list");
    var row = null;
    for (var id in agencies) {
        if (count%3 == 0) {
            if (row != null) {
                // agency_list.appendChild(row);
                agency_list.insertBefore(row, agency_list.getElementsByClassName("my-5")[1]);
            }
            row = document.createElement("div");
            row.classList.add("row");
            // row.appendChild(template(agencies[id]));
        }
        row.innerHTML += agencyTemplate(agencies[id]);
        count++;
    }
    // agency_list.appendChild(row);
    agency_list.insertBefore(row, agency_list.getElementsByClassName("my-5")[1]);
}

const agencyTemplate = agency => `<div class="col-md-4">
                                <div class="card mb-5">
                                    <div class="ripple hover-overlay" data-mdb-ripple-color="light">
                                        <img class="card-img-top" src="${agency.logo}" alt="${agency.name}">
                                        <a href="#!">
                                            <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
                                        </a>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">${agency.naziv}</h5>
                                        <p class="card-text"><i class="bi bi-envelope"></i> ${agency.email}<br/><i class="bi bi-geo-alt"></i> ${agency.adresa}<br/><i class="bi bi-telephone"></i> ${agency.brojTelefona}<br/><i class="bi bi-clock"></i> ${agency.godina}</p>
                                        <a href="agency.html" class="btn btn-primary">Detalji</a>
                                    </div>
                                </div>
                            </div>`;


loadData();