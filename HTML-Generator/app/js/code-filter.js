/**
 * Created by vellovaherpuu on 31/03/2017.
 */
var app = angular.module("Generaator");

app.filter("codeFilter", function() {
   return function(input) {
       var re = /\[c\](.*?)\[\/c]/g; // [c] content [/c]
       var result;

       while (result = re.exec(input)) {
           var matched = result[0];
           var content = result[1];
           content = "<span class='text-code'> " + content + "</span>";
           input = input.replace(matched, content);
       }

       return input;

   }
});