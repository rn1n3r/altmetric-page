
// Get JSON data from API
function getAltmetricFeed (maxNumberOfEntries, department, timeFrame) {

  // Building the API request
  var departmentID = ""; // default to all departments

  var article = document.getElementById("article")
  article.innerHTML = null;

  if (arguments.length == 1) {
    var e = document.getElementById("depSelect");
    var f = document.getElementById("timeSelect");
    department = e.options[e.selectedIndex].value;
    time = f.options[f.selectedIndex].value;
  }

  switch (department) {
    case "acb":
      departmentID = "%3Agroup%3Af62810258889628bbbd57600acd27965ddeca382";
      break;
    case "anesthesia":
      departmentID = "%3Agroup%3A8ddc1a902a63be9b5f7c38a60f3ef3a25fa1ef71";
      break;
    case "biochem":
      departmentID = "%3Agroup%3A4b174a109f4f158b73a8ac126d0c10f25e3ce24d";
      break;
    case "cns":
      departmentID = "%3Agroup%3A05f82ae05cc7573d3e8bbdb9eeed3163ec03786a";
      break;
    case "dentistry":
      departmentID = "%3Agroup%3A8ddc1a902a63be9b5f7c38a60f3ef3a25fa1ef71";
      break;
    case "epibio":
      departmentID = "%3Agroup%3Aa73cdd08d3157ac7570797a8aeb7fc0870c58e68";
      break;
    case "fam":
      departmentID = "%3Agroup%3A5d16627f2e33a526847c5f9d7e877ab6b587a059";
      break;
    case "robarts":
      departmentID = "%3Agroup%3Ad8a35bcf0e0706dc34bd974a3148d97c2b23b85a";
      break;
    case "microimm":
      departmentID = "%3Agroup%3A1fb691942f126edac946ef47ac1ffb95074b9271";
      break;
    case "medbio":
      departmentID = "%3Agroup%3A249a0dc8f916588cac096d8c7df1f7a4da72c89a";
      break;
    case "medimg":
      departmentID = "%3Agroup%3Af4617093a9375070cb5c7576b9fa232f9ed507eb";
      break;
    case "medicine":
      departmentID = "%3Agroup%3Acd8c2df26c59ee73a03c6a4ccbbc83cfdb565e7c";
      break;
    case "obgyn":
      departmentID = "%3Agroup%3Ab1b3bca15c712f2c3c4894540d2bbcb2e43866cf";
      break;
    case "oncology":
      departmentID = "%3Agroup%3Ac5688a41cb23d27cdcf260e49acb890c5e9ae70e";
      break;
    case "ophthalm":
      departmentID = "%3Agroup%3A9d1d0d3a7318ea750720a3824d58589e1b911286";
      break;
    case "otolaryng":
      departmentID = "%3Agroup%3A4e733be590efee413a287fb4e37610cd3352e5de";
      break;
    case "paediatrics":
      departmentID = "%3Agroup%3Aa05cf8721857b33bbb9c48642970dcd6537f541f";
      break;
    case "palm":
      departmentID = "%3Agroup%3A92c05b013ad05c81bd6fea732f46588b5aaec337";
      break;
    case "physmed":
      departmentID = "%3Agroup%3A60f76a85a1afce7b3345572957905e9cec460541";
      break;
    case "physpharm":
      departmentID = "%3Agroup%3A00b870bd72ecc6c74b3d5688bb1cc5c541a5ad18";
      break;
    case "psychiatry":
      departmentID = "%3Agroup%3A0adfba1ae23ae5a2b4ab3f9d5d2432ba1274b459";
      break;
    case "pubhealth":
      departmentID = "%3Agroup%3A8aa496e1312f451e8de9e49d7f0686bb3411a6e0";
      break;
    case "surgery":
      departmentID = "%3Agroup%3Af386e273e072a19088478636787e8266ccfbcc8e";
      break;


    default:
      departmentID = "";

  }

  // Altmetric API call to get top mentioned articles for past week
  var api = "https://www.altmetric.com/api/v1/summary_report/" + time + "?num_results=100&group=schulichmd" + departmentID + "&citation_type=news%2Carticle%2Cclinical_trial_study_record%2Cdataset%2Cbook%2Cgeneric&order_by=score";

  $.getJSON(api, function(data) {
    sortJSONByProperty(data.top_citations_by_mentions, 'altmetric_score.score', -1);
	
    if (data.top_citations_by_mentions.length == 0)
    $(".article").append("No results found!");
    else {

      $.each(data.top_citations_by_mentions, function (i, value) {
        if (i >=maxNumberOfEntries) return false;
		var newdiv = document.createElement("div");
		newdiv.setAttribute("class","altmetric-embed");
		newdiv.setAttribute("data-badge-type", "medium-donut");
        if (typeof value.doi == 'undefined') {
			newdiv.setAttribute("data-pmid", value.pmid);      
        }
		else 
			newdiv.setAttribute("data-doi", value.doi);
    
		article.appendChild(newdiv); // if it doesn't have a doi...
		article.innerHTML += "<br><b><a href='" + value.links[0] + "'>"+value.title+"</a><b>";
        var authors = value.authors;
        if (typeof authors == 'undefined');
        else if (authors.length > 6) {
          authors = authors.slice(0,5); // cut off if more than 10 authors
          authorStr = authors.join(', ') + ",...";
        }
        else {
          authorStr = authors.join(', ');
        }

        article.innerHTML += "<br><div class = 'authors'>" + authorStr + "</div>";
        article.innerHTML += "<br style='clear:both'/>";

      });

		
      $.getScript("https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js");
      $body = $("body");
    }

	// Loading animation
    $(document).
      ajaxStart(function() {
		$body.addClass("loading");
	});
	$(document).
      ajaxStop(function() {
		$body.removeClass("loading");
	});
    


  });

}

// To sort the articles by Altmetric score
function sortJSONByProperty (json, prop, direction) {
  direction = (arguments.length == 3) ? direction : -1;
  if (json && json.constructor === Array) {
    json.sort(function(a,b) {
      // Get to the property you want
      var propPath = (prop.constructor===Array) ? prop : prop.split(".");
      for (var p in propPath) {
        a = a[propPath[p]];
        b = b[propPath[p]];
      }
      return ( (a < b) ? -1*direction : ((a > b) ? 1*direction : 0) );

    });
  }

}
