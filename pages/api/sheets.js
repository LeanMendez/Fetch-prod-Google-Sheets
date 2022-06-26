import {google} from "googleapis";

//se exporta una función asincrona GetList que será la encargada de conectarse con la hoja de calculo y traer los datos de la misma
export async function getList() {
  try {
    const target = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      target,
    );
    const sheets = google.sheets({version: "v4", auth: jwt});
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "productos", //rango definido en la hoja de calculo, cuadricula de celdas que se fetchean
    });
    const dataCategories = response.data.values;

    if (dataCategories.length) {
      return dataCategories.map((item) => ({
        id: item[0],
        product: item[1],
        description: item[2],
        price: item[3],
        stock: item[4],
      }));
    }
  } catch (e) {
    return e.messange;
  }
}
export default function exp(req, res) {
  res.setHeader("content-type", "application/json");
  res.status(200).send(JSON.stringify(getList()));
}
