/**
 * Created by vellovaherpuu on 08/02/15.
 */
var app = angular.module('Generaator', ['ngRoute']);

//Controllers
app.controller('MainController', function($scope,$window) {
    $scope.question = {
        type: "button",
        answerAmount: '',
        rightAnswer:'',
        question:'',
        buttons:{},
        code:''
    };
    $scope.$watch("question.answerAmount", function(newValue,oldValue) {
        $scope.question.buttons={};
        for(var i=1;i<=newValue;i++){
            var newButton={};
            newButton.id=i;
            newButton.name="Vali";
            newButton.answer="";
            newButton.feedback="";
            $scope.question.buttons[i]=(newButton);
        }
    });
    $scope.openNewWindow=function(){
        console.log($("#kood").html());
        var mywind=$window.open();
        mywind.document.write("<pre>");
        mywind.document.write($("#kood").html().replace(/^\s*[\r\n]/gm,''));
        mywind.document.write("</pre>");
    };
    $scope.selectText=function( containerid ) {
        var node = document.getElementById( containerid );
        console.log(containerid);
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
