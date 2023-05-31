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

    document.getElementById("edit_destination_name").innerHTML = `<b>${destination.naziv}</b>`
    
    document.getElementById("destinationEditForm").innerHTML = destinationTemplate(destination);

    for (radio of document.getElementsByName("tip")) {
        if (radio.value === destination.tip) {
            radio.checked = true;
            break;
        }
    }

    for (radio of document.getElementsByName("prevoz")) {
        if (radio.value === destination.prevoz) {
            radio.checked = true;
            break;
        }
    }
}

const destinationTemplate = destination => `<div class="row">
                                                <div class="col-md-6 mb-5" style="padding-left: 7.5rem; padding-right: 7.5rem;">
                                                    <div class="text-center">
                                                        <input type="text" name="naziv" id="nameEdit" class="form-control mb-4" value="${destination.naziv}" placeholder="Naziv" required />
                                                        
                                                        <input type="number" name="cena" id="priceEdit" class="form-control mb-4" value="${destination.cena}" placeholder="Cena" oninput="validatePrice()" required />
                                                        
                                                        <input type="number" name="maxOsoba" id="maxNumberOfPeopleEdit" class="form-control mb-4" value="${destination.maxOsoba}" placeholder="Broj osoba" oninput="validateMaxPeople()" required />
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <fieldset>
                                                                <legend>Tip odmora</legend>
                                                            
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio" name="tip" id="europeCities" value="Gradovi Evrope" required>
                                                                    <label class="form-check-label" for="europeCities">Gradovi Evrope</label>
                                                                </div>
                                                            
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio" name="tip" id="summer" value="Letovanje">
                                                                    <label class="form-check-label" for="summer">Letovanje</label>
                                                                </div>
                                                            
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio" name="tip" id="winter" value="Zimovanje">
                                                                    <label class="form-check-label" for="winter">Zimovanje</label>
                                                                </div>
                                                            </fieldset>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <fieldset>
                                                                <legend>Tip prevoza</legend>
                                                            
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio" name="prevoz" id="ownTransportation" value="sopstveni" required>
                                                                    <label class="form-check-label" for="ownTransportation">Sopstveni</label>
                                                                </div>
                                                            
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio" name="prevoz" id="bus" value="autobus">
                                                                    <label class="form-check-label" for="bus">Autobus</label>
                                                                </div>
                                                            
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio" name="prevoz" id="plane" value="avion">
                                                                    <label class="form-check-label" for="plane">Avion</label>
                                                                </div>
                                                            </fieldset>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 overflow-auto" style="max-height: 20rem;">
                                                    <textarea class="form-control mt-3 mb-4" name="opis" id="descriptionEdit" rows="4" placeholder="Opis" required>${destination.opis}</textarea>
                                                    
                                                    <textarea class="form-control" name="slike" id="imagesEdit" rows="4" placeholder="Slike" oninput="validateImageURLs()" required>${destination.slike.join("\n")}</textarea>
                                                </div>
                                                <div class="col-md text-center">
                                                    <a href="destination.html?id=${urlParams.get("id")}&destination_group_id=${urlParams.get("destination_group_id")}" class="btn btn-outline-danger mt-4">Odustani</a>
                                                    <button type="submit" class="btn btn-outline-primary mt-4">Izmeni</button>
                                                </div>
                                            </div>`


document.addEventListener("DOMContentLoaded", loadData);

var destinationEditForm = document.getElementById("destinationEditForm");
destinationEditForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (destinationEditForm.checkValidity()) {
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

        fetch(`${databaseURL}destinacije/${urlParams.get("destination_group_id")}/${urlParams.get("id")}.json`, {
            method: 'PUT',
            body: JSON.stringify(destination)
        })
        .then(resp => {
            if (resp.ok) {
                var alertHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                    Uspesno izmenjena destinacija.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
                document.getElementById("alertPlaceholder").innerHTML = alertHTML;

                window.location.replace(`destination.html?id=${urlParams.get("id")}&destination_group_id=${urlParams.get("destination_group_id")}`);
            } else {
                window.location.replace("error.html");
            }
        })
    } else
        destinationEditForm.classList.add("was-validated");
})

const validatePrice = () => {
    var priceEdit = document.getElementById("priceEdit");
    if (!/^(?!0)\d*$/.test(priceEdit.value))
        priceEdit.setCustomValidity("error");
    else
        priceEdit.setCustomValidity("");
}

const validateMaxPeople = () => {
    var maxPeople = document.getElementById("maxNumberOfPeopleEdit");
    if (!/^(?!0)\d*$/.test(maxPeople.value))
        maxPeople.setCustomValidity("error");
    else
        maxPeople.setCustomValidity("");
}

const validateImageURLs = () => {
    var imagesInput = document.getElementById("imagesEdit");
    var urls = imagesInput.value.split("\n");
    var invalid = false;
    for (url of urls) {
        if (!validateImageURL(url)) {
            invalid = true;
            imagesInput.setCustomValidity("error");
            break;
        }
    }
    if (!invalid)
        imagesInput.setCustomValidity("");
}

const validateImageURL = (url) => new RegExp(/\bhttps?:[^)''"]+\.(?:jpg|jpeg|gif|png)/).test(url);