/*  _divName    div元素名
     _nPageCount 总页数；
     _nCurrIndex 当前页码；
     _sPageName  共同前缀名；
     _sPageExt   分页页面的文件名后缀;
     _nPageSum   总记录数
     */
     function createPageHTML(divName,_nPageCount, _nCurrIndex, _sPageName, _sPageExt,_nPageSum){
     var con_text = "";
     if(_nPageCount == null || _nPageCount<1){
     return;
     }
     var nCurrIndex = _nCurrIndex;
     con_text += "<div class=\"pagination_totalCount\">当前"+nCurrIndex+"页</div>";
     if(nCurrIndex>1){
     if((nCurrIndex-1)>0){
        if((nCurrIndex-1)==1)
         con_text += "<div class=\"pagination_index\"><span class=\"arrow\"><a href=\""+_sPageName+"."+_sPageExt+"\"><<</a></span></div>";
     else
         con_text += "<div class=\"pagination_index\"><span class=\"arrow\"><a href=\""+_sPageName+"_" + (nCurrIndex-1) +"."+_sPageExt+"\"><<</a></span></div>";
     }
     }
     var startpage=0,endpage =0;
     if(nCurrIndex > 9){
     startpage = nCurrIndex-4;
     if(_nPageCount-nCurrIndex>4){
           endpage =nCurrIndex+4;
     }else{
           endpage = _nPageCount;
     }
     }else if(_nPageCount<10){
     startpage = 1;
      endpage = _nPageCount;
     }else{
     startpage = 1;
     endpage = 10;
     }
     for(var k=startpage; k<=endpage; k++){
     var param = "";
     if(k >1 ) param = "_" + k;
     if(k==nCurrIndex)
     con_text += "<div class=\"pagination_curr\"><a href=\""+_sPageName+param+ "."+_sPageExt+"\">"+k+"</a></div>";
     else
     con_text += "<div class=\"pagination_index\"><a href=\""+_sPageName+param + "."+_sPageExt+"\">"+k+"</a></div>";
     }
     if(nCurrIndex<_nPageCount)
     con_text += "<div class=\"pagination_index\"><span class=\"arrow\"><a href=\""+_sPageName+"_" + (nCurrIndex+1) + "."+_sPageExt+"\">>></a></span></div>";
     document.getElementById(divName).innerHTML = con_text+"<div class=\"pagination_totalCount\">共"+_nPageCount+"页,"+_nPageSum+"条记录</div>"
     }
