---

---
var token = $.cookie('token') ? '&access_token=' + $.cookie('token') : ""

var messages = []
var tables = {}
var formChange = false
var edit = false
var segments = [];
var issues = [];
var previous;
var id;
var historyClick = false
$(document).ready(function(){
	getPulls(1);
})
$('#undo-changes').click(function(){
	$("div.panel").remove()
})

$('.form-control').change(function(){
	formChange = true;
	var newValue = $(this).val()
	console.log(newValue)
	$('#modal-edits').show()
	var formId = $(this).attr('id')
	$('.change').data('value')[formId] = parseInt(newValue) ? parseInt(newValue) : newValue
	$('.' + formId).text(newValue)
	token = $.cookie('token') ? '&access_token=' + $.cookie('token') : ""


})
$('#submit-issue').click(function(){
	var github = new Github({
				token: $.cookie('token'),
				auth: "oauth"
			 })
	var repo = github.getRepo('{{ site.githubuser }}', 'fc-review');
	var token = $.cookie('token') ? '&access_token=' + $.cookie('token') : ""
	var newFeature = $('.change').data('value')
	$('#modal-edits').hide()
	$('.spinner').show()

	$.each(raw[newFeature.County].features, function(i, feature){
		if (feature.properties.RCLINK == newFeature.RCLINK && feature.properties.END_MEASUR == newFeature.END_MEASUR && feature.properties.BEG_MEASUR == newFeature.BEG_MEASUR ){
			console.log(feature.properties)
			feature.properties = newFeature
			feature.properties.stroke = "#00ff00"
			feature.properties.user = $.cookie('user').login
			// feature.properties.FC_NEW = 5
			// feature.properties.NAME = "Ponce de Leon Ave"
			// feature.properties.DESC = "This is a road."
			// feature.properties.FROM = "Courtland Ave"
			// feature.properties.TO = "Peachtree St"
			// Check if repo exists for logged-in user
			console.log(feature)
			console.log(i)
		}
	})
	var username = $.cookie('user').login
	var patchNum = 1
	var segment = $('#WHOLE-SEG').is(':checked') ? '\n#### Entire segment' : '\n#### From\n' + $('#FROM').val() + 
				'\n#### To\n' + 
				$('#TO').val()
	var path = 'data/'+newFeature.County+'.geojson'
	console.log(path)
	var base = 'proposed'
	var title = $('#NAME').val()
	var body = 'Changing road ID #' + newFeature.RCLINK + ' functional class from ' + newFeature.F_SYSTEM + ' ('+type[newFeature.F_SYSTEM ]+') to ' + newFeature.FC_NEW + ' ('+type[newFeature.FC_NEW ]+').\n' +
				'### Description\n' + 
				$('#DESC').val() + 
				'\n### Justification\n' + 
				$('#JUST').val() + 
				segment + 
				'\n#### County\n' +
				newFeature.County + ' County'
	var newContent = JSON.stringify(raw[newFeature.County], null, 2)
	// console.log(newContent)
	var comments = 'Change ' + title + ' from ' + type[newFeature.F_SYSTEM ] + ' to ' + type[newFeature.FC_NEW ]
	var newBranch = 'rc-' + newFeature.RCLINK + '-' + newFeature.BEG_MEASUR + '-' + newFeature.END_MEASUR

	branchAndPull(repo, path, $.cookie('user').login, title, body, comments, base, newBranch, newContent)

	repo.show(function(err, repo) {console.log(repo)});

})

$('.add-street').live('click', function(){
	
	var rc = $(this).attr('id')
	var data = $(this).data('value')
	var duplicateCheck = false
	var issueBranch = ''
	var issue;
	$('.link-county').text(data.County)
	$('.F_SYSTEM').text(data.F_SYSTEM)

	$.each(issues, function(i, iss){
		if (iss != ""){
			issueBranch = iss.head.ref
			var branch = issueBranch.split('-')
			console.log(branch)
			if (branch[1] == String(data.RCLINK) && branch[2] == String(data.BEG_MEASUR) && branch[3] == String(data.END_MEASUR)){
				duplicateCheck = true;
				issue = iss
			}
			console.log(duplicateCheck)
		}
		
	})
	if (duplicateCheck){
		var message = '<p><strong>Warning!</strong> A change has already been submitted for this road segment!  Please review the proposed changes below submitted by <a href="'+issue.user.html_url+'">'+issue.user.login+'</a>.</p><p>If you wish to comment on this change or propose an alternative change, click <strong>Comment on this change</strong> below.</p>'
		// alert(message)
		populateIssueModal(issue)
		$( '#showIssueModal' ).modal('show');
		if (!$('.alert').length){
			$('.show-body').prepend('<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+message+'</div>')
		}
		
		console.log(message)
	}
	else{
		formChange = false;
		$('#name-title').text('[Please input name of road]')
		$('#instructions').hide()

		// Remove attributes needs to be moved to validation function
		$('.edits').removeAttr('disabled');
		$(this).attr('disabled', 'disabled')

		$('.change').show();
		$('.change').data('value', data);
		$('#F_SYSTEM').val(data.F_SYSTEM)
		$('#FC_NEW').val('')
		$('.id').text(data.RCLINK)
	}
	
	console.log(data)
	var fc = ''
	segments.push(data)

	
})
$('.remove-street').click(function(){
	confirmChanges(segments[0].RCLINK)
})
$('label').tooltip()
$('#TO').tooltip()
$('#FROM').tooltip()
$('#NAME').tooltip()
$('#JUST').tooltip()
$('#DESC').tooltip()
// $('#WHOLE-SEG').tooltip()
function confirmChanges(id){
	if (formChange){
	 	var r=confirm("You've started making changes for road ID "+id+".\n\nAre you sure you want to start working on a new road segment?\n\n(All changes will be lost.)");
		if (r==true){
			removeStreet()
			return true;
		}
	 }
	 else{
	 	removeStreet()
	 	return true;
	 }
	
}

function removeStreet(){
	$('.change').hide();
	$('.form-control').val('')
	$('#instructions').fadeIn()
	$('.add-street').removeAttr('disabled');
	segments.splice(0, 1)
	
	$('.edits').attr('disabled', 'disabled');
	formChange = false;

	// map reset
	geojson.resetStyle(zoom)
	info.update()
}
$('#WHOLE-SEG').change(function() {
		// do your staff here. It will fire any checkbox change
		$('.intersection').toggle();
		if ($(this).attr('id') === 'WHOLE-SEG'){
			$('.FROM').text('(Entire Segment)')
			$('.TO').text('(Entire Segment)')
		}
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
		window.location = 'https://github.com/{{ site.githubuser }}/fc-review/search?q='+id+'&type=Issues'
	})
	// $('#issues-tab').click(function () {
	// 	console.log("issues tab")
	// 	if(jQuery.isEmptyObject(issues)){
	// 		$.get("https://api.github.com/repos/{{ site.githubuser }}/fc-review/pulls?"+token, function (issuesData) {
	// 			issues = issuesData
	// 			console.log(issues)
	// 			populateIssues()
	// 		});
	// 	}
	// 	else{
	// 		populateIssues()
	// 	}
	// })
	
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
	//   window.location='https://github.com/{{ site.githubuser }}/fc-review/issues/new?title='+title+'&body='+body+'&labels='+this.id
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
	
	var newRows = []

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

var rtp;

function branchAndPull(repo, path, username, title, body, comments, base, branch, data){
		var patchNum = 1
		var pull = {
				"title": title,
				"body": body,
				"base": base,
				"head": branch
		};
		console.log(pull)
		// This stuff should probably be in a function.
		repo.listBranches(function(err, branches) {
			// If branch exists, write to the branch and then call success.
			if(_.contains(branches, branch)){
				repo.write(branch, path, data, comments, function(err) {
					console.log(err)
					console.log(path)
					if(err){
						 $('#issue-modal-title').html('Hmmm...something went wrong with submitting your proposed change (branch error).  Please reload the page and try again or email <a href="mailto:lreed@atlantaregional.com">Landon Reed</a> if you continue experiencing issues.')
					}
					createPull(repo, pull, path)
				});
			}
			else{
				repo.branch(base, branch, function(err) {
					console.log(err)
					if (err){

					}
					repo.write(branch, path, data, comments, function(err) {
						console.log(err)
						console.log(path)
						if(err){
							 $('#issue-modal-title').html('Hmmm...something went wrong with submitting your proposed change (branch error).  Please reload the page and try again or email <a href="mailto:lreed@atlantaregional.com">Landon Reed</a> if you continue experiencing issues.')
						}
						createPull(repo, pull, path)
					});
					repo.write('gh-pages', path, data, comments, function(err) {
						console.log(err)
						console.log(path)
						if(err){
							 $('#issue-modal-title').html('Hmmm...something went wrong with submitting your proposed change (master branch error).  Please reload the page and try again or email <a href="mailto:lreed@atlantaregional.com">Landon Reed</a> if you continue experiencing issues.')
						}
					});
				});
			}
		})
		repo.show(function(err, repo) {console.log(repo)});
}
var tries = 0

function createPull(repo, pull, path){
	repo.createPullRequest(pull, function(err, pullRequest) {
		console.log(err)
		if(err){
			 $('#issue-modal-title').html('Hmmm...something went wrong with submitting your proposed change (pull request error).  Please reload the page and try again or email <a href="mailto:lreed@atlantaregional.com">Landon Reed</a> if you continue experiencing issues.')
		}
		else{
			// $(this).button('reset')
			console.log(pullRequest)
			// $.each(changes, function(i, change){undoChange()})
			$('#issue-modal-title').html('Success!')
			var message = "Merge #"+pullRequest.number + " from @" +pullRequest.user.login + " for " + pullRequest.title

			// $.ajax({
			// 	url: 'https://api.github.com/repos/atlregional/fc-review/pulls/'+pullRequest.number+'/merge?access_token=' + $.cookie('token'),
			// 	type: 'PUT',
			// 	data: {commit_message: message},
			// 	success: function(data){
			// 		console.log(data)
			// 	},
			// 	error: function(err){
			// 		console.log(err)
			// 	}
			// })
			getPulls(1);
			removeStreet()
			$('.spinner').hide()
			$('#modal-edits').hide()
			$('#issue-modal-success').show()
			$('#issue-modal-success-link').html('See your issue <a href="' + pullRequest.html_url + '">here</a>.  The modified file is <a href="https://github.com/'+ pullRequest.head.user.login +'/fc-review/blob/'+ pullRequest.head.ref + '/' + path +'">here</a>')  
			$('#submit-issue').attr('disabled', 'disabled');

		}
	});
}

function getPulls(page){
	var url = "https://api.github.com/repos/{{ site.githubuser }}/fc-review/pulls?page="+page+"&per_page=100&state=all"+token
	$.get(url, function (issuesData, status, xhr) {
		$.each(issuesData, function(i, issue){
			issues.push(issue)
		})
		console.log(xhr.getResponseHeader('Link'))

		var linkheader = parse_link_header(xhr.getResponseHeader('Link'))
		console.log(linkheader)
		
		if (typeof linkheader.last !== "undefined"){
			page++
			getPulls(page)
		}
		else{
			populateIssues()
		}
		// console.log(issues)
		
	}).fail(function(error) {
		tries += 1;
		console.log(error)
		if (tries < 6){
		    token = $.cookie('token') ? '&access_token=' + $.cookie('token') : ""
		    setTimeout(function(){getPulls(page);},2000);
		}
		else{
			$('#issues-table').html('<h3>GitHub API exhausted.  Please log in to see issues.</h3>')
		}
	});
		
	
	
}

/*
 * parse_link_header()
 *
 * Parse the Github Link HTTP header used for pageination
 * http://developer.github.com/v3/#pagination
 */
function parse_link_header(header) {
  if (header.length == 0) {
    throw new Error("input must not be of zero length");
  }
 
  // Split parts by comma
  var parts = header.split(',');
  var links = {};
  // Parse each part into a named link
  _.each(parts, function(p) {
    var section = p.split(';');
    if (section.length != 2) {
      throw new Error("section could not be split on ';'");
    }
    var url = section[0].replace(/<(.*)>/, '$1').trim();
    var name = section[1].replace(/rel="(.*)"/, '$1').trim();
    links[name] = url;
  });
 
  return links;
}

function populateIssues(){
	
	var issuesArray = []
	var count = issues.length
	$("#issue-list").empty()
	$("#issue-table").empty()

	$.each(issues, function(i, issue){
	
			var status = "";
			var updated = moment(issue.updated_at).format("M/D/YY");
			var drop = false;
			if (issue.milestone != null && issue.milestone.title == "Accepted"){
				status = '<span class="label label-success">Accepted</span>'
			}
			else if (issue.milestone != null && issue.milestone.title == "In Review"){
				status = '<span class="label label-warning">In Review</span>'
			}
			else if (issue.state == "open"){
				status = '<span class="label label-primary">Proposed</span>'
			}
			// else if (issue.label)

			else{
				drop = true;
				issues.splice(i, 1, "")
			}

			// Drop all test issues
			if (issue.milestone != null && issue.milestone.title == "Test"){
				drop = true;
				issues.splice(i, 1, "")
			}
			if (!drop){
				issue.body = issue.body.replace(/'/g, "\"")
				console.log(issue)
				issuesArray.push([
					issue.number.toString(), 
					'<small><a href="'+issue.user.html_url+'">'+issue.user.login+'</a></small>', 
					// created,
					updated,
					// issue.assignee,
					issue.title,
					// "Fulton",
					status,
					'<a id="'+issue.head.ref+'" class="btn btn-default btn-sm show-issue" data-issue=\''+JSON.stringify(issue)+'\' data-toggle="modal" data-target="#showIssueModal">View</a>'
					// converter.makeHtml(changes.substring(2)),
					// https://embed.github.com/view/geojson/cityofatlantadummy/fc-review/p-1-1213005717/data/Fulton.geojson?width=558
					// '<a class="btn btn-default" href="'+issue.html_url+'">View</a>'
					// converter.makeHtml(comments)
				])
				// console.log(_.last(issuesArray))
			}
			// $("#issue-list").append('<div class="panel panel-default col-md-6 col-xs-12" style="padding:0px;"><div class="panel-heading"><h3 class="panel-title"><span class="badge pull-right" title="Issue #'+issue.number+'">#'+issue.number+'</span><a href="'+issue.user.url+'" title="'+issue.user.login+'"><img src="'+issue.user.avatar_url+'" height="30" width="30"></a> Created by <a href="' + issue.user.url + '">' + issue.user.login + '' + '</a></h3></div><div class="panel-body" style="min-height:120px;"><p>'+converter.makeHtml(issue.body)+'</p></div><div class="panel-footer"><a class="btn btn-default" href="' + issue.html_url + '">View on GitHub</a></div></div>');
		// }
		var defaultSearch = ""
		if (typeof $.cookie('team') !== "undefined")
			defaultSearch = $.cookie('team').length < 2 ? $.cookie('team')[0].name : ""
		if (!--count && issuesArray.length != 0){
			$('#issue-table').html( '<table id="issues-table-table"></table>' );
			var issueTable = $('#issues-table-table').dataTable( {
				"aaData": issuesArray,
				 // "sScrollY": "350px",
				"bPaginate": true,
				"bLengthChange": false,
				"iDisplayLength": 7,
				"aaSorting": [[ 0, "desc" ]],
				"oSearch": {"sSearch": defaultSearch},
				"aoColumns": [
					{ "sTitle": "#", "sWidth": "20px" },
					{ "sTitle": "Creator" },
					// { "sTitle": "Date created" },
					{ "sTitle": "Updated" },
					// { "sTitle": "Assigned to" },
					{ "sTitle": "Title" },
					// { "sTitle": "County" },
					{ "sTitle": "Status" },
					{ "sTitle": "", "bSortable": false }
					// { "sTitle": "Comments" }

				]
			});
			issueTable.fnAdjustColumnSizing();
		}
	})
	if (issuesArray.length == 0){
	// if($('#issue-list').is(':empty')){
		$("#issue-table").append('<h3>There are currently no proposed changes.</h3>')
		$('#gh-view-issues').attr('disabled', 'disabled')
	}
	else{
		$('#gh-view-issues').removeAttr('disabled')
	}
}


$('.show-issue').live('click', function(){
	// var script = document.createElement( 'script' );
	// script.type = 'text/javascript';
	$('.alert').remove()
	var issue = $(this).data('issue');
	console.log(issue)
	populateIssueModal(issue);

	// $("#gh-map").attr('src', mapUrl );  // '<script src="'+$(this).data('value')+'"></script>'
})

function populateIssueModal(issue){
	var issueText = issue.body.split('\n')
	var county = _.last(issueText).split(' ')[0]
	console.log(county)
	var converter = new Showdown.converter();
	var body =  issue.body;

	// $.get(issue.pull_request.url+token, function(data){
		console.log(issue)
		var linkdata = issue.head.ref.split('-')
		console.log(linkdata)
		// $("#gh-map").append(script)
		if (typeof issueData !== 'undefined')
			issueData.clearLayers();
		setTimeout(function() {
		    issueMap.invalidateSize();
		  }, 200);
		var repo = github.getRepo(issue.head.repo.owner.login, 'fc-review');
		repo.read(issue.head.ref, 'data/' + county + '.geojson', function(err, data) {
			var json = jQuery.parseJSON(data)
			console.log(json)
			drawIssueData(json, issueMap, linkdata)
		});

		$('.issue-title').text(issue.title);
		$('.issue-number').text(issue.number);
		$('.issue-body').html(converter.makeHtml(issue.body));
		$('#issue-comment').attr('href', issue.html_url)
		var count = 0;
		$('#loadingtext').show()
		var dots = setInterval(function(){
		    count++;
		    var dots = new Array(count % 10).join('.');
		    document.getElementById('loadingtext').innerHTML = "Please wait while the map loads." + dots;
		  }, 500);
		setTimeout(function(){
			clearInterval(dots)
			$('#loadingtext').fadeOut()
		}, 3000)
	// })
	
	
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
	console.log('Here\'s a list of the edits you\'ve made so far:')
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


