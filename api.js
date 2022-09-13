import fetch from "node-fetch";
import ical2json from "ical2json"
let url =
  "https://planif.esiee.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=3172&projectId=10&calType=ical&nbWeeks=4";

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
    // la variable cours contient les cours mis sous forme json
    let cours = jsonCal.VCALENDAR[0].VEVENT;
  })

