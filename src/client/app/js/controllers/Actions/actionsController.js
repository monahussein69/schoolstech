/* Setup general page controller */
angular.module('MetronicApp').controller('ActionsController', ['$rootScope', '$compile', '$scope', 'localStorageService', 'ActionsService', 'DTOptionsBuilder', 'DTColumnBuilder', 'manageEmployeeService', '$q', '$uibModal', 'toastr', function ($rootScope, $compile, $scope, localStorageService, ActionsService, DTOptionsBuilder, DTColumnBuilder, manageEmployeeService, $q, $uibModal, toastr) {

    var userObject = localStorageService.get('UserObject');
    console.log(userObject);
    var model = {
        actions: {},
        options: DTOptionsBuilder.fromFnPromise(function () {
            var defer = $q.defer();
            console.log("actions ");
            if (userObject[0].userType == 3) {
                let id = userObject[0].id;
                ActionsService.getEmployeeActions(id, function (actions) {
                    model.actions = actions;
                    defer.resolve(actions);
                });
            } else if (userObject[0].userType == 2) {
                let id = userObject[0].schoolId;
                ActionsService.getSchoolActions(id, function (actions) {
                    model.actions = actions;
                    defer.resolve(actions);
                });
            }
            return defer.promise
        }).withOption('createdRow', createdRow),
        columns: [
            DTColumnBuilder.newColumn('action_name').withTitle('اسم المسائلة').withOption('defaultContent', 'غير مدخل'),
            DTColumnBuilder.newColumn('ACTION_Status').withTitle('الحالة').withOption('defaultContent', 'غير مدخل'),
            DTColumnBuilder.newColumn('ACTION_body').withTitle('نص المسائلة'),
            DTColumnBuilder.newColumn('issue_date').withTitle('تاريخ المسائلة').withOption('defaultContent', 'غير مدخل'),
            DTColumnBuilder.newColumn('action_reply').withTitle('رد علي المسائلة').withOption('defaultContent', 'لم يتم الرد'),
            DTColumnBuilder.newColumn(null).withTitle('العمليات').notSortable()
                .renderWith(actionsHtml)
        ],
        dtInstance: {},
        actionReply: actionReply,
        actionBody: actionBody,
        doAction: doAction
    }

    $scope.model = model;

    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);

    }

    function actionsHtml(data, type, full, meta) {
        if (userObject[0].userType == 2) {
            if (data.action_reply) {
                if (data.ACTION_Status == "مقبول") {
                    return '' + '<button class="btn btn-danger" ng-click="model.doAction(\'مرفوض\' ,' + data.id + ')"> رفض </button>';
                } else if (data.ACTION_Status == "مرفوض") {
                    return '' + '<button class="btn btn-primary" ng-click="model.doAction(\'مقبول\' , ' + data.id + ')"> قبول  </button>'
                } else {
                    return '' + '<button class="btn btn-primary" ng-click="model.doAction(\'مقبول\' , ' + data.id + ')"> قبول  </button>'
                        + '<button class="btn btn-danger" ng-click="model.doAction(\'مرفوض\' ,' + data.id + ')"> رفض </button>'
                }
            } else {
                return '';
            }
        }

        else if (userObject[0].userType == 3) {
            return '' + '<button class="btn btn-warning" ng-click="model.actionReply(' + data.id + ')"> رد علي المسائلة</button>'

        }
    }

    function actionsHtml2(data, type, full, meta) {
        return '' + '<button class="btn btn-info" ng-click="model.actionBody("' + data + ')"> نص المسائلة  </button>'
    }

    function doAction(status, id) {
        console.log(status);
        console.log(id);
        ActionsService.doAction(status, id, function (result) {
            if (result.success) {
                model.dtInstance.reloadData();
                toastr.success(result.msg);
            } else {
                toastr.error(result.msg);
            }

        });
    }




    function actionReply(actionId) {
        console.log("actuin Reply", actionId);
        var dialogInst = $uibModal.open({
            templateUrl: 'views/actions/actionReplyPopup.html',
            controller: 'ActionsReplyPopup',
            size: 'md',
            resolve: {
                actionId: function () {
                    return actionId;
                },
            }
        });
        dialogInst.result.then(function (result) {
            if (result.success) {
                model.getAttendanceBasedDate();
                angular.element($event.target).removeClass('color-grey');
                angular.element($event.target).parent().children('.excuse').attr('disabled', true);
            }
        }, function () {
            console.log('close');
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }

    function actionBody(actionBody) {
        console.log("actuin Reply", actionBody);
        var dialogInst = $uibModal.open({
            templateUrl: 'views/actions/actionBodyPopup.html',
            controller: 'ActionsBodyPopup',
            size: 'md',
            resolve: {
                actionBody: function () {
                    return actionBody;
                },
            }
        });
        dialogInst.result.then(function (result) {
            if (result.success) {
                model.getAttendanceBasedDate();
                angular.element($event.target).removeClass('color-grey');
                angular.element($event.target).parent().children('.excuse').attr('disabled', true);
            }
        }, function () {
            console.log('close');
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }


}

])
;

angular.module('MetronicApp').controller('ActionsReplyPopup', ['$scope', 'ActionsService', 'actionId', '$uibModalInstance', 'toastr', function ($scope, ActionsService, actionId, $uibModalInstance, toastr) {
    var model = {
        onCancel: onCancel,
        onSave: onSave,
        actionReply: ''
    };
    $scope.model = model;

    function onCancel() {
        $uibModalInstance.dismiss('cancel');
    }

    function onSave() {
        let actionReply = {
            Id: actionId,
            action_reply: model.actionReply
        };

        console.log(actionReply);
        ActionsService.setActionReply(actionReply, function (result) {
            if (result.success) {
                toastr.success(result.msg);
            } else {
                toastr.error(result.msg);
            }
            $uibModalInstance.close();
        });
    }
}]);


angular.module('MetronicApp').controller('ActionsBodyPopup', ['$scope', 'ActionsService', 'actionBody', '$uibModalInstance', 'toastr', function ($scope, ActionsService, actionBody, $uibModalInstance, toastr) {
    var model = {
        onCancel: onCancel,
        actionBody: actionBody
    };
    $scope.model = model;

    function onCancel() {
        $uibModalInstance.dismiss('cancel');
    }
}]);

