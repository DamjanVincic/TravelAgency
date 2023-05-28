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
    
    var destination_data_edit = document.getElementById("destination_data_edit");

    var row = document.createElement("div");
    row.classList.add("row");
    row.innerHTML = destinationTemplate(destination);
    destination_data_edit.insertBefore(row, destination_data_edit.getElementsByClassName("mb-5")[0]);
}

const destinationTemplate = destination => `<div class="col-md-6 mb-5" style="padding-left: 7.5rem; padding-right: 7.5rem;">
                                                <div class="text-center">
                                                    <input type="text" name="naziv" id="nameEdit" class="form-control mb-4" value="${destination.naziv}" placeholder="Naziv" />
                                                    
                                                    <input type="number" name="cena" id="priceEdit" class="form-control mb-4" value="${destination.cena}" placeholder="Cena" />
                                                    
                                                    <input type="number" name="maxOsoba" id="maxNumberOfPeopleEdit" class="form-control mb-4" value="${destination.maxOsoba}" placeholder="Broj osoba" />

                                                    <div class="form-outline mb-4">
                                                        <select class="form-select" name="tip" id="vacationTypeEdit">
                                                            <option selected>Tip letovanja</option>
                                                            <option value="Gradovi Evrope">Gradovi Evrope</option>
                                                            <option value="Letovanje">Letovanje</option>
                                                            <option value="Zimovanje">Zimovanje</option>
                                                        </select>
                                                    </div>

                                                    <div class="form-outline mb-4">
                                                        <select class="form-select" name="prevoz" id="transportationEdit">
                                                            <option selected>Tip prevoza</option>
                                                            <option value="sopstveni">Sopstveni</option>
                                                            <option value="autobus">Autobus</option>
                                                            <option value="avion">Avion</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 overflow-auto" style="max-height: 20rem;">
                                                <textarea class="form-control mt-3 mb-4" name="opis" id="descriptionEdit" rows="4" placeholder="Opis">${destination.opis}</textarea>
                                                
                                                <textarea class="form-control" name="slike" id="imagesEdit" rows="4" placeholder="Slike">${destination.slike.join("\n")}</textarea>
                                            </div>
                                            <div class="col-md text-center">
                                                <a href="destination.html?id=${urlParams.get("id")}&destination_group_id=${urlParams.get("destination_group_id")}" class="btn btn-outline-danger mt-4">Odustani</a>
                                                <button class="btn btn-outline-primary mt-4">Izmeni</button>
                                            </div>`


document.addEventListener("DOMContentLoaded", loadData);