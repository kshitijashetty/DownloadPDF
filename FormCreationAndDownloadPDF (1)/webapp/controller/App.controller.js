sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/kshi/FormCreationAndDownloadPDF/JS/jspdf"
], function (Controller, jsPDF) {
	"use strict";

	return Controller.extend("com.kshi.FormCreationAndDownloadPDF.controller.App", {
		onInit: function () {
			// JSON model....
			var json = new sap.ui.model.json.JSONModel({
				"scName": "Vikas Bal Vidya Mandir",
				"ownMobile": "2121212121",
				"ownName": "Vikas singh",
				"ownMail": "info.vikask41@gmail.com",
				"ownStatus": "Active",
				"scaddress": "Opposite KPIT Cummins, IT Park, Phase 1, Hinjawadi, Pune, Maharashtra 411057",

				"studentDetails": [{
					"stuId": "101",
					"stuName": "Nikhil Kumar",
					"stuMobNo": "1111111111",
					"stuEmail": "Nikhil@yahoo.com",
					"stuStand": "10th"
				}, {
					"stuId": "102",
					"stuName": "Akash Kumar",
					"stuMobNo": "2222222222",
					"stuEmail": "Akash@gmail.com",
					"stuStand": "7th"
				}, {
					"stuId": "103",
					"stuName": "Rahul Kumar",
					"stuMobNo": "3333333333",
					"stuEmail": "Rahul@yahoo.com",
					"stuStand": "10th"
				}, {
					"stuId": "104",
					"stuName": "Nishant Kumar",
					"stuMobNo": "4444444444",
					"stuEmail": "Nishant@yahoo.com",
					"stuStand": "5th"
				}, {
					"stuId": "105",
					"stuName": "Kunal singh Rajput",
					"stuMobNo": "555555555",
					"stuEmail": "Rajput@yahoo.com",
					"stuStand": "10th"
				}],
				"branchDetails": [{
					"BRCode": "PSA001",
					"BRPRName": "DR.Prashnat singh",
					"Location": "Shivaji Chowk / Hinjawadi Chowk",
					"Email": "ShivajiChowk@gmail.com",
					"TelephoneNo": "2323232323"
				}, {
					"BRCode": "PPCMCA002",
					"BRPRName": "DR.vikas singh",
					"Location": "Mahavir ChowkChinchwad, Pimpri-Chinchwad",
					"Email": "ChowkChinchwad@gmail.com",
					"TelephoneNo": "3434343434"
				}, {
					"BRCode": "PWCEA003",
					"BRPRName": "ER.Ashutosh Jha",
					"Location": "Wakadkar Wasti Rd,Casa Imperia",
					"Email": "CasaImperia@gmail.com",
					"TelephoneNo": "4545454545"
				}, {
					"BRCode": "PSA004",
					"BRPRName": "ER.Gopal singh",
					"Location": "near Pune Junction railway station",
					"Email": "punerailway@gmail.com",
					"TelephoneNo": "6767676767"
				}]
			});
			// ($.sap.getModulePath("print", "/model/Data.json"));
			// Setting model to view....
			this.getView().setModel(json, 'genericAlias');
			//Alias Name = genericAlias....

			//      1.Get the id of the VizFrame		
			var oVizFrame = this.getView().byId("idcolumn");

			//      2.Create a JSON Model and set the data
			var oModel = new sap.ui.model.json.JSONModel();
			var data = {
				'Population': [{
					"Year": "2010",
					"Value": "158626687"
				}, {
					"Year": "2011",
					"Value": "531160986"
				}, {
					"Year": "2012",
					"Value": "915105168"
				}, {
					"Year": "2013",
					"Value": "1093786762"
				}, {
					"Year": "2014",
					"Value": "1274018495"
				}, ]
			};
			oModel.setData(data);

			//      3. Create Viz dataset to feed to the data to the graph
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Year',
					value: "{Year}"
				}],

				measures: [{
					name: 'Population',
					value: '{Value}'
				}],

				data: {
					path: "/Population"
				}
			});
			oVizFrame.setDataset(oDataset);
			oVizFrame.setModel(oModel);
			oVizFrame.setVizType('column');

			//      4.Set Viz properties
			oVizFrame.setVizProperties({
				plotArea: {
					colorPalette: d3.scale.category20().range()
				}
			});

			var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "valueAxis",
					'type': "Measure",
					'values': ["Population"]
				}),
				feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "categoryAxis",
					'type': "Dimension",
					'values': ["Year"]
				});
			oVizFrame.addFeed(feedValueAxis);
			oVizFrame.addFeed(feedCategoryAxis);
		},
		/*handlePrint: function () {
			window.print();
		},*/
		// When you click on 'Print' button then this method will call....
		handlePrint: function (oEvent) {
			var modelData = this.getView().getModel("genericAlias").getData();
			var fullHtml = "";
			//Calling method....
			var header = this.getHeaderForm(modelData);
			fullHtml += header;
			//Making student table....
			var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
				"<caption style='color:green;font-weight: bold;font-size: large;'>Student Details</caption>" +
				"<tr><th style='color:green'>Sudent Id</th>" +
				"<th style='color:green'>Student Name</th>" +
				"<th style='color:green'>Student Mobile No.</th>" +
				"<th style='color:green'>Student Email-ID</th>" +
				"<th style='color:green'>Student Standard</th></tr>";
			//Adding row dynamically to student table....
			for (var i = 0; i < modelData.studentDetails.length; i++) {
				headertable1 += "<tr>" +
					"<td> " + modelData.studentDetails[i].stuId + "</td>" +
					"<td>  " + modelData.studentDetails[i].stuName + "  </td>" +

					"<td>  " + modelData.studentDetails[i].stuMobNo + "  </td>" +

					"<td>  " + modelData.studentDetails[i].stuEmail + "  </td>" +
					"<td>  " + modelData.studentDetails[i].stuStand + "  </td>" +
					"</tr>";
			}
			headertable1 += "</table>";
			fullHtml += headertable1;
			// Making branch table....
			var headertable2 = "<table  border='1' style='margin-top:50px;width: 1000px;' align='center'>" +
				"<caption style='color:green;font-weight: bold;font-size: large;'>Branch Details</caption>" +
				"<tr><th style='color:green'>Branch Code</th>" +
				"<th style='color:green'>Branch Principal Name</th>" +
				"<th style='color:green'>Location</th>" +
				"<th style='color:green'>Email-Id</th>" +
				"<th style='color:green'>Telephone No.</th></tr>";
			//Adding row dynamically to branch table....
			for (var j = 0; j < modelData.branchDetails.length; j++) {
				headertable2 += "<tr>" +
					"<td> " + modelData.branchDetails[j].BRCode + "</td>" +
					"<td>  " + modelData.branchDetails[j].BRPRName + "  </td>" +
					"<td>  " + modelData.branchDetails[j].Location + "  </td>" +
					"<td>  " + modelData.branchDetails[j].Email + "  </td>" +
					"<td>  " + modelData.branchDetails[j].TelephoneNo + "  </td>" +
					"</tr>";
			}
			headertable2 += "</table>";
			fullHtml += headertable2;
			
			// Start to print chart 
			// debugger;
			// fullHtml += '<svg width="400" height="110"><rect class="v-background-body viz-plot-background v-morphable-background" x="0" y="0" width="640" height="480" style="fill: transparent;"></rect></svg>'
			
			// window.open(URL, name, specs, replace)
			var wind = window.open("", "printExample", "popup"); // window.open("", "printExample", "popup");
			wind.document.write(fullHtml);
			setTimeout(function () {
				wind.print();
				// wind.close();
			}, 6000);
		},

		//Returing header data(Called method).... 
		getHeaderForm: function (modelData) {
			var modulePath = $.sap.getModulePath("print", "/image/");
			modulePath = modulePath + "logo.jpg";
			return "<Img src=" + modulePath + " style='margin-left:60rem' width='100px' height='80px'/>" +
				"<hr/><div>" +
				"<div style=float:left>" +
				"<p>School Name        : " + modelData.scName + "</p>" +
				"<p>Owner Name         : " + modelData.ownName + "</p>" +

				"<p>Owner E-mail       : " + modelData.ownMail + "</p>" +
				"</div><div style=float:right>" +
				"<p>Owner Mobile No    : " + modelData.ownMobile + "</p>" +
				"<p>Owner Staus        : " + modelData.ownStatus + "</p>" +
				"<p>Scholl Address     : " + modelData.scaddress + "</p>" +
				"</div></div>";
		}
	});
});