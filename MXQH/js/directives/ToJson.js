
//importScripts("../../Scripts/jquery/jquery.min.js");
importScripts("../../Scripts/SheetJs/xlsx.full.min.js");

addEventListener("message", function (evt) {
    var date = new Date();   
    //console.log(evt.data);
    var wb = XLSX.read(evt.data.data, { type: 'binary' });
    var Data = [];
    for (var i = 0; i < evt.data.op.sheetNum; i++) {
        var wsname = wb.SheetNames[i];
        var ws = wb.Sheets[wsname];
        var aoa = XLSX.utils.sheet_to_json(ws, evt.data.op.header);
        Data.push(aoa);
    }
    postMessage(Data);
}, false);
