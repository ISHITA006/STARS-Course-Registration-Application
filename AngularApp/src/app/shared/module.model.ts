class IndexInfo{
    INDEX: Number = 0;
    REGISTERED: number = 0;
    VACANCIES: number = 0;
    MAX: number =0;
    ACTIVITIES: Activity[] = [];
}

class Activity{
    TYPE:  String = "";
    GROUP: String = "";
    DAY: String = "";
    TIME: Time = new Time;
    VENUE: String = "";
    REMARK: String = "";
}

class Time{
    START: String = "";
    END: String = "";
}

export class Module {
_id: string = "";
COURSE: String = "";
AU: String = "";
NAME:String= "";
REMARK: String = "";
PREREQUISITE: String = "";
MAX: number = 0;
REGISTERED: number = 0;
VACANCIES: number = 0;
INDEX_LIST: IndexInfo[] = [];
}
