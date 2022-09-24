import { format, compareAsc } from 'date-fns';

export class Course {
    OUTPUT_MARGIN: number = 20;

    id: String;
    name: String;
    startDate: Date;
    endDate: Date;
    location: String;

    constructor(courseId: String, courseName: String, courseStart: Date, courseEnd: Date, courseLocation: String) {
        this.id = courseId;
        this.name = courseName;
        this.startDate = courseStart;
        this.endDate = courseEnd;
        this.location = courseLocation;
    }

    //#TODO
    static idToName(id: string) {
        return "";
    }

    getCourseStatus(): String {
        let aujd = new Date();
      
        if (compareAsc(this.startDate, aujd) == 1)
          return "🕐 ";
        return compareAsc(this.endDate, aujd) == 1 ? "⌛ " : ":white_check_mark: ";
    }

    toString(): String  {
        let output: String = '';

        output = "\n" + this.getCourseStatus() + format(this.startDate, "HH:mm") +
                " | **" +
                "📖 " + this.name + "**\n" +
                "       " + format(this.endDate, "HH:mm") +
                " |📍  en *" +
                this.location +
                "*.\n";
        
        for(let i:number = 0; i < this.name.length + this.OUTPUT_MARGIN; i++) {
            output = ',' + output + '\'';
        }

        return output + "\n";
    }
}