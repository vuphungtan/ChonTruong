/** ********************************************** **
	Scripts: Page Chon Truong
*************************************************** **/

$(document).ready(function() {
    (function initTable3() {
        var table = jQuery('#tableResults');

        /* Formatting function for row expanded details */
        function fnFormatDetails(oTable, nTr) {
            var aData = oTable.fnGetData(nTr);
            var sOut = '';
            sOut += 'Platform(s):   ' + aData[2];
            sOut += 'Engine version:    ' + aData[3];
            sOut += 'CSS grade: ' + aData[4];
            sOut += '';
            sOut += 'Others:    Could provide a link here';

            return sOut;
        }

        /*
         * Insert a 'details' column to the table-checkbox
         */
        // var nCloneTh = document.createElement('th');
        // nCloneTh.className = "table-checkbox";

        // var nCloneTd = document.createElement('td');
        // nCloneTd.innerHTML = '<span class="row-details row-details-close"></span>';

        // table.find('thead tr').each(function () {
        //     this.insertBefore(nCloneTh, this.childNodes[0]);
        // });

        // table.find('tbody tr').each(function () {
        //     this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
        // });

        var oTable = table.dataTable({
            "aoColumnDefs": [ {
              "aTargets": [ 4 ],
              "mRender": function ( data, type, full ) {
                return '<a href="#"><i class="fa fa-close"></i></a>';
              }
            } ],
            // "columnDefs": [{
            //  "orderable": false,
            //  "targets": [0]
            // }],
            "order": [
                [0, 'asc']
            ],
            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 10,
        });

        var tableWrapper = jQuery('#sample_4_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
        var tableColumnToggler = jQuery('#sample_4_column_toggler');

        /* modify datatable control inputs */
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown

        /* Add event listener for opening and closing details
         * Note that the indicator for showing which row is open is not controlled by DataTables,
         * rather it is done here
         */
        table.on('click', ' tbody td .row-details', function () {
            var nTr = jQuery(this).parents('tr')[0];
            if (oTable.fnIsOpen(nTr)) {
                /* This row is already open - close it */
                jQuery(this).addClass("row-details-close").removeClass("row-details-open");
                oTable.fnClose(nTr);
            } else {
                /* Open this row */
                jQuery(this).addClass("row-details-open").removeClass("row-details-close");
                oTable.fnOpen(nTr, fnFormatDetails(oTable, nTr), 'details');
            }
        });

        /* handle show/hide columns*/
        jQuery('input[type="checkbox"]', tableColumnToggler).change(function () {
            /* Get the DataTables object again - this is not a recreation, just a get of the object */
            var iCol = parseInt(jQuery(this).attr("data-column"));
            var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
            oTable.fnSetColumnVis(iCol, (bVis ? false : true));
        });
    })();

    // Table Init
    // initTable3();
});