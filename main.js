(function($) {
    $.fn.domNext = function() {
        return this
            .children(":eq(0)")
            .add(this.next())
            .add(this.parents().filter(function() {
                return $(this).next().length > 0;
            }).next()).first();        
    };
    
    $.fn.domPrevious = function() {
        return this
            .prev().find("*:last")   
            .add(this.parent())     
            .add(this.prev())
            .last();         
    };
})(jQuery);

(function($){
   $.fn.innerText = function(msg) {
         if (msg) {
            if (document.body.innerText) {
               for (var i in this) {
                  this[i].innerText = msg;
               }
            } else {
               for (var i in this) {
                  this[i].innerHTML.replace(/&amp;lt;br&amp;gt;/gi,"n").replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, "");
               }
            }
            return this;
         } else {
            if (document.body.innerText) {
               return this[0].innerText;
            } else {
               return this[0].innerHTML.replace(/&amp;lt;br&amp;gt;/gi,"n").replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, "");
            }
         }
   };
})(jQuery);

/*
function displayId(event)
{
	//alert(event.keyCode);
	if(event.ctrlKey && event.shiftKey && (event.keyCode == 48 || event.keyCode==45))
	{
		setLangWidth();
		$(".id").fadeToggle(10).css("display","table-cell");
		$("#wrap_add_lang").fadeToggle(10).css("display","inline-block");
		$(".add_lang_form").fadeToggle(10);
		$(".delete_lang_btn").fadeToggle(10).css("display","block");
		$(".handle").fadeToggle(10).css("display","table-cell");
		$("#reset_pass_icon").fadeToggle(10);
		
	}
}

function setLangWidth () 
{
	var displayId = $(".id").css("display");
	if(displayId == "none")
		$(".lang").css("width","38%");
	else
		$(".lang").css("width","48%");
}
*/

//======================================================================================================================================

var translateChanges;
var arrLangOrder = [];
var initOrderOrd = [];
var initOrderRowid = [];


function getMaxOrder(arr){
	var maxOrder = 0;
	$.each(arr, function(index, child){
		var order = child.getAttribute('data-order');
		if(order > maxOrder)
			maxOrder = order;
	});
	return ++maxOrder;
}

function addFirstRow(data){
	var arrLang =  $('.row_title').find('.title_lang');
	if(arrLang.length != 0)
	{
		var row = $('<div/>', {'class':'row','data-rowid':'-1','data-order':''}).appendTo('#first_row_container');
		if (data.move_rows == "true"){
    		var imgSort = $('<img/>', {'class':'handle', 'src':'/images/sort.png'}).appendTo(row);
    	}
		$.each(data.arr_ro_rw, function(index, child){
			for (var ro in data.arr_ro_langs){
    			if (data.arr_ro_langs[ro] == child){
    				var lang = $('<div/>', {'class':'lang','data-lang':data.arr_ro_langs[ro],'data-hash':''}).appendTo(row);
    				var p = $('<p/>', {'class':'text', 'contenteditable':'false'}).appendTo(lang);
    			}
    		}

    		for (var rw in data.arr_rw_langs){
    			if (data.arr_rw_langs[rw] == child){
    				var lang = $('<div/>', {'class':'lang','data-lang':data.arr_rw_langs[rw],'data-hash':''}).appendTo(row);
    				var p = $('<p/>', {'class':'text', 'contenteditable':'true'}).appendTo(lang);
    				writableCellStyle(p);
    			}
    		}
		});
	} 
}

function addRowEmpty() 
{
    var container = $("#box_rows");
    //var row = container.children().eq(2).html();
    //var row = $("#for_clone_row").html();
    var arrRow = $("#container").find('.row');
    var maxOrder = getMaxOrder(arrRow);

    var row = arrRow.first().html();
    //var row = firstRow.html();
    if(row){
	    container.append("<div class='row' data-rowid='-1' data-order=''>" + row + "</div>");
	    //var addedRow = $("#container").find('.row').last();
	    //addedRow.attr('data-order',maxOrder);
	}else{
		var firstRow = $("#first_row_container").find('.row').html();
		container.append("<div class='row' data-rowid='-1' data-order=''>" + firstRow + "</div>");
	}
    //addEditableTolastRow ();
    //before set handler on new delete sign in new row unbind old handler
    cleanLastRow();
    $('.button_close').off('click').on('click',function(){
        deleteRow(this); 
    });
    //addEditableTolastRow ();
    addFocusableTolastRow();
    $("#box_rows").perfectScrollbar('update');
}

function cleanLastRow(){
	var lastRow = $("#container").find('.row').last();
	arrLangRow = lastRow.find('.lang');
	$.each(arrLangRow, function(index, child){
		$(child).attr('data-hash','0');
		$(child).attr('data-hash-curr','0');
		$(child).attr('data-hash-nowcurr','');
		$(child).find('.text').empty();
	});
	$(arrLangRow).bind('keyup',function(e){
		changeHandler(e);
	});
}

function addFocusableTolastRow () {
	var lastRow = $("#container").find('.row').last();
	var id = lastRow.find('.id');
	var lang = lastRow.find('.lang');

	$(id).bind('keydown',function(e){
		keyHandler(e);
	});

	$(lang).bind('keydown',function(e){
		keyHandler(e);
	});
	
}
/*
function addEditableToCloneRow() {
	var cloneRow = $('#for_clone_row');
	var texts = cloneRow.find('.text');
	$(texts).editable();
}
*/



function tabHandler (object) {
	var obj = object;
	var next = obj.next('div');
	if(!next.is('span'))
	{
		obj.find("input").blur();
		//next.children().click();
		next.children().focus();
	}
	else
	{
		
	}
}

function tabShiftHandler (object) {
	var obj = object;
	var prev = obj.prev('div');
	
	obj.find("input").blur();
	//prev.children().click();
	prev.children().focus();	
}

function keyHandler (event) {
	var e = event;
	var obj = $(e.currentTarget);
	//enter key handler
	if(e.keyCode == 13)			
	{
		//enterHandler(e,obj);
	}
	//tab key handler
	if(!e.shiftKey && e.keyCode == 9)
	{	
		tabHandler(obj);
		e.stopPropagation();
    	e.preventDefault();
	}
	//tab + shift key handler
	if(e.shiftKey && e.keyCode == 9)
	{
		tabShiftHandler(obj);
		e.stopPropagation();
    	e.preventDefault();
	}
}

function changeHandler (event) {
	var e = event;
	var obj = $(e.currentTarget);
	onChangedText(obj);
}



function onChangedText(elem){
	var originalHash = elem.attr('data-hash');
	var currentHash = elem.attr('data-hash-curr');
	var text = elem.find('.text').text();
	var nowCurrentHash = text.hashCode();
	if(nowCurrentHash != originalHash)
	{
		changesCellStyle(elem, true);
	}
	else
	{
		changesCellStyle(elem, false);
	}

	if(nowCurrentHash != originalHash && currentHash == originalHash)
	{
		translateChanges++;
		elem.attr('data-hash-curr',nowCurrentHash);

	}

	if(nowCurrentHash != currentHash && nowCurrentHash == originalHash)
	{
		translateChanges--;
		elem.attr('data-hash-curr',nowCurrentHash);		
	}
	changeStatus();
}

function writableCellStyle (elem)
{
	//var textCell = elem.find('.text');
	elem.css({'border-color':'mediumseagreen'});
}

var cellBgColor;

function changesCellStyle (elem,flag)
{	
	//var textCell = elem.find('.text');
	var textCell = elem;
	if(flag)
	{
		cellBgColor = textCell.clone(false).css('background');
		textCell.css({'background-color':'#eddede','opacity':'1.0'});
	}
	else
	{
		textCell.css({'background-color':cellBgColor});
	}
}

function changeStatus () {
	if(translateChanges > 0)
	{
		showTransSaveBut();
	}

	else
	{
		hideTransSaveBut();
	}
}

function showTransSaveBut()
{
    $('#save_data_link_btn').show();
}

function hideTransSaveBut()
{
    $('#save_data_link_btn').hide();
}

function addEditableTolastRow () {
	var lastRow = $("#container").find('.row').last().children();
	var arrRow = $("#container").find('.row');
	var arrRowChildren = arrRow.eq(0).children();

	$.each(arrRowChildren, function(index, child){
		var elem = lastRow.eq(index).children();
		var isEditable = elem.attr('contentEditable');
		//var isEditable = elem.is(':editable');
		if(index == 1)
		{
			//set editable for id field
			//elem.editable();
			elem.attr('contenteditable', true);
		}
		
		if(index > 1)
		{
			var radioBtns = $(child).find('.add_lang_form').children();
			var valRadioBtnSelected = radioBtns.filter(':checked').val();
			
			if(valRadioBtnSelected == 'ns')
			{

			}
			if(valRadioBtnSelected == 'ro')
			{
				elem.attr('contenteditable', false);
			}
			if(valRadioBtnSelected == 'w')
			{
				elem.attr('contenteditable', true);
				// if(isEditable)
				// 	elem.editable("destroy").editable();
				// else
				// 	elem.editable();
			}
		}
		
	});
}

function deleteRow (obj)
{
    var rowdel = obj.parentNode.parentNode;
    //var elem = rowdel.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling;
    //if(elem)
    $(rowdel).remove();
}

function getAbrLang() {
	var abrLang = $(".inp_abr_lang").val();
	return abrLang;
}

function getLang() {
	var lang = $(".inp_lang").val();
	return lang;
}

function addServerLinkfade ()
{
	$("#box_add_link_server").fadeToggle();
}

function addLangBoxfade ()
{
	$("#box_add_lang").fadeToggle();
}

function addLinkBoxfade ()
{
	$("#box_add_link").fadeToggle();
}

function onChangeRowOrd(){
	var arrRow = $("#container").find('.row');
	var chng = 0;
	$.each(arrRow, function(index, row){
		var order = row.getAttribute('data-order');
		var orderOld = initOrderOrd[index].toString();
		if( order != orderOld)
		{
			chng++;
		}
	});
	if(chng != 0)
	{
		if(!$('#save_data_link_btn').is(':visible')){
			showTransSaveBut();
		}
	}
	else
	{
		hideTransSaveBut();
	}
}

function createTranslationData () 
{
	var commonObj = {};
	var arrChangedText = [];
	var arrChngOrd = [];

	var arrRow = $("#container").find('.row');
	$.each(arrRow, function(index, row){
		var arrRowChildren = arrRow.eq(index).children();
		var objRow = {};
		var obj = {};

		// find if row order changed from initial
		var  rowId = row.getAttribute('data-rowid');
		if(rowId != -1){
			if(initOrderOrd[index] != row.getAttribute('data-order'))
			{
				var objChng = {};
				objChng.old_ord = initOrderOrd[index].toString();
				objChng.curr_ord = row.getAttribute('data-order');
				objChng.old_rowid = initOrderRowid[index].toString();
				objChng.curr_rowid = rowId;
				arrChngOrd.push(objChng);
			}
		}

		objRow.rowid = rowId;

		$.each(arrRowChildren, function(index, child){
			var textElem = $(child).find('.text');
			if(textElem.attr("contentEditable") == "true"){
				var hashCurrentText = new String(textElem.text()).hashCode();
				var hashInitialText = child.getAttribute('data-hash');
				if(hashInitialText != hashCurrentText){
					//obj.order = row.getAttribute('data-order');
					var lang  = child.getAttribute('data-lang'); 
					obj[lang] = textElem.text();
					//obj.child.getAttribute('data-lang') = textElem.text();
					//obj.text = textElem.text();
					//arrChangedText.push(obj);
				}
			}
		});
		if(!$.isEmptyObject(obj))
		{
			objRow.update = obj;
			arrChangedText.push(objRow);
		}
	});
	if(arrChngOrd.length > 0)
	{
		commonObj.arrChngOrd = arrChngOrd;
	}
	if(arrChangedText.length > 0){

		commonObj.arrChngText = arrChangedText;
	}
	var teste = JSON.stringify(commonObj);
	return commonObj;
	//arrChngOrd;
	//return arrChangedText;
	//arrChangedText;
}

function sendServerlink (pathname, object) 
{
	$.ajax({
	    type: 'POST',
	    url: pathname,
	    contentType:"application/json; charset=utf-8",
	    data:  JSON.stringify(object),
	    //data:"json",
	    error: function( jqXHR, textStatus, errorThrown){
	    	alert("error: " + textStatus);
	    },
	    success: function(data){
	        //console.log(reply);
	        //data;
	        successServerLink(data);
	    }
	}); // AJAX
}

function successServerLink(object)
{
	var link = object.link_name;
	//var link = $('#inp_link_server').val();
	$('#server_link_label').text(link);
}

function getServerLink()
{	
	var link = $('#inp_link_server').val();
	var obj = {};
	obj.link_name = link;
	return obj;
}

function saveServerLink()
{
	var obj = getServerLink();
	sendServerlink("/update_link", obj);
}

function handlerSucSave()
{	
	//reload page
	location.reload();
	// var link = window.location.href;
	// window.location.href = link;
}

function sendObject(path, object)
{
	$.ajax({
	    type: 'POST',
	    url: path,
	    contentType:"application/json; charset=utf-8",
	    data:  JSON.stringify(object),
	    //data: object,
	    //data:"json",
	    error: function( jqXHR, textStatus, errorThrown){
	       alert("error: " + textStatus);
	    },
	    success: function(){
	    	handlerSucSave();
	        //success
	    }
	}); // AJAX
}

function saveTranslations ()
{
	var dataTranslate = createTranslationData();
	if(dataTranslate.length == 0)
	{
		return;
	}
	var pathname = window.location.pathname; // Returns path only
	//var url = window.location.href;
	sendObject("/update", dataTranslate);
}


String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/*
function createTitleMenu (elem) {
	var ul = $('<ul/>').appendTo(elem);
	$('<li/>').text("abc").appendTo(ul);
	$('<li/>').text("def").appendTo(ul);
	$('<li/>').text("jkl").appendTo(ul);
}
*/



function initTranslate (data){
	
	translateChanges = 0;

	var linkName = data.link_name;
	$('#name_page').text(linkName);
	// create title row with names of langs
	if(data.full_langs.length != 0){
		var row = $('<div/>', {'class':'row_title'}).appendTo('#container');
		var footer = $('<div/>', {'class':'translations_footer'});
		//free space in title row before title
		if (data.move_rows == "true"){
			$('<span/>', {'class':'free_space_box', 'width' : 24 }).appendTo(row);
    		$('<span/>', {'class':'free_space_bg_lf', 'width' : 37 }).appendTo(row);
    		$('<span/>', {'class':'free_space_box', 'width' : 24 }).appendTo(footer);
    		$('<span/>', {'class':'free_space_footer_bg_lf', 'width' : 37 }).appendTo(footer);
    	}
    	else{
    		$('<span/>', {'class':'free_space_bg_lf', 'width' : 37 }).appendTo(row);
    		$('<span/>', {'class':'free_space_footer_bg_lf', 'width' : 37 }).appendTo(footer);
    	}
    	//<span class="cf-icon cf-icon-down-round"></span>
		data.full_langs.forEach(function(dataObj, i){
			var lang = $('<div/>', {'class':'title_lang','data-lang':data.arr_ro_rw[i]}).appendTo(row);
			//var title_menu_icon = $('<span/>', {'class':'cf-icon cf-icon-down-round'}).appendTo(lang);
			lang.text(dataObj);
			$('<span/>', {'class':'tmi fa fa-chevron-circle-down'}).appendTo(lang);
	    });
	    //$('<span/>', {'class':'free_space_bg_rg', 'width' : 14 }).appendTo(row);
	}

	if(data.common_arr.length == 0){
		addFirstRow(data);
	}
	// rows with data
	var box_rows = $('<div/>', {'id':'box_rows'}).appendTo('#container');
    data.common_arr.forEach(function(dataObj){
    	//set class throw one row for colors row
    	if(dataObj.ORD % 2 == 0){
    		var row = $('<div/>', {'class':'row','data-rowid':dataObj.rowid,'data-order':dataObj.ORD}).appendTo(box_rows);
    	}else{
    		var row = $('<div/>', {'class':'row odd','data-rowid':dataObj.rowid,'data-order':dataObj.ORD}).appendTo(box_rows);
    	}
    	//create array of row order
    	initOrderOrd.push(dataObj.ORD);
    	initOrderRowid.push(dataObj.rowid);
    	//////////////////////////////////
    	if (data.move_rows == "true"){
    		var boxDiv = $('<div/>', {'class':'box_handle',}).appendTo(row);
    		var imgSort = $('<img/>', {'class':'handle', 'src':'/images/sort.png'}).appendTo(boxDiv);
    	}
    	//row id cell
    	var rowIdBox =  $('<div/>', {'class':'row_id',}).appendTo(row);
		var rowIdCell = $('<span/>', {'class':'row_id_text',}).appendTo(rowIdBox);
		rowIdCell.text(dataObj.rowid);

    	for (var k in dataObj){

    		for (var ro in data.arr_ro_langs){
    			if (data.arr_ro_langs[ro] == k){
    				var hash = new String(dataObj[k]).hashCode();
    				var lang = $('<div/>', {'class':'lang','data-lang':k,'data-hash':hash,'data-hash-curr':hash,'data-hash-nowcurr':''}).appendTo(row);
    				var p = $('<p/>', {'class':'text', 'contenteditable':'false'}).appendTo(lang);
    				p.text(dataObj[k]);
    			}
    		}

    		for (var rw in data.arr_rw_langs){
    			if (data.arr_rw_langs[rw] == k){
    				var hash = new String(dataObj[k]).hashCode();
    				var lang = $('<div/>', {'class':'lang','data-lang':k,'data-hash':hash,'data-hash-curr':hash,'data-hash-nowcurr':''}).appendTo(row);
    				var p = $('<p/>', {'class':'text', 'contenteditable':'true'}).appendTo(lang);
    				p.text(dataObj[k]);
    				writableCellStyle(p);
    			}
    		}
    	}
    	//delete row  element
    	/*
    	var span = $('<span/>').appendTo(row);
    	$('<input/>', {
		    'type': 'image',
		    'value':'close',
		    'src':'/images/close.png',
		    'class':'button_close'
		}).appendTo(span);	
		*/
    });
	// footer.appendTo('#container');
	// var footer = $('<div/>', {'class':'translations_footer'}).appendTo('#container');
	var footer_bg = $('<div/>', {'class':'free_space_footer_bg'}).appendTo(footer);
	if (data.add_rows == "true"){
		var addRowBtn = $('<input/>', {
		    'type': 'button',
		    'value':'Add New Row',
		    'id':'add_row_btn',
		    'class':'block_adding_btn'
		    //attr: { size: "30" }
		}).appendTo(footer_bg);
		//set handler 
		// addRowBtn.bind('click', function(){
	 	// 		addRowEmpty();
	 	// });
	}
	footer.appendTo('#container');
	initOrderOrd;
	init();
}

function fillLangOrder(lang)
{
	var isExistLang = $.inArray(lang, arrLangOrder);
	if(isExistLang == -1)
	{
		arrLangOrder.push(lang);
	}
	else
	{
		if (isExistLang > -1) {
		    arrLangOrder.splice(isExistLang, 1);
		}
	}
}


 function getTranslateData () {

	var pathname = window.location.pathname; // Returns path only
	//var url = window.location.href;
	$.ajax({
	    type: 'POST',
	    url: pathname,
	    //contentType:"application/json; charset=utf-8",
	    //data:  JSON.stringify({"my_json_data" : 1}),
	    data:"json",
	    error: function( jqXHR, textStatus, errorThrown){
	    	alert("error: " + textStatus);
	    },
	    success: function(data){
	        //console.log(reply);
	        data;
	        initTranslate(data);
	    }
	}); // AJAX
}



//===============================================================================================================================================

function addNewLang (abrLang,lang,saveOption) {
	var abrLang = abrLang;
	var lang = lang;
	var saveOption = saveOption;

	var abrLangAndLang = lang + '(' + abrLang + ')';
	var arrRow = $("#container").find('.row');
	var test = arrRow.eq(0).children();
	var selectArr = arrRow.eq(0).children().find('select');

	var firstSelect = selectArr.eq(1);
	var options = firstSelect.prop('options');
	var flag = false;
	//has lang in options list or not
	$.each(options, function (index, option){
		var text = option.text;
		var match = abrLangAndLang.localeCompare(text);
		if(match == 0)
		{
			alert('This language already exists');
			flag = true;
		}
	});
	//exit if langauage alredy exists
	if(flag){return false;}

	$.each(selectArr, function (index, select) {
		//add new lang to select option except the id select
		if(index > 0)
		{
		    $(select).append($('<option>', { 
		        value: abrLang,
		        text : abrLangAndLang 
		    }));
		}
	});

	$.each(arrRow, function(index, row){
		var row = $(row);
		var newElem = row.children().eq(2).clone();
		var test = row.children();
		var lastElem = row.children().last();
		if(lastElem.is('span'))
		{
			newElem.bind('keydown',function(e){
				keyHandler(e);
			});
			var text = newElem.find('.text');
			$(text).empty();
			// var isEditable = $(text).is(':editable');
			// if(isEditable)
			// 	$(text).editable("destroy").editable();
			// else
			// 	$(text).editable();
			$(text).attr('contenteditable', true);
			newElem.insertBefore(lastElem);
		}
		else
		{	
			var selectBlock = newElem.children();
			var optionsSel = selectBlock.prop('options');
		    var lengthOptSel = optionsSel.length-1;
		    var lastOptSel = optionsSel[lengthOptSel];
		    if(saveOption)
		    {
		    	var radioBtns = newElem.find('.add_lang_form').find('input');
		    	$.each(radioBtns, function(index, input){
		    		//set handler on radio button
		    		$(input);
		    		$(input).change(function() {
						var access = this.value;
					    var parent = $(this).parent().parent();
					    setColAccess(parent,access);
					});

		    		var radBtnsVal = $(input).val();
		    		if(saveOption == radBtnsVal)
		    			$(input).prop('checked', true);
		    	});
		    }
		    lastOptSel.selected = true;
			row.append(newElem);
		}
    }); 

    $('.delete_lang_btn').off('click').on('click',function(){
        deleteLang(this); 
    });
}



function deleteLang(obj) {
	//verify jQuery object or not
	var flag = false;
	if(obj instanceof jQuery)
		flag = true;
	else
		var obj = $(obj);
	var object = obj.prev().prev();
	var elemIndex;
	var optTextDel = object.find(":selected").text();
	var arrRow = $("#container").find('.row');
	var arrRowChildren = arrRow.eq(0).children();
	var length = arrRowChildren.length;
	$.each(arrRowChildren, function(index, child){

		var select = $(child).find('select');
		var optSelected = select.find(":selected");
		var optText = optSelected.text();
		var match = optTextDel.localeCompare(optText);
		if(match == 0)
		{
			elemIndex = index;
			return false;
		}
	});
	if(elemIndex > 2 || flag)
	{
		$.each(arrRow, function(index, row){
			var element = row.children[elemIndex];
			$(element).remove(); 
		});
		var arrRowChildren = arrRow.eq(0).children();
		if(!flag)
		{
			//delete name of language from select options in all selects
			$.each(arrRowChildren, function(index, child){
				var select = $(child).find('select');
				select.children().filter(function () { return $(this).html() == optTextDel; }).remove();
			});
		}
	}
}

function saveTexts ()
{
	var jsonData = jsonStructTexts();
    var a = $("#save_file_btn_wrap").attr('href','data:text/json;charset=utf8,' + encodeURIComponent(jsonData))
    .attr('download','filename.json');
}



function jsonStructTexts()
{
	var jsonData;
	var version = '1.0';
	var data = { version : version, languages : {}, strings : {} };
	var regExp = /\(([^)]+)\)/;
    var arrRow = $("#container").find('.row');
    var arrLang = [];

    $.each(arrRow, function(index, row){
    	var indexRow = index;
		var arrRowChildren = arrRow.eq(indexRow).children();
		var id;
		var textProp = {};
		$.each(arrRowChildren, function(index, child){
			//row with <select>
			if(indexRow == 0)
			{
				var select = $(child).find('select');
				var optSelected = select.find(":selected");
				var optText = optSelected.text();
				var fullNameLang = optText.substring(0, optText.indexOf('('));
				var formLen = 	$(child).find('.add_lang_form').length;
				var radioBtns = $(child).find('.add_lang_form').children();
				var valRadioBtnSelected = radioBtns.filter(':checked').val();
				var matches = regExp.exec(optText);
				//if block radio buttons exists
				if(formLen != 0)
				{
					if(valRadioBtnSelected)
					{
						if(matches && fullNameLang != "")
						{
						 	var abrLang = matches[1];
						 	//add to arr abbreveature of language
						 	arrLang.push(abrLang);
							var access;
							fullNameLang;
							valRadioBtnSelected;
							if(valRadioBtnSelected == "ns")
								access = 'ns';
							if(valRadioBtnSelected == "ro")
								access = 'ro';
							if(valRadioBtnSelected == "w")
								access = 'w';
							var langProp = {name : fullNameLang, access : access};
							data.languages[abrLang] = langProp;
						}
					}
					else
					{
						alert("choose one of the ways to save");
						return false;
					}
				}
			}
			//row with text after row 1 (row 1 string for clone)
			if(indexRow > 1)
			{
				//get all element except span
				if(!$(child).is('span'))
				{
					// var textElem = $(child).find('.text').text();
					var textElem = $(child).find('.text').html();
					if(textElem)
					{
						//field id
						if(index == 1)
						{
							id = textElem.toString();
						}
						else
						{
							//var testText = $('#test').innerText();
							textElem = invertTextForSave(textElem);
							var nameLang = arrLang[index-2];
							textProp[nameLang] = textElem; 
						}
					}
				}
				else
					//when span, add object with text to another object
					data.strings[id] = textProp;
			}	
		});
	});
    jsonData = JSON.stringify(data);
    return jsonData;
}

function getBrowserName() 
{
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var nameOffset,verOffset;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	   browserName = "Opera";
	   return browserName;
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	   browserName = "IE";
	   return browserName;
	}
	// In Chrome, the true version is after "Chrome" 
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	   browserName = "Chrome";
	   return browserName;
	}
	// In Safari, the true version is after "Safari" or after "Version" 
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	   browserName = "Safari";
	   return browserName;
	}
	// In Firefox, the true version is after "Firefox" 
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	    browserName = "Firefox";
	    return browserName;
	}
	// In most other browsers, "name/version" is at the end of userAgent 
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ) {
	    browserName = nAgt.substring(nameOffset,verOffset);
	    return browserName;
	    if (browserName.toLowerCase()==browserName.toUpperCase()) {
	       browserName = navigator.appName;
	       return browserName;
	    }
	}
}

function invertTextForSave (textElem)
{
	var browserName = getBrowserName();
	var text = textElem;
	if(text)
	{
		//delete <span> with style,<br> and replace <div> to '/n'
		var nameBrowser = window.navigator.userAgent; 
		if(browserName == 'Chrome')
		{ 
			var test = text.replace(/\r?\n/g,'<br/>');
			text = text.replace(/<span style="[^"]*">/g,"").replace(/<\/span>/g,"").replace(/<br>/g,"").replace(/<div>/g,"\n").replace(/<\/div>/g,"");
			return text;
		}
		if(browserName == 'Firefox' || browserName == 'Opera' || browserName == 'IE')
		{
			//replace last br( browser set one excess br in the end of string)
			text = text.replace(/<br>$/, '');

			text = text.replace(/<span style="[^"]*">/g,"").replace(/<\/span>/g,"").replace(/<br>/g,"\n");
			return text;
		}
	}
	
}

function invertTextForLoad (textElem) 
{	
	var text = textElem;
	//working without this code in chrome, firefox (na vseakii sluceai s nim)
	var textarea = document.createElement("textarea");
	textarea.value = "\n";
	var eol = textarea.value.replace(/\r\n/, "\r");
	text.replace(/\n/gm,"eol");
	
	return text;

}

function loadFromFile (){
    
    var files = !!this.files ? this.files : [];
    if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

    //if (/^image/.test( files[0].type)){ // only image file
    var reader = new FileReader(); // instance of the FileReader
    reader.readAsBinaryString(files[0]); // read the local file

    reader.onloadend = function(){ // set image data as background of div
        //$("#image_preview").css("background-image", "url("+this.result+")");
        var obj = JSON.parse(this.result);
        //alert(obj);
        loadTexts(obj);
    }
}

function addRowData (id, textsObj) {
	var arrTexts = textsObj;
	addRowEmpty();
	var emptyRow = $("#container").find('.row').last().children();
	//set id in first div
	emptyRow.eq(1).children().text(id);
	var counter = 2;
	$.each(arrTexts, function(index, text){
		var elem = emptyRow.eq(counter).children();
		//elem.text(text);
		var textInv = invertTextForLoad(text);
		elem.append(textInv);
		counter++;
	});
}

function cleanBeforeLoad () {
	var arrRow = $("#container").find('.row');
	var arrSelectRow = arrRow.eq(0).children();
	var arrCloneRow = arrRow.eq(1).children();

	if(arrCloneRow.length > 4)
	{
		$.each(arrCloneRow, function(index, elem){
			if(index > 2 && (!$(elem).is('span')))
				$(elem).remove();
		});
	}

	$.each(arrRow, function(index, row){
		if(index > 1)
			$(row).remove();
	});

	$.each(arrSelectRow, function(index, elem){
		var select = $(elem).find('select');
		var options = select.prop('options');
		if(index > 1)
		{
			select.find('option').remove().end();
		}
		if(index > 2)
			$(elem).remove();
	});
}

function loadTexts (data){
  
    var dataTexts = data;
    if(dataTexts)
    {    
    	cleanBeforeLoad();
        for(var prop in dataTexts) {
		    if(dataTexts.hasOwnProperty(prop))
		    {
		    	var key = prop;
		    	var value = dataTexts[prop];
		    	if(key == 'languages')
		    	{	
		    		var arrLang = value;
		    		$.each(arrLang, function(index, lang){
		    			var abrLang = index;
		    			var status = lang.access;
		    			var fullLang = lang.name;
		    			addNewLang(abrLang,fullLang,status);
		    		});
		    		var arrRow = $("#container").find('.row').eq(0).children();
		    		var delButton = arrRow.eq(2).find('.delete_lang_btn');
		    		deleteLang(delButton);
		    	}
		    	if(key == 'strings')
	    		{	
	    			var arrStrings = value;
					$.each(arrStrings, function(index, string){
						addRowData(index, string)
					});
	    		}
		    }
		}
    }
    else
        alert("No data exist");

    $('.text').onmousedown = function() {
          this.focus();
    };
}

function textEdited() 
{
    console.log("onEdit");
}




function getDataFromForm ()
{
	var container = $("#translation_id_prop_box");
	var arrTrId = container.find('.tr_id_holder');
	var dataForm = {};
	//verify name of link 
	var linkName = $("#link_name").val();
	if(linkName == ''){
		return false;
	}
	//vrify radio button in link menu
	var addRowsRadioBtn = $("#add_rows_gr").find('.radioBtn');
	var moveRowsRadioBtn = $("#move_rows_gr").find('.radioBtn');

	var isAddRowsRadioBtn = $(addRowsRadioBtn).is(':checked');
	var isMoveRowsRadioBtn = $(moveRowsRadioBtn).is(':checked');
	if(!isAddRowsRadioBtn || !isMoveRowsRadioBtn){
		return false;
	}
	// translations box verify settings 
	var flag = true;
	var arrRO = [];
	var arrRW = [];
	if(arrTrId)
	{
		$.each(arrTrId, function(index, elem){
			var trId = $(elem).find('.form_tr_id');
			if( trId.is(':checked'))
			{
				var trIdVal = trId.val();
				var radioBtn = $(elem).find('.radioBtn');
				if($(radioBtn).is(':checked')) {
				    var values = radioBtn.filter(":checked").val();
				    if(values == 'r'){
				    	arrRO.push(trIdVal);
				    }
				    if(values == 'w'){
				    	arrRW.push(trIdVal);
				    }
					//dataForm[trIdVal] = values;
				}
				else{
					flag = false;
				}
			}
		});
	}
	dataForm.ro_langs = arrRO;
	dataForm.rw_langs = arrRW;
	dataForm.lang_order = arrLangOrder;
	//arrLangOrder = [];

	// if(Object.keys(dataForm).length == 0 || !flag){
	// 	return false;
	// }

	if((arrRO.length == 0 && arrRW.length == 0) || !flag){
		return false;
	}
	var data = encodeURIComponent(JSON.stringify(dataForm));
	$('#form_data_container').val(data);
	return true;
}




////////////////////////////////////////////////////////////////////////////////////////////////
/*
function getDataFromForm ()
{
	var container = $("#translation_id_prop_box");
	var arrTrId = container.find('.tr_id_holder');
	var dataForm = {};
	//verify name of link 
	var linkName = $("#link_name").val();
	if(linkName == ''){
		return false;
	}
	//vrify radio button in link menu
	var addRowsRadioBtn = $("#add_rows_gr").find('.radioBtn');
	var moveRowsRadioBtn = $("#move_rows_gr").find('.radioBtn');

	var isAddRowsRadioBtn = $(addRowsRadioBtn).is(':checked');
	var isMoveRowsRadioBtn = $(moveRowsRadioBtn).is(':checked');
	if(!isAddRowsRadioBtn || !isMoveRowsRadioBtn){
		return false;
	}
	// translations box verify settings 
	var flag = true;
	if(arrTrId)
	{
		$.each(arrTrId, function(index, elem){
			var trId = $(elem).find('.form_tr_id');
			if( trId.is(':checked'))
			{
				var trIdVal = trId.val();
				var radioBtn = $(elem).find('.radioBtn');
				if($(radioBtn).is(':checked')) {
				    var values = radioBtn.filter(":checked").val();
					dataForm[trIdVal] = values;
				}
				else{
					flag = false;
				}
			}
		});
	}
	//var data = JSON.stringify(dataForm);
	if(Object.keys(dataForm).length == 0 || !flag){
		return false;
	}
	var data = encodeURIComponent(JSON.stringify(dataForm));
	$('#form_data_container').val(data);
	return true;
}
*/
/////////////////////////////////////////////////////////////////////////////////////////////////
function setColAccess (col, access) 
{
	var column = col;
	var access = access;
	var indexLang = getIndexCol(column);
	var arrRow = $("#container").find('.row');
	$.each(arrRow, function(index, row){
		if(index > 0)
		{
	    	var indexRow = index;
			var arrRowChildren = arrRow.eq(indexRow).children();
			$.each(arrRowChildren, function(index, child){
				if(index == indexLang)
					setElemAccess(child,access);
			});
		}
	});
}

function getIndexCol (col) 
{
	var selectAct = col.find('select');
	var langAct = selectAct.find(":selected").text();
	var arrRow = $("#container").find('.row');
	var arrRowLangChildren = arrRow.eq(0).children();
	var indexLang;
	$.each(arrRowLangChildren, function(index, child){
		var select = $(child).find('select');
		var lang = select.find(":selected").text();
		var match = langAct.localeCompare(lang);
		if(match == 0)
		{
			indexLang = index;
		}
	});
	return indexLang;
}

function setElemAccess (elem, access)
{
	var elem = $(elem);
	elem = elem.find('.text');
	var access = access;
	//var isEditable = elem.is(':editable');
	if(access == 'ns')
	{

	}
	if(access == 'ro')
	{
		// if(isEditable)
		// 	elem.editable("destroy");
			elem.attr('contenteditable', false);
	}
	if(access == 'w')
	{
		// if(isEditable)
		// 	elem.editable("destroy").editable();
		// else
		// 	elem.editable();
		elem.attr('contenteditable', true);
	}
}

function setFocusOnLastRow (object)
{
	var obj = object;
	var lastRow = $("#container").find('.row').last();
	var idField = lastRow.find('.id');

	obj.find("input").blur();
	//idField.children().click();
	idField.children().focus();
}

function idFieldEnterKey (object) 
{
	var obj = object;
	addRowEmpty();
	setFocusOnLastRow(obj);
	// var $focused = $(':focus');
	// if($focused)
	// {
	// 	var div = $focused.parent().parent();
	// 	if(div.hasClass('id'))
	// 	{
	// 		addRowEmpty();
	// 		//setFocusOnLastRow();
	// 	}
	// }
}

function enterHandler (event,object) 
{
	var obj = object;
	if(obj.hasClass('id'))
	{
		idFieldEnterKey(obj);
		event.stopPropagation();
    	event.preventDefault();
	}
}

function createMainMenuTitle (elem) {
	$('.tbm_title').text('List Actions');
	var contentBox = $('.title_box_content');
	if(elem){
		var titleLang = $(elem).parent().attr('data-lang');
		contentBox.attr('data-lang',titleLang);
	} 
	var ul1 = $('<ul/>', {'class':'tm_list'}).appendTo(contentBox);
	var li1 = $('<li/>').appendTo(ul1);
	var a1 = $('<a/>', {'class':'tm_a_words','html':'Words...'}).appendTo(li1);
	a1.bind('click', function(){
		clearMainMenuTitle();
		//displayWordsBox();
		createWordsMenu();
	});
	//contentBox.append()
}

function clearMainMenuTitle () {
	var contentBox = $('.title_box_content');
	var backBtn = $('.back_menu_btn');
	if(backBtn){
		backBtn.remove();
	}
	$('.tbm_title').text('');
	contentBox.empty();
}

function createWordsMenu () {
	$('.tbm_title').text('List Words');
	var titleBoxHeader = $('.title_box_header');
	var back = $('<span/>', {'class':'fa fa-angle-left back_menu_btn'}).prependTo(titleBoxHeader);
	var titleBoxContent = $('.title_box_content');

	var wordsInCol = $('<span/>', {'class':'words_in_col words_menu_item'}).appendTo(titleBoxContent);
	var wordsNumber = countWordsInCol();
	var wordsNumberStr = "Words: " + wordsNumber;
	wordsInCol.text(wordsNumberStr);

	var symbolsInCol = $('<span/>', {'class':'symbols_in_col words_menu_item'}).appendTo(titleBoxContent);
	var symbolsNumber = countSymbolsInCol();
	var symbolsNumberStr = "Symbols: " + symbolsNumber;
	symbolsInCol.text(symbolsNumberStr);

	var avgSW = $('<span/>', {'class':'avg_sw words_menu_item'}).appendTo(titleBoxContent);
	var avgNumber = avgSymbolsWords(symbolsNumber,wordsNumber);
	var avgSWStr = "AVG symbols/words: " + avgNumber;
	avgSW.text(avgSWStr);

	var rowsInCol = $('<span/>', {'class':'rows_in_col words_menu_item'}).appendTo(titleBoxContent);
	var rowsNumber = countRowsInCol();
	var rowsNumberStr = "Rows: " + rowsNumber;
	rowsInCol.text(rowsNumberStr);

	back.bind('click', function(){
		clearMainMenuTitle();
		//displayWordsBox();
		createMainMenuTitle();
	});
}

function countRowsInCol () {
	var nameCol = $('.title_box_content').attr('data-lang');
	var arrRows = $("#box_rows").find('.row');
	var rowsNum = 0;
	$.each(arrRows, function(index, row){
		var cellCol = $(row).find("[data-lang='" + nameCol + "']");
		var text = cellCol.find('.text').text();
		if(text != "")
		{
			rowsNum += 1;
		}
	});
	return rowsNum;
}

function countWordsInCol () {
	var nameCol = $('.title_box_content').attr('data-lang');
	var arrRows = $("#box_rows").find('.row');
	var wordsNum = 0;
	$.each(arrRows, function(index, row){
		var cellCol = $(row).find("[data-lang='" + nameCol + "']");
		var text = cellCol.find('.text').text();
		var number = countWordsInStr(text);
		wordsNum += number;
	});
	return wordsNum;
}

function countSymbolsInCol () {
	var nameCol = $('.title_box_content').attr('data-lang');
	var arrRows = $("#box_rows").find('.row');
	var symbolsNum = 0;
	$.each(arrRows, function(index, row){
		var cellCol = $(row).find("[data-lang='" + nameCol + "']");
		var text = cellCol.find('.text').text();
		var number = countSymbolsInStr(text);
		symbolsNum += number;
	});
	return symbolsNum;
}

function countSymbolsInStr (s) {
	var length = s.replace(/[^A-ZА-Я0-9]/gi, "").length;
	return length;
}

function avgSymbolsWords (symbols, words){
	var avg = symbols/words;
	//rounding
	avg = Math.round(avg*10)/10
	return avg;
}

function countWordsInStr(s){
	if(s!= '')
	{
	    s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
	    s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
	    s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
    	return s.split(' ').length; 
    }
    else
    {
    	return 0;
    }
}

function displayWordsBox (){
	//$('.tbm_title').text('List Words');

}

function isLastTitle (elem) {
	var title = $(elem).parent();
	if(title.is(':last-child')){
		return true;
	}
	else{
		return false;
	}
}

function showTitleBox(elem) {
	var isLast = isLastTitle(elem);
	var box = $('.title_menu_box');
	var widthBox = box.outerWidth();
	var widthIcon = $('.tmi').width();
	var indent = 6;
	var offsets = $(elem).offset();
	var top = offsets.top;
    var left = offsets.left;
    if(isLast){
    	left = (left - widthBox) + widthIcon + indent;
    }
    else{
    	left += indent;
    }
    box.css({left:left});
    box.fadeIn('fast').css("display","inline-block");
}

function closeTitleMenu (){
	$('.title_menu_box').fadeOut('fast').css("display","none");
}

var previousTarget = null;
function displayTitleBox (elem) {
	var box = $('.title_menu_box');
	var displayBox = box.css("display");
	if(elem===previousTarget){
		//box.fadeOut('fast').css("display","none");
		box.fadeToggle('fast');
	}
	else
	{
		showTitleBox(elem);
	}
	previousTarget = elem;
}


function displayTrIdSetting (elem){
	var parent = $(elem).parent().parent();
    var box = parent.find('fieldset');
    if( $(elem).is(':checked'))
    {
    	box.fadeIn('fast').css("display","inline-block");
    }
    else
    {
    	box.fadeOut('fast').css("display","none");
    }
}




 // function test (){

	// $.ajax({
 //        type: 'POST',
 //        url: '/test',
 //        contentType:"application/json; charset=utf-8",
 //        data:  JSON.stringify({"my_json_data" : 1}),
 //        error: function( jqXHR, textStatus, errorThrown){
 //           alert("error: " + textStatus);
 //        },
 //        success: function(reply){
 //            console.log(reply);
 //        }
 //   }); // AJAX

 // }



function init ()
{
	// document.addEventListener("keydown", displayId, false);

	//test();

	$('.id ').bind('keydown',function(e){
		keyHandler(e);
	});

	$('.lang ').bind('keydown',function(e){
		keyHandler(e);
	});

	$('.lang ').bind('keyup',function(e){
		changeHandler(e);
	});

	$('#add_row_btn').bind('click', function(){
        addRowEmpty();
    });
	
    $('.button_close').on('click',function(){
        deleteRow(this); 
    });
	
    $('#add_lang_btn').bind('click', function(){
    	addLangBoxfade();
    });

	$('#add_link_serv_btn').bind('click', function(){
		addServerLinkfade();
    });

    $('#add_link_btn').bind('click', function(){
    	addLinkBoxfade();
    });
    /*
    $('#container').on('mousedown', function(){
        $('#container').sortable();
    });

     $('#container').on('click', function(){
        $('#container').sortable("destroy");
    });
	*/
	$('#form_link').submit(function() {
        // DO STUFF
        var flag = getDataFromForm();
        if(getDataFromForm ())
        	return true; // return false to cancel form action
        else{
        	alert('fill the form correctly');
        	return false;
        }
    });

	$(':checkbox').change(function() {

        // do stuff here. It will fire on any checkbox change
        //this.value;
        fillLangOrder(this.value);
	}); 

	// window.onkeydown = function(e) {
	//     if(e.keyCode == 32 && e.target.className == 'text') {
	//     	e.stopPropagation();
	//         e.preventDefault();
	//         return false;
	//     }
	// };
	
	// $('.text').on('scroll touchmove mousewheel', function(e){
	//   	e.preventDefault();
	//   	e.stopPropagation();
	//   	return false;
	// });
	

    $('#save_lang_btn').bind('click', function(){
    	// var abrLang = getAbrLang();
    	// var lang = getLang();
    	// var saveOpt = 'w';
    	// addNewLang(abrLang,lang,saveOpt);
    	// addLangBoxfade();
    });

    $('#box_rows').sortable({
    	//placeholder: "ui-state-highlight",
    	//helper:'clone',
    	//cancel:'.text',
    	handle:'img',
    	stop: function (event, ui) {
            console.log("Im stop");
            onChangeRowOrd();
        },
        update: function (event, ui) {

            console.log("Im update");
        }

    });

    $('#box_rows').perfectScrollbar({
        wheelSpeed: 40,
        // wheelPropagation: false
        // wheelSpeed: 20,
  		wheelPropagation: true,
  		minScrollbarLength: 20
  		// scrollXMarginOffset: 200
    });


    $('.text').bind('keydown', function(e){
    	if(e.keyCode == 32 && e.target.className == 'text') {
	    	e.stopPropagation();
	        //e.preventDefault();
	        //return false;
	    }
    });


    // title menu 
    $('html').unbind('click');
    $('html').click(function() {
        var titleMenuBox = $('.title_menu_box');
        // var test = titleMenuBox.css("display");
        if(titleMenuBox.css("display") =='block')
            titleMenuBox.fadeOut('fast');
    });

    $('.title_menu_box').unbind('click');
    $('.title_menu_box').click(function(event) {
        event.stopPropagation();
    });

    $('.tmi').bind('click', function(event){
    	clearMainMenuTitle();
    	createMainMenuTitle(this);
    	displayTitleBox(this);
    	event.stopPropagation();
    });
	$('.tbm_title_close').bind('click', function(){
		closeTitleMenu();
	});

	

	///////////////////////////////


    $('.delete_lang_btn').bind('click', function(){
    	deleteLang(this);
    });

    $('#load_file_btn_wrap').bind('click', function(){
        loadTexts();
    });

    $("#load_file_icon").click(function () {
        $("#load_texts").trigger('click', function(){alert('ok');});
    });

    $(".file1").on('change',loadFromFile);

    $('#save_file_btn_wrap').bind('click', function(){
        saveTexts();
    });

    $('#save_data_link_btn').bind('click', function(){
        saveTranslations();
    });

    $('#save_link_serv_btn').bind('click', function(){
        saveServerLink();
    });
    // var texts = $('#container').find('.text');
    // $('.text').editable({
    //     //closeOnEnter : false,
    //     //callback: textEdited
    // });

    // radio button 
	$('input:radio[name=saveStatus]').change(function() {
		var access = this.value;
	    var parent = $(this).parent().parent();
	    setColAccess(parent,access);
	});

	$('input:checkbox[name=move_rows_gr]').change(function() {
		//var access = this.value;
	    // var parent = $(this).parent().parent();
	    // var test = parent.find('fieldset');
	    //setColAccess(parent,access);
	    displayTrIdSetting(this);
	});



	
	
	//addEditableToCloneRow();
	//addEditableTolastRow();

    // $('html').unbind('click');
    // $('html').click(function() {
	   //  var containerAddLang = $("#box_add_lang");
	   //  if(containerAddLang.css("display") =='block')
	   //     containerAddLang.fadeOut('fast');
    // });
}	
