
//根据不同的浏览器选择不同的下载方式
function _downloadByExplorer(url, dataURI, fileName) {
    var match = _userAgent();
    if (match == undefined || match[1] == "msie" || match[1] == "trident" || match[1] == "edge") {
        _formDownloadImorpt(url, { data: dataURI, fileName: fileName });//去服务器下载附件
    } else {
        _saveAsDataURI(dataURI, fileName);//客户端直接把xml转成附件
    }
}


//下载服务器输出的附件(由于ajax不支持附件类型,故用次方式),url:服务器下载地址, obj: { fileName: '订单状态统计报表', data: Base64.encode(dataXml, true) }
function _formDownloadImorpt(url, obj) {
    var form = $("<form>");//定义一个form表单
    form.attr("style", "display:none");
    form.attr("target", "");
    form.attr("method", "post");
    form.attr("action", url);//URL
    if (obj != null) {
        var prop = Object.getOwnPropertyNames(obj);
        for (var i = 0; i < prop.length; i++) {//参数
            var input = $("<input>");
            input.attr("type", "hidden");
            input.attr("name", prop[i]);
            input.attr("value", obj[prop[i]]);
            form.append(input);
        }
    }
    $("body").append(form);//将表单放置在web中
    form.submit();//表单提交 
    form.remove();//移除该临时元素
}


//下载客户端xml数据源的Excel,dataURI:base64的xml数据源,fileName文件名
function _saveAsDataURI(dataURI, fileName) {
    dataURI = 'data:application/vnd.ms-excel;base64,' + dataURI;
    var fileSaver = document.createElement('a');
    if (window.Blob && dataURI instanceof Blob) {
        dataURI = URL.createObjectURL(dataURI);
    }
    fileSaver.download = fileName + $.fn.datebox.defaults.formatter(new Date()).replace(/[-,/, ,:]/g, '') + '.xls';
    fileSaver.href = dataURI;
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    fileSaver.dispatchEvent(e);
    setTimeout(function () {
        URL.revokeObjectURL(dataURI);
    });
}

//获取浏览器信息并返回一个数组【match[0]:浏览器内核和版本, match[1]: msie||trident||edge||firefox||webkit||opera, match[2]:版本】 (注: trident 则是IE11,opera的近期版本已改用webkit内核了)
function _userAgent() {
    var ua = navigator.userAgent.toLowerCase();
    var match = ua.match(/(msie)[\s]([\d.]+)/) || ua.match(!/compatible/.test(ua) && /(trident)(?:.*? rv:([\w.]+))?/) || ua.match(/(edge)[\/]([\d.]+)/) || ua.match(/(firefox)[\/]([\d.]+)/) || ua.match(/(webkit)[\/]([\d.]+)/) || ua.match(/(opera)[\.]([\d.]+)/) || ua.match(/(version)[\/]([\d.]+)/) || [];
    return match;
}