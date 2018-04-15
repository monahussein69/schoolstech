const Sequelize = require('sequelize');
const sequelize = new Sequelize('schooltech', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false, // true by default
        freezeTableName: true
    },

});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


const sequelizeConfig = {
    sectionsTable: sequelize.define('sch_acd_sections', {
        Name: Sequelize.STRING,
        School_Id: Sequelize.INTEGER,
    }),
    courseTable: sequelize.define('app_def_courses', {
        Course_Name: Sequelize.STRING,
    }),
    roomsTable: sequelize.define('sch_bui_rooms', {
        school_id: Sequelize.INTEGER,
        room_type: Sequelize.INTEGER,
        Name: Sequelize.STRING,
    }),
    teachersTable: sequelize.define('sch_str_employees', {
        school_id: Sequelize.STRING,
        name: Sequelize.INTEGER,
        jobtitle_id:Sequelize.INTEGER
    }),
    lectureTable: sequelize.define('sch_acd_lectures', {
        name: Sequelize.STRING,
    }),
    mainLecturesTable: sequelize.define('sch_acd_lecturestables', {
        School_Id: Sequelize.INTEGER,
        Day: Sequelize.STRING,
        Lecture_NO: Sequelize.INTEGER,
        Course_Id: Sequelize.INTEGER,
        Section_Id: Sequelize.INTEGER,
        ClassRoom_Id: Sequelize.INTEGER,
        Teacher_Id: Sequelize.INTEGER,
    }),
    studentsSectionTable: sequelize.define('sch_acd_studentsections', {
        School_Id: Sequelize.INTEGER,
        Section_Id: Sequelize.INTEGER,
        Student_Id: Sequelize.INTEGER,
        course_id: Sequelize.INTEGER
    }),
    studentTable: sequelize.define('sch_str_student', {
        student_id: {type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
        Academic_No: Sequelize.INTEGER,
        School_Id: Sequelize.INTEGER,
        Name: Sequelize.STRING
    }),
    tasksTable:sequelize.define('sch_att_tasks', {
        id: {type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
        Calender_id: Sequelize.INTEGER,
        school_id: Sequelize.INTEGER,
        Task_Tittle: Sequelize.STRING,
        Suppervisor_Emp_id: Sequelize.INTEGER,
        Task_InOut_Type: Sequelize.INTEGER,
        Task_Place:Sequelize.STRING,
        Start_Date:Sequelize.STRING,
        start_time:Sequelize.STRING,
        End_Date:Sequelize.STRING,
        End_time:Sequelize.STRING,
        Issued_By:Sequelize.INTEGER,
        Issued_Date:Sequelize.STRING,
        Task_Staus:Sequelize.INTEGER,
        Task_Description:Sequelize.STRING,
        Order_Id:Sequelize.INTEGER,
        InComing_No:Sequelize.STRING,
        Task_Report:Sequelize.STRING,
        Task_Evaluation:Sequelize.STRING,
        buildTaskMember:Sequelize.INTEGER
    }),
    subtasksTable:sequelize.define('sch_att_subtasks', {
        id: {type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
        Task_id: Sequelize.INTEGER,
        SUBTask_Tittle: Sequelize.STRING,
        Member_Emp_id: Sequelize.INTEGER,
        SUBTask_InOut_Type: Sequelize.INTEGER,
        SUBTask_Place:Sequelize.STRING,
        Start_Date:Sequelize.STRING,
        start_time:Sequelize.STRING,
        End_Date:Sequelize.STRING,
        End_time:Sequelize.STRING,
        Departure_time:Sequelize.STRING,
        Return_time:Sequelize.STRING,
        AceualReturn_time:Sequelize.STRING,
        SUBTask_Staus:Sequelize.INTEGER,
        SUBTask_Description:Sequelize.STRING,
    }),
    taskStatusTable:sequelize.define('app_def_taskstatus', {
        Id: {type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
        Status_Codee: Sequelize.STRING,
        Name: Sequelize.STRING
    }),
    studenttasksTable:sequelize.define('sch_att_studenttasks', {
        Id: {type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
        SubTask_Id: Sequelize.INTEGER,
        Serial_No: Sequelize.INTEGER,
        Student_Id: Sequelize.INTEGER
    }),studentgroupsTable:sequelize.define('sch_str_student_groups', {
        id: {type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
        group_num: Sequelize.INTEGER,
        schoolId: Sequelize.INTEGER,
    })
    ,employeeAttandaceTable:sequelize.define('sch_att_empatt', {
        id: {type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
        Calender_id: Sequelize.INTEGER,
        school_id: Sequelize.INTEGER,
        employee_id: Sequelize.INTEGER,
        serial_no: Sequelize.INTEGER,
        Event_type_id: Sequelize.INTEGER,
        Event_Name: Sequelize.STRING,
        time_in: Sequelize.STRING,
        time_out: Sequelize.STRING,
        late_min: Sequelize.STRING,
        short_min: Sequelize.STRING,
        is_absent: Sequelize.INTEGER,
        Total_min: Sequelize.STRING,
        is_excused: Sequelize.INTEGER,
        on_vacation: Sequelize.INTEGER,
        on_task: Sequelize.INTEGER,
        working_status: Sequelize.STRING,
        entered_by: Sequelize.INTEGER,
        entery_date: Sequelize.STRING,
    })
    ,studentExecuseTable:sequelize.define('sch_att_stdexcuse', {
        id: {type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
        Calender_id: Sequelize.INTEGER,
        School_id: Sequelize.INTEGER,
        Student_id: Sequelize.INTEGER,
        ExcuseType: Sequelize.INTEGER,
        Start_Date: Sequelize.STRING,
        End_Date: Sequelize.STRING,
        Departure_time: Sequelize.STRING,
        Return_time: Sequelize.STRING,
        Excuse_Reasons: Sequelize.STRING,
        AceualReturn_time_time: Sequelize.STRING,
        AceualReturn_time: Sequelize.INTEGER,
        Request_id: Sequelize.INTEGER,
        Notes: Sequelize.STRING,
    }),
    studentAttandaceTable:sequelize.define('sch_att_stdatt', {
    id: {type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
    Calender_id: Sequelize.INTEGER,
    school_id: Sequelize.INTEGER,
    Student_id: Sequelize.INTEGER,
    serial_no: Sequelize.INTEGER,
    Event_type_id: Sequelize.INTEGER,
    Event_Name: Sequelize.STRING,
    time_in: Sequelize.STRING,
    time_out: Sequelize.STRING,
    late_min: Sequelize.STRING,
    short_min: Sequelize.STRING,
    is_absent: Sequelize.INTEGER,
    Total_min: Sequelize.STRING,
    is_excused: Sequelize.INTEGER,
    on_task: Sequelize.INTEGER,
    Study_status: Sequelize.STRING,
    Entered_by: Sequelize.INTEGER,
    entery_date: Sequelize.STRING,
 })
}
module.exports = sequelizeConfig;