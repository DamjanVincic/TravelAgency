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
                                                    <button class="btn btn-outline-primary" type="button" data-mdb-toggle="modal" data-mdb-target="#userEdit"><i class="bi bi-pencil"></i></button>
                                                    <button class="btn btn-outline-danger" type="button" data-mdb-toggle="modal" data-mdb-target="#userDelete" data-id="${id}" data-username="${user.korisnickoIme}"><i class="bi bi-trash"></i></button>
                                                </td>
                                            </tr>`

document.addEventListener("DOMContentLoaded", loadData);

$('#userDelete').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    // var id = button.data('id')
    var username = button.data('username')
    var modal = $(this)
    modal.find('#userDeleteName').text(`${username}`)
})