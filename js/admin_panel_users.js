const databaseURL = 'https://web-design-project-2023-default-rtdb.europe-west1.firebasedatabase.app/';

var urlParams = new URLSearchParams(window.location.search);

const getUsers = async () => {
    const jsonData = await fetch(databaseURL + "korisnici/" + ".json")
                            .then(response => response.json());
    if (jsonData == null) {
        window.location.replace("error.html");
    }
    return jsonData;
}


const loadData = async () => {
    var users = await getUsers();

    var users_table = document.getElementById("usersTable");
    users_table.innerHTML = "";
    var count = 1;
    for (id in users) {
        users_table.innerHTML += userTemplate(users[id], id, count);
        count++;
    }
}

const userTemplate = (user, id, count) => `<tr>
                                                <th scope="row">${count}</th>
                                                <td>${user.korisnickoIme}</td>
                                                <td>${user.ime}</td>
                                                <td>${user.prezime}</td>
                                                <td>${user.email}</td>
                                                <td>${user.datumRodjenja}</td>
                                                <td>${user.adresa}</td>
                                                <td>${user.telefon}</td>
                                                <td>
                                                    <a href="user_edit.html?id=${id}" class="btn btn-outline-primary"><i class="bi bi-pencil"></i></a>
                                                    <button class="btn btn-outline-danger" type="button" data-mdb-toggle="modal" data-mdb-target="#userDelete" data-userid="${id}" data-username="${user.korisnickoIme}"><i class="bi bi-trash"></i></button>
                                                </td>
                                            </tr>`

document.addEventListener("DOMContentLoaded", loadData);

$('#userDelete').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var id = button.data('userid')
    var username = button.data('username')
    var modal = $(this)
    modal.find('#userDeleteName').text(`${username}`)
    $('#userDeleteButton').data("userid", id)
})

$("#userDeleteButton").on("click", () => {
    var button = $("#userDeleteButton")
    var id = button.data("userid");

    fetch(`${databaseURL}/korisnici/${id}.json`, {
        method: "DELETE"
    })
    .then(resp => {
        if (resp.ok) {
            loadData();
            var alertHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                Uspesno izbrisan korisnik.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>`;
            $("#alertPlaceholder").html(alertHTML);
        }
        else {
            window.location.replace("error.html");
        }
    });
})
