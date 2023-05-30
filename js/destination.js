const databaseURL = 'https://web-design-project-2023-default-rtdb.europe-west1.firebasedatabase.app/';

var urlParams = new URLSearchParams(window.location.search);

const getDestination = async () => {
    const jsonData = await fetch(databaseURL + "destinacije/" + urlParams.get("destination_group_id") + "/" + urlParams.get("id") + ".json")
                            .then(response => response.json());
    if (jsonData == null) {
        window.location.replace("error.html");
    }
    return jsonData;
}

const loadData = async () => {
    var destination = await getDestination();
    document.title = destination.naziv;
    var carousel_inner = document.getElementById("introCarousel").getElementsByClassName("carousel-inner")[0];
    
    var destination_data = document.getElementById("destination_data");

    var row = document.createElement("div");
    row.classList.add("row");
    row.innerHTML = destinationTemplate(destination);
    destination_data.insertBefore(row, destination_data.getElementsByClassName("mb-5")[0]);

    var count = 0;
    for (url of destination.slike) {
        count++;
        if (count == 1) {
            carousel_inner.innerHTML += `<div class="carousel-item active carousel-background" style="background-image: url('${url}');"></div>`;
            continue;
        }
        carousel_inner.innerHTML += `<div class="carousel-item carousel-background" style="background-image: url('${url}');"></div>`;
    }
}

const destinationTemplate = destination => `<div class="col-md-6 mb-5">
                                                <div class="text-center">
                                                    <h1 class="mb-3">${destination.naziv}</h1>
                                                    <p class="h5"><i class="bi bi-airplane"></i> ${destination.tip}</p>
                                                    <p class="h5"><i class="bi bi-bus-front"></i> ${destination.prevoz}</p>
                                                    <p class="h5"><i class="bi bi-currency-dollar"></i>${destination.cena}</p>
                                                    <p class="h5"><i class="bi bi-person"></i> ${destination.maxOsoba}</p>
                                                    <a href="destination_edit.html?id=${urlParams.get("id")}&destination_group_id=${urlParams.get("destination_group_id")}" class="btn btn-outline-primary mt-4">Izmeni</a>
                                                </div>
                                            </div>
                                            <div class="col-md-6 overflow-auto" style="max-height: 12.5rem;">
                                                <p>${destination.opis}</p>
                                            </div>`


document.addEventListener("DOMContentLoaded", loadData);