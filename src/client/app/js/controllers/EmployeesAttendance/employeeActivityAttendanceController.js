angular.module('MetronicApp').controller('employeeActivityAttendanceController',
    function ($moment,$compile,DTOptionsBuilder, DTColumnBuilder,$q,$uibModal,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,employeesAttendanceService,manageEmployeeService,WorkingSettingsService) {

        var schoolId = 0;
        var userObject = localStorageService.get('UserObject');
        if(userObject){
            var userType = userObject[0].userType;
            var schoolId = 0;
            if (userType == 2) {
                schoolId = userObject[0].schoolId;
            } else {
                schoolId = $stateParams.schoolId;
            }
        }
        var attendance_day = $moment().format('MM/DD/YYYY');
        var model = {
            schoolId:schoolId,
            emp_atts:[],
            attendance_day: attendance_day,
            getAllEmployeesByActivity:getAllEmployeesByActivity,
            activeProfile : {},
            getAttendanceBasedDate:getAttendanceBasedDate,
            employeeActivity: employeeActivity,
            listOfActivity: {},
            activity:'',
            options:DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                defer.resolve(model.emp_atts);


                return defer.promise
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('name').withTitle(' اسم الموظف'),
                DTColumnBuilder.newColumn(null).withTitle('الحضور').notSortable()
                    .renderWith(actionsHtml)
            ],
            dtInstance: {},
        };




        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {

            return ''+
                '<button class="btn btn-primary" ng-class="{\'color-grey\':!('+data.is_absent+' == 0)}"  ng-click="model.employeeActivity('+data.main_employee_id+',0,$event)"> تأخر</button>' +
                '<button class="btn btn-danger" ng-class="{\'color-grey\':!'+data.is_absent+'}"  ng-click="model.employeeActivity('+data.main_employee_id+',1,$event)">غياب</button>' +
                '<button class="btn btn-warning" ng-class="{\'color-grey\':'+data.is_absent+' != 2}" ng-click="model.employeeActivity('+data.main_employee_id+',2,$event)">خروج مبكر</button>'
                ;
        }


        function getAttendanceBasedDate(){
            var defer = $q.defer();
            if(model.attendance_day){

                employeesAttendanceService.getActivityByDayAndSchoolId(model.schoolId,model.attendance_day, function (data) {
                    model.listOfActivity = data;
                    console.log('data');
                    console.log(data);
                });
            }
        }

        function getAllEmployeesByActivity(){
            var defer = $q.defer();
            employeesAttendanceService.getAllEmployeesAttendanceByActivity(schoolId,model.activity,model.attendance_day).then(function (employees) {
                defer.resolve(employees);
                model.dtInstance.changeData(defer.promise);
                model.employees = employees;
            });

        }

        employeesAttendanceService.getActivityByDayAndSchoolId(model.schoolId,model.attendance_day, function (data) {
            model.listOfActivity = data;
            console.log('data');
            console.log(data);
        });


        $scope.model = model;




        function employeeActivity(employee_id,status_id,$event) {
            var status_names = [];
            status_names[0] = 'تأخر';
            status_names[1] = 'غياب';
            status_names[2] = 'خروج مبكر';
            var dialogInst = $uibModal.open({
                templateUrl: 'views/employees_attendance/employeeActivityPopup.html',
                controller: 'EmployeeActivityPopupCtrl',
                size: 'md',
                resolve: {
                    selectedEmployee: function () {
                        return employee_id;
                    },
                    schoolId: function () {
                        return model.schoolId;
                    },
                    selectedActivity: function () {
                        return model.activity;
                    },
                    status_id: function () {
                        return status_id;
                    }, status_name: function () {
                        return status_names[status_id];
                    },
                    selected_date: function () {
                        return model.attendance_day;
                    },
                    getActivityByDayAndSchoolId: function () {
                        return model.listOfActivity;
                    }
                }
            });
            dialogInst.result.then(function (result) {

                if(result.success){
                    angular.element($event.target).removeClass('color-grey');
                }

                //$scope.usrs.push(newusr);
                //$scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
                console.log('open');
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            // App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });



angular.module('MetronicApp').controller('EmployeeActivityPopupCtrl', function (toastr, employeesAttendanceService, $moment, $scope, $uibModalInstance, selectedEmployee,selectedActivity, schoolId,status_name,status_id,selected_date, $log, getActivityByDayAndSchoolId) {

    var index = -1;

     getActivityByDayAndSchoolId.some(function(obj, i) {
        return obj.event_Nam === selectedActivity ? index = i : false;
    });
    index = index.toString();
    console.log(index);

    var model = {
        selectedEmployee: selectedEmployee,
        currentTime: $moment().format('HH:mm'),
        onCancel: onCancel,
        onSave: onSave,
        activities: getActivityByDayAndSchoolId,
        activity: index,
        status: status_id,
        status_name : status_name
    };
    $scope.model = model;


    function onCancel() {
        $uibModalInstance.dismiss('cancel');
    }

    function onSave() {
        let activityAttendance = {
            school_id: schoolId,
            employee_id: selectedEmployee,
            is_absent: parseInt(model.status),
            Event_Name: model.activities[model.activity].event_Nam,
            time_in: model.currentTime,
            Begining_Time: model.activities[model.activity].Begining_Time,
            Ending_Time: model.activities[model.activity].Ending_Time,
            Attendance_Day : selected_date
        }


        employeesAttendanceService.setEmployeeActivityAttendance(activityAttendance, function (result) {
            if (result.success) {
                toastr.success(result.msg);
            } else {
                toastr.error(result.msg);
            }
            $uibModalInstance.close(result);
        });
    }
});

