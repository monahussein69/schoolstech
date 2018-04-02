/* Setup general page controller */
angular.module('MetronicApp').controller('AddTaskController',
    function ($moment,$rootScope, $scope, $http, $window, localStorageService,toastr,CommonService,manageEmployeeService) {

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

        var array = [];
        array[0] = 'الاحد';
        array[1] = 'الاثنين';
        array[2] = 'الثلاثاء';
        array[3] = 'الاربعاء';
        array[4] = 'الخميس';
        array[5] = 'الجمعة';
        array[6] = 'السبت';
        var CurrentDate = $moment().format('MM/DD/YYYY');
        var CurrentDay = array[$moment().day()];

    var model={
        taskObj:{},
        popObj:{},
        CurrentDay:CurrentDay,
        employees : [],
        getDay:getDay,
    }
    $scope.model = model;
    model.taskObj.CurrentDate = CurrentDate;
    model.taskObj.Issued_Date = CurrentDate;

        manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
            model.employees = employees;
            $scope.$apply();
        });

    function getDay(){
        if(model.CurrentDate){
            model.CurrentDay = array[$moment(model.CurrentDate).day()];
        }
    }

    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();
        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
});
