const $ = require("jquery");
const fs = require("fs");
const dialog = require("electron").remote.dialog;
$(document).ready(function(){
 let db;
 let lsc;
}) 
$("#grid .cell").on("click",function(){
    let {colId,rowId} = getrc(this);
    let value = String.fromCodePoint(65+colId)+(rowId+1);
    console.log(value);
    let cellObject = db[rowId][colId];
    $("#adress-input").val(value);
})
//val=>val or formula => value
$("#grid .cell").on("blur",function(){
    let {colId,rowId} = getrc(this);
    let cellObject = db[rowId][colId];
    lsc = this;
    if(cellObject.value == $(this).html()){
        return;
    }
    if(cellObject.formula){
        rmusnds(cellObject,this);
    }
    //update value in db
    cellObject.value = $(this).text();
    updateCell(rowId,colId,cellObject.value); 
})

//formula => formula or value =>formula
$("#formula-input").on("blur",function(){
    let cellObject = getcell(lsc);
    if(cellObject.formula == $(this).val()){
        return;
    }
    if(cellObject.formula){
        rmusnds(cellObject,lsc);
    }
    cellObject.formula = $(this).val();
    setusnds(lsc,cellObject.formula);
    let ans = evaluate(cellObject);
    updateCell(rowId,colId,ans);
})
//to add yourself to your prent downstream
function setusnds(cellElem,formula){
 let formulaComponent = formula.split(" ");
 //[(,A1,+,A2,)]
 for(let i=0;i<formulaComponent.length;i++){
     let charAt0 = formulaComponent[i].charCodeAt(0);
     if(charAt0>64 && charAt0<91){
         let ParentRC = getrcfromaddress(formulaComponent[i]);
         let parentCell = db[ParentRC.rowId][ParentRC.colId];
         parentCell.downstream.push({
             rowId,
             colId
         })
         let cellObject = getcell(cellElem);
         cellObject.upstream.push({
             rowId: ParentRC.rowId,
             colId:ParentRC.colId
         })

     }
 }
}

//remove yourself from parent's downstream
function rmusnds(cellObject,cellElem){
    cellObject.formula = "";
    let {rowId,colId} = getrc(cellElem)
    for(let i=0;i<cellObject.upstream.length;i++){
        let elem = cellObject.upstream[i];
        let findobject = getcell(elem);
        let fArr = findobject.downstream.filter(function(delement){
          return !(delement.colId==colId && delement.rowId == rowId);
        })
        elem.downstream=fArr;
    }
    cellObject.upstream = [];
}

//update cell function is to update self value and to update its children value
function updateCell(rowId,colId,ans){
  let cellObject = db[rowId][colId];
  cellObject.value=ans; 
  $(`#grid .cell[r-id=${rowId}][c-id=${colId}]`).html(ans);
  for(let i=0;i<cellObject.downstream.length;i++){
      let elem = cellObject.downstream[i];
      let finsObject = db[elem.rowId][elem.colId];
      let updatevalue = evaluate(finsObject);
      updateCell(updatevalue.rowId,updatevalue.colId,updatevalue); 
  }
}

//evalutae function
function evaluate(cellObject){
    let formula = cellObject.formula;
    let formulaComponent = formula.split(" ");
    for(let i=0;i<formulaComponent.length;i++){
        let code = formulaComponent[i].charCodeAt(0);
        if(code>65 && code<91){
            let ParenrRC = getrcfromaddress(formulaComponent[i]);
            let fParent = db[ParenrRC.rowId][ParenrRC.colId];
            let value = fParent.value;
            formula = formula.replace(formulaComponent[i],value);
        }
    }
    let ans = infixEval(formula);
    return ans;
}
//function to solve infix 
let opst=[];
        let valst=[];
        function infixEval(formula){
            let formulacomp=formula.split(" ");
            for(let i=0;i<formulacomp.length;i++){
                let ch=formulacomp[i];
                if(ch.localeCompare("(")==0){
                    opst.push(ch);
                }else if(ch.localeCompare(")")==0){
                    while(opst[opst.length-1].localeCompare("(")!=0){
                        let operator=opst.pop();
                        let val2=valst.pop();
                        let val1=valst.pop();
                        let ans=solve(val1,val2,operator);
                        valst.push(ans);
                    }
                    opst.pop();
                }else if(ch.localeCompare("+")==0||ch.localeCompare("-")==0||ch.localeCompare("*")==0||ch.localeCompare("/")==0){
                    while(opst.length>0&&(opst[opst.length-1].localeCompare("(")!=0)&&precedence(ch)<=precedence(opst[opst.length-1])){
                        let operator=opst.pop();
                        let val2=valst.pop();
                        let val1=valst.pop();
                        let ans=solve(val1,val2,operator);
                        valst.push(ans);
                    }
                    opst.push(ch)
                }else if(!isNaN(ch)){
                    let no=Number(ch);
                    valst.push(no);
                }
            }
            while(opst.length>0){
                let operator=opst.pop();
                let val2=valst.pop();
                let val1=valst.pop();
                let ans=solve(val1,val2,operator);
                valst.push(ans);
            }
            return valst.pop();
        }
        function precedence(operator){
            if(operator.localeCompare("+")==0){
                return 1;
            }else if(operator.localeCompare("-")==0){
                return 1;
            }else if(operator.localeCompare("*")==0){
                return 2;
            }else{
                return 2;
            }
        }
        function solve(val1,val2,operator){
            if(operator.localeCompare("+")==0){
                return val1+val2;
            }else if(operator.localeCompare("-")==0){
                return val1-val2;
            }else if(operator.localeCompare("*")==0){
                return val1*val2;
            }else{
                return val1/val2;
            }
        }   
//end of solve function
//function to get row col from address bar
function getrcfromaddress(address){
    let colId = address.charCodeAt(0)-65;
    let rowId = Number(address.substring(1))-1;
    return {colId,rowId};
}

function getrc(elem){
 let colId = Number($(elem).attr("c-id"));
 let rowId = Number($(elem).attr("r-id"));
 return{
     colId,rowId
 }
}
function getcell(cellElem){
    let {colId,rowId} = getrc(cellElem);
    return db[rowId][colId];
}
function init(){
    db = [];
    let AllRows = $("#grid").find(".row");
    for(let i=0;i<AllRows.length;i++){
        let row = [];
        let AllCols = $(AllRows[i]).find(".cell");
        for(let j=0;j<AllCols.length;j++){
            let cell = {
                value: "",
                formula: "",
                downstream: [],
                upstream: []
            }
            $(AllCols).html('');
            row.push(cell);
        }
        db.push(row);
    }
    console.log(db);
}
init();