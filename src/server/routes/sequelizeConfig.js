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
        name: Sequelize.INTEGER
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
    }),
    studentTable: sequelize.define('sch_str_student', {
        student_id: {type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
        Academic_No: Sequelize.INTEGER,
        School_Id: Sequelize.INTEGER,
        Name: Sequelize.STRING
    })
}
module.exports = sequelizeConfig;