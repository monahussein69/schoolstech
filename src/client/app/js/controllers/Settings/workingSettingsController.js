angular.module('MetronicApp').controller('WorkingSettingsController',
    function ( $compile,DTOptionsBuilder, DTColumnBuilder,$q,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,WorkingSettingsService) {

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
            working_settingsObj : {},
            createLectureArray:createLectureArray,
            lectures:[],
            schoolId:schoolId,
            saveWorkingSettings:saveWorkingSettings,
            getProfileSetting:getProfileSetting,
            deleteProfileSetting:deleteProfileSetting,
            activateProfileSetting:activateProfileSetting,
            DeactivateProfileSetting:DeactivateProfileSetting,
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                WorkingSettingsService.getAllSettingsProfiles(schoolId).then(function (profiles) {
                    defer.resolve(profiles);
                });

                return defer.promise
            }) .withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('Profile_Name').withTitle(' الاسم'),
                DTColumnBuilder.newColumn(null).withTitle('العمليات').notSortable()
                    .renderWith(actionsHtml)
            ],
            dtInstance: {},
        };


        $scope.getValue = function(){
            console.log(model.working_settingsObj.Lecture_Rest);
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {
            console.log(data.Profile_Active_status);

        return '<div class="btn-group">'+
                '<button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"> العمليات'+
                '<i class="fa fa-angle-down"></i>'+
                '</button>'+
                '<ul class="dropdown-menu" role="menu">'+
                '<li>'+
                '<a  ng-click="model.getProfileSetting(' + data.Id + ')">'+
                '<i class="icon-pencil"></i>&nbsp; تعديل </a>'+
            '</li>'+
            '<li>'+
            '<a   ng-confirm-click="هل تريد تأكيد حذف الاعداد ؟ " confirmed-click="model.deleteProfileSetting(' + data.Id + ')">' +
            '<i class="fa fa fa-trash-o"></i> &nbsp; حذف</a>'+
            '</li>'+
            '<li class="divider"> </li>'+
            '<li>'+
            '<a ui-sref="Master.scheduleActivity({profileId:{{'+data.Id+'}}})">' +
            ' الفعاليات</span>' +'</a>'+
            '</li>'+
                '<li>'+
        '<a ng-if="!'+data.Profile_Active_status+'"  ng-click="model.activateProfileSetting(' + data.Id + ')">' +
        'تفعيل </a>'+
        '</li>'+
            '<li>'+
        '<a ng-if="'+data.Profile_Active_status+'"  ng-click="model.DeactivateProfileSetting(' + data.Id + ')">' +
        ' الغاء التفعيل' +
            '</a>'+
            '</li>'+
            '</ul>'+
            '</div>';


        }

        $scope.model = model;
        $scope.days=
            ['السبت','الاحد','الاثنين','الثلاثاء','الاربعاء','الخميس','الجمعة'];



        function createLectureArray(){
            var lecture_count = model.working_settingsObj.Max_Lectures;
            if(lecture_count){
                model.lectures = [];
                for (var i=1; i<=lecture_count; i++) {
                    model.lectures.push(i);
                }
            }
        }


        function saveWorkingSettings(type){
            console.log('working');
            console.log( model.working_settingsObj);
            if(type == 'new'){
                model.working_settingsObj.Id = '';
                model.working_settingsObj.Profile_Active_status = 0;
            }
            if (Object.keys(model.working_settingsObj).length) {
                model.working_settingsObj.schoolId = model.schoolId;
                var Day_Begining = model.working_settingsObj.Day_Begining;
                model.working_settingsObj.Day_Begining = Day_Begining.toString();

                var Activity_Day = model.working_settingsObj.Activity_Day;
                model.working_settingsObj.Activity_Day = Activity_Day.toString();

                if( model.working_settingsObj.Activity_Day){
                    model.working_settingsObj.Activity_Period = 1;
                }

                WorkingSettingsService.saveSettingsData(model.working_settingsObj, function (response) {

                    if (response.success) {

                        model.working_settingsObj.Activity_Day = Activity_Day;
                        model.working_settingsObj.Day_Begining = Day_Begining;
                        var resetPaging = true;
                        model.dtInstance.reloadData(response.data, resetPaging);
                        toastr.success(response.msg);
						model.working_settingsObj = {};
                    } else {
                        //model.error = response.msg;
                        toastr.error(response.msg);
                        console.log('error');
                    }
                });

            }
        }

        function getProfileSetting(profileId){

            WorkingSettingsService.getSettingsData(profileId, function (response) {
                model.working_settingsObj = response[0];
                var begining_array =  model.working_settingsObj.Day_Begining;
                var begining_array = begining_array.split(",");
                model.working_settingsObj.Day_Begining = begining_array;
                var activity_array =  model.working_settingsObj.Activity_Day;
                var activity_array = activity_array.split(",");
                model.working_settingsObj.Activity_Day = activity_array;
                createLectureArray();
            });
        }

        function deleteProfileSetting(profileId){
            WorkingSettingsService.deleteSettingProfileData(profileId,model.schoolId, function (response) {
                if (response.success) {
                    model.dtInstance.reloadData(response.rest_data, true);
                    //model.dtInstance.reloadData(response.rest_data, true);
                    toastr.success(response.msg);
                } else {
                    //model.error = response.msg;
                    toastr.error(response.msg);
                    console.log('error');
                }
            });
        }

        function activateProfileSetting(profileId){
            var currentProfile = {};
            WorkingSettingsService.getActiveSettingsData(model.schoolId, function (result) {
                if (Object.keys(result).length) {
                    toastr.error('الرجاء الغاء تفعيل الاعدادات الموجوده');
                }else {
                    WorkingSettingsService.getSettingsData(profileId, function (response) {
                        currentProfile = response[0];
                        console.log(currentProfile);
                        currentProfile.Profile_Active_status = 1;
                        WorkingSettingsService.saveSettingsData(currentProfile, function (response) {
                            if (response.success) {
                                var resetPaging = true;
                                model.dtInstance.reloadData(response.data, resetPaging);
                                toastr.success(response.msg);
                            } else {
                                toastr.error(response.msg);
                            }
                        });
                    });
                }

            });

        }

        function DeactivateProfileSetting(profileId){
            var currentProfile = {};
            WorkingSettingsService.getSettingsData(profileId, function (response) {
                currentProfile = response[0];
                currentProfile.Profile_Active_status = 0;
                WorkingSettingsService.saveSettingsData(currentProfile, function (response) {
                    if (response.success) {
                        var resetPaging = true;
                        model.dtInstance.reloadData(response.data, resetPaging);
                        toastr.success(response.msg);
                    } else {
                        toastr.error(response.msg);
                    }
                });
            });
        }





        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            // App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    }).directive('ngConfirmClick', [
    function () {
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click', function (event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }]);


angular.module('MetronicApp').controller('ActivityScheduleController',
    function (DTColumnDefBuilder,DTOptionsBuilder, DTColumnBuilder,$q,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,WorkingSettingsService) {


        var profileId = $stateParams.profileId;

        var model = {
            profileId:profileId,
            dtColumnDefs: [DTColumnDefBuilder.newColumnDef(0).notSortable()],
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                WorkingSettingsService.getAllActivitySchedual(profileId).then(function (activites) {
                    console.log(activites);
                    defer.resolve(activites);
                });

                return defer.promise
            }).withOption('order', []),
            columns: [
                DTColumnBuilder.newColumn('Day').withTitle(' الاسم'),
                DTColumnBuilder.newColumn('eventtype').withTitle(' نوع الفعاليه').notSortable(),
                DTColumnBuilder.newColumn('event_Nam').withTitle(' اسم الفعاليه').notSortable(),
                DTColumnBuilder.newColumn('Begining_Time_formated').withTitle(' وقت البدايه').notSortable(),
                DTColumnBuilder.newColumn('Ending_Time_formated').withTitle(' وقت الانتهاء').notSortable(),
            ],

            dtInstance: {},
        };
        $scope.model = model;

        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            // App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });