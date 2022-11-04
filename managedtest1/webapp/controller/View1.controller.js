sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
	ODataModel,
	MessageToast,
	JSONModel,
	MessageBox, Export, ExportTypeCSV) {
        "use strict";
        var oArgs;
        var that;
        return Controller.extend("managedtest1.controller.View1", {           
            onInit: function () {                  
            that = this;
            var oRouter = this.getOwnerComponent().getRouter();
            debugger;
            oRouter.getRoute("RouteView").attachPatternMatched( this._onObjectMatched, this);            
            },
            
            _onObjectMatched : function (oEvent) {
                var oQuery;
                   oArgs = oEvent.getParameter("arguments");
                   oQuery = oArgs["parameterID"];
                   if ( !oQuery )  {
                        var oPopoverOpener = this.getView().byId("openPopoverButton");
                        var oPopover = this.getView().byId("popover");
                        if (that.getView().byId("popover").getEnabled() === false) {
                            that.getView().byId("popover").setEnabled(true); 
                            oPopover.showAt(oPopoverOpener);
                            }
                    }
                   debugger;
                    var PO = oArgs.parameterID;
               var model = this.getOwnerComponent().getModel('POhistory'); 
               that = this;
               var odata = "/POheaderSet('"+PO+"')";
                debugger;
                model.read(odata,{ urlParameters: {"$expand" : "Navigatetohistory"},
                    success: function(oRetrievedResult) { 
                        debugger;
                        var header = new JSONModel(oRetrievedResult);
                        that.getView().setModel(header,"POheader");
                        var gr = new JSONModel(oRetrievedResult.Navigatetohistory);
                        debugger;
                        that.getView().setModel(gr,"GR");
                        MessageBox.success('Request Successful');
                        if (that.getView().byId("errorId").getEnabled() === false) {
                            that.getView().byId("errorId").setEnabled(true); 
                            }
                     },
                    error: function(oError) {
                         MessageBox.error("Details cannot be fetched. Please check PO reference or try agian after sometime"); }
                  }) ;
             
                  model.read(odata,{ urlParameters: {"$expand" : "NavigatetoInvoice"},
                  success: function(oRetrievedResult) { 
                      debugger;
                      var header = new JSONModel(oRetrievedResult);
                      that.getView().setModel(header,"POheader");
                      var inv = new JSONModel(oRetrievedResult.NavigatetoInvoice);
                      debugger;
                      that.getView().setModel(inv,"Invoice");
                     
                   },
                  error: function(oError) { 
                    MessageBox.error("Details cannot be fetched. Please check PO reference or try agian after sometime") }
                }) ;
           
            },

            onDownload : function () {
                debugger;
              //  this.getView().getModel("errorLog");
                var oExport = new Export({

                    // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                    exportType : new ExportTypeCSV({
                        separatorChar : ",",
                        charset : "utf-8"
                    }),
    
                    // Pass in the model created above
                    models : this.getView().getModel("GR"),
    
                    // binding information for the rows aggregation
                    rows : {
                        path : "/results"
                    },   
                    // column definitions with column name and binding info for the content  
                    columns : [{
                        name : "GR Reference",
                        template : {
                            content : "{Belnr}"
                        }
                    },
                    {
                        name : "PO line item",
                        template : {
                            content : "{Ebelp}"
                        }
                    },
                    {
                        name : "Quantity",
                        template : {
                            content : "{Bpmng}"
                        }
                    } ,                
                    {
                        name : "Price",
                        template : {
                            content : "{Wrbtr} {Waers}"
                        }
                    },
                    {
                        name : "Movement Type",
                        template : {
                            content : "{Bwart}"
                        }
                    }]
                });
    
                // download exported file
                oExport.saveFile().catch(function(oError) {
                    MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
                }).then(function() {
                    oExport.destroy();
                });
        }

        });
    });
