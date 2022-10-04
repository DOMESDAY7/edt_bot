import axios from "axios";
import { compareAsc, format, parseISO, getHours, getDate } from "date-fns";
import { Course } from "../course/Course";
import { parseCalendar } from "./iCalendarParser";

//#TODO
//Generates an URL to fetch data for the specified options
function buildURL(options: Map<string, string>): string {
    
    if(options.get("semaine")?.length != null){
      return `https://planif.esiee.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=3172&projectId=10&calType=ical&nbWeeks=${options.get("semaine")}`; 
    }
    return "https://planif.esiee.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=3172&projectId=10&calType=ical&nbWeeks=1";

  
}

//Gets the courses of a targeted day (today if not specifiied) as a Promise from a specified URL
export async function getCoursesAt(options: Map<string, string>, date: Date | null = null, knownURL: string = ""): Promise<Course[]> {
    let fetchURL: string = knownURL == "" ? buildURL(options) : knownURL;
    let courses: Array<Course> = new Array<Course>();

    await axios.get(fetchURL, {
        headers: {
        "Content-Type": "application/text",
        },
    })
    .then((resp) => {
        let courseData: Array<Course> = parseCalendar(resp.data);
        if(date == null) {
            courses = courseData;
            return;
        }
        let target: string = format(new Date(date), "dd-MM-yyyy");

        //Pushing courses that match the targeted day into res
        courseData.forEach((obj: Course) => {
            let courseDate: string = format(obj.startDate, "dd-MM-yyyy");
            if(target === courseDate)
                courses.push(obj); 
        });
    })
    courses.sort((a: Course, b: Course) => { return compareAsc(a.startDate, b.startDate); });
    console.log("⬇ Fetched "+ courses.length + " courses from " + fetchURL);

    return courses;
}

//Gets the next course from a specified URL
export async function getNextCourse(options: Map<string, string>, knownURL: string = "",cours:string = ""): Promise<Course | null> {
  
  let heure_actu: Date = new Date();
  if(cours.length !=  0){
    return await getCoursesAt(options, null, knownURL).then((courses) => {
      courses = courses.filter(course=> course.name == cours)
      for (let i = 0; i < courses.length; i++) {   
        if (compareAsc(courses[i].startDate, heure_actu) == 1)
            return courses[i+1];
      }
      return null;
    })
  }
    //Getting courses of today to get the next one from present moment
    return await getCoursesAt(options, null, knownURL).then((courses) => {
        //Getting startDate of every course
        //Courses are sorted in chronological order so we can just loop in the array
        for (let i = 0; i < courses.length; i++) {   
            if (compareAsc(courses[i].startDate, heure_actu) == 1)
                return courses[i];
        }
    
        return null;
    })
}