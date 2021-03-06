// init search table
$(function() {
    oTable = $('#keihi-table-show').DataTable({
        "pagingType": "full_numbers"
        , "oLanguage": {
            "sUrl": "../../assets/resource/dataTable_"+$('#language').text()+".txt"
        },
        "scrollX": true
    //, "aoColumnDefs": [
    //    {"bSortable": false, "aTargets": [6, 7, 8]},
    //    {
    //        "targets": [6, 7, 8],
    //        "width": '15px'
    //    }
    //],
    //"columnDefs": [{
    //    "targets": 'no-sort',
    //    "orderable": false
    //}]

    });

    oKaisha_search_modal = $('#kaisha-table-modal').DataTable({
        "pagingType": "simple_numbers"
        ,"oLanguage":{
            "sUrl": "../../assets/resource/dataTable_"+$('#language').text()+".txt"
        }
    });

    oKikan_search_modal = $('#kikan-table-modal').DataTable({
        "pagingType": "simple_numbers"
        ,"oLanguage":{
            "sUrl": "../../assets/resource/dataTable_"+$('#language').text()+".txt"
        }
    });

    oEki_search_modal = $('#eki-table-modal').DataTable({
        "pagingType": "simple_numbers"
        ,"oLanguage":{
            "sUrl": "../../assets/resource/dataTable_"+$('#language').text()+".txt"
        }
    });

    oJob_search_modal = $('#job_table').DataTable({
        "pagingType": "simple_numbers"
        ,"oLanguage":{
            "sUrl": "../../assets/resource/dataTable_"+$('#language').text()+".txt"
        }
    });
    oMyjobTable = $('#myjob_table').DataTable({
        "pagingType": "simple_numbers"
        ,"oLanguage":{
            "sUrl": "../../assets/resource/dataTable_"+$('#language').text()+".txt"
        },
        "order": [[ 5, "desc" ]]
    });
    oMykaishaTable = $('#mykaisha_table').DataTable({
        "pagingType": "simple_numbers"
        ,"oLanguage":{
            "sUrl": "../../assets/resource/dataTable_"+$('#language').text()+".txt"
        },
        "order": [[ 4, "desc" ]]
    });
    oEvent_sanshou_modal = $('#event_sanshou_table').DataTable({
        "pagingType": "simple_numbers"
        ,"oLanguage":{
            "sUrl": "../../assets/resource/dataTable_"+$('#language').text()+".txt"
        }
    });
});


//binding color picker and refer master
// $(function(){
//     $('#keihihead_清算予定日').datetimepicker({
//         format: 'YYYY/MM/DD',
//         widgetPositioning: {
//           horizontal: 'left',
//           vertical: 'bottom'
//         },
//         //inline: true,
//         //widgetParent: 'container-fluid',
//         showTodayButton: true,
//         showClear: true,
//         //,daysOfWeekDisabled:[0,6]
//         calendarWeeks: true,
//         keyBinds: false,
//         focusOnShow: false

//     });
// });

//shinshei retrieve
$(function(){
    $('#keihihead_日付').keydown( function(e) {
        if (e.keyCode == 9 && !e.shiftKey) {
            var date = $(this).val();
            jQuery.ajax({
                url: '/keihiheads/ajax',
                data: {id: 'getshinshei',date: date},
                type: "POST",
                // processData: false,
                // contentType: 'application/json',
                success: function(data) {
                    $('#keihihead_申請番号').empty();
                    data.listshinshei.forEach(function (item, index, array) {
                        $('#keihihead_申請番号').append('<option value=' + item + '>' + item + '</option>');
                    });
                },
                failure: function() {
                }
            });
        }
    });

    $('#search-shinshei').click(function() {
        var date = $('#keihihead_日付').val();
        jQuery.ajax({
            url: '/keihiheads/ajax',
            data: {id: 'getshinshei',date: date},
            type: "POST",
            // processData: false,
            // contentType: 'application/json',
            success: function(data) {
                $('#keihihead_申請番号').empty();
                data.listshinshei.forEach(function (item, index, array) {
                    $('#keihihead_申請番号').append('<option value=' + item + '>' + item + '</option>');
                });
            },
            failure: function() {
            }
        });
    });

    $('input').keydown(function (e) {
        if (e.keyCode == 13) {
            if (!$('.keihihead-update').is( ":focus" )) {
                e.preventDefault();
            }
        }

    });
    // $('.keihihead_keihibodies_JOB .search-field').click(function() {

    //     $('#job_search_modal').modal('show')


    // });


    // $('.search-history-job').click(function() {
    //     $('#myjob_search_modal').modal('show')
    // });

    $('#job_sentaku_ok').click(function(){

        var job = oJob_search_modal.row('tr.selected').data();
        $('#keihi-table tr.selected').find('.keihihead_keihibodies_JOB').find('input').val(job[0])
        var shain = $('#keihihead_keihibodies_attributes_0_社員番号').val();
        $.ajax({
            url: '/keihiheads/ajax',
            data: {id: 'job_selected',myjob_id: job[0],shain: shain},
            type: "POST",

            success: function(data) {
               if(data.time_update != null){
                    console.log("getAjax time update:"+ data.time_update);
                    var table = $('#myjob_table').DataTable();
                    // table.row.add( [shain,job[0],job[1],job[2],job[3],data.time_update] ).draw( false );
                    var rowId = $('#myjob_table').dataTable().fnFindCellRowIndexes(job[0], 1);
                    if(rowId!= '')
                        table.cell(rowId, 5).data(data.time_update).draw(false);
                    else
                        table.row.add( [shain,job[0],job[1],job[2],job[3],data.time_update] ).draw( false );

                }
            },
            failure: function() {
                console.log("job_selected keydown Unsuccessful");
            }
        });
    });

    $('#myjob_destroy').click(function (){
        var myjob = oMyjobTable.row('tr.selected').data();
        var shain = $('#keihihead_keihibodies_attributes_0_社員番号').val();
        $.ajax({
            url: '/keihiheads/ajax',
            data: {id: 'myjob_destroy',myjob_id: myjob[1],shain: shain},
            type: "POST",

            success: function(data) {

                if(data.destroy_success != null){
                    console.log("getAjax destroy_success:"+ data.destroy_success);
                    $("#myjob_table").dataTable().fnDeleteRow($('#myjob_table').find('tr.selected').remove());
                    $("#myjob_table").dataTable().fnDraw();
                }

            },
            failure: function() {

                console.log("myjob_destroy keydown Unsuccessful");
            }
        });

    });

    $('#myjob_sentaku_ok').click(function(){
        var d = oMyjobTable.row('tr.selected').data();
        $('#keihi-table tr.selected').find('.keihihead_keihibodies_JOB').find('input').val(d[1]);
    });

    $('#clear_job').click(function () {
        $('#keihi-table tr.selected').find('.keihihead_keihibodies_JOB').find('input').val('');
        oJob_search_modal.$('tr.selected').removeClass('selected');
        oJob_search_modal.$('tr.success').removeClass('success');
    } );
    $('#clear_event').click(function () {
        $('#keihi-table tr.selected').find('.keihihead_keihibodies_JOB').find('input').val('');
        $('#keihi-table tr.selected').find('.keihihead_keihibodies_相手先').find('input').val('');
        oEvent_sanshou_modal.$('tr.selected').removeClass('selected');
        oEvent_sanshou_modal.$('tr.success').removeClass('success');
    } );

    $('#clear_myjob').click(function () {
        $('#keihi-table tr.selected').find('.keihihead_keihibodies_JOB').find('input').val('');
        oMyjobTable.$('tr.selected').removeClass('selected');
        oMyjobTable.$('tr.success').removeClass('success');
    } );

    $('#koutei_sentaku_ok').click(function(){

        var kaisha = oKaisha_search_modal.row('tr.selected').data();
        $('#keihi-table tr.selected').find('.keihihead_keihibodies_相手先').find('input').val(kaisha[1])
        var shain = $('#keihihead_keihibodies_attributes_0_社員番号').val();
        $.ajax({
            url: '/keihiheads/ajax',
            data: {id: 'kaisha_selected',mykaisha_id: kaisha[0],shain: shain},
            type: "POST",

            success: function(data) {
               if(data.time_update != null){
                    console.log("getAjax time update:"+ data.time_update);
                    var table = $('#mykaisha_table').DataTable();
                    // table.row.add( [shain,job[0],job[1],job[2],job[3],data.time_update] ).draw( false );
                    var rowId = $('#mykaisha_table').dataTable().fnFindCellRowIndexes(kaisha[0], 1);
                    if(rowId!= '')
                        table.cell(rowId, 4).data(data.time_update).draw(false);
                    else
                        table.row.add( [shain,kaisha[0],kaisha[1],kaisha[2],data.time_update] ).draw( false );

                }
            },
            failure: function() {
                console.log("kaisha_selected keydown Unsuccessful");
            }
        });
    });
    $('#mykaisha_destroy').click(function (){
        var mykaisha = oMykaishaTable.row('tr.selected').data();
        var shain = $('#keihihead_keihibodies_attributes_0_社員番号').val();
        $.ajax({
            url: '/keihiheads/ajax',
            data: {id: 'mykaisha_destroy',mykaisha_id: mykaisha[1],shain: shain},
            type: "POST",

            success: function(data) {

                if(data.destroy_success != null){
                    console.log("getAjax destroy_success:"+ data.destroy_success);
                    $("#mykaisha_table").dataTable().fnDeleteRow($('#mykaisha_table').find('tr.selected').remove());
                    $("#mykaisha_table").dataTable().fnDraw();
                }

            },
            failure: function() {

                console.log("mykaisha_destroy keydown Unsuccessful");
            }
        });

    });

    $('#mykaisha_sentaku_ok').click(function(){
        var d = oMykaishaTable.row('tr.selected').data();
        $('#keihi-table tr.selected').find('.keihihead_keihibodies_相手先').find('input').val(d[2]);
    });

    $('#clear_kaisha').click(function () {
        $('#keihi-table tr.selected').find('.keihihead_keihibodies_相手先').find('input').val('')
        oKaisha_search_modal.$('tr.selected').removeClass('selected');
        oKaisha_search_modal.$('tr.success').removeClass('success');
    } );

    $('#clear_mykaisha').click(function () {
        $('#keihi-table tr.selected').find('.keihihead_keihibodies_相手先').find('input').val('');
        oMykaishaTable.$('tr.selected').removeClass('selected');
        oMykaishaTable.$('tr.success').removeClass('success');
    } );
    $('#event_sentaku_ok').click(function(){

        var event = oEvent_sanshou_modal.row('tr.selected').data();
        // $('#keihi-table tr.selected').find('.keihihead_keihibodies_相手先').find('input').val(event[3])
        if(event!=undefined){
            jQuery.ajax({
                url: '/keihiheads/ajax',
                data: {id: 'event_selected',event_id: event[0]},
                type: "POST",
                // processData: false,
                // contentType: 'application/json',

                success: function(data) {
                    if(data.job != null){
                        $('#keihi-table tr.selected').find('.keihihead_keihibodies_相手先').find('input').val(data.aitesaki)
                        $('#keihi-table tr.selected').find('.keihihead_keihibodies_JOB').find('input').val(data.job)
                    }
                    console.log("getAjax kintai_id:");
                },
                failure: function() {
                    console.log("kintai_保守携帯回数 keydown Unsuccessful");
                }
            });
        }

    });

    // $('.event_sanshou').click(function(){


    //     // jQuery.ajax({
    //     //     url: '/keihiheads/ajaxsss',
    //     //     data: {id: 'get_events',date: date_input},
    //     //     type: "POST",
    //     //     // processData: false,
    //     //     // contentType: 'application/json',
    //     //     success: function(data) {
    //     //         $('#event_sanshou_modal').modal('show');
    //     //     },
    //     //     failure: function() {
    //     //     }
    //     // });
    // })
        // var events = oEvent_sanshou_modal.rows('tr').data();
        // var date_input = $('#keihi-table tr.selected td:nth-child(1)').find('input').val();
        // date_input = $('#keihihead_keihibodies_attributes_0_日付').val();
        // alert("date_input")

        // date_input =
        // if( events.length > 0){
        //     for (var i = 0; i < events.length; i++) {
        //         date =
        //     }
        // }
        //           for i in [0...len]
        //             if events[i][4] == "1" || events[i][6] != shain
        //               rowId = $('.keihihead-table').dataTable().fnFindCellRowIndexes(events[i][0], 0);
        //               thisRow = oKeihiheadTable.row(rowId).nodes().to$()
        //               if $(thisRow).hasClass('selected')
        //                 $(thisRow).removeClass('selected')
        //                 $(thisRow).removeClass('success')

        //         $(".keihihead-table").dataTable().fnDeleteRow($('.keihihead-table').find('tr.selected').remove())
        //         $(".keihihead-table").dataTable().fnDraw()
        // $("#event_sanshou_table").dataTable().fnDeleteRow($('#event_sanshou_table').find('tr.selected').remove());
        // $("#event_sanshou_table").dataTable().fnDraw();
        // $('#event_sanshou_modal').modal('show');


});

$(document).on('click', '.event_sanshou', function(event){
    var events = oEvent_sanshou_modal.rows('tr').data();
    var date = $(this).closest('tr').find('.datepicker').val();
    if(date != ''){
        var date_input = moment(date, 'YYYY/MM/DD HH:mm').subtract('days',14).format('YYYY/MM/DD HH:mm');
        var shain = $('#keihihead_社員番号').val();
        jQuery.ajax({
            url: '/keihiheads/ajax',
            data: {id: 'get_events',date_input: date_input, shain: shain},
            type: "POST",
            // processData: false,
            // contentType: 'application/json',

            success: function(data) {

                console.log("getAjax kintai_id:");
            },
            failure: function() {
                console.log("kintai_保守携帯回数 keydown Unsuccessful");
            }
        });
    }else{
        swal("日付を入力してください。");
    }


});
$(document).on('click', '.keihihead_keihibodies_JOB .search-field', function(event){

    $('#job_search_modal').modal('show')
    event.preventDefault();
});

$(document).on('click', '.keihihead_keihibodies_JOB .search-history-job', function(event){

    $('#myjob_search_modal').modal('show')
    event.preventDefault();
});

$(document).on('click', '.keihihead_keihibodies_相手先 .search-field', function(event){

    $('#kaisha-search-modal').modal('show')
    event.preventDefault();
});

$(document).on('click', '.keihihead_keihibodies_相手先 .search-history-job', function(event){

    $('#mykaisha_search_modal').modal('show')
    event.preventDefault();
});


