angular.module('MetronicApp').controller('employeeActivityAttendanceController',
    function ($compile,DTOptionsBuilder, DTColumnBuilder,$q,$uibModal,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,employeesAttendanceService,manageEmployeeService,WorkingSettingsService) {

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

        var model = {
            schoolId:schoolId,
            emp_atts:[],
            getAllEmployeesByActivity:getAllEmployeesByActivity,
            activeProfile : {},
            employeeActivity: employeeActivity,
            listOfActivity: {},
            activity:'',
            options:DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
                    defer.resolve(employees);
                    model.employees = employees;
                });

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
                '<button class="btn btn-primary" ng-click="model.employeeActivity('+data.id+')">تسجيل الحاله</button>'
                ;
        }

        function getAllEmployeesByActivity(){
            manageEmployeeService.getAllEmployeesByActivity(schoolId,model.activity,function (result) {
                var resetPaging = true;
                model.dtInstance.reloadData(result, resetPaging);
                model.emp_atts = result;
            });
        }

        employeesAttendanceService.getActivityByDayAndSchoolId(model.schoolId, function (data) {
            model.listOfActivity = data;
        });


        $scope.model = model;




        function employeeActivity(employee_id) {
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
                    getActivityByDayAndSchoolId: function () {
                        return model.listOfActivity;
                    }
                }
            });
            dialogInst.result.then(function (newusr) {
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



angular.module('MetronicApp').controller('EmployeeActivityPopupCtrl', function (toastr, employeesAttendanceService, $moment, $scope, $uibModalInstance, selectedEmployee,selectedActivity, schoolId, $log, getActivityByDayAndSchoolId) {
    var model = {
        selectedEmployee: selectedEmployee,
        currentTime: $moment().format('HH:mm'),
        onCancel: onCancel,
        onSave: onSave,
        activities: getActivityByDayAndSchoolId,
        activity: selectedActivity,
        status: ''
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
            Ending_Time: model.activities[model.activity].Ending_Time
        }


        employeesAttendanceService.setEmployeeActivityAttendance(activityAttendance, function (result) {
            if (result.success) {
                toastr.success(result.msg);
            } else {
                toastr.error(result.msg);
            }
            $uibModalInstance.close();
        });
    }
});

