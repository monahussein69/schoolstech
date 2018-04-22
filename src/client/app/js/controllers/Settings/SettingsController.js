angular.module('MetronicApp').controller('appSettingsController',
    function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, manageAppSettingsService, toastr, $filter) {
        var model = {
            appSettingsObj: {},
            saveAppSettings: saveAppSettings,
            error: null,
            uploadPhoto: uploadPhoto,
            getAppSettings: getAppSettings,
        };
        $scope.model = model;
        model.getAppSettings();

        function getAppSettings() {
            manageAppSettingsService.getappSettingsData(function (response) {
                if (response.success) {
                    model.appSettingsObj = response.data[0];
                    model.appSettingsObj.start_f_year = moment.unix(model.appSettingsObj.start_f_year).format('YYYY-MM-DD');
                    model.appSettingsObj.end_f_year = moment.unix(model.appSettingsObj.end_f_year).format('YYYY-MM-DD');
                }
            });
        }


        function saveAppSettings() {
            // if (Object.keys(model.appSettingsObj).length) {
            model.appSettingsObj.start_f_year = moment(model.appSettingsObj.start_f_year).unix();
            model.appSettingsObj.end_f_year = moment(model.appSettingsObj.end_f_year).unix();

            manageAppSettingsService.saveAppSettingsData(model.appSettingsObj, function (response) {
                if (response.success) {
                    toastr.success(response.msg);
                    if (response.ministry_logo) {
                        model.appSettingsObj.ministry_logo = response.ministry_logo;
                    }
                    if (response.vision_logo) {
                        model.appSettingsObj.ministry_logo = response.vision_logo;
                    }

                    model.getAppSettings();
                } else {
                    //model.error = response.msg;
                    toastr.error(response.msg);
                    console.log('error');
                }
            });

            // }

        }

        function uploadPhoto(file, name) {
            manageAppSettingsService.uploadPhoto(file).then(function (photo) {
                model.appSettingsObj[name] = photo;

                $scope.$apply();
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
    });



angular.module('MetronicApp').controller('calenderSettingsController',
    function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, manageAppSettingsService, toastr, $filter) {
        var model = {
            appSettingsObj: {},
            saveAppSettings: saveAppSettings,
            error: null,
            uploadPhoto: uploadPhoto,
            getAppSettings: getAppSettings,
            saveCalender: saveCalender
        };
        $scope.model = model;
        model.getAppSettings();

        function getAppSettings() {
            manageAppSettingsService.getappSettingsData(function (response) {
                if (response.success) {
                    model.appSettingsObj = response.data[0];
                    model.appSettingsObj.academic_start_date = moment.unix(model.appSettingsObj.academic_start_date).format('YYYY-MM-DD');
                    model.appSettingsObj.academic_end_date = moment.unix(model.appSettingsObj.academic_end_date).format('YYYY-MM-DD');
                    model.appSettingsObj.first_term_start_date = moment.unix(model.appSettingsObj.first_term_start_date).format('YYYY-MM-DD');
                    model.appSettingsObj.first_term_end_date = moment.unix(model.appSettingsObj.first_term_end_date).format('YYYY-MM-DD');
                    model.appSettingsObj.second_term_start_date = moment.unix(model.appSettingsObj.second_term_start_date).format('YYYY-MM-DD');
                    model.appSettingsObj.second_term_end_date = moment.unix(model.appSettingsObj.second_term_end_date).format('YYYY-MM-DD');
                    model.appSettingsObj.summer_term_start_date = moment.unix(model.appSettingsObj.summer_term_start_date).format('YYYY-MM-DD');
                    model.appSettingsObj.summer_term_end_date = moment.unix(model.appSettingsObj.summer_term_end_date).format('YYYY-MM-DD');
                }
            });
        }


        function saveAppSettings() {
            // if (Object.keys(model.appSettingsObj).length) {
            model.appSettingsObj.academic_start_date = moment(model.appSettingsObj.academic_start_date).unix();
            model.appSettingsObj.academic_end_date = moment(model.appSettingsObj.academic_end_date).unix();
            model.appSettingsObj.first_term_start_date = moment(model.appSettingsObj.first_term_start_date).unix();
            model.appSettingsObj.first_term_end_date = moment(model.appSettingsObj.first_term_end_date).unix();
            model.appSettingsObj.second_term_start_date = moment(model.appSettingsObj.second_term_start_date).unix();
            model.appSettingsObj.second_term_end_date = moment(model.appSettingsObj.second_term_end_date).unix();
            model.appSettingsObj.summer_term_start_date = moment(model.appSettingsObj.summer_term_start_date).unix();
            model.appSettingsObj.summer_term_end_date = moment(model.appSettingsObj.summer_term_end_date).unix();
            console.log('after settings : ', model.appSettingsObj);
            manageAppSettingsService.saveAppSettingsData(model.appSettingsObj, function (response) {
                if (response.success) {
                    toastr.success(response.msg);
                    if (response.ministry_logo) {
                        model.appSettingsObj.ministry_logo = response.ministry_logo;
                    }
                    if (response.vision_logo) {
                        model.appSettingsObj.ministry_logo = response.vision_logo;
                    }
                    var first_date = "";
                    var end_date = "";
                    if (model.appSettingsObj.active_term == 'first') {
                        model.appSettingsObj.first_term_start_date = moment.unix(model.appSettingsObj.first_term_start_date).format('YYYY-MM-DD');
                        model.appSettingsObj.first_term_end_date = moment.unix(model.appSettingsObj.first_term_end_date).format('YYYY-MM-DD');
                        first_date = model.appSettingsObj.first_term_start_date;
                        end_date = model.appSettingsObj.first_term_end_date;
                    } else if (model.appSettingsObj.active_term == 'second') {
                        model.appSettingsObj.second_term_start_date = moment.unix(model.appSettingsObj.second_term_start_date).format('YYYY-MM-DD');
                        model.appSettingsObj.second_term_end_date = moment.unix(model.appSettingsObj.second_term_end_date).format('YYYY-MM-DD');
                        first_date = model.appSettingsObj.second_term_start_date;
                        end_date = model.appSettingsObj.second_term_end_date;
                    } else if (model.appSettingsObj.active_term == 'summer') {
                        model.appSettingsObj.summer_term_start_date = moment.unix(model.appSettingsObj.summer_term_start_date).format('YYYY-MM-DD');
                        model.appSettingsObj.summer_term_end_date = moment.unix(model.appSettingsObj.summer_term_end_date).format('YYYY-MM-DD');
                        first_date = model.appSettingsObj.summer_term_start_date;
                        end_date = model.appSettingsObj.summer_term_end_date;
                    }
                    model.saveCalender(first_date, end_date, model.appSettingsObj.active_term);
                    model.getAppSettings();
                } else {
                    //model.error = response.msg;
                    toastr.error(response.msg);
                    console.log('error');
                }
            });

            // }

        }

        function uploadPhoto(file, name) {
            manageAppSettingsService.uploadPhoto(file).then(function (photo) {
                model.appSettingsObj[name] = photo;

                $scope.$apply();
            });
        }

        function getArabicDay(dayNo) {
            var array = [];
            array[0] = 'الاحد';
            array[1] = 'الاثنين';
            array[2] = 'الثلاثاء';
            array[3] = 'الاربعاء';
            array[4] = 'الخميس';
            array[5] = 'الجمعة';
            array[6] = 'السبت';

            return array[dayNo];
        }

        function getArabicWeeksName(weekNo) {
            var array = [];

            array[1] = 'الاول';
            array[2] = 'الثاني';
            array[3] = 'الثالث';
            array[4] = 'الرابع';
            array[5] = 'الخامس';
            array[6] = 'السادس';
            array[7] = 'السابع';
            array[8] = 'الثامن';
            array[9] = 'التاسع';
            array[10] = 'العاشر';
            array[11] = 'الحادي عشر';
            array[12] = 'الثاني عشر';
            array[13] = 'الثالث عشر';
            array[14] = 'الرابع عشر';
            array[15] = 'الخامس عشر';
            array[16] = 'السادس عشر';
            array[17] = 'السابع عشر';
            array[18] = 'الثامن عشر';
            array[19] = 'التاسع عشر';
            array[20] = 'العشرين';
            array[21] = 'الواحد والعشرين';
            array[22] = 'الثاني والعشرين';
            array[23] = 'الثالث والعشرين';

            return array[weekNo];
        }

        function saveCalender(start_date, end_date, term_id) {
            console.log('start_date');
            console.log(start_date);
            console.log('end_date');
            console.log(end_date);
            console.log('term_id');
            console.log(term_id);
            var dates = getDates(new Date(start_date), new Date(end_date));
            var counter = 1;
            var calenderDataArray = [];
            var calenderData = [];


            dates.forEach(function (date) {
                if(date.getDay() !== 5 && date.getDay() !== 6) {
                    calenderData = [
                        moment(date).format('YYYY'),
                        term_id,
                        counter,
                        getArabicWeeksName(counter),
                        getArabicDay(date.getDay()),
                        moment(date).format('MM-DD-YYYY')
                    ];
                    calenderDataArray.push(calenderData);
                }
                if (date.getDay() == 6) {
                    counter++;
                }
            });
            console.log('calenderDataArray : ',calenderDataArray);
            manageAppSettingsService.saveCalender(calenderDataArray);
        }


        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            // App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });


angular.module('MetronicApp').controller('getCalenderController',
    function ($moment,$stateParams, $rootScope, $scope, $http, $window, localStorageService, manageAppSettingsService, toastr, $filter) {
        var model = {
            calender:[],
            getCalender:getCalender,
            Term_Id:'',
            first_Academic_Year:'',
            end_Academic_Year:'',
            Academic_Year:''
        };

        $scope.model = model;
        manageAppSettingsService.getappSettingsData(function(result){
            model.first_Academic_Year = $moment.unix(result.data[0].academic_start_date).format('YYYY');
            model.end_Academic_Year = $moment.unix(result.data[0].academic_end_date).format('YYYY');
            console.log(model.first_Academic_Year);
            console.log(model.end_Academic_Year);
            model.Term_Id  =  result.data[0].active_term;
            getCalender();
        });

        function getCalender(){
            if(model.Academic_Year) {
                model.first_Academic_Year = model.Academic_Year;
                model.end_Academic_Year = model.Academic_Year;
            }
            manageAppSettingsService.getCalender(model.first_Academic_Year,model.end_Academic_Year,model.Term_Id,function (response) {
                var days = [];
                var weeks = [];
                model.calender = response.data;

                response.data.forEach(function (item, day_index) {
                    if(!weeks.includes(item.Week_Name)){
                        weeks.push(item.Week_Name);
                    }
                });

                $scope.weeks = weeks;
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
    });