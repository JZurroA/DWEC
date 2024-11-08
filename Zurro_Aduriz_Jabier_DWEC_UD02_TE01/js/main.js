/*
    Autor: Jabier Zurro Aduriz
    Fecha: 06/11/2024
    Asignatura: DWEC
    UD02 TE01
*/

// Importar la clase GastoCombustible como módulo
import GastoCombustible from "/js/GastoCombustible.js";

// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = '../json/tarifasCombustible.json';
let gastosJSONpath = '../json/gastosCombustible.json';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {
    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);
    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }

    // Sumar todos los gastos de los gastosJSON
    for (let gasto of gastosJSON) {
        let anio = gasto.date.split('-')[0]; // Extraer el año
        aniosArray[anio] += gasto.precioViaje; // Sumar el precioViaje al año correspondiente
    }

    // Mostrar los gastos totales en el HTML
    for (let anio in aniosArray) {
        document.getElementById(`gasto${anio}`).innerText = aniosArray[anio].toFixed(2);
    }
}

// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);
    const anio = fecha.getFullYear();
    
    // Obtener la tarifa correspondiente al año y tipo de vehículo
    let tarifa = 0;
    for(const objetoVehiculo of tarifasJSON.tarifas) {
        if(objetoVehiculo.anio === anio) {
            tarifa = objetoVehiculo.vehiculos[tipoVehiculo];
            break;
        }
    }

    // Calcular el precio del viaje, crear un nuevo objeto GastoCombustible y mostrarlo en la lista
    const precioViaje = tarifa * kilometros;
    const nuevoGasto = new GastoCombustible(tipoVehiculo, fecha, kilometros, precioViaje);
    const gastoJSON = nuevoGasto.convertToJSON();

    const expenseList = document.getElementById('expense-list');
    const newExpenseItem = document.createElement('li');
    newExpenseItem.innerText = gastoJSON;

    expenseList.appendChild(newExpenseItem);

    // Actualizar el gasto total de forma correcta
    actualizarGastoTotal(anio, precioViaje);

    // Limpiar el formulario
    document.getElementById('fuel-form').reset();
}

// Actualizar el gasto total de un año específico
function actualizarGastoTotal(anio, precioViaje) {
    const gastoElemento = document.getElementById(`gasto${anio}`);
    const gastoActual = parseFloat(gastoElemento.innerText); // Obtener el gasto actual
    const gastoTotal = gastoActual + precioViaje; // Sumar el nuevo gasto
    gastoElemento.innerText = gastoTotal.toFixed(2); // Actualizar el texto
}