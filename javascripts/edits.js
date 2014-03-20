---

---
"use strict";
var grid;
var row;
var changes = [];
var values;
var Territory;
var Territories;
var columns
var rowNum;
var territories
function backgridTable(data){
   "use strict";
   $('#example-1-result').empty()
  	Territory = Backbone.Model.extend({});
    
  	Territories = Backbone.Collection.extend({
      comparator: 'index',
  	  model: Territory
  	});
    // console.log(JSON.stringify(data))
    $.each(data, function(i, row){
      row.index = i + 1
    })
  	territories = new Territories(data);
    var i = 0
    
  	columns = [
    {
      name: "index",
      label: "#",
      cell: "integer",
      editable: false, 
      // 
      sortable: false
    },
    {
      name: "Phase",
      label: "Phase",
      cell: 
      Backgrid.SelectCell.extend({
      // It's possible to render an option group or use a
      // function to provide option values too.
        optionValues:[
          {% for phase in site.data.phases %}
              ["{{ phase.id }}", "{{ phase.id }}"],
          {% endfor %}
        ]
      }),
      // editable: false,  false], [
      editable: edit,
      sortable: false
    },
    {
      name: "Auth",
      label: "Auth",
      cell: "string",
      editable: edit,
      sortable: false
    },
    {
      name: "FY",
      label: "FY",
      cell: "string",
      editable: edit,
      sortable: false
    },
    {
      name: "FundSource",
      label: "FundSource",
      cell: Backgrid.SelectCell.extend({
      // It's possible to render an option group or use a
      // function to provide option values too.
        optionValues:[
          {% for fundsource in site.data.fundsources %}
              ["{{ fundsource.name }}", "{{ fundsource.name }}"],
          {% endfor %}
        ]
}),
      editable: edit,
      sortable: false
    },
    {
      name: "Federal",
      label: "Federal",
      cell: "string",
      editable: edit,
      sortable: false
    },
    {
      name: "State",
      label: "State",
      cell: "string",
      editable: edit,
      sortable: false
    },
    {
      name: "Local",
      label: "Local",
      cell: "string",
      editable: edit,
      sortable: false
    },
    {
      name: "Bond",
      label: "Bond",
      cell: "string",
      editable: edit,
      sortable: false
    },
    {
      name: "Total",
      label: "Total",
      cell: "string",
      editable: edit,
      sortable: false
    }];
  // Suppose you want to highlight the entire row when an editable field is focused
  var FocusableRow = Backgrid.Row.extend({
    highlightColor: 'lightYellow',
    events: {
      focusin: 'rowFocused',
      focusout: 'rowLostFocus'
    },
    rowFocused: function() {
      this.$el.css('background-color', this.highlightColor);
      // $('#delete-row').removeAttr('disabled')
      row = this
    },
    rowLostFocus: function() {
      this.$el.removeAttr('style');

      // $('#delete-row').attr('disabled', 'disabled')

      // Goofy way to handle the 
      // setTimeout(function(){
      //   row = undefined
      // }, 1000) 
    }
  });

  // Initialize a new Grid instance
  grid = new Backgrid.Grid({
    row: FocusableRow, // <-- Tell the Body class to use FocusableRow to render rows.
    columns: columns,
    collection: territories
  });
  var count = 0;
  grid.collection.on('backgrid:edited', function(model, selected) { 
     var field = selected.attributes.name
     var previous = model._previousAttributes[field]
     var current = model.attributes[field]
     var id = model.attributes['ARCID']
     var lineNumber = model.attributes.index + 1
     // console.log(lineNumber)
     console.log(selected)
     console.log(model)
     // These first two if statements need some work!
     if (previous === undefined && current === '')
        console.log("nothing changed!")
     else if (previous === undefined)
        console.log("nothing changed!")
     else if (previous != current){
        var message = model.attributes['Phase'] + " phase <strong>"+field+"</strong> changed from <em>"+previous+"</em> to <em>"+current +"</em>"
        console.log()
        var issueMessage = "* [" + strip(message) + "](https://github.com/{{ site.githubuser }}/plan-it/blob/gh-pages/data/TIP/individual/"+ id +".csv#L" + lineNumber + ")"
        changes.push(newChange("edit-" + field, model, message, issueMessage))
        updateMessages(changes, false)
        $('.change').removeAttr('disabled')
        count++
     }
  });
  // Render the grid and attach the root to your HTML document
  grid.collection = grid.collection.sort("index", "descending")
  $("#example-1-result").append(grid.render().$el);

  // Fetch some countries from the url
  // territories.fetch({reset: true});
}
// Disable function
jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            this.disabled = state;
        });
    }
});

var messages = []
var tables = {}
var edit = false
var segments = [];
$('#undo-changes').click(function(){
  $("div.panel").remove()
})
$('#submit-changes').click(function(){
  alert('Your changes have been submitted!')
})
$('.add-street').live('click', function(){
	var rc = $(this).attr('id')
  var fc = ''
  segments.push(rc)
  $('.edits').removeAttr('disabled');
  $(this).attr('disabled', 'disabled')
	// console.log(this.attr(id))
	$.each(raw.features, function(i, feature){
		if (rc == feature.properties.RCLINK){
			console.log(feature.properties.F_SYSTEM)
      fc = feature.properties.F_SYSTEM
    }

	})
	$('#change-list').append(' \
		<div class="panel panel-default"> \
			<div class="panel-heading">RC '+ rc + '<button type="button" data-value="'+rc+'" title="Remove street segment to edits" class="pull-right btn btn-xs btn-danger remove-street"><span class="glyphicon glyphicon-minus-sign"></span></button></div> \
				<div class="panel-body">' + //rc + 
          '<div class="checkbox"> \
            <label> \
              <input type="checkbox"> Entire segment? \
            </label> \
          </div> \
          <div class="form-group intersection"> \
            <label for="fromIntersection">From Intersection</label> \
            <input type="text" class="form-control" id="fromIntersection" placeholder="Memorial Dr SE"> \
            <label for="toIntersection">To Intersection</label> \
            <input type="text" class="form-control" id="toIntersection" placeholder="Glenwood Ave SE"> \
          </div> \
          <div class="row"> \
          <div class="form-group col-md-9"> \
            <label for="fcSelect-'+rc+'">Functional Class</label> \
            <select id="fcSelect-'+rc+'" class="form-control"> \
              <option>1</option> \
              <option>2</option> \
              <option>3</option> \
              <option>4</option> \
              <option>5</option> \
              <option>6</option> \
              <option>7</option> \
            </select> \
          </div> \
        </div> \
        <div class="form-group"> \
            <label for="justification">Justification</label> \
            <textarea rows="3" type="text" class="form-control" id="justification" placeholder="Please provide justification for this functional class change"></textarea> \
          </div> \
			</div> \
		</div>');

    $('#fcSelect-'+rc).val('fc')
		//'<li data-options=\'' + '{"id":"' + this.id + '"}\'>' + this.id + '<button type="button" title="Remove street segment to edits" class="btn btn-xs btn-danger remove-street"><span class="glyphicon glyphicon-minus-sign"></span></button></li>')
})
$('.remove-street').live('click', function(){
	$(this).closest("div.panel").remove();
  console.log($(this).data('value'))
  segments.indexOf()
})
$(':checkbox').live('change', function() {
    // do your staff here. It will fire any checkbox change
    $('.intersection').toggle();
});
  $('#issue-title').tooltip({title:'don\'t change this!'})
  $('#begin-edits').tooltip({title:'Click to toggle editing mode'})
  // $('.tooltip').tooltip()
  $('#myTab a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
  $('#project-pill a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
  
  $('#gh-view-issues').click(function () {
    window.location = 'https://github.com/{{ site.githubuser }}/plan-it/search?q='+id+'&type=Issues'
  })
  $('#issues-tab').click(function () {
    console.log("issues tab")
    if(jQuery.isEmptyObject(issues)){
      $.get("https://api.github.com/repos/{{ site.githubuser }}/plan-it/issues?"+token, function (issuesData) {
        issues = issuesData
        console.log(issues[0].body)
        populateIssues()
      });
    }
    else{
      populateIssues()
    }
  })
  var issues = {};
  var previous;
  var id;
  var historyClick = false
    $("select").focus(function () {
        // Store the current value on focus and on change
        previous = this.value;
    })

  $('.fiscal-year').change(function(){
    var value = $('.fiscal-year').val()
    if (value != previous){
      $('#issue-title').attr('placeholder', id + ': change fiscal year from ' + previous + ' to ' + value)
      $('.issue').attr("disabled", true)
      $('#delay').attr('disabled', false)
    }
    else{
      // issue-title is vestigial!
      $('#issue-title').attr('placeholder', id)
      $('.issue').attr("disabled", false)
    }

  })
  $('td').live('click', function(){
    var col = $(this).parent().children().index($(this));
    var row = $(this).parent().parent().children().index($(this).parent());
    // alert('Row: ' + parseInt(row+2) + ', Column: ' + col);
    rowNum = parseInt(row+2)
  });
  // Old issue stuff
  // $('.issue').click(function(){
  //   var title = id
  //   var body = $('#issue-body').val() ? $('#issue-body').val() : ''

  //   // Properly transmit new lines to github issues
  //   body = body.replace(/\n/g, '%0A');
  //   body = body.replace(/#/g, '%23');
  //   window.location='https://github.com/{{ site.githubuser }}/plan-it/issues/new?title='+title+'&body='+body+'&labels='+this.id
  // })
  $('#begin-edits').click(function(){
    edit = !edit
    if(edit){
      $('.login-prompt').hide()
      $('.edit').fadeIn(250)
      $('#begin-edits').addClass('active')

    }
    else{
      $('.edit').fadeOut(250)
      $('#begin-edits').removeClass('active')
    }
    $.each(grid.columns.models, function(i, col){
      if (col.attributes.name !== "index")
        col.attributes.editable = ! col.attributes.editable
    })
  })
  // $('.btn').button()
  $('#issueModal').on('hidden.bs.modal', function () {
    $('#submit-issue').text('Submit')
    $('#submit-issue').removeAttr('disabled')
    $('#issue-modal-success').hide()
  })
  var repo = github.getRepo('{{ site.githubuser }}', 'plan-it');
  var token = $.cookie('token') ? '&access_token=' + $.cookie('token') : ""
  var postData
  var newRows = []
  $('#submit-issue').click(function(){
    $(this).text('Submitted')
    $(this).attr('disabled','disabled')

    var title = id
    var body;
    $.each(changes, function(i, change){
      if (i === 0){
        body = change.markdown
      }
      else{
        body += "\n" + change.markdown
      }
    })
    var comments = $('#issue-comments').val() ? $('#issue-comments').val() : "Updated " + id

    body = "**Changes:**\n" + body + '\n\n' + "**Comments**\n"+ comments
    // Properly transmit new lines to github issues ***only for sending in old method!
    // body = body.replace(/\n/g, '%0A');
    // body = body.replace(/#/g, '%23');

    var gridCopy = new Backbone.Collection();
    grid.collection.each(function(studentModel) {
      gridCopy.add(new Backbone.Model(studentModel.toJSON()));
    });
    // console.log(gridCopy)
    $.each(gridCopy.models, function(i, value){
      delete value.attributes["index"]
      newRows.push(value.attributes)
    })
    postData = JSON2CSV(newRows)
    console.log(postData)
    console.log(grid.collection.models)

    // Check if repo exists for logged-in user
    var userRepo = github.getRepo($.cookie('user').login, 'plan-it')
    userRepo.show(function(err, data){
    console.log(err)
    var username = $.cookie('user').login
    var patchNum = 1
    var base = 'gh-pages'
    var newBranch = id.toLowerCase() + '-patch-' + patchNum
    var pull = {
        "title": title,
        "body": body,
        "base": base,
        "head": username + ':' + newBranch
    };
      
      // If the repo doesn't exist, fork the repo... and then branch and pull
      if (err && err.error==404){
        repo.fork(function(err){
          console.log("forking repo...")
          console.log(err)
          // userRepo.show(function(err, data){console.log(data)})
          branchAndPull(repo, userRepo, $.cookie('user').login, title, body, comments, base, id.toLowerCase())
          
        })
      }
      // If the repo does exist, check if the branch exists.
      else{
        console.log("repo exists already!")
        console.log(data)
        userRepo.listBranches(function(err, branches) {
          // If branch exists, write to the branch and then call success.
          if(_.contains(branches, newBranch)){
            console.log('branch exists already!')
            userRepo.write(newBranch, 'data/TIP/individual/'+id+'.csv', postData, comments, function(err) {
              console.log(err)
              if(err){
                  $('#issue-modal-title').html('Hmmm...something went wrong with creating your new branch.  Please tweet at <a href="https://twitter.com/eltiar">Landon Reed</a> for help.')
                }
              // Check list of existing pull requests to find the correct url to send the user to.
              else{
                
                userRepo.listPulls('open', function(err, pulls) {
                  var oldPull;
                  $.each(pulls, function(i, obj){
                    if(obj.head.ref == newBranch){
                      oldPull = obj
                    }
                    else{
                      oldPull = null
                    }
                  })
                  $(this).button('reset')
                  // console.log(pullRequest)
                  $.each(changes, function(i, change){undoChange()})
                  console.log(pulls)
                  $('#issue-modal-title').html('Success!')
                  $('#modal-edits').hide()
                  $('#issue-modal-success').show()
                  if (oldPull != null){
                    $('#issue-modal-success-link').html('See your issue <a href="' + oldPull.html_url + '">here</a>.')  
                  }
                  else{
                    $('#issue-modal-success-link').html('Can\'t create a new issue.  Check <strong>Issues</strong> tab for '+id+' to see if you already have created an issue for this project.')  
                  }
                  
                })
                
              }
              
            })
          }
          else{
            console.log('creating branch!')
            // If repo exists, but branch does not exist, create a new branch directly in that repo and proceed.
            branchAndPull(repo, userRepo, $.cookie('user').login, title, body, comments, 'gh-pages', id.toLowerCase())
          }
        })
        
        repo.show(function(err, repo) {console.log(repo)});
      }
    })

  })
  $('#save').click(function(){
    $('#issue-tab').trigger({
      type: "click"
    })
    // var message = $('#edit-message').text()
    // console.log(message)
    // $('#issue-body').attr('placeholder', message)
  })
  $('#undo').click(function(){
    undoChange()
  })
  $('#delete-row').click(function(){
    // var row = jQuery.extend(true, {}, grid.collection.models[rowNum-2])
    console.log("removed row:")
    console.log(row)
    if (! row ){
          alert("No row selected!")
      }
      else{
          console.log("remove that row!")
          // Generate messages
          var message = row.model.attributes['Phase'] + " phase removed" // +"<br>"
          // messages.html.push(message)
          // console.log()
          var lineNumber = row.model.attributes.index + 1
          // console.log(lineNumber)
          var issueMessage = "* [" + strip(message) + "](https://github.com/{{ site.githubuser }}/plan-it/blob/gh-pages/data/TIP/individual/"+ id +".csv#L" + lineNumber + ")"
          changes.push(newChange("delete-row", row, message, issueMessage))
          updateMessages(changes, false)
          grid.removeRow(row.model)
          
          $('.change').removeAttr('disabled')
          row = null
      }
      console.log(row)

      })
  $('#create-row').click(function(){

    addPhase();
    
      })
  $('#report').click(function(){
    // var name = 'results.' + type
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    // var json = pivot.results().all()
    var tableObjects = tableToJson($('.backgrid').get(0))
    console.log(tableObjects)
    var table = tableObjects[1]
    var lengths = tableObjects[0]
    // if (type === 'json') {
    //  // alert('Exporting results as ' + type + '.')
    //  formBlob = new Blob([JSON.stringify(table)], {
    //    type: 'octet/stream'
    //  });

    //  url = window.URL.createObjectURL(formBlob);
    // } else if (type === 'csv') {
    //  // alert('Exporting results as ' + type + '.')
    //  csv = JSON2CSV(table)
    //  formBlob = new Blob([csv], {
    //    type: 'text/csv',
    //    filename: 'MyVerySpecial.csv'
    //  });

    //  url = window.URL.createObjectURL(formBlob);
    // } else if (type === 'pdf') {
      // var doc = new jsPDF();
      // doc.fromHTML($('#pivot-table').get(0), .5, .5, {
      //   'width': 500,
      //   'elementHandlers': specialElementHandlers
      // });
      console.log(table)
      // doc.save("results.pdf")
      var doc = new jsPDF('p', 'pt', 'letter', true);
      doc.setFontSize(40)
      doc.text(id + ' Report', 30, 60)
      doc.setFontSize(10)
      doc.cellInitialize();

      $.each(table, function (i, row) {
        // Write table header
        if (i == 0) {
          $.each(lengths, function (j, length) {
            doc.setFontStyle('bold')
            doc.cell(10, 200, length * 5 + 13, 20, strip(j), i)

          })
        }
        doc.setFontStyle('normal')
        $.each(row, function (j, cell) {
          // if (i === 0){
          //   doc.setFontStyle('bold')
          //   // console.log(cell.length)
          //   doc.cell(10, 200, lengths[j]*5+13, 20, j, i)

          // }
          // console.log(j)
          // console.log(lengths[j])
          doc.cell(10, 200, lengths[j] * 5 + 13, 20, strip(cell), i + 1);

        })
      })
      // for (row in table){
      //   console.log(row)
      //   for (cell in row) {
      //     console.log(cell)
      //     // doc.cell(10, 200, 100, 20, 'Cell '+k, i);
      //     // k++;
      //   }
      // }
      // doc.addJS('print(true)');
      doc.save(id+'.pdf');
      // use jsPDF library!
    // }
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  })
  $('#history-tab').click(function(){
    var branches = ['2008Q1',
            '2008Q2',
            '2008Q3',
            '2008Q4',
            '2009Q1',
            '2009Q2',
            '2009Q3',
            '2009Q4',
            '2010Q1',
            '2010Q2',
            '2010Q3',
            '2010Q34',
            '2011Q1',
            '2011Q2',
            '2011Q3',
            '2011Q4',
            'gh-pages']
    var rows = []
    
    console.log('View HIstory!')
    console.log("history tab")
    if($('#history').is(':empty')){
      $("#history").empty()
      var count = 0
      $.each(branches, function(i, branch){
        count++
        var path = 'data/TIP/individual/'+id+'.csv'
        
        // Should probably be using this guy
        // repo.read(branch, path, function(err, data) {console.log(data)});
        $.get('https://api.github.com/repos/{{ site.githubuser }}/plan-it/contents/'+path+'?ref='+branch+token, function (file) {
          console.log(file.content)
          tables[branch] = d3.csv.parse(Base64.decode(file.content), function(rows){
              delete rows.ARCID
                  delete rows.Description
                  delete rows.Jurisdiction
                  delete rows.ModelingNetworkYear
                  delete rows.Sponsor
                  delete rows.ExistLanes
                  delete rows.ProposedLanes
                  delete rows.Length
                  delete rows.GDOTPI
                  delete rows.Limits
                  delete rows.Status
                  delete rows.ProjectType
                  delete rows.Analysis
                  // delete rows.FundSource
                  delete rows.FederalSum
                  delete rows.StateSum
                  delete rows.LocalSum
                  delete rows.BondSum
                  delete rows.TotalSum
                  return rows;
            })

          
        }).done(function() {
          $("#history").empty()
          console.log(count)
          if(count == branches.length) {
            console.log("match!")
            var previous = []
            var prevBranch = ''
            $.each(branches, function(i, branch){
              
              if (tables[branch]){
                var tableString = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><a href="https://github.com/{{ site.githubuser }}/plan-it/blob/' + branch + '/data/TIP/individual/'+'.csv">' + branch + '</a><small class="pull-right"><em>Hover over shaded cells for more info!</em></small></h3></div><div class="panel-body"><div class="table-responsive"><table id="'+branch+'" class="table table-hover table-condensed">'
                console.log('****************from '+prevBranch+' to '+branch+'****************')
                tableString += '<thead><tr>'
                for (var key in tables[branch][0]) {
                  // Hack to change heading titles
                  if (key == "FiscalYear")
                    key = "FY"
                  else if (key == "PhaseStatus")
                    key = "Auth"

                  tableString += '<th>' + key
                    tableString += '</th>'
                }
                tableString += '</tr></thead>'
                tableString += '<tbody>'
                $.each(tables[branch], function(j, row){
                  
                  

                  // Checks if row existed in previous branch
                  if(previous[j] != undefined){
                    tableString += '<tr>'
                    $.each(row, function(key, data) {
                      // Check if data has changed from previous year
                          if(data !== previous[j][key]){
                              console.log(key + ' changed from '+ previous[j][key] + ' to '+ data);
                              if(data.substring(0,1) === '$'){
                                var prev = Number(previous[j][key].replace(/[^0-9\.]+/g,""))
                                var curr = Number(data.replace(/[^0-9\.]+/g,""))
                                console.log(prev)
                                var diff = curr - prev
                                console.log('that\'s a diff of ' + diff)
                                if (diff > 0){
                                  tableString += '<td class="success" title="'+key+' funding increased by '+accounting.formatMoney(Math.abs(diff))+'">' + data + '</td>'
                                }
                                else{
                                  tableString += '<td class="danger" title="'+key+' funding decreased by '+accounting.formatMoney(Math.abs(diff))+'">' + data + '</td>' 
                                }
                              }
                              else {
                                var prev = previous[j][key]
                                var curr = data
                                tableString += '<td class="warning" title="'+key+' changed from '+prev+' to '+curr+'">' + data + '</td>'
                              }
                              // else if (key == 'FiscalYear') {
                              //  var prev = previous[j][key].parseInt()
                              //  var curr = data.parseInt()
                              //  var diff = curr - prev
                              //  console.log('that\'s a diff of ' + diff)
                              // }

                          }
                          // If data is not new from previous branch, just draw it to the table
                          else {
                            tableString += '<td>' + data + '</td>'
                          }
                        })
                  }
                      else{
                          console.log('row ' + j + ' is new ')
                          tableString += '<tr class="success" title="Phase added">'
                          $.each(row, function(key, data){
                      tableString += '<td>' + data + '</td>'
                    })
                      }
                    tableString += '</tr>'
                              // var string = ''
                
                              // string += '<thead><tr>'
                              // for (var key in record[0]) {
                              //    string += '<th>' + key
                            //        string += '</th>'
                              // }
                              // string += '</tr></thead>'
                              // string += '<tbody>'
                              // $.each(records, function(i, record){
                              //  string += '<tr>'
                              //  for (var key in record) {
                              //      string += '<td>' + record[key]
                             //         string += '</td>'
                              //  }
                              //  string += '</tr>'
                              // })
                              // string += '</tbody>'
                              // return string
                })
                tableString += '</tbody></table></div></div></div>'
                
                $("#history").append(tableString) //'<h4><a href="https://github.com/{{ site.githubuser }}/plan-it/blob/' + branch + '/data/TIP/individual/'+'.csv">' + branch + '' + '</a></h4><div class="table-responsive"><table id="'+branch+'" class="table">'+populateTable(tables[branch])+'</table></div>');  
                previous = tables[branch]
                prevBranch = branch
                console.log(previous)
              }
            })
          }
        })
        
      })
    }
    
  })
var rtp;

function branchAndPull(repo, userRepo, username, title, body, comments, base, branch){
    var patchNum = 1
    var newBranch = branch + '-patch-' + patchNum
    var pull = {
        "title": title,
        "body": body,
        "base": base,
        "head": username + ':' + newBranch
    };
    console.log(pull)
    // This stuff should probably be in a function.
    userRepo.branch(base, newBranch, function(err) {
      console.log(err)
      userRepo.write(newBranch, 'data/TIP/individual/'+id+'.csv', postData, comments, function(err) {
        console.log(err)
        if(err){
            $('#issue-modal-title').html('Hmmm...something went wrong with creating your new branch.  Please tweet at <a href="https://twitter.com/eltiar">Landon Reed</a> for help.')
          }
        
        repo.createPullRequest(pull, function(err, pullRequest) {
          console.log(err)
          if(err){
            $('#issue-modal-title').html('Hmmm...something went wrong with creating your pull request.  Please tweet at <a href="https://twitter.com/eltiar">Landon Reed</a> for help.')
          }
          else{
            $(this).button('reset')
            console.log(pullRequest)
            $.each(changes, function(i, change){undoChange()})
            $('#issue-modal-title').html('Success!')
            $('#modal-edits').hide()
            $('#issue-modal-success').show()
            $('#issue-modal-success-link').html('See your issue <a href="' + pullRequest.html_url + '">here</a>.')  
          }
        });
      });
    });
    repo.show(function(err, repo) {console.log(repo)});
}

function populateIssues(){
  var converter = new Showdown.converter();
  var issuesArray = []
  var count = issues.length
  
  $("#issue-list").empty()
  $("#issue-table").empty()

  $.each(issues, function(i, issue){
    
    if (issue.title == id){
      var issueText = issue.body.split('\n')
      var changes = ""
      var comments = ""
      if (issueText.length > 1){
        changes = issueText[1]
        comments = _.last(issueText)
      }
      else{
        changes = _.last(issueText)
      }
      // var created = moment(issue.created_at).format("M/D, h:mma");
      var updated = moment(issue.updated_at).format("M/D, h:mma");
      // console.log(created.format("ddd, hA"))
      console.log(comments)
      console.log(issueText)
      issuesArray.push([
        issue.number.toString(), 
        '<a href="'+issue.user.html_url+'">'+issue.user.login+'</a>', 
        // created,
        updated,
        // issue.assignee,
        converter.makeHtml(changes.substring(2)),
        '<a class="btn btn-default" href="'+issue.html_url+'">View</a>'
        // converter.makeHtml(comments)
      ])
      console.log(_.last(issuesArray))
      var state = issue.state == "open" ? 'success' : 'important'
      // $("#issue-list").append('<div class="panel panel-default col-md-6 col-xs-12" style="padding:0px;"><div class="panel-heading"><h3 class="panel-title"><span class="badge pull-right" title="Issue #'+issue.number+'">#'+issue.number+'</span><a href="'+issue.user.url+'" title="'+issue.user.login+'"><img src="'+issue.user.avatar_url+'" height="30" width="30"></a> Created by <a href="' + issue.user.url + '">' + issue.user.login + '' + '</a></h3></div><div class="panel-body" style="min-height:120px;"><p>'+converter.makeHtml(issue.body)+'</p></div><div class="panel-footer"><a class="btn btn-default" href="' + issue.html_url + '">View on GitHub</a></div></div>');
    }
    if (!--count && issuesArray.length != 0){
      $('#issue-table').html( '<table cellpadding="0" cellspacing="0" border="0" id="issues-table-table"></table>' );
      var issueTable = $('#issues-table-table').dataTable( {
        "bPaginate": false,
        "aaData": issuesArray,
        "aaSorting": [[ 0, "asc" ]],
        "aoColumns": [
          { "sTitle": "#", "sWidth": "20px" },
          { "sTitle": "Created by" },
          // { "sTitle": "Date created" },
          { "sTitle": "Updated" },
          // { "sTitle": "Assigned to" },
          { "sTitle": "Changes" },
          { "sTitle": "", "bSortable": false }
          // { "sTitle": "Comments" }

        ]
      });
    }
  })
  if (issuesArray.length == 0){
  // if($('#issue-list').is(':empty')){
    $("#issue-list").append('<h3>There are currently no issues for ' + id + '.</h3>')
    $('#gh-view-issues').attr('disabled', 'disabled')
  }
  else{
    $('#gh-view-issues').removeAttr('disabled')
  }
}

function addPhase(){
  $('#phaseModal').modal('hide')
        // var newnew-phase-type = $("#new-phase-type").val()
    var newRow = new Backgrid.Row.extend({
      columns: columns,
      model: territories.model
    }) 
    // Backgrid.EmptyRow({
    //  emptyText: '',
    //  columns: columns
    // })
    var newIndex = parseInt(_.last(grid.collection.models).attributes["index"]) + 1
    console.log(newIndex)
    grid.collection.add(newRow)
    _.last(grid.collection.models).attributes["index"] = newIndex
    _.last(grid.collection.models).attributes["Phase"] = $('#new-phase-type').val()
    _.last(grid.collection.models).attributes["FundSource"] = $('#new-fund-source').val()
    _.last(grid.collection.models).attributes["FY"] = $('#new-fy').val()
    _.last(grid.collection.models).attributes["Auth"] = $('#new-auth').val()
    _.last(grid.collection.models).attributes["Federal"] = $('#new-federal').val()
    _.last(grid.collection.models).attributes["State"] = $('#new-state').val()
    _.last(grid.collection.models).attributes["Local"] = $('#new-local').val()
    _.last(grid.collection.models).attributes["Bond"] = $('#new-bond').val()
    _.last(grid.collection.models).attributes["Total"] = $('#new-total').val()
    grid.render()
    // $('#phaseModal').modal('hide')
    console.log(changes)
    // Generate messages
        var message = "<strong>Phase added</strong>" // +"<br>"
        // messages.html.push(message)
        // console.log()
        var issueMessage = "* [" + strip(message) + "](https://github.com/{{ site.githubuser }}/plan-it/blob/gh-pages/data/TIP/individual/"+ id +".csv)"
        changes.push(newChange("add-row", _.last(grid.collection.models), message, issueMessage))
        updateMessages(changes, false)
        $('.change').removeAttr('disabled')
}
function undoChange(){
  var last = _.last(changes)
  console.log(_.last(changes))
  updateMessages(changes, true)
  changes.splice(changes.length-1, 1)
  console.log(changes)
  if(changes.length === 0){
    $('.change').attr('disabled', 'disabled')
  }
  if (last.type == "delete-row"){
    // add changes.previous
    console.log("add row back in")
    console.log(last.attributes)
    grid.insertRow(last.previous.model) // .sort("FY", "descending")
    // You must render first to have the grid construct all the DOM elements
    // before you can set the sorting state
    // grid.render().sort("index", "descending");

    // now you can display it
    // $("#example-1-result").append(grid.el);
  }
  else if (last.type == "add-row"){
    // add changes.previous
    console.log("remove that new row")
    console.log(last.attributes)
    grid.render().collection.remove(last.previous)
  }
  else if (last.type.split("-")[0] == "edit"){
    var field = last.type.split("-")[1]
    console.log(field)
    // Undo edit cell change... oy.
    grid.collection.models[last.previous.attributes["index"] - 1].attributes[field] = last.previous._previousAttributes[field]
    grid.render()
  }
  
  // var message = $('#edit-message').text()
  // console.log(message)
  // $('#issue-body').attr('placeholder', message)
}
function newChange(name, oldObject, htmlMessage, markdownMessage){
  $('#undo').removeAttr('disabled')
  return {"type": name, "previous": oldObject, "html": htmlMessage, "markdown": markdownMessage}
}
function updateMessages(changes, undoBool){
  $('#issue-modal-title').html('Here\'s a list of the edits you\'ve made so far:')
  $('#modal-edits').show()
  $('.edits-list').empty()
  // $('#issue-body').empty()
  if(!undoBool)
      $('#edit-message').empty().append(_.last(changes).html).fadeIn(250).delay(250).fadeOut(1000)
    else
      $('#edit-message').empty().append("Undo: " + _.last(changes).html).fadeIn(250).delay(250).fadeOut(1000)
  $.each(changes, function(i, change){
    
    $('.edits-list').append("<li>" + change.html + "</li>")
    // if (i === 0){
    //   $('#issue-body').val(change.markdown)
    // }
    // else{
    //   $('#issue-body').val($('#issue-body').val() + "\n" + change.markdown)
    // }
  })
}
function grabD3Data(id){
  d3.csv("{{ site.baseurl}}/data/TIP/individual/"+id+".csv")
          .row(function(d) {
          return {
              ARCID: d.ARCID,
              Description: d.Description,
              Jurisdiction: d.Jurisdiction,
              ModelingNetworkYear: d.ModelingNetworkYear,
              Sponsor: d.Sponsor,
              ExistLanes: d.ExistLanes,
              ProposedLanes: d.ProposedLanes,
              Length: d.Length,
              GDOTPI: d.GDOTPI,
              Limits: d.Limits,
              Status: d.Status,
              ProjectType: d.ProjectType,
              Analysis: d.Analysis,
              Phase: d.Phase,
              Auth: d.PhaseStatus,
              FY: d.FiscalYear,
              FundSource: d.FundSource,
              Federal: d.Federal,
              State: d.State,
              Local: d.Local,
              Bond: d.Bond,
              Total: d.Total,
              FederalSum: d.FederalSum,
              StateSum: d.StateSum,
              LocalSum: d.LocalSum,
              BondSum: d.BondSum,
              TotalSum: d.TotalSum
            };
      })
          .get(function(error, rows){

            if (error){
              $('.nav-pills li').removeClass('active'); // remove active class from tabs
              $('.tab-pane.pill').removeClass('active');
            $('#home').addClass('active')//.hide(); // add active class to clicked tab
            $('#home-tab').addClass('active'); // add active class to clicked tab
            $('.arcid').empty().append(id)
            $('#begin-edits').attr('disabled', 'disabled')
            $('.description').empty().append('No current record of that project!')
            $('#description').show()
            $('.img-thumbnail').show()
            historyClick = false;
              $('#issue-title').attr('placeholder', id)
              $('.sponsor').empty()
              $('.jurisdiction').empty()
              $('.status').empty()
              $('.analysis').empty()
              // $('.fiscal-year').val("")
              $('#js-table').empty()
              
            
              $('#project').fadeIn(250)
              console.log("error")
            return
            }
            var record = jQuery.extend(true, {}, rows);
            $.each(record, function(i, row){
              delete row.ARCID
            delete row.Description
            delete row.Jurisdiction
            delete row.ModelingNetworkYear
            delete row.Sponsor
            delete row.ExistLanes
            delete row.ProposedLanes
            delete row.Length
            delete row.GDOTPI
            delete row.Limits
            delete row.Status
            delete row.ProjectType
            delete row.Analysis
            delete row.StateSum,
            delete row.LocalSum,
            delete row.BondSum,
            delete row.TotalSum
            // delete row.FundSource
            // delete row.Phase
            // delete row.PhaseStatus 
            })
            // var recordArr = []
            // recordArr.push(record["0"])
            
            
          console.log(rows)
          $('#project')
              .fadeOut(250, function(){
                drawMap(id)
                backgridTable(rows)
                // $('#home').tab('show');
                $('.nav-pills li').removeClass('active'); // remove active class from tabs
                $('.tab-pane.pill').removeClass('active');
                $('#home').addClass('active'); // add active class to clicked tab
                $('#home-tab').addClass('active'); // add active class to clicked tab
                historyClick = false;

                if ($.cookie('token') == undefined){
                  $('#begin-edits').attr('disabled', 'disabled')

                }
                else{
                  $('#begin-edits').removeAttr('disabled')
                  $('.login-prompt').hide()
                }
                $('#issue-title').attr('placeholder', id)
                $('.arcid').empty().append(id)
                $('.sponsor').empty().append(rows[0].Sponsor)
                $('.jurisdiction').empty().append(rows[0].Jurisdiction)
                $('.status').empty().append(rows[0].Status)
                $('.analysis').empty().append(rows[0].Analysis)
                $('.description').empty().append(toTitleCase(rows[0].Description))
                // $('.fiscal-year').val(rows[0].FiscalYear)

                // Old table for financial info
                // $('#js-table').empty().append(populateTable(record))
                $('#project').fadeIn(250)
            })
      });
}
function drawMap(id){
  if (rtp == undefined){
    d3.json("{{ site.baseurl }}/data/rtp_all.geojson", function(json) {
      rtp = json
      getMap(id)    
    })
  }
  else
    getMap(id)
}

function getMap(id){
  $('#proj-map').empty()
  var match = null;
    $.each(rtp.features, function(i, feature){
      // console.log(feature)
      
      if (feature.properties.ARCID == id){
        match = true
        match = feature
        console.log(match)
        
      }
      

    })
    var projMap = $('#proj-map')
    console.log(projMap.html())
    if (projMap.is(':empty')){
      if (match) {
        
        $('#proj-map').empty() // .append('<p>This project <strong>does</strong> have a geographic component.</p>')
        console.log(match.geometry.type)
        var latlng = ''
        if (/Point/g.test(match.geometry.type)){
          drawPoints(match.geometry.coordinates, id)
          
        }
        else if (/Line/g.test(match.geometry.type)){
          // $('#proj-map').empty().append('<p>This project <strong>does</strong> have a geographic component.  It\'s a line!</p>')
          drawPaths(match.geometry.coordinates, id)
          // var latlng = match.geometry.coordinates[0][1]+","+match.geometry.coordinates[0][0]
        }
        
      }
      else{
        $('#proj-map').empty().append('<img class="img-thumbnail hidden-xs" title="'+id+' does not have a geographic component." width="242px" height="242px" src="{{ site.baseurl }}/lib/images/no_geo.png">')
      }
    }
}
  $('#map-tab').click(function(){
    
  })
  $('#edit').click(function(){
    window.location='https://github.com/{{ site.githubuser }}/plan-it/edit/gh-pages/data/TIP/individual/'+ $('.arcid').html() +'.csv'
  })
  // var href='https://github.com/{{ site.githubuser }}/plan-it/edit/gh-pages/data/TIP/individual/'+el.ARCID+'.csv'
  var projectList = [];
  var jsonHtmlTable;
  var color = 'active'
  function CompareTables(table1, table2) {
      var instHasChange = false;
      for (var i = 0; i < table1.rows.length; i++) {
          if (table1.rows[i].cells[0].innerHTML.indexOf('div') != -1) {
              //call CompareTables with inner table
              CompareTables(table1.rows[i].cells[0].childNodes[0].childNodes[0], table2);
          }
          else {
              var changes = RowExists(table2, table1.rows[i].cells[0].innerHTML, table1.rows[i].cells[1].innerHTML);
              if (!changes[0]) {
                  table1.rows[i].style.backgroundColor = "yellow";
                  instHasChange = true;
              } else if (changes[1]) {
                  table1.rows[i].style.backgroundColor = "yellow";
                  instHasChange = true;
              }
          }
      }
      return instHasChange;
  }

  function RowExists(table, columnName, columnValue) {

      var hasColumnOrChange = new Array(2);
      hasColumnOrChange[0] = false;
      hasColumnOrChange[1] = false;
      for (var i = 0; i < table.rows.length; i++) {
          if (table.rows[i].cells[0].innerHTML.indexOf('div') != -1) {
              //call RowExists with inner table
              hasColumnOrChange = RowExists(table.rows[i].cells[0].childNodes[0].childNodes[0], columnName, columnValue);
          }
          else {
              if (table.rows[i].cells[0].innerHTML == columnName) {
                  hasColumnOrChange[0] = true;
                  if (table.rows[i].cells[1].innerHTML != columnValue)
                      hasColumnOrChange[1] = true;
              }
          }
          //finish for loop if name was found
          if (hasColumnOrChange[0] == true)
              break;
      }

      return hasColumnOrChange;
  }

  function populateTable(records) {
    // console.log(records)
    var string = ''
    
    string += '<thead><tr>'
    for (var key in record[0]) {
        string += '<th>' + key
          string += '</th>'
    }
    string += '</tr></thead>'
    string += '<tbody>'
    $.each(records, function(i, record){
      string += '<tr>'
      for (var key in record) {
          string += '<td>' + record[key]
          // console.log("Key: " + key);
      //      console.log("Value: " + record[key]);
            string += '</td>'
      }
      string += '</tr>'
    })
    string += '</tbody>'
    return string
  }
  var tester;
  function doDataThings(error, rows){
    data = rows

    // console.log(data);
    tester = [
      {% for projecto in site.data.projects %}
        ['{{ projecto.id }}', '<a id="{{ projecto.id }}-link" title="View data for {{ projecto.id }}" href="#/{{ projecto.id }}" class="btn btn-default btn-xs view" role="button">View</a>'],
      {% endfor %}
    ]

    var url = window.location.href
    var hash = url.split('/')[5]
    console.log(hash)
    
    $('#demo').html( '<table cellpadding="0" cellspacing="0" border="0" class="display table table-condensed" id="projects"></table>' );
      var oTable = $('#projects').dataTable( {
        "sScrollY": "400px",
        "bPaginate": false,
            "aaData": tester,
            "aoColumns": [
              { "sTitle": "" },
              { "sTitle": "" }
              
            ]
      } );
      $('#'+id+'-link').closest('tr').addClass(color).siblings().removeClass(color);
      $("#searchInput").keyup( function () {
          /* Filter on the column (the index) of this element */
          oTable.fnFilter( this.value, $("#searchInput").index(this) );
      } );
    
  }
  var urls = [];
  var projects = ""


