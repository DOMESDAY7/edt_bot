import axios from "axios";
import { compareAsc, format, parseISO, getHours } from "date-fns";
import { Course } from "../course/Course";

//#TODO
//Generates an URL to fetch data for the specified options
function buildURL(options: Array<string>): string {
    let fetchURL: string;
    
    fetchURL = "https://planif.esiee.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=3172&projectId=10&calType=ical&nbWeeks=1";

    return fetchURL;
}

//Gets the courses of a targeted day (today if not specifiied) as a Promise from a specified URL
export function getCoursesAt(options: Array<string>, date: Date = new Date()): Array<Course> {
    let fetchURL: string = buildURL(options);
    let courses: Array<Course> = new Array<Course>();

    axios.get(fetchURL, {
        headers: {
        "Content-Type": "application/text",
        },
    })
    .then((resp) => {
        console.log(resp.data);

        /*
        let target: string = format(new Date(date), "dd-MM-yyyy");
        let today: string = format(new Date(), "dd-MM-yyyy");

        //Pushing courses that match the targeted day into res
        courseData.forEach((obj: IDataCalendar) => {
            if(target === today) {
                courses.push(new Course(
                    obj.SUMMARY, "",
                    parseISO(obj.DTSTART), parseISO(obj.DTEND),
                    obj.LOCATION));
            }
        });  
        */
    })

    return courses;
}

//Gets the next course from a specified URL
export function getNextCourse(options: Array<string>): Course | null {
    //Getting courses of today to get the next one from present moment
    let todaysCourses: Array<Course> = getCoursesAt(options, new Date());
    let heure_actu: number = getHours(new Date());

    //Getting startDate of every course
    //Courses are sorted in chronological order so we can just loop in the array
    for (let i = 0; i < todaysCourses.length; i++) {
        let tmp = getHours(todaysCourses[i].startDate);

        if (compareAsc(tmp, heure_actu) == 1)
            return todaysCourses[i];
    }

    return null;
}