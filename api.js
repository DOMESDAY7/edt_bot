import fetch from "node-fetch";
import ical2json from "ical2json"
import { format, compareDesc, parseISO } from 'date-fns'

let url =
  "https://planif.esiee.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=3172&projectId=10&calType=ical&nbWeeks=52";

let cours_data;

fetch(url, {
  headers: {
    "Content-Type": "application/text",
  },
})
  .then((resp) => {
    return resp.text()
  }) 
  .then((resp)=>{
    let jsonCal = ical2json.convert(resp);
    // la variable cours_data contient les cours mis sous forme json
    cours_data = jsonCal.VCALENDAR[0].VEVENT;
    console.table(getCoursesAt("09/13/2022"))
  })

  function getCoursesAt(date) {
    let res = [];
    let target = format(new Date(date), 'dd-mm-yyyy')

    cours_data.forEach(cours => {
      let tmp = format(new Date(parseISO(cours.DTSTART)), 'dd-mm-yyyy')
      if(tmp === target) {
        res.push(cours)
      }
    });
    return res;
  }