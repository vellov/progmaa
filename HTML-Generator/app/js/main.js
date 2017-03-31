/**
 * Created by vellovaherpuu on 08/02/15.
 */
var app = angular.module('Generaator', ['ngRoute', 'checklist-model']);

//Controllers
app.controller('MainController', function($scope,$window) {

    $scope.codeTemplates = {
        "button":'app/partials/code-template-button.html',
        "checkbox":'app/partials/code-template-checkbox.html'
    };

    $scope.cssTemplates = [
        {
            name: "Vana (Maalähedane, PA1)",
            template: "app/partials/cssTemplates/old.css"
        },
        {
            name: "Uus (PA2)",
            template: "app/partials/cssTemplates/pa2.css"
        }
    ];

    $scope.question = {
        type: "button",
        answerAmount: '',
        rightAnswer:'',
        question:'',
        buttons:{},
        code:'',
        style: $scope.cssTemplates[0]
    };
    
    $scope.$watch("question.answerAmount", function(newValue,oldValue) {
        $scope.question.buttons={};
        for(var i=1;i<=newValue;i++){
            var newButton={};
            newButton.id=i;
            newButton.name="Vali";
            newButton.answer="";
            newButton.feedback="";
            if($scope.question.type=='checkbox'){
                newButton.feedback='Õige!';
                newButton.wrongFeedback='Vale!'
            }
            $scope.question.buttons[i]=(newButton);
        }
    });
    $scope.openNewWindow=function(){
        var mywind=$window.open();
        mywind.document.write("<pre>");
        mywind.document.write($("#kood").html().replace(/^\s*[\r\n]/gm,''));
        mywind.document.write("</pre>");
    };
    $scope.selectText=function( containerid ) {
        var node = document.getElementById( containerid );
        if ( document.selection ) {
            var range = document.body.createTextRange();
            range.moveToElementText( node  );
            range.select();
        } else if ( window.getSelection ) {
            var range = document.createRange();
            range.selectNodeContents( node );
            window.getSelection().removeAllRanges();
            window.getSelection().addRange( range );
        }
    }

});

app.filter('formatCode', function (){
    return function(input) {
        if(!input) return input;
        var output = input
            //replace possible line breaks.
            .replace(/(\r\n|\r|\n)/g, '\n<br/>')
            .replace(/  /g, "&nbsp;");

        return output;
    };
});

app.config(['$routeProvider', function($routeProvider)  {
    $routeProvider
        .when('/', {
            templateUrl: 'app/partials/avaleht.html',
            controller: 'MainController'
        });
    $routeProvider.otherwise({redirectTo: '/'});
}]);

app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob|data):/);
}]);


app.directive('downloadText', function($compile, $window, $sce){
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link:function($scope, element, attrs, ngModel){
            if (!ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            ngModel.$render = function() {
                element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
            };

            // Listen for change events to enable binding
            element.on('blur keyup change', function() {
                $scope.$evalAsync(read);
            });
            read(); // initialize

            // Write data to the model
            function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if ( attrs.stripBr && html == '<br>' ) {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }


            var button = angular.element('<a ng-href="{{fileUrl}}" download="enesetest" class="btn btn-primary pull-right">Lae alla</a>');

            $scope.updateText = function(){
                var data = element[0].innerText;
                var blob = new Blob([data], { type: 'text/html' });
                var url = $window.URL || $window.webkitURL;
                $scope.fileUrl = url.createObjectURL(blob);
            };
            $scope.$watch(function () {
                return ngModel.$modelValue + element[0].innerText;
            }, function(newValue) {
                $scope.updateText();
            });

            $scope.$on("$destroy", function(){
                button.remove();
            });

            button = $compile(button)($scope);
            element.parent().prepend(button);


        }
    }
});

