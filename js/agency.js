// import {getAgencies} from './database.js';
// getAgencies();

const databaseURL = 'https://web-design-project-2023-default-rtdb.europe-west1.firebasedatabase.app/';

// var queryString = decodeURIComponent(window.location.search);

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
    var destinations = await getDestinations(agency.destinacije);

    var background_data = document.getElementById("background-data");
    background_data.style.backgroundImage = `url(${agency.logo})`;

    document.getElementById("agency-data").innerHTML = agencyDataTemplate(agency);

    var destination_list = document.getElementById("destination_list");
    var count = 0;
    var row = null;
    for (var id in destinations) {
        if (count%3 == 0) {
            if (row != null) {
                destination_list.insertBefore(row, destination_list.getElementsByClassName("my-5")[1]);
            }
            row = document.createElement("div");
            row.classList.add("row");
        }
        row.innerHTML += destinationTemplate(destinations[id], id, agency.destinacije);
        count++;
    }
    destination_list.insertBefore(row, destination_list.getElementsByClassName("my-5")[1]);
}

const agencyDataTemplate = (agency) => `<h1 class="mb-3">${agency.naziv}</h1>
                                    <p><i class="bi bi-envelope"></i> ${agency.email}</p>
                                    <p><i class="bi bi-geo-alt"></i> ${agency.adresa}</p>
                                    <p><i class="bi bi-telephone"></i> ${agency.brojTelefona}</p>
                                    <p><i class="bi bi-clock"></i> ${agency.godina}</p>`


const getCarouselInner = (images) => {
    var carousel_inner = document.createElement("div");
    carousel_inner.classList.add("carousel-inner");

    var count = 0;
    for (url of images) {
        count++;
        if (count == 1) {
            carousel_inner.innerHTML += `<div class="carousel-item active">
                                            <img src="${url}" class="d-block w-100 img-fluid" style="max-height: 15rem;" alt="">
                                        </div>`
            continue;
        }

        carousel_inner.innerHTML += `<div class="carousel-item">
                                            <img src="${url}" class="d-block w-100 img-fluid" style="max-height: 15rem;" alt="">
                                    </div>`
    }
    return carousel_inner.innerHTML;
}

const destinationTemplate = (destination, id, destination_group_id) => {
    return `<div class="col-md-4">
                <div class="card mb-5" style="max-height: 50rem;">
                    <div id="${id}" class="carousel slide">
                        <div class="carousel-inner">
                            ${getCarouselInner(destination.slike)}
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#${id}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#${id}" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>

                    <div class="card-body overflow-auto">
                        <h5 class="card-title">${destination.naziv}</h5>
                        <p><i class="bi bi-airplane"></i> ${destination.tip}<br/><i class="bi bi-bus-front"></i> ${destination.prevoz}<br/><i class="bi bi-currency-dollar"></i>${destination.cena}<br/><i class="bi bi-person"></i> ${destination.maxOsoba}</p>
                        <a href="destination.html?id=${id}&destination_group_id=${destination_group_id}" class="btn btn-primary">Detalji</a>
                    </div>
                </div>
            </div>`
}

document.addEventListener("DOMContentLoaded", loadData);