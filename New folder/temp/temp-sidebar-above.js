$(function(){
    $('#demo').mobiscroll().date({
        theme: 'android-ics',
        display: 'modal',
        mode: 'mixed',
        invalid: [ 'w0', 'w6', '5/1', '12/24', '12/25' ]
    });    
    $('#show').click(function(){
        $('#demo').mobiscroll('show'); 
        return false;
    });
    $('#clear').click(function () {
        $('#demo').val('');
        return false;
    });
});