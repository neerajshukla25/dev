const $ = require('jquery');
require('jstree');
const nodePath = require('path');
$(document).ready(function(){
     let curPath = process.cwd();
     console.log(curPath);
     console.log(getName(curPath));
     let data = [];
     let baseobj = {
         id : curPath,
         parent : "#",
         text : getName(curPath)
     };
     data.push(baseobj);
     $('#file-explorer').jstree({
         "core" : {
             "data" : data
         }
     })
})

function getName(path){
 return nodePath.basename(path);
}