// convert-csv-to-json.js
const fs = require("fs");
const xlsx = require("xlsx");

const filePath = "./data.xls";

// Leer el archivo Excel
const workbook = xlsx.readFile(filePath);

// Asumimos que los datos están en la primera hoja
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convertir la hoja a un arreglo de objetos JSON
const jsonData = xlsx.utils.sheet_to_json(worksheet);
console.log(jsonData);

// Función para convertir la fecha numérica de Excel a texto
function convertExcelDateToText(excelDate) {
  const baseDate = new Date(Date.UTC(1899, 11, 30)); // Fecha base de Excel
  return new Date(baseDate.getTime() + excelDate * 86400000)
    .toISOString()
    .split('T')[0]; // Formato YYYY-MM-DD
}

// Formatear los usuarios de acuerdo al modelo
const formattedUsers = jsonData
  .filter((item) => item.Perfil === "Front")
  .map((row) => ({
    firstName: row.Nombre ? row.Nombre.split(" ")[0] : "",
    lastName: row.Nombre ? row.Nombre.split(" ").slice(1).join(" ") : "",
    documentType: "DNI",
    documentNumber: row["Documento"] ? row["Documento"].toString() : "",
    profile: row.Perfil || "",
    scrumMaster: row["Scrum Master"] || null,
    technicalLead: row["Lider Técnico"] || null,
    squad: row.Squad || null,
    phone: row.Celular ? row.Celular.toString() : "",
    birthDate: row["F. Nacimiento"] ? convertExcelDateToText(row["F. Nacimiento"]) : null,
    department: row.Provincia || "",
    province: row.Provincia || "",
    district: row.Distrito || "",
    address: row.DirecciÛn || "",
  }));

// Guardar el JSON formateado en un archivo
fs.writeFileSync(
  "./formatted-users.json",
  JSON.stringify(formattedUsers, null, 2)
);
console.log("JSON generado correctamente: formatted-users.json");
