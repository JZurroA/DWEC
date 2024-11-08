/*
    Autor: Jabier Zurro Aduriz
    Fecha: 06/11/2024
    Asignatura: DWEC
    UD02 TE01
*/

//Crear la clase GastoCombustible
class GastoCombustible {
    constructor(vehicleType, date, kilometers, precioViaje) {
        this.vehicleType = vehicleType;
        this.date = date;
        this.kilometers = kilometers;
        this.precioViaje = precioViaje;
    }

    //Método para convertir el objeto a JSON
    convertToJSON() {
        return JSON.stringify(this);
    }
}

//Exportar la clase para añadirlo como módulo en main.js
export default GastoCombustible;