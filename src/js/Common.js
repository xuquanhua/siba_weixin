/**
 * Created by kingsoft on 2016/11/18.
 */
/*radio*/
$('.radio').on('click', function(){
    console.log('haa')
    $this = $(this)
    $this.addClass('radio-checked')
    $this.siblings('label').removeClass("radio-checked")
    var forId = $this.attr('for')
    var name = $this.attr('name')
    $("#"+forId).prop("checked", true)
    $("#"+forId).siblings("[name="+name+"]").prop("checked", false)
})