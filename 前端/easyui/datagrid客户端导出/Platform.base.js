
//���ݲ�ͬ�������ѡ��ͬ�����ط�ʽ
function _downloadByExplorer(url, dataURI, fileName) {
    var match = _userAgent();
    if (match == undefined || match[1] == "msie" || match[1] == "trident" || match[1] == "edge") {
        _formDownloadImorpt(url, { data: dataURI, fileName: fileName });//ȥ���������ظ���
    } else {
        _saveAsDataURI(dataURI, fileName);//�ͻ���ֱ�Ӱ�xmlת�ɸ���
    }
}


//���ط���������ĸ���(����ajax��֧�ָ�������,���ôη�ʽ),url:���������ص�ַ, obj: { fileName: '����״̬ͳ�Ʊ���', data: Base64.encode(dataXml, true) }
function _formDownloadImorpt(url, obj) {
    var form = $("<form>");//����һ��form��
    form.attr("style", "display:none");
    form.attr("target", "");
    form.attr("method", "post");
    form.attr("action", url);//URL
    if (obj != null) {
        var prop = Object.getOwnPropertyNames(obj);
        for (var i = 0; i < prop.length; i++) {//����
            var input = $("<input>");
            input.attr("type", "hidden");
            input.attr("name", prop[i]);
            input.attr("value", obj[prop[i]]);
            form.append(input);
        }
    }
    $("body").append(form);//����������web��
    form.submit();//���ύ 
    form.remove();//�Ƴ�����ʱԪ��
}


//���ؿͻ���xml����Դ��Excel,dataURI:base64��xml����Դ,fileName�ļ���
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

//��ȡ�������Ϣ������һ�����顾match[0]:������ں˺Ͱ汾, match[1]: msie||trident||edge||firefox||webkit||opera, match[2]:�汾�� (ע: trident ����IE11,opera�Ľ��ڰ汾�Ѹ���webkit�ں���)
function _userAgent() {
    var ua = navigator.userAgent.toLowerCase();
    var match = ua.match(/(msie)[\s]([\d.]+)/) || ua.match(!/compatible/.test(ua) && /(trident)(?:.*? rv:([\w.]+))?/) || ua.match(/(edge)[\/]([\d.]+)/) || ua.match(/(firefox)[\/]([\d.]+)/) || ua.match(/(webkit)[\/]([\d.]+)/) || ua.match(/(opera)[\.]([\d.]+)/) || ua.match(/(version)[\/]([\d.]+)/) || [];
    return match;
}