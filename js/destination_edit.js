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

const destinationTemplate = destination => `<div class="col-md-6 mb-5" style="padding-left: 10rem; padding-right: 10rem;">
                                                <div class="text-center">
                                                    <input type="text" name="naziv" id="nameEdit" class="form-control mb-4" value="${destination.naziv}" placeholder="Naziv" />
                                                    
                                                    <input type="text" name="tip" id="vacationTypeEdit" class="form-control mb-4" value="${destination.tip}" placeholder="Tip letovanja" />
                                                    
                                                    <input type="text" name="prevoz" id="transportationEdit" class="form-control mb-4" value="${destination.prevoz}" placeholder="Tip prevoza" />
                                                    
                                                    <input type="text" name="cena" id="priceEdit" class="form-control mb-4" value="${destination.cena}" placeholder="Cena" />
                                                    
                                                    <input type="text" name="maxOsoba" id="maxNumberOfPeopleEdit" class="form-control" value="${destination.maxOsoba}" placeholder="Broj osoba" />
                                                    
                                                    <a href="destination.html?id=${urlParams.get("id")}&destination_group_id=${urlParams.get("destination_group_id")}" class="btn btn-outline-danger mt-4">Odustani</a>
                                                    <button class="btn btn-outline-primary mt-4">Izmeni</button>
                                                </div>
                                            </div>
                                            <div class="col-md-6 overflow-auto" style="max-height: 20rem;">
                                                <textarea class="form-control mt-3 mb-4" name="opis" id="descriptionEdit" rows="4" placeholder="Opis">${destination.opis}</textarea>
                                                
                                                <textarea class="form-control" name="slike" id="imagesEdit" rows="4" placeholder="Slike">${destination.slike.join("\n")}</textarea>
                                            </div>`


document.addEventListener("DOMContentLoaded", loadData);