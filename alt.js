// Builds an Altmetric API request for data for a specific department and timeframe

var maxNumberOfEntries;

// Get JSON data from API
function getAltmetricFeed (max, department, timeFrame) {
	maxNumberOfEntries = max;
	// Building the API request

	// Get the article class in the HTML
	var article = document.getElementById("article")
	article.innerHTML = "";

	if (department == null) {
		var e = document.getElementById("depSelect");

		department = e.options[e.selectedIndex].value;

	}
	if (timeFrame == null) {
		var f = document.getElementById("timeSelect");
		time = f.options[f.selectedIndex].value;
	}

	departmentID = "%3Agroup%3A";

	switch (department) {
		case "acb":
		departmentID += "f402acbd49958d0ec0f20dfd0ae531bb";
		break;
		case "anesthesia":
		departmentID += "ca0b24ebcff29bebba043ff12d7dda39";
		break;
		case "biochem":
		departmentID += "469f416486a6d49c2f5e6fd69cc51cf9";
		break;
		case "cns":
		departmentID += "e815ef885a06e1c4332ff02589ec2934";
		break;
		case "dentistry":
		departmentID += "4682b179521e798a3868854185e92db0";
		break;
		case "epibio":
		departmentID += "d527a21da2f7ba46a819ca99a18857bd";
		break;
		case "fam":
		departmentID += "eb488ad62cb5e3284870a7ae8465ca69";
		break;
		case "medbio":
		departmentID += "e57631b9b6f463bfa51841828dd2f2e2";
		break;
		case "medimg":
		departmentID += "2420221a7f31a5733a5862c11ff0e1c1";
		break;
		case "medicine":
		departmentID += "3124f507d6317741e882ca7532c6d32c";
		break;
		case "microimm":
		departmentID += "26e63501ae40451ac42d9c13ff655dc7";
		break;
		case "obgyn":
		departmentID += "8c2b6dba50578d88f2df907ec5334c90";
		break;
		case "oncology":
		departmentID += "7026418d879280bed8297347b2ca50a1";
		break;
		case "ophthalm":
		departmentID += "c22390f635b19eae5d51a1486a385555";
		break;
		case "otolaryng":
		departmentID += "585742baa063c897df6fdc50b8011a56";
		break;
		case "paediatrics":
		departmentID += "b5708252a1d8a7ba9403806efc06094a";
		break;
		case "palm":
		departmentID += "d9d75cd18ec4b4b7854df8128ff5130f";
		break;
		case "physmed":
		departmentID += "3ec08a4531b921812a63ae11ac298b47";
		break;
		case "physpharm":
		departmentID += "f9b941498a5c5ed2045161274d925665";
		break;
		case "psychiatry":
		departmentID += "6dc8041f88bef8d31b1d9a1bd98c4654";
		break;
		case "pubhealth":
		departmentID += "66dc150ec019da336bec91a4ea44c059";
		break;
		case "robarts":
		departmentID += "c4148b31709c5b96aec2e876a4647551";
		break;
		case "surgery":
		departmentID += "57be9194aa25fd33e51087c1aa24283e";
		break;
		default:
		departmentID = "";

	}

	// Altmetric API call to get top mentioned articles for past week
	var api = "https://www.altmetric.com/api/v1/summary_report/" + time + "?num_results=100&group=schulichmd" + departmentID + "&citation_type=news%2Carticle%2Cclinical_trial_study_record%2Cdataset%2Cbook%2Cgeneric&order_by=score";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", api);

	// Add loading class to body for animation
	document.body.className	+= "loading";


	xhr.onload = function () {
		var data = JSON.parse(xhr.responseText).top_citations_by_mentions;

		// Sort the articles by altmetric score
		sortJSONByProperty(data, 'altmetric_score.score', -1);

		if (data.length == 0)
			article.innerHTML += "No results found!";
		else {
			// Determine how many articles to show based on number of results and the max limit
			var limit = (data.length < maxNumberOfEntries) ? data.length : maxNumberOfEntries;

			// Iterate through each article and add it to the webpage
			for (var i = 0; i < limit; i++) {
				var value = data[i];

				// Create the donut div
				var newdiv = document.createElement("div");
				newdiv.setAttribute("class","altmetric-embed");
				newdiv.setAttribute("data-badge-type", "medium-donut");

				// if it doesn't have a doi...
				if (typeof value.doi == 'undefined')
					newdiv.setAttribute("data-pmid", value.pmid);
				else
					newdiv.setAttribute("data-doi", value.doi);

				// add the data to the article class
				article.appendChild(newdiv);
				// add article links
				article.innerHTML += "<br><b><a href='" + value.links[0] + "'>"+value.title+"</a><b>";

				// Get the author string
				var authors = value.authors;
				if (typeof authors == 'undefined');
				else if (authors.length > 6) {
					authors = authors.slice(0,5); // cut off if more than 10 authors
					authorStr = authors.join(', ') + ",...";
				}
				else {
					authorStr = authors.join(', ');
				}

				article.innerHTML += "<br><div class = 'authors'>" + authorStr + "</div><br style='clear:both'/>";
			}

			// Load script to generate Altmetric donuts
			var embed = document.createElement("script");
			embed.type = "text/javascript";
			embed.src = "https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js";
			document.body.appendChild(embed);


		}
		document.body.className = ""; // done loading, so remove the loading class from the body
	}
	xhr.send();
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
