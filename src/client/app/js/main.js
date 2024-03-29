/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "LocalStorageModule",
    "ngFileUpload",
    'toastr',
    'kdate',
    'simditor',
    'datatables',
    'mgo-angular-wizard',
    'checklist-model',
    'angular-momentjs',
    'ngSanitize',
    'angularMoment'
]);




MetronicApp.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('MetronicApp')
        //.setStorageType('sessionStorage')
        .setNotify(true, true)
});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
		
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['CommonService','localStorageService', '$scope', '$window', function (CommonService,localStorageService, $scope, $window) {
    $scope.$on('$includeContentLoaded', function () {
        var userObject = localStorageService.get('UserObject');

        if (userObject == null) {
            $window.location.href = '#/login';
        }

        var userType = userObject[0].userType;
        var empId = 0;
        if (userType == 3) {
            empId = userObject[0].employeeData[0].id;
        }

        var unread = 0;
        var model = {username: '',
            unread:unread,
            notifications:[],
            readNotifications:readNotifications,
        };

        $scope.model = model;
        $scope.model.username = userObject[0].loginName;
        $scope.model.empId = empId;
       if(empId){
           CommonService.countUnreadNotifications(empId,function(result){
               model.unread = result.unread;
           });

           CommonService.getUserNotifications(empId,function(result){
               model.notifications = result.notifications;
               console.log(model.notifications);
               angular.forEach(model.notifications, function (value, key) {

               });
           });

           database.ref('notifications/' + empId).orderByChild("notfied").equalTo("false").on('value', function (snapshot) {
               var unread = snapshot.numChildren();
               console.log(unread);
               model.unread = unread;
               console.log(model.unread);
               //$scope.$apply();
               $scope.safeApply();
           });

           database.ref('notifications/' + empId).on('value', function (snapshot) {
               model.notifications = snapshot.val();
              // $scope.$apply();
               $scope.safeApply();
               console.log(model.notifications);
           });
       }



       function readNotifications(){
           database.ref('notifications/'+ model.empId).orderByChild("notfied").equalTo("false").on('value',function(snapshot) {
               if(snapshot.val()){
                   angular.forEach(Object.values(snapshot.val()), function (value,index ) {
                       database.ref('notifications/'+ model.empId+'/'+value.notifiy_id).update({notfied:"true"});
                   });
               }
           });
       }

        $scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };


        Layout.initHeader(); // init header
    });

}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['localStorageService', '$state', '$scope', function (localStorageService, $state, $scope) {

    var userObject = localStorageService.get('UserObject');
    var model = {userType: ''};
    $scope.model = model;
    $scope.model.userType = userObject[0].userType;


    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($state); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {
            QuickSidebar.init(); // init quick sidebar
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);
/*
MetronicApp.controller('LogoutController', ['$scope','$location','$window', function ($scope,$location,$window) {
    $window.localStorage.clear();
    $location.path('/');
}]);
*/


/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/login");

    $stateProvider
        .state('logout', {
            url: "/logout",
            controller: function ($scope, $location, $window, localStorageService) {
                $window.localStorage.clear();
                localStorageService.clearAll();
                $location.path('/login');
            },
        })
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            data: {pageTitle: 'تسجيل الدخول'},
            controller: "LoginController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            // '../assets/global/plugins/morris/morris.css',
                            // '../assets/global/plugins/morris/morris.min.js',
                            // '../assets/global/plugins/morris/raphael-min.js',
                            // '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/jquery-validation/js/additional-methods.min.js',
                            '../assets/pages/css/login-rtl.min.css',
                            '../assets/pages/scripts/login.min.js',

                            // '../assets/pages/scripts/dashboard.min.js',
                            'js/services/EmployeesFactory.js',
                            'js/controllers/LoginController.js',
                        ]
                    });
                }]
            }
        })
        .state('forgetPassword', {
            url: "/forgetPassword",
            templateUrl: "views/forgetPassword.html",
            data: {pageTitle: 'نسيان كلمه المرور'},
            controller: "forgetPasswordController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/jquery-validation/js/additional-methods.min.js',
                            '../assets/pages/css/login-rtl.min.css',
                            '../assets/pages/scripts/login.min.js',
                            'js/services/EmployeesFactory.js',
                            'js/controllers/LoginController.js',
                        ]
                    });
                }]
            }
        })
        .state('Master', {
            abstract: true,
            templateUrl: 'master.html'
        })

        // Dashboard
        .state('Master.dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",
            data: {pageTitle: 'التقويم المدرسي'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            'js/services/manageAppSettingsFactory.js',
                            '../assets/pages/scripts/dashboard.min.js',
                            'js/controllers/DashboardController.js',
							'js/services/SchoolAccountFactory.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.getCalender', {
            url: "/viewCalender.html",
            templateUrl: "views/settings/viewCalender.html",
            data: {pageTitle: 'التقويم المدرسي'},
            controller: "getCalenderController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/pages/scripts/components-date-time-pickers.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            'js/services/manageAppSettingsFactory.js',
                            'js/controllers/Settings/SettingsController.js',
                        ]
                    });
                }]
            }
        })

        // Schools
        .state('Master.schools', {
            url: "/schools.html",
            templateUrl: "views/schools/manageSchools.html",
            data: {pageTitle: 'المدارس'},
            controller: "SchoolsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/SchoolsController.js'
                        ]
                    });
                }
                    //         return QaDashboardService.allOrders(40).then(
                ]
            }
        })
        .state('Master.schoolSchedule', {
            url: "/school-schedule",
            templateUrl: "views/schools/schoolSchedule.html",
            data: {pageTitle: 'المدارس'},
            controller: "SchoolScheduleController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/services/SchoolFactory.js',
                            'js/controllers/SchoolsController.js'
                        ]
                    });
                }
                    //         return QaDashboardService.allOrders(40).then(
                ]
            }
        })

        .state('Master.AddEditSchool', {
            url: "/manageSchool/:schoolId",
            templateUrl: "views/schools/editSchool.html",
            data: {pageTitle: 'المدارس'},
            controller: "ManageSchoolController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/SchoolsController.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.manageSchoolAccount', {
            url: "/manageSchoolAccount/:schoolId",
            templateUrl: "views/schools/schoolAccount.html",
            data: {pageTitle: 'المدارس'},
            controller: "ManageSchoolAccountController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/SchoolsController.js',
                            'js/services/SchoolAccountFactory.js',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/pages/scripts/components-date-time-pickers.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            '../assets/bower_components/moment/moment.js',


                        ]
                    });
                }]
            }
        })

        .state('Master.ManageEmployeesData', {
            url: "/manageEmployees/:schoolId",
            templateUrl: "views/employees/manageEmployees.html",
            data: {pageTitle: 'المدارس'},
            controller: "ManageEmployeesController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/EmployeesController.js',
                            'js/services/EmployeesFactory.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.ManageLeaders&Agents', {
            url: "/manageLeaders",
            templateUrl: "views/employees/leaders&agents.html",
            data: {pageTitle: 'المدارس'},
            controller: "ManageLeader&AgentsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/EmployeesController.js',
                            'js/services/EmployeesFactory.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.ConfigEmployees', {
            url: "/config-employees",
            templateUrl: "views/employees/employees-config.html",
            data: {pageTitle: 'المدارس'},
            controller: "EmployeesConfigController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/EmployeesController.js',
                            'js/services/EmployeesFactory.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.AddEditEmployee', {
            url: "/manageEmployee/:schoolId/:empId",
            templateUrl: "views/employees/editEmployee.html",
            data: {pageTitle: 'المدارس'},
            controller: "ManageEmployeeController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/EmployeesController.js',
                            'js/services/EmployeesFactory.js',
                            'js/services/manageJobTitleFactory.js',
                        ]
                    });
                }]
            }
        })


        .state('Master.appSettings', {
            url: "/appSettings",
            templateUrl: "views/settings/appSettings.html",
            data: {pageTitle: 'المدارس'},
            controller: "appSettingsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/Settings/SettingsController.js',
                            'js/services/manageAppSettingsFactory.js',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/pages/scripts/components-date-time-pickers.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/global/scripts/getDates.js',


                        ]
                    });
                }]
            }
        })
        .state('Master.calenderSettings', {
            url: "/calenderSettings",
            templateUrl: "views/settings/CalenderSettings.html",
            data: {pageTitle: 'المدارس'},
            controller: "calenderSettingsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/Settings/SettingsController.js',
                            'js/services/manageAppSettingsFactory.js',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/pages/scripts/components-date-time-pickers.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/global/scripts/getDates.js',


                        ]
                    });
                }]
            }
        })

        .state('Master.workingSettings', {
            url: "/workingSettings",
            templateUrl: "views/settings/workingSettings.html",
            data: {pageTitle: 'اعدادات الدوام الرسمي'},
            controller: "WorkingSettingsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js',

                            'js/controllers/Settings/workingSettingsController.js',
                            'js/services/WorkingSettingsFactory.js',

                        ]
                    });
                }]
            }
        })


        .state('Master.scheduleActivity', {
            url: "/scheduleActivity/:profileId",
            templateUrl: "views/settings/Activity_schedual.html",
            data: {pageTitle: 'اعدادات الدوام الرسمي'},
            controller: "ActivityScheduleController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/Settings/workingSettingsController.js',
                            'js/services/WorkingSettingsFactory.js',

                        ]
                    });
                }]
            }
        })


        .state('Master.employeesAttendance', {
            url: "/employeeAttendance/:schoolId",
            templateUrl: "views/employees_attendance/attendance.html",
            data: {pageTitle: 'سجل الدوام الرسمي'},
            controller: "employeesAttendanceController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js',

                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',

                            'js/controllers/EmployeesAttendance/employeesAttendanceController.js',
                            'js/services/employeesAttendanceFactory.js',
                            'js/services/employeesExcuseFactory.js',
                            'js/services/employeesAbsentFactory.js',
                            'js/services/ExcuseTypesFactory.js',
                            'js/services/WorkingSettingsFactory.js',
                            'js/services/EmployeesFactory.js',
                            '../assets/bower_components/moment/moment.js',

                        ]
                    });
                }]
            }
        })


        .state('Master.studentAttendance', {
            url: "/studentAttendance",
            templateUrl: "views/students_attendance/activityAttendance.html",
            data: {pageTitle: 'سجل الدوام الرسمي'},
            controller: "activityAttendanceController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js',

                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',

                            'js/controllers/studentsAttendance/activityAttendanceController.js',

                            'js/services/EmployeesFactory.js',
                            'js/services/studentsAttendanceFactory.js',
                            'js/services/studentExcuseFactory.js',
                            '../assets/bower_components/moment/moment.js',

                        ]
                    });
                }]
            }
        })

        .state('Master.employeesActivityAttendance', {
            url: "/employeesActivityAttendance/:schoolId",
            templateUrl: "views/employees_attendance/activityAttendance.html",
            data: {pageTitle: 'سجل الدوام الرسمي'},
            controller: "employeeActivityAttendanceController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js',

                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',

                            'js/controllers/EmployeesAttendance/employeeActivityAttendanceController.js',
                            'js/services/employeesAttendanceFactory.js',
                            'js/services/WorkingSettingsFactory.js',
                            'js/services/EmployeesFactory.js',
                            '../assets/bower_components/moment/moment.js',

                        ]
                    });
                }]
            }
        })

        .state('Master.employeeLateRecord', {
            url: "/employeeLateRecord/:employeeId",
            templateUrl: "views/employees_attendance/lateRecords.html",
            data: {pageTitle: 'سجل الدوام الرسمي'},
            controller: "employeeAttendanceLateRecordController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/EmployeesAttendance/employeeAttendanceRecordsController.js',
                            'js/services/employeesAttendanceRecordsFactory.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.employeeAbsentRecord', {
            url: "/employeeAbsentRecord/:employeeId",
            templateUrl: "views/employees_attendance/absentRecords.html",
            data: {pageTitle: 'سجل الدوام الرسمي'},
            controller: "employeeAttendanceAbsentRecordController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/EmployeesAttendance/employeeAttendanceRecordsController.js',
                            'js/services/employeesAttendanceRecordsFactory.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.employeeExcuseRecord', {
            url: "/employeeExcuseRecord/:employeeId",
            templateUrl: "views/employees_attendance/ExcuseRecord.html",
            data: {pageTitle: 'سجل الدوام الرسمي'},
            controller: "employeeAttendanceExecuseRecordController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/EmployeesAttendance/employeeExecuseRecordsController.js',
                            'js/services/employeesAttendanceRecordsFactory.js',
                        ]
                    });
                }]
            }
        })


            .state('Master.studentExcuseRecord', {
            url: "/studentExcuseRecord/:studentId",
            templateUrl: "views/students/ExcuseRecord.html",
            data: {pageTitle: 'سجل الدوام الرسمي'},
            controller: "studentExecuseRecordsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/students/studentRecordsController.js',
                            'js/services/studentRecordsFactory.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.studentLateRecord', {
            url: "/studentLateRecord/:studentId",
            templateUrl: "views/students/LateRecord.html",
            data: {pageTitle: 'سجل الدوام الرسمي'},
            controller: "studentLateRecordsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/students/studentRecordsController.js',
                            'js/services/studentRecordsFactory.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.studentAbsentRecord', {
            url: "/studentAbsentRecord/:studentId",
            templateUrl: "views/students/AbsentRecord.html",
            data: {pageTitle: 'سجل الدوام الرسمي'},
            controller: "studentAbsentRecordsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/students/studentRecordsController.js',
                            'js/services/studentRecordsFactory.js',
                        ]
                    });
                }]
            }
        })


        .state('Master.ManageJobTitles', {
            url: "/manageJobTitles",
            templateUrl: "views/settings/jobTitleSettings.html",
            data: {pageTitle: 'المدارس'},
            controller: "jobTitelSettingsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/Settings/jobTitleSettingController.js',
                            'js/services/manageJobTitleFactory.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.ManageSubJobTitles', {
            url: "/manageSubJobTitles/:jobTitleId",
            templateUrl: "views/settings/subJobTitlesSettings.html",
            data: {pageTitle: 'المسميات الوظيفيه الفرعيه'},
            controller: "subJobTitleSettingsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/Settings/subJobTitleSettingController.js',
                            'js/services/manageSubJobTitleFactory.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.students', {
            url: "/students",
            templateUrl: "views/students/students.html",
            data: {pageTitle: 'الطلاب'},
            controller: "StudentsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/students/StudentsController.js',
                            'js/services/StudentsService.js'
                        ]
                    });
                }]
            }
        })

        .state('Master.actions', {
            url: "/actions",
            templateUrl: "views/actions/actions.html",
            data: {pageTitle: 'كشف المسائلات'},
            controller: "ActionsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/Actions/actionsController.js',
                            'js/services/ActionsService.js',
                            'js/services/EmployeesFactory.js'
                        ]
                    });
                }]
            }
        })
        .state('Master.requests', {
            url: "/requests",
            templateUrl: "views/requests/requests.html",
            data: {pageTitle: 'الطلبات'},
            controller: "RequestsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/requests/RequestsController.js',
                            'js/services/RequestsService.js'
                        ]
                    });
                }]
            }
        })
        .state('Master.ManageRequests', {
            url: "/ManageRequests",
            templateUrl: "views/requests/editRequests.html",
            data: {pageTitle: 'ادارة الطلبات'},
            controller: "ManageRequestsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/requests/RequestsController.js',
                            'js/services/RequestsService.js'
                        ]
                    });
                }]
            }
        })

        .state('Master.studentsDegrees', {
            url: "/studentsDegrees",
            templateUrl: "views/students/studentsDegrees.html",
            data: {pageTitle: 'كشف رصد درجات الطلاب'},
            controller: "StudentsDegreesController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/students/StudentsController.js',
                            'js/services/StudentsService.js',
                            'js/services/manageJobTitleFactory.js',
                        ]
                    });
                }]
            }
        })
        .state('Master.studentsLate', {
            url: "/students-attendance-records",
            templateUrl: "views/students/studentsLate.html",
            data: {pageTitle: 'كشف رصد درجات الطلاب'},
            controller: "StudentsLateController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/students/StudentsController.js',
                            'js/services/StudentsService.js',
                            'js/services/EmployeesFactory.js',
                            'js/services/studentsAttendanceFactory.js'
                        ]
                    });
                }],
            }
        })
        .state('Master.studentsAbsent', {
            url: "/studentsAbsent",
            templateUrl: "views/students/studentsAbsent.html",
            data: {pageTitle: 'كشف رصد درجات الطلاب'},
            controller: "StudentsAbsentController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/students/StudentsController.js',
                            'js/services/StudentsService.js'
                        ]
                    });
                }]
            }
        })
        .state('Master.editStudent', {
            url: "/edit-student/:studentId",
            templateUrl: "views/students/editStudent.html",
            data: {pageTitle: "الطلاب"},
            controller: "ManageStudentsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/StudentsController.js',
                            'js/services/StudentsService.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.tasks', {
            url: "/Tasks",
            templateUrl: "views/tasks/tasks.html",
            data: {pageTitle: ' اداره المهام'},
            controller: "ManageTaskController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/Tasks/TasksController.js',
                            '../assets/bower_components/moment/moment.js',
                            'js/services/taskFactory.js',
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.addTask', {
            url: "/addTask/:taskId",
            templateUrl: "views/tasks/addTask.html",
            data: {pageTitle: 'اضافة مهمه'},
            controller: "AddTaskController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            '../assets/pages/scripts/components-date-time-pickers.min.js',


                            'js/controllers/Tasks/TasksController.js',
                            '../assets/bower_components/moment/moment.js',
                            'js/services/taskStatusFactory.js',
                            'js/services/EmployeesFactory.js',
                            'js/services/taskFactory.js',

                        ]
                    });
                }]
            }
        })


        .state('Master.addTaskMember', {
            url: "/addTaskMember/:taskId/:subTaskId",
            templateUrl: "views/tasks/addTaskMemeber.html",
            data: {pageTitle: 'اضافة فريق العمل'},
            controller: "TaskMembersController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            '../assets/pages/scripts/components-date-time-pickers.min.js',

                            'js/controllers/Tasks/TasksController.js',
                            '../assets/bower_components/moment/moment.js',
                            'js/services/taskStatusFactory.js',
                            'js/services/EmployeesFactory.js',
                            'js/services/employeesAttendanceFactory.js',
                            'js/services/taskFactory.js',
                            'js/services/subTaskFactory.js',

                        ]
                    });
                }]
            }
        })

        .state('Master.subTasks', {
            url: "/subTasks/:taskId",
            templateUrl: "views/tasks/subTasks.html",
            data: {pageTitle: ' اداره المهام'},
            controller: "ManageSubTaskController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/Tasks/TasksController.js',
                            '../assets/bower_components/moment/moment.js',
                            'js/services/subTaskFactory.js',
                            'js/services/studentTaskFactory.js',
                            'js/services/taskFactory.js',
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.myTasks', {
            url: "/myTasks",
            templateUrl: "views/tasks/subTasks.html",
            data: {pageTitle: ' اداره المهام'},
            controller: "ManageSubTaskController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/Tasks/TasksController.js',
                            '../assets/bower_components/moment/moment.js',
                            'js/services/subTaskFactory.js',
                            'js/services/studentTaskFactory.js',
                            'js/services/taskFactory.js',
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.addTaskStudents', {
            url: "/addTaskStudents/:subTaskId/:taskId",
            templateUrl: "views/tasks/addTaskStudent.html",
            data: {pageTitle: ' اداره مهام الطلاب'},
            controller: "addTaskStudentsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/Tasks/TasksController.js',
                            'js/services/StudentsService.js',
                            'js/services/studentTaskFactory.js',
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.manageTaskStatus', {
            url: "/manageTaskStatus",
            templateUrl: "views/settings/taskStatus.html",
            data: {pageTitle: ' اداره حاله المهمه'},
            controller: "taskStatusSettingsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/Settings/taskStatusSettingsController.js',
                            'js/services/taskStatusFactory.js',
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.manageVacationTypes', {
            url: "/manageVacationTypes",
            templateUrl: "views/settings/VacationType.html",
            data: {pageTitle: ' اداره انواع الاجازات'},
            controller: "vacationTypesSettingsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/Settings/vacationTypesSettingsController.js',
                            'js/services/VacationTypesFactory.js',
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.manageRequestsType', {
            url: "/manageRequestsType",
            templateUrl: "views/settings/RequestsType.html",
            data: {pageTitle: ' اداره انواع الاجازات'},
            controller: "RequestsTypeSettingsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/Settings/RequestsTypeSettingsController.js',
                            'js/services/RequestsTypeFactory.js',
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.manageExcuseType', {
            url: "/manageExcuseType",
            templateUrl: "views/settings/ExcuseTypes.html",
            data: {pageTitle: ' اداره انواع الاعذار'},
            controller: "ExcuseTypesSettingsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/Settings/ExcuseTypesSettingsController.js',
                            'js/services/ExcuseTypesFactory.js',
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                        ]
                    });
                }]
            }
        })

        .state('Master.Attention', {
            url: "/lateAttention",
            templateUrl: "views/actions/lateAction.html",
            data: {pageTitle: 'تنبيه على تأخر/ انصراف'},
            controller: "actionsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/Actions/actionsController.js'
                        ]
                    });
                }]
            }
        })

        // Blank Page
        .state('Master.blank', {
            url: "/blank",
            templateUrl: "views/blank.html",
            data: {pageTitle: 'Blank Page Template'},
            controller: "BlankController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/BlankController.js'
                        ]
                    });
                }]
            }
        })

        // AngularJS plugins
        .state('Master.fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ]
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('Master.uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ]
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/UISelectController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('Master.uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Tree View
        .state('Master.tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {pageTitle: 'jQuery Tree View'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            '../assets/global/plugins/jstree/dist/jstree.min.js',
                            '../assets/pages/scripts/ui-tree.min.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Form Tools
        .state('Master.formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {pageTitle: 'Form Tools'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/global/plugins/bootstrap-switch/css/bootstrap-switch-rtl.min.css',
                            '../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../assets/global/plugins/typeahead/typeahead.css',

                            '../assets/global/plugins/fuelux/js/spinner.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '../assets/global/plugins/typeahead/handlebars.min.js',
                            '../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            '../assets/pages/scripts/components-form-tools-2.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Date & Time Pickers
        .state('Master.pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {pageTitle: 'Date & Time Pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Custom Dropdowns
        .state('Master.dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-select/css/bootstrap-select-rtl.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/pages/scripts/components-bootstrap-select.min.js',
                            '../assets/pages/scripts/components-select2.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Advanced Datatables
        .state('Master.datatablesmanaged', {
            url: "/datatables/managed.html",
            templateUrl: "views/datatables/managed.html",
            data: {pageTitle: 'Advanced Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            '../assets/pages/scripts/table-datatables-managed.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('Master.datatablesajax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap-rtl.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/scripts/datatable.js',

                            'js/scripts/table-ajax.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("Master.profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/pages/css/profile-rtl.css',

                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/pages/scripts/profile.min.js',

                            'js/controllers/UserProfileController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help'}
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2-rtl.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/controllers/TodoController.js'
                        ]
                    });
                }]
            }
        })

}]);

MetronicApp.value('angularMomentConfig', {
    timezone: 'Asia/Gaza' // e.g. 'Europe/London'
});

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state","$moment", function ($rootScope, settings, $state,$moment) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
	
}]);