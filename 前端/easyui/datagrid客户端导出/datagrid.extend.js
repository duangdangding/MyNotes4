(function ($) {
       $.extend($.fn.datagrid.methods, {
        getExportColumns: function (jq, param) {//获取可以导出的列 //dbfield:false 数据库没有该字段,但要导出该列。exported:false 不导出该列
            var columns = [];
            var frozenCols = $(jq).datagrid("options").frozenColumns;
            var cols = $(jq).datagrid("options").columns;
            frozenCols = frozenCols == null || frozenCols[0] == null ? [] : frozenCols[0];
            cols = cols == null || cols[0] == null ? [] : cols[0];

            var newCols = frozenCols.concat(cols);
            for (var i = 0; i < newCols.length; i++) {
                var col = newCols[i];
                if (col.field != 'chk' && col.field != 'idd' && col.field != 'OperaID' && col.hidden != true && col.hidden != 'true' && col.exported != false && col.exported != 'false') {
                    columns.push({ field: col.field, title: col.title, dbfield: (col.dbfield == null ? true : false) });
                }
            }
            return columns;
        }
     });

})(jQuery)