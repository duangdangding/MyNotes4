$.extend($.fn.datagrid.methods, {
    getExcelXml: function (jq, param) {
        var worksheet = this.createWorksheet(jq, param);

        return '<?xml version="1.0" encoding="utf-8"?>' + //xml申明有问题，以修正，注意是utf-8编码，如果是gb2312，需要修改动态页文件的写入编码  
    '<ss:Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office">' +
    '<o:DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><o:Title>' + param.title + '</o:Title></o:DocumentProperties>' +
    '<ss:ExcelWorkbook>' +
    '<ss:WindowHeight>' + worksheet.height + '</ss:WindowHeight>' +
    '<ss:WindowWidth>' + worksheet.width + '</ss:WindowWidth>' +
    '<ss:ProtectStructure>False</ss:ProtectStructure>' +
    '<ss:ProtectWindows>False</ss:ProtectWindows>' +
    '</ss:ExcelWorkbook>' +
    '<ss:Styles>' +
    '<ss:Style ss:ID="Default" ss:Name="Normal">' +
    '<ss:Alignment ss:Vertical="Bottom"  />' +
    '<ss:Font ss:FontName="Arial" x:Family="Swiss" />' +// ss:Size="11"
    '<ss:Borders>' +
    '<ss:Border  ss:Weight="1" ss:LineStyle="Continuous" ss:Color="#bfbfbf" ss:Position="Top" />' +
    '<ss:Border  ss:Weight="1" ss:LineStyle="Continuous" ss:Color="#bfbfbf" ss:Position="Bottom" />' +
    '<ss:Border  ss:Weight="1" ss:LineStyle="Continuous" ss:Color="#bfbfbf" ss:Position="Left" />' +
    '<ss:Border ss:Weight="1" ss:LineStyle="Continuous" ss:Color="#bfbfbf" ss:Position="Right" />' +
    '</ss:Borders>' +
    '<ss:Interior />' +
    '<ss:NumberFormat />' +
    '<ss:Protection />' +
    '</ss:Style>' +
    '<ss:Style ss:ID="title">' +
    '<ss:Borders />' +
    '<ss:Font />' +
    '<ss:Alignment  ss:Vertical="Center" ss:Horizontal="Center" />' +
    '<ss:NumberFormat ss:Format="@" />' +
    '</ss:Style>' +
    '<ss:Style ss:ID="headercell">' +
    '<ss:Font ss:Bold="1"  />' +//ss:Size="11"
    '<ss:Alignment  ss:Horizontal="Center" />' +
    '<ss:Interior ss:Pattern="Solid"  />' +
    '</ss:Style>' +
    '<ss:Style ss:ID="even">' +
    '<ss:Interior ss:Pattern="Solid"  />' +
    '</ss:Style>' +
    '<ss:Style ss:Parent="even" ss:ID="evendate">' +
    '<ss:NumberFormat ss:Format="yyyy-mm-dd" />' +
    '</ss:Style>' +
    '<ss:Style ss:Parent="even" ss:ID="evenint">' +
    '<ss:NumberFormat ss:Format="0" />' +
    '</ss:Style>' +
    '<ss:Style ss:Parent="even" ss:ID="evenfloat">' +
    '<ss:NumberFormat ss:Format="0.00" />' +
    '</ss:Style>' +
    '<ss:Style ss:ID="odd">' +
    '<ss:Interior ss:Pattern="Solid"  />' +
    '</ss:Style>' +
    '<ss:Style ss:Parent="odd" ss:ID="odddate">' +
    '<ss:NumberFormat ss:Format="yyyy-mm-dd" />' +
    '</ss:Style>' +
    '<ss:Style ss:Parent="odd" ss:ID="oddint">' +
    '<ss:NumberFormat ss:Format="0" />' +
    '</ss:Style>' +
    '<ss:Style ss:Parent="odd" ss:ID="oddfloat">' +
    '<ss:NumberFormat ss:Format="0.00" />' +
    '</ss:Style>' +
    '</ss:Styles>' +
    worksheet.xml +
    '</ss:Workbook>';
    },
    createWorksheet: function (jq, param) {
        // Calculate cell data types and extra class names which affect formatting  
        var cellType = [];
        var cellTypeClass = [];
        var totalWidthInPixels = 0;
        var colXml = '';
        var headerXml = '';
        var visibleColumnCountReduction = 0;
        var cfs = [];
        if (param.columns != null) {//如果是模板导出
            cfs = param.columns.map(function (item) { return item.field; });
        } else {
            var cfs = $(jq).datagrid('getExportColumns').map(function (item) { return item.field; });//冻结列和解冻列同时导出
            if (param.multiHeader == true) {
                var cfs = $(jq).datagrid('getColumnFields', true);//冻结列和解冻列同时导出
                var cfs2 = $(jq).datagrid('getColumnFields');
                if (cfs2 != null && cfs2.length > 0) {
                    for (var i = 0; i < cfs2.length; i++) {
                        cfs[cfs.length] = cfs2[i];
                    }
                }
                for (var i = 0; i < cfs.length; i++) {//排除不需要导出的列
                    var opt = $(jq).datagrid('getColumnOption', cfs[i]);
                    if (opt.exported == false || opt.field == 'chk' || opt.field == 'idd' || opt.field == 'OperaID') {
                        cfs.splice(i, 1);
                        i--;
                    }
                }
            }
        }

        var colCount = cfs.length;
        var cstartIndex = 0, cendIndex = colCount;

        for (var i = cstartIndex; i < cendIndex; i++) {
            if (cfs[i] != '') {
                var w = $(jq).datagrid('getColumnOption', cfs[i]).width;
                w = isNaN(parseInt(w)) ? 80 : parseInt(w);

                totalWidthInPixels += w;
                if (cfs[i] === "") {
                    cellType.push("None");
                    cellTypeClass.push("");
                    ++visibleColumnCountReduction;
                }
                else {
                    var option = $(jq).datagrid('getColumnOption', cfs[i]);
                    if (!option.title) option.title = "";
                    var fieldLeft = option.fieldLeft != null ? $(jq).datagrid('getColumnOption', option.fieldLeft).title.replace("<br>", "") : '';
                    var fieldRight = option.fieldRight != null ? $(jq).datagrid('getColumnOption', option.fieldRight).title.replace("<br>", "") : '';
                    var title = fieldLeft + option.title.replace("<br>", "") + fieldRight;
                    if (param.columns != null) {//如果是模板导出
                       var dbCol= param.columns.find(function (item) { return item.field == option.field });
                       if (dbCol) title = dbCol.title;
                    }

                    colXml += '<ss:Column ss:AutoFitWidth="0" ss:Width="' + Math.floor(w * 3 / 4) + '" />';
                    headerXml += '<ss:Cell ss:StyleID="headercell">' +
                '<ss:Data ss:Type="String">' + title + '</ss:Data>' +
                '<ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>';
                    if (option.total == 'sum' || option.total == 'avg') {
                        cellType.push("Number");
                    }
                    else {
                        cellType.push("String");
                    }
                    cellTypeClass.push("");
                }
            }
        }

        var visibleColumnCount = cellType.length - visibleColumnCountReduction;
        var result = {
            height: 9000,
            width: Math.floor(totalWidthInPixels * 30) + 50
        };
        var rows = param.rows || $(jq).datagrid('getRows');
        if (!param.rows && $.data(jq[0], "treegrid") != null) {//如果是treegrid时
            var roots = $(jq).treegrid('getRoots');
            var treeRows = [];
            getTreeRows(roots, treeRows);
            rows = treeRows;

            function getTreeRows(roots, rows) {
                if (roots != null) {
                    for (var i = 0; i < roots.length; i++) {
                        rows.push(roots[i]);
                        getTreeRows(roots[i].children, rows);
                    }
                }
            }
        }
        debugger;
        var footerRows;
        if ($.data(jq[0], "treegrid"))
            footerRows = $(jq).treegrid('getFooterRows');
        else
            footerRows = $(jq).datagrid('getFooterRows');
        if (footerRows && footerRows.length > 0) {
            rows = rows.concat(footerRows);
        }
        // Generate worksheet header details.  
        var t = '<ss:Worksheet ss:Name="' + param.title + '">' +
    '<ss:Names>' +
    '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\'' + param.title + '\'!R1:R2" />' +
    '</ss:Names>' +
    '<ss:Table x:FullRows="1" x:FullColumns="1" ss:DefaultRowHeight="20"' +
    ' ss:ExpandedColumnCount="' + (visibleColumnCount + 2) +
    '" ss:ExpandedRowCount="' + (rows.length + 2) + '">' +
    colXml +
    '<ss:Row ss:AutoFitHeight="0">' +
    headerXml +
    '</ss:Row>';
        // Generate the data rows from the data in the Store  
        debugger;
        for (var i = 0, it = rows, l = it.length; i < l; i++) {
            t += '<ss:Row>';
            var cellClass = (i & 1) ? 'odd' : 'even';
            r = it[i];
            var k = 0;
            for (var j = cstartIndex; j < cendIndex; j++) {
                if (cfs[j] != '') {
                    var v = r[cfs[j]];
                    if (cellType[k] !== "None") {
                        //转换状态列
                        var opt = $(jq).datagrid('getColumnOption', cfs[j]);
                        if (opt.formatter != null && typeof (opt.formatter) == 'function') {
                            v = opt.formatter(v, r, i);
                        }
                        var strType = null;
                        if (cellType[k] == 'Number' && v && /^(-)?\d+(\.\d+)?$/.exec(v) == null) { strType = 'String'; }//检测数值列中是否存在非数值

                        t += '<ss:Cell ss:StyleID="' + cellClass + cellTypeClass[k] + '"><ss:Data ss:Type="' + (strType ? strType : cellType[k]) + '">';
                        if (cellType[k] == 'DateTime') {
                            t += v.format('Y-m-d');
                        }
                        else {
                            if (cellType[k] == 'Number' && strType == null && !v) { v = 0; }
                            t += (v == null ? '' : v);
                        }
                        t += '</ss:Data></ss:Cell>';
                    }
                    k++;
                }
            }
            t += '</ss:Row>';
        }
        result.xml = t + '</ss:Table>' +
    '<x:WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">' +
    '<x:PageSetup>' +
    '<x:Layout x:CenterHorizontal="1" x:Orientation="Landscape" />' +
    '<x:Footer x:Data="Page &P of &N" x:Margin="0.5" />' +
    '<x:PageMargins x:Top="0.5" x:Right="0.5" x:Left="0.5" x:Bottom="0.8" />' +
    '</x:PageSetup>' +
    '<x:FitToPage />' +
    '<x:Print>' +
    '<x:PrintErrors>Blank</x:PrintErrors>' +
    '<x:FitWidth>1</x:FitWidth>' +
    '<x:FitHeight>32767</x:FitHeight>' +
    '<x:ValidPrinterInfo />' +
    '<x:VerticalResolution>600</x:VerticalResolution>' +
    '</x:Print>' +
    '<x:Selected />' +
    '<FreezePanes/>' +
    '<FrozenNoSplit/>' +
    '<SplitHorizontal>1</SplitHorizontal>' +//固定第一行
    '<TopRowBottomPane>1</TopRowBottomPane>' +
    '<ActivePane>2</ActivePane>' +//固定行时 鼠标滚轮滚动
    '<x:DoNotDisplayGridlines />' +
    '<x:ProtectObjects>False</x:ProtectObjects>' +
    '<x:ProtectScenarios>False</x:ProtectScenarios>' +
    '</x:WorksheetOptions>' +
    '</ss:Worksheet>';
        return result;
    }
});