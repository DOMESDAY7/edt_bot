import fetch from "node-fetch";
import ical2json from "ical2json";
import { compareAsc, format, parseISO, getHours } from "date-fns";

//                                                                   //
// fichier contenant toutes les interactions avec le fichier externe //
//                                                                   //

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
        sortCourses(res);
        resolve(res);
      })
      .catch((e) => reject(e));
  });
}

// Trie les cours résultants du fetch en fonction de la date de début de ces derniers
function sortCourses(courses) {

  for(let i = 0; i<courses.length - 1; i++) {
    for(let j = 0; j < (courses.length - i) - 1; j++) {
      let current_course = parseISO(courses[j].DTSTART)
      let next_course = parseISO(courses[j+1].DTSTART)

      if(compareAsc(current_course, next_course) == 1){
        let tmp = courses[j];
        courses[j] = courses[j+1];
        courses[j+1] = tmp;
      }
    }
  }
}

// met le cours en paramêtre en string
export function courseToString(course) {
  return format(parseISO(course.DTSTART), "HH:mm") +
          " : **" +
          course.SUMMARY +
          "** en *" +
          course.LOCATION +
          "*.\n";
}

// avoir le prochain cours
export async function getNextCourse() {
  return new Promise((resolve, reject) => {
    getCoursesAt(new Date()).then((cours) => {
      // On trie les cours
      sortCourses(cours);

      // on récupère l'heure actuelle
      let ajd = new Date();
      let heure_actu = getHours(ajd);

      // pour chaque cours on récupère l'heure de début
      // (les cours sont triés donc on peut s'arrêter dès qu'on rentre dans le if)
      for (let i = 0; i < cours.length; i++) {
        let tmp = getHours(new Date(parseISO(cours[i].DTSTART)))
        if (compareAsc(tmp, heure_actu) == 1) {
          resolve(cours[i]);
        }
      }

      resolve(null);
  })
  .catch((e) => reject(e));
  })
}

// changement de liens dans la base de donnée
export function changeLink(link){
  
}