var localStorage = window.localStorage;

class Categorias {
    constructor(nombre, descripcion, estado, action) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estado = estado;
        this.action = action;
    }
    agregarCategoria() {
        if (this.nombre === "") {
            document.getElementById("Nombre").focus();
        } else {
            if (this.descripcion === "") {
                document.getElementById("Descripcion").focus();
            } else {
                if (this.estado === "0") {
                    document.getElementById("mensaje").innerHTML = "Seleccione un estado";
                } else {

                    var nombre = this.nombre;
                    var descripcion = this.descripcion;
                    var estado = this.estado;
                    var action = this.action;
                    var mensaje = '';
                    $.ajax({
                        type: "POST",
                        url: action,
                        data: {
                            nombre, descripcion, estado
                        },
                        success: (response) => {
                            $.each(response, (index, val) => {
                                mensaje = val.code;
                            });
                            if (mensaje === 'Save') {
                                this.restablecer();
                            } else {
                                document.getElementBy("mensaje").innerHTML = "No se puede guardar la categoria";
                            }
                            //console.log(response);
                        }
                    });
                }
            }
        }
    }
    filtrarDatos(numPagina) {
        var valor = this.nombre;
        var action = this.action;
        if (valor === "") {
            valor = "null";        // El tutorial poner null como string, esto es mejorable
        }
        $.ajax({
            type: "POST",
            url: action,
            data: {
                valor, numPagina
            },
            success: (response) => {
                console.log(response);
                $.each(response, (index, val) => {
                    $("#resultSearch").html(val[0]);
                    $("#paginado").html(val[1]);
                });
            }
        });
    }
    getCategoria(id) {
        var action = this.action;
        $.ajax({
            type: "POST",
            url: action,
            data: { id },
            success: (response) => {
                console.log(response);
                if (response[0].estado) {
                    document.getElementById("tituloCategoria").innerHTML = "Esta seguro de desactivar la categoría " + response[0].nombre;
                } else {
                    document.getElementById("tituloCategoria").innerHTML = "Esta seguro de habilitar la categoría " + response[0].nombre;
                }
                localStorage.setItem("categoria", JSON.stringify(response));
            }
        });
    }
    editarCategoria(id, funcion) {
        var nombre = null;
        var descripcion = null;
        var estado = null;
        var action = null;
        switch (funcion) {
            case "estado":
                var response = JSON.parse(localStorage.getItem("categoria"));
                nombre = response[0].nombre;
                descripcion = response[0].descripcion;
                estado = response[0].estado;
                localStorage.removeItem("categoria");
                this.editar(id, nombre, descripcion, estado, funcion);
                break;
            default:
        }
    }
    editar(id, nombre, descripcion, estado, funcion) {
        var action = this.action;
        $.ajax({
            type: "POST",
            url: action,
            data: { id, nombre, descripcion, estado, funcion },
            success: (response) => {
                console.log(response);
                this.restablecer();
            }
        });
    }
    restablecer() {
        document.getElementById("Nombre").value = "";
        document.getElementById("Descripcion").value = "";
        document.getElementById("mensaje").value = "";
        document.getElementById("Estado").selectedIndex = "";
        $('#modalAC').modal('hide');
        $('#ModalEstado').modal('hide');
        filtrarDatos(1);
    }
}