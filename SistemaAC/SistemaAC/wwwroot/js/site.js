// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

$('#modalEditar').on('shown.bs.modal', function () {
    $('#myInput').focus();
});

$('#modalAC').on('shown.bs.modal', function () {
    $('#Nombre').focus();
});

function getUsuario(id, action) {
    $.ajax({
        type: "POST",
        url: action,
        data: { id },
        success: function (response) {
            mostrarUsuario(response);
        }
    });
}

var items;
var j = 0;
//Variables globales por cada propiedad del usuario
var id;
var userName;
var email;
var phoneNumber;

var role;
var selectRole;

//Otras variables donde almacenaremos los datos del registro, pero estos datos no serán modificados
var accessFailedCount;
var concurrencyStamp;
var emailConfirmed;
var lockoutEnabled;
var lockoutEnd;
var normalizedEmail;
var normalizedUserName;
var passwordHash;
var phoneNumberConfirmed;
var securityStamp;
var twoFactorEnabled;

function mostrarUsuario(response) {
    items = response;
    j = 0;
    for (var i = 0; i < 3; i++) {
        var x = document.getElementById('Select');
        x.remove(i);
    }

    $.each(items, function (index, val) {
        $('input[name=Id]').val(val.id);
        $('input[name=UserName]').val(val.userName);
        $('input[name=Email]').val(val.email);
        $('input[name=PhoneNumber]').val(val.phoneNumber);
        document.getElementById('Select').options[0] = new Option(val.role, val.roleId);

        //Mostrar los detalles del usuario
        $('#dUserName').text(val.userName);
        $('#dEmail').text(val.email);
        $('#dPhoneNumber').text(val.phoneNumber);

        //Mostrar los datos del usuario que deseo eliminar
        $('#eUsuario').text(val.userName);
        $('input[name=EIdUsuario]').val(val.id);
    });
}

function getRoles(action) {
    $.ajax({
        type: "POST",
        url: action,
        data: {},
        success: function (response) {
            if (j === 0) {
                for (var i = 0; i < response.length; i++) {
                    document.getElementById('Select').options[i] = new Option(response[i].text, response[i].value);
                    document.getElementById('SelectNuevo').options[i] = new Option(response[i].text, response[i].value);
                }
                j = 1;
            }
        }
    });
}

function editarUsuario(action) {
    //Obtenemos los datos del input respectivo del formulario
    id = $('input[name=Id]')[0].value;
    email = $('input[name=Email]')[0].value;
    phoneNumber = $('input[name=PhoneNumber]')[0].value;
    role = document.getElementById('Select');
    selectRole = role.options[role.selectedIndex].text;

    $.each(items, function (index, val) {
        userName = val.userName;
        accessFailedCount = val.accessFailedCount;
        concurrencyStamp = val.concurrencyStamp;
        emailConfirmed = val.emailConfirmed;
        lockoutEnabled = val.lockoutEnabled;
        lockoutEnd = val.lockoutEnd;
        normalizedEmail = val.normalizedEmail;
        normalizedUserName = val.normalizedUserName;
        passwordHash = val.passwordHash;
        phoneNumberConfirmed = val.phoneNumberConfirmed;
        securityStamp = val.securityStamp;
        twoFactorEnabled = val.twoFactorEnabled;
    });

    $.ajax({
        type: "POST",
        url: action,
        data: {
            id, userName, email, phoneNumber,
            accessFailedCount, concurrencyStamp, emailConfirmed, lockoutEnabled,
            lockoutEnd, normalizedEmail, normalizedUserName, passwordHash, phoneNumberConfirmed,
            securityStamp, twoFactorEnabled, selectRole
        },
        success: function (response) {
            if (response === "Save") {
                window.location.href = "Usuarios";
            } else {
                alert("No se pueden editar los datos del usuario");
            }
        }

    });
}

function ocultarDetallesUsuario(action) {
    $("#modalDetalle").modal("hide");
}

function eliminarUsuario(action) {
    var id = $('input[name=EIdUsuario]')[0].value;

    $.ajax({
        type: "POST",
        url: action,
        data: {
            id
        },
        success: function (response) {
            if (response === "Delete") {
                window.location.href = "Usuarios";
            }
            else {
                alert("No se pudo eliminar el usuario");
            }
        }
    });
}

function crearUsuario(action) {
    //Obtener los datos ingresados en los inputs respectivos
    email = $('input[name=EmailNuevo]')[0].value;
    phoneNumber = $('input[name=PhoneNumberNuevo]')[0].value;
    passwordHash = $('input[name=PasswordHashNuevo]')[0].value;
    role = document.getElementById('SelectNuevo');
    selectRole = role.options[role.selectedIndex].text;

    //Vamos a validar ahora que los datos del usuario no estén vacíos
    if (email === "") {
        $('#EmailNuevo').focus();
        alert('Ingrese el email del usuario');
    } else {
        if (passwordHash === "") {
            $('#PasswordHashNuevo').focus();
            alert('Ingrese el password del usuario');
        } else {
            $.ajax({
                type: "POST",
                url: action,
                data: { email, phoneNumber, passwordHash, selectRole },
                success: function (response) {
                    if (response === "Save") {
                        window.location.href = "Usuarios";
                    } else {
                        $('#mensajeNuevo').html("No se puede guardar el usuario. <br /> Selecciona un rol. <br /> Ingrese un email correcto. <br> El password debe tener de 6-100, al menos un caracter especial, una letra mayúscula y un numero.");
                    }
                }
            });
        }
    }
}
$().ready(() => {
    document.getElementById("filtrar").focus();
    filtrarDatos(1);
});

var idCategoria;

var agregarCategoria = () => {
    var nombre = document.getElementById("Nombre").value;
    var descripcion = document.getElementById("Descripcion").value;
    var estados = document.getElementById("Estado");
    var estado = estados.options[estados.selectedIndex].value;
    var action = 'Categorias/guardarCategoria';
    var categoria = new Categorias(nombre, descripcion, estado, action);
    categoria.agregarCategoria();
};

var filtrarDatos = (numPagina) => {
    var valor = document.getElementById("filtrar").value;
    var action = 'Categorias/filtrarDatos';
    var categoria = new Categorias(valor, "", "", action);  // Como que no es muy flexible esta forma de manejar variables...
    categoria.filtrarDatos(numPagina);
};

var editarEstado = (id) => {
    idCategoria = id;
    var action = 'Categorias/getCategorias';
    var categoria = new Categorias("", "", "", action);
    categoria.getCategoria(id);

}