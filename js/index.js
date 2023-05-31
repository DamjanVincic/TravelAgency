const databaseURL = 'https://web-design-project-2023-default-rtdb.europe-west1.firebasedatabase.app/';

const getAgencies = async () => {
    const jsonData = await fetch(databaseURL + "agencije.json")
                            .then(response => response.json());
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
    var agencies = await getAgencies();
    var count = 0;
    var agency_list = document.getElementById("agency_list");
    var row = null;
    for (var id in agencies) {
        if (count%3 == 0) {
            if (row != null) {
                agency_list.insertBefore(row, agency_list.getElementsByClassName("my-5")[1]);
            }
            row = document.createElement("div");
            row.classList.add("row");
        }
        row.innerHTML += agencyTemplate(agencies[id], id);
        count++;
    }
    agency_list.insertBefore(row, agency_list.getElementsByClassName("my-5")[1]);
}

const agencyTemplate = (agency, id) => `<div class="col-md-4">
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
                                                    <a href="agency.html?id=${id}" class="btn btn-primary">Detalji</a>
                                                </div>
                                            </div>
                                        </div>`;


document.addEventListener("DOMContentLoaded", loadData);

var agencySearchForm = document.getElementById("agencySearchForm");
var agencyNameSearch = document.getElementById("agencyNameSearch");
var agencyDestinationSearch = document.getElementById("agencyDestinationSearch");
agencySearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    var alertHTML = null;
    if (agencyNameSearch.value === "" && agencyDestinationSearch.value === "") {
        alertHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                        Morate uneti bar jedan kriterijum za pretragu.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
        document.getElementById("alertPlaceholder").innerHTML = alertHTML;
    } else {
        var agencies = await getAgencies();
        var agencyArray = [];
        Object.keys(agencies).forEach(key => agencyArray.push({...agencies[key], 'id': key}));
        
        if (agencyNameSearch.value) {
            agencyArray = agencyArray.filter(agency => agency.naziv.toLowerCase().includes(agencyNameSearch.value.toLowerCase()));
        }
        if (agencyDestinationSearch.value) {
            for (let i = agencyArray.length - 1;i >= 0;i--) {
                let destinations = await getDestinations(agencyArray[i].destinacije);
                if (!hasDestination(destinations))
                    agencyArray.splice(i, 1);
            }
        }

        if (agencyArray.length === 0) {
            alertHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                            Ne postoje agencije sa datim kriterijumima.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
        } else {
            alertHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                            Uspesna pretraga
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;

            searchLoadData(agencyArray);
            highlightAgencyText(agencyNameSearch.value);
        }
        document.getElementById("alertPlaceholder").innerHTML = alertHTML;
        document.getElementById("agencySearchModal").getElementsByClassName("btn-close")[0].click();
    }
    agencySearchForm.reset();
})

const hasDestination = (destinations) => {
    for (id in destinations) {
        if (destinations[id].naziv.toLowerCase().includes(agencyDestinationSearch.value.toLowerCase()))
            return true;
    }
    return false;
}

const searchLoadData = (agencies) => {
    var count = 0;
    var agency_list = document.getElementById("agency_list");
    agency_list.innerHTML = `<hr class="my-5"/>
                            <div class="row">
                                <div class="col-md">
                                    <p class="text-center fs-1">Agencije</p>
                                </div>
                            </div>
                            
                            <hr class="my-5"/>`;
    var row = null;
    for (var agency of agencies) {
        if (count%3 == 0) {
            if (row != null) {
                agency_list.insertBefore(row, agency_list.getElementsByClassName("my-5")[1]);
            }
            row = document.createElement("div");
            row.classList.add("row");
        }
        row.innerHTML += agencyTemplate(agency, agency.id);
        count++;
    }
    agency_list.insertBefore(row, agency_list.getElementsByClassName("my-5")[1]);
}

const highlightAgencyText = text => {
    var cardTitles = document.querySelectorAll(".card-title");
  
    for (let cardTitle of cardTitles) {
        var titleText = cardTitle.textContent;
        var index = titleText.toLowerCase().indexOf(text.toLowerCase());
    
        if (index !== -1) {
            var highlightedText = titleText.substring(index, index + text.length);
            var html = titleText.replace(new RegExp(highlightedText, "gi"), `<span class="highlight">${highlightedText}</span>`);
            cardTitle.innerHTML = html;
        }
    }
}