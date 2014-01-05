$(function(){
    var inputName = $('form[name="NewThreadForm"] textarea').attr('name');
    $('form[name="NewThreadForm"] textarea').CCEDITOR({
        inputName: inputName
    });


})