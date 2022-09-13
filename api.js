import fetch from "node-fetch";
import ical2json from "ical2json";
import { format, parseISO } from "date-fns";

// fichier contenant toutes les interactions avec le fichier

let url =
  "https://planif.esiee.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=3172&projectId=10&calType=ical&nbWeeks=52";

export async function getCoursesAt(date) {
  return new Promise((resolve, reject) => {
    let cours_data;
    fetch(url, {
      headers: {
        "Content-Type": "application/text",
      },
    })
      .then((resp) => {
        return resp.text();
      })
      .then((resp) => {
        let jsonCal = ical2json.convert(resp);

        // la variable cours_data contient les cours mis sous forme json
        cours_data = jsonCal.VCALENDAR[0].VEVENT;

        let res = [];
        let target = format(new Date(date), "dd-MM-yyyy");

        cours_data.forEach((cours) => {
          let tmp = format(new Date(parseISO(cours.DTSTART)), "dd-MM-yyyy");
          if (tmp === target) {
            res.push(cours);
          }
        });

        // on reverse le tableau pour avoir les matières dans l'ordre
        res.reverse();
        resolve(res);
      })
      .catch((e) => reject(e));
  });
}
