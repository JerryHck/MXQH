
//importScripts("../../Scripts/jquery/jquery.min.js");
importScripts("../../Scripts/SheetJs/xlsx.full.min.js");

addEventListener("message", function (evt) {
    var date = new Date();   
    //var wb = XLSX.read(evt.data.data, { type: 'base64' }); //以base64方式读取
    var wb = XLSX.read(evt.data.data, { type: 'binary' }); //BinaryString格式(byte n is data.charCodeAt(n))
    //var wb = XLSX.read(evt.data.data, { type: 'string' }); //UTF8编码的字符串；
    //var wb = XLSX.read(evt.data.data, { type: 'buffer' }); //Uint8Array
    //var wb = XLSX.read(evt.data.data, { type: 'array' });
    var Data = [];
    var header = [], char = ['', 'A', 'B', 'C'];
    for (var j = 0; j < 4; j++) {
        for (var i = 0; i < 25; i++) {
            header.push(char[j] + String.fromCharCode((65 + i)));
        }
    }
    for (var i = 0; i < evt.data.op.length; i++) {
        var item = evt.data.op[i];
        var wsname = wb.SheetNames[item.sheet];
        var ws = wb.Sheets[wsname];

        var aoa = XLSX.utils.sheet_to_json(ws, { header: item.header || header });
        console.log(aoa)
        Data.push(aoa);
    }
    //for (var i = 0; i < evt.data.op.sheetNum; i++) {
    //    var wsname = wb.SheetNames[i];
    //    var ws = wb.Sheets[wsname];
    //    var aoa = XLSX.utils.sheet_to_json(ws, evt.data.op.header);
    //    Data.push(aoa);
    //}
    postMessage(Data);
}, false);
