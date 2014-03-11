function fiscalYearBucket(row, field){
  var year = row[field.dataSource];
  switch (true){
    case (parseInt(year) < 1999):
      return '1990-1999'
    case (parseInt(year) < 2010):
      return '2000-2009'
    case (parseInt(year) < 2013):
      return '2010-2012'
    case (parseInt(year) == 2014):
      return '2014'
    case (parseInt(year) < 2018):
      return '2015-2017'
    case (year === 'LR 2018-2030'):
      return 'LR 2018-2030'
    case (year === 'LR 2031-2040'):
      return 'LR 2031-2040'
    default:
      return '2014-2019'
  }
}
function modelYearBucket(row, field){
  var year = row[field.dataSource];
  switch (true){
    case (year < 2020):
      return '2014-2019'
    case (year < 2030):
      return '2020-2029'
    case (year < 2040):
      return '2030-2039'
    case (year < 2050):
      return '2040-2049'
    default:
      return '2014-2019'
  }
}

// Define the structure of fields, if this is not defined then all fields will be assumed
// to be strings.  Name must match csv header row (which must exist) in order to parse correctly.
var fields = [
    // // filterable fields
    // {name: 'last_name',         type: 'string', filterable: true, filterType: 'regexp'},
    // {name: 'first_name',        type: 'string', filterable: true},
    // {name: 'state',             type: 'string', filterable: true},
    // {name: 'employer',          type: 'string', filterable: true},
    // {name: 'city',              type: 'string', filterable: true},
    // {name: 'invoice_date',      type: 'date',   filterable: true},

    {name: 'ARCID', type: 'string', filterable: true, summarizable: 'count'},
    {name: 'Description', type: 'string', filterable: true},
    {name: 'Jurisdiction', type: 'string', filterable: true},
    {name: 'ModelingNetworkYear', type: 'integer', filterable: true},
    {name: 'Sponsor', type: 'string', filterable: true},
    {name: 'ExistLanes', type: 'string', filterable: true},
    {name: 'ProposedLanes', type: 'string', filterable: true},
    {name: 'Length', type: 'string', filterable: true},
    {name: 'GDOTPI', type: 'string', filterable: true},
    {name: 'Limits', type: 'string', filterable: true},
    {name: 'Status', type: 'string', filterable: true},
    {name: 'ProjectType', type: 'string', filterable: true},
    {name: 'Analysis', type: 'string', filterable: true},
    {name: 'Phase', type: 'string', filterable: true},
    {name: 'PhaseStatus', type: 'string', filterable: true},
    {name: 'FiscalYear', type: 'string', filterable: true},
    {name: 'FundSource', type: 'string', filterable: true},
    // {name: 'Federal', type: 'integer', filterable: true},
    // {name: 'State', type: 'integer', filterable: true},
    // {name: 'Local', type: 'integer', filterable: true},
    // {name: 'Bond', type: 'integer', filterable: true},
    // {name: 'Total', type: 'integer', filterable: true},
    // {name: 'FederalSum', type: 'integer', filterable: true},
    // {name: 'StateSum', type: 'integer', filterable: true},
    // {name: 'LocalSum', type: 'integer', filterable: true},
    // {name: 'BondSum', type: 'integer', filterable: true},
    // {name: 'TotalSum', type: 'integer', filterable: true},
    
    // psuedo fields
    
    // {name: 'invoice_mm', type: 'string', filterable: true, pseudo: true,
    //   pseudoFunction: function(row){
    //       var date = new Date(row.invoice_date);
    //       return pivot.utils().padLeft((date.getMonth() + 1),2,'0')}
    // },
    // {name: 'invoice_yyyy_mm', type: 'string', filterable: true, pseudo: true,
    //   pseudoFunction: function(row){
    //     var date = new Date(row.invoice_date);
    //     return date.getFullYear() + '_' + pivot.utils().padLeft((date.getMonth() + 1),2,'0')}
    // },
    {name: 'ModelingNetworkYear', type: 'string', filterable: true, pseudo: true, columnLabelable: true,pseudoFunction: function(row){ return row.ModelingNetworkYear }},
    // {name: 'FiscalYear', type: 'string', filterable: true, pseudo: true, columnLabelable: true,pseudoFunction: function(row){ return row.FiscalYear }},
     // {name: 'ModelYearBucket', type: 'string', filterable: true, columnLabelable: true, pseudo: true, dataSource: 'ModelingNetworkYear', pseudoFunction: modelYearBucket},
     {name: 'FiscalYearBucket', type: 'string', filterable: true, columnLabelable: true, pseudo: true, dataSource: 'FiscalYear', pseudoFunction: fiscalYearBucket},

    // // summary fields
    {name: 'Federal',     type: 'integer',  rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return accounting.formatMoney(value)}},
    {name: 'State',     type: 'integer',  rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return accounting.formatMoney(value)}},
    {name: 'Local',     type: 'integer',  rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return accounting.formatMoney(value)}},
    {name: 'Bond',     type: 'integer',  rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return accounting.formatMoney(value)}},
    {name: 'Total',     type: 'integer',  rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return accounting.formatMoney(value)}},
    {name: 'FederalSum',     type: 'integer',  rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return accounting.formatMoney(value)}},
    {name: 'StateSum',     type: 'integer',  rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return accounting.formatMoney(value)}},
    {name: 'LocalSum',     type: 'integer',  rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return accounting.formatMoney(value)}},
    {name: 'BondSum',     type: 'integer',  rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return accounting.formatMoney(value)}},
    {name: 'TotalSum',     type: 'integer',  rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return accounting.formatMoney(value)}}
]
var dTable = null;
/* Formating function for row details */
function fnFormatDetails ( oTable, nTr )
{
    var aData = oTable.fnGetData( nTr );
    var sOut = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
    sOut += '<tr><td>Rendering engine:</td><td>'+aData[1]+' '+aData[4]+'</td></tr>';
    sOut += '<tr><td>Link to source:</td><td>Could provide a link here</td></tr>';
    sOut += '<tr><td>Extra info:</td><td>And any further details here (images etc)</td></tr>';
    sOut += '</table>';
     
    return sOut;
}
/*
* Insert a 'details' column to the table
*/
var nCloneTh = document.createElement( 'th' );
var nCloneTd = document.createElement( 'td' );
nCloneTd.innerHTML = '<img src="http://datatables.net/release-datatables/examples/examples_support/details_open.png">';
nCloneTd.className = "center";

$('#pivot-table thead tr').each( function () {
  this.insertBefore( nCloneTh, this.childNodes[0] );
} );

$('#pivot-table tbody tr').each( function () {
  this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
} );

  function setupPivot(input){
    input.callbacks = {afterUpdateResults: function(){
      dTable = $('#results > table').dataTable({
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [ 0 ] }
        ],
        "sDom": "<'row'<'col-md-6'l><'col-md-6'f>>t<'row'<'col-md-6'i><'col-md-6'p>>",
        "iDisplayLength": 10,
        "aLengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "sPaginationType": "bootstrap",
        "oLanguage": {
          "sLengthMenu": "_MENU_ records per page"
        }//,
        // "sScrollX": "100%",
        // "sScrollXInner": "150%",
        // "bScrollCollapse": true
      });
      //new FixedColumns( dTable );
      $('#pivot-table tbody td img').live('click', function () {
        var nTr = $(this).parents('tr')[0];
        if ( dTable.fnIsOpen(nTr) )
        {
            /* This row is already open - close it */
            this.src = "http://datatables.net/release-datatables/examples/examples_support/details_close.png";
            dTable.fnClose( nTr );
        }
        else
        {
            /* Open this row */
            this.src = "http://datatables.net/release-datatables/examples/examples_support/details_open.png";
            dTable.fnOpen( nTr, fnFormatDetails(dTable, nTr), 'details' );
        }
    } );
    }};
    $('#pivot-demo').pivot_display('setup', input);
  };
  function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var str = '';
    var line = '';

    if (1){//($("#labels").is(':checked')) {
        var head = array[0];
        if ($("#quote").is(':checked')) {
            for (var index in array[0]) {
                var value = index + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[0]) {
                line += index + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }

    for (var i = 0; i < array.length; i++) {
        var line = '';

        if (1){//($("#quote").is(':checked')) {
            for (var index in array[i]) {
                var value = array[i][index] + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[i]) {
                line += array[i][index] + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    return str;
    
}


  var someLink = window.location || window.webkiURL//window.location//'http://0.0.0.0:4000/explore/pivot/download.json' //window.location
  var formBlob = null
  var csv = ''
  function exportResults(type) {
    var name = 'results.' + type
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    var json = pivot.results().all()
    if (type === 'json'){
      // alert('Exporting results as ' + type + '.')
      formBlob = new Blob([JSON.stringify(json)], { type: 'octet/stream' });

      url = window.URL.createObjectURL(formBlob);
    }
    else if (type === 'csv'){
      // alert('Exporting results as ' + type + '.')
      csv = JSON2CSV(json)
      formBlob = new Blob([csv], { type: 'text/csv',filename:'MyVerySpecial.csv' });

      url = window.URL.createObjectURL(formBlob);
    }
    else if (type === 'pdf'){
      alert('Exporting results as ' + type + '.')
      // use jsPDF library!
    }
    a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
  }
  

  $(document).ready(function() {

    setupPivot({url:'/projects/TIP/projects.csv', fields: fields, filters:{"FiscalYear":"2014"}, rowLabels:['ARCID', 'Jurisdiction', 'ProjectType', 'Phase', 'Status'], summaries:["Total"]})
    

    // prevent dropdown from closing after selection
    $('.stop-propagation').click(function(event){
      event.stopPropagation();
    });

    // **Sexy** In your console type pivot.config() to view your current internal structure (the full initialize object).  Pass it to setup and you have a canned report.
    $('#atl-project-funding').click(function(event){
      $('#pivot-demo').pivot_display('reprocess_display', {filters:{"Jurisdiction":"City of Atlanta"}, rowLabels:["ProjectType"], columnLabels:["ModelingNetworkYear"], summaries:["Total"]})
    });

    $('#cobb-phase-funding').click(function(event){
      $('#pivot-demo').pivot_display('reprocess_display', {filters:{"Jurisdiction":"Cobb County"},rowLabels:["Phase","ModelingNetworkYear"], summaries:["Total"]})
    });

    $('#fy-category-funding').click(function(event){
      $('#pivot-demo').pivot_display('reprocess_display', {rowLabels:["FundSource"],columnLabels:["FiscalYearBucket"],summaries:["Total"]})
    });
  });