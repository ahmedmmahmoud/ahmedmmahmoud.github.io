/**
 * Creating a slider
 * 
 **/
var $ = jQuery.noConflict();
$(function(){
	var pos = 0;
	var prev = 0;
	var next = 0;
	var hidden = 0;
	$('.slide-prev').on('click', function(){
		// console.log($(this).parent().find('.slide'));
		slide($(this).parent().find('.slides'), 0);
	});

	$('.slide-next').on('click', function(){
		// console.log($(this).parent().find('.slide'));
		slide($(this).parent().find('.slides'), 1);
	});

	var getClilds = function(parent){
		// console.log(parent.children());
		// console.log(parent.children().length);
		return parent.children().length;
	}

	var slide = function (parent, step){
		var totalItms = getClilds(parent);
		var parentWidth = parent.parent().outerWidth();
		var sliderWidth = parent.width();
		var itemWidth = parseInt(parent.children().first().width());
		itemWidth = itemWidth + parseInt(parent.children().first().css('margin-left')) + parseInt(parent.children().first().css('margin-right')) + parseInt(parent.children().first().css('padding-left')) + parseInt(parent.children().first().css('padding-right'));
		pos = parseInt(parent.css('left'));

		if(pos == 0 || isNaN(pos)){
			prev = 0 ;
		}else{
			prev = Math.abs(Math.round(pos / itemWidth));
		}
		var showing = Math.round(parentWidth / itemWidth);
		hidden = (totalItms - showing);

console.log(itemWidth);
console.log(prev);
		// if(sliderWidth > ((pos*-1) + (itemWidth*showing)) && pos <= 0){
		if(prev <= hidden-1 && step == 1){
			++prev;
			// pos = pos - itemWid
		}else if(prev > 0 &&  0===step){
			--prev;
			// pos = pos + itemWidth;
		}
		pos = prev * itemWidth;
		pos = pos * -1;
console.log(pos);
		parent.css('left', pos+'px');
	}
});