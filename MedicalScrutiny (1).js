var Rese = [];
var cHeckedcomm = [];
var Comm_MId = 0;
var RsendId = null;
var AccomdationDays = {};
var AccomdationDaysTotal = [];
var IsGipsaPpnCity = false;
var IRTotalRejectedReasons = [];
var iseditcoding = false;
var iscodingcalculated = false;
var isclaimsubmission = false;
var submissionflag = false;
var isclaimwaitingperiod = false;
var isoverridewaitingperid = false;
var isAlimentnotcovered = false;
var isAlimentoverride = false;
var Location = "";
var PINCode = "";
var MobileNo = "";
var RegEmailID = "";
var claimTypeid = $("#hdnClaimTypeID").val();
var RelianceNIDB_falg = false;
//var BillTypeIDD = 0;
var ParexelcorporateIDs = ["66238", "66392", "279345", "279346", "66393", "66440"];
var Star_Healthconfirm = "0";
var NME_AMOUNT = 0;
var _NME_AMOUNT = 0;
var isQuery_Responsed = 0;

function PrintClaimInformationSheet() {
    var divContents = $("#divCI_ClaimInformationSheet").html();
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write(divContents);
    printWindow.document.close();
    printWindow.print();
}

/* Sri Vidya Code */
function Retrieve_AuditTrail(_ClaimID, _SlNo, IsFrmArchived) {
    //debugger
    $('#divSerialNum').html('');
    if (_ClaimID != null && _SlNo != null) {
        if ($('#divSerialNum').children().length == 0) {  // dependecies of Table tblAuditTrail   '$('#tblAuditTrail tbody')'
            $.ajax({
                type: "GET",
                url: "/MedicalScrutiny/ClaimAudit_Retrieve",
                contentType: 'application/json;charset=utf-8',
                //processData: false,
                data: { ClaimID: _ClaimID, SlNo: _SlNo, IsFrmArchived: $('#hdnIsFrmArchived').val() },
                success: function (data) {
                    CheckSessionVariable(data);
                    data = $.parseJSON(data);

                    if (data == null || data == "") {
                        //alert('Data not found.');
                    }
                    else Bind_AuditTrail(data);
                },
                error: function (e, x) {
                    ShowResultMessage('ErrorMessage', e.responseText);
                }
            });
        }
    }
    // else
    // ShowWanringMessage("")
}




function Bind_AuditTrailbkp(data) {
    if (data != null) {
        for (var i = 0; i < data.length; i++) {
            var tdView = '';
            if (data[i].ClaimStageID == 23 || data[i].ClaimStageID == 7 || data[i].ClaimStageID == 8 || data[i].ClaimStageID == 17 || data[i].ClaimStageID == 18 || data[i].ClaimStageID == 14) {
                var tdView = '<td><a class="show-popup"  data-showpopup="10" onclick=Retrieve_Reasons(' + data[i].ActionID + ',' + data[i].ClaimStageID + ',' + data[i].ClaimID + ',' + data[i].Slno + ')><label class="btn btn-warning">View</label></a></td>';
            }
            else if (data[i].ClaimStageID == 5) {
                // var tdView = '<td><a onclick=Retrieve_BillView(' + data[i].ActionID + ',' + data[i].ClaimStageID + ')><label class="btn btn-primary">BillView</label></a></td>';
                // var tdView = '<td><a onclick=CommonPopup("/Common/BillCalculationPrintView?ClaimID=' + $('#hdnClaimID').val() + '&SlNo=' + $('#hdnClaimSlNo').val() + '")><label class="btn btn-primary">BillView</label></a></td>';
                var tdView = '<td><a  onclick=myPopup("/Common/BillCalculationPrintView?ClaimID=' + $('#hdnClaimID').val() + '&SlNo=' + $('#hdnClaimSlNo').val() + '&ClaimTypeID=' + $('#hdnClaimTypeID').val() + '&RequestTypeID=' + $('#hdnRequestTypeID').val() + '&claimstageid=' + $('#hdnClaimStageID').val() + '&caltype=BILLVIEW")><label class="btn btn-warning">BillView</label></a></td>';
            }
            else if (data[i].ClaimStageID == 27 && Makezerofromnullorundefined(data[i].CloseDate) != 0) {
                var tdView = '<td><a class="show-popup"  data-showpopup="19" onclick=SettlementDetails_Retrieve(' + data[i].Slno + ')><label class="btn btn-warning">View</label></a></td>';
            }
            else if (data[i].ClaimStageID == 21) {
                var tdView = '<td><a class="show-popup"  data-showpopup="20" onclick=Retrieve_CancelReasons(' + data[i].ActionID + ',' + data[i].ClaimStageID + ',' + data[i].ClaimID + ',' + data[i].Slno + ')><label class="btn btn-warning">View</label></a></td>';
            }
            //else if (data[i].ClaimStageID == 3) {
            //    var tdView = '<td><a id="modelbutton"   onclick=ShowdDocumentRemarksModel();Retrieve_DocumentComments(' + data[i].ActionID + ',' + data[i].ClaimStageID + ',' + data[i].ClaimID + ',' + data[i].Slno + ')  ><label class="btn btn-warning">View</label></a></td>';
            //}
            //else if (data[i].ClaimStageID == 4) {
            //    var tdView = '<td><a id="modelbutton"   onclick=ShowdBillingRemarksModel();Retrieve_BillingRemarks(' + data[i].ClaimID + ',' + data[i].Slno + ')  ><label class="btn btn-warning">View</label></a></td>';
            //}
            else {
                tdView = '<td></td>';
            }

            var tblBody = '<tr> <td data-title="STAGE (Internal)" class="numeric">' + data[i].Name + '</td>'
                + '  <td data-title="STAGE (External)" class="numeric show-popup" data-showpopup="2">' + data[i].ExternalName + '</td>'
                + '<td class="numeric">' + data[i].ClaimType + '</td>'
                + '<td class="numeric">' + data[i].RequestType + '</td><td class="numeric">' + data[i].ClaimedAmount + '</td>'
                + '  <td data-title="Open Date" class="numeric">' + JSONDateTime(data[i].OpenDate) + '</td><td data-title="Closed Date" class="numeric">' + MakeNEUasNotApplicable(JSONDateTime(data[i].CloseDate)) + '</td>'
                + '<td data-title="User - Region" class="numeric">' + data[i].Closedby + '-' + data[i].Region + '</td>'
                + '<td data-title="Duration" class="numeric">' + MakeNEUasNotApplicable(data[i].Duration) + '</td>'
                + '<td data-title="Remarks" class="numeric">' + MakeNEUasNotApplicable(data[i].Remarks) + '</td>'
                + tdView + '</tr>';

            $('#tblAuditTrail tbody').append(tblBody);
        }

        if ($('#hdnRoleID').val() == 35)//Call center executive
            $('#tblAuditTrail tr').find('td:eq(0),th:eq(0)').remove();// remove stage internal column
        else
            $('#tblAuditTrail tr').find('td:eq(1),th:eq(1)').remove();// remove stage external column

    }
}

//SP3V-2497 Begin
if ($('#hdnClaimStageID').val() == 5)
    $('#corelatedreport').show();
else
    $('#corelatedreport').hide();

//SP3V-2497 End
function Retrieve_Reasons(_actionID, _stageID, _ClaimID, _SlNo) {
    var flag = false;

    if (_stageID == 7 || _stageID == 8) {
        if ($('#tblPendingReasonsView tbody tr').length > 0) {
            var rowID = $('#tblPendingReasonsView tbody tr:first').attr('id');
            if (('trPending_' + _stageID + '_' + _actionID) == rowID)
                flag = true;
        }
    }
    else if (_stageID == 23) {
        if ($('#tblRejectedReasonsView tbody tr').length > 0) {
            var rowID = $('#tblRejectedReasonsView tbody tr:first').attr('id');
            if (('trRejectedResons_' + _stageID + '_' + _actionID).id == rowID)
                flag = true;
        }
    }
    else if (_stageID == 17 || _stageID == 14 || _stageID == 18) {
        if ($('#tblRefInsAuditReasonsView tbody tr').length > 0) {
            var rowID = $('#tblRefInsAuditReasonsView tbody tr:first').attr('id');
            if (('trInsAuditReasons_' + _stageID + '_' + _actionID).id == rowID)
                flag = true;
        }
    }

    if (flag == false) {
        if (_actionID != null) {
            $('#tblPendingReasons tbody').html('');
            $.ajax({
                type: "GET",
                url: "/MedicalScrutiny/ClaimPending_Reasons_Retrieve",
                contentType: 'application/json;charset=utf-8',
                ////processData: false,
                //data: { ClaimID: $('#hdnClaimID').val(), SlNo: $('#hdnClaimSlNo').val(), ActionID: _actionID, StageID: _stageID },
                data: { ClaimID: _ClaimID, SlNo: _SlNo, ActionID: _actionID, StageID: _stageID },
                success: function (data) {
                    CheckSessionVariable(data);
                    if (data.length > 0) {
                        data = $.parseJSON(data);
                        if (data.ID == 1) {
                            DialogErrorMessage(data.Message);
                        }
                        else {
                            $('#tblRefInsAuditReasonsView,#tblPendingReasonsView,#tblRejectedReasonsView').hide();
                            $('#tblRefInsAuditReasonsView tbody').html('');
                            $('#tblPendingReasonsView tbody').html('');
                            $('#tblRejectedReasonsView tbody').html('');
                            Bind_AuditReasons(data, _stageID, _actionID);
                        }
                    }
                },
                error: function (e, x) {
                    ShowResultMessage('ErrorMessage', e.responseText);
                }
            });
        }
    }
    else
        $("#divPendingReasons").css({ "display": "block", "position": "absolute", "width": "100%", "height": "100%", "padding-top": "300px", "z-index": "1000", "background": "#000", "background": "rgba(0,0,0,0.75)" });
}

function Bind_AuditReasons(data, _stageID, _actionID) {
    if (_stageID == 7 || _stageID == 8) {
        $('#tblPendingReasonsView').show();
        $('#lblReasonsViewTitle').text('Pending Reasons');
        for (var i = 0; i < data.length; i++) {
            var ctrlID = 'trPending_' + _stageID + '_' + _actionID;
            var tblBody = '<tr id="' + ctrlID + '"> <td class="numeric">' + data[i].IRReason + '</td>'
                + '  <td  class="numeric ">' + data[i].Amount + '</td>'
                + '  <td data-title="Open Date" class="numeric">' + data[i].isReceived + '</td><td  class="numeric">' + (data[i].RequirementType) + '</td></tr>';
            $('#tblPendingReasonsView tbody').append(tblBody);
        }
    }
    else if (_stageID == 23) {
        $('#tblRejectedReasonsView').show();
        $('#lblReasonsViewTitle').text('Rejected Reasons');
        for (var i = 0; i < data.length; i++) {
            var ctrlID = 'trRejectedResons_' + _stageID + '_' + _actionID;
            var tblBody = '<tr id="' + ctrlID + '"> <td class="numeric">' + data[i].RejReasons + '</td></tr>';
            $('#tblRejectedReasonsView tbody').append(tblBody);
        }
    }
    else if (_stageID == 17 || _stageID == 24 || _stageID == 14 || _stageID == 18) {
        $('#tblRefInsAuditReasonsView').show();
        $('#lblReasonsViewTitle').text('Reasons ');
        for (var i = 0; i < data.length; i++) {
            var ctrlID = 'trInsAuditReasons_' + _stageID + '_' + _actionID;
            var tblBody = '<tr id="' + ctrlID + '"> <td class="numeric">' + data[i].Remarks + '</td><td  class="numeric ">' + data[i].Reasons + '</td></tr>';
            $('#tblRefInsAuditReasonsView tbody').append(tblBody);
        }
    }

    $("#divPendingReasons").css({ "display": "block", "position": "absolute", "width": "100%", "height": "100%", "padding-top": "300px", "z-index": "1000", "background": "#000", "background": "rgba(0,0,0,0.75)" });
}

function SettlementDetails_Retrieve(_SlNo) {
    $.ajax({
        type: "GET",
        url: "/MedicalScrutiny/SettlementDetails_Retrieve",
        contentType: 'application/json;charset=utf-8',
        //processData: false,
        //data: { ClaimID: $('#hdnClaimID').val(), SlNo: $('#hdnClaimSlNo').val() },
        data: { ClaimID: $('#hdnClaimID').val(), SlNo: _SlNo, IsFrmArchived: $('#hdnIsFrmArchived').val() },
        success: function (data) {
            CheckSessionVariable(data);
            if (data.length > 0) {
                data = $.parseJSON(data);
                if (data.ID == 1) {
                    DialogErrorMessage(data.Message);
                }
                else {
                    $('#spanSettlement_PayeeNameView').text(data[0].PayeeName);
                    $('#spanSettlement_BankNameView').text(data[0].BankName);
                    $('#spanSettlement_AccountNumberView').text(data[0].BankAccountNo);
                    $('#spanSettlement_IFSCCodeView').text(data[0].IFSCCode);
                    $('#spanSettlement_SettledAmountView').text(data[0].SettledAmount);
                    $('#spanSettlement_TDSAmountView').text(data[0].TDSAmount);
                    $('#spanSettlement_NetAmountView').text(data[0].NetAmount);
                    var Modeofpayment = getNamepropwithId(data[0].ModeofpaymentID, MasterData.Mst_ModeOfPayment);
                    $('#spanSettlement_ModeOfPaymentView').text(Modeofpayment);
                    $('#spanSettlement_ChequeTransactionNoView').text(data[0].BankTransactionNo);
                    $('#spanSettlement_ChequeTransactionDateView').text(JSONDateTime(data[0].ChequeDate));

                    $("#divSettlementDetailsView").css({ "display": "block", "position": "absolute", "width": "100%", "height": "100%", "padding-top": "300px", "z-index": "1000", "background": "#000", "background": "rgba(0,0,0,0.75)" });
                }
            }
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
}

function ViewHistoricData(_ClaimID, _SlNo, flag, IsFrmArchived) {

    if (_ClaimID != null && _SlNo != null) {
        $.ajax({
            type: "GET",
            url: "/MedicalScrutiny/ClaimHistoryCommunication_Retrieve",
            contentType: 'application/json;charset=utf-8',
            //processData: false,
            data: { ClaimID: _ClaimID, SlNo: _SlNo, IsFrmArchived: IsFrmArchived },
            success: function (data) {
                CheckSessionVariable(data);
                try {
                    if (data == null || data == "") {
                    }
                    else
                        if (data.length > 0) {
                            data = $.parseJSON(data);
                            Bind_Communications(data, flag, IsFrmArchived);
                        }

                } catch (e) {
                    alert('Error while loading HistoricData');
                }

            },
            error: function (e, x) {
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });
    }
}


$(document).ready(function () {
    $(document).on('click', '#btnViewHistoricData', function () {
        var claimID = $('#hdnClaimID').val();
        var slNo = $('#hdnClaimSlNo').val();
        ViewHistoricData(claimID, slNo, 0, true);
    });

});

var approvalid = 0;
function Retrieve_Communications(_ClaimID, _SlNo, flag, IsFrmArchived) {
    if (_ClaimID != null && _SlNo != null) {
        if ($('#hdnClaimStageID').val() == 29) {
            $("#IsApprovaldiv").show();
            $("#IsApprovalletterStatus_chkbx").prop("disabled", false);
        }
        if ($('#hdnClaimStageID').val() == 27) {
            $("#Issettlementdiv").show();
            $("#IssettlementletterStatus_chkbx").prop("disabled", false);
        }

        $('#tblCommunication tbody tr').remove();
       
            $.ajax({
                type: "GET",
                url: "/MedicalScrutiny/ClaimCommunication_Retrieve",
                contentType: 'application/json;charset=utf-8',
                //processData: false,
                data: { ClaimID: _ClaimID, SlNo: _SlNo, IsFrmArchived: IsFrmArchived },
                success: function (data) {
                    CheckSessionVariable(data);
                    try {
                        data = $.parseJSON(data);
                        Bind_Communications(data, flag, IsFrmArchived);

                        if (data == null || data == "") {

                            $('#historicButtonContainer').show();
                            $('#btnViewHistoricData').prop('disabled', false);
                        } else {
                            $('#historicButtonContainer').hide();
                        }
                    } catch (e) {
                        alert('Error while loading notifications');
                    }

                },
                error: function (e, x) {
                    ShowResultMessage('ErrorMessage', e.responseText);
                }
            });
        
        if (approvalid == 1) { $("#IsApprovaldiv").hide(); }
    }
    // else
    // ShowWanringMessage("")
}

function Bind_Communications(data, flag, IsFrmArchived) {
    if (data != null && data.length > 0) {
        $('#tblCommunication tbody tr').remove();
        var iscrm = false;
        var alroles = $.parseJSON($('#hdnallowedRoles').val());

        // alert(alroles);
        if (alroles != null) {
            $.each(alroles, function (i, item) {
                if (item == 17 || item == 18 || item == 32) {
                    iscrm = true;
                    return;
                }
            });
        }
        for (var i = 0; i < data.length; i++) {
            var senddate = JSONDateTime(data[i].SentDate) == undefined ? '' : JSONDateTime(data[i].SentDate);
            var isMail = '';
            var isStatus = '';
            var isResentStatus = '';
            var isLetterPrint = '';

            if (data[i].CommMode_P23 == 86 && MakeZerofromUndefinedorEmpty(data[i].SentTo) == 0 && MakeZerofromUndefinedorEmpty(data[i].SentCC) == 0 && MakeZerofromUndefinedorEmpty(data[i].SentBCC) == 0)
                isMail = '';
            else
                isMail = '<div class="mb-1" style="text-align:left; cursor:pointer;border: 1px solid; border-radius: 4px; padding: 1px 4px; color:#a30f9c"><a style="padding:0px 0px !important;color:#a30f9c" onclick="ResendCommunication(' + data[i].ID + ');"><i class="fa fa-reply" aria-hidden="true"></i> <span style="font-size: 10px;margin-left: 0px;">Resend</span></a></div>';
            if (flag == 1 && iscrm == false)
                isMail = '';
            if (data[i].isSuccess == 0)
                isStatus = '<div class="mb-1" style="text-align:center; color:#ff0000"><i class="fa fa-times" aria-hidden="true"></i><p style="font-size: 10px;color: #000;margin-top: -4px;">Failed</p></div>';
            else
                isStatus = '<div class="mb-1" style="text-align:center; color:#15a126"><i class="fa fa-check" aria-hidden="true"></i><p style="font-size: 10px;color: #000;margin-top: -4px;">Sent</p></div>';

            if (data[i].isResend == 0)
                isResentStatus = '<div class="mb-1" style="text-align:center; color:#ff0000"><span style="font-size: 10px;color: #fff;background-color: #e1463c; border-radius:4px; padding:4px 6px; font-weight:600">No</span></div>';
            else
                isResentStatus = '<div class="mb-1" style="text-align:center; color:#15a126"><span style="font-size: 10px;color: #fff;background-color: #15a126; border-radius:4px; padding:4px 6px; font-weight:600">Yes</span></div>';

            var letter = '';
            var editable = '';
            var editable2 = '';
            var constentletter = '';
            var email = '';
            if (data[i].CommMode_P23 == 86 && data[i].EntityLevel_P6 != 295) {
                //debugger
                letter = '<div class="pe-1" title="Letter" style="color:#5a7490;  font-size: 1.6em;" id="show" onclick = "myPopup(\'/Common/PrintView?ID=' + data[i].ID + '&Flag=0&ClaimTypeID=' + $('#hdnClaimTypeID').val() + ' &PolicyTypeID=' + $('#hdnPolicyTypeID').val() + ' &ClaimStageID=' + $('#hdnClaimTypeID').val() + ' &IsFrmArchived=' + IsFrmArchived + '\')""><div class="mb-1" style="text-align:center; cursor:pointer"><i class="fa fa-file" aria-hidden="true"></i><p style="font-size: 10px;color: #000;margin-top: -4px;">Letter</p></div></div>';
                if (data[i].ConsentLetter != "0")
                    constentletter = '<div title="Consent Letter" class=" blue" style=" font-size: 1.6em;" onclick = "myPopup(\'/Common/PrintView?ID=' + data[i].ID + '&Flag=5&ClaimTypeID=' + $('#hdnClaimTypeID').val() + '&PolicyTypeID=' + $('#hdnPolicyTypeID').val() + '&ClaimStageID=' + data[i].ClaimStageID + '&IsFrmArchived=' + IsFrmArchived + '\')""><div style="text-align:center; cursor:pointer"><i class="fa fa-file-text" aria-hidden="true"></i><p style="font-size: 10px;color: #000;margin-top: -4px;">Consent Letter</p></div></div>';
                email = '<div class="pe-1" title="Email" style="color:#a49e84;   font-size: 1.5em;" onclick = "myPopup(\'/Common/PrintView?ID=' + data[i].ID + '&Flag=1&ClaimTypeID=' + $('#hdnClaimTypeID').val() + '&PolicyTypeID=' + $('#hdnPolicyTypeID').val() + '&ClaimStageID=' + data[i].ClaimStageID + '&IsFrmArchived=' + $('#hdnIsFrmArchived').val() + '\')""><div class="mb-1" style="text-align:center; cursor:pointer"><i class="fa fa-envelope" aria-hidden="true"></i><p style="font-size: 10px;color: #000;margin-top: -4px;">Email</p></div></div>';

                if (data[i].isLetterPrint == 0 || data[i].isLetterPrint == undefined)
                    isLetterPrint = '<div class="mb-1" style="text-align:center; color:#ff0000"><span style="font-size: 10px;color: #fff;background-color: #e1463c; border-radius:4px; padding:4px 6px; font-weight:600">No</span></div>';
                else
                    isLetterPrint = '<div class="mb-1" style="text-align:center; color:#15a126"><span style="font-size: 10px;color: #fff;background-color: #15a126; border-radius:4px; padding:4px 6px; font-weight:600">Yes</span></div>';
            } else
                if (data[i].CommMode_P23 == 250) {
                    //debugger
                    letter = '<a class="blue" style="width: 30px; height: 30px; font-size: 1.7em;" id="show" onclick = "myPopup(\'/Common/PrintView?ID=' + data[i].ID + '&Flag=2&ClaimTypeID=' + $('#hdnClaimTypeID').val() + '&PolicyTypeID=' + $('#hdnPolicyTypeID').val() + '&ClaimStageID=' + data[i].ClaimStageID + '&IsFrmArchived=' + IsFrmArchived + '\')""><i class="fa fa-file" aria-hidden="true"></i></a>';
                    if (data[i].isLetterPrint == 0 || data[i].isLetterPrint == undefined)
                        isLetterPrint = '<div class="mb-1" style="text-align:center; color:#ff0000"><span style="font-size: 10px;color: #fff;background-color: #e1463c; border-radius:4px; padding:4px 6px; font-weight:600">No</span></div>';
                    else
                        isLetterPrint = '<div class="mb-1" style="text-align:center; color:#15a126"><span style="font-size: 10px;color: #fff;background-color: #15a126; border-radius:4px; padding:4px 6px; font-weight:600">Yes</span></div>';
                }
                else // vijitha for agent notification email should display not letter
                {
                    letter = '<div class="" title="SMS" style="color: #9a70f7;  font-size: 1.6em;" onclick = "myPopup(\'/Common/PrintView?ID=' + data[i].ID + '&Flag=1&ClaimTypeID=' + $('#hdnClaimTypeID').val() + '&PolicyTypeID=' + $('#hdnPolicyTypeID').val() + '&ClaimStageID=' + data[i].ClaimStageID + '&IsFrmArchived=' + IsFrmArchived + '\')""><div style="text-align:center; cursor:pointer"><i class="fa fa-comments" aria-hidden="true"></i><p style="font-size: 10px;color: #000;margin-top: -4px;">SMS</p></div></div>';
                    if (data[i].isLetterPrint == 0 || data[i].isLetterPrint == undefined)
                        isLetterPrint = '<div class="mb-1" style="text-align:center; color:#ff0000"><span style="font-size: 10px;color: #fff;background-color: #e1463c; border-radius:4px; padding:4px 6px; font-weight:600">No</span></div>';
                    else
                        isLetterPrint = '<div class="mb-1" style="text-align:center; color:#15a126"><span style="font-size: 10px;color: #fff;background-color: #15a126; border-radius:4px; padding:4px 6px; font-weight:600">Yes</span></div>';

                }
            if (data[i].ClaimStageID == 23 && data[i].CommMode_P23 == 86) {

                $("#tblCommunication thead th:last-child,#tblCommunication thead th:nth-child(8)").css({ "color": "#fff" });

                editable = '<a class="blue" id="show" onclick = "myPopup(\'/Common/EditView?ID=' + data[i].ID + '&Flag=0&ClaimTypeID=' + $('#hdnClaimTypeID').val() + '&PolicyTypeID=' + $('#hdnPolicyTypeID').val() + '&ClaimStageID=' + data[i].ClaimStageID + '\')""><div style="text-align:left; cursor:pointer; margin-bottom:10px;border: 1px solid; border-radius: 4px; padding: 1px 4px;"><i class="fa fa-pencil" aria-hidden="true"></i><span style="font-size: 10px;color: #000;margin-left: 4px;">Edit Email</span></div></a>';
                editable2 = '<a class="" style="color:#896e07"  onclick = "myPopup(\'/Common/EditNotification?ID=' + data[i].ID + '&Flag=0&ClaimTypeID=' + $('#hdnClaimTypeID').val() + '&PolicyTypeID=' + $('#hdnPolicyTypeID').val() + '&ClaimStageID=' + data[i].ClaimStageID + '\')""><div style="text-align:left; cursor:pointer; margin-bottom:10px;border: 1px solid; border-radius: 4px; padding: 1px 4px; color:#b3920f"><i class="fa fa-pencil" aria-hidden="true"></i><span style="font-size: 10px;margin-left: 4px;">Edit & Print</span></div></a>';

                if (data[i].isLetterPrint == 0 || data[i].isLetterPrint == undefined)
                    isLetterPrint = '<div class="mb-1" style="text-align:center; color:#ff0000"><span style="font-size: 10px;color: #fff;background-color: #e1463c; border-radius:4px; padding:4px 6px; font-weight:600">No</span></div>';
                else
                    isLetterPrint = '<div class="mb-1" style="text-align:center; color:#15a126"><span style="font-size: 10px;color: #fff;background-color: #15a126; border-radius:4px; padding:4px 6px; font-weight:600">Yes</span></div>';
            }
            else {
                editable2 = '<div class="mb-1" style="text-align:left; color:#ff0000; border:1px solid; border-radius:4px; padding:1px 4px; margin-bottom:10px"><i class="fa fa-ban" aria-hidden="true"></i><span style="font-size: 10px;color: #000;margin-left: 4px;">NA</span></div>';
                //editable = "NA";
            }
            //else // vijitha for agent notification email should display not letter
            //{
            //    editable = '<a class="fa fa-pencil-square-o blue" style="width: 30px; height: 30px; font-size: 1.7em;" onclick = "myPopup(\'/Common/EditView?ID=' + data[i].ID + '&Flag=1&ClaimTypeID=' + $('#hdnClaimTypeID').val() + '&PolicyTypeID=' + $('#hdnPolicyTypeID').val() + '&ClaimStageID=' + data[i].ClaimStageID + '\')""></a>';

            //    if (data[i].isLetterPrint == 0 || data[i].isLetterPrint == undefined)
            //        isLetterPrint = 'No';
            //    else
            //        isLetterPrint = 'Yes';

            //}

            if (data[i].ClaimStageID == 24 && data[i].CommMode_P23 == 86) {
                $("#IsApprovaldiv").hide();
                approvalid = 1;
            }
            if (data[i].ClaimStageID == 27 && data[i].CommMode_P23 == 86) {
                $("#Issettlementdiv").hide();
                approvalid = 1;
            }
            var modevalue = (data[i].Mode == "Eligible Amount" ? "Whats App" : data[i].Mode);
            /******* Alignment Issues Under Notifications (SP-1306) ********/
            
            var isSmsMode = (data[i].Mode || '').trim().toUpperCase() === "SMS";

            var contactColumn = '<td>'
                + '<p><span style="font-weight:600;margin-right:12px;">To:</span><span>' + (data[i].SentTo || '') + '</span></p>';

            if (!isSmsMode) {
                contactColumn +=
                    '<p><span style="font-weight:600;margin-right:10px;">CC:</span><span>' + (data[i].SentCC || '') + '</span></p>' +
                    '<p><span style="font-weight:600;margin-right:2px;">BCC:</span><span>' + (data[i].SentBCC || '') + '</span></p>' +
                    '<p class="mt-2"><span style="font-weight:600;margin-right:2px;">Subject:</span><span>' + (data[i].SentSubject || '') + '</span></p>';
            }

            contactColumn += '</td>';

            var tblBody = '<tr>'
                + '<td data-title="Mode" class="numeric"><a onclick="myPopup(\'/Common/PrintView?ID=' + data[i].ID
                + '&Flag=1&ClaimTypeID=' + $('#hdnClaimTypeID').val()
                + '&PolicyTypeID=' + $('#hdnPolicyTypeID').val()
                + '&ClaimStageID=' + data[i].ClaimStageID
                + '&IsFrmArchived=' + $('#hdnIsFrmArchived').val()
                + '\')">' + data[i].Mode + '</a></td>'

                + '<td data-title="ClaimStage" class="numeric">'
                + MakeEmptyfromUndefinedorNull(data[i].Claimstage) + '</td>'

                + contactColumn

                + '<td data-title="Message Content">' + (email || '') + (letter || '') + (constentletter || '') + '</td>'

                + '<td data-title="Sent Date" class="numeric">' + senddate + '</td>'
                + '<td data-title="Status">' + isStatus + '</td>'
                + '<td data-title="Resend Status">' + isResentStatus + '</td>'
                + '<td data-title="LetterPrint">' + isLetterPrint + '</td>'
                + '<td data-title="Resend"><p>' + editable2 + '</p><p>' + editable + '</p><p>' + isMail + '</p></td>'
                + '</tr>';

            $('#tblCommunication tbody').append(tblBody);
            Rese.push(data[i]);
            if (data[i].ClaimStageID != 23) {
                $("#edit_Print").hide()
            }

            //$('#hdnCommunication_' + data[i].ID).val(data[i].SentContent);
        }
    }
    else {
        $('#tblCommunication tbody').html('<tr><td colspan="12">No Notifications Found</td></tr>')
        if (IsFrmArchived == true || IsFrmArchived == 'true') {
            $('#tblCommunication tbody').html('<tr><td colspan="12">No Historic Data Found</td></tr>')
        }
    }
}

function displayTestInnerHtml(id, html) {
    $('#' + id + '').text(html);
}

function CommunicationPopUp(id) {

    $('#divCommunicationPopUp').html('');
    $('#divCommunicationPopUp').html($('#hdnCommunication_' + id).val());
    $("#divCommunicationPopUpHead").css({ "display": "block", "width": "100%", "height": "100%", "z-index": "1000", "background": "#000", "background": "rgba(0,0,0,0.75)" });
}

function UpdatePrintLetterStatus(_commID) {
    if (_commID != null) {
        $.ajax({
            type: "GET",
            url: "/Common/UpdatePrintLetterStatus",
            contentType: 'application/json;charset=utf-8',
            ////processData: false,
            data: { CommID: _commID },
            success: function (data) {
                CheckSessionVariable(data);
                if (data == 1) {
                    alert('Print status updated successfully.');
                }
                else {
                    alert('Error while updating print status.');
                }
            },
            error: function (e, x) {
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });
    }
}
var documentList;
function GetDMSDocuments() {
    var claimId = $('#hdnClaimID').val();
    var slNo = $('#hdnClaimSlNo').val();

    // Step 1️⃣: Combine parameters as a single string
    var paramString = [claimId, slNo].join('|');

    // Step 2️⃣: Encrypt parameters before making the main call
    $.ajax({
        url: '/Common/EncryptParameters',
        type: 'POST',
        data: { Q: paramString },
        success: function (encryptedValue) {
            if (encryptedValue) {

                // Step 3️⃣: Proceed with the main request using encrypted Q
                $.ajax({
                    type: "GET",
                    url: "/MedicalScrutiny/GetDMSDocuments",
                    data: { Q: encryptedValue },
                    success: function (data) {
                        CheckSessionVariable(data);
                        data = $.parseJSON(data);
                        if (data == undefined)
                            return false;

                        $("#tblSpectraScanDocAttachmentsBody").html("");
                        documentList = data.DocumentsListViewDto;

                        if (documentList.length > 0) {
                            GetFilerBySlno();
                            $("#DMSDocView").show();
                            $("#DMSAnnotationSpec").show();
                        } else {
                            $("#tblSpectraScanDocAttachmentsBody").html("<td>No Documents Found</td>");
                            $("#DMSDocView").hide();
                            $("#DMSAnnotationSpec").hide();
                        }
                    },
                    error: function (e, x) {
                        ShowResultMessage('ErrorMessage', e.responseText);
                    }
                });

            } else {
                ShowResultMessage('ErrorMessage', 'Error encrypting parameters.');
            }
        },
        error: function () {
            ShowResultMessage('ErrorMessage', 'Encryption failed.');
        }
    });
}

var filteredList;
function GetFilerBySlno() {

    var selectedValue = $('#txtExtentionsNo').val();

    if (documentList == undefined)
        return false;

    if (selectedValue != 0) {
        filteredList = documentList.filter(v => v.ClaimExtNo == selectedValue).sort(v => v.ScanDate);
    }
    else {
        filteredList = documentList.sort(v => v.ScanDate);
    }
    var tableData = ''

    $("#tblSpectraScanDocAttachmentsBody").html("");
    if (filteredList.length > 0) {
        let viewerUrl = filteredList[0].NextGenViewerURL;// + '&userId=' + $("#hdnLoggedUserId").val() + '';
        let annotationUrl = filteredList[0].NextGenAnnotationURL;// + '&userId=' + $("#hdnLoggedUserId").val() + '';
        $("#hdnNextGenViewerUrl").val(viewerUrl);
        $("#hdnNextGenAnnotationUrl").val(annotationUrl);
        $.each(filteredList, function (index) {
            if (filteredList[index].DocType == 1) {
                var DocType = _claimextnocount.filter(v => v.Slno == filteredList[index].ClaimExtNo).sort(v => v.ScanDate)[0].ReqType;
                let bgColor = filteredList[index].ReadFlag ? 'read-item' : '';
                tableData = tableData + '<tr class="' + bgColor + '">';
                if (filteredList[index].IsScanned) {
                    tableData = tableData + '<td class="text-center"> <img src = "../Content/images/scan.png" title="Scanned Document" /></td>';
                } else {
                    tableData = tableData + '<td class="text-center"> <i class="fa fa-paperclip f-18 f-blue" aria-hidden="true" title="Upload Document"></i></td>';
                }
                if (filteredList[index].DocCategory == "IR_Replies") {
                    DocType = "Query Response";
                }
                //if (filteredList[index].SourceFileName.split('_')[0] == "Interim Case summary") {
                //    filteredList[index].DocCategory = "Interim Case Summary";
                //}
                //if (filteredList[index].SourceFileName.split('_')[0] == "Interim Bills") {
                //    filteredList[index].DocCategory = "Interim Bills";
                //}
                var DocCategory = "";
                if (lstSubDocs.filter(v => v.subCategoryCode == filteredList[index].SourceFileName.split('-')[0]).length > 0) {
                    DocCategory = lstSubDocs.filter(v => v.subCategoryCode == filteredList[index].SourceFileName.split('-')[0])[0].title;

                }
                else {
                    DocCategory = filteredList[index].DocCategory;
                }
                if (filteredList[index].DocCategory == "Medical Reports") {
                    DocCategory = "Medical Reports";
                }
                if (filteredList[index].DocCategory == "Investigation_Reports") {
                    DocCategory = "Case Investigation reports";
                }
                if (filteredList[index].ReceivedMode == null) {
                    filteredList[index].ReceivedMode = "Spectra";
                }
                tableData = tableData + '<td>' + filteredList[index].ClaimID + "-" + filteredList[index].ClaimExtNo + '</td>';
                tableData = tableData + '<td>' + filteredList[index].ReceivedMode + '</td>';
                tableData = tableData + '<td>' + filteredList[index].ReceivedBy + '</td>';
                tableData = tableData + '<td>' + DocCategory + '</td>';
                tableData = tableData + '<td>' + DocType + '</td>';
                if (!filteredList[index].ReadFlag) {
                    tableData = tableData + '<td title="Unread"> <img src="../Content/images/newdoc.png" class="unread-item"> ' + filteredList[index].SourceFileName + '</td>';
                } else {
                    tableData = tableData + '<td>' + filteredList[index].SourceFileName + '</td>';
                }

                tableData = tableData + '<td>' + JSONDateTime(filteredList[index].ScanDate) + '</td>';
                if (filteredList[index].AnnotationFlag) {
                    tableData = tableData + '<td><a id="DMSDocView_Id" target="blank" href=' + filteredList[index].NextGenViewerURL + ' style="margin-right:10px"><i class="fa fa-eye f-blue f-16" aria-hidden="true" width="20px" title="Document View"></i></a> <a id="DMSAnnotation" href=' + filteredList[index].NextGenAnnotationURL + ' target="_blank" class=""> <i class="fa fa-pencil-square-o f-green f-20" aria-hidden="true" width="20px" title="View Annotated Doc"/></a></td> ';
                } else {
                    tableData = tableData + '<td><a id="DMSDocView_Id" target="blank" href=' + filteredList[index].NextGenViewerURL + ' style="margin-right:10px"><i class="fa fa-eye f-blue f-16" aria-hidden="true" width="20px" title="Document View"></i></a> <a id="DMSAnnotation" href=' + filteredList[index].NextGenAnnotationURL + ' target="_blank" class=""> <i class="fa fa-pencil-square-o f-black f-20" aria-hidden="true" width="20px" title="View Orginal Doc"/></a></td> ';
                }

                tableData = tableData + '</tr>';
            }
        });
        $("#tblSpectraScanDocAttachmentsBody").html(tableData);
        $("#DMSDocView").show();
        $("#DMSAnnotationSpec").show();
    }
    else {
        $("#tblSpectraScanDocAttachmentsBody").html("<td>No Documents Found</td>");
        $("#DMSDocView").hide();
        $("#DMSAnnotationSpec").hide();
    }
}


var dmsFlage = 0;
var checkDevpop = 0;
var lstSubDocs = null;
function GetDocumentSubCategories() {
    $('#progress1').show();
    $.ajax({
        type: "GET",
        url: "/MedicalScrutiny/GetDocumentSubCategories",
        contentType: 'application/json;charset=utf-8',
        success: function (res) {
            $('#progress1').hide();
            lstSubDocs = JSON.parse(res);
            //$.each(lstDocs, function (index) {
            //    $("#txtCategoryIRDoc").append($("<option></option>").val(lstDocs[index].Id + "_" + lstDocs[index].Code).html(lstDocs[index].Title));
            //});
        },
        error: function (e, x) {
            $('#progress1').hide();
            console.log(e);
        }
    });
}

function Retrieve_Attachments(_ClaimID, flag, IsFrmArchived) {
    $('#progress1').show();
    var VreceivedDate = GetDateTime(new Date());
    $('#txtScanFileReceivedDate').val(JSONDateTime(VreceivedDate));
    $('#ddlModeofDeliverID').val(3);
    if (_ClaimID != null) {
        GetDocumentSubCategories();
        if ($('#hdnClaimTypeID').val() == 1 && ($('#hdnRequestTypeID').val() == 1 || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3)) {
            LoadMDSdata();
        }


        if (flag == 1) {
            $('#tblAttachments tbody').empty();
        }
        //GetDocumentSubCategories();
        $("#txtCategoryIRDoc option:selected").val(0);
        $('#txtCategoryIRDoc').find("option").remove();
        $('#txtCategoryIRDoc').html('<option value="0">--Select Category--</option>');
        if ($('#hdnClaimTypeID').val() == 2 || ($('#hdnRequestTypeID').val() != 1 && $('#hdnRequestTypeID').val() != 2 && $('#hdnRequestTypeID').val() != 3)) {
            $.ajax({
                type: "GET",
                url: "/MedicalScrutiny/GetDocumentCategories",
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    var lstDocs = JSON.parse(res);
                    $.each(lstDocs, function (index) {
                        $("#txtCategoryIRDoc").append($("<option></option>").val(lstDocs[index].Id + "_" + lstDocs[index].Code).html(lstDocs[index].Title));
                    });
                },
                error: function (e, x) {
                    console.log(e);
                }
            });
        }

        if ($('#tblAttachments tbody').children().length == 0) {
            $.ajax({
                type: "GET",
                url: "/MedicalScrutiny/ClaimAttachment_Retrieve",
                contentType: 'application/json;charset=utf-8',
                //processData: false,
                data: { ClaimID: _ClaimID, IsFrmArchived: $('#hdnIsFrmArchived').val() },
                success: function (data) {
                    CheckSessionVariable(data.responseText);
                    data = $.parseJSON(data);
                    if (data.Table2.length > 0) {
                        checkDevpop = 1;
                        $("#hdnSrcFlag").val(data.Table2[0].SpectraDMSFlag);
                        dmsFlage = $("#hdnSrcFlag").val();
                        if (data.Table2[0].SpectraDMSFlag == 0 || data.Table2[0].SpectraDMSFlag == null || dmsFlage == "") {
                            $('#tblDMSAttachments').hide()
                            $("#hdnSrcFlag").val(0);
                            checkDevpop = 1;
                            Bind_Attachments(data);
                            $('#progress').hide();
                        }
                        else if (data.Table2[0].SpectraDMSFlag == 1) {
                            $('#DMSAddDoc,#DMSUpdateClass').hide()
                            $('#dvSpectraScan').show();
                            $('#omniUploadDiv').hide();
                            Bind_Attachments(data);
                            GetDMSDocuments();
                            if ($('#hdnClaimTypeID').val() == 1 && ($('#hdnRequestTypeID').val() == 1 || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3)) {
                                LoadMDSdata();
                            }
                        }
                    } else {
                        $("#hdnSrcFlag").val(0);
                        dmsFlage = $("#hdnSrcFlag").val();
                        checkDevpop = 1;
                        Bind_Attachments(data);
                        if (data == null || data == "") {
                            //alert('Data not found.');
                        }
                        $('#progress1').hide();

                    }

                },
                error: function (e, x) {
                    $('#progress1').hide();
                    ShowResultMessage('ErrorMessage', e.responseText);
                }
            });
        }

        $('#progress1').hide();
    }
}

var DMSFilesData = [];
function Bind_Attachments(data) {
    if (data != null && data.Table.length > 0) {
        var dvOmniScan = 0;
        DMSFilesData = data;


        for (var i = 0; i < (data.Table).length; i++) {



            var tr = '<tr><td data-title="Stage">' + data.Table[i].ClaimStage + '</td>'
                + '<td data-title="Received Mode">' + data.Table[i].ReceivedMode + '</td>'
                + '<td data-title="ReceivedBy">' + data.Table[i].ReceivedBy + '</td>'
                + '<td data-title="	File Received Date">' + JSONDateTime(data.Table[i].filereceiveddate) + '</td>'
                + '<td data-title="	Document Type">' + data.Table[i].RequestType + '</td>'
                + '<td data-title="	File Names">' + data.Table[i].FileNames + '</td>'
                + '<td><button type="button" class="btn btn-primary btn-sm" onclick= OpenDMSFilesPopUp("' + data.Table[i].DMSIDs + '")>View</button></td></tr>';
            //+ '<td><button type="button" onclick= ViewUpload_DMSDocument("' + $('#hdnClaimID').val() + '")>View</button></td></tr>';

            //// + '<td class="center"> <a class="btn btn-sm btn-warning ng-scope ng-hide" href="/FUP/GetFile?fileID=' + data[i].DMSIDs + '"><i class="glyphicon glyphicon-download"></i>Download</a>&nbsp&nbsp</td></tr>';

            //for (var j = 0; j < (data.Table1).length; j++) {
            //    if (data.Table[i].DMSIDs == data.Table1[j].ID) {
            //        var td = td + '<td><a onclick=popupCenter(' + data.Table1[j]['Filepath'] + data.Table1[j]['SystemFilename'] + ',"myPop1",750,650); href="javascript:void(0);" >' + data.Table1[j]["Name"] + '</a></td></tr>';
            //    }
            //}

            $('#tblAttachments tbody').append(tr);
            if (data.Table[i].DMSIDs != null && data.Table[i].DMSIDs != '') {
                if (data.Table[i].DMSIDs.length > 0) {
                    dvOmniScan = 1;
                }
            }
        }
        if (dvOmniScan == 0) {
            $('#dvOmniScan').hide();
        }
    }
    else {
        $('#tblAttachments tbody').html('<tr><td colspan="6">No Documents Found</td></tr>')
    }
}

function OpenDMSFilesPopUp(DMSIDs) {
    var results = []
    results = GetDMSFileData(DMSFilesData.Table1, DMSIDs);

    BindDMSfilesResults(results, 'tblDMSResults', null);
    CommonDialog($('#divtblDMSResults').html(), '', null, GetDMSFilesinfoclose, 800, 500);
}

function GetDMSFileData(data, dmsIDs) {
    var dmsValues = [];
    var IDs = dmsIDs.split(',');
    for (var j = 0; j < data.length; j++) {
        for (var i = 0; i < IDs.length; i++) {

            if (data[j].ID == IDs[i]) {
                dmsValues.push(data[j]);
            }
        }
    }

    return dmsValues;
}

function GetDMSFilesinfoclose() {
    $('#tblDMSResults').html('');
}

function BindDMSfilesResults(data, tableId, count) {
    if (data != null) {
        $('#' + tableId).html('');
        var columns = [];
        if ((data != null)) {
            columns = GetColumnsOfJsonObj(data[0]);
            var tHead = "<thead><tr>";
            if (count == null || count == undefined || count == '')
                count = columns.length;
            count = (columns.length > count) ? count : columns.length;
            for (var i = 0; i < count; i++) {
                //  tHead = tHead + "<th>" + columns[i].capitalize() + "</th>";
                if (columns[i] == "SystemFilename" || columns[i] == "Filepath") {
                }
                else
                    if (columns[i] == "ID") {
                        tHead = tHead + "<th>" + columns[i] + "</th>";
                    }
                    else
                        tHead = tHead + "<th>" + columns[i] + "</th>";
            }
            tHead = tHead + "</tr></thead>";
            $("#" + tableId).append(tHead);

            // Count = Count + data.length;
            for (var i = 0; i < data.length; i++) {

                if (data[i] != null) {
                    //$('#PreAuth_download').css({ 'display': 'inherit' });
                    var tr = "<tr class='tr'>";
                    for (var j = 0; j < count; j++) {
                        // tr = tr + "<td>" + data[i][columns[j]] + "</td>";
                        if (columns[j] == "SystemFilename" || columns[j] == "Filepath") {
                            // tr = tr + '<td><a href="#" id="' + data[i][columns[j]] + '" onclick="PreauthStatus(this) ">' + data[i][columns[j]] + '</a></td>';
                        }
                        else
                            if (columns[j] == "ID") {
                                tr = tr + "<td>" + (i + 1) + "</td>";
                            }
                            else
                                if (columns[j] == "Name") {
                                    //var url = data[i]['Filepath'] + data[i]['SystemFilename'];
                                    var url = "http:" + data[i]['Filepath'] + data[i]['SystemFilename'];
                                    url = url.replace(/\s+/g, '%20');
                                    //tr = tr + "<td><a onclick=popupCenter('" + data[i]['Filepath'] + data[i]['SystemFilename'] + "','myPop1',750,650); href='javascript:void(0);' >" + data[i]['Name'] + "</a></td><td data-title='Select'><input type='checkbox' ></a></td>";
                                    tr = tr + "<td><a onclick=popupCenter('" + url + "','myPop1',750,650); href='javascript:void(0);' >" + data[i]['Name'] + "</a></td><td data-title='Select'><input type='checkbox' ></a></td>";
                                }
                                else {
                                    tr = tr + "<td>" + data[i][columns[j]] + "</td>";
                                }
                    }
                    tr = tr + "</tr>";
                    $("#" + tableId).append(tr);
                }
            }
        }
        if ((data.length == 0) || (data == null)) {
            // $('#PreAuth_download').css({ 'display': 'none' });
            var $tr = $('<tr class="tr">').append($('<td colspan="8" style=" font-size:large; color:#3A798C;text-align:center;">').text("No Records Found")
            ).appendTo('#' + tableId);
        }
    }
}

var _resArray = [];
function Insert_Manual_Attachments(EntityTypeid, Entityid) {

    try {

        if (EntityTypeid != "" && Entityid != "") {

            //This variable will become Dynamic to validate Max file Size
            var fileUploadsize = 10485760;//10MB
            var filesLength = 0;
            if (dmsFlage == "1") {

                var dmsApiURL = $('#hdnDMSApiURL').val();
                var docCategoryID = "";
                var docCategoryCode = "";
                let data = new FormData();
                var claimID = $("#hdnClaimID").val();
                var claimExtNo = $("#hdnClaimSlNo").val();
                var DocCategory = $("#txtCategoryIRDoc").val();
                var receivedDate = $('#txtScanFileReceivedDate').val()
                var receivedModeID = $('#ddlModeofDeliverID').val();
                var userID = $('#hdnLoggedUserId').val();
                var resultData = DocCategory.split("_");
                if (resultData.length == 2) {
                    docCategoryID = resultData[0];
                    docCategoryCode = resultData[1]
                }
                var filterdFiles = [];
                $("#tblFileslistScan tr").each(function () {
                    let tdVal = $(this).find("td:eq(1)").text();
                    if (tdVal != "") {
                        filterdFiles.push(tdVal.trim());
                    }

                });
                var listFiles = $("input[name=filesScan]").get(0).files;
                if (listFiles.length == 0) {
                    alert('Please browse files to upload');
                    return;
                }
                var isValid = true;
                for (var i = 0; i < listFiles.length; i++) {
                    if (filterdFiles.includes(listFiles[i].name)) {
                        var extension = listFiles[i].name.replace(/^.*\./, '');
                        if (extension.toLowerCase() != "pdf" && extension.toLowerCase() != "jpeg" && extension.toLowerCase() != "jpg" && extension.toLowerCase() != "png") {
                            alert('Please browse PDF, JPEG, JPG and PNG files only');
                            isValid = false;
                            return false;
                        }
                    }
                }
                if (!isValid) {
                    return false;
                }

                if (userID == null || userID == "") {
                    alert('User ID cannot be null');
                    return false;
                }
                if (docCategoryID != "0" && docCategoryID == 0) {
                    alert('Please select document category');
                    return false;
                }
                if (MakeNullfromUndefinedorEmpty($('#txtScanFileReceivedDate').val()) == null) {
                    alert('Please select file received date');
                    return false;
                }
                if (receivedModeID == "0" && receivedModeID == 0) {
                    alert('Please select received type');
                    return false;
                }
                data.append("claimID", claimID);
                data.append("claimExtNo", claimExtNo);
                data.append("docCategoryID", docCategoryID);
                data.append("docCategoryCode", docCategoryCode);
                data.append("receivedDate", receivedDate);
                data.append("receivedModeID", receivedModeID);
                data.append("userID", userID);
                var _size = 0;
                if (listFiles.length != 0) {
                    $.each(listFiles, function (i, item) {
                        if (filterdFiles.includes(item.name)) {
                            _size = _size + item.size;
                            filesLength = filesLength + 1;
                        }
                    });
                }
                if (_size > fileUploadsize) {
                    alert('Max uploaded size Exceeded');
                    return false;
                }

                for (var i = 0; i < listFiles.length; i++) {
                    if (filterdFiles.includes(listFiles[i].name)) {
                        data.append(listFiles[i].name, listFiles[i]);
                    }
                }
                var q = $('#hdnqString').val();
                if (sessionStorage.getItem('token') == null) {
                    $.ajax({
                        type: "GET",
                        url: dmsApiURL + "api/auth/keyauthentication?q=" + encodeURIComponent(q) + "",
                        contentType: "application/json",
                        success: function (res) {
                            if (res != "") {
                                //sessionStorage.setItem('token', res);
                                uploadDMSDocuments(dmsApiURL, data, claimID, res);
                            }
                        },
                        error: function (xhr, status, error) {
                            alert(error);
                        }
                    });
                } else {
                    uploadDMSDocuments(dmsApiURL, data, claimID, '');
                }
            }
            else {

                _resArray = [];
                var filesLength = 0;

                var _files = $("input[name=files]");
                if (MakeNullfromUndefinedorEmpty($('#txtAttFileReceivedDate').val()) == null) {
                    alert('Please select file received date');
                    return false;
                }
                if (_files.length > 1) {
                    var _size = 0;
                    $.each(_files, function (i, files) {
                        var files = $("input[name=files]").get(i).files;
                        if (files.length != 0) {
                            $.each(files, function (i, item) {
                                _size = _size + item.size;
                                filesLength = filesLength + 1;
                            });
                        }
                    });
                    if (_size > fileUploadsize) {
                        alert('Max uploaded size Exceeded');
                        return false;
                    }
                }

                $.each(_files, function (i, files) {
                    var files = $("input[name=files]").get(i).files;
                    if (files.length != 0) {
                        // var type = 16;
                        // var id = 111;
                        $.each(files, function (i, item) {
                            //for (var i = 1; i <= 100; i++) { $('#progress .progress-bar').css('width', i + '%'); }
                            var data = new FormData();
                            // Add the uploaded image content to the form data collection
                            if (files.length > 0) {
                                data.append("files", files[i]);
                            }
                            // Make Ajax request with the contentType = false, and procesDate = false
                            var ajaxRequest = $.ajax({
                                type: "POST",
                                url: "/FUP/ManualDocumentUploadAjax?EntityTypeID=" + EntityTypeid + "&EntityID=" + Entityid,
                                contentType: false,
                                processData: false,
                                data: data
                            });
                            ajaxRequest.done(function (xhr) {
                                _resArray.push(xhr);

                                if (_resArray.length > 0) {
                                    if (filesLength == _resArray.length) {
                                        InsertManualuploadrequestdetails();
                                        Retrieve_Attachments($('#hdnClaimID').val(), 1);
                                    }
                                }

                                ////DialogResultMessage('divMUWanringBox', 'Files uploaded successfully...');
                            });
                        });

                    }

                });
                $('#divfilebuttons').html('<span class="btn btn-success fileinput-button" id="spanfileupload1" ><i class="glyphicon glyphicon-plus"></i><span>Drop files to upload (or click) ...</span><input id="fileupload1" type="file" name="files" multiple onclick="fileonclick();" onchange="Filechangeevent(this.files,1)"></span>');
            }
        }
        else {
            alert('Please browse files to upload');
        }
    }
    catch (e) {
        alert("Unexpected Error Occured while upload files");
    }
}
function Insert_Attachments(EntityTypeid, Entityid) {
    $('#progress1').show();
    InsertPreauthDMSUploadajax($('#hdnClaimID').val(), $('#hdnClaimSlNo').val());
    //try {

    //    if (EntityTypeid != "" && Entityid != "") {

    //        //This variable will become Dynamic to validate Max file Size
    //        var fileUploadsize = 10485760;//10MB
    //        var filesLength = 0;
    //        if (dmsFlage == "1") {

    //            var dmsApiURL = $('#hdnDMSApiURL').val();
    //            var docCategoryID = "";
    //            var docCategoryCode = "";
    //            let data = new FormData();
    //            var claimID = $("#hdnClaimID").val();
    //            var claimExtNo = $("#hdnClaimSlNo").val();
    //            var DocCategory = $("#txtCategoryIRDoc").val();
    //            var receivedDate = $('#txtScanFileReceivedDate').val()
    //            var receivedModeID = $('#ddlModeofDeliverID').val();
    //            var userID = $('#hdnLoggedUserId').val();
    //            var resultData = DocCategory.split("-");
    //            if (resultData.length == 2) {
    //                docCategoryID = resultData[0];
    //                docCategoryCode = resultData[1].split("&")[0];
    //            }
    //            var filterdFiles = [];
    //            $("#tblFileslistScan tr").each(function () {
    //                let tdVal = $(this).find("td:eq(1)").text();
    //                if (tdVal != "") {
    //                    filterdFiles.push(tdVal.trim());
    //                }

    //            });
    //            var listFiles = $("input[name=filesScan]").get(0).files;
    //            if (listFiles.length == 0) {
    //                alert('Please browse files to upload');
    //                return;
    //            }
    //            var isValid = true;
    //            for (var i = 0; i < listFiles.length; i++) {
    //                if (filterdFiles.includes(listFiles[i].name)) {
    //                    var extension = listFiles[i].name.replace(/^.*\./, '');
    //                    if (extension.toLowerCase() != "pdf" && extension.toLowerCase() != "jpeg" && extension.toLowerCase() != "jpg" && extension.toLowerCase() != "png") {
    //                        alert('Please browse PDF, JPEG, JPG and PNG files only');
    //                        isValid = false;
    //                        return false;
    //                    }
    //                }
    //            }
    //            if (!isValid) {
    //                return false;
    //            }

    //            if (userID == null || userID == "") {
    //                alert('User ID cannot be null');
    //                return false;
    //            }
    //            if (docCategoryID != "0" && docCategoryID == 0) {
    //                alert('Please select document category');
    //                return false;
    //            }
    //            if (MakeNullfromUndefinedorEmpty($('#txtScanFileReceivedDate').val()) == null) {
    //                alert('Please select file received date');
    //                return false;
    //            }
    //            if (receivedModeID == "0" && receivedModeID == 0) {
    //                alert('Please select received type');
    //                return false;
    //            }
    //            data.append("claimID", claimID);
    //            data.append("claimExtNo", claimExtNo);
    //            data.append("docCategoryID", docCategoryID);
    //            data.append("docCategoryCode", docCategoryCode);
    //            data.append("receivedDate", receivedDate);
    //            data.append("receivedModeID", receivedModeID);
    //            data.append("userID", userID);
    //            var _size = 0;
    //            if (listFiles.length != 0) {
    //                $.each(listFiles, function (i, item) {
    //                    if (filterdFiles.includes(item.name)) {
    //                        _size = _size + item.size;
    //                        filesLength = filesLength + 1;
    //                    }
    //                });
    //            }
    //            if (_size > fileUploadsize) {
    //                alert('Max uploaded size Exceeded');
    //                return false;
    //            }

    //            for (var i = 0; i < listFiles.length; i++) {
    //                if (filterdFiles.includes(listFiles[i].name)) {
    //                    data.append(listFiles[i].name, listFiles[i]);
    //                }
    //            }
    //            var q = $('#hdnqString').val();
    //            if (sessionStorage.getItem('token') == null) {
    //                $.ajax({
    //                    type: "GET",
    //                    url: dmsApiURL + "api/auth/keyauthentication?q=" + encodeURIComponent(q) + "",
    //                    contentType: "application/json",
    //                    success: function (res) {
    //                        if (res != "") {
    //                            sessionStorage.setItem('token', res);
    //                            uploadDMSDocuments(dmsApiURL, data, claimID);
    //                        }
    //                    },
    //                    error: function (xhr, status, error) {
    //                        alert(error);
    //                    }
    //                });
    //            } else {
    //                uploadDMSDocuments(dmsApiURL, data, claimID);
    //            }
    //        }
    //        else {

    //            _resArray = [];
    //            var filesLength = 0;

    //            var _files = $("input[name=files]");
    //            if (MakeNullfromUndefinedorEmpty($('#txtAttFileReceivedDate').val()) == null) {
    //                alert('Please select file received date');
    //                return false;
    //            }
    //            if (_files.length > 1) {
    //                var _size = 0;
    //                $.each(_files, function (i, files) {
    //                    var files = $("input[name=files]").get(i).files;
    //                    if (files.length != 0) {
    //                        $.each(files, function (i, item) {
    //                            _size = _size + item.size;
    //                            filesLength = filesLength + 1;
    //                        });
    //                    }
    //                });
    //                if (_size > fileUploadsize) {
    //                    alert('Max uploaded size Exceeded');
    //                    return false;
    //                }
    //            }

    //            $.each(_files, function (i, files) {
    //                var files = $("input[name=files]").get(i).files;
    //                if (files.length != 0) {
    //                    // var type = 16;
    //                    // var id = 111;
    //                    $.each(files, function (i, item) {
    //                        //for (var i = 1; i <= 100; i++) { $('#progress .progress-bar').css('width', i + '%'); }
    //                        var data = new FormData();
    //                        // Add the uploaded image content to the form data collection
    //                        if (files.length > 0) {
    //                            data.append("files", files[i]);
    //                        }
    //                        // Make Ajax request with the contentType = false, and procesDate = false
    //                        var ajaxRequest = $.ajax({
    //                            type: "POST",
    //                            url: "/FUP/ManualDocumentUploadAjax?EntityTypeID=" + EntityTypeid + "&EntityID=" + Entityid,
    //                            contentType: false,
    //                            processData: false,
    //                            data: data
    //                        });
    //                        ajaxRequest.done(function (xhr) {
    //                            _resArray.push(xhr);

    //                            if (_resArray.length > 0) {
    //                                if (filesLength == _resArray.length) {
    //                                    InsertManualuploadrequestdetails();
    //                                    Retrieve_Attachments($('#hdnClaimID').val(), 1);
    //                                }
    //                            }

    //                            ////DialogResultMessage('divMUWanringBox', 'Files uploaded successfully...');
    //                        });
    //                    });

    //                }

    //            });
    //            $('#divfilebuttons').html('<span class="btn btn-success fileinput-button" id="spanfileupload1" ><i class="glyphicon glyphicon-plus"></i><span>Drop files to upload (or click) ...</span><input id="fileupload1" type="file" name="files" multiple onclick="fileonclick();" onchange="Filechangeevent(this.files,1)"></span>');
    //        }
    //    }
    //    else {
    //        alert('Please browse files to upload');
    //    }
    //}
    //catch (e) {
    //    alert("Unexpected Error Occured while upload files");
    //}
}

function funClearData() {
    $("#scanUploadDoc").modal('hide');
    $("#txtCategoryIRDoc").val("0");
    $("#ddlModeofDeliverID").val("0");
    $('#txtScanFileReceivedDate').val("");

    var input = $("input[type='file']");
    input.html(input.html()).val('');
    var inputVfiles = $("input[name=Vfiles]");
    inputVfiles.html(inputVfiles.html()).val('');
    $('#tblFileslistScan tbody').empty();
}

function uploadDMSDocuments(dmsApiURL, formdata, claimID, token) {
    $.ajax({
        type: "POST",
        url: dmsApiURL + "API/Document/uploaddocuments",
        contentType: false,
        processData: false,
        data: formdata,
        headers: {
            Authorization: 'Bearer ' + token
        },
        success: function (response) {
            if (response == "") {
                alert("Successfully uploaded.")
                $("#largeModal").modal('hide');
                $("#txtCategoryIRDoc").val("0");
                $("#ddlModeofDeliverID").val("0");
                $('#txtScanFileReceivedDate').val("");
                $('#tblFileslist tbody').empty();
                var input = $("input[type='filesScan']");
                input.html(input.html()).val('');
                funClearData();
                GetDMSDocuments();
            }
        },
        error: function (error) {
            alert(error);
        }
    });
}

function InsertManualuploadrequestdetails() {
    try {

        if (_resArray.length > 0) {
            var data = null;
            var _dmsIds = []; var _filenames = []; var _filesize = 0;
            $.each(_resArray, function (i, item) {
                _dmsIds.push(item.split(',')[0]);
                _filenames.push(item.split(',')[1]);
                _filesize = _filesize + parseInt(item.split(',')[2]);
            });

            var _recievedDate = MakeNullfromUndefinedorEmpty($('#txtAttFileReceivedDate').val());
            var _city = null;
            var _providerid = $('#hdnProviderID').val();
            var _sourcrType = 87;
            var _sourcefrom = "Manual Upload from User";
            var _sourceto = "Manual Upload from User";
            var _sourcecc = "Manual Upload from User";
            var _sourcesub = "Manual Upload from User";
            var _stageID = $('#hdnClaimStageID').val();

            $.ajax({
                url: '/Claims/InsertManualuploadrequest',
                type: 'POST',
                data: {
                    clrIds: _dmsIds.toString(), filenames: _filenames.toString(), filesize: _filesize, Sourcetype: _sourcrType, sourcefrom: _sourcefrom,
                    providerid: _providerid, city: _city, sourceto: _sourceto, sourcecc: _sourcecc, sourcesubject: _sourcesub, recieveddate: _recievedDate,
                    filedata: data, ClaimID: $('#hdnClaimID').val(), stageID: _stageID, SlNo: $('#hdnClaimSlNo').val(), RequestTypeID: 0
                },
                success: function (result) {
                    CheckSessionVariable(result);
                    $('#tblFileslist button').trigger('onclick');

                    $('#txtAttFileReceivedDate').val('');

                    _resArray = []; _dmsIds = []; _filenames = []; _filesize = 0;
                    DialogResultMessage("Manual file upload record inserted successfully...");
                },
                error: function () {
                    $('body').css('overflow', 'scroll');
                    DialogErrorMessage('Error while Processing');
                }
            });
            // }
        }


    } catch (e) {
        DialogErrorMessage("Error While Inserting manual uploading of files");
    }
}



/* Commented Code */
function Exec_TriggersCommentedCode() {
    //function Exec_Triggers() {
    //    //  if (_ClaimID != null) {
    //    //if ($('#tblAttachments tbody').children().length == 0) {
    //    if ($('#txtPayableAmount').val() == "") {
    //        ApprovedAmt = 0;
    //    }
    //    else {
    //        ApprovedAmt = $('#txtPayableAmount').val();
    //    }
    //    $.ajax({
    //        // type: "POST",
    //        url: "/MedicalScrutiny/ClaimRules_Trigger",
    //        contentType: 'application/json;charset=utf-8',
    //        //processData: false,
    //        data: { IssueID: $('#hdnInsuranceCompanyID').val(), ApprovedAmt: ApprovedAmt, ClaimID: $('#hdnClaimID').val(), MemberPolicyID: $('#hdnMemberPolicyID').val(), MainmemberPolicyID: $('#hdnMainMemberPolicyID').val(), StageID: $('#hdnStageID').val() },
    //        success: function (data) {
    //            data = $.parseJSON(data);
    //            $('#lnkQueryPending').show();
    //            $('#lnkInvestigation').show();
    //            $('#lnkRefertoInsurer').show();
    //            $('#lnkAdjudication').show();
    //            $('#lnkAudit').show();
    //            $('#btnApprove,#btnReject').removeAttr('disabled', true);
    //            if (data.length > 0) {
    //                Enable_Buttons(data);
    //            }

    //            //if (data == null || data == "")
    //            //    alert('Data not found.');
    //        },
    //        error: function (e, x) {
    //            ShowResultMessage('ErrorMessage', e.responseText);
    //        }
    //    });
    //    // }
    //    // }
    //}
}
/* End Commented Code */

var isBPconfigured = 1;
var _statusRetrieve_ClaimRules = false;
function chkRules() {
    if (isBPconfigured == 0) {
        $('#divBPruesMsg').show();
    } else if (isBPconfigured == 1) {
        $('#divBPruesMsg').hide();
    } else {
        DialogErrorMessage('Rules auto flag not found in suminsured');
    }
    //var _stages = ["22", "23", "24", "25", "26", "27"];
    var _stages = ["23", "24", "25", "26", "27", "29"];
    for (var i = 0; i < _stages.length; i++) {

        if (_stages[i] == $('#hdnClaimStageID').val()) {
            _statusRetrieve_ClaimRules = true;
            //  return false;
            //  Retrieve_ClaimRules($('#hdnClaimID').val(), $('#hdnClaimSlNo').val())
            //    DisplayDoctorRemarks();
            //  ////  return true;
            //} else {
            //   // Claims_RuleEngine();
            //    _statusRetrieve_ClaimRules = false;
            //   //  DisplayDoctorRemarks();
            //  //  return true;
            //}
        }
    }
    if (_statusRetrieve_ClaimRules == true) {
        Retrieve_ClaimRules($('#hdnClaimID').val(), $('#hdnClaimSlNo').val())
        DisplayDoctorRemarks();
    }
    else {
        Claims_RuleEngine();
        DisplayDoctorRemarks();
    }
}


var _rules = [];
function Claims_RuleEngine() {
    _copayrules = [];
    _rules = [];
    if ($('#tblApproval tbody').children().length == 0) {
        $.ajax({
            type: "GET",
            url: "/MedicalScrutiny/Claims_RuleEngine",
            contentType: 'application/json;charset=utf-8',
            beforeSend: function () { $("#progress1").show(); },
            //processData: false,
            data: { ClaimID: $('#hdnClaimID').val(), MemberPolicyID: $('#hdnMemberPolicyID').val(), Slno: $('#hdnClaimSlNo').val() },
            success: function (data) {
                $("#progress1").hide();
                CheckSessionVariable(data.responseText);
                data = $.parseJSON(data);

                //var _copayrules = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].isTrue == true) {
                        var _objrules = {};
                        if (data[i].ID != null) {

                            _objrules["TriggerID"] = data[i].ID;
                            _objrules["RuleName"] = data[i].RuleName;
                            _objrules["BPConditionID"] = data[i].BPConditionID;
                            //_objrules["RuleName"] = data[i].RuleName;
                            //_objrules["isOverride"] = data[i].isOverride;
                            //_objrules["OverrideReasonIDs_P34"] = data[i].OverrideReasonIDs_P34;
                            //_objrules["OverRideRemarks"] = data[i].OverRideRemarks;
                            if (data[i].BPConditionID == 7 && data[i].iscovered == true)
                                isclaimsubmission = true;
                            if (data[i].BPConditionID == 3 && data[i].iscovered == true)
                                isclaimwaitingperiod = true;
                            if ((data[i].BPConditionID == 13 || data[i].BPConditionID == 38) && data[i].iscovered == false)
                                isAlimentnotcovered = true;

                            _rules.push(_objrules);
                        }
                    }
                    else if (data[i].isTrue == false && data[i].iscovered == true && (data[i].CopayValue != null || data[i].CopayPerc != null)) {
                        var _objrules = {};
                        if (data[i].ID != "" && data[i].ID != null) {

                            _objrules["per"] = data[i].CopayPerc;
                            _objrules["val"] = data[i].CopayValue;
                            _objrules["lm"] = data[i].isLess;
                            _objrules["IsAccumulate"] = data[i].isICRCopay;
                            _objrules["BPConditionID"] = data[i].BPConditionID;
                            _objrules["BPSubConditionID"] = data[i].BPSubConditionID;
                            _objrules["copayonbuffer"] = data[i].copayonbuffer;
                            //_objrules["isOverride"] = data[i].isOverride;
                            //_objrules["OverrideReasonIDs_P34"] = data[i].OverrideReasonIDs_P34;
                            //_objrules["OverRideRemarks"] = data[i].OverRideRemarks;

                            _copayrules.push(_objrules);
                        }
                    }
                }
                if (_rules.length > 0) {
                    $('#hdnApprovalDetails').val(JSON.stringify(_rules));
                }
                Bind_clmRules(data);
                BillingCalcDetails_Retrieve($('#hdnClaimID').val(), $('#hdnClaimSlNo').val());

                if (data == null || data == "") {
                    //alert('Data not found.');
                }
            },
            error: function (e, x) {
                $("#progress1").hide();
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });
    }
}

//SP3V-1611 Commented by leena Add validation logic in Add Rule function.
//function CheckCopay() {
//    var value = $("#hdnIsCopay").val();
//    if (value == "0") {
//        $("#iscopay").text("You don't have Permission to use Override");
//       // DialogErrorMessage('You do not have access to override the Copay');
//        return false;
//    }
//}
function ClearValidationLable() {
    $("#lblOverrideValidationMsg").text('');
}
//End SP3V-1611

var _ruleStatus = true;
var rule = [];
function AddRule(data) {
    var _OverrideReasons = FormatHtml_Dropdown(MasterData.ClaimOverirdeReasons);
    var ruleVal = $("#ddlRule option:selected").val();
    var ruleText = $("#ddlRule option:selected").text();


    for (var i = 0; i < rule.length; i++) {
        var name = rule[i];
        if (name == ruleVal) {
            _ruleStatus = false;
        }
    }


    if (ruleVal != 0) {
        if (_ruleStatus == true) {
            var tbloverRideruleBody = ' <tr id="troverrideRuleapproval_' + ruleVal + '" class="overrideRules"><td data-title="Rule ID"><span id="spnRuleID_' + ruleVal + '">0</span></td><td data-title="Rule Name"><span id="spnRuleName_' + ruleVal + '">' + ruleText + '</span></td>'
                + '<td data-title="Override"><label class="inline"><input id="btnOverride_' + ruleVal + '"  type="checkbox" name="chkOverride" class="ace ace-switch ace-switch-5" onclick="fnOverriderules(this,' + ruleVal + ')">'
                + ' <span class="lbl middle"></span></label></td>'
                + '<td data-title="Override Reason"><select id="ddlOverrideReasons_' + ruleVal + '" class="form-control"><option value="0">-Select-</option>' + _OverrideReasons + '</select></td>'
                + '<td data-title="Override Remarks"><textarea class="form-control form-textarea" id="taOverRideRemarks_' + ruleVal + '" required=""></textarea></td></tr>';
            $('#tbloverrideRuleApproval tbody').append(tbloverRideruleBody);

            rule.push(ruleVal);
        } else {
            alert(ruleText + ' rule already exist.');
        }
    } else {
        alert('Please select Override Rule')
    }
}


function Bind_clmRules(data) {
    if (data != null && data.length > 0) {
        var _OverrideReasons = FormatHtml_Dropdown(MasterData.ClaimOverirdeReasons);
        var investigationHtml = "";
        var informationHtml = "";
        var cautiousRuleHtml = "";
        var conditionalRuleHtml = ""  //= '<fieldset><legend align="right">Personalia:</legend>';
        var fieldset_parent = $(".fieldsett:eq(0)").clone();
        $(".fieldsett:last").after(fieldset_parent);
        for (var i = 0; i < data.length; i++) {
            if (data[i].isTrue == true) {
                var TriggerID = data[i].ID;
                if (MakeNullfromUndefinedorEmpty(data[i].OverRideRemarks) == null) { data[i].OverRideRemarks = "" }

                if (data[i].BPConditionID == 1000) {
                    investigationHtml = investigationHtml + '<tr id="trapproval_' + TriggerID + '"><td data-title="Rule ID"><span id="spnRuleID_' + TriggerID + '">' + TriggerID + '</span></td><td data-title="Rule Name"><span id="spnRuleName_' + TriggerID + '">' + data[i].RuleName + '</span></td>'
                        + '<td data-title="Override"><label class="inline"><input id="btnOverride_' + TriggerID + '"  type="checkbox" name="chkOverride" class="ace ace-switch ace-switch-5">'
                        + ' <span class="lbl middle"></span></label></td>'
                        + '<td data-title="Override Reason"><select id="ddlOverrideReasons_' + TriggerID + '" class="form-control clsddlallReasons"><option value="0">-Select-</option>' + _OverrideReasons + '</select></td>'
                        + '<td data-title="Override Remarks"><textarea class="form-control form-textarea" id="taOverRideRemarks_' + TriggerID + '" required="">' + data[i].OverRideRemarks + '</textarea></td></tr>';
                }
                if (data[i].BPConditionID == 36) {
                    informationHtml = informationHtml + '<tr id="trapproval_' + TriggerID + '"><td data-title="Rule ID"><span id="spnRuleID_' + TriggerID + '">' + TriggerID + '</span></td><td data-title="Rule Name"><span id="spnRuleName_' + TriggerID + '">' + data[i].RuleName + '</span></td>'
                        + '<td data-title="Override"><label class="inline"><input id="btnOverride_' + TriggerID + '"  type="checkbox" name="chkOverride" class="ace ace-switch ace-switch-5">'
                        + ' <span class="lbl middle"></span></label></td>'
                        + '<td data-title="Override Reason"><select id="ddlOverrideReasons_' + TriggerID + '" class="form-control clsddlallReasons"><option value="0">-Select-</option>' + _OverrideReasons + '</select></td>'
                        + '<td data-title="Override Remarks"><textarea class="form-control form-textarea" id="taOverRideRemarks_' + TriggerID + '" required="">' + data[i].OverRideRemarks + '</textarea></td></tr>';
                }
                if (TriggerID == 0 && data[i].BPConditionID != 1000) {
                    cautiousRuleHtml = cautiousRuleHtml + '<tr id="trapproval_' + TriggerID + '"><td data-title="Rule ID"><span id="spnRuleID_' + TriggerID + '">' + TriggerID + '</span></td><td data-title="Rule Name"><span id="spnRuleName_' + TriggerID + '">' + data[i].RuleName + '</span></td>'
                        + '<td data-title="Override"><label class="inline"><input id="btnOverride_' + TriggerID + '"  type="checkbox" name="chkOverride" class="ace ace-switch ace-switch-5">'
                        + ' <span class="lbl middle"></span></label></td>'
                        + '<td data-title="Override Reason"><select id="ddlOverrideReasons_' + TriggerID + '" class="form-control clsddlallReasons"><option value="0">-Select-</option>' + _OverrideReasons + '</select></td>'
                        + '<td data-title="Override Remarks"><textarea class="form-control form-textarea" id="taOverRideRemarks_' + TriggerID + '" required="">' + data[i].OverRideRemarks + '</textarea></td></tr>';
                }
                if (data[i].BPConditionID != 36 && TriggerID != 0) {
                    conditionalRuleHtml = conditionalRuleHtml + '<tr id="trapproval_' + TriggerID + '"><td data-title="Rule ID"><span id="spnRuleID_' + TriggerID + '">' + TriggerID + '</span></td><td data-title="Rule Name"><span id="spnRuleName_' + TriggerID + '">' + data[i].RuleName + '</span></td>'
                        + '<td data-title="Override"><label class="inline"><input id="btnOverride_' + TriggerID + '"  type="checkbox" name="chkOverride" class="ace ace-switch ace-switch-5">'
                        + ' <span class="lbl middle"></span></label></td>'
                        + '<td data-title="Override Reason"><select id="ddlOverrideReasons_' + TriggerID + '" class="form-control clsddlallReasons"><option value="0">-Select-</option>' + _OverrideReasons + '</select></td>'
                        + '<td data-title="Override Remarks"><textarea class="form-control form-textarea" id="taOverRideRemarks_' + TriggerID + '" required="">' + data[i].OverRideRemarks + '</textarea></td></tr>';
                }

                $('#ddlOverrideReasons_' + data[i].TriggerID).val(data[i].OverrideReasonIDs_P34);
                if (data[i].isOverride == 1)
                    $('#btnOverride_' + data[i].TriggerID).attr('checked', true);
                else
                    $('#btnOverride_' + data[i].TriggerID).attr('checked', false);
            }
        }

        if (conditionalRuleHtml != "") {
            $('#tblconditionalrule tbody').html(conditionalRuleHtml);
        } else {
            $('#tblconditionalrule tbody').html('No Rules Found.');
        }

        if (informationHtml != "") {
            $('#tblinformationrule tbody').html(informationHtml);
        } else {
            $('#tblinformationrule tbody').html('No Rules Found.');
        }

        if (cautiousRuleHtml != "") {
            $('#tblcautiousrule tbody').html(cautiousRuleHtml);
        } else {
            $('#tblcautiousrule tbody').html('No Rules Found.');
        }

        if (investigationHtml != "") {
            $('#tblinvestigationrule tbody').html(investigationHtml);
        } else {
            $('#tblinvestigationrule tbody').html('No Rules Found.');
        }
    }
    else {
        $('#tblApproval tbody').html('<tr><td colspan="5">No Rules Triggered</td></tr>');
    }
}

function Retrieve_ClaimRules(_ClaimID, _SlNo) {
    if (_ClaimID != null && _SlNo != null) {
        if ($('#tblApproval tbody').children().length == 0) {
            $.ajax({
                type: "GET",
                url: "/MedicalScrutiny/ClaimRules_Retrieve",
                contentType: 'application/json;charset=utf-8',
                beforeSend: function () { $("#progress1").show(); },
                //processData: false,
                data: { ClaimID: _ClaimID, SlNo: _SlNo },
                success: function (data) {
                    $("#progress1").hide();
                    CheckSessionVariable(data.responseText);

                    data = $.parseJSON(data);
                    var claimrules = [];
                    var overridecopayrules = [];
                    var _rules = [];
                    for (var i = 0; i < data.length; i++) {
                        var _objrules = {};
                        if (data[i].TriggerID !== "" && data[i].TriggerID != null) {
                            _objrules["ID"] = data[i].ID;
                            _objrules["TriggerID"] = data[i].TriggerID;
                            _objrules["RuleName"] = data[i].RuleName;
                            _objrules["isOverride"] = data[i].isOverride;
                            _objrules["OverrideReasonIDs_P34"] = data[i].OverrideReasonIDs_P34;
                            _objrules["OverRideRemarks"] = data[i].OverRideRemarks;
                            _objrules["OverrideruleID"] = data[i].OverrideruleID;

                            _objrules["BPConditionID"] = data[i].BPConditionID;
                            _rules.push(_objrules);
                            if (data[i].OverRideRuleID == 0)
                                claimrules.push(_objrules);
                            else
                                overridecopayrules.push(_objrules);
                        }
                    }
                    if (_rules.length > 0) { $('#hdnApprovalDetails').val(JSON.stringify(_rules)); }

                    var _OverrideReasons = FormatHtml_Dropdown(MasterData.ClaimOverirdeReasons);
                    var investigationHtml = "";
                    var informationHtml = "";
                    var cautiousRuleHtml = "";
                    var conditionalRuleHtml = ""
                    var reasonsdropdownvalues = [];
                    if (claimrules.length != 0) {
                        $('#tblApproval tbody').empty();
                        for (var i = 0; i < claimrules.length; i++) {
                            //  if (claimrules[i].isTrue == true) {
                            var TriggerID = claimrules[i].TriggerID;
                            var RuleId = claimrules[i].ID;

                            if (MakeNullfromUndefinedorEmpty(claimrules[i].OverRideRemarks) == null) { claimrules[i].OverRideRemarks = "" }
                            if (claimrules[i].BPConditionID == 1000) {
                                investigationHtml = investigationHtml + '<tr id="trapproval_' + TriggerID + '"><td data-title="Rule ID"><span id="spnRuleID_' + TriggerID + '">' + TriggerID + '</span></td><td data-title="Rule Name"><span id="spnRuleName_' + TriggerID + '">' + claimrules[i].RuleName + '</span></td>'
                                    + '<td data-title="Override"><label class="inline"><input id="btnOverride_' + TriggerID + '"  type="checkbox" name="chkOverride" class="ace ace-switch ace-switch-5" checked="checked">'
                                    + ' <span class="lbl middle"></span></label></td>'
                                    + '<td data-title="Override Reason"><select id="ddlOverrideReasons_' + RuleId + '" class="form-control clsddlallReasons"><option value="0">-Select-</option>' + _OverrideReasons + '</select></td>'
                                    + '<td data-title="Override Remarks"><textarea class="form-control form-textarea" id="taOverRideRemarks_' + TriggerID + '" required="">' + claimrules[i].OverRideRemarks + '</textarea></td></tr>';
                                //$("#ddlOverrideReasons_" + TriggerID + "").val(claimrules[i].OverrideReasonIDs_P34);
                                reasonsdropdownvalues.push({ ID: "ddlOverrideReasons_" + RuleId, value: claimrules[i].OverrideReasonIDs_P34 });
                            }
                            if (claimrules[i].BPConditionID == 36) {
                                informationHtml = informationHtml + '<tr id="trapproval_' + TriggerID + '"><td data-title="Rule ID"><span id="spnRuleID_' + TriggerID + '">' + TriggerID + '</span></td><td data-title="Rule Name"><span id="spnRuleName_' + TriggerID + '">' + claimrules[i].RuleName + '</span></td>'
                                    + '<td data-title="Override"><label class="inline"><input id="btnOverride_' + TriggerID + '"  type="checkbox" name="chkOverride" class="ace ace-switch ace-switch-5" checked="checked">'
                                    + ' <span class="lbl middle"></span></label></td>'
                                    + '<td data-title="Override Reason"><select id="ddlOverrideReasons_' + RuleId + '" class="form-control clsddlallReasons"><option value="0">-Select-</option>' + _OverrideReasons + '</select></td>'
                                    + '<td data-title="Override Remarks"><textarea class="form-control form-textarea" id="taOverRideRemarks_' + TriggerID + '" required="">' + claimrules[i].OverRideRemarks + '</textarea></td></tr>';
                                // $("#ddlOverrideReasons_" + TriggerID + "").val(claimrules[i].OverrideReasonIDs_P34);
                                reasonsdropdownvalues.push({ ID: "ddlOverrideReasons_" + RuleId, value: claimrules[i].OverrideReasonIDs_P34 });
                            }
                            if (TriggerID == 0 && claimrules[i].BPConditionID != 1000) {
                                cautiousRuleHtml = cautiousRuleHtml + '<tr id="trapproval_' + TriggerID + '"><td data-title="Rule ID"><span id="spnRuleID_' + TriggerID + '">' + TriggerID + '</span></td><td data-title="Rule Name"><span id="spnRuleName_' + TriggerID + '">' + claimrules[i].RuleName + '</span></td>'
                                    + '<td data-title="Override"><label class="inline"><input id="btnOverride_' + TriggerID + '"  type="checkbox" name="chkOverride" class="ace ace-switch ace-switch-5" checked="checked">'
                                    + ' <span class="lbl middle"></span></label></td>'
                                    + '<td data-title="Override Reason"><select id="ddlOverrideReasons_' + RuleId + '" class="form-control clsddlallReasons"><option value="0">-Select-</option>' + _OverrideReasons + '</select></td>'
                                    + '<td data-title="Override Remarks"><textarea class="form-control form-textarea" id="taOverRideRemarks_' + TriggerID + '" required="">' + claimrules[i].OverRideRemarks + '</textarea></td></tr>';
                                // $("#ddlOverrideReasons_" + TriggerID + "").val(claimrules[i].OverrideReasonIDs_P34);
                                reasonsdropdownvalues.push({ ID: "ddlOverrideReasons_" + RuleId, value: claimrules[i].OverrideReasonIDs_P34 });
                            }
                            if (claimrules[i].BPConditionID != 36 && TriggerID != 0) {
                                conditionalRuleHtml = conditionalRuleHtml + '<tr id="trapproval_' + TriggerID + '"><td data-title="Rule ID"><span id="spnRuleID_' + TriggerID + '">' + TriggerID + '</span></td><td data-title="Rule Name"><span id="spnRuleName_' + TriggerID + '">' + claimrules[i].RuleName + '</span></td>'
                                    + '<td data-title="Override"><label class="inline"><input id="btnOverride_' + TriggerID + '"  type="checkbox" name="chkOverride" class="ace ace-switch ace-switch-5" checked="checked">'
                                    + ' <span class="lbl middle"></span></label></td>'
                                    + '<td data-title="Override Reason"><select id="ddlOverrideReasons_' + RuleId + '" class="form-control clsddlallReasons"><option value="0">-Select-</option>' + _OverrideReasons + '</select></td>'
                                    + '<td data-title="Override Remarks"><textarea class="form-control form-textarea" id="taOverRideRemarks_' + TriggerID + '" required="">' + claimrules[i].OverRideRemarks + '</textarea></td></tr>';
                                // $("#ddlOverrideReasons_" + TriggerID + "").val(claimrules[i].OverrideReasonIDs_P34);
                                reasonsdropdownvalues.push({ ID: "ddlOverrideReasons_" + RuleId, value: claimrules[i].OverrideReasonIDs_P34 });
                            }
                            //if (claimrules[i].isOverride == 1)
                            //    $('#btnOverride_' + claimrules[i].TriggerID).attr('checked', true);
                            //else
                            //    $('#btnOverride_' + claimrules[i].TriggerID).attr('checked', false);
                            // }
                        }
                        if (conditionalRuleHtml != "") {
                            $('#tblconditionalrule tbody').html(conditionalRuleHtml);
                        } else {
                            $('#tblconditionalrule tbody').html('No Rules Found.');
                        }


                        if (informationHtml != "") {
                            $('#tblinformationrule tbody').html(informationHtml);
                        } else {
                            $('#tblinformationrule tbody').html('No Rules Found.');
                        }

                        if (cautiousRuleHtml != "") {
                            $('#tblcautiousrule tbody').html(cautiousRuleHtml);
                        } else {
                            $('#tblcautiousrule tbody').html('No Rules Found.');
                        }

                        if (investigationHtml != "") {
                            $('#tblinvestigationrule tbody').html(investigationHtml);
                        } else {
                            $('#tblinvestigationrule tbody').html('No Rules Found.');
                        }

                    }

                    for (var i = 0; i < reasonsdropdownvalues.length; i++) {
                        $("#" + reasonsdropdownvalues[i].ID + "").val(reasonsdropdownvalues[i].value);
                    }

                    if (overridecopayrules.length != 0) {
                        $('#tbloverrideRuleApproval tbody').empty();
                        for (var i = 0; i < overridecopayrules.length; i++) {
                            var tblBodycopay = ' <tr id="trapproval_' + overridecopayrules[i].TriggerID + '" class="overrideRules"><td data-title="Rule ID"><span id="spnRuleID_' + overridecopayrules[i].TriggerID + '">' + overridecopayrules[i].TriggerID + '</span></td><td data-title="Rule Name"><span id="spnRuleName_' + overridecopayrules[i].TriggerID + '">' + overridecopayrules[i].RuleName + '</span></td>'
                                + '<td data-title="Override"><label class="inline"><input id="btnOverride_' + overridecopayrules[i].TriggerID + '"  type="checkbox" name="chkOverride" class="ace ace-switch ace-switch-5" disabled checked="checked">'
                                + ' <span class="lbl middle"></span></label></td>'
                                + '<td data-title="Override Reason"><select id="ddlOverrideReasons_' + overridecopayrules[i].TriggerID + '" class="form-control">' + _OverrideReasons + '</select></td>'
                                + '<td data-title="Override Remarks"><textarea class="form-control form-textarea" id="taOverRideRemarks_' + overridecopayrules[i].TriggerID + '" required="">' + overridecopayrules[i].OverRideRemarks + '</textarea></td></tr>';
                            $('#tbloverrideRuleApproval tbody').append(tblBodycopay);
                            $("#ddlOverrideReasons_" + overridecopayrules[i].TriggerID + "").val(overridecopayrules[i].OverrideReasonIDs_P34);

                            //***********For Task (SP-1103) 13apr2023
                            if (overridecopayrules[i].TriggerID == 390) {
                                $('.txtCoPaymentOverride').removeAttr('style');
                                $('.lbltxtCoPayment').hide();
                                copaystatus = true;
                                $('#btnAddManualrule').remove();
                            }
                            //***********
                            //*********** //SP3V-1611 Leena 13apr2023
                            if (overridecopayrules[i].TriggerID == 533) {
                                $('.txtDeductibleOverride ').removeAttr('style');
                                $('.lbltxtDeductible').hide();
                                OverrideDeductible = true;
                                ShowOverideLable();
                            }
                            //*********** End SP3V-1611 Leena
                        }
                        //Commented by leena if rule is define then only show that textbox---------------------------------
                        //***********For Task (SP-1103)
                        //$('.txtCoPaymentOverride').removeAttr('style');
                        //$('.lbltxtCoPayment').hide();
                        //copaystatus = true;
                        //$('#btnAddManualrule').remove();
                        //***********
                        //SP3V-1611 Leena
                        //$('.txtDeductibleOverride ').removeAttr('style');
                        //$('.lbltxtDeductible').hide();
                        //OverrideDeductible = true;
                        //ShowOverideLable();
                        //END SP3V-1611
                        //End Commented by leena---------------------------------
                    }
                    else {
                        copaystatus = false;
                        if ($('#hdnClaimStageID').val() != 24) {
                            $('#btnAddManualrule').remove();
                        }
                    }

                    // Bind_ClaimRules(data);
                    BillingCalcDetails_Retrieve($('#hdnClaimID').val(), $('#hdnClaimSlNo').val());
                    if (data == null || data == "") {
                        //alert('Data not found.');
                    }
                },
                error: function (e, x) {
                    $("#progress1").hide();
                    ShowResultMessage('ErrorMessage', e.responseText);
                }
            });
        }
    }
    //Commented For Task: (SP-1103)
    //$('#btnAddManualrule').remove();
}

function Bind_ClaimRules(data) {
    if (data != null) {
        var _OverrideReasons = FormatHtml_Dropdown(MasterData.ClaimOverirdeReasons);
        for (var i = 0; i < data.length; i++) {
            var tblBody = ' <tr id="trapproval_' + data[i].TriggerID + '"><td data-title="Rule ID"><span id="spnRuleID_' + data[i].TriggerID + '">' + data[i].TriggerID + '</span></td><td data-title="Rule Name"><span id="spnRuleName_' + data[i].TriggerID + '">' + data[i].RuleName + '</span></td>'
                + '<td data-title="Override"><label class="inline"><input id="btnOverride_' + data[i].TriggerID + '"  type="checkbox" name="chkOverride" class="ace ace-switch ace-switch-5">'
                + ' <span class="lbl middle"></span></label></td>'
                + '<td data-title="Override Reason"><select id="ddlOverrideReasons_' + data[i].TriggerID + '" class="form-control"><option value="0">-Select-</option>' + _OverrideReasons + '</select></td>'
                + '<td data-title="Override Remarks"><textarea class="form-control form-textarea" id="taOverRideRemarks_' + data[i].TriggerID + '" required="">' + data[i].OverRideRemarks + '</textarea></td></tr>';
            $('#tblApproval tbody').append(tblBody);

            $('#ddlOverrideReasons_' + data[i].TriggerID).val(data[i].OverrideReasonIDs_P34);
            if (data[i].isOverride == 1)
                $('#btnOverride_' + data[i].TriggerID).attr('checked', true);
            else
                $('#btnOverride_' + data[i].TriggerID).attr('checked', false);
            if (data[i].StageID == 22) { $('#btnApprove,#btnReject').attr('disabled', true); }
            else
                $('#btnApprove,#btnReject').removeAttr('disabled', true);
        }
    }
}

function FetchBufferEligibleAmount() {
    var claimID = $('#hdnClaimID').val(); var mainMemberPolicyID = MakeZerofromUndefinedorEmpty($('#hdnMemberPolicyID').val());
    var esi = $("#txtExcessSumInsured").text(); var bpsiId = $("#hdnBPSIID").val();
    if ($('#BufferwithoutBase').is(':checked') == true) {
        var esi = $("#txtEligiblebillAmount").text();
        $('#hdnTPAProcID').val($.parseJSON($('#hdnClaimsCodingDetails').val())[0].TPAProcedureID);
    }
    getEligibleAmount(esi, claimID, mainMemberPolicyID, bpsiId)
    if (basicData[0].IssueID == 10) {
        $("#bufferreq_refer option[value='249']").remove();
        $("#bufferreq_referold option[value='249']").remove();
    }

}

function ClaimRules_Insert(_stageID) {
    var bpsiId = $("#hdnBPSIID").val();
    var excessSumInsured = $("#txtExcessSumInsured").text(); var flagNo = $("#hdnNo").val();
    var topbalance = 0;
    var supertopbalance = 0;

    // ClaimAI: BillingCorrection validation removed
    if (chkQP_MandatoryRecords()) {
        DialogWarningMessage('You can not approve the claim as it is in query pending.');
    }
    else if ($("#ddlRequestType").val() != 1 && $("#ddlRequestType").val() != 2 && MakeNullfromUndefinedorEmpty(_dod) == null) {
        DialogWarningMessage('You can not approve the claim without Date of discharge');
    }
    else if (approvalFlag == true) {
        DialogWarningMessage('Insurer/HR Approval required to approve this claim');
    }
    else if (parseInt(excessSumInsured) != 0 && $('#hdnPolicyTypeID').val() == "3") {
        if (isBufferRulesConfigured(bpsiId) && (flagNo == "false") && basicData[0].IsBufferEnabled != true && (topbalance == 0 && supertopbalance == 0 && flagNo == "false")) {
            if (createnewtop == 0) {
                $("#exampleModalApprove").modal('show');
                FetchBufferEligibleAmount();
                DisplayBasetopdetails("1", $("#hdnIsSingleLetterEnabled").val(), _stageID);
                return false;
            }
            else if (createnewtop == 1) {
                Claim_Insert(_stageID);
            }
        }
        else if (_excessSuminsured > 0 && $("#hdnIsSingleLetterEnabled").val() == "1" && (flagNo == "false")) {
            if (createnewtop == 0) {
                FetchBufferEligibleAmount();
                DisplayBasetopdetails("0", $("#hdnIsSingleLetterEnabled").val(), _stageID);
                return false;
            } else if (createnewtop == 1) {
                Claim_Insert(_stageID);
            }
        }
        else {
            if (_netpayableAmount >= 0 || (_remainingdeductableAmount > 0)) {
                Claim_Insert(_stageID);
            }
            else {
                DialogWarningMessage('Net payable amount is 0. Please click "Calculate" button to display the Net Payable amount; or Member Balance Sum Insured exhausted');
            }
        }
    }
    else if (_netpayableAmount >= 0 || (_remainingdeductableAmount > 0)) {
        Claim_Insert(_stageID);
    }
    else {
        DialogWarningMessage('Net payable amount is 0. Please click "Calculate" button to display the Net Payable amount; or Member Balance Sum Insured exhausted');
    }
}


var copaystatus;
var outofPolicyStatus = false;
var OverrideDeductible; //SP3V-1611 - Leena

$(document).ready(function () {
    copaystatus = false;
    OverrideDeductible = false; //SP3V-1611 - Leena
})

function fnOverriderules(cb, ruleId) {
    if (ruleId == 391) {
        outofPolicyStatus = true;
    }
    else if (ruleId == 390) {
        if (cb.checked) {
            $('.txtCoPaymentOverride').removeAttr('style');
            $('.lbltxtCoPayment').hide();
            copaystatus = true;
        } else {
            $('.txtCoPaymentOverride').hide();
            $('.lbltxtCoPayment').show();
            copaystatus = false;
        }
    }
    //SP3V-1611 - Leena
    else if (ruleId == 533) {
        if (cb.checked) {
            $('.txtDeductibleOverride').removeAttr('style');
            $('.lbltxtDeductible').hide();
            OverrideDeductible = true;
        } else {
            $('.txtDeductibleOverride').hide();
            $('.lbltxtDeductible').show();
            OverrideDeductible = false;
        }
    }
    //End SP3V-1611
}



function Claim_Insert(_stageID) {
    if (!outofPolicyStatus) {
        var basicstartDate = basicData[0].MemberCommencingDate;
        var basicendDate = basicData[0].MemberEndDate;
        var _basicdoa = basicData[0].dateofadmission;

        var startDate = basicstartDate
        var endDate = basicendDate
        var _doa = _basicdoa

        if (_doa < startDate) {
            //_doaValidation = 'Admission is falling out of policy period.';
            DialogWarningMessage("Admission is falling out of policy period.Please add override rule to approve the claim");
            createnewtop = 0;
            return false;
        }
        else if (_doa > endDate) {
            // _doaValidation = 'Admission is falling out of policy period.';
            DialogWarningMessage("Admission is falling out of policy period.Please add override rule to approve the claim");
            createnewtop = 0;
            return false;
        }

        //  DialogWarningMessage("Admission is falling out of policy period.Please add override rule to approve the claim");

    }
    _claimdetails = {};
    _claimdetails["ClaimID"] = $('#hdnClaimID').val();
    _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
    _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
    _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
    _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
    _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
    _claimdetails["ClaimStageID"] = _stageID;
    if (_stageID == 22) {
        _claimdetails["RoleID"] = 16;
    }
    //if (_stageID == 23) {
    //    _claimdetails["RoleID"] = 16;
    //}
    _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();
    //  _claimdetails["CoPayment"] = manualCopay;
    //_cdtls = [];
    //_cdtls.push(_claimdetails);

    var _rules = [];
    //var _objrules = {};
    if ($('#hdnApprovalDetails').val() != '') {
        _rules = $.parseJSON($('#hdnApprovalDetails').val());
    }
    var _newRules = [];
    var _objrules = {};
    var BPConditionID;
    if (_rules.length > 0) {
        $.each(_rules, function (i, sIDs) {
            var _triggerID = sIDs["TriggerID"];
            var name = sIDs["RuleName"];
            BPConditionID = sIDs["BPConditionID"];

            //_rules.splice(i, 1);

            _objrules["TriggerID"] = _triggerID;
            _objrules["RuleName"] = name;
            if ($('#btnOverride_' + _triggerID).is(':checked') == true)
                _objrules["isOverride"] = 1;
            else
                _objrules["isOverride"] = 0;
            _objrules["OverrideReasonIDs_P34"] = $('#ddlOverrideReasons_' + _triggerID).val();
            if ($('#taOverRideRemarks_' + _triggerID).val() != "") {
                _objrules["OverRideRemarks"] = $('#taOverRideRemarks_' + _triggerID).val();
            } else {
                _objrules["OverRideRemarks"] = null;
            }
            _objrules["OverrideruleID"] = null;
            _objrules["BPConditionID"] = BPConditionID;
            _newRules.push(_objrules);
            _objrules = {};
        });
    } else {
        //var _objrules = {};
        //_objrules["TriggerID"] = null;
        //_objrules["RuleName"] = null;
        //_objrules["isOverride"] = null;
        //_objrules["OverrideReasonIDs_P34"] = null;
        //_objrules["OverRideRemarks"] = null;
        //_newRules.push(_objrules);
    }

    //$('#tblApproval > tbody  > tr.overrideRules').each(function () {
    //    var id = this.id;
    //    var _triggerID = id.split('_')[1];
    //    var name = $('#spnRuleName_' + _triggerID + '').text();


    //    _objrules["TriggerID"] = _triggerID;
    //    _objrules["RuleName"] = name;
    //    if ($('#btnOverride_' + _triggerID).is(':checked') == true)
    //        _objrules["isOverride"] = 1;
    //    else
    //        _objrules["isOverride"] = 0;
    //    _objrules["OverrideReasonIDs_P34"] = $('#ddlOverrideReasons_' + _triggerID).val();
    //    if ($('#taOverRideRemarks_' + _triggerID).val() != "") {
    //        _objrules["OverRideRemarks"] = $('#taOverRideRemarks_' + _triggerID).val();
    //    } else {
    //        _objrules["OverRideRemarks"] = null;
    //    }
    //    _newRules.push(_objrules);
    //});

    // override autocopay rule //
    $('#tbloverrideRuleApproval > tbody  > tr').each(function () {
        _objrules = {};
        var id = this.id;
        var _triggerID = id.split('_')[1];
        var name = $('#spnRuleName_' + _triggerID + '').text();


        _objrules["TriggerID"] = _triggerID;
        _objrules["RuleName"] = name;
        if ($('#btnOverride_' + _triggerID).is(':checked') == true)
            _objrules["isOverride"] = 1;
        else
            _objrules["isOverride"] = 0;
        _objrules["OverrideReasonIDs_P34"] = $('#ddlOverrideReasons_' + _triggerID).val();
        if ($('#taOverRideRemarks_' + _triggerID).val() != "") {
            _objrules["OverRideRemarks"] = $('#taOverRideRemarks_' + _triggerID).val();
        } else {
            _objrules["OverRideRemarks"] = null;
        }
        _objrules["OverrideruleID"] = _triggerID;
        // Added By Venkat Mandadi
        // As discussed with Srinu bathina (If there is no general condition rules BPConditionid for manual/override rules is: 8)
        _objrules["BPConditionID"] = (_rules.length == 0) ? 8 : BPConditionID;
        //_objrules["BPConditionID"] = BPConditionID;

        _newRules.push(_objrules);

    });
    /////

    // if (_rules != null) {
    $('#hdnApprovalDetails').val(JSON.stringify(_newRules));
    // }
    if (ValidateApproval(_stageID)) {
        if (utilizedamtarray.length == 0) {
            if (basicData[0].IsBufferEnabled == true) {
                ajaxcall(JSON.stringify(_claimdetails), $('#hdnApprovalDetails').val());
            }
            else
                if (_requesttype == 12) {
                    ajaxcall(JSON.stringify(_claimdetails), $('#hdnApprovalDetails').val());
                }
                else
                    DialogWarningMessage("Bill amounts not calculated");
        } else if (utilizedamtarray.length > 0)
            ajaxcall(JSON.stringify(_claimdetails), $('#hdnApprovalDetails').val());
    }
}

function ValidateApproval(_stageID) {
    if (_stageID == 22) {
        var _rules = [];
        if ($('#hdnApprovalDetails').val() != '') {
            _rules = $.parseJSON($('#hdnApprovalDetails').val());
        }
        var flag = true;
        if (_rules != null) {
            $.each(_rules, function (i, sIDs) {
                var _triggerID = sIDs["TriggerID"];
                if ($('#btnOverride_' + _triggerID).is(':checked') == true) {
                    if ($('#ddlOverrideReasons_' + _triggerID + ' option:selected').val() == 0) {
                        DialogWarningMessage("To Approve the Details ,Please Select The Override Reason  ");
                        flag = false;
                    }
                }
                else {
                    if ($("#hdnRequestTypeID").val() == "1" || $("#hdnRequestTypeID").val() == "2" || $("#hdnRequestTypeID").val() == "3") {
                        flag = true;
                    }
                    else {
                        DialogWarningMessage("To Approve the Details ,Please check the Override to YES ");
                        var element = document.getElementById("rules_ID");
                        element.classList.remove("collapsed");
                        var element = document.getElementById("notes_id");
                        element.classList.remove("collapsed");
                        flag = false;
                    }

                }
            });
        }
    }
    else { flag = true; }
    return flag;

}

var cliamsdetails_billing = "";
var is_preauth_final = false;
function Adjudication_Actions_Insert(_stageID, _ctrlReason, _ctrlRemarks, _roleID) {
    var value = CheckIsValidProvider();
    if (_stageID != 17 && basicData[0].Isrefertoinsurer == true) {
        if (MakeZerofromUndefinedorEmpty(providerstatus) != 0) {
            if (providerstatus.includes("Blacklist")) {
                alert("Warning! You are performing an action against " + providerstatus + " hospital. Only rejection is possible.");
                return false;
            }
        }

    }
    if (_stageID == 17) {
        $("#btnInsurerSubmit").attr('disabled', true);
    }

    if (CheckIsValidProvider() || basicData[0].IssueID == 10 || (basicData[0].Isrefertoinsurer == true && MakeZerofromUndefinedorEmpty(providerstatus) != 0)) {
        if (MakeZerofromUndefinedorEmpty(providerstatus) != 0) {
            if (providerstatus.includes("Blacklist")) {

            }
            else {
                alert("Warning! You are performing an action against " + providerstatus + " hospital. Only rejection is possible.");
                return false;
            }
        }

        if (_stageID == 14 && ($("#ddlRequestType").val() != 1 && $("#ddlRequestType").val() != 2 && $("#ddlRequestType").val() != 3)) {
            _roleID = 17;
        }
        if (basicData[0].IssueID == 10 && _stageID == 14) {
            alert("insurer response can't be generated manually for ITGI insurer cases");
            return false;
        }

        _claimdetails = {};
        _claimdetails["ClaimID"] = $('#hdnClaimID').val();
        _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
        _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
        _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
        _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
        _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
        _claimdetails["ClaimStageID"] = _stageID;
        _claimdetails["RoleID"] = _roleID;
        _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();

        //Abhishek 21 Mar 23, Jira# 1555
        var IssueId = basicData[0].IssueID;
        var Ins_Personid = basicData[0].Ins_Personid;
        _claimdetails["issueID"] = IssueId;
        _claimdetails["InsPerson"] = Ins_Personid;

        //Get IssueID
        //Get  InsPersonID if inspersonId for IssueId=9 is null send alert that InsPerson Id is mandatory
        if (Ins_Personid == "" && IssueId == 9) {
            DialogWarningMessage('Refer to insurer has been failed due to: INS member Id missing.');
            return;
        }

        if (IssueId == 9 && _stageID == 17) {
            var Remark = $('#' + _ctrlRemarks).val();
            if (Remark == null || Remark == '') {
                DialogWarningMessage('Please provide Remarks To Submit');
                return;
            }
        }
        //if ($('#' + _ctrlRemarks).val() != '')
        //    _claimdetails["Remarks"] = $('#' + _ctrlRemarks).val();
        //else
        //    _claimdetails["Remarks"] = null;
        if (_stageID == 14) {
            if ($('#' + _ctrlReason).val() != null || $('#' + _ctrlReason).val() != 0 || $('#' + _ctrlReason).val() != '') {

                _claimdetails["ReasonIDs_P"] = $('#' + _ctrlReason).val();
                _claimdetails["Remarks"] = $('#' + _ctrlRemarks).val();
                Submit_Request(JSON.stringify(_claimdetails), _stageID);

            }
        }
        else if (_stageID == 4) {
            _claimdetails["ReasonIDs_P"] = "";
            _claimdetails["Remarks"] = $('#' + _ctrlRemarks).val();
            if (($("#ddlRequestType").val() == 1 || $("#ddlRequestType").val() == 2) && basicData[0].IsFinal == false) {
                cliamsdetails_billing = JSON.stringify(_claimdetails);
                CommonConfirmAjaxDialog_billing('Do you want to make current preauth as final?', 'Confirmation Dialog', Submit_Request_referbilling_yes, Submit_Request_referbilling_No);
            }
            else
                Submit_Request(JSON.stringify(_claimdetails), _stageID);
        }
        else
            if (_stageID != 17 && _stageID != 18 && _stageID != 10) {
                _claimdetails["ReasonIDs_P"] = null;
                if ($('#' + _ctrlRemarks).val() != '') {
                    _claimdetails["ReasonIDs_P"] = $('#' + _ctrlReason).val();
                    _claimdetails["Remarks"] = $('#' + _ctrlRemarks).val();
                    Submit_Request(JSON.stringify(_claimdetails), _stageID);
                }
                else {
                    DialogWarningMessage('Please select Remarks To Submit');
                    return false;
                }
            }
            else {
                if ($('#' + _ctrlReason).val() != null || $('#' + _ctrlReason).val() != 0) {
                    if ((validate_reasonIDs($('#' + _ctrlReason).val())) == true) {
                        if (_stageID == 17)
                            _claimdetails["ReasonIDs_P"] = $('#' + _ctrlReason).val();
                        else
                            _claimdetails["ReasonIDs_P"] = ($('#' + _ctrlReason).val()).toString();
                        _claimdetails["Remarks"] = $('#' + _ctrlRemarks).val();
                        Submit_Request(JSON.stringify(_claimdetails), _stageID);
                    }
                } else {
                    DialogWarningMessage('Please select Reasons To Submit');
                    return false;
                }
            }

        //_cdtls = [];
        //_cdtls.push(_claimdetails);
    }
    else {
        //var _claimAction = (_stageID == 17) ? "Refer to Insurer" : (_stageID == 18) ? "Investigation" : (_stageID == 10) ? "Refer to CRM" : "";
        //alert(_claimAction + " is not possible for the " + providerstatus + " Provider.");
        alert("Warning! You are performing an action against " + providerstatus + " hospital. Only rejection is possible.");
    }
}

function Submit_Request_referbilling_yes() {
    is_preauth_final = true;
    Submit_Request(cliamsdetails_billing, 4);
}
function Submit_Request_referbilling_No() {
    is_preauth_final = false;
    Submit_Request(cliamsdetails_billing, 4);
}
var SubmitReferToInsurer = false;
function Submit_Request(_cdtls, _stageID) {
    if (SubmitReferToInsurer == false) {
        var RTI_deductible = 0;
        var valid = true;
        var ddlInvestigationReasons = $("#ddlInvestigationReasons").val();
        var ddlGroundofRepudiation = []
        ddlGroundofRepudiation = $("#ddlGroundofRepudiation").val();
        var ddlRecommendation = []
        ddlRecommendation = $("#ddlRecommendation").val();
        var ddlClaimantReason = []
        ddlClaimantReason = $("#ddlClaimantReason").val();
        var ddlHospitalReason = []
        ddlHospitalReason = $("#ddlHospitalReason").val();
        var txtSuspect_Fraudster_Name = $("#txtSuspect_Fraudster_Name").val();
        var ddlSuspect_Fraudster_Proof_ID = $("#ddlSuspect_Fraudster_Proof_ID").val();
        var txtSuspect_Fraudster_ID_Proof_Number = $("#txtSuspect_Fraudster_ID_Proof_Number").val();
        if ($("#hdnInsuranceCompanyID").val() == "7") {
            if (ddlInvestigationReasons == "-1") {
                valid = false;
                DialogWarningMessage('Please select Reasons To Submit');
                return;
            }
            if (ddlInvestigationReasons == "588") {
                if (ddlGroundofRepudiation == null) {
                    valid = false;
                    DialogWarningMessage('Please select Ground of Repudiation To Submit');
                    return;
                }
                if (ddlRecommendation == null) {
                    valid = false;
                    DialogWarningMessage('Please select Recommendation To Submit');
                    return;
                }

                $.each(ddlRecommendation, function (index) {
                    if (ddlRecommendation[index] == "603" && ddlClaimantReason == null) {
                        valid = false;
                        DialogWarningMessage('Please select Claimant Reason To Submit');
                        return;
                    }
                    else if (ddlRecommendation[index] == "604" && ddlHospitalReason == null) {
                        valid = false;
                        DialogWarningMessage('Please select Hospital Reason To Submit');
                        return;
                    }
                    else if ((ddlRecommendation[index] == "605" || ddlRecommendation[index] == "606" || ddlRecommendation[index] == "607" || ddlRecommendation[index] == "608" || ddlRecommendation[index] == "609" || ddlRecommendation[index] == "610")
                        && (txtSuspect_Fraudster_Name == "" || ddlSuspect_Fraudster_Proof_ID == "-1" || txtSuspect_Fraudster_ID_Proof_Number == "")) {
                        valid = false;
                        DialogWarningMessage('Please Enter Suspect/Fraudster Details To Submit');
                        return;
                    }
                });
            }
        }
        if (valid) {
            if ((_netpayableAmount >= 0 || _remainingdeductableAmount > 0) && basicData[0].IssueID == 10 && _stageID == 17) {
                Claim_Update();
            }
           // _deductableAmount = 123;
            if (MakeZerofromUndefinedorEmpty(_deductableAmount) != 0)
                RTI_deductible = _deductableAmount;

            var Claim_details = $.parseJSON(_cdtls);
            if (Claim_details.ReasonIDs_P == '0' && _stageID == 14) {
                DialogWarningMessage("Please select response reason before submit ");
                return false;
            }
            if (Claim_details.ReasonIDs_P == 221 || Claim_details.ReasonIDs_P == 225) {
                var element = document.getElementById("rmcls");
                if (element.classList.contains('collapsed')) {
                    element.classList.remove("collapsed");
                    Get_ClaimRejectedReasons($('#hdnClaimID').val(), $('#hdnClaimSlNo').val());
                }
                IRTotalRejectedReasons = [];
                infertoinsureractioncheck(3);
                if (IRTotalRejectedReasons.length == 0) {
                    DialogWarningMessage("You cannot submit the request without a reason for rejection. Please select a reason for rejection from the list and then submit.");
                    return false;
                }
            }


            //  setTimeout(function () {
            $.ajax({
                //type: "POST",
                url: "/MedicalScrutiny/Adjudication_Actions_Insert",
                contentType: 'application/json;charset=utf-8',
                beforeSend: function () { $("#progress1").show(); },
                //processData: false,
                data: {
                    ClaimDetails: _cdtls, QMSID: $("#hdnQMS").val(), QMSAdminID: $("#hdnQMS").val()
                    , ddlInvestigationReasons: (ddlInvestigationReasons == "-1" ? "" : ddlInvestigationReasons)
                    , ddlGroundofRepudiation: (ddlGroundofRepudiation == null ? "" : ddlGroundofRepudiation.join(","))
                    , ddlRecommendation: (ddlRecommendation == null ? "" : ddlRecommendation.join(","))
                    , ddlClaimantReason: (ddlClaimantReason == null ? "" : ddlClaimantReason.join(","))
                    , ddlHospitalReason: (ddlHospitalReason == null ? "" : ddlHospitalReason.join(","))
                    , txtSuspect_Fraudster_Name: txtSuspect_Fraudster_Name
                    , ddlSuspect_Fraudster_Proof_ID: (ddlSuspect_Fraudster_Proof_ID == "-1" ? "" : ddlSuspect_Fraudster_Proof_ID)
                    , txtSuspect_Fraudster_ID_Proof_Number: txtSuspect_Fraudster_ID_Proof_Number
                    , ClaimRejections: JSON.stringify(IRTotalRejectedReasons)
                    , txtfieldofcname: $("#txtfieldofcname").val()
                    , RTI_deductible: RTI_deductible
                    , Is_final: is_preauth_final
                },
                //data: { ClaimDetails: 1, Rules: 4 },
                success: function (data) {
                    $("#progress1").hide();
                    CheckSessionVariable(data.responseText);
                    if (basicData[0].issueID == 10) {
                        if (data.includes("500")) {
                            alert("ITGI server is down, please try later");
                            window.location = '/Claims/Index';
                        }
                        else if (data.includes("400")) {
                            alert("refer to insurer failed, please find below error for more information" + data);
                            window.location = '/Claims/Index';
                        }
                        else if (data.includes("200")) {
                            alert("claim moved to refer to insurer successfully");
                            window.location = '/Claims/Index';
                        }
                        else {
                            alert(data);
                            window.location = '/Claims/Index';
                        }
                    }
                    else {
                        alert(data);
                        window.location = '/Claims/Index';
                    }

                    if (_stageID == 14 && data != "\"Saved Successfully\"") {
                        $("#btnInsurerResSubmit").attr('disabled', true);
                    }
                    else {
                        if ($("#hdnQMSAdmin").val() != '' && _stageID != 17 && _stageID != 18) {
                            window.location = '/Qmsv2CMO/CMODashboard';
                        }
                        if ($("#hdnQMS").val() != '' && _stageID != 17 && _stageID != 18) {
                            window.location = '/Qmsv2CM/CMDashboard';
                        }
                        else if (_stageID != 17 && _stageID != 18) {
                            window.location = '/Claims/Index';
                        }

                        if (data == null || data == "") {
                            //alert('Data not found.');
                        }
                    }
                    SubmitReferToInsurer = true;
                },
                error: function (e, x) {
                    $("#progress1").hide();
                    ShowResultMessage('ErrorMessage', e.responseText);
                    $("#btnCRMRemarksbacktoadjSubmit").prop("disabled", false);
                    $("#btnCRMRemarksCRMReviewApproval").prop("disabled", false);
                }
            });
            //  }, 3000);
        }

        $('#btnCloseReferToInsurer').hide();
    }
    else {
        alert("Already Submited Remarks");
    }
}

function validate_reasonIDs(_reasonIDs) {
    var flag = true;
    if (_reasonIDs != 0 && _reasonIDs != null) {
        //_ids=_reasonIDs.string();
        if (_reasonIDs.indexOf('220') != -1) {
            if (_reasonIDs.indexOf('221') != -1) {
                DialogWarningMessage('Please Select Any One in Approve/Reject');
                flag = false;
            }
        }
    }
    else {
        DialogWarningMessage('Please Select Reasons To Proceed');
        flag = false;
    }
    return flag;
}

function ReferInsurerIds(InsID) {
    var result = false;
    var AllowInsurers = [2, 16, 18, 20, 21, 23, 24, 25, 26, 29, 30, 31, 10, 29];
    for (var i = 0; i < AllowInsurers.length; i++) {
        if (AllowInsurers[i] == InsID) {
            result = true;
            break;
        }
    }

    //SR-50628
    if (InsID == 30 && $('#hdnPolicyTypeID').val() == 4 && result == true) {
        result = false;
    }
    return result;
};
function BhimaSatarkInsurer(InsID) {
    var result = false;
    var AllowInsurers = [7, 5, 8, 20, 26];
    for (var i = 0; i < AllowInsurers.length; i++) {
        if (AllowInsurers[i] == InsID) {
            result = true;
            break;
        }
    }
    return result;
};
function Retrieve_AllRejectionReasons(_ClaimID, _SlNo) {
    //SP-1453(Refer To Insurer Alert While Rejecting A Preauth)  
    if (($('#hdnRequestTypeID').val() == 1 || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3) && $('#hdnClaimTypeID').val() == 1 && parseInt($('#hdnIsReferToInsurerCount').val()) == 0 && ReferInsurerIds($('#hdnInsuranceCompanyID').val()) == true && CheckIsValidProvider() == true && basicData[0].Isrefertoinsurer == false) {
        alert('Insurer approval is mandatory for rejection. Click on Refer to Insurer under Claim Actions.');
    }
    //End of SP-1453(Refer To Insurer Alert While Rejecting A Preauth)    
    else if (chkQP_MandatoryRecords()) {
        alert('You can not approve the claim as it is in query pending.');
    }
    else {
        if (_ClaimID != null && _SlNo != null) {
            if ($('#tblRejectall tbody').children().length == 0) {
                $.ajax({
                    type: "GET",
                    url: "/MedicalScrutiny/AllRejectionReasons_Retrieve",
                    contentType: 'application/json;charset=utf-8',
                    //processData: false,
                    data: {
                        ClaimID: _ClaimID, SlNo: _SlNo
                    },
                    success: function (data) {
                        CheckSessionVariable(data.responseText);

                        $('#hdnClaimAllRejectedReasons').val(data);
                        data = $.parseJSON(data);
                        Bind_AllRejectedReasons(data);

                        if (data == null || data == "") {
                        }
                    },
                    error: function (e, x) {
                        ShowResultMessage('ErrorMessage', e.responseText);
                    }
                });
            }
        }
    }
}

function Bind_AllRejectedReasons(data) {
    if (data != null) {
        for (var i = 0; i < data.length; i++) {
            var tblBody = '<tr> <td data-title="Override"><label class="inline"><input id="chkReasons_' + data[i].ClaimID + '_' + data[i].SLNO + '" type="checkbox" name="chkReasons" class="ace ace-switch ace-switch-5" > <span class="lbl middle"></span></label>'
                + '</td><td><span id="spnSlno_' + data[i].ClaimID + '_' + data[i].SLNO + '">' + data[i].SLNO + '</span></td><td><span id="spnStatus_' + data[i].ClaimID + '_' + data[i].SLNO + '">' + data[i].STATUS + '</span></td>'
                + '<td><span id="spnRDate_' + data[i].ClaimID + '_' + data[i].SLNO + '">' + JSONDateTime(data[i].RECEIVEDDATE) + '</span></td><td ><span id="spnRuleName_32">' + data[i].SANCTIONEDAMOUNT + '</span></td></tr>';

            $('#tblRejectall tbody').append(tblBody);

            //if (data[i].isOverride == 1)
            //    $('#chkReasons_' + data[i].ClaimID + '_' + data[i].SLNO).attr('checked', true);
            //else
            //    $('#btnOverride_' + data[i].TriggerID).attr('checked', false);

            $('#btnApprove,#btnReject').attr('disabled', true);
            $('#divRejectall').show();
        }
    }
}

function AllRejectReasons_Insert() {
    if ($('[name="chkReasons"]').is(':checked') == true) {
        var _reasons = [];
        if ($('#hdnClaimAllRejectedReasons').val() != '') {
            _reasons = $.parseJSON($('#hdnClaimAllRejectedReasons').val());
        }
        $.each(_reasons, function (i, _rsns) {
            if ($('#chkReasons_' + _rsns.ClaimID + '_' + _rsns.SLNO).is(':checked') == true) {
                ClaimRejectedReasons_Save(_rsns.ClaimID, _rsns.SLNO, $('#ddlRequestType').val(), $('#ddlServiceType').val(), $('#ddlServiceSubType').val(), $('#txtClaimedAmount').val(), 1);
            }
        });

        window.location = '/Claims/Index';
    } else
        DialogWarningMessage('No rejections selected.');
}

function ClaimAudit_Insert(_stageID, _ctrlReason, _ctrlRemarks, _roleID, isApprove, skipAudit) {
    //SP3V-1697 Leena
    var InsurerId = $('#hdnInsuranceCompanyID').val();
    var _ClaimTypeID = $('#hdnClaimTypeID').val();
    var _RequestTypeID = $("#hdnRequestTypeID").val();
    if ($("#hdnInsuranceCompanyID").val() == "7" && $("#hdnStageID").val() == "22" && ($("#hdnClaimTypeID").val() == 2 || ($("#hdnClaimTypeID").val() == 1 && $("#hdnRequestTypeID").val() == 4))) {
        if ($("#hdnIsCovid").val() == "Yes" && ($("#hndSRF_ID_on_Covid_Report").val() == "" || $("#hndICMR_ID_on_Covid_Report").val() == "")) {
            DialogResultMessage("Please Provide mandatory fields under Bima Satark Details tab .");
            $("#lnkBimaSatark").click();
            $("#lnkBimaSatark").focus();
            return false;
        }
    }
    var DischargeTypeId = '';
    if ((InsurerId == 5) && ((_RequestTypeID != 1) && (_RequestTypeID != 2) && (_RequestTypeID != 3))) {
        if ($('#ddlDischargeType').val() != '') {
            DischargeTypeId = $('#ddlDischargeType').val();
        }

        if ((DischargeTypeId == '0' || DischargeTypeId == null || DischargeTypeId == '' || DischargeTypeId == 'undefiened')) {
            DialogResultMessage("Please Select Discharge Type.");
            return false;
        }
    }
    //END SP3V-1697 Leena

    //SP3V-2447 Leena
    if ($('#rbTempBankDetails').is(':checked') == true) {
        var InsurerId = $('#hdnInsuranceCompanyID').val();
        var strmandatoryfield = '';
        if (($('#hdnClaimTypeID').val() == 2) && InsurerId == 7) {
            if ($('#txtReceivedPatient_Address1').val() == "" || $('#txtReceivedPatient_Address1').val() == undefined) {
                strmandatoryfield = ' Address1 / ';
            }
            if ($('#txtReceivedPatient_Address2').val() == "" || $('#txtReceivedPatient_Address2').val() == undefined) {
                strmandatoryfield = strmandatoryfield + ' Address2 / ';
            }
            if ($('#ddlReceivedPatient_State').val() == '' || $('#ddlReceivedPatient_State').val() == undefined || $('#ddlReceivedPatient_State').val() == 0) {
                strmandatoryfield = strmandatoryfield + ' State / ';
            }
            if ($('#ddlReceivedPatient_District').val() == '' || $('#ddlReceivedPatient_District').val() == undefined || $('#ddlReceivedPatient_District').val() == 0) {
                strmandatoryfield = strmandatoryfield + ' District / ';
            }
            if (($('#ddlReceivedPatient_CityID').val() == '' || ($('#ddlReceivedPatient_CityID').val() == undefined || $('#ddlReceivedPatient_CityID').val() == 0))) {
                strmandatoryfield = strmandatoryfield + ' City / ';
            }
            if ($('#txtReceivedPatient_Location').val() == '' || $('#txtReceivedPatient_Location').val() == undefined) {
                strmandatoryfield = strmandatoryfield + ' Location / ';
            }
            if (MakeNullfromUndefinedorEmpty($('#txtReceivedPatient_Pincode').val()) == null) {
                strmandatoryfield = strmandatoryfield + ' PinCode / ';
            }

            if (strmandatoryfield != '') {
                strmandatoryfield = strmandatoryfield.substring(0, strmandatoryfield.length - 2);
                DialogErrorMessage('Please enter Temporary Address : ' + strmandatoryfield);
                return false;
            }
            else if (MakeNullfromUndefinedorEmpty($('#txtReceivedPatient_Pincode').val()) != null && MakeNullfromUndefinedorEmpty($('#txtReceivedPatient_Pincode').val()).length < 6) {
                DialogErrorMessage('Pin Code should be 6 digits.');
                return false;
            }
            else if ($('#txtReceivedPatient_BankAccountNo').val() != '' && ($('#txtReceivedPatient_BankName').val() == '' || $('#txtReceivedPatient_BranchName').val() == ''
                || $('#ddlReceivedPatient_AccountType').val() == 0 || $('#txtReceivedPatient_IFSCode').val() == '')) {
                DialogErrorMessage('Please enter full bank details.');
                return false;
            }
            else if (MakeNullfromUndefinedorEmpty($('#txtReceivedPatient_IFSCode').val()) != null && MakeNullfromUndefinedorEmpty($('#txtReceivedPatient_IFSCode').val()).length < 11) {
                DialogErrorMessage('IFSC Code should be 11 digits.');
                return false;
            }
            else if ($('#txtReceivedPatient_BankAccountNo').val() == '' && $('#hdnClaimTypeID').val() == 2 && $('#hdnClaimStageID').val() == 24) {
                DialogErrorMessage('Please enter Bank Account No.');
                return false;
            }

        }
        else {
            strmandatoryfield = '';
            if ($('#txtReceivedPatient_BankAccountNo').val() != '' && ($('#txtReceivedPatient_BankName').val() == '' || $('#txtReceivedPatient_BranchName').val() == ''
                || $('#ddlReceivedPatient_AccountType').val() == 0 || $('#txtReceivedPatient_IFSCode').val() == '')) {
                DialogErrorMessage('Please enter full bank details.');
                return false;
            }
            else if (MakeNullfromUndefinedorEmpty($('#txtReceivedPatient_IFSCode').val()) != null && MakeNullfromUndefinedorEmpty($('#txtReceivedPatient_IFSCode').val()).length < 11) {
                DialogErrorMessage('IFSC Code should be 11 digits.');
                return false;
            }
            else if ($('#txtReceivedPatient_BankAccountNo').val() == '' && $('#hdnClaimTypeID').val() == 2 && $('#hdnClaimStageID').val() == 24) {
                DialogErrorMessage('Please enter Bank Account No.');
                return false;
            }
        }
    }
    //SP3V-2447 End

    if (basicData[0].IsPayment_NIDB == false && _roleID == 33 && isApprove == 1 && ($("#hdnPolicyNIDB").val()) == "true" && (($("#hdnClaimTypeID").val() == 2) || (($("#hdnClaimTypeID").val() == 1) && ($("#ddlRequestType").val() == 4)))) {
        DialogWarningMessage("This Claim is under Policy NIDB , Please contact Insurer to further process.");
        return false;
    }
    if (RelianceNIDB_falg == false && Isitpreauth($("#ddlRequestType").val()) && (basicData[0].IsPolicyNIDB == "true" || basicData[0].IsNIDB == "true") && basicData[0].IssueID == 9) {
        alert("This is NIDB case,So please take manual approval from insurer.Click approve button if already taken.");
        RelianceNIDB_falg = true;
        return false;
    }

    _claimdetails = {};
    _claimdetails["ClaimID"] = $('#hdnClaimID').val();
    _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
    _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
    _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
    _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
    _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
    _claimdetails["ClaimStageID"] = _stageID;
    _claimdetails["RoleID"] = _roleID;
    _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();
    _claimdetails["AgentID"] = $("#hdnAgentID").val();
    _claimdetails["issueID"] = basicData[0].IssueID;
    // ClaimAI: BillingCorrection validation removed

    if (isApprove == 0) {
        if (basicData[0].IssueID == 10 && ((_RequestTypeID == 1) || (_RequestTypeID == 2) || (_RequestTypeID == 3))) {
            DialogWarningMessage('for preauth Back to adjudication not possible for iTGI insurer');
            return false;
        }

        _claimdetails["ReasonIDs_P"] = $('#' + _ctrlReason).val();
        _claimdetails["PayeeType"] = null;

        if ($('#' + _ctrlReason).val() == null || $('#' + _ctrlReason).val() == 0 || $('#' + _ctrlReason).val() == '') {
            DialogWarningMessage('Please Select Option To Submit');
            return false;
        }
        //else if ($('#rbSystemBankDetails').attr('checked', false) && $('#rbTempBankDetails').attr('checked', false)) {
        //else if ($('[name="BankDetails"]').is(':checked') == false) {
        //    DialogWarningMessage('Please select bank details');
        //    return false;
        //}
    }
    else {
        _claimdetails["ReasonIDs_P"] = null;
        if ($('#rbSystemBankDetails').is(':checked') == true)
            _claimdetails["PayeeType"] = 1;
        else if ($('#rbTempBankDetails').is(':checked') == true)
            _claimdetails["PayeeType"] = 0;

        if ($('[name="BankDetails"]').is(':checked') == false && $("#SkipAudit").is("checked")) {
            DialogWarningMessage('Please select bank details');
            return false;
        }
        //  else if(MakeZerofromUndefinedorEmpty($('#txtReceivedPatient_BankAccountNo').val())==0 &&MakeZerofromUndefinedorEmpty($('#txtEnrollment_PayeeName').val())==0)
        else if ($('#rbSystemBankDetails').is(':checked') == true && (MakeZerofromUndefinedorEmpty($('#txtEnrollment_BankAccountNo').text()) == 0 || MakeZerofromUndefinedorEmpty($('#txtEnrollment_PayeeName').text()) == 0 || MakeZerofromUndefinedorEmpty($('#txtEnrollment_BankName').text()) == 0 || MakeZerofromUndefinedorEmpty($('#txtEnrollment_IFSCode').text()) == "")) {
            DialogWarningMessage('Member Bank details are not available. Please ensure Payee name and Accouunt number is available to approve.');
            return false;
        }
        else if (($('#rbTempBankDetails').is(':checked')) == true && (MakeZerofromUndefinedorEmpty($('#CL_spnAccountNo_View').text() == "" || MakeZerofromUndefinedorEmpty($('#txtEnrollment_PayeeName').text()) == "") || MakeZerofromUndefinedorEmpty($('#CL_spnBankName_View').text()) == "" || MakeZerofromUndefinedorEmpty($('#CL_spnBranchName_View').text()) == "" || MakeZerofromUndefinedorEmpty($('#CL_spnIFSCCode_View').text()) == "")) {
            DialogWarningMessage('Member Bank details are not available. Please ensure Payee name and Accouunt number is available to approve.');
            return false;
        }

        var enrollBankNo = MakeZerofromUndefinedorEmpty($('#txtEnrollment_BankAccountNo').text());
        var receivedBankNo = MakeZerofromUndefinedorEmpty($('#txtReceivedPatient_BankAccountNo').val());

        if ($("#rbTempBankDetails").is(":checked") && receivedBankNo.length < 6) {
            DialogWarningMessage('Invalid account number found.');
            return false;
        }
        if ($("#rbSystemBankDetails").is(":checked") && enrollBankNo.length < 6) {
            DialogWarningMessage('Invalid account number found.');
            return false;
        }

    }

    //if ($('#' + _ctrlReason).val() != null && $('#' + _ctrlReason).val() != 0 && $('#' + _ctrlReason).val() != '') {
    //    if (isApprove == 0) {
    //        _claimdetails["ReasonIDs_P"] = $('#' + _ctrlReason).val();
    //    } else {
    //        _claimdetails["ReasonIDs_P"] = null;
    //    }

    //    //_claimdetails["Remarks"] = $('#' + _ctrlRemarks).val();

    //} else if (isApprove == 0) {
    //    DialogWarningMessage('Please select Option To Submit');
    //    return false;
    //} else
    //    _claimdetails["ReasonIDs_P"] = null;

    ////if (isApprove == 0) {

    _claimdetails["NomineePayeeName"] = $("#txtEnrollment_PayeeName").text();

    //if ($('#rbSystemBankDetails').is(':checked') == true)
    //{
    //    _claimdetails["NomineePayeeName"] = $("#txtEnrollment_PayeeName").text();
    //}
    //else
    if ($('#rbTempBankDetails').is(':checked') == true) {
        if ($('#hdnMainMemberPolicyID').val() == $('#hdnMemberPolicyID').val() && $('#ddlPatientCondition').val() == "271") {
            if ($("#hdnPayeeTypeID").val() == 2 || $("#hdnPayeeTypeID").val() == 3) {
                _claimdetails["NomineePayeeName"] = $("#spnNomineePayeeName").text();
            }
            else if ($("#hdnPayeeTypeID").val() == 4 || MakeNullfromUndefinedorEmpty(basicData[0].ProposerName) == MakeNullfromUndefinedorEmpty(basicData[0].MemberName)) {
                _claimdetails["NomineePayeeName"] = $("#spnNomineePayeeName").text();
            }
        }
    }


    if ($('#' + _ctrlRemarks).val() != '' || $('#' + _ctrlRemarks).val() != null) {
        _claimdetails["Remarks"] = $('#' + _ctrlRemarks).val();
    }
    else {
        _claimdetails["Remarks"] = null;
        // DialogWarningMessage('Please select Remarks To Submit');
        // return false;
    }

    //SP3V-2383
    var ReceivedMode_P23_Id = MakeNullfromUndefinedorEmpty($('#hdnReceivedMode_P23').val());
    if (!$("#SkipAudit").prop("checked") && (_requesttype == 1 || _requesttype == 2)) {
        basicData[0].Sanctionedamount = $('#txtPayableAmount').text();
        basicData[0].excesssuminsured = $('#txtExcessSumInsured').text();
    }
    _claimdetails["IsPolicyNIDB"] = basicData[0].IsPolicyNIDB;
    _claimdetails["IsNIDB"] = basicData[0].IsNIDB;


    var Isrefertocrm = 0;

    if (basicData[0].Isrefertocrm == true && (parseInt($("#txtPayableAmount").text()) >= parseInt(basicData[0].Mbbs_thresholdlimit) || parseInt($("#txtPayableAmount").text()) >= parseInt(basicData[0].cmo_thresholdlimit))) {
        Isrefertocrm = 1;
    }

    $.ajax({
        //type: "POST",



        url: "/MedicalScrutiny/ClaimAudit_Insert",
        contentType: 'application/json;charset=utf-8',
        beforeSend: function () { $("#progress1").show(); },
        //processData: false,
        data: {
            ClaimDetails: JSON.stringify(_claimdetails), isApprove: (isApprove == 1) ? true : false, PolicyType: $('#hdnPolicyTypeID').val(),
            MainMemberPolicyID: $('#hdnMemberPolicyID').val(), PolicyID: $('#hdnPolicyID').val(), ProviderID: $('#hdnProviderID').val(),
            BrokerID: $('#hdnBrokerID').val(), PayerID: $('#hdnPayerID').val(), CorporateID: $('#hdnCorporateID').val(),
            InsuranceCompanyID: $('#hdnInsuranceCompanyID').val(), excesssuminsured: basicData[0].excesssuminsured,
            SanctionedAmount: parseFloat(basicData[0].Sanctionedamount, 10).toFixed(2), QMSID: $("#hdnQMS").val(), QMSAdminID: $("#hdnQMS").val()
            , skipAudit: skipAudit, createnewtop: createnewtop, Isrefertocrm: Isrefertocrm
        },
        //data: { ClaimDetails: 1, Rules: 4 },
        success: function (data) {
            $("#progress1").hide();
            CheckSessionVariable(data.responseText);
            //DialogResultMessage(data); Commented by Leena SP3V-2447
            //SP3V-2447 Leena----------------------------------------------
            var strmsg = data;
            if (strmsg.indexOf('-5') != -1) {

                DialogResultMessage(data.replace('-5|', ''));
                return false;
            }
            else {
                if (createnewtop == 1) {
                    Createtopupsupertopupclaims();
                    return false;
                }
                if (Isrefertocrm == 1) {
                    return false;
                }
                else {
                    DialogResultMessage(data);
                }

            }



            //End  SP3V-2447 Leena----------------------------------------------
            //if (data == 'Saved Successfully')
            if ($("#hdnQMSAdmin").val() != '') {
                window.location = '/Qmsv2CMO/CMODashboard';
            }
            else if ($("#hdnQMS").val() != '') {
                window.location = '/Qmsv2CM/CMDashboard';
            }
            else {
                window.location = '/Claims/Index';
            }
        },
        error: function (e, x) {
            $("#progress1").hide();
            ShowResultMessage('ErrorMessage', e.statusText);
        }
    });

    $('#' + _ctrlReason).val('0');
    $('#' + _ctrlRemarks).val('');

    // $('.popup8').trigger('click')
    //_cdtls = [];
    //_cdtls.push(_claimdetails);

}
//$('.close-btn').trigger('click')


function CommentedCodeSrividya() {
    //function Retrieve_Attachments(_ClaimID) {
    //    if (_ClaimID != null) {
    //        if ($('#tblAttachments tbody').children().length == 0) {
    //            $.ajax({
    //                type: "GET",
    //                url: "/MedicalScrutiny/ClaimAttachment_Retrieve",
    //                contentType: 'application/json;charset=utf-8',
    //                //processData: false,
    //                data: { ClaimID: _ClaimID },
    //                success: function (data) {
    //                    data = $.parseJSON(data);
    //                    Bind_Attachments(data);
    //                    if (data == null || data == "")
    //                        alert('Data not found.');

    //                },
    //                error: function (e, x) {
    //                    ShowResultMessage('ErrorMessage', e.responseText);
    //                }
    //            });
    //        }
    //    }
    //    // else
    //    // ShowWanringMessage("")
    //}
    //function Bind_Attachments(data) {
    //    if (data != null) {
    //        for (var i = 0; i < data.length; i++) {
    //            var tblBody = '<tr> <td data-title="Claim Stage" class="numeric">' + data[i].ClaimStage + '</td><td data-title="Request Type"class="numeric">' + data[i].RequestType + '</td>'
    //                + '<td data-title="File Names" class="numeric">' + data[i].FileNames + '</td> <td data-title="File Received Date" class="numeric">' + JSONDateTime(data[i].filereceiveddate) + '</td>'
    //                // + '<td class="center"> <a class="btn btn-sm btn-warning ng-scope ng-hide" href="/FUP/GetFile?fileID=' + data[i].DMSIDs + '"><i class="glyphicon glyphicon-download"></i>Download</a>&nbsp&nbsp</td></tr>';
    //            + ' </tr>';
    //            $('#tblAttachments tbody').append(tblBody);
    //        }
    //    }
    //}

    //function rfrInsurer_Insert(_stageID) {

    //    _claimdetails = {};
    //    _claimdetails["ClaimID"] = $('#hdnClaimID').val();
    //    _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
    //    _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
    //    _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
    //    _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
    //    _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
    //    _claimdetails["ClaimStageID"] = _stageID;
    //    _claimdetails["RoleID"] = 16;
    //    _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();
    //    //_cdtls = [];
    //    //_cdtls.push(_claimdetails);

    //    $.ajax({
    //        //type: "POST",
    //        url: "/MedicalScrutiny/rfrInsurer_Insert",
    //        contentType: 'application/json;charset=utf-8',
    //        //processData: false,
    //        data: { ClaimDetails: JSON.stringify(_claimdetails) },
    //        //data: { ClaimDetails: 1, Rules: 4 },
    //        success: function (data) {
    //            DialogResultMessage(data);
    //            //if (data == null || data == "")
    //            //    DialogWarningMessage('Data not found.');
    //        },
    //        error: function (e, x) {
    //            ShowResultMessage('ErrorMessage', e.responseText);
    //        }
    //    });

    //}

    //function rfrInvestigation_Insert(_stageID) {

    //    _claimdetails = {};
    //    _claimdetails["ClaimID"] = $('#hdnClaimID').val();
    //    _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
    //    _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
    //    _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
    //    _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
    //    _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
    //    _claimdetails["ClaimStageID"] = _stageID;
    //    _claimdetails["RoleID"] = 16;
    //    _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();
    //    //_cdtls = [];
    //    //_cdtls.push(_claimdetails);

    //    $.ajax({
    //        //type: "POST",
    //        url: "/MedicalScrutiny/rfrInvestigation_Insert",
    //        contentType: 'application/json;charset=utf-8',
    //        //processData: false,
    //        data: { ClaimDetails: JSON.stringify(_claimdetails) },
    //        //data: { ClaimDetails: 1, Rules: 4 },
    //        success: function (data) {
    //            DialogResultMessage(data);
    //            //if (data == null || data == "")
    //            //    DialogWarningMessage('Data not found.');
    //        },
    //        error: function (e, x) {
    //            ShowResultMessage('ErrorMessage', e.responseText);
    //        }
    //    });

    //}

    //function Audit_Insert(_stageID) {

    //    _claimdetails = {};
    //    _claimdetails["ClaimID"] = $('#hdnClaimID').val();
    //    _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
    //    _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
    //    _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
    //    _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
    //    _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
    //    _claimdetails["ClaimStageID"] = _stageID;
    //    _claimdetails["RoleID"] = 16;
    //    _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();
    //    //_cdtls = [];
    //    //_cdtls.push(_claimdetails);

    //    $.ajax({
    //        //type: "POST",
    //        url: "/MedicalScrutiny/Audit_Insert",
    //        contentType: 'application/json;charset=utf-8',
    //        //processData: false,
    //        data: { ClaimDetails: JSON.stringify(_claimdetails) },
    //        //data: { ClaimDetails: 1, Rules: 4 },
    //        success: function (data) {
    //            DialogResultMessage(data);
    //            //if (data == null || data == "")
    //            //    DialogWarningMessage('Data not found.');
    //        },
    //        error: function (e, x) {
    //            ShowResultMessage('ErrorMessage', e.responseText);
    //        }
    //    });

    //}
}

/* End Sri Vidya Code*/


/* Start Nagaraju Code */

// IR Reasons
var chkCRejected_ReasonID = 'chkCRejected_ReasonID_';
var tdCRejected_BriefReason = 'lblCRejected_BriefReason_';
var tdCRejected_DetailedReason = 'lblCRejected_DetailedReason_';
var txtCRejected_Remarks = 'txtCRejected_Remarks_';
var txtCRejected_FreeText1 = 'txtCRejected_FreeText1_';
var txtCRejected_FreeText2 = 'txtCRejected_FreeText2_';

//sp3v-2901 provision for Rejection category
var tdCORejected_Category = 'tdCORejected_Category_';
var hdnORejected_Category = 'tdCORejected_Category_';
var tdCORejected_SubCategory = 'tdCORejected_SubCategory_';
var hdnORejected_SubCategory = 'tdCORejected_SubCategory_';
var tdCORejected_Reasons = 'tdCORejected_Reasons_';
var tdIRDAIExclusionCode = 'tdIRDAIExclusionCode_';
var tdInsurerClause = 'tdInsurerClause_';
var tdInsurerDescription = 'tdInsurerDescription_';
var tdDrRemarks = 'tdDrRemarks_';

function GetAdjudicatorLetterAccess(_ClaimID, _SlNo) {
    var hasAccess = false;

    $.ajax({
        url: "/MedicalScrutiny/GetAdjudicatorLetterAccess",
        type: "GET",
        data: { ClaimID: _ClaimID, SlNo: _SlNo },
        async: false, // blocking (acceptable since you already use it)
        beforeSend: function () {
            $("#progress1").show();
        },
        success: function (data) {
            hasAccess = (data === true);
        },
        error: function (e) {
            ShowResultMessage('ErrorMessage', e.responseText);
        },
        complete: function () {
            $("#progress1").hide();
        }
    });

    return hasAccess;
}

function Get_ClaimRejectedReasons(_ClaimID, _SlNo) {
    if ($('#tblRejectedReasons tbody').children().length == 0) {
        $.ajax({
            //type: "POST",
            url: "/MedicalScrutiny/Get_ClaimRejectedReasons",
            contentType: 'application/json;charset=utf-8',
            beforeSend: function () { $("#progress1").show(); },
            //processData: false,
            async: false,
            data: { ClaimID: _ClaimID, SlNo: _SlNo },
            success: function (data) {
                $("#progress1").hide();
                CheckSessionVariable(data.responseText);
                data = $.parseJSON(data);
                if (data.Table.length == 0) {
                    $('#tblRejectedReasons').html('No Rejection Reasons Configured');
                }
                else {
                    $('#hdnClaimRejectedReasons').val('');
                    $('#hdnClaimOtherRejectedReasons').val('');

                    /* Claim Rejected Reasons*/
                    var CRReasons = [];
                    for (var i = 0; i < data.Table.length; i++) {
                        var _rReasons = {};
                        _rReasons.RejectionReasonsID = data.Table[i].ID;
                        _rReasons.FreeText1 = data.Table[i].FreeText1;
                        _rReasons.FreeText2 = data.Table[i].FreeText2;
                        _rReasons.Remarks = data.Table[i].Remarks;
                        //sp3v-2901 provision for Rejection category
                        _rReasons.RejectionCategory = 0;
                        _rReasons.RejectionSubCategory = 0;
                        _rReasons.RejectionCategoryName = '';
                        _rReasons.RejectionSubCategoryName = '';
                        CRReasons.push(_rReasons);
                    }
                    if (CRReasons.length > 0)
                        $('#hdnClaimRejectedReasons').val(JSON.stringify(CRReasons));

                    /* Claim Other Rejected Reasons*/
                    var CORReasons = [];
                    for (var j = 0; j < data.Table1.length; j++) {
                        var _orReasons = {};
                        _orReasons.RejectionReasonsID = 0;
                        _orReasons.SrNo = j + 1;
                        _orReasons.FreeText1 = null;
                        _orReasons.FreeText2 = null;
                        _orReasons.FreeText2 = null;
                        _orReasons.Remarks = data.Table1[j].Remarks;
                        //sp3v-2901 provision for Rejection category
                        _orReasons.RejectionCategory = data.Table1[j].RejectionCategory;
                        _orReasons.RejectionSubCategory = data.Table1[j].RejectionSubCategory;
                        _orReasons.InsurerRejectionID = data.Table1[j].InsurerRejectionId;
                        _orReasons.RejectionCategoryName = (data.Table1[j].RejectionCategoryName == null) ? '' : data.Table1[j].RejectionCategoryName;
                        _orReasons.RejectionSubCategoryName = (data.Table1[j].RejectionSubCategoryName == null) ? '' : data.Table1[j].RejectionSubCategoryName;
                        CORReasons.push(_orReasons);
                    }
                    if (CORReasons.length > 0)
                        $('#hdnClaimOtherRejectedReasons').val(JSON.stringify(CORReasons));


                    ClaimRejectedReasons_Bind(data.Table, data.Table1, 'tblRejectedReasons', 'tblClaimOthersRejectedReasons');
                }
            },
            error: function (e, x) {
                $("#progress1").hide();
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });
    }
}

function ClaimRejectedReasons_Bind(data, tblOtherReasons, tblRejectedReasons, tblClaimOthersRejectedReasons) {

    // Claim Rejected Reasons Coding
    data = data.filter(x => x.claimRejID > 0);

    if (data.filter(x => x.claimRejID > 0).length < 1) {
        $('#tblRejectedReasonsDiv').hide();
        $('#tblRejectedReasons').hide();
    } else {
        for (var i = 0; i < data.length; i++) {
            var vDesign = ClaimRejectedReasons_RowDesign(data[i].ID, data[i].ShortText, data[i].Name);

            $('#' + tblRejectedReasons + ' tbody').append(vDesign);
            var reason = data[i].Name;
            var reasonID = data[i].ID;

            if (data[i].claimRejID != "" && data[i].claimRejID != null) {
                $('#' + chkCRejected_ReasonID + reasonID).attr("checked", true);
                $('#' + chkCRejected_ReasonID + reasonID).attr("disabled", true);
                $('#' + txtCRejected_Remarks + reasonID);

                if (reason.indexOf('|FT|') != -1) {
                    $('#' + txtCRejected_FreeText1 + reasonID).removeAttr("disabled", "disabled");
                }
                if (reason.indexOf('|FT1|') != -1) {
                    $('#' + txtCRejected_FreeText2 + reasonID).removeAttr("disabled", "disabled");
                }
            }


            $('#' + txtCRejected_Remarks + reasonID).val(data[i].Remarks);
            if (reason.indexOf('|FT|') != -1) {
                $('#' + txtCRejected_FreeText1 + reasonID).val(data[i].FreeText1);
            }
            if (reason.indexOf('|FT1|') != -1) {
                $('#' + txtCRejected_FreeText2 + reasonID).val(data[i].FreeText2);
            }

        }
    }
    var $tbody = $('#' + tblClaimOthersRejectedReasons + ' tbody');
    $tbody.find('tr:not(:first)').remove();
    // Claim Other Rejected Reasons Code
    for (var j = 0; j < tblOtherReasons.length; j++) {
        var oSlNo = j + 1;
        var oID = tblOtherReasons[j].ID;
        var vORDesign = '<tr id="trCOtherRejected_Row_' + oSlNo + '">'
            //sp3v-2901 provision for Rejection category
            + '<td id="' + tdCORejected_Category + oSlNo + '">' + tblOtherReasons[j].RejectionCategoryName + '</td>'
            + '<td id="' + tdCORejected_SubCategory + oSlNo + '">' + tblOtherReasons[j].RejectionSubCategoryName + '</td>';
        if ($('#txtClaimOtherIRRejectionReason').is(':hidden')) {
            vORDesign += '<td id="' + tdIRDAIExclusionCode + oSlNo + '">' + tblOtherReasons[j].IradaiExclCode + '</td>'

            if (!$('#ddlInsurerProductCodeth').is(':hidden')) {
                vORDesign += '<td id="' + tdInsurerClause + oSlNo + '">' + tblOtherReasons[j].InsExclCode + '</td>'
            }
            vORDesign += '<td id="' + tdInsurerDescription + oSlNo + '">' + tblOtherReasons[j].StandardRejectionReasons + '</td>'
            vORDesign += '<td id="' + tdDrRemarks + oSlNo + '">' + tblOtherReasons[j].Remarks + '</td>'
        }
        else {
            vORDesign += '<td id="' + tdCORejected_Reasons + oSlNo + '">' + tblOtherReasons[j].Remarks + '</td>'
        }
        vORDesign += '<td style="vertical-align:top; text-align:center; font-size:20px"><a href="javascript:void(0)" class="btnOtherRejectionDelete"><i class="fa fa-trash-o" aria-hidden="true"></i></a></td></tr>';

        $('#' + tblClaimOthersRejectedReasons + ' tbody').append(vORDesign);
    }

}
function ClaimRejectedReasons_RowDesign(ID, BriefReason, DetailedReason) {

    var ft1 = '<input type="text" style="width:90px !important" disabled="disabled" id="' + txtCRejected_FreeText1 + ID + '">';
    var ft2 = '<input type="text" style="width:90px !important" disabled="disabled" id="' + txtCRejected_FreeText2 + ID + '">';

    var replaceFT = 0;
    var replaceFT1 = 0;
    if (DetailedReason.indexOf('|FT|') != -1) {
        DetailedReason = DetailedReason.replace('|FT|', ft1);
        replaceFT = 1;
    }
    if (DetailedReason.indexOf('|FT1|') != -1) {
        DetailedReason = DetailedReason.replace('|FT1|', ft2);
        replaceFT1 = 1;
    }

    if (DetailedReason.indexOf('~PSD~') != -1) {
        DetailedReason = DetailedReason.replace('~PSD~', $('#spanPolicyStartDate').text());
    }
    if (DetailedReason.indexOf('~PID~') != -1) {
        DetailedReason = DetailedReason.replace('~PID~', $('#spanPolicyInceptionDate').text());
    }
    if (DetailedReason.indexOf('~DOA~') != -1) {
        DetailedReason = DetailedReason.replace('~DOA~', $('#txtHospDOA').val());
    }
    if (DetailedReason.indexOf('~DOD~') != -1) {
        DetailedReason = DetailedReason.replace('~DOD~', $('#txtHospDOD').text());
    }


    var vQPDesign = '<tr id="trCRejected_Row_' + ID + '">'
        + '<td><input type="checkbox" id="' + chkCRejected_ReasonID + ID + '" onclick="EnableorDisableCRejectedControls(' + replaceFT + ',' + replaceFT1 + ',\'' + ID +

        '\')"><span class="lbl padding-8"></span></td>'
        + '<td id="' + tdCRejected_BriefReason + ID + '">' + BriefReason + '</td>'
        + '<td id="' + tdCRejected_DetailedReason + ID + '">' + DetailedReason + '</td>'
        + '<td><textarea type="text" disabled="disabled" style="width:250px !important" id="' + txtCRejected_Remarks + ID + '"></textarea></td>'
        + '</tr>';

    return vQPDesign;
}

function EnableorDisableCRejectedControls(ft, ft1, rID) {

    if ($('#' + chkCRejected_ReasonID + rID).is(":checked") == true) {
        $('#' + txtCRejected_Remarks + rID).removeAttr("disabled");
        if (ft == 1) {
            $('#' + txtCRejected_FreeText1 + rID).removeAttr("disabled");
        }
        if (ft1 == 1) {
            $('#' + txtCRejected_FreeText2 + rID).removeAttr("disabled");
        }
    }
    else {
        $('#' + txtCRejected_Remarks + rID).attr("disabled", "disabled");
        $('#' + txtCRejected_Remarks + rID).val('');
        if (ft == 1) {
            $('#' + txtCRejected_FreeText1 + rID).attr("disabled", "disabled");
            $('#' + txtCRejected_FreeText1 + rID).val('');
        }
        if (ft1 == 1) {
            $('#' + txtCRejected_FreeText2 + rID).attr("disabled", "disabled");
            $('#' + txtCRejected_FreeText2 + rID).val('');
        }
    }

}

function AddClaimOtherRejectedReasons() {
    //sp3v-2901 provision for Rejection category
    var RejectionCategory = $('#ddlRejCategory').val();
    var RejectionSubCategory = $('#ddlRejSubCategory').val();
    var InsurerRejectionIDkey = $('#ddlInsurerRejection').val();
    var ddlInsurerRejectionCodekey = $('#ddlInsurerRejectionCode').val();
    var ddlInsurerProductCodekey = $('#ddlInsurerProductCode').val();
    var ddlInsurerProductDescriptionkey = $('#ddlInsurerProductDescription').val();
    var InsurerRejectionID = $('#ddlInsurerProductDescription').val() || 0;
    var InsurerCustomRemarksID = $('#ddlInsurerCustomRemarks').val();
    var InsurerCustomRemarks = $('#txtClaimOtherIRRejectionReason1').val();

    var RejectionRemarks = '';
    if (MakeNullfromUndefinedorEmpty(RejectionCategory) == null) {
        DialogWarningMessage('Please Select Rejection category.');
        return;
    }
    else if (MakeNullfromUndefinedorEmpty(RejectionSubCategory) == null) {
        DialogWarningMessage('Please Select  Rejection subcategory.');
        return;
    }
    else if (MakeNullfromUndefinedorEmpty(InsurerRejectionIDkey) == null && !$('#ddlInsurerRejection').is(":hidden")) {
        DialogWarningMessage('Please Select Insurer Rejection.');
        return;
    }
    //else if (MakeNullfromUndefinedorEmpty(InsurerCustomRemarks) == null && !$('#ddlInsurerRejectionCode').is(":hidden")) {
    //    DialogWarningMessage('Please enter rejection reason.');
    //    //DialogWarningMessage('Please Select Exclusion Code.');
    //    return;
    //}
    //else if (MakeNullfromUndefinedorEmpty(ddlInsurerProductCodekey) == null && !$('#ddlInsurerProductCode').is(":hidden")) {
    //    DialogWarningMessage('Please Select Insurer Clause.');
    //    return;
    //}
    else if ((MakeNullfromUndefinedorEmpty(ddlInsurerProductDescriptionkey) == null && !$('#ddlInsurerProductDescription').is(":hidden")) && $('#txtClaimOtherIRRejectionReason1').val().trim().length == 0) {
        DialogWarningMessage('Please Select Insurer Description/Enter rejection reason');
        return;
    }
    //else if (MakeNullfromUndefinedorEmpty($('#txtClaimOtherIRRejectionReason').val()) == null && !$('#txtClaimOtherIRRejectionReason').is(":hidden")) {
    //    //alert('Please enter other rejection reason.');
    //    DialogWarningMessage('Please enter rejection reason.');
    //    return;
    //}
    else {

        var _othersSlNo = $('#tblClaimOthersRejectedReasons tbody tr').length + 1;

        if (!$('#txtClaimOtherIRRejectionReason').is(":hidden")) {
            RejectionRemarks = $('#txtClaimOtherIRRejectionReason').val();
            InsurerRejectionID = "0";
            InsurerCustomRemarksID = "0";
        }
        else {
            RejectionRemarks = $('#txtClaimOtherIRRejectionReason1').val();
        }


        var vORDesign = '<tr id="trCOtherRejected_Row_' + _othersSlNo + '">'
            //sp3v-2901 provision for Rejection category
            + '<td style="vertical-align:top;" id="' + tdCORejected_Category + _othersSlNo + '">' + $('#ddlRejCategory option:selected').text() + '</td>'
            + '<td style="vertical-align:top;" id="' + tdCORejected_SubCategory + _othersSlNo + '">' + $('#ddlRejSubCategory option:selected').text() + '</td>';
        if ($('#txtClaimOtherIRRejectionReason').is(':hidden')) {
            vORDesign += '<td style="vertical-align:top;" id="' + tdIRDAIExclusionCode + _othersSlNo + '">' + $('#ddlInsurerRejectionCode option:selected').text() + '</td>'
            if (!$('#ddlInsurerProductCodeth').is(':hidden')) {
                vORDesign += '<td style="vertical-align:top;" id="' + tdInsurerClause + _othersSlNo + '">' + $('#ddlInsurerProductCode option:selected').text() + '</td>'
            }
            vORDesign += '<td style="vertical-align:top;" id="' + tdInsurerDescription + _othersSlNo + '">' + $('#ddlInsurerProductDescription option:selected').text() + '</td>'
            vORDesign += '<td style="vertical-align:top;" id="' + tdDrRemarks + _othersSlNo + '">' + RejectionRemarks + '</td>'
        }
        else {
            vORDesign += '<td id="' + tdCORejected_Reasons + _othersSlNo + '">' + RejectionRemarks + '</td>'
        }

        //+ '<td style="vertical-align:top; text-align:center; font-size:20px"><a href="" class="btnOtherRejectionDelete"><i class="fa fa-trash-o" aria-hidden="true"></i></a></td></tr>';
        vORDesign += '<td style="vertical-align:top; text-align:center; font-size:20px"><a href="javascript:void(0)" class="btnOtherRejectionDelete"><i class="fa fa-trash-o" aria-hidden="true"></i></a></td></tr>';

        $('#tblClaimOthersRejectedReasons tbody').append(vORDesign);

        var CORReasons = [];
        if ($('#hdnClaimOtherRejectedReasons').val() != '') {
            CORReasons = $.parseJSON($('#hdnClaimOtherRejectedReasons').val());
        }
        var _orReasons = {};
        _orReasons.RejectionReasonsID = InsurerCustomRemarksID;
        _orReasons.FreeText1 = null;
        _orReasons.FreeText2 = null;

        //sp3v-2901 Rejection category & subcategory
        _orReasons.RejectionCategory = $('#ddlRejCategory').val();
        _orReasons.RejectionSubCategory = $('#ddlRejSubCategory').val();
        _orReasons.RejectionCategoryName = $('#ddlRejCategory option:selected').text();
        _orReasons.RejectionSubCategoryName = $('#ddlRejSubCategory option:selected').text();
        _orReasons.InsurerRejectionID = InsurerRejectionID;
        //_orReasons.Remarks = $('#txtClaimOtherIRRejectionReason').val();
        _orReasons.Remarks = RejectionRemarks;
        _orReasons.SrNo = _othersSlNo;
        CORReasons.push(_orReasons);

        if (CORReasons.length > 0)
            $('#hdnClaimOtherRejectedReasons').val(JSON.stringify(CORReasons));

        $('#txtClaimOtherIRRejectionReason').val('');
        //sp3v-2901 provision for Rejection category
        $('#ddlRejCategory').val('');
        $('#ddlRejSubCategory').val('');
        $('#ddlInsurerRejection').val('');
        $('#ddlInsurerRejectionCode').val('');
        $('#ddlInsurerCustomRemarks').val('');
        $('#txtClaimOtherIRRejectionReason1').val('');
        $('#ddlInsurerProductDescription').val('');
        $('#ddlInsurerProductCode').val('');

        $('#hyperInsurerRejection').attr('title', 'select');
    }
}

$("#tblClaimOthersRejectedReasons").on('click', '.btnOtherRejectionDelete', function () {
    var _rejCat = $(this).closest("tr").children().eq(0).text();
    var rowNo = $(this).closest('tr').attr('id').split('_')[2];
    var CORReasons = [];
    if ($('#hdnClaimOtherRejectedReasons').val() != '') {
        CORReasons = $.parseJSON($('#hdnClaimOtherRejectedReasons').val());
    }

    $.each(CORReasons, function (i, query) {
        if (query.RejectionCategoryName == _rejCat && query.SrNo == rowNo) {
            CORReasons.splice(i, 1);
            return false;
        }
    });

    if (CORReasons.length > 0)
        $('#hdnClaimOtherRejectedReasons').val(JSON.stringify(CORReasons));
    else
        $('#hdnClaimOtherRejectedReasons').val('');

    // Delete row in table
    $(this).closest('tr').remove();

});

function ClaimRejectedReasons_Save(_ClaimID, _Slno, _RequestTypeID, _ServiceTypeID, _ServiceSubTypeID, _ClaimedAmount, _flag) {
    try {
        //SP-1453(Refer To Insurer Alert While Rejecting A Preauth)
        var element = document.getElementById("rmcls");
        if (element.classList.contains('collapsed')) {
            element.classList.remove("collapsed");
            Get_ClaimRejectedReasons($('#hdnClaimID').val(), $('#hdnClaimSlNo').val());
        }
        if (($('#hdnRequestTypeID').val() == 1 || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3) && $('#hdnClaimTypeID').val() == 1 && parseInt($('#hdnIsReferToInsurerCount').val()) == 0 && ReferInsurerIds($('#hdnInsuranceCompanyID').val()) == true && CheckIsValidProvider() == true && basicData[0].Isrefertoinsurer == false) {
            alert('Insurer approval is mandatory for rejection. Click on Refer to Insurer under Claim Actions.');
        }
        //End of SP-1453(Refer To Insurer Alert While Rejecting A Preauth)
        else if (chkQP_MandatoryRecords()) {
            alert('You can not approve the claim as it is in query pending.');
        }
        else {
            var _rules = [];
            if ($('#hdnApprovalDetails').val() != "" && $('#hdnApprovalDetails').val() != "[]") {
                _rules = $.parseJSON($('#hdnApprovalDetails').val());
            }
            var TotalRejectedReasons = [];
            var TotalOtherRejectedReasons = [];
            // Claim Rejected Reasons
            var CRReasons = [];
            if ($('#hdnClaimRejectedReasons').val() != '') {
                CRReasons = $.parseJSON($('#hdnClaimRejectedReasons').val());
            }
            $.each(CRReasons, function (i, query) {
                var rID = query.RejectionReasonsID;
                var reason = $('#' + tdCRejected_DetailedReason + rID).html();
                if ($('#' + chkCRejected_ReasonID + rID).is(":checked") == true) {
                    var _rReasons = {};
                    _rReasons.RejectionReasonsID = rID;
                    if (reason.indexOf('FreeText1') != -1) {
                        if ($('#' + txtCRejected_FreeText1 + rID).val() != '')
                            _rReasons.FreeText1 = $('#' + txtCRejected_FreeText1 + rID).val();
                        else
                            _rReasons.FreeText1 = null;
                    }
                    else
                        _rReasons.FreeText1 = null;
                    if (reason.indexOf('FreeText2') != -1) {
                        if ($('#' + qptxtFreeText2 + rID).val() != '')
                            _rReasons.FreeText2 = $('#' + qptxtFreeText2 + rID).val();
                        else
                            _rReasons.FreeText2 = null;
                    }
                    else
                        _rReasons.FreeText2 = null;
                    //sp3v-2901 provision for Rejection category
                    _rReasons.RejectionCategory = 0;
                    _rReasons.RejectionSubCategory = 0;
                    //_rReasons.RejectionCategoryName = 0;
                    _rReasons.Remarks = $('#' + txtCRejected_Remarks + rID).val();

                    TotalRejectedReasons.push(_rReasons);
                }
            });
            // Claim Other Rejected Reasons
            var CORReasons = [];
            if ($('#hdnClaimOtherRejectedReasons').val() != '') {
                CORReasons = $.parseJSON($('#hdnClaimOtherRejectedReasons').val());
            }
            $.each(CORReasons, function (i, query) {
                var _orReasons = {};
                _orReasons.RejectionReasonsID = 0;
                _orReasons.FreeText1 = null;
                _orReasons.FreeText2 = null;
                //sp3v-2901 provision for Rejection category
                _orReasons.RejectionCategory = query.RejectionCategory;
                _orReasons.RejectionSubCategory = query.RejectionSubCategory;
                _orReasons.InsurerRejectionID = query.InsurerRejectionID;
                _orReasons.Remarks = query.Remarks;
                TotalRejectedReasons.push(_orReasons);
                TotalOtherRejectedReasons.push(_orReasons);
            });

            //if (_rules != null) {
            //    $.each(_rules, function (i, BRule) {
            //        var rule = {};
            //        rule.RejectionReasonsID = 0;
            //        rule.FreeText1 = null;
            //        rule.FreeText2 = null;
            //        rule.Remarks = BRule.RuleName;
            //        TotalRejectedReasons.push(rule);
            //    });
            //}

            var _newRules = [];
            if (_rules.length > 0) {
                $.each(_rules, function (i, sIDs) {
                    var _triggerID = sIDs["TriggerID"];
                    var name = sIDs["RuleName"];
                    var _bPCOnditionId = sIDs["BPConditionID"];
                    var _objrules = {};
                    _objrules["TriggerID"] = _triggerID;
                    _objrules["RuleName"] = name;
                    if ($('#btnOverride_' + _triggerID).is(':checked') == true)
                        _objrules["isOverride"] = 1;
                    else
                        _objrules["isOverride"] = 0;
                    _objrules["OverrideReasonIDs_P34"] = $('#ddlOverrideReasons_' + _triggerID).val();
                    if ($('#taOverRideRemarks_' + _triggerID).val() != "") {
                        _objrules["OverRideRemarks"] = $('#taOverRideRemarks_' + _triggerID).val();
                    } else {
                        _objrules["OverRideRemarks"] = null;
                    }
                    _objrules["OverrideruleID"] = null;
                    _objrules["BPConditionID"] = _bPCOnditionId;
                    _newRules.push(_objrules);
                });
            }

            // override autocopay rule //
            //Commented by leen variable not define its shows run time error sp3v-1611 13apr2023
            //$('#tbloverrideRuleApproval > tbody  > tr').each(function () {
            //    var id = this.id;
            //    var _triggerID = id.split('_')[1];
            //    var name = $('#spnRuleName_' + _triggerID + '').text();
            //    _objrules["TriggerID"] = _triggerID;
            //    _objrules["RuleName"] = name;
            //    if ($('#btnOverride_' + _triggerID).is(':checked') == true)
            //        _objrules["isOverride"] = 1;
            //    else
            //        _objrules["isOverride"] = 0;
            //    _objrules["OverrideReasonIDs_P34"] = $('#ddlOverrideReasons_' + _triggerID).val();
            //    if ($('#taOverRideRemarks_' + _triggerID).val() != "") {
            //        _objrules["OverRideRemarks"] = $('#taOverRideRemarks_' + _triggerID).val();
            //    } else {
            //        _objrules["OverRideRemarks"] = null;
            //    }
            //    _objrules["OverrideruleID"] = _triggerID;
            //    _objrules["BPConditionID"] = 0;
            //    _newRules.push(_objrules);
            //});
            ///////
            //if (_rules != null) {
            //    $('#hdnApprovalDetails').val(JSON.stringify(_newRules));
            //}
            //End Leena
            // override autocopay rule //
            //Leena Define new variable 13apr2023 SP3V-1611-----------------------------
            var _CopaynewRules = [];
            $('#tbloverrideRuleApproval > tbody  > tr').each(function () {
                var _Copayobjrules = {};
                var id = this.id;
                var _triggerID = id.split('_')[1];
                var name = $('#spnRuleName_' + _triggerID + '').text();
                _Copayobjrules["TriggerID"] = _triggerID;
                _Copayobjrules["RuleName"] = name;
                if ($('#btnOverride_' + _triggerID).is(':checked') == true)
                    _Copayobjrules["isOverride"] = 1;
                else
                    _Copayobjrules["isOverride"] = 0;
                _Copayobjrules["OverrideReasonIDs_P34"] = $('#ddlOverrideReasons_' + _triggerID).val();
                if ($('#taOverRideRemarks_' + _triggerID).val() != "") {
                    _Copayobjrules["OverRideRemarks"] = $('#taOverRideRemarks_' + _triggerID).val();
                } else {
                    _Copayobjrules["OverRideRemarks"] = null;
                }
                _Copayobjrules["OverrideruleID"] = _triggerID;
                _Copayobjrules["BPConditionID"] = 0;
                _CopaynewRules.push(_Copayobjrules);
            });
            /////
            if (_rules != null) {
                $('#hdnApprovalDetails').val(JSON.stringify(_CopaynewRules));
            }
            var Claimrejdeductible = 0;
            if (OverrideDeductible == true)
                Claimrejdeductible = Makezerofromnullorundefined($('.txtDeductibleOverride').val());
            else
                Claimrejdeductible = Makezerofromnullorundefined($('#txtDeductible').text());
            //End Leena

            // Save Details
            ////////if (_flag == 0) {
            ////////    if (TotalRejectedReasons.length > 0) {
            ////////        ajaxGETResonse('/MedicalScrutiny/Save_ClaimRejectedReasons', QueryPending_Response, QueryPending_Response,
            ////////            {
            ////////                ClaimID: _ClaimID, SlNo: _Slno, ClaimRejections: JSON.stringify(TotalRejectedReasons),
            ////////                ClaimTypeID: $('#hdnClaimTypeID').val(), RequestTypeID: _RequestTypeID,
            ////////                ServiceTypeID: _ServiceTypeID, ServiceSubTypeID: _ServiceSubTypeID, ClaimedAmount: _ClaimedAmount, PolicyTypeID: $('#hdnPolicyTypeID').val(),
            ////////                MainMemberPolicyID: $('#hdnMainMemberPolicyID').val(), PolicyID: $('#hdnPolicyID').val(), ProviderID: $('#hdnProviderID').val(),
            ////////                BrokerID: $('#hdnBrokerID').val(), PayerID: $('#hdnPayerID').val(), CorporateID: $('#hdnCorporateID').val(), InsuranceCompanyID: $('#hdnInsuranceCompanyID').val()
            ////////            });
            ////////    }
            ////////    else
            ////////        alert('No rejections selected.');
            ////////}
            ////////else {
            if (TotalOtherRejectedReasons.length > 0) {
                //Issues While Updating Deductible & Aggregate Deductible Calculation On Claims(SP-1462)
                if (isbillcalculated == false) {
                    DialogWarningMessage("Bill amounts not calculated");
                    return false;
                }
                if (basicData[0].IssueID == 10 && basicData[0].isITGImanualapv == 1 && ITGIConfimation == true) {
                    alert("Case was not pushed to Insurer through API. Are you sure you want to approve/reject the case manually ?");
                    ITGIConfimation = false;
                    $('#manualapvcheckbox').show();
                    return false;
                }
                if (basicData[0].IssueID == 10 && basicData[0].isITGImanualapv == 1 && ($('#manualapvchk').is(':checked') == false)) {
                    alert("please check confirmation checkbox to reject claim");
                    return false;
                }

                if (basicData[0].IssueID == 26 && (basicData[0].RequestTypeID == 1 || basicData[0].RequestTypeID == 2 || basicData[0].RequestTypeID == 3)) {
                    basicData[0].Isrefertoinsurer = false;
                }

                if (basicData[0].Isrefertoinsurer == true) {
                    infertoinsureractioncheck(2);
                    return false;
                }
                //End of Issues While Updating Deductible & Aggregate Deductible Calculation On Claims(SP-1462)
                $.ajax({
                    type: "POST",
                    url: "/MedicalScrutiny/Save_ClaimRejectedReasons",
                    beforeSend: function () { $("#progress1").show(); },
                    //contentType: 'application/json;charset=utf-8',
                    //processData: false, 
                    data:
                    {
                        ClaimID: _ClaimID,
                        SlNo: _Slno,
                        ClaimRejections: JSON.stringify(TotalRejectedReasons),
                        ClaimTypeID: $('#hdnClaimTypeID').val(),
                        RequestTypeID: $('#hdnRequestTypeID').val(),
                        ServiceTypeID: $('#hdnServiceTypeID').val(),
                        ServiceSubTypeID: $('#hdnServiceSubTypeID').val(),
                        ClaimedAmount: _ClaimedAmount,
                        PolicyTypeID: $('#hdnPolicyTypeID').val(),
                        MainMemberPolicyID: $('#hdnMemberPolicyID').val(),
                        PolicyID: $('#hdnPolicyID').val(),
                        ProviderID: $('#hdnProviderID').val(),
                        BrokerID: $('#hdnBrokerID').val(),
                        PayerID: $('#hdnPayerID').val(),
                        CorporateID: $('#hdnCorporateID').val(),
                        InsuranceCompanyID: $('#hdnInsuranceCompanyID').val(),
                        ClaimRules: $('#hdnApprovalDetails').val(),
                        AgentID: $('#hdnAgentID').val(),
                        //DeductibleAmt: $('#txtDeductible').val() == null || $('#txtDeductible').val() == '' ? 0 : $('#txtDeductible').val()
                        //DeductibleAmt: Makezerofromnullorundefined($('#txtDeductible').text()),//For SP-1462
                        DeductibleAmt: Makezerofromnullorundefined(Claimrejdeductible),//For SP3V-1611 Leena 13apr2023
                        PremiumAmount: Makezerofromnullorundefined($('#txtInstallment_Premium').text()),//For SP-1462
                        QMSID: $("#hdnQMS").val(), QMSAdminID: $("#hdnQMS").val()
                    },
                    success: function (data) {
                        $("#progress1").hide();
                        CheckSessionVariable(data);
                        //flag is used to recognization for reject/reject all
                        if (_flag == 0) {
                            if (data != '') {
                                alert(data);
                                if ($("#hdnQMSAdmin").val() != '') {
                                    window.location = '/Qmsv2CMO/CMODashboard';
                                }
                                else
                                    if ($("#hdnQMS").val() != '') {
                                        window.location = '/Qmsv2CM/CMDashboard';
                                    }
                                    else {
                                        window.location = '/Claims/Index';
                                    }
                            }
                            else {
                                alert('Claim Rejected Successfully');
                                //var ReceivedMode_P23_Id = MakeNullfromUndefinedorEmpty($('#hdnReceivedMode_P23').val());

                                //if (!$("#SkipAudit").prop("checked") && (_requesttype == 1 || _requesttype == 2) && data == JSON.stringify('Saved Successfully') && parseInt(ReceivedMode_P23_Id) == 405)
                                //    ClaimAudit_Insert(24, 'ddlAuditReasons', 'taAuditRemarks', 33, 1, !$("#SkipAudit").prop("checked"));
                                //else {
                                if ($("#hdnQMSAdmin").val() != '') {
                                    window.location = '/Qmsv2CMO/CMODashboard';
                                }
                                else
                                    if ($("#hdnQMS").val() != '') {
                                        window.location = '/Qmsv2CM/CMDashboard';
                                    }
                                    else {
                                        window.location = '/Claims/Index';
                                    }
                                //}
                            }
                        }

                    },
                    error: function (e, x) {
                        $("#progress1").hide();
                        ShowResultMessage('ErrorMessage', e.responseText);
                    }
                });

            }
            else
                alert('No rejections selected.');
        }

    } catch (e) {
        alert(e.message);
    }
}

function FindRejectedReasons() {
    var flag = true;

    var CRReasons = [];
    if ($('#hdnClaimRejectedReasons').val() != '') {
        CRReasons = $.parseJSON($('#hdnClaimRejectedReasons').val());
    }
    $.each(CRReasons, function (i, query) {
        var rID = query.RejectionReasonsID;
        if ($('#' + chkCRejected_ReasonID + rID).is(":checked") == true) {
            flag = false;
        }
    });

    var CORReasons = [];
    if ($('#hdnClaimOtherRejectedReasons').val() != '') {
        CORReasons = $.parseJSON($('#hdnClaimOtherRejectedReasons').val());
    }
    if (CORReasons.length > 0)
        flag = false;

    return flag;
}

/* Query Details */
var qpchkID = 'chkID_';
var qplblCategoryName = 'lblCategoryName_';
var qplblReason1 = 'lblReason1_';
var qplblReason2 = 'lblReason2_';
var qpTdReason = 'TdReason_';
var qpchkIsMandatory = 'chkIsMandatory_';
var qpchkIsDocReceived = 'chkIsDocReceived_';
var qptxtSendDate = 'txtSendDate_';
var qptxtReceivedDate = 'txtReceivedDate_';
var qptxtDisallowedAmount = 'txtDisallowedAmount_';
var qptxtFreeText1 = 'txtFreeText1_';
var qptxtFreeText2 = 'txtFreeText2_';
var qpDelete = 'qpDelete_';
var qpQDCode = 'QD_';
var qpQPSDCode = 'QPSD_';
var qpQPOCode = 'QPO_';

function AddDateTimePicker(ctrl) {
    $('#' + ctrl).datepicker({
        changeMonth: true,
        changeYear: true,
        minDate: -30,
        maxDate: "+0M +7D",
        dateFormat: 'dd-M-yy'
    });
}

function Get_QueryDetails(_ClaimID, _SlNo) {
    if ($('#tblQueryDocuments tbody').children().length == 0) {
        $.ajax({
            //type: "POST",
            url: "/MedicalScrutiny/Get_QueryDetails",
            contentType: 'application/json;charset=utf-8',
            //processData: false,
            data: { ClaimID: _ClaimID, SlNo: _SlNo },
            success: function (data) {
                CheckSessionVariable(data.responseText);
                data = $.parseJSON(data);

                if (data == null || data == "") {
                    //alert('Data not found.');
                }
                else {
                    FillQueryHiddenFields(data)

                    //$('#tblQueryDocuments tbody').html('');
                    //$('#tblQueryServiceDeductions tbody').html('');
                    //$('#tblQueryOthers tbody').html('');
                    QueryPendingDetails_Bind(data.Table, qpQDCode, 'tblQueryDocuments');
                    QueryPendingDetails_Bind(data.Table1, qpQPSDCode, 'tblQueryServiceDeductions');
                    QueryPendingDetails_Bind(data.Table2, qpQPOCode, 'tblQueryOthers');
                }
            },
            error: function (e, x) {
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });
    }
}

function FillQueryHiddenFields(data) {
    $('#hdnQueryPendingDocuments').val('');
    $('#hdnQueryPendingDedectons').val('');
    $('#hdnQueryPendingOthers').val('');

    /* Query Pending Documents*/
    var QDDetails = [];
    for (var i = 0; i < data.Table.length; i++) {
        var _qDetails = {};

        //if (data.Table[i].ID != "" && data.Table[i].ID != null) {
        _qDetails.ID = data.Table[i].ID;
        _qDetails.IRDocumentID = data.Table[i].IRID;
        _qDetails.FreeText1 = data.Table[i].FreeText1;
        _qDetails.FreeText2 = data.Table[i].FreeText2;
        //_qDetails.ServiceID = data.Table[i].ServiceID;
        _qDetails.ServiceID = 0;
        _qDetails.Remarks = data.Table[i].Remarks;
        _qDetails.isMandatory = data.Table[i].isMandatory;
        _qDetails.isReceived = data.Table[i].isReceived;
        _qDetails.Amount = data.Table[i].Amount;
        _qDetails.SentDate = data.Table[i].SentDate;
        _qDetails.ConsignmentNo = data.Table[i].ConsignmentNo;
        _qDetails.ReceivedDate = data.Table[i].ReceivedDate;

        QDDetails.push(_qDetails);
        //}
    }
    if (QDDetails.length > 0)
        $('#hdnQueryPendingDocuments').val(JSON.stringify(QDDetails));

    /* Query Pending Service Deductions*/
    var QPSDDetails = [];
    for (var i = 0; i < data.Table1.length; i++) {
        var _qsdDetails = {};

        //if (data.Table1[i].ID != "" && data.Table1[i].ID != null) {
        _qsdDetails.ID = data.Table1[i].ID;
        //_qsdDetails.IRDocumentID = data.Table1[i].IRID;
        _qsdDetails.IRDocumentID = 0;
        _qsdDetails.FreeText1 = data.Table1[i].FreeText1;
        _qsdDetails.FreeText2 = data.Table1[i].FreeText2;
        _qsdDetails.ServiceID = data.Table1[i].ServiceID;
        _qsdDetails.Remarks = data.Table1[i].Remarks;
        _qsdDetails.isMandatory = data.Table1[i].isMandatory;
        _qsdDetails.isReceived = data.Table1[i].isReceived;
        _qsdDetails.Amount = data.Table1[i].Amount;
        _qsdDetails.SentDate = data.Table1[i].SentDate;
        _qsdDetails.ConsignmentNo = data.Table1[i].ConsignmentNo;
        _qsdDetails.ReceivedDate = data.Table1[i].ReceivedDate;

        QPSDDetails.push(_qsdDetails);
        //}
    }
    if (QPSDDetails.length > 0)
        $('#hdnQueryPendingDedectons').val(JSON.stringify(QPSDDetails));

    /* Query Pending Others*/
    var QPODetails = [];
    for (var i = 0; i < data.Table2.length; i++) {
        var _qoDetails = {};

        //if (data.Table1[i].ID != "" && data.Table2[i].ID != null) {
        _qoDetails.ID = data.Table2[i].ID;
        //_qoDetails.IRDocumentID = data.Table2[i].IRID;
        _qoDetails.IRDocumentID = 0;
        _qoDetails.FreeText1 = data.Table2[i].FreeText1;
        _qoDetails.FreeText2 = data.Table2[i].FreeText2;
        //_qoDetails.ServiceID = data.Table2[i].ServiceID;
        _qoDetails.ServiceID = 0;
        _qoDetails.Remarks = data.Table2[i].Remarks;
        _qoDetails.isMandatory = data.Table2[i].isMandatory;
        _qoDetails.isReceived = data.Table2[i].isReceived;
        _qoDetails.Amount = data.Table2[i].Amount;
        _qoDetails.SentDate = data.Table2[i].SentDate;
        _qoDetails.ConsignmentNo = data.Table2[i].ConsignmentNo;
        _qoDetails.ReceivedDate = data.Table2[i].ReceivedDate;

        QPODetails.push(_qoDetails);
        //}
    }
    if (QPODetails.length > 0)
        $('#hdnQueryPendingOthers').val(JSON.stringify(QPODetails));
}

function QueryPendingDetails_Bind(data, ctrlCode, tableName) {
    for (var i = 0; i < data.length; i++) {
        var id = i + 1;
        var ctrlMapID = '';
        if (ctrlCode == qpQDCode)
            ctrlMapID = ctrlCode + data[i].IRID;
        else if (ctrlCode == qpQPSDCode)
            ctrlMapID = ctrlCode + data[i].ServiceID;
        if (ctrlCode == qpQPOCode)
            ctrlMapID = ctrlCode + id;

        var vDesign = QueryPending_RowDesign(ctrlMapID, data[i].Name);

        $('#' + tableName + ' tbody').append(vDesign);
        var reason = data[i].Name;

        if (data[i].ID != "" && data[i].ID != null) {
            $('#' + qpchkID + ctrlMapID).attr("checked", true);
            $('#' + qpchkIsMandatory + ctrlMapID).removeAttr("disabled", "disabled");
            $('#' + qpchkIsDocReceived + ctrlMapID).removeAttr("disabled", "disabled");
            $('#' + qptxtReceivedDate + ctrlMapID).removeAttr("disabled", "disabled");
            $('#' + qptxtDisallowedAmount + ctrlMapID).removeAttr("disabled", "disabled");

            if (reason.indexOf('|FT|') != -1) {
                $('#' + qptxtFreeText1 + ctrlMapID).removeAttr("disabled", "disabled");
            }
            if (reason.indexOf('|FT1|') != -1) {
                $('#' + qptxtFreeText2 + ctrlMapID).removeAttr("disabled", "disabled");
            }
        }

        $('#' + qplblCategoryName + ctrlMapID).text(data[i].CategoryName);
        ////$('#' + qplblReason + ctrlMapID).text(data[i].Name);
        ////$('#' + qpTdReason + ctrlMapID).text(data[i].Name);
        BindCheckBox(data[i].isMandatory, qpchkIsMandatory + ctrlMapID);
        BindCheckBox(data[i].isReceived, qpchkIsDocReceived + ctrlMapID);
        $('#' + qptxtSendDate + ctrlMapID).val(JSONDate2(data[i].SentDate));
        $('#' + qptxtReceivedDate + ctrlMapID).val(JSONDate2(data[i].ReceivedDate));
        $('#' + qptxtDisallowedAmount + ctrlMapID).val(data[i].Amount);
        if (reason.indexOf('|FT|') != -1) {
            $('#' + qptxtFreeText1 + ctrlMapID).val(data[i].FreeText1);
        }
        if (reason.indexOf('|FT1|') != -1) {
            $('#' + qptxtFreeText2 + ctrlMapID).val(data[i].FreeText2);
        }

        AddDateTimePicker(qptxtSendDate + ctrlMapID);
        AddDateTimePicker(qptxtReceivedDate + ctrlMapID);
    }

    /////* Query Pending Documents*/
    ////for (var i = 0; i < data.Table.length; i++) {

    ////    var vQDDesign = '<tr id="trQD_' + data.Table[i].IRID + '">'
    ////        + '<td><input type="checkbox" id="chkQD_' + data.Table[i].IRID + '" onclick="EnableorDisableQDControls(chkQD_' + data.Table[i].IRID
    ////        + ',chkQDisMandatory_' + data.Table[i].IRID + ',chkQDisDocReceived_' + data.Table[i].IRID + ',txtQDReceivedDate_' + data.Table[i].IRID + ',txtQDDisallowedAmount_' + data.Table[i].IRID + ')"><span class="lbl padding-8"></span></td>'
    ////+ '<td><label id="lblQDCategoryName_' + data.Table[i].IRID + '"></label></td>'
    ////+ '<td><label id="lblQDReason_' + data.Table[i].IRID + '"></label></td>'
    ////+ '<td><input type="checkbox" id="chkQDisMandatory_' + data.Table[i].IRID + '" disabled="disabled"><span class="lbl padding-8"></span></td>'
    ////+ '<td><input type="checkbox" id="chkQDisDocReceived_' + data.Table[i].IRID + '" disabled="disabled"><span class="lbl padding-8"></span></td>'
    ////+ '<td><input type="text" style="width:90px !important" disabled="disabled" id="txtQDSendDate_' + data.Table[i].IRID + '"></td><td><input type="text" disabled="disabled" style="width:90px !important" id="txtQDReceivedDate_' + data.Table[i].IRID + '"></td>'
    ////+ '<td><input type="text" style="width:90px !important" id="txtQDDisallowedAmount_' + data.Table[i].IRID + '" disabled="disabled" onkeypress="javascript: return onlydigits(event);"></td></tr>';

    ////    $('#tblQueryDocuments tbody').append(vQDDesign);

    ////    if (data.Table[i].ID != "" && data.Table[i].ID != null) {
    ////        $('#chkQD_' + data.Table[i].IRID).attr("checked", true);
    ////        $('#chkQDisMandatory_' + data.Table[i].IRID).removeAttr("disabled", "disabled");
    ////        $('#chkQDisDocReceived_' + data.Table[i].IRID).removeAttr("disabled", "disabled");
    ////        $('#txtQDReceivedDate_' + data.Table[i].IRID).removeAttr("disabled", "disabled");
    ////        $('#txtQDDisallowedAmount_' + data.Table[i].IRID).removeAttr("disabled", "disabled");
    ////    }
    ////    $('#lblQDCategoryName_' + data.Table[i].IRID).text(data.Table[i].CategoryName);
    ////    $('#lblQDReason_' + data.Table[i].IRID).text(data.Table[i].Name);
    ////    BindCheckBox(data.Table[i].isMandatory, 'chkQDisMandatory_' + data.Table[i].IRID);
    ////    BindCheckBox(data.Table[i].isReceived, 'chkQDisDocReceived_' + data.Table[i].IRID);
    ////    $('#txtQDSendDate_' + data.Table[i].IRID).val(data.Table[i].SentDate);
    ////    $('#txtQDReceivedDate_' + data.Table[i].IRID).val(data.Table[i].ReceivedDate);
    ////    $('#txtQDDisallowedAmount_' + data.Table[i].IRID).val(data.Table[i].Amount);

    ////    AddDateTimePicker('txtQDSendDate_' + data.Table[i].IRID);
    ////    AddDateTimePicker('txtQDReceivedDate_' + data.Table[i].IRID);
    ////}


}

function QueryPending_RowDesign(ctrlID, reason) {
    ////    var vQPDesign = '<tr id="tr' + ctrlID + '">'
    ////        + '<td><input type="checkbox" id="' + qpchkID + ctrlID + '" onclick="EnableorDisableQDControls(' + qpchkID + ctrlID
    ////        + ',' + qpchkIsMandatory + ctrlID + ',' + qpchkIsDocReceived + ctrlID + ',' + qptxtReceivedDate + ctrlID + ',' + qptxtDisallowedAmount + ctrlID + ')"><span class="lbl padding-8"></span></td>'
    ////+ '<td><label id="' + qplblCategoryName + ctrlID + '"></label></td>'
    ////+ '<td><label id="' + qplblReason1 + ctrlID + '"></label><input type="text" class="hide" style="width:90px !important" disabled="disabled" id="' + qptxtFreeText1 + ctrlID + '">'
    ////+ '<input type="text" style="width:90px !important" class="hide" disabled="disabled" id="' + qptxtFreeText2 + ctrlID + '"><label id="' + qplblReason2 + ctrlID + '"></label></td>'
    ////+ '<td><input type="checkbox" id="' + qpchkIsMandatory + ctrlID + '" disabled="disabled"><span class="lbl padding-8"></span></td>'
    ////+ '<td><input type="checkbox" id="' + qpchkIsDocReceived + ctrlID + '" disabled="disabled"><span class="lbl padding-8"></span></td>'
    ////+ '<td><input type="text" style="width:90px !important" disabled="disabled" id="' + qptxtSendDate + ctrlID + '"></td>'
    ////+ '<td><input type="text" disabled="disabled" style="width:90px !important" id="' + qptxtReceivedDate + ctrlID + '"></td>'
    ////+ '<td><input type="text" style="width:90px !important" id="' + qptxtDisallowedAmount + ctrlID + '" disabled="disabled" onkeypress="javascript: return onlydigits(event);"></td></tr>';

    var ft1 = '<input type="text" style="width:90px !important" disabled="disabled" id="' + qptxtFreeText1 + ctrlID + '">';
    var ft2 = '<input type="text" style="width:90px !important" disabled="disabled" id="' + qptxtFreeText2 + ctrlID + '">';
    ////var vDelete = '<a id="' + qpDelete + ctrlID + '" onclick="Delete_QPOtherDetails(' + ctrlID + ')" class="glyphicon glyphicon-trash" title="Delete" style="color:#d15b47;font-size: 1.5em;"></a>'

    var replaceFT = 0;
    var replaceFT1 = 0;
    if (reason.indexOf('|FT|') != -1) {
        reason = reason.replace('|FT|', ft1);
        replaceFT = 1;
    }
    if (reason.indexOf('|FT1|') != -1) {
        reason = reason.replace('|FT1|', ft2);
        replaceFT1 = 1
    }
    var vQPDesign = '';
    if (IsCRMRole()) {
        vQPDesign = '<tr id="tr' + ctrlID + '">'
            + '<td><input type="checkbox" disabled="disabled" id="' + qpchkID + ctrlID + '" onclick="EnableorDisableQDControls(' + replaceFT + ',' + replaceFT1 + ',\'' + ctrlID + '\')"><span class="lbl padding-8"></span></td>'
            + '<td><label id="' + qplblCategoryName + ctrlID + '"></label></td>'
            + '<td id="' + qpTdReason + ctrlID + '">' + reason + '</td>'
            + '<td><input type="checkbox"  id="' + qpchkIsMandatory + ctrlID + '" disabled="disabled"><span class="lbl padding-8"></span></td>'
            + '<td><input type="checkbox" id="' + qpchkIsDocReceived + ctrlID + '" disabled="disabled"><span class="lbl padding-8"></span></td>'
            + '<td><input type="text" style="width:90px !important" disabled="disabled" id="' + qptxtSendDate + ctrlID + '"></td>'
            + '<td><input type="text" disabled="disabled" style="width:90px !important" id="' + qptxtReceivedDate + ctrlID + '"></td>'
            + '<td><input type="text" style="width:90px !important" id="' + qptxtDisallowedAmount + ctrlID + '" disabled="disabled" onkeypress="javascript: return onlydigits(event);"></td></tr>';

    } else {
        vQPDesign = '<tr id="tr' + ctrlID + '">'
            + '<td><input type="checkbox" id="' + qpchkID + ctrlID + '" onclick="EnableorDisableQDControls(' + replaceFT + ',' + replaceFT1 + ',\'' + ctrlID + '\')"><span class="lbl padding-8"></span></td>'
            + '<td><label id="' + qplblCategoryName + ctrlID + '"></label></td>'
            + '<td id="' + qpTdReason + ctrlID + '">' + reason + '</td>'
            + '<td><input type="checkbox" id="' + qpchkIsMandatory + ctrlID + '" disabled="disabled"><span class="lbl padding-8"></span></td>'
            + '<td><input type="checkbox" id="' + qpchkIsDocReceived + ctrlID + '" disabled="disabled"><span class="lbl padding-8"></span></td>'
            + '<td><input type="text" style="width:90px !important" disabled="disabled" id="' + qptxtSendDate + ctrlID + '"></td>'
            + '<td><input type="text" disabled="disabled" style="width:90px !important" id="' + qptxtReceivedDate + ctrlID + '"></td>'
            + '<td><input type="text" style="width:90px !important" id="' + qptxtDisallowedAmount + ctrlID + '" disabled="disabled" onkeypress="javascript: return onlydigits(event);"></td></tr>';
    }
    return vQPDesign;
}

//function EnableorDisableQDControls(chkCtrl, isMandatory, isDocReceived, ReceivedDate, DisallowedAmount, ft, ft1, ctrlID) {
function EnableorDisableQDControls(ft, ft1, ctrlID) {

    if ($('#' + qpchkID + ctrlID).is(":checked") == true) {
        $('#' + qpchkIsMandatory + ctrlID).removeAttr("disabled");
        $('#' + qpchkIsDocReceived + ctrlID).removeAttr("disabled");
        $('#' + qptxtReceivedDate + ctrlID).removeAttr("disabled");
        $('#' + qptxtDisallowedAmount + ctrlID).removeAttr("disabled");
        if (ft == 1) {
            $('#' + qptxtFreeText1 + ctrlID).removeAttr("disabled");
        }
        if (ft1 == 1) {
            $('#' + qptxtFreeText2 + ctrlID).removeAttr("disabled");
        }
    }
    else {
        $('#' + qpchkIsMandatory + ctrlID).attr("disabled", "disabled");
        $('#' + qpchkIsDocReceived + ctrlID).attr("disabled", "disabled");
        $('#' + qptxtReceivedDate + ctrlID).attr("disabled", "disabled");
        $('#' + qptxtDisallowedAmount + ctrlID).attr("disabled", "disabled");

        if (ft == 1) {
            $('#' + qptxtFreeText1 + ctrlID).attr("disabled", "disabled");
            $('#' + qptxtFreeText1 + ctrlID).val('');
        }
        if (ft1 == 1) {
            $('#' + qptxtFreeText2 + ctrlID).attr("disabled", "disabled");
            $('#' + qptxtFreeText2 + ctrlID).val('');
        }

        $('#' + qpchkIsMandatory + ctrlID).removeAttr("checked", "checked");
        $('#' + qpchkIsDocReceived + ctrlID).removeAttr("checked", "checked");
        $('#' + qptxtReceivedDate + ctrlID).val('');
        $('#' + qptxtDisallowedAmount + ctrlID).val('');
    }

    //var chkID = chkCtrl.id;
    //var chkisMandatory = isMandatory.id;
    //var chkisDocReceived = isDocReceived.id;
    //var txtReceivedDate = ReceivedDate.id;
    //var txtDisallowedAmount = DisallowedAmount.id;

    //if ($('#' + chkID).is(":checked") == true) {
    //    $('#' + chkisMandatory).removeAttr("disabled");
    //    $('#' + chkisDocReceived).removeAttr("disabled");
    //    $('#' + txtReceivedDate).removeAttr("disabled");
    //    $('#' + txtDisallowedAmount).removeAttr("disabled");   
    //}
    //else {
    //    $('#' + chkisMandatory).attr("disabled", "disabled");
    //    $('#' + chkisDocReceived).attr("disabled", "disabled");
    //    $('#' + txtReceivedDate).attr("disabled", "disabled");
    //    $('#' + txtDisallowedAmount).attr("disabled", "disabled");

    //    $('#' + chkisMandatory).removeAttr("checked", "checked");
    //    $('#' + chkisDocReceived).removeAttr("checked", "checked");
    //    $('#' + txtReceivedDate).val('');
    //    $('#' + txtDisallowedAmount).val('');
    //}

}

function AddQPOtherDocs() {

    if (MakeNullfromUndefinedorEmpty($('#txtQPO_Reason').val()) == null || MakeNullfromUndefinedorEmpty($('#txtQPO_DisallowedAmount').val()) == null) {
        alert('Please enter reason or disallowed amount');
    }
    else {
        var _qpOthersSlNo = $('#tblQueryOthers tbody tr').length + 1;
        var ctrlMapID = qpQPOCode + _qpOthersSlNo;

        var design = QueryPending_RowDesign(ctrlMapID, $('#txtQPO_Reason').val());
        $('#tblQueryOthers tbody').append(design);

        $('#' + qpchkID + ctrlMapID).attr("checked", "checked");
        $('#' + qplblCategoryName + ctrlMapID).text('');
        $('#' + qpTdReason + ctrlMapID).text($('#txtQPO_Reason').val());
        if ($('#chkQPO_IsMandatory').is(":checked") == true)
            $('#' + qpchkIsMandatory + ctrlMapID).attr("checked", "checked");
        if ($('#chkQPO_IsDocReceived').is(":checked") == true)
            $('#' + qpchkIsDocReceived + ctrlMapID).attr("checked", "checked");
        $('#' + qptxtSendDate + ctrlMapID).val('');
        $('#' + qptxtReceivedDate + ctrlMapID).val('');
        $('#' + qptxtDisallowedAmount + ctrlMapID).val($('#txtQPO_DisallowedAmount').val());

        // Bind values to Hidden field
        var QPODetails = [];
        var _qoDetails = {};
        if ($('#hdnQueryPendingOthers').val() != '') {
            QPODetails = $.parseJSON($('#hdnQueryPendingOthers').val());
        }

        _qoDetails.ID = null;
        _qoDetails.IRDocumentID = 0;
        _qoDetails.FreeText1 = null;
        _qoDetails.FreeText2 = null;
        _qoDetails.ServiceID = 0;
        _qoDetails.Remarks = $('#txtQPO_Reason').val();
        if ($('#chkQPO_IsMandatory').is(":checked") == true)
            _qoDetails.isMandatory = 1;
        else
            _qoDetails.isMandatory = 0;

        if ($('#chkQPO_IsDocReceived').is(":checked") == true)
            _qoDetails.isReceived = 1;
        else
            _qoDetails.isReceived = 0;
        _qoDetails.Amount = $('#txtQPO_DisallowedAmount').val();
        _qoDetails.SentDate = null;
        _qoDetails.ConsignmentNo = null;
        _qoDetails.ReceivedDate = null;

        QPODetails.push(_qoDetails);

        if (QPODetails.length > 0)
            $('#hdnQueryPendingOthers').val(JSON.stringify(QPODetails));

        // Enable controls
        $('#' + qpchkIsMandatory + ctrlMapID).removeAttr("disabled", "disabled");
        $('#' + qpchkIsDocReceived + ctrlMapID).removeAttr("disabled", "disabled");
        $('#' + qptxtReceivedDate + ctrlMapID).removeAttr("disabled", "disabled");
        $('#' + qptxtDisallowedAmount + ctrlMapID).removeAttr("disabled", "disabled");

        // Clear controls
        $('#txtQPO_Reason').val('');
        $('#chkQPO_IsMandatory').removeAttr("checked", "checked");
        $('#chkQPO_IsDocReceived').removeAttr("checked", "checked");
        $('#txtQPO_DisallowedAmount').val('');

        AddDateTimePicker(qptxtReceivedDate + ctrlMapID);
    }
}

var SaveQueryData = false;

function Save_QueryPendingDetails() {
    if (CheckIsValidProvider()) {
        var _ClaimID = $('#hdnClaimID').val();
        var _SlNo = $('#hdnClaimSlNo').val();
        var _ClaimTypeID = MakeZerofromUndefinedorEmpty($('#hdnClaimTypeID').val());
        var _RequestTypeID = MakeZerofromUndefinedorEmpty($('#ddlRequestType').val());
        var _ServiceTypeID = MakeZerofromUndefinedorEmpty($('#ddlServiceType').val());
        var _ServiceSubTypeID = MakeZerofromUndefinedorEmpty($('#ddlServiceSubType').val());
        var _ClaimedAmount = MakeZerofromUndefinedorEmpty($('#txtClaimedAmount').val());
        var _SITypeID = MakeZerofromUndefinedorEmpty($("#hdnSITypeID").val());
        var MainMemberPolicyID = MakeZerofromUndefinedorEmpty($('#hdnMemberPolicyID').val());
        var PolicyID = MakeZerofromUndefinedorEmpty($('#hdnPolicyID').val());
        var ProviderID = MakeZerofromUndefinedorEmpty($('#hdnProviderID').val());
        var BrokerID = MakeZerofromUndefinedorEmpty($('#hdnBrokerID').val());
        var PayerID = MakeZerofromUndefinedorEmpty($('#hdnPayerID').val());
        var CorporateID = MakeZerofromUndefinedorEmpty($('#hdnCorporateID').val());
        var InsuranceCompanyID = MakeZerofromUndefinedorEmpty($('#hdnInsuranceCompanyID').val());

        try {
            var IRDetails = [];

            var QPDetails = [];
            if ($('#hdnQueryPendingDocuments').val() != '') {
                QPDetails = $.parseJSON($('#hdnQueryPendingDocuments').val());
            }
            $.each(QPDetails, function (i, query) {
                var ctrlID = qpQDCode + query.IRDocumentID;
                var reason = $('#' + qpTdReason + ctrlID).html();
                if ($('#' + qpchkID + ctrlID).is(":checked") == true) {
                    var _qDetails = {};
                    ////QPDetails.splice(i, 1);

                    _qDetails.ID = query.ID;
                    _qDetails.IRDocumentID = query.IRDocumentID;
                    if (reason.indexOf('FreeText1') != -1)
                        _qDetails.FreeText1 = $('#' + qptxtFreeText1 + ctrlID).val();
                    else
                        _qDetails.FreeText1 = null;

                    if (reason.indexOf('FreeText2') != -1)
                        _qDetails.FreeText2 = $('#' + qptxtFreeText2 + ctrlID).val();
                    else
                        _qDetails.FreeText2 = null;

                    _qDetails.ServiceID = query.ServiceID;
                    _qDetails.Remarks = query.Remarks;
                    if ($('#' + qpchkIsMandatory + ctrlID).is(":checked") == true)
                        _qDetails.isMandatory = 1;
                    else
                        _qDetails.isMandatory = 0;
                    if ($('#' + qpchkIsDocReceived + ctrlID).is(":checked") == true)
                        _qDetails.isReceived = 1;
                    else
                        _qDetails.isReceived = 0;
                    _qDetails.Amount = $('#' + qptxtDisallowedAmount + ctrlID).val();
                    _qDetails.SentDate = query.SentDate;
                    _qDetails.ConsignmentNo = query.ConsignmentNo;
                    if ($('#' + qptxtReceivedDate + ctrlID).val() == '')
                        _qDetails.ReceivedDate = null;
                    else
                        _qDetails.ReceivedDate = $('#' + qptxtReceivedDate + ctrlID).val();

                    IRDetails.push(_qDetails);
                }
            });

            /* Query Pending Service Deductions*/
            var QPSDDetails = [];
            if ($('#hdnQueryPendingDedectons').val() != '') {
                QPSDDetails = $.parseJSON($('#hdnQueryPendingDedectons').val());
            }
            $.each(QPSDDetails, function (i, query) {
                var ctrlID = qpQPSDCode + query.ServiceID;
                var reason = $('#' + qpTdReason + ctrlID).html();

                if ($('#' + qpchkID + ctrlID).is(":checked") == true) {

                    var _qsdDetails = {};
                    ////QPSDDetails.splice(i, 1);

                    _qsdDetails.ID = query.ID;
                    _qsdDetails.IRDocumentID = 0;
                    if (reason.indexOf('FreeText1') != -1)
                        _qsdDetails.FreeText1 = $('#' + qptxtFreeText1 + ctrlID).val();
                    else
                        _qsdDetails.FreeText1 = null;

                    if (reason.indexOf('FreeText2') != -1)
                        _qsdDetails.FreeText2 = $('#' + qptxtFreeText2 + ctrlID).val();
                    else
                        _qsdDetails.FreeText2 = null;

                    _qsdDetails.ServiceID = query.ServiceID;
                    _qsdDetails.Remarks = query.Remarks;

                    if ($('#' + qpchkIsMandatory + ctrlID).is(":checked") == true)
                        _qsdDetails.isMandatory = 1;
                    else
                        _qsdDetails.isMandatory = 0;
                    if ($('#' + qpchkIsDocReceived + ctrlID).is(":checked") == true)
                        _qsdDetails.isReceived = 1;
                    else
                        _qsdDetails.isReceived = 0;
                    _qsdDetails.Amount = $('#' + qptxtDisallowedAmount + ctrlID).val();
                    _qsdDetails.SentDate = query.SentDate;
                    _qsdDetails.ConsignmentNo = query.ConsignmentNo;

                    if ($('#' + qptxtReceivedDate + ctrlID).val() == '')
                        _qsdDetails.ReceivedDate = null;
                    else
                        _qsdDetails.ReceivedDate = $('#' + qptxtReceivedDate + ctrlID).val();

                    IRDetails.push(_qsdDetails);
                }
            });

            /* Query Pending Others*/
            var QPODetails = [];
            if ($('#hdnQueryPendingOthers').val() != '') {
                QPODetails = $.parseJSON($('#hdnQueryPendingOthers').val());
            }
            $.each(QPODetails, function (i, query) {

                var id = i + 1;
                var ctrlID = qpQPOCode + id;
                if ($('#' + qpchkID + ctrlID).is(":checked") == true) {
                    var _qoDetails = {};

                    _qoDetails.ID = query.ID;
                    _qoDetails.IRDocumentID = 0;
                    _qoDetails.FreeText1 = query.FreeText1;
                    _qoDetails.FreeText2 = query.FreeText2;
                    _qoDetails.ServiceID = 0;
                    _qoDetails.Remarks = query.Remarks;

                    if ($('#' + qpchkIsMandatory + ctrlID).is(":checked") == true)
                        _qoDetails.isMandatory = 1;
                    else
                        _qoDetails.isMandatory = 0;
                    if ($('#' + qpchkIsDocReceived + ctrlID).is(":checked") == true)
                        _qoDetails.isReceived = 1;
                    else
                        _qoDetails.isReceived = 0;

                    _qoDetails.Amount = $('#' + qptxtDisallowedAmount + ctrlID).val();
                    _qoDetails.SentDate = query.SentDate;
                    _qoDetails.ConsignmentNo = query.ConsignmentNo;

                    if ($('#' + qptxtReceivedDate + ctrlID).val() == '')
                        _qoDetails.ReceivedDate = null;
                    else
                        _qoDetails.ReceivedDate = $('#' + qptxtReceivedDate + ctrlID).val();

                    IRDetails.push(_qoDetails);
                }
            });

            // Save Details
            if (IRDetails.length > 0) {
                var flagMandatory = false;
                $.each(IRDetails, function (i, query) {
                    if (query.isMandatory == 1) {
                        flagMandatory = true;
                        return false;
                    }
                });

                if (SaveQueryData == false) {


                    if (flagMandatory == true) {
                        $.ajax({
                            url: '/MedicalScrutiny/Save_QueryPendingDetails',
                            type: 'POST',
                            data: {
                                ClaimID: _ClaimID,
                                SlNo: _SlNo,
                                ClaimsIRReasons: JSON.stringify(IRDetails), // stays string
                                ClaimTypeID: _ClaimTypeID,
                                RequestTypeID: _RequestTypeID,
                                ServiceTypeID: _ServiceTypeID,
                                ServiceSubTypeID: _ServiceSubTypeID,
                                ClaimedAmount: _ClaimedAmount,
                                SITypeID: _SITypeID,
                                MainMemberPolicyID: MainMemberPolicyID,
                                PolicyID: PolicyID,
                                ProviderID: ProviderID,
                                BrokerID: BrokerID,
                                PayerID: PayerID,
                                CorporateID: CorporateID,
                                InsuranceCompanyID: InsuranceCompanyID,
                                PolicyType: $('#hdnPolicyTypeID').val(),
                                ClaimCurrentStageID: $('#hdnClaimStageID').val(),
                                AgentID: $('#hdnAgentID').val(),
                                QMSID: $("#hdnQMS").val(),
                                QMSAdminID: $("#hdnQMS").val()
                            },
                            success: function (data) {
                                QueryPending_Response({ responseText: data });
                                isQuery_Responsed = 1;
                            },
                            error: function () {
                                $("#progress1").hide();
                                alert('Error occurred while saving IR details');
                            }
                        });
                        SaveQueryData = true;

                    }
                }
                else if (SaveQueryData == true)
                    alert('Alerady Sunbmited to the IR Data /Please  Selected Close  Option.');

                else
                    alert('No mandatory deductions selected.');
            }
            else
                alert('No deductions selected.');

        } catch (e) {
            $("#progress1").hide();
            alert(e.message);
        }
    }
    else {
        //alert("Query Process is not possible for the " + providerstatus + " Provider.");
        alert("Warning! You are performing an action against " + providerstatus + " hospital. Only rejection is possible.");
    }
}

function QueryPending_Response(data) {
    try {
        $("#progress1").hide();
        CheckSessionVariable(data.responseText);

        if (data.responseText != '') {
            //DialogResultMessage(data.responseText);
            ShowResultMessage('divQueryPendingMessage', data.responseText);
        }
        else {
            ShowResultMessage('divQueryPendingMessage', 'IR Details updated Successfully');
            //alert('IR Details updated Successfully');
            //window.location = '/Claims/Index';
        }
    } catch (e) {
        $("#progress1").hide();
        alert('Error Occured');
    }
}

function chkQP_MandatoryRecords() {
    var IRDetails = [];

    var QPDetails = [];
    if ($('#hdnQueryPendingDocuments').val() != '') {
        QPDetails = $.parseJSON($('#hdnQueryPendingDocuments').val());
    }
    $.each(QPDetails, function (i, query) {
        var ctrlID = qpQDCode + query.IRDocumentID;
        if ($('#' + qpchkID + ctrlID).is(":checked") == true) {
            var _qDetails = {};

            if ($('#' + qpchkIsMandatory + ctrlID).is(":checked") == true)
                _qDetails.isMandatory = 1;
            else
                _qDetails.isMandatory = 0;
            if ($('#' + qpchkIsDocReceived + ctrlID).is(":checked") == true)
                _qDetails.isReceived = 1;
            else
                _qDetails.isReceived = 0;

            IRDetails.push(_qDetails);
        }
    });

    /* Query Pending Service Deductions*/
    var QPSDDetails = [];
    if ($('#hdnQueryPendingDedectons').val() != '') {
        QPSDDetails = $.parseJSON($('#hdnQueryPendingDedectons').val());
    }
    $.each(QPSDDetails, function (i, query) {
        var ctrlID = qpQPSDCode + query.ServiceID;
        if ($('#' + qpchkID + ctrlID).is(":checked") == true) {

            var _qsdDetails = {};

            if ($('#' + qpchkIsMandatory + ctrlID).is(":checked") == true)
                _qsdDetails.isMandatory = 1;
            else
                _qsdDetails.isMandatory = 0;
            if ($('#' + qpchkIsDocReceived + ctrlID).is(":checked") == true)
                _qsdDetails.isReceived = 1;
            else
                _qsdDetails.isReceived = 0;
            IRDetails.push(_qsdDetails);
        }
    });

    /* Query Pending Others*/
    var QPODetails = [];
    if ($('#hdnQueryPendingOthers').val() != '') {
        QPODetails = $.parseJSON($('#hdnQueryPendingOthers').val());
    }
    $.each(QPODetails, function (i, query) {
        var id = i + 1;
        var ctrlID = qpQPOCode + id;
        if ($('#' + qpchkID + ctrlID).is(":checked") == true) {
            var _qoDetails = {};

            if ($('#' + qpchkIsMandatory + ctrlID).is(":checked") == true)
                _qoDetails.isMandatory = 1;
            else
                _qoDetails.isMandatory = 0;
            if ($('#' + qpchkIsDocReceived + ctrlID).is(":checked") == true)
                _qoDetails.isReceived = 1;
            else
                _qoDetails.isReceived = 0;

            IRDetails.push(_qoDetails);
        }
    });

    // Save Details
    var flagMandatory = false;
    if (IRDetails.length > 0) {

        $.each(IRDetails, function (i, query) {
            if (query.isMandatory == 1 && query.isReceived == 0) {
                flagMandatory = true;
                return false;
            }
        });
    }

    return flagMandatory;
}

/* End Nagaraju Code */


/* Start Allu Srinu Claims Coding */

// AddDateTimePicker('txtSurgeryDate');

function RemoveBillingTypeValues() {
    var txtTotalServicesEligibleAmount =$("#txtTotalServicesEligibleAmount").val();
    if ([1, 2, 3, 4].includes(parseInt($('#hdnRequestTypeID').val()))) {
        $('#divPackageType').css('display', 'block');
    }

    if (isproportionatechanged == true) {
        DialogWarningMessage("As you override proportionate, first save bill details and then approve");
        return false;
    }
    AccomdationDays.Roomdays = ($("#txtRoomDays").val());
    AccomdationDays.ICUdays = ($("#txtICUDays").val());
    AccomdationDays.ExtimatedDays = ($("#txtExtimatedDays").val());
    AccomdationDaysTotal.push(AccomdationDays);
    $('#hdnAccomdationRoomdays').val(JSON.stringify(AccomdationDaysTotal));
    var _billAmount = MakeZerofromUndefinedorEmpty($('#txtTotalServicesBillAmount').val());
    var _packageAmount = MakeZerofromUndefinedorEmpty($('#txtbillingtotalpackageamount').val());
    var _disAllowedAmount = MakeZerofromUndefinedorEmpty($('#txtTotalServicesDeductionAmount').val());
    var _discountAmount = MakeZerofromUndefinedorEmpty($('#hdnTotalServiceDiscounts').val());

    $("#ddlBillingType option:gt(0)").remove();
    BindDropdown(MasterData.claimsBillingType, "ddlBillingType");

    var procdureDetails = [];
    if ($('#hdnClaimsCodingDetails').val() != '') {
        procdureDetails = $.parseJSON($('#hdnClaimsCodingDetails').val());
    }

    if (parseInt(_billAmount) == 0 && parseInt(_packageAmount) == 0) {
        DialogResultMessage('Bill amount or package amount mandatory for coding.');
    }
    else if (parseInt(_packageAmount) != 0 && parseInt(_billAmount) != 0) {
        $("#ddlBillingType option[value='201']").remove();
        $("#ddlBillingType option[value='202']").remove();
        //$('#txtCodingBillAmount').val(parseInt(_packageAmount) + parseInt(_billAmount));
        $('#txtCodingBillAmount').val(parseInt(_packageAmount));

        //$('#txtDiscount').val(0);
        //if (procdureDetails.length == 0)
        //    $('#txtDiscount').val(_discountAmount);
        // $('#txtDisallowedAmount').val(_disAllowedAmount);
    }
    else if (parseInt(_packageAmount) == 0) {
        $("#ddlBillingType option[value='201']").remove();
        $("#ddlBillingType option[value='203']").remove();
        $('#txtCodingBillAmount').val(parseInt(_billAmount));
        ////$('#txtCodingBillAmount').val(parseInt(MakeZerofromUndefinedorEmpty($("#txtTotalServicesEligibleAmount").val())));
        //$('#txtDisallowedAmount').val(_disAllowedAmount);
        //if (procdureDetails.length == 0)
        //    $('#txtDiscount').val(_discountAmount);
    }
    else if (parseInt(_billAmount) == 0) {
        $("#ddlBillingType option[value='202']").remove();
        $("#ddlBillingType option[value='203']").remove();
        $('#txtCodingBillAmount').val(parseInt(_packageAmount));
        //$('#txtDiscount').val(0);
    }

    //***************** For Task (SP-1103)
    DisableCodingElements();
    Get_ServiceBillingDetails($("#hdnClaimID").val(), $('#hdnClaimSlNo').val(), 0) //added by Bhagyaraj #Getting Billing details for SP-1250

    //add message for SP3V-2914
    if ($("#hdnWarnTreatmentNature").val() == "true" && $('#hdnClaimStageID').val() == 5) {
        $("#hdnWarnTreatmentNature").val("false");
        DialogWarningMessage("Recheck / Correct Nature of Treatment details .");
    }
    setTimeout(function () {
        $("#txtTotalServicesEligibleAmount").val(txtTotalServicesEligibleAmount);
    }, 6000);
   
}

function LoadTPAProcedures(ParentId, Control) {
    var TPAProcedures = $.parseJSON(MasterData.mTPAProcedurecs);
    var TreatmentType = $('#ddlTreatmentType option:selected').val();
    LoadDropDown(ParentId, Control, TPAProcedures, TreatmentType);
}
//sp3v-2901 provision for Rejection category
function LoadSubCategory(ParentId, Control, resetDropdowns = false) {
    var data = $.parseJSON(MasterData.mRejectionSubCategory);
    var parentId = $('#ddlRejCategory option:selected').val();

    var data1 = $.parseJSON(MasterData.mInsurer_Rejections_Master_Subcategory).filter(function (item) {
        return (item.Insurerid.toString() === $('#hdnInsuranceCompanyID').val());
    });
    if (data1.length > 0) {
        data = data1;
    }

    if (resetDropdowns) {
        $('#ddlInsurerRejection').val('');
        $('#ddlInsurerRejectionCode').val('');
        $('#ddlInsurerCustomRemarks').val('');
        $('#ddlInsurerProductDescription').val('');
        $('#ddlInsurerProductCode').val('');
        $('#txtClaimOtherIRRejectionReason1').val('');
    }
    BindSubCateDropDown(Control, data, parentId);
}

function LoadInsurerProductDescription(ParentId, Control, resetDropdowns = false) {
    var data = $.parseJSON(MasterData.mRejectionSubCategory);
    var parentId = $('#ddlRejCategory option:selected').val();

    var data1 = $.parseJSON(MasterData.mInsurer_Rejections_Master_Subcategory).filter(function (item) {
        return (item.Insurerid.toString() === $('#hdnInsuranceCompanyID').val());
    });
    if (data1.length > 0) {
        data = data1;
    }

    if (resetDropdowns) {
        $('#ddlInsurerRejection').val('');
        $('#ddlInsurerRejectionCode').val('');
    }
    BindSubCateDropDown(Control, data, parentId);
}


function BindSubCateDropDown(Control, Data, ParentId) {
    $(Control + " :gt(0)").remove();
    var isDataNotExist = true;
    $.each(Data, function (i, item) {
        if (item.ParentID == ParentId) {
            isDataNotExist = false;
            var optionhtml = '<option value="' + Data[i].ID + '">' + Data[i].Name + '</option>';
            if (Data[i].Name == '-') {
                optionhtml = '<option value="' + Data[i].ID + '">N/A</option>';
                //LoadInsurerRejection(Data[i].ID);
            }
            $(Control).append(optionhtml);
        }
    });

    if (ParentId > 0 && isDataNotExist) {
        $(Control).append('<option value="0">N/A</option>');
        //LoadInsurerRejection(0);
        $('#ddlInsurerRejection').val('');
        $('#ddlInsurerRejectionCode').val('');
        $('#ddlInsurerProductCode').val('');
        $('#ddlInsurerProductDescription').val('');
    }
    else if (ParentId == 0) {
        $('#ddlInsurerRejection').val('');
        $('#ddlInsurerRejectionCode').val('');
        $('#ddlInsurerProductCode').val('');
        $('#ddlInsurerProductDescription').val('');
    }
}

function GetICDValues(evnt, ddlControl) {
    var ParentId = evnt;//.value;
    //sp3v-4520  icdcode begin
    var idsLevelValue = ddlControl.toString().substring(ddlControl.toString().length, ddlControl.toString().length - 1);
    for (var i = parseInt(idsLevelValue) + 1; i < 8; i++) {
        var dynamicIDs = "#ddlICDLevel" + i.toString();
        $(dynamicIDs + ' :gt(0)').remove();
    }
    //sp3v-4520  icdcode end
    if (ParentId != null && ParentId != "") {
        $.ajax({
            type: 'GET',
            url: "/MedicalScrutiny/GetICDInfoBasedOnParentID",
            data: { ICDParentId: ParentId },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (resData) {
                var objICDData = JSON.parse(resData);
                if (objICDData[0].Result) {
                    var resIcd = objICDData[0].ICDInfo;
                    $(ddlControl + " :gt(0)").remove();
                    $.each(resIcd, function (i, item) {
                        if (item.ParentID == ParentId) {
                            var htmlICD = '<option value="' + resIcd[i].ID + '">' + resIcd[i].DiseaseCode + '  --  ' + resIcd[i].Name + '</option>';
                            $(ddlControl).append(htmlICD);
                        }
                    });
                }
                else if (!objICDData[0].Result && objICDData[0].ResponseText == "ErrorCode#1") {
                    CheckSessionVariable(objICDData[0].ResponseText);
                }
                else {
                    DialogWarningMessage(objICDData[0].ResponseText);
                }
            },
            error: function (err, xhr) {
                console.log(err.statusText);
                DialogWarningMessage("Error while Getting ICD.");
            }
        });
    }
    //sp3v-4520  icdcode begin
    else {
        var dynamicIDs = "#ddlICDLevel" + (parseInt(idsLevelValue)).toString();
        $(dynamicIDs + ' :gt(0)').remove();
    }
    //sp3v-4520  icdcode end
}

var arry = {};
function LoadICD10(ParentId, Control) {
    ////debugger
    var Data = $.parseJSON(MasterData.ICD10);
    $(Control + " :gt(0)").remove();
    $.each(Data, function (i, item) {
        if (item.ParentID == ParentId) {
            //if (Control == '#ddlICDLevel3') {
            //    arry[item.ID] = item.DiseaseCode;
            //}
            var optionhtml = '<option value="' + Data[i].ID + '">' + Data[i].DiseaseCode + '  --  ' + Data[i].Name + '</option>';
            $(Control).append(optionhtml);
        }
    });
    //LoadDropDown(ParentId, Control, ICD10)
}

function LoadDropDown(ParentId, Control, Data, TreatmentType) {
    //console.log(Data);
    $(Control + " :gt(0)").remove();
    $.each(Data, function (i, item) {
        if (item.ParentID == ParentId && item.TreatmentType_P19 == TreatmentType) {
            var optionhtml = '<option value="' + Data[i].ID + '">' + Data[i].Name + '</option>';
            $(Control).append(optionhtml);
        }
    });
}

//function GetICD10DeseaseCode(icdCode) {
//    var Data = $.parseJSON(MasterData.ICD10);
//    var code;
//    $.each(Data, function (i, item) {
//        if (item.ID == icdCode) {
//            code = item.DiseaseCode;
//        }
//    });
//    return code;
//}

//function GetICD10Description(icdCode) {
//    var Data = $.parseJSON(MasterData.ICD10);
//    var ICDDescription;
//    $.each(Data, function (i, item) {
//        if (item.ID == icdCode) {
//            ICDDescription = item.Name;
//        }
//    });
//    return ICDDescription;
//}


$('#ddlProcedureLevel1').on("change", function () {
    var ID = $('#ddlProcedureLevel1').val();
    if (ID == 401) {
        if ($('#hdnGender').val() == 1 && basicData[0].ServiceSubTypeID != 116 && basicData[0].ServiceSubTypeID != 128) {
            DialogWarningMessage("The Selected procedure is valid for only Female");
            $('#ddlProcedureLevel1').val('0')
            return false;
        }
    }
    if (ID != 0)
        LoadTPAProcedures(ID, '#ddlProcedureLevel2');

    if (parseInt(ID) == 164) {
        $('#ddlPriority').attr("disabled", "disabled");
        $('#ddlPriority').val(100);

        $('#ddlTreatmentType').attr("disabled", "disabled");
        $('#ddlTreatmentType').val(65);

        $('#ddlAnesthesia').attr("disabled", "disabled");

        $('#txtSurgeryDate').attr("disabled", "disabled");
    }
    else {
        $('#ddlPriority').removeAttr("disabled", "disabled");
        $('#ddlPriority').val(0);

        // $('#ddlTreatmentType').removeAttr("disabled", "disabled");
        //$('#ddlTreatmentType').val(0);

        $('#ddlAnesthesia').removeAttr("disabled", "disabled");

        $('#txtSurgeryDate').removeAttr("disabled", "disabled");
    }

});

$('#ddlProcedureLevel2').on("change", function () {
    var ID = $('#ddlProcedureLevel2').val();
    if (ID != 0)
        LoadTPAProcedures(ID, '#ddlProcedureLevel3');
    //Get_PED_DayCare_CI_Gipsa(ID);
});

$('#ddlProcedureLevel3').on("change", function () {
    var ID = $('#ddlProcedureLevel3').val();
    //Get_PED_DayCare_CI_Gipsa(ID);
    var _issueID = basicData[0].IssueID;
    ClearICDCodes();
    GettingCodesBasedonProcID(ID, _issueID);
    if (ID == 526 || ID == 527 || ID == 1267 || ID == 1268 || ID == 1269 || ID == 1270 || ID == 1271 || ID == 1272) {
        $('#divAlimentExpressions').show();
    }
    else {
        $('#txtClaimExpression').val(0);
        $('#txtClaimPower').val('');
        $('#divAlimentExpressions').hide();
    }

});

//$('#ddlICDLevel1').on("change", function () {
//    var ID = $('#ddlICDLevel1').val();
//    if (ID != null && ID != "")
//        GetICDValues(ID, '#ddlICDLevel2');
//        //LoadICD10(ID, '#ddlICDLevel2');
//});

//$('#ddlICDLevel2').on("change", function () {
//    var ID = $('#ddlICDLevel2').val();
//    if (ID != null && ID != "")
//        LoadICD10(ID, '#ddlICDLevel3');
//});

//function Get_PED_DayCare_CI_Gipsa(_id) {
//    $('#hdnICDCodeID').val('');
//    $('#txtICDDiseaseCode').val('');
//    $('#txtCodingPCSCode').val('');
//    pcscodeid = null;
//    $('#chkCodingIsPED').attr("checked", false);
//    $('#chkCriticalIllNess').attr("checked", false);
//    $('#chkCodingIsGIPSA').attr("checked", false);
//    $('#chkCodingDayCare').attr("checked", false);
//    var DiseaseCode = '';
//    var TPAProcedures = $.parseJSON(MasterData.mTPAProcedurecs);
//    $.each(TPAProcedures, function (i, item) {
//        if (item.ID == _id) {
//            //$('#hdnICDCodeID').val(item.ICDCode);
//            DiseaseCode = item.ICDCode;
//            $('#txtICDDiseaseCode').val(item.ICDCode);
//            $('#txtCodingPCSCode').val(item.PCSCode);
//            return false;
//        }
//    });
//    var Data = $.parseJSON(MasterData.ICD10);
//    $.each(Data, function (i, item) {
//        if (DiseaseCode == item.DiseaseCode) {
//            $('#hdnICDCodeID').val(item.ID);
//            var ICDDescription = GetICD10Description(item.ID);
//            $('#txtICDDiseaseCode').val(item.DiseaseCode + ', ' + ICDDescription);
//        }
//    });
//    var _issueID = basicData[0].IssueID;
//    try {
//        $.ajax({
//            url: "/MedicalScrutiny/GetPackageRate_PEDCIGIPSA",
//            type: "GET",
//            contentType: 'application/json;charset=utf-8',
//            data: { ProcedureID: _id, IssueID: _issueID },
//            success: function (data) {
//                CheckSessionVariable(data.responseText);
//                data = $.parseJSON(data);
//                if (data != null && data != "") {
//                    BindCheckBox(data[i].isPED, 'chkCodingIsPED');
//                    BindCheckBox(data[i].isCI, 'chkCriticalIllNess');
//                    BindCheckBox(data[i].isGIPSA, 'chkCodingIsGIPSA');
//                    BindCheckBox(data[i].isDayCare, 'chkCodingDayCare');
//                }
//                else {
//                    $.each(TPAProcedures, function (i, item) {
//                        if (item.ID == _id) {
//                            BindCheckBox(item.isPED, 'chkCodingIsPED');
//                            BindCheckBox(item.isCI, 'chkCriticalIllNess');
//                            BindCheckBox(item.isGIPSA, 'chkCodingIsGIPSA');
//                            BindCheckBox(item.isDayCare, 'chkCodingDayCare');
//                            return false;
//                        }
//                    });
//                }
//            },
//            error: function (e, x) {
//                DialogResultMessage('Error Occured While Getting PED, Day Care, Gipsa, Critical Illness.');
//            }
//        })
//    }
//    catch (e) {
//        DialogResultMessage('Error Occured While Getting PED, Day Care, Gipsa, Critical Illness.');
//    }
//}

/* Get Package Amount*/
var ispackagefound = false;
var policyAlimentexpressions = [];
var NME_DATA = [];
function GetPacakageLimitDetails(approvedFacilityID) {
    var _codingBillAmount = MakeZerofromUndefinedorEmpty($('#txtCodingBillAmount').val());
    if (Validate_CodingGetPackageLimits()) {

        $('#hdnCodingPackageDiscount').val(0);

        var procdureDetails = [];
        if ($('#hdnClaimsCodingDetails').val() != '') {
            procdureDetails = $.parseJSON($('#hdnClaimsCodingDetails').val());
        }
        //if (procdureDetails != "") {
        //    var IcdCode = procdureDetails[0].ICDCode;
        //}
        $('#progress').show();
        var _ProviderID = $("#hdnProviderID").val();
        var _ProcedureID = ($('#ddlProcedureLevel3').val() != 0 && $('#ddlProcedureLevel3').val() != null) ? $('#ddlProcedureLevel3').val() : ($('#ddlProcedureLevel2').val() != 0 ? $('#ddlProcedureLevel2').val() : $('#ddlProcedureLevel1').val());

        var _IssueID = $("#hdnInsuranceCompanyID").val();
        var _CorpID = MakeZerofromUndefinedorEmpty($("#hdnCorporateID").val());
        var _PayerID = MakeZerofromUndefinedorEmpty($("#hdnPayerID").val());
        var _PolicyID = MakeZerofromUndefinedorEmpty($("#hdnPolicyID").val());
        var _BrokerID = MakeZerofromUndefinedorEmpty($("#hdnBrokerID").val());
        var _FacilityID = approvedFacilityID;
        var Level1 = MakeZerofromUndefinedorEmpty($('#ddlProcedureLevel1').val());

        var isGipsa = 0
        if ($("#chkCodingIsGIPSA").is(':checked') == true)
            isGipsa = 1;

        var isCI = 0;
        if ($("#chkCriticalIllNess").is(':checked') == true)
            isCI = 1;

        var isPED = 0;
        if ($("#chkCodingIsPED").is(':checked') == true)
            isPED = 1;

        var isDayCare = 0;
        if ($("#chkCodingDayCare").is(':checked') == true)
            isDayCare = 1;

        try {
            $.ajax({
                url: "/MedicalScrutiny/GetPackageRate_ClaimsCoding",
                type: "GET",
                contentType: 'application/json;charset=utf-8',
                beforeSend: function () { $("#progress1").show(); },
                data: {
                    ProviderID: _ProviderID, ProcedureID: _ProcedureID, IssueID: _IssueID, CorpID: _CorpID, PayerID: _PayerID, PolicyID: _PolicyID, BrokerID: _BrokerID,
                    ClaimID: $("#hdnClaimID").val(), MemberPolicyID: $("#hdnMemberPolicyID").val(), SITypeID: $("#hdnSITypeID").val(), Level1: Level1, isGipsa: isGipsa,
                    isCI: isCI, isPED: isPED, isDayCare: isDayCare, Slno: $('#hdnClaimSlNo').val()
                },
                success: function (data) {
                    $("#progress1").hide();
                    CheckSessionVariable(data);
                    //$('#progress').hide();
                    data = $.parseJSON(data);
                    if (data.ID == 1) {
                        // ClaimAI: suppress amount exceeded errors when editing an existing row
                        var _msg = (data.Message || '').toLowerCase();
                        var _isAmountError = _msg.indexOf('exceeded') !== -1 || _msg.indexOf('bill amount') !== -1 || _msg.indexOf('package amount') !== -1;
                        if (iseditcoding && _isAmountError) {
                            console.log('[ClaimAI] Suppressed amount validation during edit:', data.Message);
                        } else {
                            DialogErrorMessage(data.Message);
                        }
                    }
                    else {
                        $('#txtPackageRate').val(0);
                        $('#txtDiscount').val(0);

                        if (data == null || data == "") {
                            // DialogResultMessage('Data not found.');
                            //$('#txtEligibleAmount').val($('#txtCodingBillAmount').val());                        
                        }
                        else {
                            ispackagefound = false;
                            var vPackageRageTbl = data.Table1;
                            var claimstageid = $('#hdnClaimStageID').val();
                            var PkgDisc = 0;
                            var _BillPkgDiscPcnt = MakeZerofromUndefinedorEmpty($('#hdnPackagePercentage').val());

                            $.each(vPackageRageTbl, function (i, item) {

                                if (parseInt($('#hdnClaimTypeID').val()) == 1) {
                                    if ([1, 2, 3].includes(parseInt($('#hdnRequestTypeID').val())) && (claimstageid == 24 || claimstageid == 4 || claimstageid == 5 || claimstageid == 22)) {
                                        PkgDisc = MakeZerofromUndefinedorEmpty(item.Discount);
                                    }
                                    else {
                                        PkgDisc = _BillPkgDiscPcnt;
                                    }
                                }

                                if (item.FacilityID == _FacilityID) {
                                    //******* Changed By Venkat Mandadi - (SP-1227) Provider Package/Discount Calculation must be enabled only for Cashless Claims.
                                    if (parseInt($('#hdnClaimTypeID').val()) == 2 && (basicData[0].IssueID == 7 && basicData[0].RequestTypeID == 4 && (basicData[0].ServiceSubTypeID == 3 || basicData[0].ServiceSubTypeID == 4))) {
                                        $('#txtPackageRate').val(MakeZerofromUndefinedorEmpty(item.PackageRate));
                                        $('#hdnCodingPackageDiscount').val(MakeZerofromUndefinedorEmpty(item.Discount));
                                    }
                                    else if (parseInt($('#hdnClaimTypeID').val()) == 2) {
                                        $('#txtPackageRate').val(0);
                                        $('#hdnCodingPackageDiscount').val(0);
                                    }
                                    //************* Else if condition Commented By BhagyaRaj.A -  (SP-1121) MOU Discount Calculation at Cashless level
                                    //else if (parseInt($('#hdnClaimTypeID').val()) == 1 && ($('#hdnRequestTypeID').val() == 1 || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3)) {
                                    //    $('#txtPackageRate').val(MakeZerofromUndefinedorEmpty(item.PackageRate));
                                    //    $('#hdnCodingPackageDiscount').val(0);
                                    //}
                                    else {
                                        $('#txtPackageRate').val(MakeZerofromUndefinedorEmpty(item.PackageRate));
                                        //Leena-------------------------------------------------------------------
                                        $('#hdnCodingPackageDiscount').val(MakeZerofromUndefinedorEmpty(PkgDisc));
                                        //Leena-------------------------------------------------------------------
                                        //$('#hdnCodingPackageDiscount').val(MakeZerofromUndefinedorEmpty(item.Discount));
                                    }
                                    //$('#txtPackageRate').val(MakeZerofromUndefinedorEmpty(item.PackageRate));

                                    //if (parseInt($('#hdnClaimTypeID').val()) == 2)
                                    //    $('#hdnCodingPackageDiscount').val(0);
                                    //else if (parseInt($('#hdnClaimTypeID').val()) == 1 && ($('#hdnRequestTypeID').val() == 1 || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3))
                                    //    $('#hdnCodingPackageDiscount').val(0);
                                    //else
                                    //    $('#hdnCodingPackageDiscount').val(MakeZerofromUndefinedorEmpty(item.Discount));

                                    ispackagefound = true;
                                    // ****************************************

                                    ////if ($('#ddlBillingType').val() == 201) {
                                    ////    $('#txtDiscount').val(item.Discount);
                                    ////}

                                    //if (procdureDetails.length == 0) {
                                    //    ////if ($('#ddlBillingType').val() == 202 || $('#ddlBillingType').val() == 203) {
                                    //    if ($('#ddlBillingType').val() == 202) {
                                    //        $('#txtDiscount').val(MakeZerofromUndefinedorEmpty($('#hdnTotalServiceDiscounts').val()));

                                    //        ////////var _discount = parseInt($('#txtDiscount').val()) + parseInt(MakeZerofromUndefinedorEmpty(item.Discount));
                                    //        ////////$('#txtDiscount').val(_discount);
                                    //    }
                                    //}

                                    ////var discount = (parseInt(item.PackageRate) * parseInt(MakeZerofromUndefinedorEmpty(item.Discount))) / 100;
                                    ////$('#txtDiscount').val(discount);

                                    ////var EligibleAmtAfterDiscount = parseInt(item.PackageRate) - parseInt(discount);
                                    ////var billAmount = 0;
                                    ////if ($('#txtCodingBillAmount').val() != '')
                                    ////    billAmount = $('#txtCodingBillAmount').val();

                                    ////if (parseInt(EligibleAmtAfterDiscount) == 0)
                                    ////    var eligibleAmount = billAmount;
                                    ////else
                                    ////    var eligibleAmount = Math.min(parseInt(EligibleAmtAfterDiscount), parseInt(billAmount));

                                    ////$('#txtEligibleAmount').val(eligibleAmount);

                                    return false;
                                }
                            });
                            if (ispackagefound == false) {
                                //alert('ispackagefound');
                                $.each(vPackageRageTbl, function (i, item) {
                                    if (item.FacilityID == null) {
                                        if (parseInt($('#hdnClaimTypeID').val()) == 1) {
                                            if ([1, 2, 3].includes(parseInt($('#hdnRequestTypeID').val())) && (claimstageid == 24 || claimstageid == 4 || claimstageid == 5 || claimstageid == 22)) {
                                                PkgDisc = MakeZerofromUndefinedorEmpty(item.Discount);
                                            }
                                            else {
                                                PkgDisc = _BillPkgDiscPcnt;
                                            }
                                        }

                                        $('#txtPackageRate').val(MakeZerofromUndefinedorEmpty(item.PackageRate));
                                        //alert(item.Discount);
                                        if (parseInt($('#hdnClaimTypeID').val()) == 2 && (basicData[0].IssueID == 7 && basicData[0].RequestTypeID == 4 && (basicData[0].ServiceSubTypeID == 3 || basicData[0].ServiceSubTypeID == 4)))
                                            $('#hdnCodingPackageDiscount').val(item.Discount);
                                        else if (parseInt($('#hdnClaimTypeID').val()) == 2)
                                            $('#hdnCodingPackageDiscount').val(0);
                                        else if (parseInt($('#hdnClaimTypeID').val()) == 1 && ($('#hdnRequestTypeID').val() == 1 || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3))
                                            //$('#hdnCodingPackageDiscount').val(0); // Commented By BhagyaRaj.A -  (SP-1121) MOU Discount Calculation at Cashless level
                                            //$('#hdnCodingPackageDiscount').val(MakeZerofromUndefinedorEmpty(item.Discount)); // Added By BhagyaRaj.A -  (SP-1121) MOU Discount Calculation at Cashless level
                                            $('#hdnCodingPackageDiscount').val(MakeZerofromUndefinedorEmpty(PkgDisc)); //SP3V-3998
                                        else
                                            $('#hdnCodingPackageDiscount').val(MakeZerofromUndefinedorEmpty(PkgDisc)); //SP3V-3998
                                        //$('#hdnCodingPackageDiscount').val(MakeZerofromUndefinedorEmpty(item.Discount));
                                        return false;
                                    }
                                });
                            }
                        }
                        var _packageAmount = MakeZerofromUndefinedorEmpty($('#txtPackageRate').val());
                        $('#txtDisallowedAmount').removeAttr("disabled", true);
                        if (_packageAmount != 0) {
                            if (parseInt(_codingBillAmount) > parseInt(_packageAmount)) {
                                $('#txtDisallowedAmount').val(parseInt(_codingBillAmount) - parseInt(_packageAmount));
                                //$('#txtCodingDisallowedAmountReason').val('Restricted as per agreed Package Rate');

                            }
                        }
                        else
                            $('#txtDisallowedAmount').val(0);

                        if (data.Table4.length > 0) {
                            policyAlimentexpressions = data.Table4;
                        }
                        if (data.Table5.length > 0) {
                            NME_DATA = data.Table5;
                        }
                        Prepare_EligibilityTableDesign(data);

                        CodingCalculation($('#hdnCodingPackageDiscount').val());

                        ////if (parseInt($('#txtPackageRate').val()) == 0)
                        ////    $('#txtPackageRate').removeAttr("readonly", false);
                        $("#hdncodingflag").val("true");
                    }

                },
                error: function (e, x) {
                    $("#progress1").hide();
                    DialogResultMessage('Error Occured While Getting Package Limits');
                }
            });
        }
        catch (e) {
            $("#progress1").hide();
            DialogResultMessage('Error Occured While Getting Package Limits');
        }
    }
}

//SP3V-1432 START

function Validate_CodingGetPackageLimits() {
    var flag = true;

    var ProcedureLevel1 = $('#ddlProcedureLevel1').val();
    var ProcedureLevel2 = $('#ddlProcedureLevel2').val();
    var TreatmentType = $('#ddlTreatmentType').val();
    var ProcedureLevel3 = $('#ddlProcedureLevel3').val();
    var _ClaimID = $('#hdnClaimID').val();
    var family_limit = 0;
    var previous_claim_amount = 0;
    var Uhidno = $("#hplSystemPatient_PatientUHID").text();
    var claimid = $('#hdnClaimID').val();
    var slno = $('#hdnClaimSlNo').val();
    if (ProcedureLevel2 == "402" || ProcedureLevel2 == "406" || ProcedureLevel2 == "409" || ProcedureLevel2 == "418") {
        var value = $("#hdnCheckMultipleMaternity").val();
        if (value == "0") {
            alert('Maternity related claim has been utilized previously. Please check remaining maternity sublimit before processing further.');
            // flag = true;
        }
    }
    if (basicData[0].claimdiagnosis == 469 && ProcedureLevel1 != 401 && $('#ddlPriority').val() == 100) { // added by vydehi

        alert(" As it is selected as Maternity claim please do Maternity coding  ");
        return false;

    }
    if (basicData[0].claimdiagnosis == 466 && ProcedureLevel1 != 494 && $('#ddlPriority').val() == 10) { // added by vydehi

        alert(" As it is selected as Catract claim please do Catract coding  ");
        return false;

    }
    if ((iscodingflag == false && $("#hdncodingflag").val() == "false") && (($("#hdnRequestTypeID").val() == 2) || ($("#hdnRequestTypeID").val() == 3) || ($("#hdnRequestTypeID").val() == 7))) {
        DialogWarningMessage("please Edit or delete coding available below");
        flag = false;
        return;
    }
    if (MakeZerofromUndefinedorEmpty($('#txtCodingBillAmount').val()) == 0) {
        DialogResultMessage("Invalid Bill Amount");
        flag = false;
        return;
    }
    //else if (MakeZerofromUndefinedorEmpty($('#ddlBillingType').val()) == 0) {
    //   DialogErrorMessage('Please Select BillingType');
    //    flag = true;
    //    return;
    //}

    if ($('#ddlTreatmentType').val() == 66) {
        if ($('#ddlPriority').val() == 0) {
            DialogErrorMessage('Please Select Priority'); flag = false; return;
        }
    }

    if (MakeZerofromUndefinedorEmpty($('#ddlProcedureLevel1').val()) == 0) {
        DialogErrorMessage('Please Select ProcedureLevel1'); flag = false; return;
    }
    else if (MakeZerofromUndefinedorEmpty($('#ddlProcedureLevel2').val()) == 0) {
        DialogErrorMessage('Please Select ProcedureLevel2'); flag = false; return;
    }
    else if (MakeZerofromUndefinedorEmpty($('#ddlProcedureLevel3').val()) == 0) {
        DialogErrorMessage('Please Select ProcedureLevel3'); flag = false; return;
    }
    else if (MakeZerofromUndefinedorEmpty($('#ddlTreatmentType').val()) == 0) {
        DialogErrorMessage('Please Select TreatmentType'); flag = false; return;
    }
    //else if (($("#chkoverridesubpackage").is(':checked') == true) && MakeZerofromUndefinedorEmpty($('#txtAdditionalAmount').val()) == 0) {
    //    DialogErrorMessage('Additional amount should not be zero in case of override package'); flag = false; return;
    //}
    else if ((($("#chkoverridesubpackage").is(':checked') == true) || ($("#chkoverridesubinsured").is(':checked') == true)) && $('#ddlAdditonalAmtResason').val() == '0') {
        DialogErrorMessage('Please select Coding Override Reason'); flag = false; return;
    }

    return flag;
}

function Checkpreviousmaternity(Action, claimid, slno, Uhidno) {
    $.ajax(
        {
            url: '/MedicalScrutiny/Checkpreviousmaternity',
            type: 'POST',
            data: { Action: Action, claimid: claimid, slno: slno, Uhidno: Uhidno },
            success: function (result) {
                CheckSessionVariable(result);
                data = $.parseJSON(result);
                if (data == null || data == "") {
                    return true;
                }
                else {
                    return false;
                }
            },
            error: function () {
                DialogCommomErrorFunction('Error occurred while fetching the details')
            }
        }
    );

}
//SP3V-1432 END

function Prepare_EligibilityTableDesign(data) {
    $('#hdnCodingProcedureEligibleAmount').val('');
    var vDataLimit = '';
    var vDataCalculation = '';

    var _LClaimLimit = 0; var _LIndividualLimit = 0; var _LFamilyLimit = 0; var _LPolicyLimit = 0; var _LCorporateLimit = 0;
    var _UClaimLimit = 0; var _UIndividualLimit = 0; var _UFamilyLimit = 0; var _UPolicyLimit = 0; var _UCorporateLimit = 0;

    if (data.Table2.length > 0) {
        var allNulls = false;
        var atLeastOneZero = false;
        _LClaimLimit = data.Table2[0].ClaimLimit;
        _LIndividualLimit = data.Table2[0].IndividualLimit;
        _LFamilyLimit = data.Table2[0].FamilyLimit;
        _LPolicyLimit = data.Table2[0].PolicyLimit;
        _LCorporateLimit = data.Table2[0].CorporateLimit;

        if (_LClaimLimit == 0 || _LIndividualLimit == 0 || _LFamilyLimit == 0 || _LPolicyLimit == 0 || _LCorporateLimit == 0) {
            atLeastOneZero = true;
            vDataLimit = '<tr><td colspan="12">Procedure limits defined as "0".</td></tr>';
            $('#hdnCodingProcedureEligibleAmount').val('0');
        }
        else if (_LClaimLimit == null && _LIndividualLimit == null && _LFamilyLimit == null && _LPolicyLimit == null && _LCorporateLimit == null) {
            allNulls = true;
            vDataLimit = '<tr><td colspan="12">No limits.</td></tr>';
        }


        if (atLeastOneZero == false && allNulls == false) {
            vDataLimit = '<tr><td>' + data.Table2[0].RuleName + '</td><td>' + MakeEmptyfromUndefinedorNull(_LClaimLimit) + '</td><td>' + MakeEmptyfromUndefinedorNull(_LIndividualLimit)
                + '</td><td>' + MakeEmptyfromUndefinedorNull(_LFamilyLimit) + '</td><td>' + MakeEmptyfromUndefinedorNull(_LPolicyLimit) + '</td><td>' + MakeEmptyfromUndefinedorNull(_LCorporateLimit)
                + '</td><td>' + MakeEmptyfromUndefinedorNull(data.Table2[0].ExternalValueAbs) + '</td><td>' + MakeEmptyfromUndefinedorNull(data.Table2[0].InternalValueAbs) + '</td><td>' + MakeEmptyfromUndefinedorNull(data.Table2[0].IndividualPerc)
                + '</td><td>' + MakeEmptyfromUndefinedorNull(data.Table2[0].FamilyPerc) + '</td><td>' + MakeEmptyfromUndefinedorNull(data.Table2[0].ExternalValuePerc) + '</td><td>' + MakeEmptyfromUndefinedorNull(data.Table2[0].InternalValuePerc) + '</td></tr>';

            if (data.Table3.length > 0) {

                _UClaimLimit = data.Table3[0].ClaimLimit; $('#txtClaimedAmount').val();
                _UIndividualLimit = data.Table3[0].IndividualLimit;
                _UFamilyLimit = data.Table3[0].FamilyLimit;
                _UPolicyLimit = data.Table3[0].PolicyLimit;
                _UCorporateLimit = data.Table3[0].CorporateLimit;

                vDataLimit = vDataLimit + '<tr><td>Procedure Utilization</td><td>' + $('#txtClaimedAmount').val() + '</td><td>' + MakeEmptyfromUndefinedorNull(_UIndividualLimit)
                    + '</td><td>' + MakeEmptyfromUndefinedorNull(_UFamilyLimit) + '</td><td>' + MakeEmptyfromUndefinedorNull(_UPolicyLimit) + '</td><td>' + MakeEmptyfromUndefinedorNull(_UCorporateLimit)
                    + '</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';

                var find_MinValue = [];
                var uValue = '';

                //if (_LClaimLimit == null) {
                //    find_MinValue.push(parseInt($('#txtClaimedAmount').val()));
                //    _UClaimLimit = $('#txtClaimedAmount').val();
                //}
                //else {
                //    find_MinValue.push(Math.min(_LClaimLimit, parseInt($('#txtClaimedAmount').val())));
                //    _UClaimLimit = Math.min(_LClaimLimit, parseInt($('#txtClaimedAmount').val()));
                //}

                uValue = Get_UtilizedLimits(_LClaimLimit, _UClaimLimit);
                if (uValue !== '') {
                    //find_MinValue = Concatinate_PackageLimits(find_MinValue, uValue);
                    find_MinValue.push(uValue);
                }
                //else
                _UClaimLimit = uValue;


                uValue = Get_UtilizedLimits(_LIndividualLimit, _UIndividualLimit);
                if (uValue !== '') {
                    //find_MinValue = Concatinate_PackageLimits(find_MinValue, uValue);
                    find_MinValue.push(uValue);
                }
                //else
                _UIndividualLimit = uValue;

                uValue = Get_UtilizedLimits(_LFamilyLimit, _UFamilyLimit);
                if (uValue !== '') {
                    //find_MinValue = Concatinate_PackageLimits(find_MinValue, uValue);
                    find_MinValue.push(uValue);
                }
                //else
                _UFamilyLimit = uValue;

                uValue = Get_UtilizedLimits(_LPolicyLimit, _UPolicyLimit);
                if (uValue !== '') {
                    //find_MinValue = Concatinate_PackageLimits(find_MinValue, uValue);
                    find_MinValue.push(uValue);
                }
                //else
                _UPolicyLimit = uValue;

                uValue = Get_UtilizedLimits(_LCorporateLimit, _UCorporateLimit);
                if (uValue !== '') {
                    //find_MinValue = Concatinate_PackageLimits(find_MinValue, uValue);
                    find_MinValue.push(uValue);
                }
                //else
                _UCorporateLimit = uValue;

                $('#hdnCodingProcedureEligibleAmount').val(Math.min.apply(Math, find_MinValue));

                vDataLimit = vDataLimit + '<tr><td>Procedure Eligibility</td><td>' + MakeEmptyfromUndefinedorNull(_UClaimLimit) + '</td><td>' + MakeEmptyfromUndefinedorNull(_UIndividualLimit)
                    + '</td><td>' + MakeEmptyfromUndefinedorNull(_UFamilyLimit) + '</td><td>' + MakeEmptyfromUndefinedorNull(_UPolicyLimit) + '</td><td>' + MakeEmptyfromUndefinedorNull(_UCorporateLimit)
                    + '</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';

                vDataLimit = vDataLimit + '<tr><td colspan="12">' + $('#hdnCodingProcedureEligibleAmount').val() + '</td></tr>';

            }
            else {
                vDataLimit = vDataLimit + '<tr><td>Procedure Utilization</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';

                var findMinValue = [];

                if (_LClaimLimit != null)
                    findMinValue.push(Math.min(_LClaimLimit, parseInt($('#txtClaimedAmount').val())));
                if (_LIndividualLimit != null)
                    findMinValue.push(_LIndividualLimit);
                if (_LFamilyLimit != null)
                    findMinValue.push(_LFamilyLimit);
                if (_LPolicyLimit != null)
                    findMinValue.push(_LPolicyLimit);
                if (_LCorporateLimit != null)
                    findMinValue.push(_LCorporateLimit);

                $('#hdnCodingProcedureEligibleAmount').val(Math.min.apply(Math, findMinValue));

                vDataLimit = vDataLimit + '<tr><td>Procedure Eligibility</td><td>' + _UClaimLimit + '</td><td>' + MakeEmptyfromUndefinedorNull(_LIndividualLimit)
                    + '</td><td>' + MakeEmptyfromUndefinedorNull(_LFamilyLimit) + '</td><td>' + MakeEmptyfromUndefinedorNull(_LPolicyLimit) + '</td><td>'
                    + MakeEmptyfromUndefinedorNull(_LCorporateLimit) + '</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';

                vDataLimit = vDataLimit + '<tr><td colspan="12">' + $('#hdnCodingProcedureEligibleAmount').val() + '</td></tr>';
            }
        }

    }
    else
        vDataLimit = '<tr><td colspan="12">No data found.</td></tr>';

    var vDesign = '<div class="col-sm-12 wow fadeInDown"><table id="tblPopUpCodingEligibleAmt_' + $('#ddlPriority').val() + '" class="tablenew">'
        + '<thead><tr><th>RuleName</th><th>ClaimLimit</th><th>IndividualLimit</th><th>FamilyLimit</th><th>PolicyLimit</th><th>CorporateLimit</th>'
        + '<th>ExternalValueAbs</th><th>InternalValueAbs</th><th>IndividualPerc</th><th>FamilyPerc</th><th>ExternalValuePerc</th><th>InternalValuePerc</th></tr>'
        + '</thead><tbody>' + vDataLimit + '</tbody></table></div>';

    $('#spanTopCodingEligibilityTable').html(vDesign);
    $('#txtsublimitRate').val($('#hdnCodingProcedureEligibleAmount').val());
    //$('#hdnCodingEligibilityDesign').val(vDesign);

}

function Concatinate_PackageLimits(findMinValue, nextValue) {
    if (findMinValue == 0)
        findMinValue = nextValue;
    else
        findMinValue = findMinValue + ',' + nextValue;

    return findMinValue;
}

function Get_UtilizedLimits(Lvalue, Uvalue) {
    var finalValue = '';

    if (Lvalue == null)
        finalValue = '';
    else if (Uvalue == null)
        finalValue = Lvalue;
    else {
        if (Uvalue > Lvalue)
            finalValue = 0;
        else
            finalValue = Lvalue - Uvalue;
    }

    return finalValue;
}


function CodingCalculation(_packageDiscount) {
    var _billAmount = MakeZerofromUndefinedorEmpty($('#txtCodingBillAmount').val());
    var _packageAmount = MakeZerofromUndefinedorEmpty($('#txtPackageRate').val());
    ////var _EligibleAmount = MakeZerofromUndefinedorEmpty($('#txtEligibleAmount').val());
    var _disallowedAmount = MakeZerofromUndefinedorEmpty($('#txtDisallowedAmount').val());
    var _discount = _packageDiscount;////MakeZerofromUndefinedorEmpty($('#txtDiscount').val());
    var _tariffDiscount = MakeZerofromUndefinedorEmpty($('#txtDiscount').val());

    var _TotalBillAmount = MakeZerofromUndefinedorEmpty($('#txtTotalServicesBillAmount').val());
    var _TotalPackageAmount = MakeZerofromUndefinedorEmpty($('#txtTotalServicesPackageAmount').val());

    iscodingcalculated = true;
    //alert(_discount);
    if (_billAmount != 0) {
        // ClaimAI: Validate_AddClaimICDProcedure removed from CodingCalculation
        // — validation only needed on add/save, not during calculation

        var discountAmount = 0;
        var EligibleAmtAfterDiscount = 0;

        if ($('#ddlBillingType').val() == 202) _discount = 0;

        //************ For Task: (SP-1250)
        if (($('#ddlBillingType').val() == null || $('#ddlBillingType').val() == 201 || $('#ddlBillingType').val() == 203) && $("#chkCodingIsGIPSA").is(':checked') == true) {
            _discount = 0;
        }
        //************
        if ((($("#chkoverridesubpackage").is(':checked') == true) || ($("#chkoverridesubinsured").is(':checked') == true))
            && $('#ddlPriority').val() == 100) {
            _packageAmount = _billAmount;
        }

        //if (($("#chkoverridesubinsured").is(':checked') == true)) {
        //    $('#txtDisallowedAmount').val(0);
        //    $('#txtPackageRate').val(0);
        //    $('#txtDiscount').val(0);
        //    $('#hdnCodingProcedureEligibleAmount').val('');
        //    _packageAmount = 0; _discount = 0; _disallowedAmount = 0;
        //}

        if (parseInt(_packageAmount) != 0 && (_discount) != 0) {
            //alert(_discount);
            discountAmount = Math.round((parseInt(_packageAmount) * (_discount)) / 100);
            $('#txtDiscount').val(discountAmount);
            _packageAmount = parseInt(_packageAmount) - parseInt(discountAmount);
            EligibleAmtAfterDiscount = Math.min(parseInt(_packageAmount), parseInt(_billAmount));
        }
        else if (parseInt(_packageAmount) != 0 && (_discount) == 0) {
            $('#txtDiscount').val(0);
            EligibleAmtAfterDiscount = Math.min(parseInt(_packageAmount), parseInt(_billAmount));
        }
        else {
            if (_discount != 0) {
                discountAmount = Math.round((parseInt(_billAmount) * (_discount)) / 100);
                $('#txtDiscount').val(discountAmount);
                EligibleAmtAfterDiscount = parseInt(_billAmount) - parseInt(discountAmount);
            }
            else {
                $('#txtDiscount').val(0);
                EligibleAmtAfterDiscount = _billAmount;
            }
        }

        if (MakeZerofromUndefinedorEmpty($('#ddlTreatmentType').val()) != 65) {
            if ($('#ddlPriority').val() == 50) {
                EligibleAmtAfterDiscount = parseInt(EligibleAmtAfterDiscount) / 2;
            }
            else if ($('#ddlPriority').val() == 25) {
                EligibleAmtAfterDiscount = parseInt(EligibleAmtAfterDiscount) / 4;
            }
            else if ($('#ddlPriority').val() == 12.5) {
                EligibleAmtAfterDiscount = parseInt(EligibleAmtAfterDiscount) / 4;
                EligibleAmtAfterDiscount = parseInt(EligibleAmtAfterDiscount) / 2;
            }
        }
        //if (parseInt(EligibleAmtAfterDiscount) == 0)
        //    var eligibleAmount = _billAmount;
        //else

        var eligibleAmount = 0;
        //if ($('#hdnCodingProcedureEligibleAmount').val() == '')
        //    eligibleAmount = Math.min(parseInt(EligibleAmtAfterDiscount), parseInt(_billAmount));
        //else
        //    eligibleAmount = Math.min(parseInt(EligibleAmtAfterDiscount), parseInt(_billAmount), parseInt($('#hdnCodingProcedureEligibleAmount').val()));
        if (($("#chkoverridesubpackage").is(':checked') == true)) {
            if (MakeZerofromUndefinedorEmpty($('#hdnCodingProcedureEligibleAmount').val()) != 0) {
                if (MakeZerofromUndefinedorEmpty($('#txtTotalServicesEligibleAmount').val()) != 0)
                    eligibleAmount = Math.min(parseInt(EligibleAmtAfterDiscount), parseInt($('#hdnCodingProcedureEligibleAmount').val()), parseInt($('#txtTotalServicesEligibleAmount').val()));
                else
                    eligibleAmount = Math.min(parseInt(EligibleAmtAfterDiscount), parseInt($('#hdnCodingProcedureEligibleAmount').val()));
                _disallowedAmount = parseInt($('#txtCodingBillAmount').val()) - parseInt(eligibleAmount)
                $('#txtDisallowedAmount').val(_disallowedAmount);
                if (_disallowedAmount > 0) {
                    if (parseInt(EligibleAmtAfterDiscount) > parseInt($('#hdnCodingProcedureEligibleAmount').val()))
                        $('#ddlDeductionReasons').val(14);
                    else
                        $('#ddlDeductionReasons').val(3);
                }
            }
            else if (MakeZerofromUndefinedorEmpty($('#hdnCodingProcedureEligibleAmount').val()) == 0) {
                if (MakeZerofromUndefinedorEmpty($('#txtTotalServicesEligibleAmount').val()) != 0 && MakeZerofromUndefinedorEmpty($('#txtbillingtotalpackageamount').val()) == 0)
                    eligibleAmount = Math.min(parseInt($('#txtTotalServicesEligibleAmount').val()), parseInt(EligibleAmtAfterDiscount));
                else
                    eligibleAmount = EligibleAmtAfterDiscount;
                _disallowedAmount = parseInt($('#txtCodingBillAmount').val()) - parseInt(eligibleAmount)
                $('#txtDisallowedAmount').val(_disallowedAmount);
                if (_disallowedAmount > 0)
                    $('#ddlDeductionReasons').val(3);
            }
        }
        else if (($("#chkoverridesubinsured").is(':checked') == true)) {
            if (MakeZerofromUndefinedorEmpty($('#txtTotalServicesEligibleAmount').val()) != 0 && MakeZerofromUndefinedorEmpty($('#txtbillingtotalpackageamount').val()) == 0)
                eligibleAmount = Math.min(parseInt(EligibleAmtAfterDiscount), parseInt($('#txtTotalServicesEligibleAmount').val()));
            else
                eligibleAmount = EligibleAmtAfterDiscount;

            _disallowedAmount = parseInt($('#txtCodingBillAmount').val()) - parseInt(eligibleAmount)
            $('#txtDisallowedAmount').val(_disallowedAmount);
            if (_disallowedAmount > 0)
                $('#ddlDeductionReasons').val(3);
        }
        else if ($('#hdnCodingProcedureEligibleAmount').val() != '') {
            eligibleAmount = Math.min(parseInt(EligibleAmtAfterDiscount), parseInt($('#hdnCodingProcedureEligibleAmount').val()));
            _disallowedAmount = parseInt($('#txtCodingBillAmount').val()) - parseInt(eligibleAmount)
            $('#txtDisallowedAmount').val(_disallowedAmount);
            if ((parseInt(EligibleAmtAfterDiscount) > parseInt($('#hdnCodingProcedureEligibleAmount').val())) && _disallowedAmount > 0)
                $('#ddlDeductionReasons').val(14);
            else if (_disallowedAmount > 0)
                $('#ddlDeductionReasons').val(3);
        }
        else {
            eligibleAmount = EligibleAmtAfterDiscount;
            if (_disallowedAmount > 0)
                $('#ddlDeductionReasons').val(3);
        }

        //if ($('#hdnCodingProcedureEligibleAmount').val() != '') {
        //    eligibleAmount = Math.min(parseInt(EligibleAmtAfterDiscount), parseInt($('#hdnCodingProcedureEligibleAmount').val()));
        //    if (parseInt(EligibleAmtAfterDiscount) > parseInt($('#hdnCodingProcedureEligibleAmount').val()))
        //        $('#ddlDeductionReasons').val(14);//procdureDetails[0].DisallowedReasonIDs
        //    // $('#ddlDeductionReasons').val(procdureDetails[0].DisallowedReasonIDs);
        //    else
        //        $('#ddlDeductionReasons').val(3);
        //    //$('#ddlDeductionReasons').val(procdureDetails[0].DisallowedReasonIDs);
        //}
        //else {
        //    eligibleAmount = EligibleAmtAfterDiscount;
        //    $('#ddlDeductionReasons').val(3)
        //    //$('#ddlDeductionReasons').val(procdureDetails[0].DisallowedReasonIDs);
        //}


        var SAP_eligibleAmount = 0;
        var SAP_LowerNME = 0;
        var SAP_LowerEligibleAmount = 0;
        if (NME_DATA.length > 0) {
            SAP_LowerEligibleAmount = Math.min(eligibleAmount, $("#txtTotalServicesEligibleAmount").val());
            SAP_eligibleAmount = (SAP_LowerEligibleAmount * NME_DATA[0].SAPPercentage) / 100;
            SAP_LowerNME = Math.min(NME_DATA[0].SAPLimit, SAP_eligibleAmount, NME_DATA[0].NME_AMONT);
               // eligibleAmount = eligibleAmount + SAP_LowerNME;
        }
        $("#hdnNMEAmount").val(SAP_LowerNME);
        $('#txtEligibleAmount').val(eligibleAmount);

        //if (parseInt(eligibleAmount) < parseInt(_disallowedAmount)) {
        //    DialogWarningMessage("Eligible amount should be greater than disallowed amount");
        //    $('#txtDisallowedAmount').val('');
        //}
        //else
        if (parseInt(_billAmount) < parseInt(_disallowedAmount)) {
            DialogResultMessage("Bill amount should be greater than disallowed amount");
            $('#txtDisallowedAmount').val('');
        }
        else if (parseInt(_billAmount) < parseInt(eligibleAmount)) {
            DialogResultMessage("Bill amount should be greater than eligible amount");
            $('#txtPackageRate').val('');
        }
        else {
            if ($('#ddlBillingType').val() == 201) {
                $('#txtCodingPayableAmount').val(parseInt(eligibleAmount));
            } else {
                //$('#txtCodingPayableAmount').val(parseInt(eligibleAmount) -parseInt(_disallowedAmount));
                $('#txtCodingPayableAmount').val(parseInt(eligibleAmount));
            }
            if (parseInt(_billAmount) < parseInt(MakeZerofromUndefinedorEmpty($('#txtCodingPayableAmount').val()))) {
                DialogResultMessage("Bill amount should be greater than payable amount");
                $('#txtCodingPayableAmount').val(0);
            }
        }
        if (policyAlimentexpressions.length > 0 && ($("#chkoverridesubpackage").is(':checked') == false) && ($("#chkoverridesubinsured").is(':checked') == false)) {
            var l3ID = $('#ddlProcedureLevel3').val();
            if (l3ID == 526 || l3ID == 527 || l3ID == 1267 || l3ID == 1268 || l3ID == 1269 || l3ID == 1270 || l3ID == 1271 || l3ID == 1272) {
                if (policyAlimentexpressions[0].AlimentExpression != null && policyAlimentexpressions[0].AlimentPower != null) {
                    var alimentex = '';
                    if (policyAlimentexpressions[0].AlimentExpression == 723)
                        alimentex = '>=';
                    else if (policyAlimentexpressions[0].AlimentExpression == 724)
                        alimentex = '>';
                    $('#txtPolicyExpression').val(alimentex);
                    $('#txtPolicyPower').val(policyAlimentexpressions[0].AlimentPower);
                    if ((policyAlimentexpressions[0].AlimentExpression == 723 && policyAlimentexpressions[0].AlimentPower > $('#txtClaimPower').val())
                        || policyAlimentexpressions[0].AlimentExpression == 724 && policyAlimentexpressions[0].AlimentPower >= $('#txtClaimPower').val()) {
                        $('#txtDisallowedAmount').val(_billAmount);
                        $('#txtDiscount').val(0);
                        $('#ddlDeductionReasons').val(14);
                        $('#txtEligibleAmount').val(0);
                        $('#txtCodingPayableAmount').val(0);
                        if (l3ID == 526 || l3ID == 527)
                            DialogWarningMessage("Lasik is not covered for this Power")
                        else if (l3ID == 1267 || l3ID == 1268 || l3ID == 1269 || l3ID == 1270 || l3ID == 1271 || l3ID == 1272)
                            DialogWarningMessage("Over weight and Obesity is not covered for this BMI")
                    }
                }
            }
        }
    }
    else
        DialogResultMessage("Invalid Bill Amount.");
}

function overrideeligibleamount(flag) {
    var isvalid = true;
    if (flag == 1 && iseditcoding == false) {
        if (($("#chkoverridesubpackage").is(':checked') == true)) {

            if ($("#chkoverridesubinsured").is(':checked') == true) {
                DialogWarningMessage("Override suminsured alraedy checked");
                isvalid = false;
            }
            else if (isvalid && iscodingcalculated == false) {
                DialogWarningMessage("Please process coding before override amount");
                isvalid = false;
            }
            //else if (isvalid && MakeZerofromUndefinedorEmpty($('#txtTotalServicesPackageAmount').val() == 0))
            //{
            //    DialogWarningMessage("There is no package amount in billing to override package amount");
            //    isvalid = false;
            //}
            else if (isvalid && $('#ddlTreatmentType').val() == '65') {
                DialogWarningMessage("Over ride package only appicable to surgical");
                isvalid = false;
            }
            else if (isvalid && MakeZerofromUndefinedorEmpty($('#txtEligibleAmount').val()) == 0) {
                DialogWarningMessage("Eligible amount should not be zero to override");
                isvalid = false;
            }
            else if (isvalid && MakeZerofromUndefinedorEmpty($('#txtTotalServicesEligibleAmount').val()) == 0) {
                DialogWarningMessage("Please do open billing to override package amount");
                isvalid = false;
            }
            else if (isvalid && MakeZerofromUndefinedorEmpty($('#txtTotalServicesEligibleAmount').val()) != 0 && MakeZerofromUndefinedorEmpty($('#txtbillingtotalpackageamount').val()) != 0) {
                DialogWarningMessage("you need to do Either package billing or open billing To override package");
                isvalid = false;
            }
            else if (isvalid && MakeZerofromUndefinedorEmpty($('#txtPackageRate').val()) == 0 && MakeZerofromUndefinedorEmpty($('#txtsublimitRate').val()) == 0) {
                DialogWarningMessage("There is no provider package & sublimit for given procedure ");
                isvalid = false;
            }
            else if (isvalid && $('#txtEligibleAmount').val() == $('#hdnCodingProcedureEligibleAmount').val()) {
                DialogWarningMessage("eligible and sublimit amounts are equal");
                isvalid = false;
            }
            else if (isvalid && $('#txtEligibleAmount').val() == $('#hdnCodingProcedureEligibleAmount').val()) {
                DialogWarningMessage("sublimit is less than Package amount you can't override");
                isvalid = false;
            }
            if (isvalid && $('#ddlPriority').val() != 100) {
                DialogWarningMessage("Package override only appicalbe to primary coding");
                isvalid = false;
            }
            if (isvalid) {
                // $('#divtxtAdditionalAmount').show();
                $('#divtxtoverrideremarks').show();
            }
            else {
                $('#chkoverridesubpackage').prop('checked', false);
            }
        }
        else {
            $('#txtAdditionalAmount').val(0);
            $('#divtxtAdditionalAmount').hide();
            $('#ddlAdditonalAmtResason').val('0');
            $('#divtxtoverrideremarks').hide();
            GetPacakageLimitDetails($('#ddlApprovedFacility').val())
        }
    }
    else if (flag == 2 && iseditcoding == false) {
        if (($("#chkoverridesubinsured").is(':checked') == true)) {

            if (($("#chkoverridesubpackage").is(':checked') == true)) {
                DialogWarningMessage("Override package alraedy checked, you cann't override sublimt");
                isvalid = false;
            }
            else if (isvalid && iscodingcalculated == false) {
                DialogWarningMessage("Please process coding before override amount");
                isvalid = false;
            }
            else if (isvalid && $('#ddlTreatmentType').val() == '65') {
                DialogWarningMessage("Over ride sub-limit only appicable to surgical");
                isvalid = false;
            }
            else if (isvalid && MakeZerofromUndefinedorEmpty($('#txtTotalServicesEligibleAmount').val()) == 0) {
                DialogWarningMessage("Please do open billing to override package amount");
                isvalid = false;
            }
            else if (isvalid && MakeZerofromUndefinedorEmpty($('#txtTotalServicesEligibleAmount').val()) != 0 && MakeZerofromUndefinedorEmpty($('#txtbillingtotalpackageamount').val()) != 0) {
                DialogWarningMessage("you need to do Either package billing or open billing To override sub-limit");
                isvalid = false;
            }
            //else if (isvalid && MakeZerofromUndefinedorEmpty($('#txtPackageRate').val()) == 0 && MakeZerofromUndefinedorEmpty($('#txtsublimitRate').val()) == 0) {
            //    DialogWarningMessage("There is no provider package & sublimit for given procedure ");
            //    isvalid = false;
            //}
            else if (isvalid && $('#ddlPriority').val() != 100) {
                DialogWarningMessage("sublimit override only appicalbe to primary coding");
                isvalid = false;
            }
            if (isvalid)
                $('#divtxtoverrideremarks').show();
            else
                $('#chkoverridesubinsured').prop('checked', false);
        }
        else {
            $('#ddlAdditonalAmtResason').val('0');
            $('#divtxtoverrideremarks').hide();
            GetPacakageLimitDetails($('#ddlApprovedFacility').val())
        }
    }
    else if (flag == 3 && iseditcoding == false) {
        if (($("#chkenableopenbilling").is(':checked') == true)) {
            if (($("#chkoverridesubpackage").is(':checked') == true) || ($("#chkoverridesubinsured").is(':checked') == true)) {
                DialogWarningMessage("Override package /Override sub-limit alraedy checked in coding level");
                isvalid = false;
            }
            else if (isvalid && iscodingcalculated == false) {
                DialogWarningMessage("Please process coding before override amount");
                isvalid = false;
            }
            else if (isvalid && MakeZerofromUndefinedorEmpty($('#txtTotalServicesBillAmount').val() == 0)) {
                DialogWarningMessage("there is no open billing for claim, over ride not possible");
                isvalid = false;
            }
            else if (isvalid && ispackagefound == false && $('#txtPackageRate').val() == '' && ($('#hdnCodingProcedureEligibleAmount').val() == '' || $('#hdnCodingProcedureEligibleAmount').val() == null)) {
                DialogWarningMessage("There is no provider package/sublimit for given procedure ");
                isvalid = false;
            }
            if (isvalid)
                $('#divtxtoverrideremarks').show();
            else
                $('#chkenableopenbilling').prop('checked', false);
        }
    }
}

function Autopopulatepackageamount() {
    $('#txtTotalServicesPackageAmount').val($('#txtbillingtotalpackageamount').val());
}

function GetTotalPackageAmount() {
    var data = [];
    if ($('#hdnClaimsCodingDetails').val() != '') {
        data = $.parseJSON($('#hdnClaimsCodingDetails').val());
    }
    var _billAmt = 0;
    $.each(data, function (i, coding) {
        if (coding.PackageRatio != $('#ddlPriority').val())
            _billAmt = parseInt(_billAmt) + parseInt(coding.BillAmount);
    });

    return _billAmt;
}

function ICDCodesAjaxDialog(titletext) {
    //ClearICDCodes();
    $("#dialog-ICDCodes").removeClass('hide').dialog({
        resizable: false,
        width: '880',
        modal: true,
        title: titletext,
        //title:"<div class='widget-header'><h4 class='smaller'><i class='ace-icon fa fa-exclamation-triangle red'></i> Empty the recycle bin?</h4></div>",
        title_html: true,
        buttons: [
            {
                html: "<i class='ace-icon fa fa-chevron-down bigger-110'></i>&nbsp; Add",
                "class": "btn btn-success btn-minier",
                click: function () {
                    //$(this).dialog("close");
                    BindDiseaseCode();
                    return true;
                }
            },
            {
                html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; Cancel",
                "class": "btn btn-danger btn-minier",
                click: function () {
                    $(this).dialog("close");
                    //// Cancel_BillsDialog();
                    return false;
                }
            }
        ]
    });
}

function BindDiseaseCode() {
    //var ID = $('#ddlICDLevel3').val();
    ////$('#txtICDDiseaseCode').val(arry[ID]);
    //$('#hdnICDCodeID').val(ID);
    //var ICDDescription = GetICD10Description(ID);
    //$('#txtICDDiseaseCode').val(arry[ID] + ', ' + ICDDescription);
    //$('#txtICDDiseaseCode').val(arry[ID]);
    //$('#txtICDDiseaseCodeDesc').text(arry[ID] + ', ' + ICDDescription);
    if ($('#ddlICDLevel7').val() != "") {
        var icdID = $('#ddlICDLevel7 option:selected').val();
        var icdDiseaseCodeDesc = $('#ddlICDLevel7 option:selected').text();
        var icdDiseaseCode = icdDiseaseCodeDesc.split('--');
        $('#hdnICDCodeID').val(icdID);
        $('#txtICDDiseaseCode').val(icdDiseaseCode[0].trim());
        $('#txtICDDiseaseCodeDesc').text(icdDiseaseCodeDesc);
    }
    else if ($('#ddlICDLevel6').val() != "") {
        var icdID = $('#ddlICDLevel6 option:selected').val();
        var icdDiseaseCodeDesc = $('#ddlICDLevel6 option:selected').text();
        var icdDiseaseCode = icdDiseaseCodeDesc.split('--');
        $('#hdnICDCodeID').val(icdID);
        $('#txtICDDiseaseCode').val(icdDiseaseCode[0].trim());
        $('#txtICDDiseaseCodeDesc').text(icdDiseaseCodeDesc);
    }
    else if ($('#ddlICDLevel5').val() != "") {
        var icdID = $('#ddlICDLevel5 option:selected').val();
        var icdDiseaseCodeDesc = $('#ddlICDLevel5 option:selected').text();
        var icdDiseaseCode = icdDiseaseCodeDesc.split('--');
        $('#hdnICDCodeID').val(icdID);
        $('#txtICDDiseaseCode').val(icdDiseaseCode[0].trim());
        $('#txtICDDiseaseCodeDesc').text(icdDiseaseCodeDesc);
    }
    else if ($('#ddlICDLevel4').val() != "") {
        var icdID = $('#ddlICDLevel4 option:selected').val();
        var icdDiseaseCodeDesc = $('#ddlICDLevel4 option:selected').text();
        var icdDiseaseCode = icdDiseaseCodeDesc.split('--');
        $('#hdnICDCodeID').val(icdID);
        $('#txtICDDiseaseCode').val(icdDiseaseCode[0].trim());
        $('#txtICDDiseaseCodeDesc').text(icdDiseaseCodeDesc);
    }
    else if ($('#ddlICDLevel3').val() != "") {
        var icdID = $('#ddlICDLevel3 option:selected').val();
        var icdDiseaseCodeDesc = $('#ddlICDLevel3 option:selected').text();
        var icdDiseaseCode = icdDiseaseCodeDesc.split('--');
        $('#hdnICDCodeID').val(icdID);
        $('#txtICDDiseaseCode').val(icdDiseaseCode[0].trim());
        $('#txtICDDiseaseCodeDesc').text(icdDiseaseCodeDesc);
    }
    //sp3v-4520   begin
    else if ($('#ddlICDLevel2').val() != "") {
        var icdID = $('#ddlICDLevel2 option:selected').val();
        var icdDiseaseCodeDesc = $('#ddlICDLevel2 option:selected').text();
        var icdDiseaseCode = icdDiseaseCodeDesc.split('--');
        $('#hdnICDCodeID').val(icdID);
        $('#txtICDDiseaseCode').val(icdDiseaseCode[0].trim());
        $('#txtICDDiseaseCodeDesc').text(icdDiseaseCodeDesc);
    }
    else if ($('#ddlICDLevel1').val() != "") {
        var icdID = $('#ddlICDLevel1 option:selected').val();
        var icdDiseaseCodeDesc = $('#ddlICDLevel1 option:selected').text();
        var icdDiseaseCode = icdDiseaseCodeDesc.split('--');
        $('#hdnICDCodeID').val(icdID);
        $('#txtICDDiseaseCode').val(icdDiseaseCode[0].trim());
        $('#txtICDDiseaseCodeDesc').text(icdDiseaseCodeDesc);
    }
    //else {
    //    var icdID = $('#ddlICDLevel2 option:selected').val();
    //    var icdDiseaseCodeDesc = $('#ddlICDLeve12 option:selected').text();
    //    var icdDiseaseCode = icdDiseaseCodeDesc.split('--');
    //    $('#hdnICDCodeID').val(icdID);
    //    $('#txtICDDiseaseCode').val(icdDiseaseCode[0].trim());
    //    $('#txtICDDiseaseCodeDesc').text(icdDiseaseCodeDesc);
    //}
    //sp3v-4520   end
    //StoreLevelWiseICDCodes();
    ValiadteicdCode();
}

function StoreLevelWiseICDCodes() {
    $('#hdnICDcodeLevelValues').val('');
    var ICDCodeLevelValues = '';
    if ($('#ddlICDLevel1').val() != "") {
        var icdID = $('#ddlICDLevel1 option:selected').val();
        ICDCodeLevelValues = icdID;
    }
    if ($('#ddlICDLevel2').val() != "") {
        var icdID = $('#ddlICDLevel2 option:selected').val();
        ICDCodeLevelValues += "," + icdID;
    }
    if ($('#ddlICDLevel3').val() != "") {
        var icdID = $('#ddlICDLevel3 option:selected').val();
        ICDCodeLevelValues += "," + icdID;
    }
    if ($('#ddlICDLevel4').val() != "") {
        var icdID = $('#ddlICDLevel4 option:selected').val();
        ICDCodeLevelValues += "," + icdID;
    }
    if ($('#ddlICDLevel5').val() != "") {
        var icdID = $('#ddlICDLevel5 option:selected').val();
        ICDCodeLevelValues += "," + icdID;
    }
    if ($('#ddlICDLevel6').val() != "") {
        var icdID = $('#ddlICDLevel6 option:selected').val();
        ICDCodeLevelValues += "," + icdID;
    }
    if ($('#ddlICDLevel7').val() != "") {
        var icdID = $('#ddlICDLevel7 option:selected').val();
        ICDCodeLevelValues += "," + icdID;
    }
    $('#hdnICDcodeLevelValues').val(ICDCodeLevelValues);
}

/* Load Coding Details */
function Retrieve_ClaimsCodingDetails(_ClaimID, _SlNo, _flag, IsFrmArchived) {
    if (_ClaimID != null && _SlNo != null) {

        //SP-1168 (Medical Coding To Be Cloned For All Pre & Post Claims)
        var BasicData = [];
        BasicData = $.parseJSON($("#hdnBasicLoadData").val());
        var _ClaimReqTypeID = BasicData[0].RequestTypeID;
        //End of SP-1168 (Medical Coding To Be Cloned For All Pre & Post Claims)

        if ($('#tblTPAProcedures tbody').children().length == 0) {
            $.ajax({
                type: "GET",
                url: "/MedicalScrutiny/ClaimCodingDetails_Retrieve",
                contentType: 'application/json;charset=utf-8',
                data: { ClaimID: _ClaimID, SlNo: _SlNo, ClaimReqTypeID: _ClaimReqTypeID, IsFrmArchived: $('#hdnIsFrmArchived').val() },
                success: function (data) {
                    data = $.parseJSON(data);

                    //SP-1168 (Medical Coding To Be Cloned For All Pre & Post Claims)
                    var PrevCodingCnt = 0;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].IsPrevCoding == 1) {
                            PrevCodingCnt = PrevCodingCnt + 1;
                        }
                    }
                    if (PrevCodingCnt > 0) {
                        $("#divPrevCodingMsg").show();
                    }
                    else {
                        $("#divPrevCodingMsg").hide();
                    }
                    //End of SP-1168 (Medical Coding To Be Cloned For All Pre & Post Claims)

                    //if (data.length != 0) {                   
                    BindClaimsCodingDetails(data, _flag);
                    //}   

                    //////var codingBillAmount = parseInt(MakeZerofromUndefinedorEmpty($('#txtTotalServicesPackageAmount').val())) + parseInt(MakeZerofromUndefinedorEmpty($('#txtTotalServicesBillAmount').val()));
                    //////if (parseInt(codingBillAmount) != 0)
                    //////    $('#txtCodingBillAmount').val(codingBillAmount);
                    //////else
                    //////    $('#txtCodingBillAmount').val('');

                },
                error: function (e, x) {
                    ShowResultMessage('ErrorMessage', e.responseText);
                }
            });
        }
    }
}

var hdnCodingID = "hdnCodingID_";
function BindClaimsCodingDetails(data, _flag) {
    $('#hdnBillingType').val('');
    $('#hdnClaimsCodingDetails').val('');
    var procdureDetails = [];
    var billingTypeID;
    var surgeriesCount = 0;

    for (var i = 0; i < data.length; i++) {
        var procedure = {};
        // BillTypeIDD = data[i].BillingType_P51;
        ////var level3 = 0;
        ////if (data[i].TPALevel3 != 0)
        ////    level3 = '<td>' + $('#ddlProcedureLevel3 [value="' + data[i].TPALevel3 + '"]').text() + '</td>';
        ////else
        ////    level3 = '<td></td>';
        ////var additionalAmountReson = 0;
        ////if (data[i].TPALevel3 != 0)
        ////    additionalAmountReson = '<td>' + $('#ddlAdditonalAmtResason [value="' + data[i].AdditionalreasonIDs + '"]').text() + '</td>';
        ////else
        ////    additionalAmountReson = '<td>0</td>';
        var TypeOfAnethesia = '';
        if (parseInt(data[i].TypeOfAnesthesiaID) != 0)
            TypeOfAnethesia = $('#ddlAnesthesia [value="' + data[i].TypeOfAnesthesiaID + '"]').text();
        //var icdCode = GetICD10DeseaseCode(data[i].ICDCode);
        //var ICDDescription = GetICD10Description(data[i].ICDCode);
        var icdCode = data[i].DiseaseCode;
        var ICDDescription = data[i].ICDName;
        var _buttions = '';
        if (_flag == 0) {
            _buttions = '';
            //_buttions = '<td><a id="aCodingEdit_' + i + '" onclick="Edit_CodingDetails(' + data[i].PackageRatio + ')" class="btn btn-info">Edit</a></td>'
            //_buttions = '<td class="tdmscodingedit"><a id="aCodingEdit_' + i + '" onclick="Edit_CodingDetails(' + data[i].TPALevel3 + ')" class="btn btn-info">Edit</a></td>'
            //    + '<td class="tdmscodingdelete"><a id="aCodingDelete_' + i + '" onclick="DeleteCodingProcedure_Dialog(' + data[i].PackageRatio + ',' + data[i].TreatementTypeID_19 + ',' + data[i].TPALevel3 + ')" class="btn btn-danger">Delete</a></td>';

            if ($('#hdnClaimStageID').val() == 5 || $('#hdnClaimStageID').val() == 38) {
                _buttions = '<td class="tdmscodingedit"><a id="aCodingEdit_' + i + '" onclick="Edit_CodingDetails(' + data[i].TPALevel3 + ')" class="btn btn-info">Edit</a></td>'
                    + '<td class="tdmscodingdelete"><a id="aCodingDelete_' + i + '" onclick="DeleteCodingProcedure_Dialog(' + data[i].PackageRatio + ',' + data[i].TreatementTypeID_19 + ',' + data[i].TPALevel3 + ')" class="btn btn-danger" enabled="enabled">Delete</a></td>';
            }
            else {
                //_buttions = '<td><a id="aCodingEdit_' + i + '" onclick="Edit_CodingDetails(' + data[i].PackageRatio + ')" class="btn btn-info">Edit</a></td>'
                _buttions = '<td class="tdmscodingedit"><a id="aCodingEdit_' + i + '" onclick="Edit_CodingDetails(' + data[i].TPALevel3 + ')" class="btn btn-info">Edit</a></td>'
                    + '<td class="tdmscodingdelete"><a id="aCodingDelete_' + i + '" onclick="DeleteCodingProcedure_Dialog(' + data[i].PackageRatio + ',' + data[i].TreatementTypeID_19 + ',' + data[i].TPALevel3 + ')" class="btn btn-danger" disabled="disabled">Delete</a></td>';
            }
        }
        //////var vtoolTip = ' <a onclick="CodingEligibilityPopUp(' + data[i].PackageRatio + ',0)" class="show-popup" data-showpopup="13" style="color:#31708f !important;font-size:14px !important;">'
        //////    + '<img src="/Content/images/tool2.png" data-toggle="tooltip" title="" data-original-title="Insurer Code">'
        //////    + '<span style="display:none;" id="spanCodingEligibilityTable_' + data[i].PackageRatio + '"></span></a>';
        //var vtoolTip = ' <a onclick="CodingEligibilityPopUp(' + data[i].PackageRatio + ',0)" class="show-popup" data-showpopup="13" style="color:#31708f !important;font-size:14px !important;">'
        //   + '<img src="/Content/images/tool2.png" data-toggle="tooltip" title="" data-original-title="Insurer Code">'
        //   + '<input type="hidden" id="hdnCodingEligibilityDesign_' + data[i].PackageRatio + '" name="hdnCodingEligibilityDesign" /></a>';
        var vtoolTip = ' <a onclick="CodingEligibilityPopUp(' + data[i].TPALevel3 + ',0)" class="show-popup" data-showpopup="13" style="color:#31708f !important;font-size:14px !important;">'
            + '<img src="/Content/images/tool2.png" data-toggle="tooltip" title="" data-original-title="Insurer Code">'
            + '<input type="hidden" id="hdnCodingEligibilityDesign_' + data[i].TPALevel3 + '" name="hdnCodingEligibilityDesign" /></a>';

        var priority = '';
        if (data[i].PackageRatio == 100)
            priority = 'Primary';
        else if (data[i].PackageRatio == 50)
            priority = 'Secondary';
        else if (data[i].PackageRatio == 25)
            priority = 'Third';
        else if (data[i].PackageRatio == 12.5)
            priority = 'Fourth';

        //var tblBody = '<tr id="trTPAProcedures_' + data[i].PackageRatio + '">'
        var tblBody = '<tr id="trTPAProcedures_' + data[i].TPALevel3 + '">'
            //+ '<td><input type="hidden" id="' + hdnCodingID + data[i].PackageRatio + '" name="' + hdnCodingID + data[i].PackageRatio + '"/></td>'
            + '<td><input type="hidden" id="' + hdnCodingID + data[i].TPALevel3 + '" name="' + hdnCodingID + data[i].TPALevel3 + '"/></td>'
            //+ '<td>' + toolTip + $('#ddlPriority [value="' + data[i].PackageRatio + '"]').text() + '</td>'
            + '<td data-title="Category">' + vtoolTip + priority + '</td>'
            + '<td data-title="Level1">' + getNamepropwithId(data[i].TPALevel1, $.parseJSON(MasterData.mTPAProcedurecs)) + '</td>'
            + '<td data-title="Level2">' + getNamepropwithId(data[i].TPALevel2, $.parseJSON(MasterData.mTPAProcedurecs)) + '</td>'
            + '<td data-title="	Level3">' + getNamepropwithId(data[i].TPALevel3, $.parseJSON(MasterData.mTPAProcedurecs)) + '</td>'
            //+ '<td>' + $('#ddlProcedureLevel3 [value="' + data[i].TPALevel3 + '"]').text() + '</td>'
            //+ level3
            + '<td data-title="	PED">' + data[i].isPED + '</td>'
            + '<td data-title="	Critical Illness">' + data[i].isCI + '</td>'
            + '<td data-title="	Treatment Type">' + $('#ddlTreatmentType [value="' + data[i].TreatementTypeID_19 + '"]').text() + '</td>'/*7*/
            + '<td data-title="	GIPSA Procedure">' + data[i].isGipsa + '</td>'
            + '<td data-title="	DayCare Procedure">' + data[i].isDayCare + '</td>'
            + '<td data-title="	Type Of Anestesia">' + TypeOfAnethesia + '</td>'
            + '<td data-title="	Excluded Items">' + MakeEmptyfromUndefinedorNull(data[i].Exclusions) + '</td>'/*11*/
            + '<td data-title="	Surgery Date">' + MakeEmptyfromUndefinedorNull(data[i].SurgeryDate) + '</td>'
            + '<td data-title="	Package Amount">' + data[i].BillAmount + '</td>'
            + '<td data-title="	Package Rate">' + data[i].PackageRate + '</td>'
            + '<td data-title="	Discount">' + MakeEmptyfromUndefinedorNull(data[i].Discount) + '</td>'
            + '<td data-title="	Eligible Amount">' + MakeEmptyfromUndefinedorNull(data[i].EligibleAmount) + '</td>'
            + '<td data-title="	Disallowed Amount">' + MakeEmptyfromUndefinedorNull(data[i].DisallowedAmount) + '</td>'
            + '<td data-title="	Disallowed Reason">' + MakeEmptyfromUndefinedorNull($('#ddlDeductionReasons option:nth(' + data[i].DisallowedReasonIDs + ')').text().toString()) + '</td>'/*18*/
            + '<td data-title="	Payable Amount">' + data[i].PayableAmount + '</td> '
            + '<td data-title="	Buffer Amount">' + MakeEmptyfromUndefinedorNull(data[i].BufferAmount) + '</td>'
            + '<td data-title="Additional Amount">' + MakeEmptyfromUndefinedorNull(data[i].AdditionalAmount) + '</td>'
            //+ '<td>' + $('#ddlAdditonalAmtResason [value="' + data[i].AdditionalreasonIDs + '"]').text() + '</td>'
            //+ additionalAmountReson
            + '<td data-title="Additional Amount Reason">' + MakeEmptyfromUndefinedorNull(data[i].AdditionalreasonIDs) + '</td>'
            //+ '<td>' + MakeEmptyfromUndefinedorNull(data[i].Copay) + '</td>'        
            + '<td data-title="Remarks">' + MakeEmptyfromUndefinedorNull(data[i].Remarks) + '</td>'
            + '<td data-title="ICD Code">' + icdCode + ', ' + ICDDescription + '</td>'
            + '<td data-title="PCS Code">' + MakeEmptyfromUndefinedorNull(data[i].PCSCode) + '</td>'/*25*/
            + '<td data-title="	Policy Sublimit">' + data[i].PolicySublimit + '</td>'
            + '<td data-title="	Override Package">' + data[i].Overridepackage + '</td>'
            + '<td data-title="	Override Sum insured">' + data[i].Overridesuminsured + '</td>'
            + _buttions
            + '</tr>';
        ////+ '<td><a id="aCodingEdit_' + i + '" onclick="Edit_CodingDetails(' + data[i].PackageRatio + ')" class="btn btn-info">Edit</a></td>'
        ////+ '<td><a id="aCodingDelete_' + i + '" onclick="Delete_CodingDetails(' + data[i].PackageRatio + ')" class="btn btn-danger">Delete</a></td></tr>';

        $('#tblTPAProcedures tbody').append(tblBody);

        //$('#spanCodingEligibilityTable_' + data[i].PackageRatio).html(htmlDecode(data[i].ProcessHTML));
        $('#hdnCodingEligibilityDesign_' + data[i].TPALevel3).val(htmlDecode(data[i].ProcessHTML));

        //$('#' + hdnCodingID + data[i].PackageRatio).val(data[i].ID);
        $('#' + hdnCodingID + data[i].TPALevel3).val(data[i].ID);

        billingTypeID = data[i].BillingType_P51;


        procedure.TPAProcedureID = data[i].TPAProcedureID;
        procedure.TPALevel1 = data[i].TPALevel1;
        procedure.TPALevel2 = data[i].TPALevel2;
        procedure.TPALevel3 = data[i].TPALevel3;
        procedure.PackageRate = data[i].PackageRate;
        procedure.PackageRatio = data[i].PackageRatio;
        procedure.TreatementTypeID_19 = data[i].TreatementTypeID_19;
        procedure.isGipsa = data[i].isGipsa;
        procedure.isDayCare = data[i].isDayCare;
        procedure.isCI = data[i].isCI;
        procedure.isPED = data[i].isPED;
        procedure.TypeOfAnesthesiaID = data[i].TypeOfAnesthesiaID;
        procedure.Exclusions = data[i].Exclusions;
        procedure.SurgeryDate = data[i].SurgeryDate;
        procedure.BillAmount = data[i].BillAmount;
        procedure.DisallowedAmount = data[i].DisallowedAmount;
        procedure.DisallowedReasonIDs = data[i].DisallowedReasonIDs;
        procedure.PayableAmount = data[i].PayableAmount;
        if (data[i].BufferAmount == '')
            procedure.BufferAmount = null;
        else
            procedure.BufferAmount = data[i].BufferAmount;
        procedure.AdditionalreasonIDs = data[i].AdditionalreasonIDs;
        procedure.Discount = data[i].Discount;
        procedure.Copay = data[i].Copay;
        procedure.Remarks = data[i].Remarks;
        procedure.ICDCode = data[i].ICDCode;
        procedure.ICDName = data[i].ICDName;
        procedure.DiseaseCode = data[i].DiseaseCode;
        procedure.PCSCode = data[i].PCSCode;
        procedure.PCSDescription = data[i].PCSDescription;
        procedure.EligibleAmount = data[i].EligibleAmount;
        procedure.AdditionalAmount = data[i].AdditionalAmount;

        procedure.BPCoverageLimit = data[i].BPCoverageLimit;
        procedure.ProcessHTML = htmlDecode(data[i].ProcessHTML);
        procedure.IsGipsaTE = data[i].IsGipsaTE;
        procedure.Overridepackage = data[i].Overridepackage;
        procedure.Overridesuminsured = data[i].Overridesuminsured;
        procedure.PolicySublimit = data[i].PolicySublimit;
        procedure.AlimentExpression = data[i].AlimentExpression;
        procedure.Alimentpower = data[i].Alimentpower;
        procedure.PackageType = data[i].PackageType;
        $('#hdncodingflag').val(data[i].CodingFlag);
        //procedure.PPNCode = data[i].PPNCode;
        //procedure.FHPLCode = data[i].FHPLCode;
        //procedure.FHPLDesc = data[i].FHPLDesc;
        //procedure.PPNDescription = data[i].PPNDescription;
        //procedure.InvestigationID = data[i].InvestigationID;
        //procedure.ProcessHTML = data[i].ProcessHTML;

        procdureDetails.push(procedure);

        if (data[i].TreatementTypeID_19 == 66)
            surgeriesCount = surgeriesCount + 1;
    }

    $('#hdnBillingType').val(billingTypeID);

    if (procdureDetails.length > 0) {
        $('#hdnClaimsCodingDetails').val(JSON.stringify(procdureDetails));
    }


    if (surgeriesCount == 0) {
        $('#ddlPriority').append('<option value="100"> Primary </option>');
    }
    else if (surgeriesCount == 1) {
        $('#ddlPriority').append('<option value="50">Secondary</option>');
    }
    else if (surgeriesCount == 2) {
        $('#ddlPriority').append(' <option value="25">Third</option>');
    }
    else if (surgeriesCount == 3) {
        $('#ddlPriority').append(' <option value="12.5">Fourth</option>');
    }
    $("#ddlBilltype").html(getNamepropwithId($('#hdnBillingType').val(), MasterData.claimsBillingType));

    ////if (procdureDetails.length == 0) {
    ////    $('#ddlPriority').append('<option value="100"> Primary </option>');
    ////}
    ////else if (procdureDetails.length == 1) {
    ////    $('#ddlPriority').append('<option value="50">Secondary</option>');
    ////}
    ////else if (procdureDetails.length == 2) {
    ////    $('#ddlPriority').append(' <option value="25">Third</option>');       
    ////}
    ////else if (procdureDetails.length == 3) {
    ////    $('#ddlPriority').append(' <option value="12.5">Fourth</option>');         
    ////}   

}

function ConvertToTrueFalse(val) {
    if (val == 1) {
        return true;
    }
    else {
        return false;
    }
}

if ($('#hdnClaimStageID').val() == 4 || $('#hdnClaimStageID').val() == 5) {
    $('#payeename_hide').hide();
}

if ($('#hdnClaimStageID').val() != 4) {
    $('#score123').show();
}

/* Add Coding Details*/
function AddClaimICDProcedure() {
    if (Validate_AddClaimICDProcedure()) {
        var DeductionReason = '';
        var Exclusions = '';
        var additionalAmountReason = '';
        //var Level3 = '';
        var isPriorityAvailable = false;
        var procdureDetails = [];
        if ($('#hdnClaimsCodingDetails').val() != '') {
            procdureDetails = $.parseJSON($('#hdnClaimsCodingDetails').val());
        }
        ////var Priority = $('#ddlPriority option:selected').val();
        ////$.each(procdureDetails, function (i, coding) {
        ////    if (coding.PackageRatio == Priority) {
        ////        $('#trTPAProcedures_' + Priority).remove();
        ////        procdureDetails.splice(i, 1);
        ////        return false;
        ////    }
        ////});

        ////if ($('#ddlProcedureLevel3').val() != 0)
        ////    Level3 = $('#ddlProcedureLevel3 option:selected').text();
        var ProcedureLevel3 = '';

        ProcedureLevel3 = $('#ddlProcedureLevel3').val();

        var _sCount = 0;
        $.each(procdureDetails, function (i, coding) {
            if (coding.TreatementTypeID_19 == 66) {
                _sCount = _sCount + 1;
            }
        });

        if (_isCodingEdit == false) {
            if (_sCount >= 4) {
                DialogErrorMessage('You Can not Add more than 4 surgery Procedures.');
                return;
            }
        }

        var ProcedureLevel1 = $('#ddlProcedureLevel1').val();
        var ProcedureLevel2 = $('#ddlProcedureLevel2').val();
        var TreatmentType = $('#ddlTreatmentType').val();

        if ($('#txtPackageRate').val() == '' || $('#txtPackageRate').val() == null) {
            DialogErrorMessage('Please click on process button');
            return;
        }


        ////if ($('#ddlAdditonalAmtResason').val() != 0)
        ////    additionalAmountReason = $('#ddlAdditonalAmtResason option:selected').text(); 

        //if ($('#ddlBillingType').val() == 0) {
        //    DialogErrorMessage('Please Select BillingType'); return;      
        //}
        if ($('#ddlTreatmentType').val() == 66) {
            if ($('#ddlPriority').val() == 0) {
                DialogErrorMessage('Please Select Priority'); return;
            }
        }
        if (ProcedureLevel1 == 0) {
            DialogErrorMessage('Please Select ProcedureLevel1'); return;
        }
        if (ProcedureLevel2 == 0) {
            DialogErrorMessage('Please Select ProcedureLevel2'); return;
        }
        if (ProcedureLevel3 == 0) {
            DialogErrorMessage('Please Select ProcedureLevel3'); return;
        }
        if (TreatmentType == 0) {
            DialogErrorMessage('Please Select TreatmentType'); return;
        }
        if ($('#txtCodingBillAmount').val() == "") {
            DialogErrorMessage('Please Enter BillAmount'); return;
        }
        if ($('#txtICDDiseaseCode').val() == "") {
            DialogErrorMessage('Please Enter ICDDiseaseCode'); return;
        }
        else if ($('#txtICDDiseaseCode').val() != "") {
            if ($('#hdnICDCodeID').val() == "") {
                DialogErrorMessage('The mapped ICD code is not found in the ICD Master');
                return;
            }
        }
        //$('#hdnTypeofTreatment').val(65)

        if ($('#hdnTypeofTreatment').val() == 66) {
            if ($('#txtCodingPCSCode').val() == "") {
                DialogErrorMessage('Please Provide PCS Code'); return;
            }
            else if ($('#txtCodingPCSCode').val() != "") {
                if ($('#hdnPCSCodeID').val() == "") {
                    DialogErrorMessage('The Mapped PCS Code is not found in the PCS Master');
                    return;
                }
            }
        }

        ////var rowCount = $('#tblTPAProcedures tbody').length;
        ////if (rowCount > 4) {
        ////    DialogErrorMessage('You Can not Add more than 4 Procedures');
        ////    return;
        ////}

        var flagDuplicate = false;
        if (_isCodingEdit == true) {
            $.each(procdureDetails, function (i, coding) {
                if (coding.TPALevel3 == _oldTPAProcedureLeve3) {
                    $('#trTPAProcedures_' + _oldTPAProcedureLeve3).remove();
                    procdureDetails.splice(i, 1);
                    return false;
                }
            });

            $('#hdnClaimsCodingDetails').val(JSON.stringify(procdureDetails));
        }
        else {
            $.each(procdureDetails, function (i, coding) {
                if (coding.TPALevel3 == ProcedureLevel3) {
                    flagDuplicate = true;
                    return false;
                }
            });
        }


        if (flagDuplicate == true) {
            DialogErrorMessage('The same procedure (Level3) is already existing. Duplicate procedure is not allowed.');
            return;
        }

        //var ICDDescription = GetICD10Description($('#hdnICDCodeID').val());

        var ICDName = "", ICDDiseaseCode = "";
        if ($('#txtICDDiseaseCodeDesc').text().trim() != "" && $('#txtICDDiseaseCodeDesc').text().toUpperCase() != "NULL" && $('#txtICDDiseaseCodeDesc').text() != null) {
            //var objICD = $('#txtICDDiseaseCodeDesc').text().split(',');
            //ICDDiseaseCode = objICD[0].trim();
            //ICDName = objICD[1].trim();
            ICDName = $('#hdnAddICDName').val();
            ICDDiseaseCode = $('#hdnAddICDDiseaseCode').val();
        }

        var ProcedureID = null;
        ////$("#divTPAProcedures").css("display", "");
        //var ProcedureID = $('#ddlProcedureLevel3').val() != 0 ? $('#ddlProcedureLevel3').val() : ($('#ddlProcedureLevel2').val() != 0 ? $('#ddlProcedureLevel2').val() : $('#ddlProcedureLevel1').val());
        // ProcedureID = ProcedureID == 0 ? $('#ddlProcedureLevel1').val() : 0;
        if ($('#ddlProcedureLevel3').val() != 0 && $('#ddlProcedureLevel3').val() != '' && $('#ddlProcedureLevel3').val() != null)
            ProcedureID = $('#ddlProcedureLevel3').val();
        else if ($('#ddlProcedureLevel2').val() != 0 && $('#ddlProcedureLevel2').val() != '' && $('#ddlProcedureLevel2').val() != null)
            ProcedureID = $('#ddlProcedureLevel2').val();

        var isGipsa = 0
        if ($("#chkCodingIsGIPSA").is(':checked') == true)
            isGipsa = 1;

        var isCI = 0;
        if ($("#chkCriticalIllNess").is(':checked') == true)
            isCI = 1;

        var isPED = 0;
        if ($("#chkCodingIsPED").is(':checked') == true)
            isPED = 1;

        var isDayCare = 0;
        if ($("#chkCodingDayCare").is(':checked') == true)
            isDayCare = 1;

        if ($('#ddlDeductionReasons').val() != null) {
            //DeductionReason = $('#ddlDeductionReasons').val().toString();
            DeductionReason = $('#ddlDeductionReasons :selected').text().toString()
        }

        if ($('#ddlExclusions').val() != null) {
            Exclusions = $('#ddlExclusions').val().toString();
        }
        var Overridepackage = 0;
        if ($("#chkoverridesubpackage").is(':checked') == true)
            Overridepackage = 1;

        var Overridesuminsured = 0;
        if ($("#chkoverridesubinsured").is(':checked') == true)
            Overridesuminsured = 1;

        var procedure = {
        };

        procedure.TPAProcedureID = ProcedureID;
        procedure.TPALevel1 = $('#ddlProcedureLevel1').val();
        procedure.TPALevel2 = $('#ddlProcedureLevel2').val();
        procedure.TPALevel3 = $('#ddlProcedureLevel3').val();
        //if ($('#ddlProcedureLevel3').val() != 0)
        //    procedure.TPALevel3 = $('#ddlProcedureLevel3').val();
        //else
        //    procedure.TPALevel3 = null;
        procedure.PackageRate = $('#txtPackageRate').val();
        if ($('#ddlTreatmentType').val() == 65) {
            procedure.PackageRatio = 100;
        }
        else {
            procedure.PackageRatio = $('#ddlPriority').val();
        }
        procedure.TreatementTypeID_19 = TreatmentType;
        procedure.isGipsa = isGipsa;
        procedure.isDayCare = isDayCare;
        procedure.isCI = isCI;
        procedure.isPED = isPED;
        procedure.TypeOfAnesthesiaID = $('#ddlAnesthesia').val();
        procedure.Exclusions = MakeNullfromUndefinedorEmpty(Exclusions);
        procedure.SurgeryDate = MakeNullfromUndefinedorEmpty($('#txtSurgeryDate').val());
        procedure.BillAmount = $('#txtCodingBillAmount').val();
        procedure.DisallowedAmount = MakeNullfromUndefinedorEmpty($('#txtDisallowedAmount').val());
        procedure.DisallowedReasonIDs = MakeNullfromUndefinedorEmpty($('#ddlDeductionReasons').val());
        procedure.PayableAmount = $('#txtCodingPayableAmount').val();
        procedure.BufferAmount = MakeNullfromUndefinedorEmpty($('#txtBufferAmount').val());
        if ($('#ddlAdditonalAmtResason').val() != 0)
            procedure.AdditionalreasonIDs = $('#ddlAdditonalAmtResason').val();
        else
            procedure.AdditionalreasonIDs = null;
        //procedure.AdditionalreasonIDs = MakeNullfromUndefinedorEmpty($('#txtCodingDisallowedAmountReason').val());
        procedure.Discount = MakeNullfromUndefinedorEmpty($('#txtDiscount').val());
        procedure.Copay = MakeNullfromUndefinedorEmpty($('#txtCodingCopay').val());
        procedure.Remarks = $('#txtCodingRemarks').val();
        procedure.ICDCode = $('#hdnICDCodeID').val();
        procedure.ICDName = ICDName;
        procedure.DiseaseCode = ICDDiseaseCode;
        procedure.PCSCode = $('#hdnPCSCodeID').val(); //$('#txtCodingPCSCode').val().split(':')[0].trim();//pcscodeid;//$('#txtCodingPCSCode').val();
        procedure.PCSDescription = $('#txtCodingPCSCodeDesc').text();
        procedure.EligibleAmount = MakeNullfromUndefinedorEmpty($('#txtEligibleAmount').val());
        procedure.AdditionalAmount = MakeNullfromUndefinedorEmpty($('#txtAdditionalAmount').val());
        procedure.BPCoverageLimit = MakeNullfromUndefinedorEmpty($('#hdnCodingProcedureEligibleAmount').val());
        procedure.ProcessHTML = $('#spanTopCodingEligibilityTable').html();
        procedure.Overridepackage = Overridepackage;
        procedure.Overridesuminsured = Overridesuminsured;
        procedure.PolicySublimit = MakeNullfromUndefinedorEmpty($('#txtsublimitRate').val());
        procedure.AlimentExpression = MakeNullfromUndefinedorEmpty($('#txtClaimExpression').val());
        //if ($('#txtClaimPower').val() == ' ') $('#txtClaimPower').val('');
        var claimpower = $('#txtClaimPower').val();
        claimpower = claimpower.replace(/\s/g, '');
        procedure.Alimentpower = MakeNullfromUndefinedorEmpty(claimpower);
        //procedure.Overridecodingremarks = $('#txtcodingoverrideremarks').val();
        //procedure.ProcessHTML = $('#hdnCodingEligibilityDesign').val();

        procedure.PackageType = $("#ddlPackageType").val()

        procdureDetails.push(procedure);
        $('#hdnBillingType').val($('#ddlBillingType').val());
        $('#hdnClaimsCodingDetails').val(JSON.stringify(procdureDetails));

        var TypeOfAnethesia = '';
        if (parseInt($('#ddlAnesthesia').val()) != 0)
            TypeOfAnethesia = $('#ddlAnesthesia option:selected').text();

        //////var vtoolTip = ' <a onclick="CodingEligibilityPopUp(' + $('#ddlPriority').val() + ',0)" class="show-popup" data-showpopup="13" style="color:#31708f !important;font-size:14px !important;">'
        //////    + '<img src="/Content/images/tool2.png" data-toggle="tooltip" title="" data-original-title="Insurer Code">'
        //////    + '<span style="display:none;" id="spanCodingEligibilityTable_' + $('#ddlPriority').val() + '">' + $('#spanTopCodingEligibilityTable').html() + '</span></a>';

        //var vtoolTip = ' <a onclick="CodingEligibilityPopUp(' + $('#ddlPriority').val() + ',0)" class="show-popup" data-showpopup="13" style="color:#31708f !important;font-size:14px !important;">'
        //    + '<img src="/Content/images/tool2.png" data-toggle="tooltip" title="" data-original-title="Insurer Code">'
        //    + '<input type="hidden" id="hdnCodingEligibilityDesign_' + $('#ddlPriority').val() + '" name="hdnCodingEligibilityDesign" /></a>';

        var vtoolTip = ' <a onclick="CodingEligibilityPopUp(' + $('#ddlProcedureLevel3').val() + ',0)" class="show-popup" data-showpopup="13" style="color:#31708f !important;font-size:14px !important;">'
            + '<img src="/Content/images/tool2.png" data-toggle="tooltip" title="" data-original-title="Insurer Code">'
            + '<input type="hidden" id="hdnCodingEligibilityDesign_' + $('#ddlProcedureLevel3').val() + '" name="hdnCodingEligibilityDesign" /></a>';


        //$('#hdnCodingEligibilityDesign').val('');

        var codingdisablecheck = null;
        if ($('#hdnClaimStageID').val() == 5 || $('#hdnClaimStageID').val() == 24 || $('#hdnClaimStageID').val() == 38)
            codingdisablecheck = '<td class="tdmscodingdelete"><a onclick="DeleteCodingProcedure_Dialog(' + $('#ddlPriority').val() + ',' + $('#ddlTreatmentType').val() + ',' + $('#ddlProcedureLevel3').val() + ')" class="btn btn-danger" >Delete  </a></td></tr>';/*28*/
        else
            codingdisablecheck = '<td class="tdmscodingdelete"><a onclick="DeleteCodingProcedure_Dialog(' + $('#ddlPriority').val() + ',' + $('#ddlTreatmentType').val() + ',' + $('#ddlProcedureLevel3').val() + ')" class="btn btn-danger" disabled= "disabled" >Delete  </a></td></tr>';/*28*/

        //var tblBody = '<tr id="trTPAProcedures_' + $('#ddlPriority').val() + '">'
        var tblBody = '<tr id="trTPAProcedures_' + $('#ddlProcedureLevel3').val() + '">'
            //+ '<td><input type="hidden" id="' + hdnCodingID + $('#ddlPriority').val() + '" name="' + hdnCodingID + $('#ddlPriority').val() + '"/></td>'
            + '<td><input type="hidden" id="' + hdnCodingID + $('#ddlProcedureLevel3').val() + '" name="' + hdnCodingID + $('#ddlProcedureLevel3').val() + '"/></td>'
            + '<td>' + vtoolTip + ' ' + $('#ddlPriority option:selected').text() + '</td>'
            + '<td>' + $('#ddlProcedureLevel1 option:selected').text() + '</td>'
            + '<td>' + $('#ddlProcedureLevel2 option:selected').text() + '</td>'
            + '<td>' + $('#ddlProcedureLevel3 option:selected').text() + '</td>'
            //+ '<td>' + Level3 + '</td>'
            + '<td>' + $("#chkCodingIsPED").is(':checked') + '</td>'
            + '<td>' + $("#chkCriticalIllNess").is(':checked') + '</td>'
            + '<td>' + $('#ddlTreatmentType option:selected').text() + '</td>'/*7*/
            + '<td>' + $("#chkCodingIsGIPSA").is(':checked') + '</td>'
            + '<td>' + $("#chkCodingDayCare").is(':checked') + '</td>'
            + '<td>' + TypeOfAnethesia + '</td>'
            + '<td>' + Exclusions + '</td>'
            + '<td>' + $('#txtSurgeryDate').val() + '</td>'/*12*/
            + '<td>' + $('#txtCodingBillAmount').val() + '</td>'
            + '<td>' + $('#txtPackageRate').val() + '</td>'
            + '<td>' + $('#txtDiscount').val() + '</td>'
            + '<td>' + $('#txtEligibleAmount').val() + '</td>'
            + '<td>' + $('#txtDisallowedAmount').val() + '</td>'/*17*/
            + '<td>' + DeductionReason + '</td>'
            + '<td>' + $('#txtCodingPayableAmount').val() + '</td>'
            + '<td>' + $('#txtBufferAmount').val() + '</td>'
            + '<td>' + $('#txtCodingAdditionalAmount').val() + '</td>'/*21*/
            + '<td>' + $('#txtCodingDisallowedAmountReason').val() + '</td>'
            //+ '<td>' + additionalAmountReason + '</td>'
            //+ '<td>' + $('#txtCodingCopay').val() + '</td>'
            + '<td>' + $('#txtCodingRemarks').val() + '</td>'
            + '<td>' + $('#txtICDDiseaseCode').val() + '</td>'
            + '<td>' + $('#txtCodingPCSCode').val() + '</td>'/*25*/
            + '<td>' + $('#txtsublimitRate').val() + '</td>'
            + '<td>' + $("#chkoverridesubpackage").is(':checked') + '</td>'
            + '<td>' + $("#chkoverridesubinsured").is(':checked') + '</td>'
            // + '<td><a onclick="Edit_CodingDetails(' + $('#ddlPriority').val() + ')" class="btn btn-info">Edit</a></td>'
            + '<td class="tdmscodingedit"><a onclick="Edit_CodingDetails(' + $('#ddlProcedureLevel3').val() + ')" class="btn btn-info">Edit</a></td>'
            + codingdisablecheck;

        $('#tblTPAProcedures tbody').append(tblBody);

        $('#hdnCodingEligibilityDesign_' + $('#ddlProcedureLevel3').val()).val($('#spanTopCodingEligibilityTable').html());
        $('#spanTopCodingEligibilityTable').html('');

        $('#' + hdnCodingID + $('#ddlProcedureLevel3').val()).val(0);

        _isCodingEdit = false;

        $("#divClaimsCoding").find(".dropdown").each(function () {
            $("#" + this.id + "").val(0);
        });

        $("#divClaimsCoding").find('input[type="text"]').each(function () {
            $("#" + this.id).val('');
        });

        $("#divClaimsCoding").find('input[type="checkbox"]').each(function () {
            $("#" + this.id).attr('checked', false);
        });

        var surgeriesCount = 0;
        $.each(procdureDetails, function (i, coding) {
            if (coding.TreatementTypeID_19 == 66) {
                surgeriesCount = surgeriesCount + 1;
            }
        });

        if (surgeriesCount == 1) {
            $("#ddlPriority option[value='100']").remove();
            $('#ddlPriority').append('<option value="50">Secondary</option>');
        }
        else if (surgeriesCount == 2) {
            $("#ddlPriority option[value='50']").remove();
            $('#ddlPriority').append(' <option value="25">Third</option>');
        }
        else if (surgeriesCount == 3) {
            $("#ddlPriority option[value='25']").remove();
            $('#ddlPriority').append(' <option value="12.5">Fourth</option>');
        }
        else if (surgeriesCount == 4) {
            $("#ddlPriority option[value='12.5']").remove();
        }

        ////if (procdureDetails.length == 1) {
        ////    $("#ddlPriority option[value='100']").remove();
        ////    $('#ddlPriority').append('<option value="50">Secondary</option>');
        ////}
        ////else if (procdureDetails.length == 2) {
        ////    $("#ddlPriority option[value='50']").remove();
        ////    $('#ddlPriority').append(' <option value="25">Third</option>');
        ////}
        ////else if (procdureDetails.length == 3) {
        ////    $("#ddlPriority option[value='25']").remove();
        ////    $('#ddlPriority').append(' <option value="12.5">Fourth</option>');
        ////}
        ////else if (procdureDetails.length == 4) {
        ////    $("#ddlPriority option[value='12.5']").remove();
        ////}


        //var codingBillAmount = parseInt(MakeZerofromUndefinedorEmpty($('#txtTotalServicesPackageAmount').val())) + parseInt(MakeZerofromUndefinedorEmpty($('#txtTotalServicesBillAmount').val()));
        //if (parseInt(codingBillAmount) != 0)
        //    $('#txtCodingBillAmount').val(codingBillAmount);
        //else
        $('#txtCodingBillAmount').val(0);
        $('#txtDisallowedAmount').removeAttr("disabled", false);
        ClearICDCodes();
    }
}

function CodingEligibilityPopUp(_spanEligibility, flag) {
    $('#divCodingEligibilityPopUp').html('');
    if (flag == 0) {
        //$('#divCodingEligibilityPopUp').html($('#spanCodingEligibilityTable_' + _spanEligibility).html());
        $('#divCodingEligibilityPopUp').html($('#hdnCodingEligibilityDesign_' + _spanEligibility).val());
    }
    else {
        $('#divCodingEligibilityPopUp').append($('#' + _spanEligibility).html());
    }

    $("#divCodingEligibilityPopUpHead").css({ "display": "block", "width": "100%", "height": "100%", "z-index": "1000", "background": "#000", "background": "rgba(0,0,0,0.75)" });

}

function Validate_AddClaimICDProcedure() {
    var flag = true;
    var _billAmt = GetTotalPackageAmount();

    if ($("#ddlPackageType").val() == 0 && ($("#hdnRequestTypeID").val() == 3 || $('#hdnRequestTypeID').val() == 4)) {
        DialogWarningMessage(" Please select Treatment charged as a Package ");
        $('#lblPackageType').css('background-color', 'yellow');
        flag = false;
        return flag;
    }
    if ($('#txtCodingBillAmount').val() == 0 || $('#txtCodingBillAmount').val() == '') {
        DialogResultMessage("Invalid Bill Amount");
        flag = false;
        return flag;
    }
    if (basicData[0].claimdiagnosis == 469 && $('#ddlProcedureLevel1').val() != 401 && $('#ddlPriority').val() == 100) { // added by vydehi 
        DialogWarningMessage(" As it is selected as Maternity claim please do Maternity coding ");
        flag = false;
        return;
    }
    if (basicData[0].claimdiagnosis == 466 && $('#ddlProcedureLevel1').val() != 494 && $('#ddlPriority').val() == 100) { // added by vydehi
        DialogWarningMessage(" As it is selected as Catract claim please do Catract coding ");
        flag = false;
        return;
    }

    // ClaimAI: package amount validation removed — amounts validated by AI
    ////else {
    ////    $('#hdnTotalPackageEligibleAmt').val($('#txtCodingBillAmount').val());
    ////}

    if (flag == false) {
        $('#txtCodingBillAmount').val(0);
        $('#txtEligibleAmount').val(0);
        $('#txtCodingPayableAmount').val(0);
    }
    flag = ValiadteicdCode(); // added by vsvskprasad 4261
    return flag;
}

var _isCodingEdit = false;
var iscodingflag = false;
var _oldTPAProcedureLeve3 = 0;
function Edit_CodingDetails(_ProcedureLevel3) {
    //var index = $(this).parent().index();
    iseditcoding = true;
    var _priority = '';
    $("#divClaimsCoding").find(".dropdown").each(function () {
        $("#" + this.id + "").val(0);
    });
    $("#divClaimsCoding").find('input[type="text"]').each(function () {
        $("#" + this.id).val(' ');
    });
    $("#divClaimsCoding").find('input[type="checkbox"]').each(function () {
        $("#" + this.id).attr('checked', false);
    });

    var data = [];
    if ($('#hdnClaimsCodingDetails').val() != '') {
        data = $.parseJSON($('#hdnClaimsCodingDetails').val());
    }
    for (var i = 0; i < data.length; i++) {
        //if (data[i].PackageRatio == _priority) {
        _priority = data[i].PackageRatio;
        if (data[i].TPALevel3 == _ProcedureLevel3) {
            _oldTPAProcedureLeve3 = _ProcedureLevel3;
            _isCodingEdit = true;
            //var icdCode = GetICD10DeseaseCode(data[i].ICDCode);
            //var ICDDescription = GetICD10Description(data[i].ICDCode);
            var icdCode = data[i].DiseaseCode;
            var ICDDescription = data[i].ICDName;
            $('#ddlTreatmentType').val(data[i].TreatementTypeID_19);
            LoadTPAProcedures(0, "#ddlProcedureLevel1");
            $('#ddlBillingType').val($('#hdnBillingType').val());
            $('#ddlProcedureLevel1').val(data[i].TPALevel1);
            var ID = $('#ddlProcedureLevel1').val();
            if (ID != 0)
                LoadTPAProcedures(ID, '#ddlProcedureLevel2');

            $('#ddlProcedureLevel2').val(data[i].TPALevel2);
            var ID1 = $('#ddlProcedureLevel2').val();
            if (ID1 != 0)
                LoadTPAProcedures(ID1, '#ddlProcedureLevel3');

            $('#ddlProcedureLevel3').val(data[i].TPALevel3);
            var ID = data[i].TPALevel3
            var _issueID = basicData[0].IssueID;
            //GettingCodesBasedonProcID(ID, _issueID);

            if (data[0].isPED == true)
                $("#chkCodingIsPED").trigger('click');
            if (data[0].isCI == true)
                $("#chkCriticalIllNess").trigger('click');
            if (data[0].isGipsa == true) {
                $("#chkCodingIsGIPSA").trigger('click');
                $("#ddlPackageType").val(1);
            }

            if (data[0].isDayCare == true)
                $("#chkCodingDayCare").trigger('click');

            $('#txtICDDiseaseCodeDesc').text(icdCode + ', ' + ICDDescription);
            $('#txtCodingPCSCodeDesc').text(data[i].PCSCode + ', ' + data[i].PCSDescription);
            $('#txtCodingFHPLCode').text(data[i].FHPLCode + ', ' + data[i].FHPLDesc);
            $('#txtCodingPPNCode').text(data[i].PPNCode + ', ' + data[i].PPNDescription);
            $('#txtCodingInvestn').text(data[i].InvestigationID);

            $('#ddlAnesthesia').val(data[i].TypeOfAnesthesiaID);
            LoadSumoselectCheckbox(data[i].Exclusions, 'ddlExclusions');
            JSONDate(data[i].SurgeryDate, 'txtSurgeryDate');
            $('#txtCodingBillAmount').val(data[i].BillAmount);
            $('#txtPackageRate').val(data[i].PackageRate);
            $('#txtDiscount').val(data[i].Discount);
            $('#txtEligibleAmount').val(data[i].EligibleAmount);
            $('#txtDisallowedAmount').val(data[i].DisallowedAmount);
            //LoadSumoselectCheckbox(data[i].DisallowedReasonIDs, 'ddlDeductionReasons');
            $('#ddlDeductionReasons').val(data[i].DisallowedReasonIDs);
            $('#txtCodingPayableAmount').val(data[i].PayableAmount);
            $('#txtBufferAmount').val(data[i].BufferAmount);
            if (Makezerofromnullorundefined(data[i].AdditionalAmount) != 0) {
                $('#divtxtAdditionalAmount').show();
                $('#txtAdditionalAmount').val(data[i].AdditionalAmount);
            }
            else
                $('#divtxtAdditionalAmount').hide();
            //$('#ddlAdditonalAmtResason').val(data[i].AdditionalreasonIDs);
            $('#txtCodingDisallowedAmountReason').val(data[i].AdditionalreasonIDs);
            $('#txtCodingRemarks').val(data[i].Remarks);
            $('#txtCodingCopay').val(data[i].Copay);
            $('#txtICDDiseaseCodeDesc').text(icdCode + ', ' + ICDDescription);
            $('#txtICDDiseaseCode').val(data[i].ICDCode);
            $('#txtCodingPCSCode').text(data[i].PCSCode);
            $('#hdnICDCodeID').val(data[0].ICDCode);
            $('#txtsublimitRate').val(data[i].PolicySublimit);
            $('#ddlPackageType').val(data[i].PackageType);
            if (data[0].isGipsa == true) {
                $("#ddlPackageType").val(1);
            }
            if (data[0].Overridepackage == true)
                $("#chkoverridesubpackage").trigger('click');
            if (data[0].Overridesuminsured == true)
                $("#chkoverridesubinsured").trigger('click');
            if (data[i].AdditionalreasonIDs != '0' && data[i].AdditionalreasonIDs != null) {
                $('#divtxtoverrideremarks').show();
                $('#ddlAdditonalAmtResason').val(data[i].AdditionalreasonIDs);
            }
            if (_ProcedureLevel3 == 526 || _ProcedureLevel3 == 527 || _ProcedureLevel3 == 1267 || _ProcedureLevel3 == 1268 || _ProcedureLevel3 == 1269 || _ProcedureLevel3 == 1270 || _ProcedureLevel3 == 1271 || _ProcedureLevel3 == 1272) {
                $('#divAlimentExpressions').show();
                $('#txtClaimExpression').val(data[i].AlimentExpression);
                $('#txtClaimPower').val(data[i].Alimentpower);

            }
            iseditcoding = false;
            ClearICDCodes();
            ValiadteicdCodeICD();
            break;
        }
    }

    if ($('#ddlTreatmentType').val() == 66) {

        $("#ddlPriority option[value='100']").remove();
        $("#ddlPriority option[value='50']").remove();
        $("#ddlPriority option[value='25']").remove();
        $("#ddlPriority option[value='12.5']").remove();


        if (parseInt(_priority) == 100)
            $('#ddlPriority').append('<option value="100"> Primary </option>');
        else if (parseInt(_priority) == 50)
            $('#ddlPriority').append('<option value="50">Secondary</option>');
        else if (parseInt(_priority) == 25)
            $('#ddlPriority').append(' <option value="25">Third</option>');
        else if (parseInt(_priority) == 12.5)
            $('#ddlPriority').append(' <option value="12.5">Fourth</option>');
    }
    $('#ddlPriority').val(data[i].PackageRatio);
    iscodingflag = true;
}

function DeleteCodingProcedure_Dialog(priority, TreatementTypeID_19, ProcedureLevel3) {
    CodingProcedure_DeleteDialog('The selected Procedure and respective below child level Procedures will be deleted PERMANENTLY. Would you like to proceed?', 'Coding procedure delete', Delete_CodingDetails, null, priority, TreatementTypeID_19, ProcedureLevel3);
}

function CodingProcedure_DeleteDialog(innertext, titletext, successmethod, errormethod, _priority, TreatementTypeID_19, ProcedureLevel3) {
    //e.preventDefault();
    $('#dialogInnerText').text(innertext);
    $("#dialog-confirm").removeClass('hide').dialog({
        resizable: false,
        width: '320',
        modal: true,
        title: titletext,
        //title:"<div class='widget-header'><h4 class='smaller'><i class='ace-icon fa fa-exclamation-triangle red'></i> Empty the recycle bin?</h4></div>",
        title_html: true,
        buttons: [
            {
                html: "<i class='ace-icon fa fa-check-o bigger-110'></i>&nbsp; Confirm",
                "class": "btn btn-danger btn-minier",
                click: function () {
                    $(this).dialog("close");
                    if (successmethod != null) successmethod(_priority, TreatementTypeID_19, ProcedureLevel3);
                    return true;

                }
            }
            ,
            {
                html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; Cancel",
                "class": "btn btn-minier",
                click: function () {
                    $(this).dialog("close");
                    if (errormethod != null) errormethod();
                    return false;
                }
            }
        ]
    });
}

function Delete_CodingDetails(_priority, TreatementTypeID_19, _TPALevel3) {
    var IDs = 0;
    var data = [];
    if ($('#hdnClaimsCodingDetails').val() != '') {
        data = $.parseJSON($('#hdnClaimsCodingDetails').val());
    }

    if (TreatementTypeID_19 == 66) {

        if (parseInt(_priority) == 100) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].TreatementTypeID_19 == 66) {
                    if (parseInt($('#' + hdnCodingID + data[i].TPALevel3).val()) != 0) {
                        if (IDs == 0)
                            IDs = $('#' + hdnCodingID + data[i].TPALevel3).val();
                        else
                            IDs = IDs + ',' + $('#' + hdnCodingID + data[i].TPALevel3).val();
                    }
                }
            }
        }
        else if (parseInt(_priority) == 50) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].TreatementTypeID_19 == 66) {
                    if (parseInt(data[i].PackageRatio) != 100) {
                        if (parseInt($('#' + hdnCodingID + data[i].TPALevel3).val()) != 0) {
                            if (IDs == 0)
                                IDs = $('#' + hdnCodingID + data[i].TPALevel3).val();
                            else
                                IDs = IDs + ',' + $('#' + hdnCodingID + data[i].TPALevel3).val();
                        }
                    }
                }
            }
        }
        else if (parseInt(_priority) == 25) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].TreatementTypeID_19 == 66) {
                    if (parseInt(data[i].PackageRatio) == 25 || parseInt(data[i].PackageRatio) == 12.5) {
                        if (parseInt($('#' + hdnCodingID + data[i].TPALevel3).val()) != 0) {
                            if (IDs == 0)
                                IDs = $('#' + hdnCodingID + data[i].TPALevel3).val();
                            else
                                IDs = IDs + ',' + $('#' + hdnCodingID + data[i].TPALevel3).val();
                        }
                    }
                }
            }
        }
        else if (parseInt(_priority) == 12.5) {
            if (parseInt($('#' + hdnCodingID + _TPALevel3).val()) != 0)
                IDs = $('#' + hdnCodingID + _TPALevel3).val();
        }

    }
    else if (TreatementTypeID_19 == 65) {
        if (parseInt($('#' + hdnCodingID + _TPALevel3).val()) != 0)
            IDs = $('#' + hdnCodingID + _TPALevel3).val();
    }

    ////if (TreatementTypeID_19 == 66) {
    ////    if (parseInt(_priority) == 100) {
    ////        for (var i = 0; i < data.length; i++) {
    ////            if (parseInt($('#' + hdnCodingID + data[i].PackageRatio).val()) != 0) {
    ////                if (IDs == 0)
    ////                    IDs = $('#' + hdnCodingID + data[i].PackageRatio).val();
    ////                else
    ////                    IDs = IDs + ',' + $('#' + hdnCodingID + data[i].PackageRatio).val();
    ////            }
    ////        }
    ////    }
    ////    else if (parseInt(_priority) == 50) {
    ////        for (var i = 0; i < data.length; i++) {
    ////            if (parseInt(data[i].PackageRatio) != 100) {
    ////                if (parseInt($('#' + hdnCodingID + data[i].PackageRatio).val()) != 0) {
    ////                    if (IDs == 0)
    ////                        IDs = $('#' + hdnCodingID + data[i].PackageRatio).val();
    ////                    else
    ////                        IDs = IDs + ',' + $('#' + hdnCodingID + data[i].PackageRatio).val();
    ////                }
    ////            }
    ////        }
    ////    }
    ////    else if (parseInt(_priority) == 25) {
    ////        for (var i = 0; i < data.length; i++) {
    ////            if (parseInt(data[i].PackageRatio) == 25 || parseInt(data[i].PackageRatio) == 12.5) {
    ////                if (parseInt($('#' + hdnCodingID + data[i].PackageRatio).val()) != 0) {
    ////                    if (IDs == 0)
    ////                        IDs = $('#' + hdnCodingID + data[i].PackageRatio).val();
    ////                    else
    ////                        IDs = IDs + ',' + $('#' + hdnCodingID + data[i].PackageRatio).val();
    ////                }
    ////            }
    ////        }
    ////    }
    ////    else if (parseInt(_priority) == 12.5) {
    ////        if (parseInt($('#' + hdnCodingID + _priority).val()) != 0)
    ////            IDs = $('#' + hdnCodingID + _priority).val();
    ////    }
    ////}
    ////else if (TreatementTypeID_19 == 65) {
    ////    for (var i = 0; i < data.length; i++) {
    ////        if (parseInt($('#' + hdnCodingID + _priority).val()) != 0)
    ////            IDs = $('#' + hdnCodingID + _priority).val();
    ////    }
    ////}


    if (IDs == 0)
        Delete_CodingDetails_Variables(TreatementTypeID_19, _priority, _TPALevel3);
    else {
        try {
            $.ajax({
                url: "/MedicalScrutiny/Delete_CodingProcedure",
                type: "POST",
                data: {
                    IDS: IDs
                },
                success: function (msg) {
                    CheckSessionVariable(msg);
                    Delete_CodingDetails_Variables(TreatementTypeID_19, _priority, _TPALevel3);
                },
                error: function (e, x) {
                    DialogResultMessage('Error Occured While Processing', e.responseText);
                }
            });

        }
        catch (e) {
            DialogResultMessage(e.responseText);
        }
    }

}

function Delete_CodingDetails_Variables(TreatementTypeID_19, _priority, _TPALevel3) {

    var data = [];
    if ($('#hdnClaimsCodingDetails').val() != '') {
        data = $.parseJSON($('#hdnClaimsCodingDetails').val());
    }

    var indexes = [];
    var isExist = null;

    if (TreatementTypeID_19 == 66) {

        if (parseInt(_priority) == 100) {

            for (var i = 0; i < data.length; i++) {
                if (data[i].TreatementTypeID_19 == 66) {
                    $('#trTPAProcedures_' + data[i].TPALevel3).remove();

                    //data.splice(0, 4);
                    //data.splice(i, 1);  
                    indexes.push(i);
                    isExist = true;
                }
            }

            $("#ddlPriority option[value='100']").remove();
            $("#ddlPriority option[value='50']").remove();
            $("#ddlPriority option[value='25']").remove();
            $("#ddlPriority option[value='12.5']").remove();

            ////$('#trTPAProcedures_' + 100).remove();
            ////$('#trTPAProcedures_' + 50).remove();
            ////$('#trTPAProcedures_' + 25).remove();
            ////$('#trTPAProcedures_' + 12.5).remove();

            $('#ddlPriority').append('<option value="100"> Primary </option>');
        }
        else if (parseInt(_priority) == 50) {

            for (var i = 0; i < data.length; i++) {
                if (data[i].TreatementTypeID_19 == 66) {
                    // data.splice(1, 3);
                    if (parseInt(data[i].PackageRatio) != 100) {
                        $('#trTPAProcedures_' + data[i].TPALevel3).remove();
                        //data.splice(i, 1);
                        indexes.push(i);
                        isExist = true;
                    }
                }
            }

            $("#ddlPriority option[value='100']").remove();
            $("#ddlPriority option[value='50']").remove();
            $("#ddlPriority option[value='25']").remove();
            $("#ddlPriority option[value='12.5']").remove();

            ////$('#trTPAProcedures_' + 50).remove();
            ////$('#trTPAProcedures_' + 25).remove();
            ////$('#trTPAProcedures_' + 12.5).remove();

            $('#ddlPriority').append('<option value="50">Secondary</option>');
        }
        else if (parseInt(_priority) == 25) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].TreatementTypeID_19 == 66) {
                    // data.splice(2, 2);
                    if (parseInt(data[i].PackageRatio) == 100 || parseInt(data[i].PackageRatio) == 50) {
                        //
                    }
                    else {
                        $('#trTPAProcedures_' + data[i].TPALevel3).remove();
                        //data.splice(i, 1);                      
                        indexes.push(i);
                        isExist = true;
                    }
                }
            }

            $("#ddlPriority option[value='100']").remove();
            $("#ddlPriority option[value='50']").remove();
            $("#ddlPriority option[value='25']").remove();
            $("#ddlPriority option[value='12.5']").remove();

            ////$('#trTPAProcedures_' + 25).remove();
            ////$('#trTPAProcedures_' + 12.5).remove();

            $('#ddlPriority').append(' <option value="25">Third</option>');
        }
        else if (parseInt(_priority) == 12.5) {

            for (var i = 0; i < data.length; i++) {
                if (data[i].TreatementTypeID_19 == 66) {
                    // data.splice(3, 1);
                    if (parseInt(data[i].PackageRatio) == 12.5) {
                        $('#trTPAProcedures_' + data[i].TPALevel3).remove();
                        //data.splice(i, 1);                       
                        indexes.push(i);
                        isExist = true;
                    }
                }
            }

            //$('#trTPAProcedures_' + 12.5).remove();

            $("#ddlPriority option[value='100']").remove();
            $("#ddlPriority option[value='50']").remove();
            $("#ddlPriority option[value='25']").remove();
            $("#ddlPriority option[value='12.5']").remove();

            $('#ddlPriority').append(' <option value="12.5">Fourth</option>');
        }

        if (isExist == true) {
            //////for (var j = 0; j <= indexes.length; j++) {
            //////    data.splice(indexes[j], 1);
            //////}

            $.each(indexes, function (i, coding) {
                data.splice(coding[i], 1);
            });

        }

    }
    else {
        for (var i = 0; i < data.length; i++) {
            if (data[i].TreatementTypeID_19 == 65) {
                if (data[i].TPALevel3 == _TPALevel3) {
                    $('#trTPAProcedures_' + data[i].TPALevel3).remove();
                    data.splice(i, 1);
                }
            }
        }
    }

    ////////var _billAmt = 0;
    ////////$.each(data, function (i, coding) {
    ////////    if (coding.PackageRatio == _priority) {
    ////////        _billAmt = coding.BillAmount;
    ////////        return false;
    ////////    }
    ////////});


    $('#hdnClaimsCodingDetails').val(JSON.stringify(data));

    DialogResultMessage('Coding details deleted successfully.');

}


function Save_CodingDetails() {
    try {
        ////var codingDetails = [];
        if ($('#hdnClaimsCodingDetails').val() != '') {
            ////    codingDetails = $.parseJSON($('#hdnClaimsCodingDetails').val());

            $.ajax({
                url: "/MedicalScrutiny/Save_CodingDetails",
                type: "POST",
                data: {
                    ClaimsCoding: $('#hdnClaimsCodingDetails').val(), ClaimId: $('#hdnClaimID').val(), SlNo: $('#hdnClaimSlNo').val(),
                    BillingType: $('#hdnBillingType').val()
                },
                success: function (msg) {
                    CheckSessionVariable(msg);
                    $('#progress').hide();
                    DialogResultMessage(msg);
                },
                error: function (e, x) {
                    DialogResultMessage('Error Occured While Processing', e.responseText);
                }
            });
        }
    }
    catch (e) {
        DialogResultMessage('ErrorMessage', e.responseText);
    }
}

// End Allu Srinu Claims Coding 


function CommentedCode() {
    //////////var bodyLenght = $('#tblQueryOthers tbody tr').length;
    //////////$('#tblQueryOthers').find('tr').each(function (i, el) {
    //////////    var _qoDetails = {};
    //////////    var $tds = $(this).find('td');
    //////////    productId = $tds.eq(0).text();
    //////////    product = $tds.eq(1).text();
    //////////    Quantity = $tds.eq(2).text();

    //////////    //_qoDetails.ID = query.ID;
    //////////    //_qoDetails.IRDocumentID = 0;
    //////////    //_qoDetails.FreeText1 = query.FreeText1;
    //////////    //_qoDetails.FreeText2 = query.FreeText2;
    //////////    //_qoDetails.ServiceID = 0;
    //////////    //_qoDetails.Remarks = query.Remarks;

    //////////    IRDetails.push(_qoDetails);
    //////////});

}

// Start Billing Details Calculations By B Srinu on 30th Nov 2015

function BillingCalcDetails_Retrieve(_ClaimID, _SlNo) {
    if (_ClaimID != null && _SlNo != null) {
        //if ($('#tblApproval tbody').children().length == 0) {
        $.ajax({
            type: "GET",
            url: "/MedicalScrutiny/BillingCalcDetails_Retrieve",
            contentType: 'application/json;charset=utf-8',
            //processData: false,
            data: { ClaimID: _ClaimID, SlNo: _SlNo, claimstageid: $('#hdnClaimStageID').val() },
            success: function (data) {
                data = $.parseJSON(data);
                Bind_BillingDetails(data);
                if (data == null || data == "") {
                    //alert('Data not found.');
                }
            },
            error: function (e, x) {
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });
    }
}

function Makezerofromnullorundefined(val) {
    if (val == null || val == undefined || val == '' || val < 0) {
        return 0;
    } else
        return parseFloat(val);
}

var RemoveCMORemarks = 0;
function ajaxcall(_cdtls, _rules) {
    RemoveCMORemarks = 0;
    var Isrefertocrm = 0;

    if (basicData[0].Isrefertocrm == true && (parseInt($("#txtPayableAmount").text()) >= parseInt(basicData[0].Mbbs_thresholdlimit) || parseInt($("#txtPayableAmount").text()) >= parseInt(basicData[0].cmo_thresholdlimit))) {
        Isrefertocrm = 1;
    }
    if (FindRejectedReasons()) {
        if (_cdtls != null && _rules != null) {
            if (utilizedamtarray.length == 0) {
                var _utilizedamt = {};
                _utilizedamt["MemberSIID"] = null;
                _utilizedamt["SanctionedAmount"] = null;
                _utilizedamt["BalanceAmount"] = null;
                utilizedamtarray.push(_utilizedamt);
            }
            if ($('#hdnApprovalDetails').val() == "" || $('#hdnApprovalDetails').val() == "[]") {
                var _newRules = [];
                var _objrules = {};
                _objrules["TriggerID"] = null;
                _objrules["RuleName"] = null;
                _objrules["isOverride"] = null;
                _objrules["OverrideReasonIDs_P34"] = null;
                _objrules["OverRideRemarks"] = null;
                _objrules["OverrideruleID"] = null;
                _objrules["BPConditionID"] = null;
                _newRules.push(_objrules);
                _rules = JSON.stringify(_newRules);
            }
            //if (_rules != null) {
            //    $('#hdnApprovalDetails').val(JSON.stringify(_newRules));
            //}

            if (copaystatus == true) {
                copaymentAmt = $('.txtCoPaymentOverride').val();
                if ($('.txtCoPaymentOverride').val() == "" || $('.txtCoPaymentOverride').val() == null) {
                    alert('Please enter copayment amount');
                    return false;
                }
            }
            //SP3V-1611 Leena
            if (OverrideDeductible == true) {
                _deductableAmount = $('.txtDeductibleOverride').val();
                if ($('.txtDeductibleOverride').val() == "" || $('.txtDeductibleOverride').val() == null) {
                    alert('Please enter Deductible amount');
                    return false;
                }
            }
            //End SP3V-1611 Leena
            if ($('#SkipScrutiny').is(':checked') == true && createnewtop == 0)
                SkipScrutiny = true;
            else
                SkipScrutiny = false;

            if ($('#IsFinal_radio_yes').is(':checked') == true)
                Adj_IsFinal = true;
            else
                Adj_IsFinal = false;

            $.ajax({
                type: "POST",
                url: "/MedicalScrutiny/ClaimRules_Insert",
                //contentType: 'application/json;charset=utf-8',
                //processData: false,
                //data: { ClaimDetails: _cdtls, Rules: _rules, BillAmount: billAmt, EligibleAmount: eligibleAmt, SanctionedAmount: eligiblesanctionedAmt, TDSAmount: tdsAmt, NetAmount: netAmt, MOUDiscount: mouDiscount, DiscountByHospital: hospitalDiscount, Deductible: deductableAmt, PaidByPatient: patientPaidamt, ExcessPaidByPatient: excesscollectedfromPatient, CoPayment: copaymentAmt, ClaimUtilization: JSON.stringify(utilizedamtarray) },
                data: {
                    ClaimDetails: _cdtls, Rules: _rules, DiscountByHospital: _hospitalDiscount, EligibleAmount: _eligibleAmount, Deductible: _calculatedDeductibleAmt,
                    CoPayment: copaymentAmt,
                    // CoPayment: manualCopay,
                    NetEligibleAmount: _neteligibleAmount, Excess_SI: _excessSuminsured, Excess_Preauth: _exceedingPreauth, ExcessPaidByPatient: _excesspaidbyPatient,
                    AdmissibleAmount: _admissibleAmount, EligiblePayableAmount: _eligiblepayableAmt, NegotiatedAmount: _negotiatedDiscount, GrossAmount: _grosspayableAmt,
                    TDSAmount: _tdsAmount, NetAmount: _netpayableAmount,
                    PaidByPatient: _patientpaidAmount, BufferUtilized: bufferUtilizedAmount, Copayhtml: htmlEncode(_copayhtml), //Copayhtml: htmlEncode(manualCopay),
                    ClaimUtilization: JSON.stringify(utilizedamtarray),
                    DoctorNotes: $('#txtDoctorRemarks').val(), AdditionalNotes: $('#txtAdditionalRemarks').val(), NottoDeductFromHospital: isEPAnottodeductfrommhospital, SkipScrutiny: SkipScrutiny,
                    EarlyPaymentDiscountAmount: _earlyPaymentDiscountAmt, PremiumDeducted: _premiumAmt,  //Added for Task (SP-1307)
                    QMSID: $("#hdnQMS").val(), QMSAdminID: $("#hdnQMS").val(), Modularamount: $("#txtModularAmt").val(), Patienttobepaid: $("#txtpatienttobepaid").val(), Adj_IsFinal: Adj_IsFinal, Isrefertocrm: Isrefertocrm, SkipAudit: $("#SkipAudit").prop("checked"),
                    PMTNegotiatedDiscount: _PMTNegotiatedDiscount
                },
                //data: { ClaimDetails: 1, Rules: 4 },
                success: function (data) {

                    //alert(data.indexOf("Successfully"));
                    //data = $.parseJSON(data);
                    $('#hdnApprovalDetails').val("");
                    if (data.indexOf("Successfully") >= 0) {
                        var ReceivedMode_P23_Id = MakeNullfromUndefinedorEmpty($('#hdnReceivedMode_P23').val());
                        if ((!$("#SkipAudit").prop("checked") && (_requesttype == 1 || _requesttype == 2) && data == JSON.stringify('Saved Successfully')) || (createnewtop == 1 && data == JSON.stringify('Saved Successfully') && (_requesttype == 1 || _requesttype == 2 || _requesttype == 3))) {
                            ClaimAudit_Insert(24, 'ddlAuditReasons', 'taAuditRemarks', 33, 1, false);
                        }
                        if (basicData[0].Isrefertocrm == true && (parseInt($("#txtPayableAmount").text()) >= parseInt(basicData[0].Mbbs_thresholdlimit) || parseInt($("#txtPayableAmount").text()) >= parseInt(basicData[0].cmo_thresholdlimit))) {
                            RemoveCMORemarks = 1;
                            $('#lnkReferCRM').trigger('click');
                            return;
                        }
                        else {
                            DialogResultMessage(data);
                            if ($("#hdnQMSAdmin").val() != '') {
                                window.location = '/Qmsv2CMO/CMODashboard';
                            }
                            else if ($("#hdnQMS").val() != '') {
                                window.location = '/Qmsv2CM/CMDashboard';
                            }
                            else {

                                window.location = '/Claims/Index';
                            }

                        }
                    }
                    else {
                        DialogResultMessage(data);
                    }
                    //SP3V_2383 _End

                },

                error: function (e, x) {
                    ShowResultMessage('ErrorMessage', e.responseText);
                }
            });

        }
        else
            alert('Please un-select the rejection reasons to APPROVE');

    }
    else
        alert('Please un-select the rejection reasons to APPROVE');
}
var chkstageStatus = true;
function Bind_BillingDetails(result, dtSanctionAmount, billsheetfalg) {
    var data = result.Table;
    var additionaldata = result.Table1;
    //  var deductibleAmountdetails = result.Table2;
    if (Isitpreauth(data[0].RequestTypeID) && data.length > 0)
        $('#litxtNegotiatedDiscount').hide();
    var subConditionId = data[0].SubConditionId;
    if (subConditionId == 39) {
        $('#txtRemainingDeductibleAmount,#RemainingDeductibleAmount').hide();
    } else {
        $('#txtRemainingDeductibleAmount,#RemainingDeductibleAmount').show();
    }
    var dtSanctionAmoutn = dtSanctionAmount;
    _claimedAmount = Makezerofromnullorundefined(data[0].ClaimedAmount);
    _mouDiscount = Makezerofromnullorundefined(data[0].MOUDiscount);
    _nonPayabledecuctions = Makezerofromnullorundefined(data[0].NOPDeductions);
    _totalbillAmount = Makezerofromnullorundefined(data[0].BillAmount);
    _raweligibleAmount = Makezerofromnullorundefined(data[0].EligibleAmount);
    _eligibleAmount = Makezerofromnullorundefined(data[0].EligibleAmount);
    _hospitalDiscount = Makezerofromnullorundefined(data[0].DiscountByHospital);
    _deductableAmount = Makezerofromnullorundefined(data[0].Deductible);

    _balanceDeductibleAmt = Makezerofromnullorundefined(data[0].remaingdeductibleAmount);
    _ClaimDeductibleAmt = Makezerofromnullorundefined(data[0].ClaimDeductibleAmt); //SP3V-1611 Leena

    _totalDeductions = Makezerofromnullorundefined(data[0].DeductionAmount);
    copaymentAmt = Makezerofromnullorundefined(data[0].CoPayment);
    _neteligibleAmount = Makezerofromnullorundefined(data[0].NetEligibleAmount);
    _exceedingPreauth = Makezerofromnullorundefined(data[0].Excess_PreAuth);
    _excessSuminsured = Makezerofromnullorundefined(data[0].Excess_SI);
    _excesspaidbyPatient = Makezerofromnullorundefined(data[0].ExcessPaidByPatient);
    _admissibleAmount = Makezerofromnullorundefined(data[0].AdmissibleAmount);
    _eligiblepayableAmt = Makezerofromnullorundefined(data[0].EligiblePayableAmount);
    _negotiatedDiscount = Makezerofromnullorundefined(data[0].NegotiatedAmount);
    _grosspayableAmt = Makezerofromnullorundefined(data[0].GrossPayable);
    _tdsAmount = Makezerofromnullorundefined(data[0].TDSAmount);
    _netpayableAmount = Makezerofromnullorundefined(data[0].NetAmount);
    _patientpaidAmount = Makezerofromnullorundefined(data[0].PaidByPatient);

    _tariffValue = Makezerofromnullorundefined(data[0].TariffValue);
    _packageValue = Makezerofromnullorundefined(data[0].PackageLimit);
    _bpcoverageValue = Makezerofromnullorundefined(data[0].BPCoverageLimit);
    _tdsper = Makezerofromnullorundefined(data[0].TDSPerc);
    _copayhtml = htmlDecode(data[0].CoPaymentHTML);

    _earlyPaymentDiscount = Makezerofromnullorundefined(data[0].EarlyPaymentDiscount); //Added for Task (SP-1307)
    _earlyPaymentDiscountAmt = Makezerofromnullorundefined(data[0].EPDAmount); //Added for Task (SP-1307)

    //  _applicableDiscount = Makezerofromnullorundefined(data[0].ApplicableDiscount);
    // _eligiblesanctionedAmount = Makezerofromnullorundefined(data[0].SanctionedAmount);



    _totalsanctionedAmtforclaim = Makezerofromnullorundefined(additionaldata[0].TotalSanctionedAmount);
    _totalpayableAmtforclaim = Makezerofromnullorundefined(additionaldata[0].TotalPayableAmount);
    _totalcopayAmtforclaim = Makezerofromnullorundefined(additionaldata[0].TotalCoPayment);
    _approvedamount = Makezerofromnullorundefined(additionaldata[0].ApprovedAmount);
    _totalcliamsbillAmt = Makezerofromnullorundefined(additionaldata[0].TotalBillAmount);

    //Applicable Bill Amount(new Title) or Bill After Deductions
    //_applicablebillAmount = _totalbillAmount - _totalDeductions;
    //SP3V-4304
    _applicablebillAmount = _totalbillAmount - _totalDeductions;
    /*_totalDeductions = _totalbillAmount - _applicablebillAmount;*/
    // _totalDeductions = _totalbillAmount - (_applicablebillAmount + _mouDiscount);
    //Excess to Claimed Amount
    _excesstoclaimedAmount = (_totalbillAmount - _claimedAmount) > 0 ? (_totalbillAmount - _claimedAmount) : 0;
    //Applicable Discount
    _applicableDiscount = Math.max(parseFloat(_mouDiscount), _hospitalDiscount);

    bufferAllocatedAmount = Makezerofromnullorundefined(data[0].BufferAllocated);
    bufferUtilizedAmount = Makezerofromnullorundefined(data[0].BufferUtilized);

    payablemountforclaim = Makezerofromnullorundefined(data[0].SanctionedAmount);
    _modularamount = Makezerofromnullorundefined(data[0].Modularamount);
    _totalsanctionedamtforclaimreselmt = Makezerofromnullorundefined(data[0].totalsanctionedamtforclaimreselmt);
    _patienttobepaid = Makezerofromnullorundefined(data[0].Patienttobepaid);
    _PMTNegotiatedDiscount = Makezerofromnullorundefined(data[0].PMTNegotiatedDiscount);
    _NME_AMOUNT = Makezerofromnullorundefined(data[0].NME_Amount);
    if (data[0].copaylmt_flag == true) {
        copaylmt_flag = true;
        appli_copaylmt = data[0].appli_copaylmt;
        ramaining_copay_lmt = appli_copaylmt;
    }
    if (billsheetfalg != 0) {
        if (data[0].IsreopenClaim == true && basicData[0].Isrefertoinsurer == true) {
            IsreopenClaim = true;
            $('#btnReject').removeAttr('disabled', true);
            $('#btnRejectAll').removeAttr('disabled', true);
            $('#lnkPreauthCancel').removeAttr('disabled', true);
            $('#btnApprove').removeAttr('disabled', true);
        }
    }
    if (result.Table4.length > 0) {
        if (result.Table4[0].IssueID == 24 && result.Table4[0].CorpID == 0) // added by prasad
        {
            _premiumAmt = (result.Table4[0].PremiumDeducted);
            if ($('#hdnStageID').val() != 22)
                _premium = ((((result.Table4[0].Installments) * (result.Table4[0].Premium)) - (result.Table4[0].NetPremium)) - (result.Table4[0].TotalPremium));
            else {
                _premium = ((Math.round((result.Table4[0].Installments) * (result.Table4[0].Premium)) - Math.round(result.Table4[0].NetPremium))) - Math.round(result.Table4[0].TotalPremium)
                _premium = _premium + _premiumAmt;
            }
            _premium = Math.round(_premium);
            if (_premium <= 0) _premium = 0;
        }
    }

    var utilizationData = result.Table5;
    var _utilizedamt = {};
    if (billsheetfalg != 0) {
        if (utilizationData.length > 0 && basicData[0].IssueID == "10" && (basicData[0].ITGIinsurerresponse == "Auth Approved" || basicData[0].ITGIinsurerresponse == "Auth Denied")) {
            $.each(utilizationData, function (i, item) {
                _utilizedamt["MemberSIID"] = item.MemberSIID;
                _utilizedamt["SanctionedAmount"] = item.SanctionedAmount;
                _utilizedamt["BalanceAmount"] = null;
                utilizedamtarray.push(_utilizedamt);
            });
        }
    }

    $('#txtBillAmount').text(_totalbillAmount).attr('title', convert(_totalbillAmount, null));
    $('#txtExcesstoClaimedAmount').text(_excesstoclaimedAmount).attr('title', convert(_excesstoclaimedAmount, null));
    $('#txtDeductions').text(_totalDeductions).attr('title', convert(_totalDeductions, null));
    $('#txtApplicablebillamount').text(_applicablebillAmount).attr('title', convert(_applicablebillAmount, null));
    $('#txtEligiblebillAmount').text(_eligibleAmount).attr('title', convert(_eligibleAmount, null));
    $('#txtNMEAmount').text(_NME_AMOUNT).attr('title', convert(_NME_AMOUNT, null));
    $('#txtMOUDiscount').text(_mouDiscount).attr('title', convert(_mouDiscount, null));
    $('#txtHospitalDiscount').val(_hospitalDiscount);
    $('#txtApplicableDiscount').text(_applicableDiscount);
    $('#txtNetEligibleAmount').text(_neteligibleAmount);
    $('#txtPatientPaidAmount').val(_patientpaidAmount);
    //$('#txtDeductible').text(_remainingdeductableAmount).attr('title', convert(_remainingdeductableAmount, null));
    //$('#txtDeductible').text(_balanceDeductibleAmt).attr('title', convert(_balanceDeductibleAmt, null));
    $('#txtDeductible').text(_deductableAmount).attr('title', convert(_deductableAmount, null));
    $('#txtTotalDeductibleAmount').text(_deductableAmount).attr('title', convert(_deductableAmount, null)); // 
    $('#txtRemainingDeductibleAmount').text(_balanceDeductibleAmt).attr('title', convert(_balanceDeductibleAmt, null)); // 
    //SP3V-1611 Leena
    if (OverrideDeductible == true) {
        if ($('#hdnClaimStageID').val() == 5) { //12apr2023
            $('.txtDeductibleOverride').val(0);
        }
        else {
            $('.txtDeductibleOverride').val(_ClaimDeductibleAmt);
        }
    }
    else {
        //$('#txtDeductible').text(_ClaimDeductibleAmt).attr('title', convert(_ClaimDeductibleAmt, null));
        $('#txtDeductible').text(_deductableAmount).attr('title', convert(_deductableAmount, null));
    }
    //Commented by 12apr2023 Leena As per discussion with lalitha for new requirement
    //if (_ClaimDeductibleAmt > 0) {
    //    $('#txtTotalDeductibleAmount').text(_ClaimDeductibleAmt).attr('title', convert(_ClaimDeductibleAmt, null)); //
    //}
    ShowOverideLable();
    //END SP3V-1611
    $('#txtCoPayment').text(copaymentAmt);
    $('.txtCoPaymentOverride').val(copaymentAmt); // For Task: (SP-1103)
    $('#txtExcesspaidbypatient').text(_excesspaidbyPatient);
    $('#txtPharmacydecuctions').text(_nonPayabledecuctions).attr('title', convert(_nonPayabledecuctions, null));
    $('#txtNegotiatedDiscount').val(_negotiatedDiscount);
    $('#txtClaimed_Amount').text(_claimedAmount).attr('title', convert(_claimedAmount, null));
    $('#txtApprovedAmount').text(_approvedamount).attr('title', convert(_approvedamount, null));
    $('#txtTariffvalue').text(_tariffValue).attr('title', convert(_tariffValue, null));
    $('#txtPackagevalue').text(_packageValue).attr('title', convert(_packageValue, null));
    $('#txtBPcoveragevalue').text(_bpcoverageValue).attr('title', convert(_bpcoverageValue, null));
    $('#txtExcessSumInsured').text(_excessSuminsured);
    $('#txtExceedingPreauthamount').text(_exceedingPreauth);
    $('#txtTotalSancAmountForClaim').text(_totalsanctionedAmtforclaim).attr('title', convert(_totalsanctionedAmtforclaim, null));
    $('#txtTotalCopaymentForClaim').text(_totalcopayAmtforclaim).attr('title', convert(_totalcopayAmtforclaim, null));
    $('#txtTotalPayableAmountForClaim').text(_totalpayableAmtforclaim).attr('title', convert(_totalpayableAmtforclaim, null));
    $('#txtAdmissibleAmount').text(_admissibleAmount).attr('data-original-title', convert(_admissibleAmount, null));
    $('#txtEligiblepayableAmount').text(_eligiblepayableAmt).attr('data-original-title', convert(_eligiblepayableAmt, null));
    $('#txtPayableAmount').text(_grosspayableAmt).attr('data-original-title', convert(_grosspayableAmt, null));
    $('#txtTDSAmount').text(_tdsAmount + " [" + _tdsper + "%]").attr('data-original-title', convert(_tdsAmount, null));
    $('#txtNetPaidAmount').text(_netpayableAmount).attr('data-original-title', convert(_netpayableAmount, null));
    $('#txtBufferSIUtilized').text(bufferUtilizedAmount).attr('data-original-title', convert(bufferUtilizedAmount, null));
    $('#txtBufferSIAllocated').text(bufferAllocatedAmount).attr('data-original-title', convert(bufferAllocatedAmount, null));
    $('#txtInstallmentPremium').text(_premium).attr('data-original-title', convert(_premium, null)); // added by prasad
    $('#txtInstallment_Premium').text(_premiumAmt).attr('data-original-title', convert(_premiumAmt, null));
    if (_copayhtml != '') {
        $('#divcopaycalculation').html(_copayhtml);
        $('#lblTotalCopay').text(copaymentAmt);
    }

    //if (data[0].SkipScrutiny == null || data[0].SkipScrutiny === "") {
    //    data[0].SkipScrutiny = true;
    //}

    if (data[0].SkipScrutiny == true)
        $('#SkipScrutiny').prop('checked', true);
    else
        $('#SkipScrutiny').prop('checked', false);

    $('#txtEPDDiscountAmt').text(_earlyPaymentDiscountAmt).attr('data-original-title', convert(_earlyPaymentDiscountAmt, null)); //Added for Task (SP-1307)
    $('#txtModularAmt').val(_modularamount).attr('data-original-title', convert(_modularamount, null));;

    if (($("#hdnRequestTypeID").val() == 3 || basicData[0].IsFinal == true) && ParexelcorporateIDs.includes($("#hdnCorporateID").val()) && $("#hdnClaimStageID").val() == 5 && _patienttobepaid == 0) {
        if ($('#IsFinal_radio_yes').is(':checked') == true) {
            $('#txtpatienttobepaid').val('').attr('data-original-title', convert(_patienttobepaid, null));
        }
    }
    else {
        $('#txtpatienttobepaid').val(_patienttobepaid).attr('data-original-title', convert(_patienttobepaid, null));
    }
    $('#txtPMTNegotiatedDiscount').val(_PMTNegotiatedDiscount).attr('data-original-title', convert(_PMTNegotiatedDiscount, null));;
    //$('#txtBillAmount').text(_totalbillAmount).attr('title', convert(_totalbillAmount, null));
    //$('#txtExcesstoClaimedAmount').text(_excesstoclaimedAmount).attr('title', convert(_excesstoclaimedAmount, null));
    //$('#txtDeductions').text(_totalDeductions).attr('title', convert(_totalDeductions, null));
    //$('#txtApplicablebillamount').text(_applicablebillAmount).attr('title', convert(_applicablebillAmount, null));
    //$('#txtEligiblebillAmount').text(_eligibleAmount).attr('title', convert(_eligibleAmount, null));
    //$('#txtMOUDiscount').text(_mouDiscount).attr('title', convert(_mouDiscount, null));
    //$('#txtHospitalDiscount').val(_hospitalDiscount);
    //$('#txtApplicableDiscount').text(_applicableDiscount).attr('title', convert(_applicableDiscount, null));
    //$('#txtNetEligibleAmount').text(_neteligibleAmount).attr('title', convert(_neteligibleAmount, null));
    //$('#txtPatientPaidAmount').val(_patientpaidAmount);
    //$('#txtDeductible').text(_deductableAmount).attr('title', convert(_deductableAmount, null));
    //$('#txtCoPayment').text(copaymentAmt).attr('title', convert(copaymentAmt, null));
    //$('#txtExcesspaidbypatient').text(_excesspaidbyPatient).attr('title', convert(_excesspaidbyPatient, null));
    //$('#txtPharmacydecuctions').text(_Pharmacydecuctions).attr('title', convert(_Pharmacydecuctions, null));
    //$('#txtNegotiatedDiscount').val(_negotiatedDiscount);
    //$('#txtClaimed_Amount').text(_claimedAmount).attr('title', convert(_claimedAmount, null));
    //$('#txtApprovedAmount').text(_approvedamount).attr('title', convert(_approvedamount, null));
    //$('#txtTariffvalue').text(_tariffValue).attr('title', convert(_tariffValue, null));
    //$('#txtPackagevalue').text(_packageValue).attr('title', convert(_packageValue, null));
    //$('#txtBPcoveragevalue').text(_bpcoverageValue).attr('title', convert(_bpcoverageValue, null));
    //$('#txtExcessSumInsured').text(_excessSuminsured).attr('title', convert(_excessSuminsured, null));
    //$('#txtExceedingPreauthamount').text(_exceedingPreauth).attr('title', convert(_exceedingPreauth, null));
    //$('#txtTotalSancAmountForClaim').text(_totalsanctionedAmtforclaim).attr('title', convert(_totalsanctionedAmtforclaim, null));
    //$('#txtTotalCopaymentForClaim').text(_totalcopayAmtforclaim).attr('title', convert(_totalcopayAmtforclaim, null));
    //$('#txtTotalPayableAmountForClaim').text(_totalpayableAmtforclaim).attr('title', convert(_totalpayableAmtforclaim, null));

    //$('#txtEligiblepayableAmount').text(_eligiblepayableAmt).attr('title', convert(_eligiblepayableAmt, null));
    //$('#txtPayableAmount').text(_grosspayableAmt).attr('title', convert(_grosspayableAmt, null));
    //$('#txtTDSAmount').text(_tdsAmount).attr('title', convert(_tdsAmount, null));
    //$('#txtNetPaidAmount').text(_netpayableAmount).attr('title', convert(_netpayableAmount, null));

    $('#lblbcClaimID').text($('#hdnClaimID').val());
    $('#lblbcClaimSno').text($('#hdnClaimSlNo').val());

    if ($('#hdnClaimTypeID').val() != '') {
        _claimtype = $('#hdnClaimTypeID').val();
    }
    if ($('#hdnRequestTypeID').val() != '') {
        _requesttype = $('#hdnRequestTypeID').val();
    }
    if (_claimtype == 2) {
        $('#litxtExceedingPreauthamount').hide();
        $('#litxtExcesspaidbypatient').hide();
        $('#litxtNegotiatedDiscount').hide();
        $('#litxtApprovedAmount').hide();
        $('#litxtPatientPaidAmount').hide();
        $('#litxtPharmacydecuctions').hide();
        $('#litxtEPDDiscountAmt').hide(); //Added for Task (SP-1307)
    }

    if (_requesttype == 1 || _requesttype == 2) {
        $('#litxtExcesspaidbypatient').hide();
        $('#litxtPatientPaidAmount').hide();
        $('#litxtPharmacydecuctions').hide();
        //if (parseInt(MakeNullfromUndefinedorEmpty($('#hdnReceivedMode_P23').val())) == 405) {
        $('#divAuditSkipFunction').show();
        if (Boolean(data[0].FinalBillCheckStatus)) {
            $('#SkipAudit').attr('checked', false);
            $('#SkipAudit').attr('disabled', true);
        }
        else if (($('#hdnClaimStageID').val() == 22 || $('#hdnClaimStageID').val() == 24 || $('#hdnClaimStageID').val() == 28 || $('#hdnClaimStageID').val() == 29) && !Boolean(data[0].FinalBillCheckStatus)) {
            $('#SkipAudit').attr('checked', true);
            $('#SkipAudit').attr('disabled', true);
        }
        else {
            $('#SkipAudit').attr('checked', false);
            $('#SkipAudit').attr('disabled', false);
        }
        //}
    }

    if (_requesttype == 1 || _requesttype == 2) {
        $('#litxtEPDDiscountAmt').hide(); //Added for Task (SP-1307)
        $('#divAdjIsFinal').show();
        if (basicData[0].IsFinal == true) {
            $('#IsFinal_radio_yes').attr('checked', true);
            $("#divAuditSkipFunction").hide();
            $('#SkipAudit').attr('checked', true);
            $('#SkipAudit').prop('checked', true);
        }
        else {
            $('#IsFinal_radio_No').attr('checked', true);
            $("#divAuditSkipFunction").show();
            $('#SkipAudit').attr('checked', false);
        }

    }

    $('[data-rel=tooltip]').tooltip();
    if (_claimtype == 1 && _requesttype == 4) {
        if (dtSanctionAmoutn == 0)  //if SanctionAmt is greater than thresoldAmt then 10% TDS will be applied.
        {
            $('#txtTDSExhausted').show(); //static display  #TDS Threshold exhausted. Default TDS 10% will be applicable
        }
        else {
            $('#txtTDSExhausted').hide();
        }
    }
    //Doctor Remarks
    // alert(data[0].DoctorNotes);
    //if (data[0].DoctorNotes == null)
    //    DisplayDoctorRemarks();
    //else
    //    $('#txtDoctorRemarks').text(data[0].DoctorNotes);
    //$('#txtAdditionalRemarks').text(data[0].AdditionalRemarks);

    $("#hdnOpddetails").val(JSON.stringify(result.Table3));
    // $("#Basetopuppolicydetails").val(JSON.stringify(result.Table5));


    if (basicData[0].RequestTypeID == 1 && basicData[0].IsAutomationClaim == 5 && basicData[0].Sanctionedamount > 0 && SSA_calculate_flag == false) {
        BillCalculator();
        SSA_calculate_flag = true;
        // Enable_Buttons(5);
    }

}

$(function () {
    $('input[name="IsFinal_radio"]').on('change', function () {
        var selectedValue = $(this).val();
        if (selectedValue == 0) {
            if (ParexelcorporateIDs.includes($("#hdnCorporateID").val()) && $("#hdnClaimStageID").val() == 5 && $("#txtpatienttobepaid").val() == "") {
                $("#txtpatienttobepaid").val("0");
            }
            $("#divAuditSkipFunction").show();
            $('#SkipAudit').prop('checked', false);
            $('#SkipAudit').attr('checked', false);
        }
        else if (selectedValue == 1) {
            if (ParexelcorporateIDs.includes($("#hdnCorporateID").val()) && $("#hdnClaimStageID").val() == 5) {
                $("#txtpatienttobepaid").val("");
            }
            $("#divAuditSkipFunction").hide();
            $('#SkipAudit').attr('checked', true);
            $('#SkipAudit').prop('checked', true);
        }
        // Add your logic here
    });
});

//$("#btnBillPrint").on("click", function () {
//    var divContents = $("#divBillcalculation").html();
//    var printWindow = window.open('', '', 'height=400,width=800');
//    printWindow.document.write('<html><head><title>DIV Contents</title>');
//    printWindow.document.write('</head><body >');
//    printWindow.document.write(divContents);
//    printWindow.document.write('</body></html>');
//    printWindow.document.close();
//    printWindow.print();
//});

//retrive from db before calculation
var _claimedAmount = 0;
var _mouDiscount = 0;
var _totalbillAmount = 0;
var _raweligibleAmount = 0;
var _eligibleAmount = 0;
var _hospitalDiscount = 0;


var _deductableAmount = 0;
var _calculatedDeductibleAmt = 0;
var _balanceDeductibleAmt = 0;

var _billafterDeductionandDiscount = 0;

///Need to remove ////////
var _remainingdeductableAmount = 0;
var _FinaldeductibleAmt = 0;
///////////////////////////////////

var _totalDeductions = 0;
var _tariffValue = 0;
var _packageValue = 0;
var _bpcoverageValue = 0;
var _copayrules = [];// [{ per: "10", val: "1000", lm: "1" }, { per: "20", val: "300", lm: "0" }];//
var _tdsper = 0;
var _copaycalculationon = 75;
var _bufferApproval = 1;
var _iscopayaccumulate = 0;

//retrive from db after calculation

var _tdsAmount = 0;
var _applicableDiscount = 0;
//var _eligiblesanctionedAmount = 0;
var _neteligibleAmount = 0;
var _patientpaidAmount = 0;
var _excesspaidbyPatient = 0;
var copaymentAmt = 0;
var manualCopay = 0;
var _eligiblepayableAmt = 0;
var _grosspayableAmt = 0;
var _netpayableAmount = 0;
var _negotiatedAmount = 0;
var _excessSuminsured = 0;
var _copayhtml = '';
var _totalsanctionedAmtforclaim = 0;
var _totalpayableAmtforclaim = 0;
var _totalcopayAmtforclaim = 0;

var _excesstoclaimedAmount = 0;
var _applicablebillAmount = 0;
var _approvedamount = 0;
var _totalcliamsbillAmt = 0;
var _excesspreauthAmount = 0;
var _exceedingPreauth = 0;
var _admissibleAmount = 0;
var _negotiatedDiscount = 0;
var _Pharmacydecuctions = 0;
var _nonPayabledecuctions = 0;

var _claimtype = 0;
var _requesttype = 0;
var utilizedamtarray = [];//calculating utilized and balance SI
var totalremainingBalofBSI = 0;
var _billingType = 0;

var _earlyPaymentDiscount = 0; //Added for Task (SP-1307)
var _earlyPaymentDiscountAmt = 0; //Added for Task (SP-1307)

var isEPAnottodeductfrommhospital = false;
//Critical Illness claim
//var isCI = false;
//if ($('#hdnClaimsCodingDetails').val() != "" && $('#hdnClaimsCodingDetails').val() != undefined && $('#hdnClaimsCodingDetails').val() != null)
//{
//    if ($.parseJSON($('#hdnClaimsCodingDetails').val()).length > 0)
//        isCI = $.parseJSON($('#hdnClaimsCodingDetails').val())[0].isCI;
//}
var isLumpsum = $('#hdnInsuranceCompanyID').val() == 1 ? 1 : 0;
var approvalFlag = false;
var bufferAllocatedAmount = 0;
var bufferUtilizedAmount = 0;

var allowedsi = [];
var allowedbenefits = [];
var isSumlimit = false;
var Sublimits = [];// [{ ID: 101, RelasionShipID: "4,5", Limit: 100000,Balance:50000 }];
var remainingSublimit = 0;
var claimmemberrelation = 0;
var SkipScrutiny = false;
var AuditSkipScrutiny = false;
var remainingOPDlimit = 0;
var isOPDLimit = false;
var remainOPDSublimit = 0;
var remainSIbalforOPDSublimit = 0;
var _balOPDSublimt = 0;
var RembalOPDSublimit = 0;
var isbillcalculated = false;
var sublimitflag = false;// SPMay-10
var isbufferwithoutbase = false;
var payablemountforclaim = 0;
var _premium = 0;   // added by prasad 
var _premiumAmt = 0;  /////added by prasad 
var _OverrideDeductibleAmt = 0; //SP3V-1611 Leena
var _ClaimDeductibleAmt = 0; //SP3V-1611 Leena
var _ValidateDeductibleAmt = false; //SP3V-1611 Leena
var _premiumAmt = 0;  /////added by prasad 
var shiftingmemberID = 0;
var checktopupflag = true;
var _modularamount = 0;
var ITGIConfimation = true;
var _totalsanctionedamtforclaimreselmt = 0;
var _finalcopaycon = [];
var _copayamt = 0;
var _copayperval = 0;
var _copayval = 0;
var _copayper = 'N/A';
var _copaylessormore = 'N/A';
var copayeligibleamount = 0;
var _patienttobepaid = 0;
var Adj_IsFinal = false;
var IsreopenClaim = false;
var final_sublimit_amt = 0;
var SSA_calculate_flag = false;
var appli_copaylmt = 0;
var ramaining_copay_lmt = 0;
var copaylmt_flag = false;
var _PMTNegotiatedDiscount = 0;

function BillCalculator() {
    //SP3V-1611 Leena
    isbillcalculated = false;  //10-apr-2023 Added new condition
    _ValidateDeductibleAmt = false;
    if (OverrideDeductible == true) {
        if ($('.txtDeductibleOverride').val() == "" || $('.txtDeductibleOverride').val() == null) {
            alert('Please enter Deductible amount');
            return false;
        }
        _OverrideDeductibleAmt = Makezerofromnullorundefined($('.txtDeductibleOverride').val());
        _OverrideDeductibleAmt = parseFloat(_OverrideDeductibleAmt);

        //if (_OverrideDeductibleAmt > _claimedAmount) {
        //    DialogWarningMessage('Modified deductible amount is greater than the total claimed amount.');
        //    return false;
        //}
        //else if (_OverrideDeductibleAmt > _balanceDeductibleAmt) {
        //    DialogWarningMessage('Modified deductible amount is greater than the Deductible amount.: ' + _balanceDeductibleAmt);
        //    return false;
        //}
        ////10-apr-2023 Added new condition
        //else if (_OverrideDeductibleAmt != 0 && _OverrideDeductibleAmt < _eligibleAmount) {
        //    if (_balanceDeductibleAmt > 0) {
        //        DialogWarningMessage('Modified deductible amount should be 0 or ' + _eligibleAmount);
        //    }
        //    else {
        //        DialogWarningMessage('Modified deductible amount should be 0');
        //    }
        //    return false;
        //}
        //Added new condition by subbu 13APR2023
        if (_balanceDeductibleAmt >= _eligibleAmount) {
            if (_OverrideDeductibleAmt != 0 && _OverrideDeductibleAmt != _eligibleAmount) {
                _ValidateDeductibleAmt = true;
                DialogWarningMessage('Modifyed Deductible amount should be 0 or ' + _eligibleAmount);
                return false;
            }
        }
        else if (_balanceDeductibleAmt < _eligibleAmount) {
            if (_OverrideDeductibleAmt != 0 && _OverrideDeductibleAmt != _balanceDeductibleAmt) {
                _ValidateDeductibleAmt = true;
                DialogWarningMessage('Modifyed Deductible amount should be 0 or ' + _balanceDeductibleAmt);
                return false;
            }
        }

        //End Added new condition by subbu 13APR2023
    }
    //else if (_balanceDeductibleAmt > _claimedAmount) {
    //    DialogWarningMessage('Modified deductible amount is greater than the total claimed amount.');
    //    isbillcalculated = true;  //10-apr-2023 Added new condition
    //    _ValidateDeductibleAmt = true;
    //    return false;
    //}
    ShowOverideLable();
    //End SP3V-1611
    var rowCount = $('#tbloverrideRuleApproval >tbody >tr').length;
    var IsOverrideDone = $("#hdnIsCopayDone").val();
    if (rowCount == 1) {
        $("#IsOverride").attr("hidden", false);
    }
    isbillcalculated = true;
    var isCI = false;
    if ($('#hdnClaimsCodingDetails').val() != "" && $('#hdnClaimsCodingDetails').val() != undefined && $('#hdnClaimsCodingDetails').val() != null) {
        if ($.parseJSON($('#hdnClaimsCodingDetails').val()).length > 0)
            isCI = $.parseJSON($('#hdnClaimsCodingDetails').val())[0].isCI;
        $('#hdnTPAProcID').val($.parseJSON($('#hdnClaimsCodingDetails').val())[0].TPAProcedureID);
    }

    if ($('#hdnBillingType').val() != '') {
        _billingType = $('#hdnBillingType').val();
    }
    if ($('#hdnClaimTypeID').val() != '') {
        _claimtype = $('#hdnClaimTypeID').val();
    }
    var objsuminsured = _objBsi["Suminsured"];
    var objbenefits = _objBsi["OtherBenefits"];
    Sublimits = _objBsi["Sublimits"];
    var OPD_data = $.parseJSON($("#hdnOpddetails").val());
    if (OPD_data[0].OPDFlag == true)
        isOPDLimit = true;
    isbufferwithoutbase = basicData[0].bufferwithoutbase;

    if (isbufferwithoutbase == false) {
        if (_requesttype != 12) {
            if (_objBsi != null && objsuminsured.length > 0) {
                //Buffer Logic
                if (basicData[0].IsBufferEnabled == true) {
                    if (_objBsi != null && objbenefits.length > 0) {
                        if (objbenefits.length > 0) {
                            var remBal = 0;
                            $.each(objbenefits, function (i, item) {
                                if (allowedbenefits.indexOf(item.BPSIID) != -1) {
                                    if (item.SICategery == 29) {
                                        _bal = item.Balance;
                                        remBal = remBal + _bal;
                                    }
                                }
                            });

                            if (remBal > bufferAllocatedAmount)
                                remBal = bufferAllocatedAmount;

                            bufferAllocatedAmount = remBal;
                        }
                    }
                }
                if (_objBsi != null && objsuminsured.length > 0) {
                    var remBal = 0;
                    // var baseremBal = 0;
                    $.each(objsuminsured, function (i, item) {
                        //if (item.SICategoryID == 69) {
                        //    _bal = item.Balance;
                        //    remBal = remBal + _bal;
                        //    baseremBal = item.Balance;
                        //}
                        if (allowedsi.indexOf(item.BPSIID) != -1 && (item.SICategery == 476 || item.SICategery == 477)) {
                            if (item.Balance > rechargeSIlimit)
                                _bal = rechargeSIlimit;
                            else if (item.Balance < rechargeSIlimit) {
                                _bal = item.Balance;
                            }
                            remBal = remBal + _bal;
                        }
                        else if (allowedsi.indexOf(item.BPSIID) != -1) {
                            _bal = item.Balance;
                            remBal = remBal + _bal;
                        }
                    });
                    totalremainingBalofBSI = remBal + bufferAllocatedAmount;
                }

                //if (_requesttype == 9 || _requesttype == 10) {
                //    if (_objBsi != null && objbenefits.length > 0) {
                //        var remBal = 0;
                //        $.each(objbenefits, function (i, item) {
                //            if (allowedbenefits.indexOf(item.BPSIID) != -1) {
                //                if (item.SICategery != 29) {
                //                    _bal = item.Balance;
                //                    remBal = remBal + _bal;
                //                }
                //            }
                //        });
                //        totalremainingBalofBSI = remBal;
                //    }
                //}
            }
            else {
                alert('BSI Details not found. Please check and reload');
                return false;
            }
        }
    }
    else if (isbufferwithoutbase == true) {
        if (basicData[0].IsBufferEnabled == true) {
            if (_objBsi != null && objbenefits.length > 0) {
                if (objbenefits.length > 0) {
                    var remBal = 0;
                    $.each(objbenefits, function (i, item) {
                        if (allowedbenefits.indexOf(item.BPSIID) != -1) {
                            if (item.SICategery == 29) {
                                _bal = item.Balance;
                                remBal = remBal + _bal;
                            }
                        }
                    });
                    bufferAllocatedAmount = remBal;
                }
            }
            totalremainingBalofBSI = bufferAllocatedAmount;
        }
    }
    else {
        if (_objBsi != null && objbenefits.length > 0) {
            if (objbenefits.length > 0) {
                var remBal = 0;
                $.each(objbenefits, function (i, item) {
                    if (allowedbenefits.indexOf(item.BPSIID) != -1) {
                        if (item.SICategery != 29) {
                            _bal = item.Balance;
                            remBal = remBal + _bal;
                        }
                    }
                });
                totalremainingBalofBSI = remBal;
            }
        }
    }

    if ((isSumlimit || isOPDLimit) && (_objBsi != null && objsuminsured.length > 0)) {
        var RembalOPDSublimit = 0;
        $.each(objsuminsured, function (i, item) {
            if (allowedsi.indexOf(item.BPSIID) != -1 && (item.SICategery == 69 || item.SICategery == 70 || item.SICategery == 74)) {
                _balOPDSublimt = item.Balance;
                RembalOPDSublimit = RembalOPDSublimit + _balOPDSublimt;
            }
        });
        remainSIbalforOPDSublimit = RembalOPDSublimit;
    }

    if (isSumlimit) {
        if (Sublimits.length > 0) {
            $.each(Sublimits, function (i, item) {
                if (allowedsi.indexOf(item.BPSIID) != -1) {
                    remainingSublimit = item.Balance;
                    sublimitflag = true;// SPMay-10
                }
            })
        }
        if (sublimitflag == true) {// SPMay-10
            if (remainingSublimit > remainSIbalforOPDSublimit) {
                remainingSublimit = remainSIbalforOPDSublimit;
            }
            totalremainingBalofBSI = remainingSublimit;
        }// SPMay-10
        if (bufferAllocatedAmount > 0)
            totalremainingBalofBSI = remainingSublimit + bufferAllocatedAmount;
    }

    //if (isOPDLimit) {
    //    if (OPDLimits.length > 0) {
    //        $.each(OPDLimits, function (i, item) {
    //            if (allowedsi.indexOf(item.BPSIID) != -1) {
    //                remainingOPDlimit = item.Balance;
    //            }
    //        })
    //    }
    //    totalremainingBalofBSI = remainingOPDlimit;
    //    if (bufferAllocatedAmount > 0)
    //        totalremainingBalofBSI = remainingSublimit + bufferAllocatedAmount;
    //}   

    if (basicData[0].ServiceTypeID == 2 && isOPDLimit) {
        var minieligibleamount = remainSIbalforOPDSublimit;
        var data = $.parseJSON($("#hdnOpddetails").val());
        if (isOPDLimit && data[0].IsOPDCovered == true) {
            if (OPDLimits.length > 0) {
                $.each(OPDLimits, function (i, item) {
                    if (allowedsi.indexOf(item.BPSIID) != -1) {
                        remainingOPDlimit = item.Balance;
                    }
                })
            }
            if (data[0].OPDFlag == true) {
                if (data[0].OPDPolicylimit > 0) {
                    if (data[0].OPDAvailablePollimit >= 0)
                        minieligibleamount = data[0].OPDAvailablePollimit;
                }
                if (data[0].OPDfamilyLimit > 0) {
                    if (data[0].OPDAvailableFamilyLimit >= 0)
                        if (minieligibleamount > data[0].OPDAvailableFamilyLimit)
                            minieligibleamount = data[0].OPDAvailableFamilyLimit;
                }
                if (data[0].OPDIndividualLimit > 0) {
                    if (data[0].OPDAvailbaleIndividualLimit >= 0) {
                        if (minieligibleamount > data[0].OPDAvailbaleIndividualLimit)
                            minieligibleamount = data[0].OPDAvailbaleIndividualLimit;
                    }
                }
                if (data[0].OpdClaimLimit > 0) {
                    if (data[0].OPDAvailClaimLimit >= 0) {
                        if (minieligibleamount > data[0].OPDAvailClaimLimit)
                            minieligibleamount = data[0].OPDAvailClaimLimit;
                    }
                }
                totalremainingBalofBSI = minieligibleamount;
                //if (remainingOPDlimit > minieligibleamount) {
                //    totalremainingBalofBSI = minieligibleamount;
                //}
                //else if (remainingOPDlimit <= minieligibleamount)
                //    totalremainingBalofBSI = remainingOPDlimit;
                //else
                //    totalremainingBalofBSI = remainingOPDlimit;

                if (totalremainingBalofBSI > remainingSublimit && isSumlimit && sublimitflag == true)// SPMay-10
                    totalremainingBalofBSI = remainingSublimit;
                if (!isSumlimit && totalremainingBalofBSI > remainSIbalforOPDSublimit) {
                    totalremainingBalofBSI = remainSIbalforOPDSublimit;
                }
                if (bufferAllocatedAmount > 0)
                    totalremainingBalofBSI = totalremainingBalofBSI + bufferAllocatedAmount;
            }
        }
        else if (isOPDLimit && data[0].IsOPDCovered == false) {
            totalremainingBalofBSI = 0;
        }
    }

    if (isSumlimit) {
        final_sublimit_amt = totalremainingBalofBSI;
        $.each(objsuminsured, function (i, item) {
            if (allowedsi.indexOf(item.BPSIID) != -1 && (item.SICategery == 70 || item.SICategery == 74)) {
                totalremainingBalofBSI = totalremainingBalofBSI + item.Balance;
            }
        });
    }
    //if (_bsiData != null) {
    //    //Buffer Logic
    //    if (_bsiData["Table3"].length > 0) {
    //        var remBal = 0;
    //        $.each(_bsiData["Table3"], function (i, item) {
    //            if (item.SICategoryID == 73) {
    //                _bal = ((item.ApprovedAmount) - (item.BlockedAmt + item.UtilizedAmt));
    //                remBal = remBal + _bal;
    //            }   
    //        });
    //        bufferAllocatedAmount = remBal;
    //    }
    //    if (_bsiData["Table1"].length > 0) {
    //        var remBal = 0;
    //        $.each(_bsiData["Table1"], function (i, item) {
    //            var approveRequired = 0;
    //            approveRequired = item.ApprovalReq_P60 == null ? 0 : item.ApprovalReq_P60;
    //            if (_requesttype == 9) {
    //                if (item.SICategoryID == 257 && approveRequired == 0) {
    //                    _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                    remBal = remBal + _bal;
    //                }
    //                else if (item.SICategoryID == 257 && approveRequired != 0) {
    //                    approvalFlag = true;
    //                    if (approveRequired == 249)
    //                        DialogWarningMessage('Insurer Approval Required to Use Critical Suminsured');
    //                    else
    //                        if (approveRequired == 252)
    //                            DialogWarningMessage('HR Approval Required to Use Critical Suminsured');
    //                    return false;
    //                }
    //                else {//New Logic for HCB Claims fall under WithIn SI
    //                    var ishcbExist = 0;
    //                    $.each(_bsiData["Table1"], function (k, kitem) {
    //                        if (kitem.SICategoryID == 257)
    //                            ishcbExist = 1;
    //                    });
    //                    if (ishcbExist == 0 && item.SICategoryID == 69) {
    //                        _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                        remBal = remBal + _bal;
    //                    }
    //                }

    //            }//_requesttype == 9 end
    //            else if (isAccidentRTA == true) {//if Accident Case Claim amount will be deduct from base first then Double SI
    //                if (item.SICategoryID == 69) {
    //                    _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                    remBal = remBal + _bal;
    //                } else
    //                    if (item.SICategoryID == 72 && approveRequired == 0) {
    //                        _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                        remBal = remBal + _bal;
    //                    }
    //                    else if (item.SICategoryID == 72 && approveRequired != 0) {
    //                        approvalFlag = true;
    //                        if (approveRequired == 249)
    //                            DialogWarningMessage('Insurer Approval Required to Use Critical Suminsured');
    //                        else
    //                            if (approveRequired == 252)
    //                                DialogWarningMessage('HR Approval Required to Use Critical Suminsured');
    //                        return false;
    //                    }
    //            }
    //            else if (isCI == true && isAccidentRTA != true) {
    //                if (isLumpsum == 1) {
    //                    if (item.SICategoryID == 69) {
    //                        _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                        remBal = remBal + _bal;
    //                    }
    //                } else {
    //                    if (item.SICategoryID == 69) {
    //                        _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                        remBal = remBal + _bal;
    //                    } else
    //                        if (item.SICategoryID == 71 && approveRequired == 0) {
    //                            _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                            remBal = remBal + _bal;
    //                        }
    //                        else if (item.SICategoryID == 71 && approveRequired != 0) {
    //                            approvalFlag = true;
    //                            if (approveRequired == 249)
    //                                DialogWarningMessage('Insurer Approval Required to Use Critical Suminsured');
    //                            else
    //                                if (approveRequired == 252)
    //                                    DialogWarningMessage('HR Approval Required to Use Critical Suminsured');
    //                            return false;
    //                        }
    //                }
    //            }
    //            else if (_requesttype != 9) {
    //                if (item.SICategoryID == 69) {
    //                    _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                    remBal = remBal + _bal;
    //                }
    //                else if (item.SICategoryID == 73) {
    //                    if (approveRequired == 0) {
    //                        _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                        remBal = remBal + _bal;
    //                    }
    //                    else if (item.SICategoryID == 73 && approveRequired != 0) {
    //                        approvalFlag = true;
    //                        if (approveRequired == 249)
    //                            DialogWarningMessage('Insurer Approval Required to Use Critical Suminsured');
    //                        else
    //                            if (approveRequired == 252)
    //                                DialogWarningMessage('HR Approval Required to Use Critical Suminsured');
    //                        return false;
    //                    }
    //                }
    //            }
    //        });
    //        totalremainingBalofBSI = remBal;
    //    } else {
    //        DialogWarningMessage('Balance sum insured data not found');
    //    }
    //}
    //Hospital Discount
    _hospitalDiscount = Makezerofromnullorundefined($('#txtHospitalDiscount').val());

    //Applicable Discount
    _applicableDiscount = Math.max(parseFloat(_mouDiscount), _hospitalDiscount);

    //Applicable Bill Amount(new Title) or Bill After Deductions
    _applicablebillAmount = _totalbillAmount - _totalDeductions;


    // copay calculation on Billafterdeductionanddiscount
    _billafterDeductionandDiscount = _applicablebillAmount;

    //Checking multiple sub conditions configured for Copay Calculation On--Start Here
    var copaycalcon = [[77, 78], [76, 79], [75, 80]];
    var subconditionofcopaycalconarray = [];
    var _finalcopaycon = [];
    $.each(_copayrules, function (i, item) {
        if (subconditionofcopaycalconarray.indexOf(item.BPSubConditionID) == -1) {
            subconditionofcopaycalconarray.push(item.BPSubConditionID);
        }
    });
    var count = 0;
    $.each(copaycalcon, function (i, item) {
        var isfound = false;
        var ccset = item;
        $.each(subconditionofcopaycalconarray, function (j, id) {
            if (ccset.indexOf(id) !== -1) {
                isfound = true;
                _finalcopaycon = ccset;
            }
        });
        if (isfound)
            count++;
    });

    if (count > 1) {
        alert('Multiple Copay calculations found. BP Rules configured wrongly. Please check with BP Team.');
        return false;
    }
    if (_finalcopaycon.length > 0) {
        if (_finalcopaycon[0] == 77 || _finalcopaycon[1] == 78) {
            _copaycalculationon = 75;
        }
        else if (_finalcopaycon[0] == 76 || _finalcopaycon[1] == 79) {
            _copaycalculationon = 75;
        }
        else {
            _copaycalculationon = 75;
        }
    }
    else {
        _copaycalculationon = 75;
    }


    //Checking multiple sub conditions configured for Copay Calculation On---End 

    if (_copaycalculationon == 77) {
        if (_billafterDeductionandDiscount != '' && _billafterDeductionandDiscount != '0') {
            _copayhtml = '<div class="col-sm-12" style="    margin-bottom:0px;"><table class="table" style="    margin-left: 10px; "><thead><tr><td class="center">#</td><td class="hidden-xs">Rule</td><td>Per(%)</td><td class="hidden-480">Value</td><td>Actual</td></tr></thead> <tbody>';
            var _copaymntAccmulate = 0;
            var _copaymntNonAccmulate = 0;

            var _max_copayper = 'N/A'; var _max_copayval = 0; var _max_copaylessormore = 'N/A'; var _max_copayperval = 0; var _max_copayamt = 0;

            copaymentAmt = 0;
            var CopayPerc = 0;
            if (_copayrules.length > 0) {
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 100) {
                        copaycalculation(item, 75);
                        copaymentAmt = copaymentAmt + _copayamt;
                        _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Intimation Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 101) {
                        copaycalculation(item);
                        copaymentAmt = copaymentAmt + _copayamt;
                        _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Submission Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 102) {
                        copaycalculation(item);
                        copaymentAmt = copaymentAmt + _copayamt;
                        _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Network Hospital Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 103) {
                        copaycalculation(item);
                        copaymentAmt = copaymentAmt + _copayamt;
                        _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Non-Network Hospital Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 104) {
                        copaycalculation(item);
                        copaymentAmt = copaymentAmt + _copayamt;
                        _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Capped Ailment Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 82) {
                        copaycalculation(item);
                        copaymentAmt = copaymentAmt + _copayamt;
                        _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Voluntary Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 74) {
                        copaycalculation(item);
                        copaymentAmt = copaymentAmt + _copayamt;
                        _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Zonal Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 8) {
                        copaycalculation(item);
                        copaymentAmt = copaymentAmt + _copayamt;
                        _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">General Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                    }
                });
                //$.each(_copayrules, function (i, item) {

                //    var _copayamt = 0;
                //    var _copayperval = 0;
                //    var _copayval = 0;
                //    var _copayper = 'N/A';
                //    var _copaylessormore = 'N/A';
                //    if (item.IsAccumulate == false) {
                //        //  $.each(item, function (i, item) {}
                //        if (item.per != '' && item.per != null) {
                //            _copayper = item.per;
                //            _copayperval = parseInt((_billafterDeductionandDiscount * item.per) / 100);

                //            //_max_copayper = _copayper;
                //            //_max_copayperval = _copayperval;
                //        }
                //        if (item.val != '' && item.val != null) {
                //            _copayval = parseFloat(item.val);
                //            //  _max_copayval = _copayval;
                //        }
                //        if (item.lm != '' && item.lm != null) {
                //            _copayamt = item.lm == 1 ? Math.min(_copayperval, _copayval) : Math.max(_copayperval, _copayval);
                //            _copaylessormore = item.lm == 1 ? 'Less' : 'More';

                //            //_max_copayamt = _copayamt;
                //            //  _max_copaylessormore = _copaylessormore
                //        } else {
                //            _copayamt = Math.max(_copayperval, _copayval);
                //            // _max_copayamt = _copayamt;
                //        }
                //        _copaymntNonAccmulate = Math.max(_copaymntNonAccmulate, _copayamt);

                //        if (item.BPConditionID == 74) {
                //            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Zonal Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                //        } else if (item.BPConditionID == 82) {
                //            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Voluntary Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                //        } else if (item.BPConditionID == 8) {
                //            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">General Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                //        }
                //    } else {
                //        if (item.per != '' && item.per != null) {
                //            _copayper = item.per;
                //            _copayperval = parseInt((_billafterDeductionandDiscount * item.per) / 100);
                //        }
                //        if (item.val != '' && item.val != null) {
                //            _copayval = parseFloat(item.val);
                //        }
                //        if (item.lm != '' && item.lm != null) {
                //            _copayamt = item.lm == 1 ? Math.min(_copayperval, _copayval) : Math.max(_copayperval, _copayval);
                //            _copaylessormore = item.lm == 1 ? 'Less' : 'More';
                //        } else {
                //            _copayamt = _copayperval;
                //        }
                //        _copaymntAccmulate = _copaymntAccmulate + _copayamt;

                //        if (item.BPConditionID == 74) {
                //            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Zonal Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                //        } else if (item.BPConditionID == 82) {
                //            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Voluntary Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                //        } else if (item.BPConditionID == 8) {
                //            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">General Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                //        }
                //    }
                //})
                // copaymentAmt = _copaymntNonAccmulate + _copaymntAccmulate;//Math.max(parseFloat(Makezerofromnullorundefined($('#txtCoPayment').val())), copaymentAmt);
            }
            _copayhtml = _copayhtml + ' </tbody></table></div>';
        }

        if (copaystatus == true) {
            copaymentAmt = $('.txtCoPaymentOverride').val();
            copaymentAmt = parseFloat(copaymentAmt);
            if ($('.txtCoPaymentOverride').val() == "" || $('.txtCoPaymentOverride').val() == null) {
                alert('Please enter copayment amount');
                return false;
            }
        }
    }
    /////////////////
    //Excess to Claimed Amount

    //_excesstoclaimedAmount = (_totalbillAmount - _claimedAmount) > 0 ? (_totalbillAmount - _claimedAmount) : 0;
    _excesstoclaimedAmount = (_applicablebillAmount - _claimedAmount) > 0 ? (_applicablebillAmount - _claimedAmount) : 0;//As Discussed with Madhav ,Formula changed by srinu B 


    //if (Makezerofromnullorundefined($('#txtHospitalDiscount').val()) > _mouDiscount)
    //    _applicablebillAmount = _totalbillAmount - (_excesstoclaimedAmount + _totalDeductions);
    //else
    //    _applicablebillAmount = _totalbillAmount - (_excesstoclaimedAmount + _totalDeductions);


    //Eligible Amount
    //Commented By Venkat Mandadi for solving Discount in bill double time decuctions
    //if ($('#hdnStageID').val() != 22) {
    //    if (Makezerofromnullorundefined($('#txtHospitalDiscount').val()) >= _mouDiscount)
    //        _eligibleAmount = _raweligibleAmount - (Makezerofromnullorundefined($('#txtHospitalDiscount').val()) - _mouDiscount);
    //}
    //    else {
    //        if (Makezerofromnullorundefined($('#txtHospitalDiscount').val()) >= _mouDiscount)
    //            _eligibleAmount = _eligibleAmount - (Makezerofromnullorundefined($('#txtHospitalDiscount').val()) - _mouDiscount);
    //}

    // For Task: (SP-1103)
    // As discussed with Srinu bathina below conditions added by Venkat Mandadi 
    // for resolving double time deductions(deductions in bill, etc..) and MOU Discount issue.
    if (Makezerofromnullorundefined($('#txtHospitalDiscount').val()) == _mouDiscount) {
        _eligibleAmount = (_applicablebillAmount - _mouDiscount);
    }
    else if (Makezerofromnullorundefined($('#txtHospitalDiscount').val()) > _mouDiscount) {
        _eligibleAmount = (_applicablebillAmount - Makezerofromnullorundefined($('#txtHospitalDiscount').val()));
    }
    else if (Makezerofromnullorundefined($('#txtHospitalDiscount').val()) < _mouDiscount) {
        _eligibleAmount = (_applicablebillAmount - _mouDiscount);
    }
    if (_eligibleAmount <= 0) {
        _eligibleAmount = 0;
    }

    if (_copaycalculationon == 77) {
        if (copaymentAmt != 0) {
            if ((_eligibleAmount - copaymentAmt) >= 0) {
                _eligibleAmount = _eligibleAmount - copaymentAmt;
            }
            else {
                _eligibleAmount = 0;
            }
        }
    }

    _eligibleAmount = _eligibleAmount + _NME_AMOUNT;
    //if (_applicableDiscount >= 0)
    //    _eligibleAmount = _raweligibleAmount - (_applicableDiscount);

    //Copayment Amount --On Eligible Amount
    if (_copaycalculationon == 75) {
        if (_eligibleAmount != '' && _eligibleAmount != '0') {
            _copayhtml = '<div class="col-sm-12" style="    margin-bottom:0px;"><table class="table" style="    margin-left: 10px; "><thead><tr><td class="center">#</td><td class="hidden-xs">Rule</td><td>Per(%)</td><td class="hidden-480">Value</td><td>Actual</td></tr></thead> <tbody>';
            var _copaymntAccmulate = 0;
            var _copaymntNonAccmulate = 0;
            var _max_copayper = 'N/A'; var _max_copayval = 0; var _max_copaylessormore = 'N/A'; var _max_copayperval = 0; var _max_copayamt = 0;
            copaymentAmt = 0;
            var CopayPerc = 0;
            copayeligibleamount = _eligibleAmount;
            if (_copayrules.length > 0) {
                // copaymentAmt = 0;
                //  _copayhtml = '<div class="col-sm-12" style="    margin-bottom:0px;"><table class="table" style="    margin-left: 10px; "><thead><tr><td class="center">#</td><td class="hidden-xs">Rule</td><td>Per(%)</td><td class="hidden-480">Value</td><td>Actual</td></tr></thead> <tbody>';
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 100 && basicData[0].IntimationID == 0 && basicData[0].ClaimTypeID == 2 && (basicData[0].RequestTypeID == 4) && copayapplicableonbuffer(item.copayonbuffer, totalremainingBalofBSI, bufferAllocatedAmount)) {
                        copaycalculation(item);
                        if (copaylmt_flag == false) {
                            copaymentAmt = copaymentAmt + _copayamt;
                            copayeligibleamount = copayeligibleamount - _copayamt;
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Intimation Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                        }
                        else if (copaylmt_flag == true) {
                            if (ramaining_copay_lmt >= _copayamt) {
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = ramaining_copay_lmt - _copayamt;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Intimation Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                            else {
                                _copayamt = ramaining_copay_lmt;
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = 0;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Intimation Copay(Copay limit exhausted) ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                        }
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 101 && (basicData[0].RequestTypeID == 4 || basicData[0].RequestTypeID == 7) && copayapplicableonbuffer(item.copayonbuffer, totalremainingBalofBSI, bufferAllocatedAmount)) {
                        copaycalculation(item);
                        if (copaylmt_flag == false) {
                            copaymentAmt = copaymentAmt + _copayamt;
                            copayeligibleamount = copayeligibleamount - _copayamt;
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Submission Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';

                        }
                        else if (copaylmt_flag == true) {
                            if (ramaining_copay_lmt >= _copayamt) {
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = ramaining_copay_lmt - _copayamt;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Submission Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                            else {
                                _copayamt = ramaining_copay_lmt;
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = 0;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Submission Copay(Copay limit exhausted) ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                        }
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 102 && basicData[0].ClaimTypeID == 2 && basicData[0].mainclaimtypeID == 2 && (basicData[0].RequestTypeID == 4 || basicData[0].RequestTypeID == 7) && copayapplicableonbuffer(item.copayonbuffer, totalremainingBalofBSI, bufferAllocatedAmount)) {
                        copaycalculation(item);
                        if (copaylmt_flag == false) {
                            copaymentAmt = copaymentAmt + _copayamt;
                            copayeligibleamount = copayeligibleamount - _copayamt;
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Network Hospital Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';

                        }
                        else if (copaylmt_flag == true) {
                            if (ramaining_copay_lmt >= _copayamt) {
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = ramaining_copay_lmt - _copayamt;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Network Hospital Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                            else {
                                _copayamt = ramaining_copay_lmt;
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = 0;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Network Hospital Copay(Copay limit exhausted) ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                        }
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 103 && copayapplicableonbuffer(item.copayonbuffer, totalremainingBalofBSI, bufferAllocatedAmount)) {
                        copaycalculation(item);
                        if (copaylmt_flag == false) {
                            copaymentAmt = copaymentAmt + _copayamt;
                            copayeligibleamount = copayeligibleamount - _copayamt;
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Non-Network Hospital Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';

                        }
                        else if (copaylmt_flag == true) {
                            if (ramaining_copay_lmt >= _copayamt) {
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = ramaining_copay_lmt - _copayamt;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Non-Network Hospital Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                            else {
                                _copayamt = ramaining_copay_lmt;
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = 0;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Non-Network Hospital Copay(Copay limit exhausted) ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                        }
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 104 && copayapplicableonbuffer(item.copayonbuffer, totalremainingBalofBSI, bufferAllocatedAmount)) {
                        copaycalculation(item);
                        if (copaylmt_flag == false) {
                            copaymentAmt = copaymentAmt + _copayamt;
                            copayeligibleamount = copayeligibleamount - _copayamt;
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Capped Ailment Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';

                        }
                        else if (copaylmt_flag == true) {
                            if (ramaining_copay_lmt >= _copayamt) {
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = ramaining_copay_lmt - _copayamt;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Capped Ailment Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                            else {
                                _copayamt = ramaining_copay_lmt;
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = 0;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Capped Ailment Copay(Copay limit exhausted) ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                        }
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 82 && copayapplicableonbuffer(item.copayonbuffer, totalremainingBalofBSI, bufferAllocatedAmount)) {
                        copaycalculation(item);
                        if (copaylmt_flag == false) {
                            copaymentAmt = copaymentAmt + _copayamt;
                            copayeligibleamount = copayeligibleamount - _copayamt;
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Voluntary Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';

                        }
                        else if (copaylmt_flag == true) {
                            if (ramaining_copay_lmt >= _copayamt) {
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = ramaining_copay_lmt - _copayamt;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Voluntary Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                            else {
                                _copayamt = ramaining_copay_lmt;
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = 0;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Voluntary Copay(Copay limit exhausted) ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                        }
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 74 && copayapplicableonbuffer(item.copayonbuffer, totalremainingBalofBSI, bufferAllocatedAmount)) {
                        copaycalculation(item);
                        if (copaylmt_flag == false) {
                            copaymentAmt = copaymentAmt + _copayamt;
                            copayeligibleamount = copayeligibleamount - _copayamt;
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Zonal Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';

                        }
                        else if (copaylmt_flag == true) {
                            if (ramaining_copay_lmt >= _copayamt) {
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = ramaining_copay_lmt - _copayamt;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Zonal Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                            else {
                                _copayamt = ramaining_copay_lmt;
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = 0;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Zonal Copay(Copay limit exhausted) ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                        }
                    }
                });
                $.each(_copayrules, function (i, item) {
                    if (item.BPConditionID == 8 && copayapplicableonbuffer(item.copayonbuffer, totalremainingBalofBSI, bufferAllocatedAmount)) {
                        copaycalculation(item);
                        if (copaylmt_flag == false) {
                            copaymentAmt = copaymentAmt + _copayamt;
                            copayeligibleamount = copayeligibleamount - _copayamt;
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">General Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';

                        }
                        else if (copaylmt_flag == true) {
                            if (ramaining_copay_lmt >= _copayamt) {
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = ramaining_copay_lmt - _copayamt;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">General Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                            else {
                                _copayamt = ramaining_copay_lmt;
                                copaymentAmt = copaymentAmt + _copayamt;
                                copayeligibleamount = copayeligibleamount - _copayamt;
                                ramaining_copay_lmt = 0;
                                _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">General Copay(Copay limit exhausted) ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                            }
                        }
                    }
                });
                //$.each(_copayrules, function (i, item) {
                //    var _copayamt = 0;
                //    var _copayperval = 0;
                //    var _copayval = 0;
                //    var _copayper = 'N/A';
                //    var _copaylessormore = 'N/A';
                //    if (item.IsAccumulate == false) {
                //        if (item.per != '' && item.per != null) {
                //            _copayper = item.per;
                //            _copayperval = parseInt((_eligibleAmount * item.per) / 100);
                //            //_max_copayper = _copayper;
                //            //_max_copayperval = _copayperval;
                //        }
                //        if (item.val != '' && item.val != null) {
                //            _copayval = parseFloat(item.val);
                //            //  _max_copayval = _copayval;
                //        }
                //        if (item.lm != '' && item.lm != null) {
                //            _copayamt = item.lm == 1 ? Math.min(_copayperval, _copayval) : Math.max(_copayperval, _copayval);
                //            _copaylessormore = item.lm == 1 ? 'Less' : 'More';
                //            //_max_copayamt = _copayamt;
                //            //_max_copaylessormore = _copaylessormore
                //        } else {
                //            _copayamt = Math.max(_copayperval, _copayval);
                //            //_max_copayamt = _copayamt;
                //        }
                //        _copaymntNonAccmulate = Math.max(_copaymntNonAccmulate, _copayamt);
                //        if (item.BPConditionID == 74) {
                //            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Zonal Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                //        } else if (item.BPConditionID == 82) {
                //            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Voluntary Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                //        } else if (item.BPConditionID == 8) {
                //            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">General Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                //        }
                //    } else {
                //        if (item.per != '' && item.per != null) {
                //            _copayper = item.per;
                //            _copayperval = parseInt((_eligibleAmount * item.per) / 100);
                //        }
                //        if (item.val != '' && item.val != null) {
                //            _copayval = parseFloat(item.val);
                //        }
                //        if (item.lm != '' && item.lm != null) {
                //            _copayamt = item.lm == 1 ? Math.min(_copayperval, _copayval) : Math.max(_copayperval, _copayval);
                //            _copaylessormore = item.lm == 1 ? 'Less' : 'More';
                //        } else {
                //            _copayamt = _copayperval;
                //        }
                //        _copaymntAccmulate = _copaymntAccmulate + _copayamt;
                //        if (item.BPConditionID == 74) {
                //            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Zonal Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                //        } else if (item.BPConditionID == 82) {
                //            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Voluntary Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                //        } else if (item.BPConditionID == 8) {
                //            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">General Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                //        }

                //    }
                //    //if (_iscopayaccumulate == 1)
                //    //    copaymentAmt += _copayamt;
                //    //else

                //    //  _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                //})
                // _copayhtml = _copayhtml + '<tr><td colspan="5"><div class="row"><div class="col-sm-5 pull-right"><h6 class="pull-right">Total Copay :<span class="blue">' + copaymentAmt + '</span></h6></div></div></td></tr>'
                // _copayhtml = _copayhtml + ' </tbody></table></div>';


                //copaymentAmt = Math.max(parseFloat(Makezerofromnullorundefined($('#txtCoPayment').val())), copaymentAmt);
                // copaymentAmt = _copaymntNonAccmulate + _copaymntAccmulate;//Math.max(parseFloat(Makezerofromnullorundefined($('#txtCoPayment').val())), copaymentAmt);
            }
            //if (copaystatus == true)
            //    copaymentAmt = parseFloat(Makezerofromnullorundefined($('.txtCoPaymentOverride').val()));

            _copayhtml = _copayhtml + ' </tbody></table></div>';

        }
        //  alert(copaymentAmt);


        if (copaystatus == true) {
            copaymentAmt = $('.txtCoPaymentOverride').val();
            copaymentAmt = parseFloat(copaymentAmt);
            //manualCopay = $('.txtCoPaymentOverride').val();
            if ($('.txtCoPaymentOverride').val() == "" || $('.txtCoPaymentOverride').val() == null) {
                alert('Please enter copayment amount');
                return false;
            }
        }
        //else {
        //    //manualCopay = $('.lbltxtCoPayment').val();
        //     manualCopay = copaymentAmt;
        //}
    }

    ///  alert(copaystatus);
    //var _bsiDataarray = [{"Priority":1, "SICategoryID": 69,  "SumInsured": 100000, "BlockedAmt": 0, "UtilizedAmt": 0, "ApprovalReq_P60": null, "AllocatedAmt": null },
    //                    { "Priority": 2, "SICategoryID": 73, "SumInsured": 200000, "BlockedAmt": 0, "UtilizedAmt": 0, "ApprovalReq_P60": 1, "AllocatedAmt": 50000 },
    //                    { "Priority": 3, "SICategoryID": 71, "SumInsured": 100000, "BlockedAmt": 0, "UtilizedAmt": 0, "ApprovalReq_P60": 1, "AllocatedAmt": 50000 },
    //                    { "Priority": 4, "SICategoryID": 70, "SumInsured": 100000, "BlockedAmt": 0, "UtilizedAmt": 0, "ApprovalReq_P60": 0, "AllocatedAmt": 80000 }
    //                    ];

    //var _copayrulesarray = [{ rule: "Rule1", "SICategoryID": 69, per: "5", val: "5000", lm: "1" },
    //                        { rule: "Rule2", "SICategoryID": 69, per: "10", val: "10000", lm: "0" },
    //                        { rule: "Rule3", "SICategoryID": 73, per: "15", val: null, lm: null },
    //                        { rule: "Rule4", "SICategoryID": 73, per: null, val: "20000", lm: null },
    //                        { rule: "Rule5", "SICategoryID": 71, per: "20", val: "20000", lm: "0" },
    //                        { rule: "Rule6", "SICategoryID": 70, per: "10", val: null, lm: "0" }
    //                        ];//
    //var sicopaymentAmt = 0;
    ////Copay New Calculation by SumInsured wise
    //if (_copaycalculationon == 250) {
    //    if (_eligibleAmount != '' && _eligibleAmount != '0') {
    //        if (_copayrules.length > 0) {
    //            copaymentAmt = 0;
    //            _copayhtml = '<div class="col-sm-12" style="    margin-bottom:0px;"><table class="table" style="    margin-left: 10px; "><thead><tr><td class="center">#</td><td class="hidden-xs">Rule</td><td>Per(%)</td><td class="hidden-480">Value</td><td>Actual</td></tr></thead> <tbody>';

    //            $.each(_bsiDataarray, function (siIndex, siItem) {
    //                if (siItem.SICategoryID == 69) {
    //                    runcopaytRulesbySI(siItem.SICategoryID)
    //                    copaymentAmt = copaymentAmt + sicopaymentAmt;
    //                }
    //                else if (siItem.SICategoryID != 69 && siItem.ApprovalReq_P60 == 0 && siItem.AllocatedAmt > 0) {
    //                    runcopaytRulesbySI(siItem.SICategoryID)
    //                    copaymentAmt = copaymentAmt + sicopaymentAmt;
    //                }
    //                else if (siItem.SICategoryID != 69 && siItem.ApprovalReq_P60 == 1 && siItem.AllocatedAmt > 0) {
    //                    DialogWarningMessage('This member having Buffer SumInsured. Approval Required to get Utilized');
    //                    return false;
    //                }
    //                else if (siItem.SICategoryID != 69 && siItem.ApprovalReq_P60 == null && siItem.AllocatedAmt > 0) {
    //                    runcopaytRulesbySI(siItem.SICategoryID)
    //                    copaymentAmt = copaymentAmt + sicopaymentAmt;
    //                }
    //                copaymentAmt = copaymentAmt + sicopaymentAmt;
    //            });
    //            function runcopaytRulesbySI(siID) {
    //                sicopaymentAmt = 0;
    //                $.each(_copayrules, function (i, item) {
    //                    var _copayamt = 0;
    //                    var _copayperval = 0;
    //                    var _copayval = 0;
    //                    var _copayper = 'N/A';
    //                    var _copaylessormore = 'N/A';
    //                    if (item.per != '' && item.per != null) {
    //                        _copayper = item.per;
    //                        _copayperval = parseInt((_eligibleAmount * item.per) / 100);
    //                    }
    //                    if (item.val != '' && item.val != null) {
    //                        _copayval = parseFloat(item.val);
    //                    }
    //                    if (item.lm != '' && item.lm != null) {
    //                        _copayamt = item.lm == 1 ? Math.min(_copayperval, _copayval) : Math.max(_copayperval, _copayval);
    //                        _copaylessormore = item.lm == 1 ? 'Less' : 'More';
    //                    } else {
    //                        _copayamt = Math.max(_copayperval, _copayval);
    //                    }
    //                    sicopaymentAmt = Math.max(sicopaymentAmt, _copayamt);
    //                    _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
    //                })
    //            }
    //            _copayhtml = _copayhtml + ' </tbody></table></div>';
    //            copaymentAmt = Math.max(parseFloat(Makezerofromnullorundefined($('#txtCoPayment').val())), copaymentAmt);
    //        }
    //    }
    //}
    //Net Eligible Amount and Deductible Amount
    //SP3V-1611 Leena
    if (OverrideDeductible == true) {
        _balanceDeductibleAmt = _OverrideDeductibleAmt;
    }
    //END SP3V-1611                             
    if (_balanceDeductibleAmt > _eligibleAmount) {
        //_FinaldeductibleAmt = _deductableAmount;
        _calculatedDeductibleAmt = _eligibleAmount;
        _neteligibleAmount = 0;// (copaymentAmt + _deductableAmount) - _eligibleAmount;
        //SP3V-1611 Leena/subbu added condition 13APR2023
        if (OverrideDeductible == true && _OverrideDeductibleAmt == 0) {
            _balanceDeductibleAmt = $('#txtRemainingDeductibleAmount').text();
        }
        else
            _balanceDeductibleAmt = _balanceDeductibleAmt - _calculatedDeductibleAmt;
    }
    else {
        if (_copaycalculationon == 75) {
            if (_eligibleAmount >= (copaymentAmt + _balanceDeductibleAmt))
                _neteligibleAmount = _eligibleAmount - (copaymentAmt + _balanceDeductibleAmt);
            else
                _neteligibleAmount = 0;
            _calculatedDeductibleAmt = _balanceDeductibleAmt;
            //SP3V-1611 Leena/subbu added condition 13APR2023
            if (OverrideDeductible == true && _OverrideDeductibleAmt == 0) {
                _balanceDeductibleAmt = $('#txtRemainingDeductibleAmount').text();
            }
            else
                _balanceDeductibleAmt = 0;
        }
        else {
            if (_eligibleAmount >= (_balanceDeductibleAmt))
                _neteligibleAmount = _eligibleAmount - (_balanceDeductibleAmt);
            else
                _neteligibleAmount = 0;
            _calculatedDeductibleAmt = _balanceDeductibleAmt;
            //SP3V-1611 Leena/subbu added condition 13APR2023
            if (OverrideDeductible == true && _OverrideDeductibleAmt == 0) {
                _balanceDeductibleAmt = $('#txtRemainingDeductibleAmount').text();
            }
            else
                _balanceDeductibleAmt = 0;
        }


    }
    //Excess paid by Patient
    if (_claimtype == 1 && _requesttype != 1 && _requesttype != 2 && _requesttype != 3) {
        _patientpaidAmount = Makezerofromnullorundefined($('#txtPatientPaidAmount').val())
        //_excesspaidbyPatient = _patientpaidAmount - _nonPayabledecuctions;
        _excesspaidbyPatient = _patientpaidAmount - (_nonPayabledecuctions + copaymentAmt + _deductableAmount) > 0 ? _patientpaidAmount - (_nonPayabledecuctions + copaymentAmt + _deductableAmount) : 0;
    }
    var x = 0;
    isEPAnottodeductfrommhospital = $('#chkNottodeductfromhospital_EPBP').is(':checked');
    if (isEPAnottodeductfrommhospital == true) {
        if (_neteligibleAmount > 0)
            x = _neteligibleAmount - 0;

    } else {
        if (_neteligibleAmount > 0)
            x = _neteligibleAmount - _excesspaidbyPatient;
    }


    //alert(totalremainingBalofBSI);
    //Exceeding Preauth
    if (_claimtype == 1 && _requesttype != 1 && _requesttype != 2 && _requesttype != 3) {
        // _exceedingPreauth = (_neteligibleAmount - _approvedamount) > 0 ? (_neteligibleAmount - _approvedamount) : 0;
        _exceedingPreauth = (x - _approvedamount) > 0 ? (x - _approvedamount) : 0;
        if ((x - _exceedingPreauth) > totalremainingBalofBSI) {
            _exceedingPreauth = _exceedingPreauth + (x - totalremainingBalofBSI);
        }
    }

    var y = 0;
    if (x > 0) {
        if (basicData[0].IssueID == 24 && basicData[0].CorpID == 0) {
            y = (x - _exceedingPreauth);
            if (y > _premium && _claimtype == 1 && _requesttype == 4)
                y = (x - _exceedingPreauth) + _premium;
        }
        else
            y = x - _exceedingPreauth;
    }

    //Excess Sum Insured
    if ((_claimtype == 2) || (_claimtype == 1 && (_requesttype == 1 || _requesttype == 2 || _requesttype == 3)) || (_requesttype == 8)) {
        //_excessSuminsured = (_neteligibleAmount - totalremainingBalofBSI) > 0 ? (_neteligibleAmount - totalremainingBalofBSI) : 0;
        //_excessSuminsured = (y - totalremainingBalofBSI) > 0 ? (y - totalremainingBalofBSI) : 0;
        if (bufferAllocatedAmount > 0 && (totalremainingBalofBSI - bufferAllocatedAmount) >= 0)
            _excessSuminsured = (y - (totalremainingBalofBSI - bufferAllocatedAmount)) > 0 ? (y - (totalremainingBalofBSI - bufferAllocatedAmount)) : 0;
        else
            _excessSuminsured = (y - totalremainingBalofBSI) > 0 ? (y - totalremainingBalofBSI) : 0;
    }

    //Buffer amount
    //alert(bufferAllocatedAmount);
    //alert(_excessSuminsured);

    if ((bufferAllocatedAmount != 0) && ((_claimtype == 2) || (_claimtype == 1 && (_requesttype == 1 || _requesttype == 2 || _requesttype == 3)))) {
        bufferUtilizedAmount = (_excessSuminsured - bufferAllocatedAmount) > 0 ? bufferAllocatedAmount : _excessSuminsured;
    }
    else if ((bufferAllocatedAmount != 0) && ((_claimtype == 1 && (_requesttype != 1 && _requesttype != 2 && _requesttype != 3)))) {
        var z = (y - (totalremainingBalofBSI - bufferAllocatedAmount)) > 0 ? (y - (totalremainingBalofBSI - bufferAllocatedAmount)) : 0;
        bufferUtilizedAmount = (z - bufferAllocatedAmount) > 0 ? bufferAllocatedAmount : z;
    }

    //alert(bufferUtilizedAmount);
    //alert(_excessSuminsured);

    //Admissible Amount

    if (y > (_excessSuminsured - bufferUtilizedAmount)) {
        if ((_excessSuminsured - bufferUtilizedAmount) > 0)
            _admissibleAmount = y - (_excessSuminsured - bufferUtilizedAmount);
        else
            _admissibleAmount = y;
    }
    else
        _admissibleAmount = 0;

    //if (_admissibleAmount > totalremainingBalofBSI) {
    //    alert('Suminsured not getting matched with Sanctioned amount. Please check BSI and Process');
    //    return false;
    //}
    //if (_neteligibleAmount > (_exceedingPreauth + _excesspaidbyPatient + _excessSuminsured))
    //    _admissibleAmount = _neteligibleAmount - (_exceedingPreauth + _excesspaidbyPatient + _excessSuminsured);
    //else
    //    _admissibleAmount = 0;

    //Eligible Payable amount
    if (_admissibleAmount != '' && _admissibleAmount != '0')
        _eligiblepayableAmt = Math.min(_admissibleAmount, _claimedAmount);
    else
        _eligiblepayableAmt = 0;

    //Copay calculation on Payable Amount
    if (_copaycalculationon == 76) {

        var _copaymntAccmulate = 0;
        var _copaymntNonAccmulate = 0;

        if (_grosspayableAmt != '' && _grosspayableAmt != '0') {
            if (_copayrules.length > 0) {
                copaymentAmt = 0;
                _copayhtml = '<div class="col-sm-12" style="    margin-bottom:0px;"><table class="table" style="    margin-left: 10px; "><thead><tr><td class="center">#</td><td class="hidden-xs">Rule</td><td>Per(%)</td><td class="hidden-480">Value</td><td>Actual</td></tr></thead> <tbody>';
                $.each(_copayrules, function (i, item) {
                    var _copayamt = 0;
                    var _copayperval = 0;
                    var _copayval = 0;
                    var _copayper = 'N/A';
                    var _copaylessormore = 'N/A';
                    if (item.IsAccumulate == false) {
                        //  $.each(item, function (i, item) {}
                        if (item.per != '' && item.per != null) {
                            _copayper = item.per;
                            _copayperval = parseInt((_grosspayableAmt * item.per) / 100);

                            _max_copayper = _copayper;
                            _max_copayperval = _copayperval;
                        }
                        if (item.val != '' && item.val != null) {
                            _copayval = parseFloat(item.val);
                            _max_copayval = _copayval;
                        }
                        if (item.lm != '' && item.lm != null) {
                            _copayamt = item.lm == 1 ? Math.min(_copayperval, _copayval) : Math.max(_copayperval, _copayval);
                            _copaylessormore = item.lm == 1 ? 'Less' : 'More';

                            _max_copayamt = _copayamt;
                            _max_copaylessormore = _copaylessormore
                        } else {
                            _copayamt = Math.max(_copayperval, _copayval);
                            _max_copayamt = _copayamt;
                        }
                        _copaymntNonAccmulate = Math.max(_copaymntNonAccmulate, _copayamt);

                        if (item.BPConditionID == 74) {
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Zonal Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                        } else if (item.BPConditionID == 82) {
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Voluntary Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                        } else if (item.BPConditionID == 8) {
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">General Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                        }
                    } else {
                        if (item.per != '' && item.per != null) {
                            _copayper = item.per;
                            _copayperval = parseInt((_grosspayableAmt * item.per) / 100);
                        }
                        if (item.val != '' && item.val != null) {
                            _copayval = parseFloat(item.val);
                        }
                        if (item.lm != '' && item.lm != null) {
                            _copayamt = item.lm == 1 ? Math.min(_copayperval, _copayval) : Math.max(_copayperval, _copayval);
                            _copaylessormore = item.lm == 1 ? 'Less' : 'More';
                        } else {
                            _copayamt = _copayperval;
                        }
                        _copaymntAccmulate = _copaymntAccmulate + _copayamt;
                        if (item.BPConditionID == 74) {
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Zonal Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                        } else if (item.BPConditionID == 82) {
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Voluntary Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                        } else if (item.BPConditionID == 8) {
                            _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">General Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                        }

                    }
                })
                // _copayhtml = _copayhtml + '<tr><td colspan="5"><div class="row"><div class="col-sm-5 pull-right"><h6 class="pull-right">Total Copay :<span class="blue">' + copaymentAmt + '</span></h6></div></div></td></tr>'
                _copayhtml = _copayhtml + ' </tbody></table></div>';
                copaymentAmt = Math.max(parseFloat(Makezerofromnullorundefined($('#txtCoPayment').val())), copaymentAmt);
            }
        }
        if (copaystatus == true) {
            copaymentAmt = $('.txtCoPaymentOverride').val();
            copaymentAmt = parseFloat(copaymentAmt);
            //manualCopay = $('.txtCoPaymentOverride').val();
            if ($('.txtCoPaymentOverride').val() == "" || $('.txtCoPaymentOverride').val() == null) {
                alert('Please enter copayment amount');
                return false;
            }
        }
        //else {
        //    //manualCopay = $('.lbltxtCoPayment').val();
        //    manualCopay = copaymentAmt;
        //}
    }
    if (_copaycalculationon == 76) {
        if (_eligiblepayableAmt > 0) {
            if ((_eligiblepayableAmt - copaymentAmt) > 0) {
                _eligiblepayableAmt = _eligiblepayableAmt - copaymentAmt;
            }
            else {
                _eligiblepayableAmt = 0;
            }
        }
    }

    //Negotiated Discount
    _negotiatedDiscount = Makezerofromnullorundefined($('#txtNegotiatedDiscount').val())

    //Gross Payable Amount
    if (_eligiblepayableAmt != '' && _eligiblepayableAmt != '0')
        _grosspayableAmt = _eligiblepayableAmt - _negotiatedDiscount;
    else
        _grosspayableAmt = 0;
    //  _grosspayableAmt = Math.min(_eligiblepayableAmt, totalremainingBalofBSI);

    //Utilized Amount Calculation
    //if (_bsiData != null) {
    //    if (_bsiData["Table1"].length > 0) {
    //        utilizedamtarray = [];
    //        var rempayableAmt = _grosspayableAmt;
    //        var amtclr = 0;
    //        $.each(_bsiData["Table1"], function (i, item) {
    //            var approveRequired = 0;
    //            approveRequired = item.ApprovalReq_P60 == null ? 0 : item.ApprovalReq_P60;;
    //            if (_requesttype == 9) {
    //                if (item.SICategoryID == 257 && approveRequired == 0) {
    //                    var _utilizedamt = {};
    //                    _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                    if (rempayableAmt >= 0) {
    //                        if (_bal >= rempayableAmt) {
    //                            _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                            _utilizedamt["SanctionedAmount"] = rempayableAmt
    //                            _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
    //                            rempayableAmt = 0;
    //                            amtclr = 1;
    //                        }
    //                        else if (_bal < rempayableAmt) {
    //                            _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                            _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
    //                            _utilizedamt["BalanceAmount"] = 0;
    //                            rempayableAmt = (rempayableAmt - _bal);
    //                        }
    //                    } else {
    //                        _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                        _utilizedamt["SanctionedAmount"] = 0
    //                        _utilizedamt["BalanceAmount"] = _bal;
    //                    }
    //                    utilizedamtarray.push(_utilizedamt);
    //                }
    //                else if (item.SICategoryID == 257 && approveRequired != 0) {
    //                    approvalFlag = true;
    //                    if (approveRequired == 249)
    //                        DialogWarningMessage('Insurer Approval Required to Use Critical Suminsured');
    //                    else
    //                        if (approveRequired == 252)
    //                            DialogWarningMessage('HR Approval Required to Use Critical Suminsured');
    //                    return false;
    //                }
    //                else {//New Logic for HCB Claims fall under WithIn SI
    //                    var ishcbExist = 0;
    //                    $.each(_bsiData["Table1"], function (k, kitem) {
    //                        if (kitem.SICategoryID == 257)
    //                            ishcbExist = 1;
    //                    });
    //                    if (ishcbExist == 0 && item.SICategoryID == 69) {
    //                        var _utilizedamt = {
    //                        };
    //                        _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                        if (rempayableAmt >= 0) {
    //                            if (_bal >= rempayableAmt) {
    //                                _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                                _utilizedamt["SanctionedAmount"] = rempayableAmt
    //                                _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
    //                                rempayableAmt = 0;
    //                                amtclr = 1;
    //                            }
    //                            else if (_bal < rempayableAmt) {
    //                                _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                                _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
    //                                _utilizedamt["BalanceAmount"] = 0;
    //                                rempayableAmt = (rempayableAmt - _bal);
    //                            }
    //                        } else {
    //                            _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                            _utilizedamt["SanctionedAmount"] = 0
    //                            _utilizedamt["BalanceAmount"] = _bal;
    //                        }
    //                        utilizedamtarray.push(_utilizedamt);
    //                    }
    //                }
    //            }
    //            else if (isAccidentRTA == true) {//if Accident Case Claim amount will be deduct from base first then Double SI
    //                if (item.SICategoryID == 69) {
    //                    var _utilizedamt = {
    //                    };
    //                    _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                    if (rempayableAmt >= 0) {
    //                        if (_bal >= rempayableAmt) {
    //                            _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                            _utilizedamt["SanctionedAmount"] = rempayableAmt
    //                            _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
    //                            rempayableAmt = 0;
    //                            amtclr = 1;
    //                        }
    //                        else if (_bal < rempayableAmt) {
    //                            _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                            _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
    //                            _utilizedamt["BalanceAmount"] = 0;
    //                            rempayableAmt = (rempayableAmt - _bal);
    //                        }
    //                    } else {
    //                        _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                        _utilizedamt["SanctionedAmount"] = 0
    //                        _utilizedamt["BalanceAmount"] = _bal;
    //                    }
    //                    utilizedamtarray.push(_utilizedamt);
    //                } else
    //                    if (item.SICategoryID == 72 && approveRequired == 0) {
    //                        var _utilizedamt = {};
    //                        _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                        if (rempayableAmt >= 0) {
    //                            if (_bal >= rempayableAmt) {
    //                                _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                                _utilizedamt["SanctionedAmount"] = rempayableAmt
    //                                _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
    //                                rempayableAmt = 0;
    //                                amtclr = 1;
    //                            }
    //                            else if (_bal < rempayableAmt) {
    //                                _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                                _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
    //                                _utilizedamt["BalanceAmount"] = 0;
    //                                rempayableAmt = (rempayableAmt - _bal);
    //                            }
    //                        } else {
    //                            _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                            _utilizedamt["SanctionedAmount"] = 0
    //                            _utilizedamt["BalanceAmount"] = _bal;
    //                        }
    //                        utilizedamtarray.push(_utilizedamt);
    //                    }
    //                    else if (item.SICategoryID == 72 && approveRequired != 0) {
    //                        approvalFlag = true;
    //                        if (approveRequired == 249)
    //                            DialogWarningMessage('Insurer Approval Required to Use Critical Suminsured');
    //                        else
    //                            if (approveRequired == 252)
    //                                DialogWarningMessage('HR Approval Required to Use Critical Suminsured');
    //                        return false;
    //                    }
    //            }
    //            else if (isCI == true && isAccidentRTA != true) {
    //                //   else if (isCI == true) {
    //                if (isLumpsum == 1) {
    //                    if (item.SICategoryID == 69) {
    //                        var _utilizedamt = {};
    //                        _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                        if (rempayableAmt >= 0) {
    //                            if (_bal >= rempayableAmt) {
    //                                _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                                _utilizedamt["SanctionedAmount"] = rempayableAmt
    //                                _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
    //                                rempayableAmt = 0;
    //                                amtclr = 1;
    //                            }
    //                            else if (_bal < rempayableAmt) {
    //                                _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                                _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
    //                                _utilizedamt["BalanceAmount"] = 0;
    //                                rempayableAmt = (rempayableAmt - _bal);
    //                            }
    //                        } else {
    //                            _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                            _utilizedamt["SanctionedAmount"] = 0
    //                            _utilizedamt["BalanceAmount"] = _bal;
    //                        }
    //                        utilizedamtarray.push(_utilizedamt);
    //                    }
    //                } else {
    //                    //if CI claim and not lumpsum then use from CI SI first
    //                    if (item.SICategoryID == 71 && approveRequired == 0) {
    //                        var _utilizedamt = {};
    //                        _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                        if (rempayableAmt >= 0) {
    //                            if (_bal >= rempayableAmt) {
    //                                _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                                _utilizedamt["SanctionedAmount"] = rempayableAmt
    //                                _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
    //                                rempayableAmt = 0;
    //                                amtclr = 1;
    //                            }
    //                            else if (_bal < rempayableAmt) {
    //                                _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                                _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
    //                                _utilizedamt["BalanceAmount"] = 0;
    //                                rempayableAmt = (rempayableAmt - _bal);
    //                            }
    //                        } else {
    //                            _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                            _utilizedamt["SanctionedAmount"] = 0
    //                            _utilizedamt["BalanceAmount"] = _bal;
    //                        }
    //                        utilizedamtarray.push(_utilizedamt);
    //                    }
    //                    else if (item.SICategoryID == 71 && approveRequired != 0) {
    //                        approvalFlag = true;
    //                        if (approveRequired == 249)
    //                            DialogWarningMessage('Insurer Approval Required to Use Critical Suminsured');
    //                        else
    //                            if (approveRequired == 252)
    //                                DialogWarningMessage('HR Approval Required to Use Critical Suminsured');
    //                        return false;
    //                    }
    //                    //if Critical SI Exhasted then use From Base
    //                    if (item.SICategoryID == 69) {
    //                        var _utilizedamt = {};
    //                        _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                        if (rempayableAmt >= 0) {
    //                            if (_bal >= rempayableAmt) {
    //                                _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                                _utilizedamt["SanctionedAmount"] = rempayableAmt
    //                                _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
    //                                rempayableAmt = 0;
    //                                amtclr = 1;
    //                            }
    //                            else if (_bal < rempayableAmt) {
    //                                _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                                _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
    //                                _utilizedamt["BalanceAmount"] = 0;
    //                                rempayableAmt = (rempayableAmt - _bal);
    //                            }
    //                        } else {
    //                            _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                            _utilizedamt["SanctionedAmount"] = 0
    //                            _utilizedamt["BalanceAmount"] = _bal;
    //                        }
    //                        utilizedamtarray.push(_utilizedamt);
    //                    }
    //                }
    //            }
    //            else if (_requesttype != 9) {
    //                if (item.SICategoryID == 69) {
    //                    var _utilizedamt = {};
    //                    _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                    if (rempayableAmt >= 0) {
    //                        if (_bal >= rempayableAmt) {
    //                            _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                            _utilizedamt["SanctionedAmount"] = rempayableAmt
    //                            _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
    //                            rempayableAmt = 0;
    //                            amtclr = 1;
    //                        }
    //                        else if (_bal < rempayableAmt) {
    //                            _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                            _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
    //                            _utilizedamt["BalanceAmount"] = 0;
    //                            rempayableAmt = (rempayableAmt - _bal);
    //                        }
    //                    } else {
    //                        _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                        _utilizedamt["SanctionedAmount"] = 0
    //                        _utilizedamt["BalanceAmount"] = _bal;
    //                    }
    //                    utilizedamtarray.push(_utilizedamt);
    //                }
    //                else if (item.SICategoryID == 73) {
    //                    if (approveRequired == 0) {
    //                        var _utilizedamt = {};
    //                        _bal = ((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
    //                        if (rempayableAmt >= 0) {
    //                            if (_bal >= rempayableAmt) {
    //                                _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                                _utilizedamt["SanctionedAmount"] = rempayableAmt
    //                                _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
    //                                rempayableAmt = 0;
    //                                amtclr = 1;
    //                            }
    //                            else if (_bal < rempayableAmt) {
    //                                _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                                _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
    //                                _utilizedamt["BalanceAmount"] = 0;
    //                                rempayableAmt = (rempayableAmt - _bal);
    //                            }
    //                        } else {
    //                            _utilizedamt["MemberSIID"] = item.MemberSIID;
    //                            _utilizedamt["SanctionedAmount"] = 0
    //                            _utilizedamt["BalanceAmount"] = _bal;
    //                        }
    //                        utilizedamtarray.push(_utilizedamt);
    //                    }
    //                    else if (item.SICategoryID == 73 && approveRequired != 0) {
    //                        approvalFlag = true;
    //                        if (approveRequired == 249)
    //                            DialogWarningMessage('Insurer Approval Required to Use Critical Suminsured');
    //                        else
    //                            if (approveRequired == 252)
    //                                DialogWarningMessage('HR Approval Required to Use Critical Suminsured');
    //                        return false;
    //                    }
    //                }
    //            }
    //        });
    //    } else {
    //        DialogWarningMessage('Balance sum insured data not found');
    //    }
    //}
    if (_requesttype != 12) {
        if (totalremainingBalofBSI > 0) {
            utilizedamtarray = [];
            var rempayableAmt = _grosspayableAmt;
            var amtclr = 0;
            if (isSumlimit || isOPDLimit) {
                remainOPDSublimit = totalremainingBalofBSI - bufferAllocatedAmount;
                if (rempayableAmt > remainOPDSublimit) {
                    rempayableAmt = remainOPDSublimit;
                    if (_grosspayableAmt > (rempayableAmt + bufferAllocatedAmount)) {
                        _grosspayableAmt = rempayableAmt + bufferAllocatedAmount;
                        _admissibleAmount = rempayableAmt + bufferAllocatedAmount;
                        _eligiblepayableAmt = rempayableAmt + bufferAllocatedAmount;
                    }
                }
            }
            if (basicData[0].RequestTypeID == 8 && basicData[0].ClaimTypeID == 1) {
                var ReSettleamount = (_approvedamount - (_totalsanctionedamtforclaimreselmt - payablemountforclaim))
                if (ReSettleamount < 0)
                    ReSettleamount = 0;
                if (ReSettleamount < rempayableAmt) {
                    rempayableAmt = ReSettleamount;
                    _grosspayableAmt = ReSettleamount;
                    _admissibleAmount = ReSettleamount;
                    _eligiblepayableAmt = ReSettleamount;
                }
            }
            // premium amount added by prasad
            if (basicData[0].IssueID == 24 && basicData[0].CorpID == 0) {
                if (_admissibleAmount > _premium) {
                    _premiumAmt = _premium;
                    _eligiblepayableAmt = Math.min((_admissibleAmount - _premium), _claimedAmount);
                    _grosspayableAmt = (_eligiblepayableAmt - _negotiatedDiscount) < 0 ?0 :(_eligiblepayableAmt - _negotiatedDiscount) ;
                    _netpayableAmount = _grosspayableAmt;
                    rempayableAmt = _grosspayableAmt;
                }
                else if (_premium > _admissibleAmount) {
                    _premiumAmt = _admissibleAmount;
                    _eligiblepayableAmt = 0;
                    _grosspayableAmt = 0;
                    _netpayableAmount = 0;
                }
            } // added by prasad
            if (_objBsi != null && objsuminsured.length > 0) {

                /////////////////HCB and Convallsence logic Start

                var ishcbsi = false; var isConvalescencesi = false;
                $.each(objsuminsured, function (i, item) {
                    if (item.SICategery == 257) {
                        ishcbsi = true;
                    } else
                        if (item.SICategery == 258) {
                            isConvalescencesi = true;
                        }
                });

                if ((_requesttype == 9 && ishcbsi) || (_requesttype == 10 && isConvalescencesi)) {


                    if (ishcbsi && _requesttype == 9) {

                        $.each(objsuminsured, function (i, item) {
                            if (item.SICategery == 257) {
                                if (allowedsi.indexOf(item.BPSIID) != -1) {
                                    var _utilizedamt = {
                                    };
                                    _bal = item.Balance;//((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
                                    if (rempayableAmt >= 0) {
                                        if (_bal >= rempayableAmt) {
                                            _utilizedamt["MemberSIID"] = item.MemberSIID;
                                            _utilizedamt["SanctionedAmount"] = rempayableAmt
                                            _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
                                            rempayableAmt = 0;
                                            amtclr = 1;
                                        }
                                        else if (_bal < rempayableAmt) {
                                            _utilizedamt["MemberSIID"] = item.MemberSIID;
                                            _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
                                            _utilizedamt["BalanceAmount"] = 0;
                                            rempayableAmt = (rempayableAmt - _bal);
                                        }
                                    } else {
                                        _utilizedamt["MemberSIID"] = item.MemberSIID;
                                        _utilizedamt["SanctionedAmount"] = 0
                                        _utilizedamt["BalanceAmount"] = _bal;
                                    }
                                    utilizedamtarray.push(_utilizedamt);
                                    if (rempayableAmt > 0) {
                                        isbaseexshated = true;
                                    }
                                }
                            }
                        });
                    }
                    else if (isConvalescencesi && _requesttype == 10) {

                        $.each(objsuminsured, function (i, item) {
                            if (item.SICategery == 258) {
                                if (allowedsi.indexOf(item.BPSIID) != -1) {
                                    var _utilizedamt = {
                                    };
                                    _bal = item.Balance;//((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
                                    if (rempayableAmt >= 0) {
                                        if (_bal >= rempayableAmt) {
                                            _utilizedamt["MemberSIID"] = item.MemberSIID;
                                            _utilizedamt["SanctionedAmount"] = rempayableAmt
                                            _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
                                            rempayableAmt = 0;
                                            amtclr = 1;
                                        }
                                        else if (_bal < rempayableAmt) {
                                            _utilizedamt["MemberSIID"] = item.MemberSIID;
                                            _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
                                            _utilizedamt["BalanceAmount"] = 0;
                                            rempayableAmt = (rempayableAmt - _bal);
                                        }
                                    } else {
                                        _utilizedamt["MemberSIID"] = item.MemberSIID;
                                        _utilizedamt["SanctionedAmount"] = 0
                                        _utilizedamt["BalanceAmount"] = _bal;
                                    }
                                    utilizedamtarray.push(_utilizedamt);
                                    if (rempayableAmt > 0) {
                                        isbaseexshated = true;
                                    }
                                }
                            }
                        });
                    }
                    else { // Need to Build this logic when : No-need to Checking Base Exhansted or not condition.

                        //$.each(objsuminsured, function (i, item) {
                        //    if (item.SICategery == 69) {
                        //        if (allowedsi.indexOf(item.BPSIID) != -1) {
                        //            var _utilizedamt = {
                        //            };
                        //            _bal = item.Balance;//((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
                        //            if (rempayableAmt >= 0) {
                        //                if (_bal >= rempayableAmt) {
                        //                    _utilizedamt["MemberSIID"] = item.MemberSIID;
                        //                    _utilizedamt["SanctionedAmount"] = rempayableAmt
                        //                    _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
                        //                    rempayableAmt = 0;
                        //                    amtclr = 1;
                        //                }
                        //                else if (_bal < rempayableAmt) {
                        //                    _utilizedamt["MemberSIID"] = item.MemberSIID;
                        //                    _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
                        //                    _utilizedamt["BalanceAmount"] = 0;
                        //                    rempayableAmt = (rempayableAmt - _bal);
                        //                }
                        //            } else {
                        //                _utilizedamt["MemberSIID"] = item.MemberSIID;
                        //                _utilizedamt["SanctionedAmount"] = 0
                        //                _utilizedamt["BalanceAmount"] = _bal;
                        //            }
                        //            utilizedamtarray.push(_utilizedamt);
                        //            if (rempayableAmt > 0) {
                        //                isbaseexshated = true;
                        //            }
                        //        }
                        //    }
                        //});
                    }
                }

                /////////////////HCB and Convallsence logic end
                //var remBal = 0;
                else if (isbufferwithoutbase == true) {
                    _excessSuminsured == 0;
                    var _utilizedamt = {
                    };
                    $.each(objsuminsured, function (i, item) {
                        _utilizedamt["MemberSIID"] = item.MemberSIID;
                        _utilizedamt["SanctionedAmount"] = 0;
                        _utilizedamt["BalanceAmount"] = 0;
                        utilizedamtarray.push(_utilizedamt);
                    });
                }
                else {
                    var isbaseexshated = false;
                    if (ishcbsi == false && _requesttype == 9) {
                        alert('HCB is paying from Base suminsured. Because there is no Out of SI HCB benefit avilable');
                    }
                    else if (isConvalescencesi == false && _requesttype == 10) {
                        alert('Convalescence is paying from Base suminsured. Because there is no Out of SI Convalescence benefit avilable');
                    }
                    $.each(objsuminsured, function (i, item) {
                        if (item.SICategery == 69) {
                            if (allowedsi.indexOf(item.BPSIID) != -1) {

                                var _utilizedamt = {
                                };
                                if (isSumlimit)
                                    _bal = final_sublimit_amt;
                                else
                                    _bal = item.Balance;//((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
                                if (rempayableAmt >= 0) {
                                    if (_bal >= rempayableAmt) {
                                        _utilizedamt["MemberSIID"] = item.MemberSIID;
                                        _utilizedamt["SanctionedAmount"] = rempayableAmt
                                        _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
                                        rempayableAmt = 0;
                                        amtclr = 1;
                                    }
                                    else if (_bal < rempayableAmt) {
                                        //  SPMay - 19
                                        if (_bal < 0) {
                                            _bal = 0;
                                        }
                                        // end of  SPMay - 19
                                        _utilizedamt["MemberSIID"] = item.MemberSIID;
                                        _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
                                        _utilizedamt["BalanceAmount"] = 0;
                                        rempayableAmt = (rempayableAmt - _bal);
                                    }
                                } else {
                                    _utilizedamt["MemberSIID"] = item.MemberSIID;
                                    _utilizedamt["SanctionedAmount"] = 0
                                    _utilizedamt["BalanceAmount"] = _bal;
                                }
                                utilizedamtarray.push(_utilizedamt);
                                if (rempayableAmt > 0) {
                                    isbaseexshated = true;
                                }
                            }
                        }
                        if (amtclr == 1) {
                            return true;
                        }
                        //  SPMay - 19
                        if ((allowedsi.indexOf(item.BPSIID) != -1 && item.SICategery == 74) && isbaseexshated == false && amtclr == 0 && ($('#hdnCorporateID').val() == "6161" || $('#hdnCorporateID').val() == "6162")) {
                            isbaseexshated = true;
                        }
                        // end of SPMay - 19

                    });
                    if (amtclr == 0 && isbaseexshated == true) {
                        $.each(objsuminsured, function (i, item) {
                            if (item.SICategery != 69) {
                                if (allowedsi.indexOf(item.BPSIID) != -1) {

                                    var _utilizedamt = {
                                    };
                                    _bal = item.Balance;//((item.SumInsured + item.CB_Amount) - (item.BlockedAmt + item.UtilizedAmt));
                                    if (rempayableAmt >= 0) {
                                        if (_bal >= rempayableAmt) {
                                            _utilizedamt["MemberSIID"] = item.MemberSIID;
                                            _utilizedamt["SanctionedAmount"] = rempayableAmt
                                            _utilizedamt["BalanceAmount"] = (_bal - rempayableAmt);
                                            rempayableAmt = 0;
                                            amtclr = 1;
                                        }
                                        else if (_bal < rempayableAmt) {
                                            //  SPMay - 19
                                            if (_bal < 0) {
                                                _bal = 0;
                                            }
                                            // end of  SPMay - 19
                                            _utilizedamt["MemberSIID"] = item.MemberSIID;
                                            _utilizedamt["SanctionedAmount"] = _bal;// (rempayableAmt - _bal);
                                            _utilizedamt["BalanceAmount"] = 0;
                                            rempayableAmt = (rempayableAmt - _bal);
                                        }
                                    } else {
                                        _utilizedamt["MemberSIID"] = item.MemberSIID;
                                        _utilizedamt["SanctionedAmount"] = 0
                                        _utilizedamt["BalanceAmount"] = _bal;
                                    }
                                    utilizedamtarray.push(_utilizedamt);
                                }
                            }
                            if (amtclr == 1) {
                                return true;
                            }
                        });
                    }
                }
            }
        }
    }
    //Copay calculation on Payable Amount
    if (_copaycalculationon == 251) {
        if (_grosspayableAmt != '' && _grosspayableAmt != '0') {
            if (_copayrules.length > 0) {
                copaymentAmt = 0;
                _copayhtml = '<div class="col-sm-12" style="    margin-bottom:0px;"><table class="table" style="    margin-left: 10px; "><thead><tr><td class="center">#</td><td class="hidden-xs">Rule</td><td>Per(%)</td><td class="hidden-480">Value</td><td>Actual</td></tr></thead> <tbody>';
                $.each(_copayrules, function (i, item) {
                    var _copayamt = 0;
                    var _copayperval = 0;
                    var _copayval = 0;
                    var _copayper = 'N/A';
                    var _copaylessormore = 'N/A';
                    if (item.per != '' && item.per != null) {
                        _copayper = item.per;
                        _copayperval = parseInt((_grosspayableAmt * item.per) / 100);
                    }
                    if (item.val != '' && item.val != null) {
                        _copayval = parseFloat(item.val);
                    }
                    if (item.lm != '' && item.lm != null) {
                        _copayamt = item.lm == 1 ? Math.min(_copayperval, _copayval) : Math.max(_copayperval, _copayval);
                        _copaylessormore = item.lm == 1 ? 'Less' : 'More';
                    } else {
                        _copayamt = Math.max(_copayperval, _copayval);
                    }
                    copaymentAmt = Math.max(copaymentAmt, _copayamt);
                    _copayhtml = _copayhtml + '<tr><td class="center">' + (i + 1) + '</td><td class="hidden-xs">Copay ' + _copayper + '% or ' + _copayval + ' ' + _copaylessormore + '</td><td>' + _copayperval + '</td><td class="hidden-480"> ' + _copayval + ' </td><td>' + _copayamt + '</td></tr>';
                })
                // _copayhtml = _copayhtml + '<tr><td colspan="5"><div class="row"><div class="col-sm-5 pull-right"><h6 class="pull-right">Total Copay :<span class="blue">' + copaymentAmt + '</span></h6></div></div></td></tr>'
                _copayhtml = _copayhtml + ' </tbody></table></div>';
                copaymentAmt = Math.max(parseFloat(Makezerofromnullorundefined($('#txtCoPayment').val())), copaymentAmt);
            }
        }
    }

    //Added for Task (SP-1307)
    if (_claimtype == 1 && (_requesttype == 4 || _requesttype == 8)) {
        if (_earlyPaymentDiscount != '' && _earlyPaymentDiscount != 0 && _earlyPaymentDiscount != null) {
            _earlyPaymentDiscountAmt = (_grosspayableAmt * _earlyPaymentDiscount) / 100;
            _grosspayableAmt = (_grosspayableAmt - _earlyPaymentDiscountAmt);
        } else
            _earlyPaymentDiscountAmt = 0;
    }

    //Added by Bhagyaraj
    if (_claimtype == 1 && _requesttype == 4) {
        if (dtSanctionAmt[0].Result == 0)  //if SanctionAmt is greater than thresoldAmt then 10% TDS will be applied.
        {
            _tdsper = parseFloat(10);
            $('#txtTDSExhausted').show();
        }
        else {
            _tdsper;
            $('#txtTDSExhausted').hide();
        }
    }
    //TDS amount
    if (_claimtype == 1 && _requesttype != 1 && _requesttype != 2 && _requesttype != 3) {
        if (_tdsper != '' && _tdsper != 0) {
            if (_tdsper > 0) _tdsAmount = Math.round((_grosspayableAmt * _tdsper) / 100);
        } else
            _tdsAmount = 0;
    }

    //Net Payable Amount
    if (_claimtype == 1) {
        if (_grosspayableAmt != 0 && _grosspayableAmt != '')
            _netpayableAmount = (_grosspayableAmt - _tdsAmount);
        else
            _netpayableAmount = 0;
    } else if (_claimtype == 2) {
        _netpayableAmount = _grosspayableAmt;
    }

    _PMTNegotiatedDiscount = Makezerofromnullorundefined($('#txtPMTNegotiatedDiscount').val());
    //var basetopbaldetails = $.parseJSON($("#Basetopuppolicydetails").val());
    //if (_netpayableAmount == 0 && _excessSuminsured > 0 && basetopbaldetails.length > 0) {
    //    if (basetopbaldetails[0].GivenCoverageID == 76 && (basetopbaldetails[0].topupBalance > 0 || basetopbaldetails[0].SuperTopUpBalance > 0)) {
    //        $('#Shiftclaim').show();
    //        if (basetopbaldetails[0].topupBalance > 0)
    //            shiftingmemberID = basetopbaldetails[0].TopupMemberID;
    //        else
    //            shiftingmemberID = basetopbaldetails[0].SuperTopMemberID;
    //    }
    //    if (basetopbaldetails[0].GivenCoverageID == 79 && (basetopbaldetails[0].BaseBalance > 0 || basetopbaldetails[0].SuperTopUpBalance > 0)) {
    //        $('#Shiftclaim').show();
    //        if (basetopbaldetails[0].BaseBalance > 0)
    //            shiftingmemberID = basetopbaldetails[0].SuperTopMemberID;
    //        else
    //            shiftingmemberID = basetopbaldetails[0].BaseMemberID;
    //    }
    //    if (basetopbaldetails[0].GivenCoverageID == 80 && (basetopbaldetails[0].BaseBalance > 0 || basetopbaldetails[0].topupBalance > 0)) {
    //        $('#Shiftclaim').show();
    //        if (basetopbaldetails[0].BaseBalance > 0)
    //            shiftingmemberID = basetopbaldetails[0].BaseMemberID;
    //        else
    //            shiftingmemberID = basetopbaldetails[0].TopupMemberID;
    //    }
    //    if ((basetopbaldetails[0].GivenCoverageID == 79 || basetopbaldetails[0].GivenCoverageID == 80) && (basetopbaldetails[0].topupBalance == 0 && basetopbaldetails[0].SuperTopUpBalance == 0)) {
    //        $('#Shiftclaim').show();
    //        shiftingmemberID = basetopbaldetails[0].BaseMemberID;
    //    }
    //}

    // $('#txtBillAmount').text(_totalbillAmount).attr('title', convert(_totalbillAmount, null));
    $('#txtExcesstoClaimedAmount').text(_excesstoclaimedAmount).attr('data-original-title', convert(_excesstoclaimedAmount, null));
    // $('#txtDeductions').text(_totalDeductions).attr('title', convert(_totalDeductions, null));
    $('#txtApplicablebillamount').text(_applicablebillAmount).attr('data-original-title', convert(_applicablebillAmount, null));
    $('#txtEligiblebillAmount').text(_eligibleAmount).attr('data-original-title', convert(_eligibleAmount , null));
    $('#txtNMEAmount').text(_NME_AMOUNT).attr('data-original-title', convert(_NME_AMOUNT, null));
    //  $('#txtMOUDiscount').text(_mouDiscount).attr('title', convert(_mouDiscount, null));
    $('#txtHospitalDiscount').attr('data-original-title', convert(_hospitalDiscount, null));
    $('#txtApplicableDiscount').text(_applicableDiscount).removeAttr('title').attr('data-original-title', convert(_applicableDiscount, null));
    $('#txtNetEligibleAmount').text(_neteligibleAmount).attr('data-original-title', convert(_neteligibleAmount, null));
    $('#txtPatientPaidAmount').attr('data-original-title', convert(_patientpaidAmount, null));
    $('#txtDeductible').text(_calculatedDeductibleAmt).attr('title', convert(_calculatedDeductibleAmt, null));
    $('#txtRemainingDeductibleAmount').text(_balanceDeductibleAmt < 0 ? 0 : _balanceDeductibleAmt).attr('title', convert(_balanceDeductibleAmt, null));

    //Commented by Leena SP3V-1611
    //$('#txtTotalDeductibleAmount').text(_deductableAmount < 0 ? 0 : _deductableAmount).attr('title', convert(_deductableAmount, null));
    //$('#txtTotalDeductibleAmount').text(_calculatedDeductibleAmt < 0 ? 0 : _calculatedDeductibleAmt).attr('title', convert(_calculatedDeductibleAmt, null));
    $('#txtTotalDeductibleAmount').text(_deductableAmount).attr('title', convert(_deductableAmount, null)); // 
    //End by Leena SP3V-1611
    $('#txtCoPayment').text(copaymentAmt).attr('data-original-title', convert(copaymentAmt, null));
    $('#txtExcesspaidbypatient').text(_excesspaidbyPatient).attr('data-original-title', convert(_excesspaidbyPatient, null));
    //$('#txtPharmacydecuctions').text(_Pharmacydecuctions).attr('title', convert(_Pharmacydecuctions, null));
    $('#txtNegotiatedDiscount').attr('data-original-title', convert(_negotiatedDiscount, null));
    // $('#txtClaimed_Amount').text(_claimedAmount).attr('title', convert(_claimedAmount, null));
    $('#txtExcessSumInsured').text(_excessSuminsured).attr('data-original-title', convert(_excessSuminsured, null));
    $('#txtExceedingPreauthamount').text(_exceedingPreauth).attr('data-original-title', convert(_exceedingPreauth, null));
    $('#txtEligiblepayableAmount').text(_eligiblepayableAmt).attr('data-original-title', convert(_eligiblepayableAmt, null));
    $('#txtPayableAmount').text(_grosspayableAmt).attr('data-original-title', convert(_grosspayableAmt, null));
    $('#txtTDSAmount').text(_tdsAmount + " [" + _tdsper + "%]").attr('data-original-title', convert(_tdsAmount, null));
    $('#txtNetPaidAmount').text(_netpayableAmount).attr('data-original-title', convert(_netpayableAmount, null));
    $('#txtAdmissibleAmount').text(_admissibleAmount).attr('data-original-title', convert(_admissibleAmount, null));
    $('#txtBufferSIUtilized').text(bufferUtilizedAmount).attr('data-original-title', convert(bufferUtilizedAmount, null));
    $('#txtBufferSIAllocated').text(bufferAllocatedAmount).attr('data-original-title', convert(bufferAllocatedAmount, null));
    $('#txtInstallment_Premium').text(_premiumAmt).attr('data-original-title', convert(_premiumAmt, null)); //added by prasad SP3V-331
    if (($("#hdnRequestTypeID").val() == 3 || basicData[0].IsFinal == true) && ParexelcorporateIDs.includes($("#hdnCorporateID").val()) && $("#hdnClaimStageID").val() == 5 && $("#txtpatienttobepaid").val() == "0") {
        $('#txtpatienttobepaid').val('').attr('data-original-title', convert(0, null));
    }

    //$('#txtBillAmount').text(_totalbillAmount);
    //$('#txtExcesstoClaimedAmount').text(_excesstoclaimedAmount);
    //$('#txtDeductions').text(_totalDeductions);
    //$('#txtApplicablebillamount').text(_applicablebillAmount);
    //$('#txtEligiblebillAmount').text(_eligibleAmount);
    //$('#txtMOUDiscount').text(_mouDiscount);
    //// $('#txtHospitalDiscount').val(_hospitalDiscount);
    //$('#txtApplicableDiscount').text(_applicableDiscount);
    //$('#txtNetEligibleAmount').text(_neteligibleAmount);
    ////$('#txtPatientPaidAmount').val(_patientpaidAmount);
    //// $('#txtDeductible').val(_deductableAmount);
    //$('#txtCoPayment').text(copaymentAmt);
    //$('#txtExceedingPreauthamount').text(_exceedingPreauth);
    //$('#txtExcesspaidbypatient').text(_excesspaidbyPatient);
    //$('#txtAdmissibleAmount').text(_admissibleAmount);
    ////$('#txtNegotiatedAmount').val(_negotiatedAmount);
    //$('#txtClaimed_Amount').text(_claimedAmount);
    //$('#txtApprovedAmount').text(_approvedamount);
    ////$('#txtTariffvalue').text(_tariffValue);
    ////$('#txtPackagevalue').text(_packageValue);
    ////$('#txtBPcoveragevalue').text(_bpcoverageValue);
    //$('#txtExcessSumInsured').text(_excessSuminsured);
    ////$('#txtTotalSancAmountForClaim').text(_totalsanctionedAmtforclaim);
    ////$('#txtTotalCopaymentForClaim').text(_totalcopayAmtforclaim);
    ////$('#txtTotalPayableAmountForClaim').text(_totalpayableAmtforclaim);

    //$('#txtEligiblepayableAmount').text(_eligiblepayableAmt);
    //$('#txtPayableAmount').text(_grosspayableAmt);
    //$('#txtTDSAmount').text(_tdsAmount);
    //$('#txtNetPaidAmount').text(_netpayableAmount);
    if (_copayhtml != '') {
        $('#divcopaycalculation').html(_copayhtml);
        $('#lblTotalCopay').text(copaymentAmt);
    }
    $('[data-rel=tooltip]').tooltip();
    $('#btnBillCalculator').hide();
    $("#btnReProcessBillAmt").hide(); //For Re-Calculate button hiding
    $('#txtEPDDiscountAmt').text(_earlyPaymentDiscountAmt).attr('data-original-title', convert(_earlyPaymentDiscountAmt, null)); //Added for Task (SP-1307)
    if (($('#hdnClaimStageID').val() == 5 || $('#hdnClaimStageID').val() == 38 || $('#hdnClaimStageID').val() == 28) && ($('#hdnRequestTypeID').val() == 1 || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3)
        && $("#hdnIsSingleLetterEnabled").val() == "1") { //SP3V-4845 ADD IF CONDITION REMOVED HARD-CODED CORPS
        $('#Basetopdetails').show();
    }
    //if (basicData[0].isITGImanualapv == 1 && ($('#hdnClaimStageID').val() == 5 || $('#hdnClaimStageID').val() == 28 || $('#hdnClaimStageID').val() == 38)) {
    //    $('#divAdjudicationFinalButtons').show();
    //    $('#btnApprove').show();
    //    $('#btnReject').attr('disabled', true);
    //    $('#btnRejectAll').attr('disabled', true);
    //    $('#lnkPreauthCancel').attr('disabled', true);
    //}
    if (basicData[0].IsAutomationClaim != 5)
        DialogResultMessage('Calculated values loaded');

    if (basicData[0].IssueID == 30 && $('#hdnClaimTypeID').val() == "2" && $('#hdnRequestTypeID').val() == "4" && (_excessSuminsured > 0 || totalremainingBalofBSI <= 0))
        DialogResultMessage('SumInsured/Sublimt Exhausted!!');
}

// End Billing Details Calculations By B Srinu on 30th Nov 2015
function copaycalculation(item, copayflag) {
    _copayamt = 0;
    _copayperval = 0;
    _copayval = 0;
    _copayper = 'N/A';
    _copaylessormore = 'N/A';
    var copayflagamt = 0;
    var lessormore = item.lm;
    if (_copaycalculationon == 75)
        copayflagamt = copayeligibleamount;
    else if (_copaycalculationon == 77)
        copayflagamt = _billafterDeductionandDiscount;
    else if (_copaycalculationon == 76)
        copayflagamt = _grosspayableAmt
    if (item.IsAccumulate == false) {
        if (item.per != '' && item.per != null) {
            _copayper = item.per;
            _copayperval = parseInt((copayflagamt * item.per) / 100);
        }
        if (item.val != '' && item.val != null) {
            _copayval = parseFloat(item.val);
        }
        if (item.per == '' || item.per == null)
            lessormore = false;
        if (item.val == '' || item.val == null)
            lessormore = false;
        if (item.lm != null) {
            _copayamt = lessormore == 1 ? Math.min(_copayperval, _copayval) : Math.max(_copayperval, _copayval);
            _copaylessormore = item.lm == 1 ? 'Less' : 'More';
        } else {
            _copayamt = Math.max(_copayperval, _copayval);
        }
    }
}
//4009 calculate bill saving starting
function SaveCalculatedBill() {
    //SP3V-1423 START
    var Uhidno = $("#hplSystemPatient_PatientUHID").text();
    var claimid = $('#hdnClaimID').val();
    var slno = $('#hdnClaimSlNo').val();
    var multiplematernity = false;
    var procdureDetails = [];
    var InsurerId = $('#hdnInsuranceCompanyID').val();
    var _ClaimTypeID = $('#hdnClaimTypeID').val();
    var _RequestTypeID = $("#hdnRequestTypeID").val();
    var DischargeTypeId = '';
    if ($('#hdnClaimsCodingDetails').val() != '') {
        procdureDetails = $.parseJSON($('#hdnClaimsCodingDetails').val());
        $.each(procdureDetails, function (i, coding) {
            if (coding.TPALevel2 == "402" || coding.TPALevel2 == "406" || coding.TPALevel2 == "409" || coding.TPALevel2 == "418") {
                var value = $("#hdnCheckMultipleMaternity").val();
                if (value == "0") {
                    multiplematernity = true;
                }
            }
        });
    }
    if (multiplematernity == true) {
        alert('Maternity related claim has been utilized previously. Please check remaining maternity sublimit before processing further.');
        // return false;
    }
    if (_ValidateDeductibleAmt == true) {
        DialogWarningMessage('Modified deductible amount is greater than the total claimed amount.Can not Approve!');
        isbillcalculated = false;
        return false;
    }
    if (_grosspayableAmt < $("#txtModularAmt").val()) {
        DialogResultMessage("Modular amount should be less than sanctioned amount");
        isbillcalculated = false;
        return false;
    }
    if ((InsurerId == 5) && ((_RequestTypeID != 1) && (_RequestTypeID != 2) && (_RequestTypeID != 3))) {
        if ($('#ddlDischargeType').val() != '') {
            DischargeTypeId = $('#ddlDischargeType').val();
        }
        if ((DischargeTypeId == '0' || DischargeTypeId == null || DischargeTypeId == '' || DischargeTypeId == 'undefiened')) {
            DialogResultMessage("Please Select Discharge Type.");
            isbillcalculated = false;
            return false;
        }
    }
    var ID = '';
    var AddedID = '';
    if ($.trim($("input:radio[name='rdnOptionalCovers']:checked").val()) == "1") {
        $('.chk').each(function (i, obj) {
            if ($(this).prop('checked') == true) {
                ID = ID + $(this).attr('id').split("_")[1] + ',';
            }
        });
        AddedID = ID.split(',').slice(0, -1);
        if (AddedID == '' || AddedID == "") {
            DialogWarningMessage('Select at least one cover and provide amount !');
            isbillcalculated = false;
            return false;
        }
        var OptionalCheckedData = $("#hndOptionalCheckedData").val().split(',').slice(0, -1);
        if (AddedID.length != OptionalCheckedData.length) {
            DialogWarningMessage('please Save all selected Optional Covers Once!!');
            isbillcalculated = false;
            return false;
        }
    }
    // ClaimAI: BillingCorrection validation removed
    if ($("#ddlRequestType").val() != 1 && $("#ddlRequestType").val() != 2 && MakeNullfromUndefinedorEmpty(_dod) == null) {
        DialogWarningMessage('You can not approve the claim without Date of discharge');
        isbillcalculated = false;
    }
    //ClaimRules_Saving();
}

function ClaimRules_Saving() {
    // ClaimAI: BillingCorrection validation removed
    //if (chkQP_MandatoryRecords()) {
    //    DialogWarningMessage('You can not approve the claim as it is in query pending.');
    //}
    if ($("#ddlRequestType").val() != 1 && $("#ddlRequestType").val() != 2 && MakeNullfromUndefinedorEmpty(_dod) == null) {
        DialogWarningMessage('You can not approve the claim without Date of discharge');
        isbillcalculated = false;
    }
    else {
        //if (approvalFlag == true) {
        //    DialogWarningMessage('Insurer/HR Approval required to approve this claim');
        //}
        //else {
        var bpsiId = $("#hdnBPSIID").val();
        var excessSumInsured = $("#txtExcessSumInsured").text(); var flagNo = $("#hdnNo").val();
        var topbalance = 0;
        var supertopbalance = 0;
        if (parseInt(excessSumInsured) != 0 && $('#hdnPolicyTypeID').val() == "3") {
            if (isBufferRulesConfigured(bpsiId) && (flagNo == "false") && basicData[0].IsBufferEnabled != true && (topbalance == 0 && supertopbalance == 0)) {
                $("#refertoinsurern").modal('hide');
                $("#exampleModalApprove").modal('show');
                element = document.getElementById("topupdata");
                element.classList.remove("div100");
                element = document.getElementById("bufferdivdata");
                element.classList.add("div100");
                $("#topupdata").hide();
                $("#bufferdivdata").show();
                element = document.getElementById("BufferTopSize");
                element.classList.add("divsingleTopup");
                FetchBufferEligibleAmount();
                return false;
            }
            else {
                if (_netpayableAmount >= 0 || (_remainingdeductableAmount > 0)) {
                    // Claim_Update();
                }
                else {
                    DialogWarningMessage('Net payable amount is 0. Please click "Calculate" button to display the Net Payable amount; or Member Balance Sum Insured exhausted');
                }
            }
        }
        else {
            if (_netpayableAmount >= 0 || (_remainingdeductableAmount > 0)) {
                //Claim_Update();
            }
            else {
                DialogWarningMessage('Net payable amount is 0. Please click "Calculate" button to display the Net Payable amount; or Member Balance Sum Insured exhausted');
            }
        }
        //}
    }
}

function Claim_Update() {
    _claimdetails = {};
    _claimdetails["ClaimID"] = $('#hdnClaimID').val();
    _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
    _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
    _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
    _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
    _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
    _claimdetails["ClaimStageID"] = 0;//_stageID;
    //if (_stageID == 22) {
    //    _claimdetails["RoleID"] = 16;
    //}
    _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();

    var _rules = [];
    //var _objrules = {};   
    if ($('#hdnApprovalDetails').val() != '') {
        _rules = $.parseJSON($('#hdnApprovalDetails').val());
    }
    var _newRules = [];
    var _objrules = {};
    var BPConditionID;
    if (_rules.length > 0) {
        $.each(_rules, function (i, sIDs) {
            var _triggerID = sIDs["TriggerID"];
            var name = sIDs["RuleName"];
            BPConditionID = sIDs["BPConditionID"];

            //_rules.splice(i, 1);

            _objrules["TriggerID"] = _triggerID;
            _objrules["RuleName"] = name;
            if ($('#btnOverride_' + _triggerID).is(':checked') == true)
                _objrules["isOverride"] = 1;
            else
                _objrules["isOverride"] = 0;
            _objrules["OverrideReasonIDs_P34"] = $('#ddlOverrideReasons_' + _triggerID).val();
            if ($('#taOverRideRemarks_' + _triggerID).val() != "") {
                _objrules["OverRideRemarks"] = $('#taOverRideRemarks_' + _triggerID).val();
            } else {
                _objrules["OverRideRemarks"] = null;
            }
            _objrules["OverrideruleID"] = null;
            _objrules["BPConditionID"] = BPConditionID;
            _newRules.push(_objrules);
            _objrules = {};
        });
    } else { //needtokeetatRF_button
    }
    // override autocopay rule //
    $('#tbloverrideRuleApproval > tbody  > tr').each(function () {
        _objrules = {};
        var id = this.id;
        var _triggerID = id.split('_')[1];
        var name = $('#spnRuleName_' + _triggerID + '').text();


        _objrules["TriggerID"] = _triggerID;
        _objrules["RuleName"] = name;
        if ($('#btnOverride_' + _triggerID).is(':checked') == true)
            _objrules["isOverride"] = 1;
        else
            _objrules["isOverride"] = 0;
        _objrules["OverrideReasonIDs_P34"] = $('#ddlOverrideReasons_' + _triggerID).val();
        if ($('#taOverRideRemarks_' + _triggerID).val() != "") {
            _objrules["OverRideRemarks"] = $('#taOverRideRemarks_' + _triggerID).val();
        } else {
            _objrules["OverRideRemarks"] = null;
        }
        _objrules["OverrideruleID"] = _triggerID;
        // Added By Venkat Mandadi
        // As discussed with Srinu bathina (If there is no general condition rules BPConditionid for manual/override rules is: 8)
        _objrules["BPConditionID"] = (_rules.length == 0) ? 8 : BPConditionID;
        //_objrules["BPConditionID"] = BPConditionID;

        _newRules.push(_objrules);

    }); //needtokeetatRF_button
    /////

    // if (_rules != null) {
    $('#hdnApprovalDetails').val(JSON.stringify(_newRules));
    // }
    // if (ValidateApproval(_stageID)) {
    if (utilizedamtarray.length == 0) {
        if (basicData[0].IsBufferEnabled == true) {
            saveCalculatedBill(JSON.stringify(_claimdetails), $('#hdnApprovalDetails').val()); //needtokeetatRF_button
        }
        else
            if (_requesttype == 12) {
                saveCalculatedBill(JSON.stringify(_claimdetails), $('#hdnApprovalDetails').val()); //needtokeetatRF_button
            }
        //else
        //    DialogWarningMessage("Bill amounts not calculated");
    }
    else if (utilizedamtarray.length > 0)
        saveCalculatedBill(JSON.stringify(_claimdetails), $('#hdnApprovalDetails').val());
    // }
}

function saveCalculatedBill(_cdtls, _rules) {
    //if (FindRejectedReasons()) {
    if (_cdtls != null && _rules != null) {
        if (utilizedamtarray.length == 0) {
            var _utilizedamt = {};
            _utilizedamt["MemberSIID"] = null;
            _utilizedamt["SanctionedAmount"] = null;
            _utilizedamt["BalanceAmount"] = null;
            utilizedamtarray.push(_utilizedamt);
        }
        if ($('#hdnApprovalDetails').val() == "" || $('#hdnApprovalDetails').val() == "[]") {
            var _newRules = [];
            var _objrules = {};
            _objrules["TriggerID"] = null;
            _objrules["RuleName"] = null;
            _objrules["isOverride"] = null;
            _objrules["OverrideReasonIDs_P34"] = null;
            _objrules["OverRideRemarks"] = null;
            _objrules["OverrideruleID"] = null;
            _objrules["BPConditionID"] = null;
            _newRules.push(_objrules);
            _rules = JSON.stringify(_newRules);
        }
        //if (_rules != null) {
        //    $('#hdnApprovalDetails').val(JSON.stringify(_newRules));
        //}

        if (copaystatus == true) {
            copaymentAmt = $('.txtCoPaymentOverride').val();
            if ($('.txtCoPaymentOverride').val() == "" || $('.txtCoPaymentOverride').val() == null) {
                alert('Please enter copayment amount');
                return false;
            }
        }
        //SP3V-1611 Leena
        if (OverrideDeductible == true) {
            _deductableAmount = $('.txtDeductibleOverride').val();
            if ($('.txtDeductibleOverride').val() == "" || $('.txtDeductibleOverride').val() == null) {
                alert('Please enter Deductible amount');
                return false;
            }
        }
        //End SP3V-1611 Leena
        if ($('#SkipScrutiny').is(':checked') == true)
            SkipScrutiny = true;
        else
            SkipScrutiny = false;

        $.ajax({
            type: "POST",
            url: "/MedicalScrutiny/SaveBillingAmount",
            async: false,
            data: {
                ClaimDetails: _cdtls, Rules: _rules, DiscountByHospital: _hospitalDiscount, EligibleAmount: _eligibleAmount, Deductible: _calculatedDeductibleAmt,
                CoPayment: copaymentAmt,
                NetEligibleAmount: _neteligibleAmount, Excess_SI: _excessSuminsured, Excess_Preauth: _exceedingPreauth, ExcessPaidByPatient: _excesspaidbyPatient,
                AdmissibleAmount: _admissibleAmount, EligiblePayableAmount: _eligiblepayableAmt, NegotiatedAmount: _negotiatedDiscount, GrossAmount: _grosspayableAmt,
                TDSAmount: _tdsAmount, NetAmount: _netpayableAmount,
                PaidByPatient: _patientpaidAmount, BufferUtilized: bufferUtilizedAmount, Copayhtml: htmlEncode(_copayhtml), //Copayhtml: htmlEncode(manualCopay),
                ClaimUtilization: JSON.stringify(utilizedamtarray),
                DoctorNotes: $('#txtDoctorRemarks').val(), AdditionalNotes: $('#txtAdditionalRemarks').val(), NottoDeductFromHospital: isEPAnottodeductfrommhospital, SkipScrutiny: SkipScrutiny,
                EarlyPaymentDiscountAmount: _earlyPaymentDiscountAmt, PremiumDeducted: _premiumAmt,  //Added for Task (SP-1307)
                QMSID: $("#hdnQMS").val(), QMSAdminID: $("#hdnQMS").val(), Modularamount: $("#txtModularAmt").val(), Patienttobepaid: $("#txtpatienttobepaid").val()
            },
            success: function (data) {
                // DialogResultMessage(data);
                $('#hdnApprovalDetails').val('');
            },
            error: function (e, x) {
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });

    }
    else
        alert('Please un-select the rejection reasons to APPROVE');

    //}
}

function infertoinsureractioncheck(flag) {

    if (flag == 1) {
        if (isbillcalculated == false) {
            DialogWarningMessage("For ITGI claims please click calculate button before sending claim to refer to insurer ");
            return false;
        }
        var ClaimID = $('#hdnClaimID').val();
        var Slno = $('#hdnClaimSlNo').val();
        $.ajax({
            url: "/MedicalScrutiny/validateIRApprove",
            contentType: 'application/json;charset=utf-8',
            async: false,
            data: {
                ClaimID: ClaimID, Slno: Slno
            },
            success: function (data) {
                if (data.includes('data validate successfull')) {
                    SaveCalculatedBill();
                    var bpsiId = $("#hdnBPSIID").val();
                    var excessSumInsured = $("#txtExcessSumInsured").text(); var flagNo = $("#hdnNo").val();
                    var topbalance = 0;
                    var supertopbalance = 0;
                    if (parseInt(excessSumInsured) != 0 && $('#hdnPolicyTypeID').val() == "3") {
                        if (isBufferRulesConfigured(bpsiId) && (flagNo == "false") && basicData[0].IsBufferEnabled != true && (topbalance == 0 && supertopbalance == 0)) {
                            $("#refertoinsurern").modal('hide');
                            $("#exampleModalApprove").modal('show');
                            element = document.getElementById("topupdata");
                            element.classList.remove("div100");
                            element = document.getElementById("bufferdivdata");
                            element.classList.add("div100");
                            $("#topupdata").hide();
                            $("#bufferdivdata").show();
                            element = document.getElementById("BufferTopSize");
                            element.classList.add("divsingleTopup");
                            FetchBufferEligibleAmount();
                            return false;
                        }
                        else if (_netpayableAmount <= 0) {
                            alert("net payable amount should not be zero, only refer to insurer rejection is possible.");
                            return false;
                        }
                        else {
                            if (_netpayableAmount >= 0 || (_remainingdeductableAmount > 0)) {
                                // Claim_Update();
                            }
                            else if (_netpayableAmount <= 0) {
                                alert("net payable amount should not be zero, only refer to insurer rejection is possible.");
                                return false;
                            }
                            else {
                                DialogWarningMessage('Net payable amount is 0. Please click "Calculate" button to display the Net Payable amount; or Member Balance Sum Insured exhausted');
                            }
                        }
                    }
                    else if (_netpayableAmount <= 0) {
                        alert("net payable amount should not be zero, only refer to insurer rejection is possible.");
                        return false;
                    }
                    if (!ValidateApproval(22)) {
                        $("#refertoinsurern").modal('hide');
                        return false;
                    }
                    $("#refertoinsurern").modal('show');
                    $("#ddlReasons").val(220);
                    $("#ddlReasons").attr('disabled', true);
                }
                else {
                    $("#refertoinsurern").modal('hide');
                    alert(data);
                }
            }
        });
    }
    else {
        if (isbillcalculated == false && flag != 3) {
            DialogWarningMessage("For ITGI claims please click calculate button before sending claim to refer to insurer ");
            return false;
        }
        // Claim Rejected Reasons
        var CRReasons = [];
        IRTotalRejectedReasons = [];
        if ($('#hdnClaimRejectedReasons').val() != '') {
            CRReasons = $.parseJSON($('#hdnClaimRejectedReasons').val());
        }
        $.each(CRReasons, function (i, query) {
            var rID = query.RejectionReasonsID;
            var reason = $('#' + tdCRejected_DetailedReason + rID).html();
            if ($('#' + chkCRejected_ReasonID + rID).is(":checked") == true) {
                var _rReasons = {};
                _rReasons.RejectionReasonsID = rID;
                if (reason.indexOf('FreeText1') != -1) {
                    if ($('#' + txtCRejected_FreeText1 + rID).val() != '')
                        _rReasons.FreeText1 = $('#' + txtCRejected_FreeText1 + rID).val();
                    else
                        _rReasons.FreeText1 = null;
                }
                else
                    _rReasons.FreeText1 = null;
                if (reason.indexOf('FreeText2') != -1) {
                    if ($('#' + qptxtFreeText2 + rID).val() != '')
                        _rReasons.FreeText2 = $('#' + qptxtFreeText2 + rID).val();
                    else
                        _rReasons.FreeText2 = null;
                }
                else
                    _rReasons.FreeText2 = null;
                //sp3v-2901 provision for Rejection category
                _rReasons.RejectionCategory = 0;
                _rReasons.RejectionSubCategory = 0;
                //_rReasons.RejectionCategoryName = 0;
                _rReasons.Remarks = $('#' + txtCRejected_Remarks + rID).val();

                IRTotalRejectedReasons.push(_rReasons);
            }
        });
        // Claim Other Rejected Reasons
        var CORReasons = [];
        if ($('#hdnClaimOtherRejectedReasons').val() != '') {
            CORReasons = $.parseJSON($('#hdnClaimOtherRejectedReasons').val());
        }
        $.each(CORReasons, function (i, query) {
            var _orReasons = {};
            _orReasons.RejectionReasonsID = 0;
            _orReasons.FreeText1 = null;
            _orReasons.FreeText2 = null;
            //sp3v-2901 provision for Rejection category
            _orReasons.RejectionCategory = query.RejectionCategory;
            _orReasons.RejectionSubCategory = query.RejectionSubCategory;
            _orReasons.Remarks = query.Remarks;
            _orReasons.InsurerRejectionID = query.InsurerRejectionID;
            IRTotalRejectedReasons.push(_orReasons);
        });
        if (flag != 3) {
            if (IRTotalRejectedReasons.length <= 0) {
                alert(" rejection reasons need to select for rejection insurer call");
                Get_ClaimRejectedReasons($('#hdnClaimID').val(), $('#hdnClaimSlNo').val());
                var element = document.getElementById("rmcls");
                element.classList.remove("collapsed");
                return false;
            }
            $("#refertoinsurern").modal('show');
            $("#ddlReasons").val(221);
            $("#ddlReasons").attr('disabled', true);
        }
    }
};

//4009 calculate bill saving ending

function GetReferInsRemarks(_ClaimID, _SlNo) {
    if (basicData[0].IS_ADJ_FROM_QR == 1 && isQuery_Responsed == 0) {
        DialogWarningMessage("Response Generated for the Raised Queries. please Process first before moving to other Stages");
        return false;
    }
    //if (basicData[0].IssueID == 10 && isbillcalculated == false) {
    //    DialogWarningMessage("For ITGI claims please click calculate button before sending claim to refer to insurer ");
    //    return false;
    //}
    if (basicData[0].IssueID == 10 && ($("#hdnClaimStageID").val() == "5" || $("#hdnClaimStageID").val() == "28" || $("#hdnClaimStageID").val() == "38")) {
        //if (isbillcalculated == false) {
        //    DialogWarningMessage("For ITGI claims please click calculate button before sending claim to refer to insurer ");
        //    return false;
        //}
        $("#refertoinsurern").modal('hide');
        chkRules();

        DisplayDoctorRemarks();
        LoadPolicyDetails($('#hdnPolicyID').val(), 'hplPolicyInsuranceCompany');
        $('#divBillCalculation').show();
        $('#btnBillCalculator').show();
        $('#divAdjudication').show();
        $("#infertoinsurerbuttons").show();

        $('#manualapvdocupload').hide();
        if (basicData[0].RequestTypeID != 1 && basicData[0].RequestTypeID != 2 && basicData[0].RequestTypeID != 3) {
            $("#IRAction_Approve").attr('disabled', true);
            $('#divAdjudicationFinalButtons').hide();
        }
        if (basicData[0].isITGImanualapv == 1)
            $('#divAdjudicationFinalButtons').hide();

    }
    else
        $("#refertoinsurern").modal('show');
    // Code Of Srujan - SP3V2519 - Is NIDB Flag Active Show 'Refer To Insurer Stage' In ActionItems. 
    var IsNIDB = PatientDtls.Table[0].isNIDB;
    var IsPolicyNIDB = ($("#hdnPolicyNIDB").val());
    var ddlReasonsvalues = "";
    if ($("#hdnClaimStageID").val() == "5" || $("#hdnClaimStageID").val() == "28" || $("#hdnClaimStageID").val() == "38") {
        $("#ddlReasons option[value='673']").remove();
    }
    else
        if ($("#hdnClaimStageID").val() == "24" && ((IsNIDB != null && IsNIDB == true) || (IsPolicyNIDB != null && IsPolicyNIDB == "true"))) {
            $('#ddlReasons option').each(function () {
                ddlReasonsvalues = $(this).attr('value')
                if (ddlReasonsvalues != "673") {
                    $("#ddlReasons option[value='" + ddlReasonsvalues + "']").remove();
                }
            });

            $("#ddlReasons").val(673);
        }
    //End of SP3V-2519
    //if ($('#tblQueryDocuments tbody').children().length == 0) {

    //SP3V-5184 START
    if (basicData[0].Isrefertoinsurer == true && ($("#hdnClaimStageID").val() == "5" || $("#hdnClaimStageID").val() == "28" || $("#hdnClaimStageID").val() == "38") && (basicData[0].RequestTypeID != 1 && basicData[0].RequestTypeID != 2 && basicData[0].RequestTypeID != 3)) {
        $("#ddlReasons").val(448);
        $("#ddlReasons").attr('disabled', true);
    }

    if (basicData[0].Isrefertoinsurer == true && ($("#hdnClaimStageID").val() == "5" || $("#hdnClaimStageID").val() == "28" || $("#hdnClaimStageID").val() == "38") && (basicData[0].RequestTypeID == 1 || basicData[0].RequestTypeID == 2 || basicData[0].RequestTypeID == 3)) {
        $("#ddlReasons option[value='220']").remove();
        $("#ddlReasons option[value='221']").remove();
    }
    //SP3V-5184 END 

    $.ajax({
        //type: "POST",
        url: "/MedicalScrutiny/ReferInsDetails_Retrieve",
        contentType: 'application/json;charset=utf-8',
        //processData: false,
        data: {
            ClaimID: _ClaimID, SlNo: _SlNo
        },
        success: function (data) {
            CheckSessionVariable(data.responseText);
            data = $.parseJSON(data);

            if (data == null || data == "") {
                //alert('Data not found.');
            }
            else {
                if ($("#hdnClaimStageID").val() == "5" || $("#hdnClaimStageID").val() == "28" || $("#hdnClaimStageID").val() == "38") {
                    $("#ddlReasons option[value='673']").remove();
                }
                else
                    if ($("#hdnClaimStageID").val() == "24" && ((IsNIDB != null && IsNIDB == true) || (IsPolicyNIDB != null && IsPolicyNIDB == "true"))) {
                        $('#ddlReasons option').each(function () {
                            ddlReasonsvalues = $(this).attr('value')
                            if (ddlReasonsvalues != '673') {
                                $("#ddlReasons option[value='" + ddlReasonsvalues + "']").remove();
                            }
                        });

                        $("#ddlReasons").val(673);
                        /* $('#taReferto_Insurer').val('');*/
                    }
                    else {
                        $('#ddlReasons').val(data[0].PID);
                        //$('#ddlReasons').trigger('onchange');
                        $('#taReferto_Insurer').val(data[0].Remarks);
                        //var subCategory = data[0].SubReasonIDs_P;
                        //setTimeout(BindSubReasonCategory(subCategory), 100);
                    }
            }
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
    //}
}
function btnInsurerCancel() {
    $("#refertoinsurern").modal('hide');
}
function GetRejectionProcessRemarks(_ClaimID, _SlNo) {
    //if ($('#tblQueryDocuments tbody').children().length == 0) {
    $.ajax({
        //type: "POST",
        url: "/MedicalScrutiny/ReferInsDetails_Retrieve",
        contentType: 'application/json;charset=utf-8',
        //processData: false,
        data: {
            ClaimID: _ClaimID, SlNo: _SlNo
        },
        success: function (data) {
            CheckSessionVariable(data.responseText);
            data = $.parseJSON(data);

            if (data == null || data == "") {
                //alert('Data not found.');
            }
            else {
                $('#ddlReasons').val(data[0].PID);
                $('#taReferto_Insurer').val(data[0].Remarks);
            }
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
    //}
}

function GetResponsefromInsRemarks(_ClaimID, _SlNo) {
    //if ($('#tblQueryDocuments tbody').children().length == 0) {
    $("#ddlResponses option[value='734']").remove();
    $("#ddlResponses option[value='735']").remove();
    if (basicData[0].Isrefertoinsurer == true) {
        $("#ddlResponses option[value='226']").remove();
        $("#ddlResponses option[value='227']").remove();
        $("#ddlResponses option[value='486']").remove();
    }
    if (basicData[0].IRreason_request != 221) {
        $('#show_rejection_letter').hide();
        $('#show_crc_letter').hide();
    }
    $.ajax({
        //type: "POST",
        url: "/MedicalScrutiny/ResponsefromInsDetails_Retrieve",
        contentType: 'application/json;charset=utf-8',
        //processData: false,
        data: { ClaimID: _ClaimID, SlNo: _SlNo },
        success: function (data) {
            CheckSessionVariable(data.responseText);
            data = $.parseJSON(data);

            if (data == null || data == "") {
            }
            else {
                $('#ddlResponses').val(data[0].PID);
                $('#taResponsefrom_Insurer').val(data[0].Remarks);
            }
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
    // }
}

function GetAuditRemarksDetails(_ClaimID, _SlNo) {

    if ($('#hdnClaimTypeID').val() == 2) {
        if ($('#hdnMainMemberPolicyID').val() == $('#hdnMemberPolicyID').val() && $('#ddlPatientCondition').val() == "271") {
            if ($("#hdnPayeeTypeID").val() == 2 || $("#hdnPayeeTypeID").val() == 3) {
                $('#rbTempBankDetails').attr('checked', true);

                $('#rbSystemBankDetails').attr('disabled', true);
                $('#rbTempBankDetails').attr('disabled', true);

                $('#lblNomineePayeeName').show();
            }
            else if ($("#hdnPayeeTypeID").val() == 4 || MakeNullfromUndefinedorEmpty(basicData[0].ProposerName) == MakeNullfromUndefinedorEmpty(basicData[0].MemberName)) {
                $('#rbTempBankDetails').attr('checked', true);

                $('#rbSystemBankDetails').attr('disabled', true);
                $('#rbTempBankDetails').attr('disabled', true);

                $('#lblNomineePayeeName').show();
            }
        }
        else {
            $('#rbTempBankDetails').attr('checked', false);

            $('#rbSystemBankDetails').attr('disabled', false);
            $('#rbTempBankDetails').attr('disabled', false);

            $('#lblNomineePayeeName').hide();
        }
    }

    //if ($("#hdnPayeeTypeID").val() == 1 || $("#hdnPayeeTypeID").val() == 4) {
    //    $('#rbTempBankDetails').attr('checked', false);
    //    $('#rbSystemBankDetails').attr('checked', true);

    //    $('#rbSystemBankDetails').attr('disabled', true);
    //    $('#rbTempBankDetails').attr('disabled', true);
    //}

    //if ($('#tblQueryDocuments tbody').children().length == 0) {
    $.ajax({
        //type: "POST",
        url: "/MedicalScrutiny/AuditRemarksDetails_Retrieve",
        contentType: 'application/json;charset=utf-8',
        //processData: false,
        data: { ClaimID: _ClaimID, SlNo: _SlNo },
        success: function (data) {
            CheckSessionVariable(data.responseText);
            data = $.parseJSON(data);

            if (data == null || data == "") {
                //alert('Data not found.');
            }
            else {
                $('#ddlAuditReasons').val(data[0].PID);
                $('#taAuditRemarks').val(data[0].Remarks);
            }
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
    // }
}

function ClaimCRMRemarks_Insert(_stageID, _ctrlReason, _ctrlRemarks, _roleID) {
    $("#btnCRMRemarksbacktoadjSubmit").prop("disabled", true);
    $("#btnCRMRemarksCRMReviewApproval").prop("disabled", true);
    _claimdetails = {};
    _claimdetails["ClaimID"] = $('#hdnClaimID').val();
    _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
    _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
    _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
    _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
    _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
    _claimdetails["ClaimStageID"] = _stageID;
    _claimdetails["RoleID"] = _roleID;
    _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();

    if ($('#' + _ctrlRemarks).val() != "" || $('#' + _ctrlFieldofcname).val() != "") {
        if ($('#' + _ctrlRemarks).val() != '' || $('#' + _ctrlRemarks).val() != null) {
            _claimdetails["Remarks"] = $('#' + _ctrlRemarks).val();

        }
        else {
            _claimdetails["Remarks"] = null;
        }

        Submit_Request(JSON.stringify(_claimdetails), _stageID);


    } else {
        if (_claimdetails["Remarks"] == null || _claimdetails["Remarks"] == "") {
            DialogWarningMessage('Please Provide Remarks to submit');
        }
    }
    $('#' + _ctrlRemarks).val('');
}

function CRMReviewApproval(_stageID, _ctrlReason, _ctrlRemarks, _roleID) {
    $("#btnCRMRemarksbacktoadjSubmit").prop("disabled", true);
    $("#btnCRMRemarksCRMReviewApproval").prop("disabled", true);
    var claimid = $('#hdnClaimID').val();
    var slno = $('#hdnClaimSlNo').val();
    var remarks = $("#taCRMRemarks").val();
    $.ajax({
        url: "/MedicalScrutiny/CRMReviewApproval",
        data: {
            ClaimID: $('#hdnClaimID').val(), SlNo: $('#hdnClaimSlNo').val(), remarks: $("#taCRMRemarks").val(), roleID: _roleID
            , MainMemberPolicyID: $('#hdnMemberPolicyID').val(), PolicyID: $('#hdnPolicyID').val(), ProviderID: $('#hdnProviderID').val(),
            BrokerID: $('#hdnBrokerID').val(), PayerID: $('#hdnPayerID').val(), CorporateID: $('#hdnCorporateID').val(),
            InsuranceCompanyID: $('#hdnInsuranceCompanyID').val(), AgentID: $("#hdnAgentID").val()
        },
        async: false,
        cache: false,
        success: function (resData) {
            var objData = JSON.parse(resData);
            if (objData[0].Result) {
                $('#' + _ctrlRemarks).val('');
                window.location.href = '/claims/Index';
            }
            else if (!objData[0].Result && objData[0].ResponseText == "ErrorCode#1") {
                CheckSessionVariable(objData[0].ResponseText);
                $("#btnCRMRemarksCRMReviewApproval").prop("disabled", false);
            }
            else {
                DialogWarningMessage(objData[0].ResponseText);
                $("#btnCRMRemarksCRMReviewApproval").prop("disabled", false);
            }
        },
        error: function (err, xhr) {
            $("#btnCRMRemarksbacktoadjSubmit").prop("disabled", false);
            $("#btnCRMRemarksCRMReviewApproval").prop("disabled", false);
            console.log(err.statusText);
            DialogErrorMessage(err.statusText);
        }
    });
}


//if ($('#' + _ctrlRemarks).val() != "") {
//    if ($('#' + _ctrlRemarks).val() != '' || $('#' + _ctrlRemarks).val() != null) {
//        _claimdetails["Remarks"] = $('#' + _ctrlRemarks).val();

//    }
//    else {
//        _claimdetails["Remarks"] = null;
//    }

//    Submit_Request(JSON.stringify(_claimdetails), _stageID);

//    //$.ajax({
//    //    //type: "POST",
//    //    url: "/MedicalScrutiny/ClaimAudit_Insert",
//    //    contentType: 'application/json;charset=utf-8',
//    //    //processData: false,
//    //    data: {
//    //        ClaimDetails: JSON.stringify(_claimdetails), isApprove: (isApprove == 1) ? true : false, PolicyType: $('#hdnPolicyTypeID').val(),
//    //        MainMemberPolicyID: $('#hdnMainMemberPolicyID').val(), PolicyID: $('#hdnPolicyID').val(), ProviderID: $('#hdnProviderID').val(),
//    //        BrokerID: $('#hdnBrokerID').val(), PayerID: $('#hdnPayerID').val(), CorporateID: $('#hdnCorporateID').val(),
//    //        InsuranceCompanyID: $('#hdnInsuranceCompanyID').val()
//    //    },
//    //    //data: { ClaimDetails: 1, Rules: 4 },
//    //    success: function (data) {
//    //        CheckSessionVariable(data.responseText);
//    //        DialogResultMessage(data);

//    //        window.location = '/Claims/Index';
//    //    },
//    //    error: function (e, x) {
//    //        ShowResultMessage('ErrorMessage', e.responseText);
//    //    }
//    //});
//} else {
//    DialogWarningMessage('Please Provide Remarks to submit');
//}

//// $('#' + _ctrlReason).val('0');
//$('#' + _ctrlRemarks).val('');



function GetCRMRemarksDetails(_ClaimID, _SlNo) {
    //if ($('#tblQueryDocuments tbody').children().length == 0) {
    $.ajax({
        //type: "POST",
        url: "/MedicalScrutiny/CRMRemarksDetails_Retrieve",
        contentType: 'application/json;charset=utf-8',
        //processData: false,
        data: { ClaimID: _ClaimID, SlNo: _SlNo },
        success: function (data) {

            if (basicData[0].Isrefertocrm == true && (parseInt(basicData[0].Sanctionedamount) >= parseInt(basicData[0].Mbbs_thresholdlimit) || parseInt(basicData[0].sanctionedamount) >= parseInt(basicData[0].cmo_thresholdlimit)) && (basicData[0].crm_reasonid == "720" || basicData[0].crm_reasonid == "721")) {
                $("#btnCRMRemarksCRMReviewApproval").show();
            }
            else {
                $("#btnCRMRemarksCRMReviewApproval").hide();
            }

            CheckSessionVariable(data.responseText);
            data = $.parseJSON(data);

            if (data == null || data == "") {
                //alert('Data not found.');
            }
            else {
                //  $('#ddlAuditReasons').val(data[0].PID);
                $('#taCRMRemarks').val(data[0].Remarks);
            }
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
    // }
}

function ClaimInvestigationFeedbackRemarks_Insert(_stageID, _ctrlReason, _ctrlRemarks, _ctrlFieldofcname, _roleID) {

    _claimdetails = {};
    _claimdetails["ClaimID"] = $('#hdnClaimID').val();
    _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
    _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
    _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
    _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
    _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
    _claimdetails["ClaimStageID"] = _stageID;
    _claimdetails["RoleID"] = _roleID;
    _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();

    if ($('#' + _ctrlRemarks).val() === '') {
        _claimdetails["Remarks"] = null;
        DialogWarningMessage('Please Provide Remarks to submit');
        return;
    }
    else {
        _claimdetails["Remarks"] = $('#' + _ctrlRemarks).val();
    }
    if ($('#' + _ctrlFieldofcname).val() === '') {
        DialogWarningMessage('Please Provide Field Officer Name to submit');
        return;
    }
    Submit_Request(JSON.stringify(_claimdetails), _stageID);


    // $('#' + _ctrlReason).val('0');
    $('#' + _ctrlRemarks).val('');
    $('#' + _ctrlFieldofcname).val('');


}

function GetInvestigationRemarksDetails(_ClaimID, _SlNo) {
    //if ($('#tblQueryDocuments tbody').children().length == 0) {

    if (basicData[0].IS_ADJ_FROM_QR == 1 && isQuery_Responsed == 0) {
        setTimeout(function () {
            $(".popup7").attr("style", "display:none !important;");
        }, 100);
        
        DialogWarningMessage("Response Generated for the Raised Queries. please Process first before moving to other Stages");
        return false;
    }

    $.ajax({
        //type: "POST",
        url: "/MedicalScrutiny/InvestigationRemarksDetails_Retrieve",
        contentType: 'application/json;charset=utf-8',
        //processData: false,
        data: { ClaimID: _ClaimID, SlNo: _SlNo },
        success: function (data) {
            CheckSessionVariable(data.responseText);
            data = $.parseJSON(data);
            var iscrm = false;
            //debugger;
            var alroles = $.parseJSON($('#hdnallowedRoles').val());
            $.each(alroles, function (i, item) {
                if (item == 18) {
                    iscrm = true;
                    return;
                }
            });
            if (data == null || data == "") {
                $('#divInternalExternal').hide();
                //alert('Data not found.');
            }
            else {
                //$('#ddlTriggers').val(data[0].PID);
                if (iscrm) {
                    $('#divInternalExternal').show();
                }
                LoadSumoselectCheckbox(data[0].PID.toString(), 'ddlTriggers');
                $('#taReferto_Investigation').val(data[0].Remarks);
                IsitReassigninvestigation(_ClaimID, _SlNo);
            }
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
    // }
}

function IsitReassigninvestigation(_ClaimID, _SlNo) {
    $.ajax({
        url: "/MedicalScrutiny/IsReassigninvestigation",
        contentType: 'application/json;charset=utf-8',
        data: { ClaimID: _ClaimID, SlNo: _SlNo },
        success: function (data) {
            CheckSessionVariable(data.responseText);
            data = $.parseJSON(data);

            if (data != null & data != "") {
                if (data[0].StatusID == 328 && data[0].ClaimStageID == 18) {
                    $('#divReAssignInternalExternal').show();
                    $('#divInternalExternal').hide();
                }
                else
                    $('#divReAssignInternalExternal').hide();
            }
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
}

function InvestigationFeedbackInsurer(InsID) {
    var result = false;
    var AllowInsurers = [7, 5, 6, 8, 20, 26];
    for (var i = 0; i < AllowInsurers.length; i++) {
        if (AllowInsurers[i] == InsID) {
            result = true;
            break;
        }
    }
    return result;
};
function GetInvestigationFeedBackRemarksDetails(_ClaimID, _SlNo) {

    $("#divRecommendation").attr("hidden", true);
    $("#divClaimantReason").attr("hidden", true);
    $("#divHospitalReason").attr("hidden", true);
    $("#DIVBimaInvestigationFraud").attr("hidden", true);
    $("#divGroupOfRepudiation").attr("hidden", true);
    $('#ddlGroundofRepudiation').empty();
    $('#ddlRecommendation').empty();
    $('#ddlClaimantReason').empty();
    $('#ddlHospitalReason').empty();
    $('#txtSuspect_Fraudster_Name').val('');
    $('#ddlSuspect_Fraudster_Proof_ID').val('-1');
    $('#txtSuspect_Fraudster_ID_Proof_Number').val('');

    //if ($('#tblQueryDocuments tbody').children().length == 0) {
    $.ajax({
        //type: "POST",
        url: "/MedicalScrutiny/InvestigationFeedBackBimaDropdownDetails_Retrieve",
        contentType: 'application/json;charset=utf-8',
        //processData: false,
        success: function (data) {
            CheckSessionVariable(data.responseText);
            data = $.parseJSON(data);

            if (data == null || data == "") {
                //alert('Data not found.');
            }
            else {
                var optionhtml = '<option value="-1">--Select--</option>';
                $("#ddlInvestigationReasons").append(optionhtml);
                $("#ddlSuspect_Fraudster_Proof_ID").append(optionhtml);
                BindDropdown(data.Table, "ddlInvestigationReasons");
                BindDropdown(data.Table1, "ddlGroundofRepudiation");
                $('#ddlGroundofRepudiation')[0].sumo.reload();
                BindDropdown(data.Table2, "ddlRecommendation");
                $('#ddlRecommendation')[0].sumo.reload();
                BindDropdown(data.Table3, "ddlClaimantReason");
                $('#ddlClaimantReason')[0].sumo.reload();
                BindDropdown(data.Table4, "ddlHospitalReason");
                $('#ddlHospitalReason')[0].sumo.reload();
                BindDropdown(data.Table5, "ddlSuspect_Fraudster_Proof_ID");
                if (InvestigationFeedbackInsurer($('#hdnInsuranceCompanyID').val()) == true)
                //($("#hdnInsuranceCompanyID").val() == "7") 
                {
                    $("#DIVBimaInvestigation").attr("hidden", false);
                }
                else {
                    $("#DIVBimaInvestigation").attr("hidden", true);
                }
            }
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
    $.ajax({
        //type: "POST",
        url: "/MedicalScrutiny/InvestigationFeedBackRemarksDetails_Retrieve",
        contentType: 'application/json;charset=utf-8',
        //processData: false,
        data: { ClaimID: _ClaimID, SlNo: _SlNo },
        success: function (data) {
            CheckSessionVariable(data.responseText);
            data = $.parseJSON(data);

            if (data == null || data == "") {
                //alert('Data not found.');
            }
            else {
                //$('#ddlTriggers').val(data[0].PID);
                // LoadSumoselectCheckbox(data[0].PID.toString(), 'ddlTriggers');
                $('#taInvestigationFeedbackRemarks').val(data[0].Remarks);
            }
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
    // }
}
function InvestigationRecommendationChange() {
    var value = $("#ddlRecommendation").val();
    $("#divClaimantReason").attr("hidden", true);
    $("#divHospitalReason").attr("hidden", true);
    $("#DIVBimaInvestigationFraud").attr("hidden", true);
    if (value != null) {
        $.each(value, function (index) {
            if (value[index] == "603") {
                $("#divClaimantReason").attr("hidden", false);
            }
            else if (value[index] == "604") {
                $("#divHospitalReason").attr("hidden", false);
            }
            else if (value[index] == "605" || value[index] == "606" || value[index] == "607" || value[index] == "608" || value[index] == "609" || value[index] == "610") {
                $("#DIVBimaInvestigationFraud").attr("hidden", false);
            }
        });
    }
}

function InvestigationReasonchange() {
    $("#divRecommendation").attr("hidden", true);
    $("#divClaimantReason").attr("hidden", true);
    $("#divHospitalReason").attr("hidden", true);
    $("#DIVBimaInvestigationFraud").attr("hidden", true);
    $("#divGroupOfRepudiation").attr("hidden", true);
    $('#ddlGroundofRepudiation')[0].sumo.unSelectAll();
    $('#ddlRecommendation')[0].sumo.unSelectAll();
    $('#ddlClaimantReason')[0].sumo.unSelectAll();
    $('#ddlHospitalReason')[0].sumo.unSelectAll();
    $('#txtSuspect_Fraudster_Name').val('');
    $('#ddlSuspect_Fraudster_Proof_ID').val('-1');
    $('#txtSuspect_Fraudster_ID_Proof_Number').val('');

    if ($("#ddlInvestigationReasons").val() == "588") {
        $("#divRecommendation").attr("hidden", false);
        $("#divGroupOfRepudiation").attr("hidden", false);

    }
}

/*-------------------------------------------------
Code Written By B. Srinu  on 18-Jan-2016
Description : Bug List Dialog open
---------------------------------------------------*/
function Retrieve_BillView() {
    //e.preventDefault();
    //$('#dialogbugInnerText').text(innertext);
    Retrieve_BillDetails($('#hdnClaimID').val(), $('#hdnClaimSlNo').val());
    $("#dialog-bugtrackerList").removeClass('hide').dialog({
        resizable: false,
        width: '1250',
        height: 600,
        modal: true,
        title: "Bill View -Design In-Progress",
        //title:"<div class='widget-header'><h4 class='smaller'><i class='ace-icon fa fa-exclamation-triangle red'></i> Empty the recycle bin?</h4></div>",
        title_html: true,
        buttons: [

            {
                html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; Close",
                "class": "btn btn-minier",
                click: function () {
                    $(this).dialog("close");
                    return false;
                }
            }
        ]
    });
}

/*-------------------------------------------------
Code Written By B. Srinu  on 03-Feb-2016
Description : Retrieve_BillDetails
---------------------------------------------------*/
function Retrieve_BillDetails(_ClaimID, _SlNo) {
    try {
        // var desc = $('#txtbugDesc').val();
        var user = '';// $('#txtloginuserName').val();
        // var pagename = "";
        //if (desc != '' && user != '') {
        $.ajax({
            url: "/MedicalScrutiny/BillViewRetrieve",
            type: 'POST',
            data: { ClaimID: _ClaimID, SlNo: _SlNo },
            success: function (result) {
                CheckSessionVariable(result);
                BindBillViewResults($.parseJSON(result), 'tblbugList', 10);
                $('.date').css('width', '50px');
                // alert(result);
                // DialogResultMessage("Your observation is recorded successfully...");
            },
            error: function () {

                DialogCommomErrorFunction('Error while Processing')
            }
        });
        //} else {
        //    DialogWarningMessage('Username and description fields are mandatory')
        //}
    } catch (e) {
        DialogCommomErrorFunction('Error while Processing')
    }
}

/*-------------------------------------------------
Code Written By B. Srinu  on 19thAug2015
Description: Bind Results to Html Table Dynamically --B.SRINU 19thAug2015
---------------------------------------------------*/
function BindBillViewResults(data, tableId, count, BillingTypeID) {
    if (data != null) {
        $('#' + tableId).html('');
        var columns = [];
        if ((data != null)) {
            columns = GetColumnsOfJsonObj(data[0]);
            //var tHead = "<thead><tr>";
            //if (count == null || count == undefined || count == '')
            //    count = columns.length;
            //count = (columns.length > count) ? count : columns.length;
            //for (var i = 0; i < count; i++) {
            //    //  tHead = tHead + "<th>" + columns[i].capitalize() + "</th>";
            //    tHead = tHead + "<th>" + columns[i] + "</th>";
            //}
            //tHead = tHead + "</tr></thead>";

            tHead = '<thead><tr><th>Name</th><th>BillAmount</th><th>ApprovedAmount</th><th>DeductionAmount</th><th>DeductionReason</th></tr></thead>';
            $("#" + tableId).append(tHead);

            var tBody = '<tbody>';

            var lastsid = 0;
            var tr = "";
            var _deductionamount = 0;
            var _deductyionReason = '';
            var _deductionreasonshtml = '';
            var _count = data.length;
            BillingTypeID;
            for (var i = 0; i < data.length; i++) {
                if (_count != (i + 1)) {
                    if (data[i].ServiceID != lastsid && data[i].ServiceID != data[i + 1].ServiceID) {
                        //tr = '<tr><th>' + data[i].Name + '</th><th>' + MakeNEUasNotApplicable(data[i].BillNo) + '</th><th style="width: 101px !important;">' + DisplayDateasIcon(data[i].BillDate) + '</th><th>' + data[i].BillAmount + '</th><th>' + data[i].ApprovedAmount + '</th><th>' + data[i].DeductionAmount + '</th><th>' + MakeEmptyfromUndefinedorNull(data[i].DeductionReason) + '</th></tr>';
                        tr = '<tr><th>' + data[i].Name + '</th><th>' + data[i].BillAmount + '</th><th>' + data[i].ApprovedAmount + '</th><th>' + data[i].DeductionAmount + '</th><th>' + MakeEmptyfromUndefinedorNull(data[i].DeductionReason) + '</th></tr>';
                        tBody = tBody + tr;
                    }
                    else
                        if (data[i].ServiceID != lastsid && data[i].ServiceID == data[i + 1].ServiceID) {
                            tr = '<tr><th>' + data[i].Name + '</th><th>' + data[i].BillAmount + '</th><th>' + data[i].ApprovedAmount + '</th>';
                            _deductionamount = parseFloat(data[i].DeductionAmount);
                            _deductyionReason = data[i].DeductionAmount + '--' + data[i].DeductionReason;
                            _deductionreasonshtml = '<table class="tablenew"><tbody><tr><td>' + data[i].DeductionReason + '</td><td>' + data[i].DeductionAmount + '</td></tr>';
                        }
                        else
                            if (data[i].ServiceID == lastsid && data[i].ServiceID == data[i + 1].ServiceID) {
                                // tr = tr + '<th>' + data[i - 1].DeductionAmount + '</th><th>' + data[i - 1].DeductionReason + '</th></tr>';
                                _deductionamount = _deductionamount + parseFloat(data[i].DeductionAmount);
                                _deductyionReason = _deductyionReason + ' , ' + data[i].DeductionAmount + '--' + data[i].DeductionReason;
                                _deductionreasonshtml = _deductionreasonshtml + '<tr><td>' + data[i].DeductionReason + '</td><td>' + data[i].DeductionAmount + '</td></tr>';
                            }
                            else
                                if (data[i].ServiceID == lastsid && data[i].ServiceID != data[i + 1].ServiceID) {
                                    _deductionamount = _deductionamount + parseFloat(data[i].DeductionAmount);
                                    _deductyionReason = _deductyionReason + ' , ' + data[i].DeductionAmount + '--' + data[i].DeductionReason;
                                    _deductionreasonshtml = _deductionreasonshtml + '<tr><td>' + data[i].DeductionReason + '</td><td>' + data[i].DeductionAmount + '</td></tr></tbody></table>';
                                    tr = tr + '<th>' + _deductionamount + '</th><th>' + _deductyionReason + '</th></tr>';
                                    tBody = tBody + tr;
                                }
                    //else if (data[i].ServiceID == 98 && BillingTypeID == 202 ) {
                    //    //tr = '<tr><th>' + data[i].Name + '</th><th>' + MakeNEUasNotApplicable(data[i].BillNo) + '</th><th style="width: 101px !important;">' + DisplayDateasIcon(data[i].BillDate) + '</th><th>' + data[i].BillAmount + '</th><th>' + data[i].ApprovedAmount + '</th><th>' + data[i].DeductionAmount + '</th><th>' + MakeEmptyfromUndefinedorNull(data[i].DeductionReason) + '</th></tr>';
                    //    tr = '';
                    //    tBody = tBody + tr;
                    //}


                    lastsid = data[i].ServiceID;
                } else {
                    if (data[i].ServiceID == lastsid) {
                        _deductionamount = _deductionamount + parseFloat(data[i].DeductionAmount);
                        _deductyionReason = _deductyionReason + ' , ' + data[i].DeductionAmount + '--' + data[i].DeductionReason;
                        _deductionreasonshtml = _deductionreasonshtml + '<tr><td>' + data[i].DeductionReason + '</td><td>' + data[i].DeductionAmount + '</td></tr></tbody></table>';
                        tr = tr + '<th>' + _deductionamount + '</th><th>' + _deductyionReason + '</th></tr>';
                        tBody = tBody + tr;
                    }
                    //else if (data[i].ServiceID == 98 && BillingTypeID == 202) {
                    //    //tr = '<tr><th>' + data[i].Name + '</th><th>' + MakeNEUasNotApplicable(data[i].BillNo) + '</th><th style="width: 101px !important;">' + DisplayDateasIcon(data[i].BillDate) + '</th><th>' + data[i].BillAmount + '</th><th>' + data[i].ApprovedAmount + '</th><th>' + data[i].DeductionAmount + '</th><th>' + MakeEmptyfromUndefinedorNull(data[i].DeductionReason) + '</th></tr>';
                    //    tr = '';
                    //    tBody = tBody + tr;
                    //}
                    else {
                        tr = '<tr><th>' + data[i].Name + '</th><th>' + data[i].BillAmount + '</th><th>' + data[i].ApprovedAmount + '</th><th>' + data[i].DeductionAmount + '</th><th>' + MakeEmptyfromUndefinedorNull(data[i].DeductionReason) + '</th></tr>';
                        tBody = tBody + tr;
                    }
                }
            }
            //var tr = "";
            //$.each(data, function (i, item) {
            //    if (item.ServiceID == lastsid) {
            //        tr = '<tr><th>' + item.ServiceID + '</th><th>' + item.BillDetailsID + '</th><th>' + item.Name + '</th><th>' + item.BillNo + '</th><th>' + item.BillDate + '</th><th>' + item.BillAmount + '</th><th>' + item.ApprovedAmount + '</th><th>' + item.DeductionAmount + '</th><th>' + item.DeductionReason + '</th></tr>';
            //    }
            //    else {

            //    }
            //});
            $("#" + tableId).append(tBody);



        }
        if ((data.length == 0) || (data == null)) {
            // $('#PreAuth_download').css({ 'display': 'none' });
            var $tr = $('<tr class="tr">').append($('<td colspan="8" style=" font-size:large; color:#3A798C;text-align:center;">').text("No Records Found")
            ).appendTo('#' + tableId);
        }
        //  $("#" + tableId).append('<tr><td colspan="10">' + $('#divBillcalculation').html() + '</td></tr><tr><td colspan="10"><a class="glyphicon glyphicon-print blue" style="width: 30px; height: 30px; font-size: 1.7em;" onclick=PrintDivContent("tblbugList") ></a></td></tr>');
    }
}


function Enable_Buttons(_stageID) {
    if (basicData[0].IS_ADJ_FROM_QR == 1 && isQuery_Responsed == 0) {
        alert("Response Generated for the Raised Queries. please Process first before moving to other Stages")
    }
    RemoveCMORemarks = 0;
    var values = $("#hdnInsuranceCompanyID").val()
    //Validating Preauth Request button
    var _valmsgs = [];
    var _valid = null;
    if (isproportionatechanged == true) {
        DialogWarningMessage("As you override proportionate, first save bill details and then approve");
        return false;
    }
    if (_stageID == 24) {
        if (BhimaSatarkInsurer($('#hdnInsuranceCompanyID').val()) == true && (basicData[0].RequestTypeID == 4 || basicData[0].RequestTypeID == 7)) {
            if (dtbhimavalidationsData > 0 && ($('#txt_radio').is(':checked') == false && $('#txt_radio2').is(':checked') == false)) {
                DialogResultMessage("Please  fill Radialogist/pathologist ONE details in Bhima satark tab");
                return false;
            }
            if ($("#txt_PhysicianName").val() == '' || $("#txt_PhysicianName").val() == null) {
                DialogResultMessage("Please provide the Physician/Treating Doctor Name under Bima Satark tab");
                return false;
            }
            //if (BhimaSatarkInsurer($('#hdnInsuranceCompanyID').val()) == true && ($("#txt_PhysicianMobileNo").val() == '' || $("#txt_PhysicianMobileNo").val() == null)) {
            //    DialogResultMessage("Please provide the Physician Mobile under Bima Satark tab");
            //    return false;
            //}
            if ($("#txt_PhysicianRegNo").val() == '' || $("#txt_PhysicianRegNo").val() == null) {
                DialogResultMessage("Please provide the Physician REgNO under Bima Satark tab");
                return false;
            }
            if ($("#txtTreating_Doctor_PAN_Card").val() == '' || $("#txtTreating_Doctor_PAN_Card").val() == null) {
                DialogResultMessage("Please enter Doctor_PAN_Card in Bima Satark tab");
                return false;
            }
        }
    }

    if (basicData[0] == null || basicData[0] == '' || basicData[0] == undefined) {
        _valid = false;
        _valmsgs.push('Bill Amount value is not found. Please ensure bill details to proceed further');
        //MultipleMsgsValidateDialog
        //_valmsgs.push('Service details data not found');
        // DialogWarningMessage('Service details data not found');
    } else {
        var _amt = Makezerofromnullorundefined(basicData[0].BillAmount) + Makezerofromnullorundefined(basicData[0].PackageAmount);
        if (_amt == 0 || _amt == '' || _amt == null || _amt == undefined) {
            //if (Makezerofromnullorundefined(basicData[0].BillAmount) == 0 || Makezerofromnullorundefined(basicData[0].BillAmount) == '' || Makezerofromnullorundefined(basicData[0].BillAmount) == undefined || Makezerofromnullorundefined(basicData[0].BillAmount) == null || Makezerofromnullorundefined(basicData[0].PackageAmount) == 0 || Makezerofromnullorundefined(basicData[0].PackageAmount) == '' || Makezerofromnullorundefined(basicData[0].PackageAmount) == undefined || Makezerofromnullorundefined(basicData[0].PackageAmount) == null) {
            _valid = false;
            _valmsgs.push('Bill Amount value is not found. Please ensure bill details to proceed further');
        }
    }

    //Abhishek sp3v- 2914
    if ((_stageID == 5 || _stageID == 28 || _stageID == 38) && basicData[0].IsAutomationClaim != 5) {
        var HospTreatmentType = $("#hdnHospTreatmentType").val();//$('#ddlHospTreatmentType').val();
        if (HospTreatmentType == '' || HospTreatmentType == null || HospTreatmentType == undefined) {
            _valid = false;
            _valmsgs.push('Probable Line of Treatment is Mandatory');

        }

        var ProbableLineOfTreatment = $("#hdnProbableLineOfTreatment").val();// $("#txtProbableLineOfTreatment").val();
        if (ProbableLineOfTreatment == '' || ProbableLineOfTreatment == null || ProbableLineOfTreatment == undefined) {
            _valid = false;
            _valmsgs.push('Treatment Details is Mandatory');

        }
    }
    //if (_stageID == 5 || _stageID == 28 || _stageID == 38 || _stageID == 22 || _stageID == 24) {
    //    if (_bsiData == null || _bsiData == '' || _bsiData == undefined) {
    //        _valid = false;
    //        _valmsgs.push('No Balance Sum Insured details found. Cannot be processed claim');
    //        //DialogWarningMessage('Balence sum insured data not found');

    //    } else {
    //        if (_bsiData["Table1"].length == 0) {
    //            _valid = false;
    //            _valmsgs.push('No Balance Sum Insured details found. Cannot be processed claim');
    //            //  DialogWarningMessage('Balence sum insured data not found');
    //        }
    //    }
    //}

    if ($('#hdnClaimsCodingDetails').val() == '' || $('#hdnClaimsCodingDetails').val() == null || $('#hdnClaimsCodingDetails').val() == '[]' || $('#hdnClaimsCodingDetails').val() == undefined) {
        _valid = false;
        _valmsgs.push('Coding details data not found . Please enter Coding details');
        //DialogWarningMessage('Coding details data not found');
    }
    else {
        var codingDetails = [];
        if ($('#hdnClaimsCodingDetails').val() != '') {
            codingDetails = $.parseJSON($('#hdnClaimsCodingDetails').val());
        }

        for (var i = 0; i < codingDetails.length; i++) {
            if (parseInt($('#' + hdnCodingID + codingDetails[i].PackageRatio).val()) == 0) {
                _valid = false;
                _valmsgs.push('Please save coding details');
                break;
            }
        }
    }
    // ClaimAI: Removed IsAprvFacilitychanged, IsFacilityChanged, and BillingCorrection
    // validations — these are handled automatically by the AI save flow.

    if (_valid == null) {
        //  data.NextactionStage
        if (_stageID != null || _stageID != '') {

            if ($('#hdnClaimTypeID').val() == 1 && (_stageID == 5 || _stageID == 38)) {
                $('#lnkPreauthCancel').show();
            }
            // Convert string value into a proper boolean
            if (window.IS_PAYTM_CLAIM) {
                $('#lnkQueryPending').hide();
                $('#lnkInvestigation').hide();
                $('#lnkRefertoInsurer').hide();
                $('#lnkAdjudication').hide();
                $('#btnReject,#btnRejectAll').removeAttr('disabled', true);
                $('#btnApprove').hide();
                $('#btnInsurerSubmit').removeAttr('disabled', true);
                $('#btnInsurerResSubmit').attr('disabled', true);
                $('#lnkReferCRM').show();
                $('#SAA_lnkReviewReturn').hide();
                $('#SAA_lnkReviewed').hide();
                $('#lnkAuditToBilling').hide();

                return false;
            }


            //SP3V-994 Leena
            var IsSuspiciousPolicy = $("#hdnIsSuspiciousPolicy").val();
            if ((_stageID == 24) && (IsSuspiciousPolicy == "true")) {
                $('#lnkQueryPending').show();
                $('#lnkInvestigation').show();
                $('#lnkRefertoInsurer').show();
                $('#lnkAdjudication').hide();
                $('#btnApprove,#btnReject,#btnRejectAll').attr('disabled', true);
                $('#btnQueryPendingDetailsSave').removeAttr('disabled', true);
                $('#lnkCRMRemarks').show();
                $('#lnkInvestigation').show();
                $('#lnkInvestigationFeedBack').hide();
                $('#btnInvestigationFeedbackRemarksbacktoadjSubmit,#btnInvestigationSubmit').attr('disabled', true);
                return false;
            }
            //End SP3V-994 Leena
            if ((_stageID == 5 || _stageID == 38 || _stageID == 24) && (basicData[0].CorpID == 20575 || basicData[0].CorpID == 20576 || basicData[0].CorpID == 20583 || basicData[0].CorpID == 20584 || basicData[0].CorpID == 22548 || basicData[0].CorpID == 22889 || basicData[0].CorpID == 22890)
                && (basicData[0].RequestTypeID == 8)) {
                if (basicData[0].bufferwithoutbase == false) {
                    $('#buffercheck').show();
                    $('#BufferwithoutBase').removeAttr('disabled', true);
                }
                else {
                    $('#BufferwithoutBase').attr('checked', true);
                    $('#BufferwithoutBase').attr('disabled', true);
                }
            }
            else {
                $('#buffercheck').hide();
            }

            // 5 - Adjudication
            var ScrutinyhospitalDetails = JSON.parse($('#hdnGetHospitalDetails').val());
            var GipsappnCites = JSON.parse(MasterData.GipsappnCites);
            if (_stageID == 5) {
                // $('#divAdjudication').show();
                $('#lnkAuditToBilling').show();
                if ((Date.parse(JSONDate2(basicData[0].MemberCommencingDate)) <= Date.parse(JSONDate2(basicData[0].dateofadmission))) && (Date.parse(JSONDate2(basicData[0].MemberEndDate)) >= Date.parse(JSONDate2(basicData[0].dateofadmission)))) {
                    $('#lnkQueryPending').show();
                    $('#lnkInvestigation').show();
                    $('#lnkRefertoInsurer').show();
                    $('#lnkAdjudication').show();
                    $('#btnApprove,#btnReject,#btnRejectAll').removeAttr('disabled', true);
                    $('#btnInsurerSubmit').removeAttr('disabled', true);
                    $('#btnInsurerResSubmit').attr('disabled', true);
                    $('#lnkReferCRM').show();

                    if (($('#hdnClaimTypeID').val() == 1) && (basicData[0].IssueID == 6 || basicData[0].IssueID == 7 || basicData[0].IssueID == 8 || basicData[0].IssueID == 5) && (basicData[0].CorpID == 0) && (ScrutinyhospitalDetails[0].isgipsappn != 1)) {
                        for (i = 0; i < GipsappnCites.length; i++) {
                            if ((ScrutinyhospitalDetails[0].CityID == GipsappnCites[i].CityID) && (basicData[0].IssueID == GipsappnCites[i].IssueID)) {
                                $('#lnkQueryPending').hide();
                                $('#lnkInvestigation').hide();
                                $('#lnkRefertoInsurer').hide();
                                $('#lnkReferCRM').hide();
                                //$('#btnApprove').attr('disabled', true);
                                IsGipsaPpnCity = true;
                            }
                        }
                    }
                    if ($('#hdnClaimTypeID').val() == 1 && ($('#hdnRequestTypeID').val() == 1 || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3))
                        $('#ScrutinySkipFunction').show();
                }
                else {
                    $('#lnkQueryPending').hide();
                    $('#lnkInvestigation').hide();
                    $('#lnkRefertoInsurer').show();
                    $('#lnkAdjudication').show();
                    $('#btnReject,#btnRejectAll').removeAttr('disabled', true);
                    $('#btnApprove').hide();
                    $('#btnInsurerSubmit').removeAttr('disabled', true);
                    $('#btnInsurerResSubmit').attr('disabled', true);
                    $('#lnkReferCRM').hide();
                    $('#lnkAuditToBilling').show();
                }
                if (basicData[0].IsAutomationClaim == 5) {
                    $('#lnkQueryPending').hide();
                    $('#lnkInvestigation').hide();
                    $('#lnkRefertoInsurer').hide();
                    $('#lnkAdjudication').show();
                    $('#btnReject,#btnRejectAll').removeAttr('disabled', true);
                    $('#btnApprove').hide();
                    $('#btnInsurerSubmit').removeAttr('disabled', true);
                    $('#btnInsurerResSubmit').attr('disabled', true);
                    $('#lnkReferCRM').hide();
                    $('#SAA_lnkReviewReturn').show();
                    $('#SAA_lnkReviewed').show();
                    $('#lnkAuditToBilling').hide();
                }
                if (basicData[0].IssueID == 9)
                    $('#lnkRefertoInsurer').hide();
                if (IsreopenClaim == false && basicData[0].Isrefertoinsurer == true) {
                    if (basicData[0].ReasonIDs_P == '224' && basicData[0].Isrefertoinsurer == true) {
                        $('#btnReject').attr('disabled', true);
                        $('#btnRejectAll').attr('disabled', true);
                        $('#lnkPreauthCancel').attr('disabled', true);
                    }
                    else if (basicData[0].ReasonIDs_P == '225' && (basicData[0].Isrefertoinsurer == true || basicData[0].IssueID == 26)) {
                        $('#btnApprove').attr('disabled', true);
                    }
                }
                if (basicData[0].RequestTypeID == 1 && basicData[0].IsAutomationClaim == 5 && basicData[0].Sanctionedamount > 0 && SSA_calculate_flag == false) {
                    $('#lnkAdjudication').trigger('click');
                }

                //if (basicData[0].Isrefertocrm == true) {
                //    $('#lnkReferCRM').hide();
                //}

            }
            // 7 - Query to Hospital, 8 - Query to Member
            else if (_stageID == 7 || _stageID == 8) {
                $('#lnkQueryPending').show();
                $('#lnkInvestigation').hide();
                $('#lnkRefertoInsurer').hide();
                $('#lnkAdjudication').hide();
                $('#btnApprove,#btnReject,#btnRejectAll').attr('disabled', true);
                $('#btnQueryPendingDetailsSave').removeAttr('disabled', true);
                $('#lnkCRMRemarks').show();
                $('#lnkInvestigation').show();
                $('#lnkInvestigationFeedBack').show();
                $('#btnInvestigationFeedbackRemarksbacktoadjSubmit,#btnInvestigationSubmit').attr('disabled', true);
                $('#btnCRMRemarksbacktoadjSubmit').attr('disabled', true);
                $('#rmcls').hide();
            }
            //Response from Hospital ,Response from Member
            else if (_stageID == 12 || _stageID == 13) {
                $('#lnkQueryPending').show();
                $('#lnkInvestigation').hide();
                $('#lnkRefertoInsurer').hide();
                $('#lnkAdjudication').hide();
                $('#btnApprove,#btnReject,#btnRejectAll').attr('disabled', true);
                $('#btnQueryPendingDetailsSave').removeAttr('disabled', true);
                $('#lnkCRMRemarks').show();
                $('#lnkInvestigation').show();
                $('#lnkInvestigationFeedBack').show();
                $('#btnInvestigationFeedbackRemarksbacktoadjSubmit,#btnInvestigationSubmit').attr('disabled', true);
                $('#rmcls').hide();
            }
            //Response From Insurer(Same as Audit )
            else if (_stageID == 14) {
                $('#lnkQueryPending').show();
                $('#lnkInvestigation').show();
                $('#lnkRefertoInsurer').show();
                $('#lnkAdjudication').show();
                $('#lnkAudit').hide();
                $('#lnkResponsefromInsurer').show();
                $('#btnApprove,#btnReject,#btnRejectAll').removeAttr('disabled', true);
                $('#btnInsurerSubmit').removeAttr('disabled', true);
                $('#btnInsurerResSubmit').attr('disabled', true);
                $('#lnkCRMRemarks').show();
                // $('#btnCRMRemarksbacktoadjSubmit').attr('disabled', true);
            }
            //pending functinality (same as Audit)
            //Refer To Insurer
            else if (_stageID == 17) {
                if (basicData[0].IssueID != 9) {
                    //$('#lnkRefertoInsurer').show();
                    $('#lnkQueryPending').hide();
                    $('#btnApprove,#btnReject,#btnRejectAll').attr('disabled', true);
                    $('#lnkInvestigation').hide();
                    $('#lnkAdjudication').show();
                    $('#lnkResponsefromInsurer').show();
                    $('#btnInsurerResSubmit').removeAttr('disabled', true);
                    $('#btnInsurerSubmit').attr('disabled', true);
                }
                else {
                    if ($('#hdnIsAPICall').val() == "True") {
                        $('#lnkWaitingForInsurerResponse').show();
                        $('#lnkRefertoInsurer').hide();
                        $('#lnkQueryPending').hide();
                        $('#btnApprove,#btnReject,#btnRejectAll').attr('disabled', true);
                        $('#lnkInvestigation').hide();
                        $('#lnkAdjudication').hide();
                        $('#lnkResponsefromInsurer').hide();
                        $('#btnInsurerResSubmit').removeAttr('disabled', true);
                        $('#btnInsurerSubmit').attr('disabled', true);
                    }
                    else {
                        $('#lnkRefertoInsurer').show();
                        $('#lnkQueryPending').hide();
                        $('#btnApprove,#btnReject,#btnRejectAll').attr('disabled', true);
                        $('#lnkInvestigation').hide();
                        $('#lnkAdjudication').show();
                        $('#lnkResponsefromInsurer').show();
                        $('#btnInsurerResSubmit').removeAttr('disabled', true);
                        $('#btnInsurerSubmit').attr('disabled', true);
                    }
                }
                if (basicData[0].IssueID == 9) {
                    $('#lnkRefertoInsurer').hide();
                    $('#lnkResponsefromInsurer').hide();
                }
            }
            else if (_stageID == 18) {
                $('#lnkQueryPending').hide();
                $('#lnkInvestigation').show();
                $('#lnkInvestigationFeedBack').show();

                $('#lnkRefertoInsurer').hide();
                $('#lnkAdjudication').hide();
                $('#lnkAudit').hide();
                $('#btnApprove,#btnReject,#btnRejectAll').attr('disabled', true);
                $('#btnInvestigationFeedbackRemarksbacktoadjSubmit').removeAttr('disabled', true);
                $('#btnInvestigationSubmit').attr('disabled', true);
                //$('#lnkInvestigationFeedBack').hide();
                // GetInvestigation();
                $('#rmcls').hide();
            }
            //Investigation Feedback
            else if (_stageID == 20) {
                $('#lnkQueryPending').show();
                $('#lnkInvestigation').show();
                $('#lnkRefertoInsurer').show();
                $('#lnkAdjudication').show();
                $('#lnkAudit').hide();
                $('#btnApprove,#btnReject,#btnRejectAll').removeAttr('disabled', true);
                $('#lnkInvestigation').show();
                $('#lnkInvestigationFeedBack').hide();
                $('#btnInvestigationFeedbackRemarksbacktoadjSubmit').attr('disabled', true);
                $('#lnkCRMRemarks').show();
                //$('#btnCRMRemarksbacktoadjSubmit').attr('disabled', true);
                $('#rmcls').hide();
            }


            //Sent for Audit
            else if (_stageID == 22) {
                $('#lnkQueryPending').hide();
                $('#lnkInvestigation').hide();
                $('#lnkRefertoInsurer').hide();
                $('#lnkAdjudication').show();
                $('#lnkAudit').hide();
                $('#btnApprove,#btnReject,#btnRejectAll').removeAttr('disabled', true);
                $('#rmcls').hide();
                $('#lnkAuditToBilling').show();
            }

            //Reject
            else if (_stageID == 23 && values == 20) {
                //alert("repud")
                $('#lnkQueryPending').hide();
                $('#lnkInvestigation').hide();
                $('#lnkRefertoInsurer').hide();
                $('#lnkAudit').hide();
                $('#btnApprove,#btnReject,#btnRejectAll').attr('disabled', true);
                $('#btnBillCalculator').hide().attr('disabled', true);
                //'For Repudiation' functionality to be removed (SP-1459)
                //$('#lnkRejectionProcess').show();
                //End of 'For Repudiation' functionality to be removed (SP-1459)
            }

            else if (_stageID == 23) {
                //alert("repud")
                $('#lnkQueryPending').hide();
                $('#lnkInvestigation').hide();
                $('#lnkRefertoInsurer').hide();
                $('#lnkAdjudication').show();
                $('#lnkAudit').hide();
                $('#btnApprove,#btnReject,#btnRejectAll').attr('disabled', true);
                $('#btnBillCalculator').hide().attr('disabled', true);
                //$('#btnBillCalculator').show().removeAttr('disabled');
            }

            //pending functinality(Allow Back To Adjudication)
            else if (_stageID == 24) {
                $('#lnkAuditToBilling').show();
                if ((PatientDtls.Table[0].isNIDB == true || ($("#hdnPolicyNIDB").val()) == "true") && ($("#hdnRequestTypeID").val() != 1 && $("#hdnRequestTypeID").val() != 2 && $("#hdnRequestTypeID").val() != 3) && (basicData[0].IsPayment_NIDB == false)) {
                    $('#lnkRefertoInsurer').show();
                }
                else {
                    $('#lnkRefertoInsurer').hide();
                }
                $('#lnkQueryPending').hide();
                $('#btnApprove,#btnReject,#btnRejectAll').hide().attr('disabled', true);
                $('#lnkInvestigation').hide();
                $('#lnkAdjudication').show();
                $('#lnkAudit').show();
                //****** SP-1103
                $('#btnReprocess').show();
                $('#btnReProcessBillAmt').show();
                $('#btnBillCalculator').hide();
                //$('#lnkCalculationReProcess').show();
                //$('#btnBillCalculator').hide().attr('disabled', true);
                //********
                $('#lnkSettlement').hide();
                if ($('#hdnClaimTypeID').val() == 1 && ($('#hdnRequestTypeID').val() == 1 || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3))
                    $('#ScrutinySkipFunction').show();

                if (($('#hdnSkipScrutinyAuditRecal').val() != "false") && $('#hdnSkipScrutinyAuditShow').val() == "true" && $('#hdnClaimTypeID').val() == 1 && $('#hdnRequestTypeID').val() == 4)
                    $('#lnkAudit').hide();
                else if ($('#hdnSkipScrutinyAuditRecal').val() == "false" && $('#hdnSkipScrutinyAuditShow').val() == "true" && $('#hdnClaimTypeID').val() == 1 && $('#hdnRequestTypeID').val() == 4)
                    $('#lnkAudit').show();
                if (basicData[0].IsRecalculated == true)     /// added by prasad
                    $('#lnkAudit').show();
                else
                    $('#lnkAudit').hide();          // added
                if (basicData[0].isoutofSI == 1) {
                    $('#btnReProcessBillAmt').hide();
                    $('#btnReprocess').hide();
                }
                $('#rmcls').hide();
            }
            //Response from Audit
            else if (_stageID == 28) {
                $('#lnkQueryPending').show();
                $('#lnkInvestigation').show();
                $('#lnkRefertoInsurer').show();
                $('#lnkAdjudication').show();
                $('#btnReject,#btnApprove,#btnRejectAll').removeAttr('disabled', true);
                $('#btnInsurerSubmit').removeAttr('disabled', true);
                $('#btnInsurerResSubmit').attr('disabled', true);
                //$('#btnBillCalculator').hide().attr('disabled', true);
                $('#lnkAudit').show();
                $('#btnAuditbacktoadjSubmit,#btnAuditSubmit').attr('disabled', true);
                $('#lnkSettlement').hide();
                $('#lnkReferCRM').show();
                $('#lnkAuditToBilling').show();
                if (basicData[0].IssueID == 9)
                    $('#lnkRefertoInsurer').hide();
                if (IsreopenClaim == false && basicData[0].Isrefertoinsurer == true) {
                    if (basicData[0].ReasonIDs_P == '224' && basicData[0].Isrefertoinsurer == true) {
                        $('#btnReject').attr('disabled', true);
                        $('#btnRejectAll').attr('disabled', true);
                        $('#lnkPreauthCancel').attr('disabled', true);
                    }
                    else if (basicData[0].ReasonIDs_P == '225' && (basicData[0].Isrefertoinsurer == true || basicData[0].IssueID == 26)) {
                        $('#btnApprove').attr('disabled', true);
                    }
                }
            }
            else if (_stageID == 26) {
                // $('#lnkSettlement').show();
                DialogWarningMessage('Currently Payment processing is Offline');
            }
            else if (_stageID == 27) {

                var isneftbounce = basicData[0].ISNeftBounced;// == 1 ? true : false;
                if (basicData[0].StageID == 27 && isneftbounce == false)
                    DialogWarningMessage('Claim Settled ');
                else
                    if (basicData[0].StageID == 27 && isneftbounce == true)
                        $('#lnkNeftBounceQueryResponse').show();
                    else
                        if (basicData[0].StageID == 27 && isneftbounce == null)
                            $('#lnkNeftBounceQuery').show();
                        else
                            $('#lnkSettlement').show();


            }

            //30 First Reminder-Hospital,31 econd Reminder-Hospital,32 Third Reminder-Hospital,33 Fourth Reminder-Hospital,34 First Reminder-Member,35 Second Reminder-Member,36 Third Reminder-Member,,37 Fourth Reminder-Member
            else if (_stageID == 30 || _stageID == 31 || _stageID == 32 || _stageID == 33 || _stageID == 34 || _stageID == 35 || _stageID == 36 || _stageID == 37) {
                $('#lnkQueryPending').show();
                $('#lnkInvestigation').hide();
                $('#lnkRefertoInsurer').hide();
                $('#lnkAdjudication').hide();
                $('#btnApprove,#btnReject,#btnRejectAll').attr('disabled', true);
                $('#btnQueryPendingDetailsSave').removeAttr('disabled', true);
                $('#lnkCRMRemarks').show();
                $('#lnkInvestigation').show();
                $('#lnkInvestigationFeedBack').hide();
                $('#btnInvestigationFeedbackRemarksbacktoadjSubmit,#btnInvestigationSubmit').attr('disabled', true);

                if (_stageID == 32 || _stageID == 33 || _stageID == 36 || _stageID == 37) { //IR Close                  
                    $('#lnkIRClose').show();
                }
                $('#rmcls').hide();
            }
            else if (_stageID == 38) { //Response from CRM
                // $('#divAdjudication').show();
                $('#lnkQueryPending').show();
                $('#lnkInvestigation').show();
                $('#lnkRefertoInsurer').show();
                $('#lnkAdjudication').show();
                $('#lnkFromCRMClose').show();
                $('#btnApprove,#btnReject,#btnRejectAll').removeAttr('disabled', true);
                $('#btnInsurerSubmit').removeAttr('disabled', true);
                $('#btnInsurerResSubmit').attr('disabled', true);
                $('#lnkCRMRemarks').show();
                $('#btnCRMRemarksbacktoadjSubmit').attr('disabled', true);
                $('#lnkAuditToBilling').show();
                $('#lnkReferCRM').show();
                if ($('#hdnClaimTypeID').val() == 1 && ($('#hdnRequestTypeID').val() == 1 || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3)) {
                    $('#ScrutinySkipFunction').show();
                }
                if ((Isitpreauth(basicData[0].RequestTypeID) && basicData[0].IssueID == 31) || basicData[0].IssueID == 9)
                    $('#lnkRefertoInsurer').hide();
            }
            //else if (_stageID == 29) {
            //    //DialogErrorMessage('The Preauth process complete. The case is waiting for Cashless Claim; Cannot be processed now.');
            //    $('#btnApprove').remove();
            //    $('#btnReject').remove();
            //    $('#btnRejectAll').remove();
            //    $('#btnBillCalculator').remove();

            //    $('#lnkAdjudication').show();
            //    $('#lnkPreauthCancel').show();
            //}
            //Added by Rajesh Yerramsetti for SP3V-1690
            else if (_stageID == 29 && (($('#IsAutomationClaim').val() == 2 || $('#IsAutomationClaim').val() == 3 || $('#IsAutomationClaim').val() == 4))) {
                $('#btnApprove').remove();
                $('#btnReject').remove();
                $('#btnRejectAll').remove();
                $('#btnBillCalculator').remove();

                $('#lnkAdjudication').show();
                $('#lnkPreauthCancel').show();
                //Added by Rajesh Yerramsetti for SP3V-1690
                $('#lnkReviewReturn').hide();
                $('#lnkReviewed').hide();
                $('#rmcls').hide();
            }

            else if (_stageID == 29 && $('#IsAutomationClaim').val() == 1) {

                $('#btnApprove').remove();
                $('#btnReject').remove();
                $('#btnRejectAll').remove();
                $('#btnBillCalculator').remove();

                $('#lnkAdjudication').show();
                $('#lnkPreauthCancel').show();
                //Added by Rajesh Yerramsetti for SP3V-1690
                //$('#lnkReviewReturn').show(); Commented by leena SP3V-3079
                $('#lnkReviewed').show();
                /*SP3V - 3079 Leena*/
                if ($('#hdnCntEnhanceFinalRequest').val() == 0) {
                    $('#lnkReviewReturn').show();
                }
                /*End SP3V - 3079 Leena*/
                $('#rmcls').hide();
            }

            else if (_stageID == 29 && $('#IsAutomationClaim').val() != 1) {
                //DialogErrorMessage('The Preauth process complete. The case is waiting for Cashless Claim; Cannot be processed now.');
                $('#btnApprove').remove();
                $('#btnReject').remove();
                $('#btnRejectAll').remove();
                $('#btnBillCalculator').remove();

                $('#lnkAdjudication').show();
                $('#lnkPreauthCancel').show();
                //Added by Rajesh Yerramsetti for SP3V-1690
                $('#lnkReviewReturn').hide();
                $('#lnkReviewed').hide();
                $('#rmcls').hide();
            }
            else if (_stageID == 10) {   //**Refer To CRM  to move to the CRM Remarks**\\
                $('#lnkCRMRemarks').show();
                // Get the value from the hidden field
                var roleIDs = $('#hdnLoginUserRoleID').val();
                // Convert the value into an array of numbers (handles comma-separated or JSON)
                var roleArray = [];
                if (roleIDs) {
                    try {
                        // If it's JSON (like [13,56,17])
                        roleArray = JSON.parse(roleIDs);
                    } catch (e) {
                        // If it's comma-separated (like "13,56,17")
                        roleArray = roleIDs.split(',').map(function (r) { return parseInt(r.trim()); });
                    }
                }
                // Check for required conditions:
                // - Contains 56 
                // - Does NOT contain 13 
                // - Does NOT contain 17 
                if (roleArray.includes(56) && !roleArray.includes(13) && !roleArray.includes(17)) {
                    $('#lnkReferCRM').hide();
                } else {
                    $('#lnkReferCRM').show();
                }
                //$('#lnkReferCRM').show();
                $("#ReferToCRMhide").hide();
            }
            else {
                DialogErrorMessage('The claim can not be processed further.');
            }

            //$('#lnkAdjudication').on('click', function () {
            //    $('#divAdjudication').show();
            //    $('#btnBillCalculator').show();
            //});
            //$('#lnkAudit').on('click', function () {
            //    $('#divAudit').show();
            //   // $('#btnBillCalculator').show();
            //});

            //SP3v-3049,3050(For GoDIGit(31) & ITGI(10) ) In case stageID in From CRM(38),For Adjudication(5) then hide the Refer to Insuere 
            // If the stageID is Audit Return i.e. 28 then show the Refer to Insurer
            //As per the current development on 18 Oct 23, BA Promod added new requirment that, we need not to hide te ReferTOInsuer option at any stage ID
            //var ReferToInsurerIssueIds = $('#hdnReferToInsurerIssueIds').val() != '' ? $('#hdnReferToInsurerIssueIds').val() : '';;
            //var ids = ReferToInsurerIssueIds.split(/\s*,\s*/);
            //var isContained = ids.indexOf(basicData[0].IssueID.toString()) > -1;
            //if (isContained) {
            //    if (_stageID == 5 || _stageID == 38) {
            //        $('#lnkRefertoInsurer').hide();
            //    }
            //    if (_stageID == 28) {
            //        $('#lnkRefertoInsurer').show();
            //    }
            //}

            $('#lnkNeftBounceQuery').on('click', function () {
                $('#divNeftBouncedQuery').show();
            })


            $('#lnkNeftBounceQueryResponse').on('click', function () {
                $('#divNeftBouncedQueryResponse').show();
                BindDropdown(MasterData.Mst_AccountType, "ddlNBREnrollment_AccountType");
            })

            if (basicData[0].IssueID == 10) {
                if (_stageID == 5 || _stageID == 28 || _stageID == 38) {
                    if (basicData[0].ITGIinsurerresponse == "Auth Approved") {
                        $('#lnkQueryPending').hide();
                        $('#lnkInvestigation').hide();
                        $('#lnkRefertoInsurer').hide();
                        $('#lnkReferCRM').hide();
                        $('#btnBillCalculator').attr('disabled', true);
                        $('#lnkAdjudication').show();
                        $('#btnApprove').show();
                        $('#btnReject').attr('disabled', true);
                        $('#btnRejectAll').attr('disabled', true);
                        $('#lnkPreauthCancel').attr('disabled', true);
                    }
                    else if (basicData[0].ITGIinsurerresponse == "Auth Denied" || basicData[0].ITGIinsurerresponse.includes("Claim Repudiated")) {
                        $('#lnkQueryPending').hide();
                        $('#lnkInvestigation').hide();
                        $('#lnkRefertoInsurer').hide();
                        $('#lnkReferCRM').hide();
                        $('#btnBillCalculator').show();
                        $('#lnkPreauthCancel').attr('disabled', true);
                        $('#btnApprove').attr('disabled', true);
                        $('#btnRejectAll').show('disabled', true);
                        $('#lnkAdjudication').show();
                        $('#btnReject').show();
                        // isbillcalculated = true;
                    }
                    else if (basicData[0].ITGIinsurerresponse.includes("Claim in query")) {
                        $('#lnkInvestigation').show();
                        $('#lnkAdjudication').show();
                        $('#lnkQueryPending').show();
                        $('#lnkRefertoInsurer').show();
                        $('#lnkReferCRM').show();
                        $('#divAdjudicationFinalButtons').hide();
                    }
                    else {
                        if ($('#hdnClaimTypeID').val() == 1 && (($('#hdnRequestTypeID').val() == 1) || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3))
                            $('#divAdjudicationFinalButtons').hide();
                        else {
                            $('#btnApprove').show();
                            $('#btnReject').attr('disabled', true);
                            $('#btnRejectAll').attr('disabled', true);
                        }
                    }
                }
                else if (_stageID == 24 && basicData[0].ITGIinsurerresponse == "Auth Approved") {
                    if ($('#hdnClaimTypeID').val() == 1 && (($('#hdnRequestTypeID').val() == 1) || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3))
                        $('#btnReProcessBillAmt').attr('disabled', true);
                }
                else if (_stageID == 29) { //need to discuss
                    if ($('#hdnClaimTypeID').val() == 1 && (($('#hdnRequestTypeID').val() == 1) || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3))
                        $('#lnkPreauthCancel').attr('disabled', true);
                }
            };

            if (basicData[0].Isrefertoinsurer == true && (_stageID == 5 || _stageID == 28 || _stageID == 38)) {
                $('#lnkRefertoInsurer').hide();
            }

            //SP3V-5184 START
            if (basicData[0].Isrefertoinsurer == true && (_stageID == 5 || _stageID == 28 || _stageID == 38)) {
                if ($("#hdnisLegalCase").val() == "True" || (basicData[0].RequestTypeID == 1 || basicData[0].RequestTypeID == 2 || basicData[0].RequestTypeID == 3)) {
                    $('#lnkRefertoInsurer').show();
                }
                else {
                    $('#lnkRefertoInsurer').hide();
                }

            }

            //SP3V-5184 END
        }
    }
    else {
        MultipleMsgsValidateDialog(_valmsgs);
    }

    //SP3V-2595
    //debugger;
    var BOBcorporateIDList = $('#hdnValidateBOBPolicies').val() != '' ? $('#hdnValidateBOBPolicies').val().split(',') : '';
    var CorporateID = $("#hdnCorporateID").val();
    var index = BOBcorporateIDList.indexOf(CorporateID);
    if ((parseInt($('#hdnClaimStageID').val()) == 5 || parseInt($('#hdnClaimStageID').val()) == 38 || parseInt($('#hdnClaimStageID').val()) == 28 || parseInt($('#hdnClaimStageID').val()) == 24) && index >= 0)
        $('#divForAdjudicator').show();
    else
        $('#divForAdjudicator').hide();
    //SP3V-2595
}
//Abhishek Jira SP3V-1899 In case if claim is send to Insurer, manual process is stoped for that claim
function WaintingForInsurerResponse() {
    DialogWarningMessage('This claim has been pushed for insurer approval. Awaiting for Response.');
}
/* Settlement Saving */
function Bind_BasicSettlementDetails() {
    var BasicData = [];
    BasicData = $.parseJSON($("#hdnBasicLoadData").val());
    $('#txtSettlement_PayeeName').val(BasicData[0].PayeeName);
    $('#txtSettlement_BankName').val(BasicData[0].BankName);
    if ($('#hdnInsuranceCompanyID').val() === "14") {
        Maskvalue("#txtSettlement_AccountNumber", BasicData[0].BankAccountNo, 1);
    }
    else {
        $('#txtSettlement_AccountNumber').val(BasicData[0].BankAccountNo);
    }

    //$('#txtSettlement_IFSCCode').val(BasicData[0].IFSCCode);
    if ($('#hdnInsuranceCompanyID').val() === "14") {
        Maskvalue("#txtSettlement_IFSCCode", BasicData[0].IFSCCode, 1);
    }
    else {
        $('#txtSettlement_IFSCCode').val(BasicData[0].IFSCCode);
    }
    $('#txtSettlement_SettledAmount').val(BasicData[0].Sanctionedamount);
    $('#txtSettlement_TDSAmount').val(BasicData[0].TDSAmount);
    $('#txtSettlement_NetAmount').val(BasicData[0].Netamount);
}

function Save_SettlementDetails() {
    try {
        if (SettlementDetails_Validate()) {
            $('#divErrorMessage').html('');
            var BasicData = [];
            BasicData = $.parseJSON($("#hdnBasicLoadData").val());

            var ClaimDetails = {};
            ClaimDetails.ClaimID = $('#hdnClaimID').val();
            ClaimDetails.SlNo = $('#hdnClaimSlNo').val();
            ClaimDetails.SettledAmount = BasicData[0].Sanctionedamount;
            ClaimDetails.ModeOfPaymentID = $('#ddlSettlement_ModeOfPayment').val();
            ClaimDetails.BankTransactionNo = $('#txtSettlement_ChequeTransactionNo').val();
            ClaimDetails.ChequeDate = $('#txtSettlement_ChequeTransactionDate').val();
            ClaimDetails.BankAccountNo = BasicData[0].BankAccountNo;
            ClaimDetails.BankName = BasicData[0].BankName;
            ClaimDetails.IFSCCode = BasicData[0].IFSCCode;

            var parameters = JSON.stringify(ClaimDetails);

            ajaxGETResonse('/MedicalScrutiny/Save_SettlementDetails', SettlementDetails_Response, SettlementDetails_Response,
                {
                    ClaimDetails: JSON.stringify(ClaimDetails), PolicyType: $('#hdnPolicyTypeID').val(),
                    MainMemberPolicyID: $('#hdnMemberPolicyID').val(), PolicyID: $('#hdnPolicyID').val(), ProviderID: $('#hdnProviderID').val(),
                    BrokerID: $('#hdnBrokerID').val(), PayerID: $('#hdnPayerID').val(), CorporateID: $('#hdnCorporateID').val(),
                    InsuranceCompanyID: $('#hdnInsuranceCompanyID').val(), AgentID: $('#hdnAgentID').val()
                });
        }

    } catch (e) {
        alert('Error Occured while Insert Patient Details');
    }
}

function SettlementDetails_Response(data) {
    try {
        CheckSessionVariable(data.responseText);
        //if (data.responseText == '')
        //    window.location = '/Claims/Index';
        //else
        //    DialogErrorMessage(data.responseText);
        $('#btnCloseSettlement').click();
        CommonConfirmAjaxDialog(data.responseText, 'Settlement Details Success', returntoCDB, null, 300, 200);

    } catch (e) {
        alert('Error Occured while saving settlement details');
    }
}

function SettlementDetails_Validate() {
    try {
        var _controlFields = [];

        _controlFields.push(['ddlSettlement_ModeOfPayment', 'Please Select Mode of Payment']);
        _controlFields.push(['txtSettlement_ChequeTransactionNo', 'Please Enter Check or Transaction Number']);
        _controlFields.push(['txtSettlement_ChequeTransactionDate', 'Please Enter Cheque or Transaction Date']);

        return CustomFiledsValidate(_controlFields, 'divErrorMessage');

    } catch (e) {
        alert('Error Occured while Validating Settlement Details');
    }
}

function StagewiseDisable_Buttons(_stageID) {
    if (_stageID != null || _stageID != '') {
        if (_stageID != 4 && _stageID != 5 && _stageID != 24 && _stageID != 28 && _stageID != 38) {
            $('#btnSaveReceivedPatientDetails,#btnSaveReceivedPatientDetails1,#btnHospDetailsSave,#btnServiceBillDetailsSave,#btnCodingDetails,#btnSavePastHistory').remove();

            $('#btnIndividual_71,#btnIndividual_73,#btnFloated_71,#btnFloated_73').remove();
        }

        if (_stageID == 5) {
            $('#DMSDocView').show();
            $('#DMSAddDoc').show();
            $('#DMSUpdateClass').show();
            $('#DMSAnnotation').show();
        }
        //else if (_stageID == 5 || _stageID==7|| _stageID==8|| _stageID==30|| _stageID==31|| _stageID==32|| _stageID==33|| _stageID==34|| _stageID==35
        //    || _stageID == 36 || _stageID == 37 || _stageID == 12 || _stageID == 13 || _stageID == 14 || _stageID == 18 || _stageID == 20) {
        //    $('#DMSDocView').show();
        //    $('#DMSAddDoc').show();            
        //}       
    }
}

function ResendCommunication(commId) {
    if (commId != null && commId != '' && commId != undefined && commId != '0') {
        $('input[name="checktt"]').removeAttr("disabled");
        $('input[type="text"]').removeAttr("disabled");
        $('input[type="button"], button').prop('disabled', false);
        $('#lblTo,#lblcc,#lblbcc,#lblTo1,#lblcc1,#lblbcc1,#lblTo2,#lblTo3').prop("disabled", false)
        if (commId != null && commId != '' && commId != undefined && commId != '0') {
            $("#divResndNotify").css({ "display": "block", "position": "absolute", "width": "100%", "height": "100%", "padding-top": "300px", "z-index": "1000", "background": "#000", "background": "rgba(0,0,0,0.75)" });
            $('#divResndNotify').show();
            $('input[name="checktt"]').prop('checked', false);
            RsendId = commId;
            for (var i = 0; i < Rese.length; i++) {
                if (commId == Rese[i].ID) {
                    if (Rese[i].CommMode_P23 == 86) { //Email communication
                        Comm_MId = Rese[i].CommMode_P23;
                        $('#EmailDiv,#EmailDiv1').show();
                        $('#MobileDiv,#MobileDiv1').hide();
                        $('#lblTo').text(Rese[i].SentTo);
                        $('#lblcc').text(Rese[i].SentCC);
                        $('#lblbcc').text(Rese[i].SentBCC);

                        break;
                    }
                    else {
                        Comm_MId = Rese[i].CommMode_P23;
                        $('#EmailDiv,#EmailDiv1').hide(); //Mobile communication
                        $('#MobileDiv,#MobileDiv1').show();
                        $('#lblTo2').text(Rese[i].SentTo);
                        $('#lblcc2').text(Rese[i].SentCC);
                        $('#lblbcc2').text(Rese[i].SentBCC);
                        break;

                    }

                }
                else {
                    $('#lblTo').text('');
                    $('#lblcc').text('');
                    $('#lblbcc').text('');
                }
            }

            //CommonDialog_WithParameter('Do you want to resend communication?', 'Resend Communication', ResendCommunicationResult, null, 400, 200, commId);
        }
    }
}

//$('#ResendCommu').on('click', function () {
function ResendCommu() {
    $('#resendbtn').removeAttr("disabled", true);
    Comm_MId;
    var checkboxes = $('input[name="checktt"]');
    var cHeckedcomm = checkboxes.filter(":checked");
    if (cHeckedcomm.length == 0) {
        DialogResultMessage("Please check Atleast one checkbox");
        return false;
    }
    var SentTo = '';
    var Cc = null;
    var Bcc = null;
    //  else {
    if (Comm_MId == 86) {
        if (cHeckedcomm["0"].value == 1) {
            SentTo = $('#lblTo').text();
            Cc = $('#lblcc').text();
            Bcc = $('#lblbcc').text();
        }
        else {
            SentTo = $('#lblTo1').text();
            Cc = $('#lblcc1').text();
            Bcc = $('#lblbcc1').text();
        }
    }
    else if (Comm_MId == 158) {
        if (cHeckedcomm["0"].value == 1) {
            SentTo = $('#lblTo2').text();
            Cc = null;
            Bcc = null;
        }
        else {
            SentTo = $('#lblTo3').text();
            Cc = null;
            Bcc = null;
        }
    }
    else {
        DialogResultMessage("Please check Atleast one checkbox");
    }
    if ((SentTo == "" && Cc == "" && Bcc == "" || SentTo == null && Cc == null && Bcc == null) && Comm_MId == 86) {
        DialogErrorMessage("We cannot process your request,please add atleast one value.")
        return false;
    } else if ((SentTo == "" || SentTo == null) && Comm_MId == 158) {
        DialogErrorMessage("We cannot process your request,please add  value.")
        return false;
    }
    else {
        $('input[name="' + "checktt" + '"]').prop('checked', false);
        ResendCommunicationResult(RsendId, SentTo, Cc, Bcc);
    }
    //alert(RsendId + ',' +Comm_MId);
}

function AddFieldscomm(txtid, lblid) {
    var TT = $('#' + lblid).text();
    var EM = $('#' + txtid).val();
    if (Comm_MId == 86) {
        if (!($('#' + txtid).val()).match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i)) {
            DialogResultMessage("Please enter valid email");
            $('#' + txtid).val('');
            return false;
        }
        else {
            if (TT.length > 0) {
                var CC = $('#' + lblid).text(TT + "," + $('#' + txtid).val());
                $('#' + txtid).val('');
            } else {
                var CC = $('#' + lblid).text($('#' + txtid).val());
                $('#' + txtid).val('');
            }
        }
    }
    else {
        if (EM.length < 10) {
            DialogResultMessage("Please enter valid Mobile number.");
            $('#' + txtid).val('');
            return;

        }
        else {
            if (TT.length > 0) {
                CC = $('#' + lblid).text(TT + "," + $('#' + txtid).val());
                $('#' + txtid).val('');
            }
            else {
                CC = $('#' + lblid).text($('#' + txtid).val());
                $('#' + txtid).val('');
            }
            // CommonDialog_WithParameter('Do you want to resend communication?', 'Resend Communication', ResendCommunicationResult, null, 400, 200, commId);
        }
    }
    $('#' + txtid).val('');
    // CommonDialog_WithParameter('Do you want to resend communication?', 'Resend Communication', ResendCommunicationResult, null, 400, 200, commId);
}

function ResendCommunicationResult(commId, SentTo, Cc, Bcc) {
    try {
        $('#divErrorMessage').html('');
        $('#progress').show();
        $.ajax({
            url: '/MedicalScrutiny/ClaimCommunication_Resend',
            type: "POST",
            data: {
                ID: commId, ClaimID: $('#hdnClaimID').val(), SlNo: $('#hdnClaimSlNo').val(), SentTo: SentTo, SentCC: Cc, SentBCC: Bcc
            },
            success: function (result) {
                CheckSessionVariable(result);
                var data1 = $.parseJSON(result);
                Bind_Communications(data1);
                DialogResultMessage('Communication Resend successfully');
                $('#progress').hide();
                $('#resendbtn').removeAttr("disabled", false);
            },
            error: function () {
                DialogErrorMessage('Error Occured while Resend Communication');
                $('#progress').hide();
                $('#resendbtn').removeAttr("disabled", false);
            }
        });

    } catch (e) {
        $('#progress').hide();
        alert('Error Occured while Resend Communication');
    }
}

function DMSDocument_Add(claimID, slno, claimsInwardReqId, isClaimProcessedByCI) {
    try {
        if (isClaimProcessedByCI == 1) {
            if ($('#hdnAppLive').val() == 'TRUE') {
                if ($('#hdnAppURL').val().toUpperCase().match('SPECTRA.FHPL.NET')) {
                    //window.open('https://vault.fhpl.net:8443/omnidocs/Customisation/Integration/SpectraAddDoc.jsp?strRequestId=' + claimsInwardReqId);
                    window.open('https://vault.fhpl.net:8443/SpectraAddApplication/Customisation/Integration/SpectraAddDoc.jsp?strRequestId=' + claimsInwardReqId);
                }
            }
            else {
                //window.open('https://guest.fhpl.net:8443/omnidocs/Customisation/Integration/SpectraAddDoc.jsp?strRequestId=' + claimsInwardReqId);
                window.open('https://vaultuat.fhpl.net/SpectraAddApplication/Customisation/Integration/SpectraAddDoc.jsp?strRequestId=' + claimsInwardReqId);
            }
        }
        else {
            if ($('#hdnAppLive').val() == 'TRUE') {
                if ($('#hdnAppURL').val().toUpperCase().match('SPECTRA.FHPL.NET')) {
                    //window.open('https://vault.fhpl.net:8443/omnidocs/Customisation/Integration/SpectraAddDoc.jsp?strRequestId=' + claimID + '-' + slno);
                    window.open('https://vault.fhpl.net:8443/SpectraAddApplication/Customisation/Integration/SpectraAddDoc.jsp?strRequestId=' + claimID + '-' + slno);
                }
            }
            else {
                //window.open('https://guest.fhpl.net:8443/omnidocs/Customisation/Integration/SpectraAddDoc.jsp?strRequestId=' + claimID + '-' + slno);
                window.open('https://vaultuat.fhpl.net/SpectraAddApplication/Customisation/Integration/SpectraAddDoc.jsp?strRequestId=' + claimID + '-' + slno);
            }
        }
    } catch (e) {
        alert('Error occured while add DMS document');
    }
}

function DMSDocument_UpdateDataClass(claimID, slno, claimsInwardReqId, isClaimProcessedByCI) {
    try {
        if (isClaimProcessedByCI == 1) {
            if ($('#hdnAppLive').val() == 'TRUE') {
                if ($('#hdnAppURL').val().toUpperCase().match('SPECTRA.FHPL.NET')) {
                    //window.open('https://vault.fhpl.net:8443/omnidocs/Customisation/Integration/Updatedataclass.jsp?RequestId=' + claimsInwardReqId);
                    window.open('https://vault.fhpl.net:8443/SpectraAddApplication/Customisation/Integration/Updatedataclass.jsp?RequestId=' + claimsInwardReqId);
                }
            }
            else {
                //window.open('https://guest.fhpl.net:8443/omnidocs/Customisation/Integration/Updatedataclass.jsp?RequestId=' + claimsInwardReqId);
                window.open('https://vaultuat.fhpl.net/SpectraAddApplication/Customisation/Integration/Updatedataclass.jsp?RequestId=' + claimsInwardReqId);
            }
        }
        else {
            if ($('#hdnAppLive').val() == 'TRUE') {
                if ($('#hdnAppURL').val().toUpperCase().match('SPECTRA.FHPL.NET')) {
                    //window.open('https://vault.fhpl.net:8443/omnidocs/Customisation/Integration/Updatedataclass.jsp?RequestId=' + claimID + '-' + slno);
                    window.open('https://vault.fhpl.net:8443/SpectraAddApplication/Customisation/Integration/Updatedataclass.jsp?RequestId=' + claimID + '-' + slno);
                }
            }
            else {
                window.open('https://vaultuat.fhpl.net/SpectraAddApplication/Customisation/Integration/Updatedataclass.jsp?RequestId=' + claimID + '-' + slno);
            }
        }
    } catch (e) {
        alert('Error occured while open DMS document');
    }
}
function insertDMSlog(claimID, slno) {
    try {
        if (claimID != '' && claimID != null && slno != '' && slno != null) {
            $.ajax({
                url: "/MedicalScrutiny/insertDMSlog",
                contentType: 'application/json;charset=utf-8',
                data: { claimID: claimID, slno: slno },
                success: function (data) {
                }
            });
        }
    }
    catch (e) {
        alert('Error occured while open DMS document');
    }
}
function DMSOMNIDocument_ViewDownload(claimID, slno, InsurerID) {
    try {
        var InsurerName = '';
        if (InsurerID == 21)
            InsurerName = 'TAGIC';
        else if (InsurerID == 20)
            InsurerName = 'KOTAK';
        else if (InsurerID == 24)
            InsurerName = 'MAGMA';
        else if (InsurerID == 25)
            InsurerName = 'DHFL';
        else if (InsurerID == 26)
            InsurerName = 'CIGNA';
        else if (InsurerID == 2)
            InsurerName = 'BAXA';
        else if (InsurerID == 27)
            InsurerName = 'CHOLA';
        else if (InsurerID == 28)
            InsurerName = 'ABSLI';
        else if (InsurerID == 29)
            InsurerName = 'EGICL';
        else if (InsurerID == 6)
            InsurerName = 'NIC';
        else if (InsurerID == 9)
            InsurerName = 'RGICL';
        if ($('#hdnAppLive').val() == 'TRUE') {
            if ($('#hdnAppURL').val().toUpperCase().match('SPECTRA.FHPL.NET')) {
                insertDMSlog(claimID, slno);
                try {
                    //var appUrl = window.opener.location.href;
                    if (window.opener.location.href.toUpperCase().indexOf('CLAIMS/INDEX') > 1) {
                        if (window.opener.windowDMSDocView != undefined) {
                            window.opener.windowDMSDocView.close();
                        }
                        //window.opener.windowDMSDocView = window.open('https://vault.fhpl.net:8443/omnidocs/integration/foldView/viewFoldList.jsp?Application=Doc_View&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&S=S&sessionIndexSet=false');
                        window.opener.windowDMSDocView = window.open('https://vault.fhpl.net:8443/omnidocs/WebApiRequestRedirection?Application=Doc_View&cabinetName=fhplclaim&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&DC.RequestId=&sessionIndexSet=false&S=S');
                    }
                    if (window.opener.location.href.toUpperCase().indexOf('SEARCH/INDEX') > 1) {
                        if (window.opener.windowDMSDocView != undefined) {
                            window.opener.windowDMSDocView.close();
                        }
                        //window.opener.windowDMSDocView = window.open('https://vault.fhpl.net:8443/omnidocs/integration/foldView/viewFoldList.jsp?Application=Doc_View&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&S=S&sessionIndexSet=false');
                        window.opener.windowDMSDocView = window.open('https://vault.fhpl.net:8443/omnidocs/WebApiRequestRedirection?Application=Doc_View&cabinetName=fhplclaim&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&DC.RequestId=&sessionIndexSet=false&S=S');
                    }
                }
                catch (error) {
                    if (window.parent.windowDMSDocView != undefined) {
                        window.parent.windowDMSDocView.close();
                    }
                    //window.parent.windowDMSDocView = window.open('https://vault.fhpl.net:8443/omnidocs/integration/foldView/viewFoldList.jsp?Application=Doc_View&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&S=S&sessionIndexSet=false');
                    window.parent.windowDMSDocView = window.open('https://vault.fhpl.net:8443/omnidocs/WebApiRequestRedirection?Application=Doc_View&cabinetName=fhplclaim&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&DC.RequestId=&sessionIndexSet=false&S=S');
                }
            }
        }
        else {
            try {
                //var appUrl = window.opener.location.href;
                if (window.opener.location.href.toUpperCase().indexOf('CLAIMS/INDEX') > 1) {
                    if (window.opener.windowDMSDocView != undefined) {
                        window.opener.windowDMSDocView.close();
                    }
                    //window.opener.windowDMSDocView = window.open('https://guest.fhpl.net:8443/omnidocs/integration/foldView/viewFoldList.jsp?Application=Doc_View&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&S=S&sessionIndexSet=false');
                    window.opener.windowDMSDocView = window.open('https://vaultuat.fhpl.net/omnidocs/WebApiRequestRedirection?Application=Doc_View&cabinetName=fhplclaim&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&DC.RequestId=&sessionIndexSet=false&S=S');
                }
                if (window.opener.location.href.toUpperCase().indexOf('SEARCH/INDEX') > 1) {
                    if (window.opener.windowDMSDocView != undefined) {
                        window.opener.windowDMSDocView.close();
                    }
                    //window.opener.windowDMSDocView = window.open('https://guest.fhpl.net:8443/omnidocs/integration/foldView/viewFoldList.jsp?Application=Doc_View&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&S=S&sessionIndexSet=false');
                    window.opener.windowDMSDocView = window.open('https://vaultuat.fhpl.net/omnidocs/WebApiRequestRedirection?Application=Doc_View&cabinetName=fhplclaim&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&DC.RequestId=&sessionIndexSet=false&S=S');
                }
            }
            catch (error) {
                if (window.parent.windowDMSDocView != undefined) {
                    window.parent.windowDMSDocView.close();
                }
                //window.parent.windowDMSDocView = window.open('https://guest.fhpl.net:8443/omnidocs/integration/foldView/viewFoldList.jsp?Application=Doc_View&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&S=S&sessionIndexSet=false');
                window.parent.windowDMSDocView = window.open('https://vaultuat.fhpl.net/omnidocs/WebApiRequestRedirection?Application=Doc_View&cabinetName=fhplclaim&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&DC.RequestId=&sessionIndexSet=false&S=S');
            }
        }
    } catch (e) {
        alert('Error occured while open DMS document');
    }

}

function DMSOMNIDocument_Annotations(claimID, slno, InsurerID) {
    try {
        var InsurerName = '';
        if (InsurerID == 21)
            InsurerName = 'TAGIC';
        else if (InsurerID == 20)
            InsurerName = 'KOTAK';
        else if (InsurerID == 24)
            InsurerName = 'MAGMA';
        else if (InsurerID == 25)
            InsurerName = 'DHFL';
        else if (InsurerID == 26)
            InsurerName = 'CIGNA';
        else if (InsurerID == 2)
            InsurerName = 'BAXA';
        else if (InsurerID == 27)
            InsurerName = 'CHOLA';
        else if (InsurerID == 28)
            InsurerName = 'ABSLI';
        else if (InsurerID == 29)
            InsurerName = 'EGICL';
        else if (InsurerID == 6)
            InsurerName = 'NIC';
        else if (InsurerID == 9)
            InsurerName = 'RGICL';
        if ($('#hdnAppLive').val() == 'TRUE') {
            if ($('#hdnAppURL').val().toUpperCase().match('SPECTRA.FHPL.NET')) {
                if (window.parent.windowDMSDocView != undefined) {
                    window.parent.windowDMSDocView.close();
                }
                //window.parent.windowDMSDocView = window.open('https://vault.fhpl.net:8443/omnidocs/integration/foldView/viewFoldList.jsp?Application=Doc_Annotate&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&S=S&sessionIndexSet=false');
                window.parent.windowDMSDocView = window.open('https://vault.fhpl.net:8443/omnidocs/WebApiRequestRedirection?Application=Doc_Annotate&cabinetName=fhplclaim&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&DC.RequestId=&sessionIndexSet=false&S=S');
            }
        }
        else {
            if (window.parent.windowDMSDocView != undefined) {
                window.parent.windowDMSDocView.close();
            }
            //window.parent.windowDMSDocView = window.open('https://guest.fhpl.net:8443/omnidocs/integration/foldView/viewFoldList.jsp?Application=Doc_Annotate&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&S=S&sessionIndexSet=false');
            window.parent.windowDMSDocView = window.open('https://vaultuat.fhpl.net/omnidocs/WebApiRequestRedirection?Application=Doc_Annotate&cabinetName=fhplclaim&DataClassName=Claim_Archive&DC.ClaimId=' + claimID + '-' + slno + '&DC.InsurerName=' + InsurerName + '&DC.RequestId=&sessionIndexSet=false&S=S');
        }

    } catch (e) {
        alert('Error occured while open DMS document');
    }
}

function DMSDocument_ViewDownload() {
    window.open($("#hdnNextGenViewerUrl").val());
}

function DMSDocument_Annotations() {
    window.open($("#hdnNextGenAnnotationUrl").val());
}

function DisplayDoctorRemarks() {
    var BasicData = [];
    BasicData = $.parseJSON($("#hdnBasicLoadData").val());
    if (BasicData[0].DoctorNotes == null || BasicData[0].DoctorNotes == "") {
        var ct = 'Medical Management';
        var codingDetails = $('#hdnClaimsCodingDetails').val() != "" ? $.parseJSON($('#hdnClaimsCodingDetails').val()) : [];
        if (codingDetails.length > 0) {

            $.each(codingDetails, function (i, item) {
                if (item.TreatementTypeID_19 == 66) {
                    ct = 'Surgical Management';
                }
            });
        }
        var roomrentcharge = ''; var icucharge = '';
        // var billDetails = $('#hdnBillDetails').val() != "" ? $.parseJSON($('#hdnBillDetails').val()) : [];
        var billDetails = MasterData.ServiceData != "" ? $.parseJSON(MasterData.ServiceData) : [];

        if (billDetails.length > 0) {
            $.each(billDetails, function (i, item) {
                if (item.ServiceID == 2) {
                    icucharge = item.EligibleAmount;
                } else
                    if (item.ServiceID == 3) {
                        roomrentcharge = item.EligibleAmount;
                    }
            });
        }
        var remarks = 'Covered for ' + ct + '.';// Room Rent restricted to <<RoomRentEligibility>>. ICU Charges restricted to <<ICUEligibility>>;';
        if (roomrentcharge != '')
            remarks = remarks + ' Room Rent restricted to ' + roomrentcharge + '.';
        if (icucharge != '')
            remarks = remarks + ' ICU Charges restricted to ' + icucharge + '.';
        $('#txtDoctorRemarks').val('');
        $('#txtDoctorRemarks').val(remarks);
        $("#txtTopupDoctorRemarks").val(remarks);
        $("#hdnTopUpDocRemarks").val(remarks);
    } else {
        $('#txtDoctorRemarks').val(BasicData[0].DoctorNotes);
        $("#txtTopupDoctorRemarks").val(BasicData[0].DoctorNotes);
        $("#hdnTopUpDocRemarks").val(BasicData[0].DoctorNotes);
    }

    $('#txtAdditionalRemarks').text(BasicData[0].AdditionalRemarks);

    $('#txtMemberNotes').text(BasicData[0].Notes);
    $('#txtMemberRemarks').text(BasicData[0].Remarks);
    $('#txtMemberPortabilityNotes').text(BasicData[0].PortabilityNotes);

    //if ($('#txtDoctorRemarks').text() == "" || $('#txtDoctorRemarks').text() == null)
    //    $('#txtDoctorRemarks').text(remarks);
    // alert(2);
}

function PrintDivContent(divId) {
    var printContent = document.getElementById(divId);
    var WinPrint = window.open('', '', 'left=0,top=0,toolbar=0,sta­tus=0');
    WinPrint.document.write(printContent.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
}

function IsCRMRole() {
    var res = false;
    var sid = $('#hdnClaimStageID').val();
    var crmsids = [7, 8, 30, 31, 32, 33, 34, 35, 36, 37];
    $.each(crmsids, function (i, item) {
        if (item == sid) {
            res = true;
        }
    });
    return res;
}

function IRClose_Insert() {

    var _claimdetails = {};
    _claimdetails["ClaimID"] = $('#hdnClaimID').val();
    _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
    _claimdetails["Remarks"] = $('#taIRCloseRemarks').val();
    _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
    _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
    _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
    _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
    _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();
    _claimdetails["PolicyType"] = $("#hdnPolicyTypeID").val();
    _claimdetails["IssueID"] = $("#hdnInsuranceCompanyID").val();

    _claimdetails["MainMemberPolicyID"] = $("#hdnMainMemberPolicyID").val();
    _claimdetails["PolicyID"] = $("#hdnPolicyID").val();
    _claimdetails["ProviderID"] = $("#hdnProviderID").val();
    _claimdetails["BrokerID"] = $("#hdnBrokerID").val();
    _claimdetails["CorporateID"] = $("#hdnCorporateID").val();
    _claimdetails["PayerID"] = $("#hdnPayerID").val();
    _claimdetails["ClaimsStageID"] = $("#hdnStageID").val();
    _claimdetails["AgentID"] = $("#hdnAgentID").val();

    $.ajax({
        //type: "POST",
        url: "/MedicalScrutiny/IRClose_Insert",
        contentType: 'application/json;charset=utf-8',
        //processData: false,
        data: { ClaimDetails: JSON.stringify(_claimdetails) },
        success: function (data) {
            CheckSessionVariable(data.responseText);
            DialogResultMessage(data);
            window.location = '/Claims/Index';
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
}

function Treatmenttypechange(treatmenttype) {
    var TreatmentType = $('#ddlTreatmentType option:selected').val();
    if (TreatmentType != '0') {
        if (TreatmentType == "65") {
            $("#ddlPackageType").val(4);
        }
        LoadTPAProcedures(0, "#ddlProcedureLevel1");
    }
    else {
        $("#ddlProcedureLevel1 :gt(0)").remove();
        //$('#ddlProcedureLevel1 option:gt(0)').remove();
    }
}

function StarHealthConfirmationYes() {
    Star_Healthconfirm = "1";
    Check_OpenActionItems(22);
}

/* Check open action items */
function Check_OpenActionItems(_stageID) {

    if (basicData[0].IssueID == "32" && $("#hdnClaimStageID").val() == "5" && $("#hdnRequestTypeID").val() == "1" && Star_Healthconfirm == "0") {
        CommonConfirmAjaxDialog_billing('Is Employee declaration received?', 'Employee Confirmation', StarHealthConfirmationYes, null);
        return false;
    }
    if (isproportionatechanged == true) {
        DialogWarningMessage("As you override proportionate, first save bill details and then approve");
        createnewtop = 0;
        return false;
    }

    if (($("#hdnRequestTypeID").val() == 3 || basicData[0].IsFinal == true || $('#IsFinal_radio_yes').is(':checked') == true) && ParexelcorporateIDs.includes($("#hdnCorporateID").val()) && $("#hdnClaimStageID").val() == 5) {
        if ($("#txtpatienttobepaid").val() == '') {
            DialogWarningMessage("Amount to be paid by the Insured is Mandatory for this Corporate at Bill Calucation Section ");
            $("#txtpatienttobepaid").focus();
            $("#litxtPatienttobepaid").css("background-color", "yellow").fadeOut(200).fadeIn(200);
            return false;
        }
    }

    //SP3V-1423 START
    var Uhidno = $("#hplSystemPatient_PatientUHID").text();
    var claimid = $('#hdnClaimID').val();
    var slno = $('#hdnClaimSlNo').val();
    var multiplematernity = false;
    var procdureDetails = [];
    if ($('#hdnClaimsCodingDetails').val() != '') {
        procdureDetails = $.parseJSON($('#hdnClaimsCodingDetails').val());
        $.each(procdureDetails, function (i, coding) {
            if (coding.TPALevel2 == "402" || coding.TPALevel2 == "406" || coding.TPALevel2 == "409" || coding.TPALevel2 == "418") {
                var value = $("#hdnCheckMultipleMaternity").val();
                if (value == "0") {
                    multiplematernity = true;
                }
            }
        });
    }
    if (multiplematernity == true) {
        alert('Maternity related claim has been utilized previously. Please check remaining maternity sublimit before processing further.');
        // return false;
    }
    //SP3V-1423 END

    //SP3V-1611 - Leena
    if (_ValidateDeductibleAmt == true) {
        DialogWarningMessage('Modified deductible amount is greater than the total claimed amount.Can not Approve!');
        createnewtop = 0;
        return false;
    }
    if (_grosspayableAmt < $("#txtModularAmt").val()) {
        DialogResultMessage("Modular amount should be less than sanctioned amount");
        createnewtop = 0;
        return false;
    }
    //End SP3V-1611
    //SP3V-1697 Leena
    var InsurerId = $('#hdnInsuranceCompanyID').val();
    var _ClaimTypeID = $('#hdnClaimTypeID').val();
    var _RequestTypeID = $("#hdnRequestTypeID").val();

    var DischargeTypeId = '';
    if ((InsurerId == 5) && ((_RequestTypeID != 1) && (_RequestTypeID != 2) && (_RequestTypeID != 3))) {
        if ($('#ddlDischargeType').val() != '') {
            DischargeTypeId = $('#ddlDischargeType').val();
        }

        if ((DischargeTypeId == '0' || DischargeTypeId == null || DischargeTypeId == '' || DischargeTypeId == 'undefiened')) {
            DialogResultMessage("Please Select Discharge Type.");
            createnewtop = 0;
            return false;
        }
    }
    if (isBufferRulesConfigured($("#hdnBPSIID").val())) {
        if (_excessSuminsured > 0 && basicData[0].PreTopupslno != 0 && basicData[0].Topupslno == 0 && $("#hdnNo").val() == 'true') {
            DialogWarningMessage('Topup claim creation mandatory for this claim.');
            createnewtop = 0;
            return false;
        }
    }
    //else {
    //    if (_excessSuminsured > 0 && basicData[0].PreTopupslno != 0 && basicData[0].Topupslno == 0) {
    //        DialogWarningMessage('Topup claim creation mandatory for this claim.');
    //        createnewtop = 0;
    //        return false;
    //    }
    //}

    //END SP3V-1697 Leena
    if ($('#hdnClaimID').val() != null) {
        //SP3V-994-LEENA----------------
        var IsSuspiciousPolicy = $("#hdnIsSuspiciousPolicy").val();

        //_stageID == 5 For Adjudication 22 == Sent for Audit
        if ((_stageID == 22) && (IsSuspiciousPolicy == "true")) {
            DialogWarningMessage('Suspicious Policy! Please contact Enrolment team for support.');
            createnewtop = 0;
            return false;
        }

        //END SP3V-994------------------
        if (IsGipsaPpnCity == true) {
            DialogWarningMessage('YOU CANNOT APPROVE THIS CLAIM! NO CASHLESS FACILITY IN NON-PPN HOSPITAL IN PPN CITIES FOR ALL PSU RETAILS POLICIES.');
            createnewtop = 0;
            return false;
        }
        if ($("#hdnInsuranceCompanyID").val() != "30") {
            if ($.trim($("input:radio[name='rdnOptionalCovers']:checked").val()) == "" || $.trim($("input:radio[name='rdnOptionalCovers']:checked").val()) == '') {
                DialogWarningMessage('Member has optional covers. Please verify if the ailment falls under optional covers and select accordingly.');
                createnewtop = 0;
                return false;
            }
        }

        var ID = '';
        var AddedID = '';
        if ($.trim($("input:radio[name='rdnOptionalCovers']:checked").val()) == "1") {
            $('.chk').each(function (i, obj) {
                if ($(this).prop('checked') == true) {
                    ID = ID + $(this).attr('id').split("_")[1] + ',';
                }
            });
            AddedID = ID.split(',').slice(0, -1);
            if (AddedID == '' || AddedID == "") {
                DialogWarningMessage('Select at least one cover and provide amount !');
                createnewtop = 0;
                return false;
            }
            var OptionalCheckedData = $("#hndOptionalCheckedData").val().split(',').slice(0, -1);
            if (AddedID.length != OptionalCheckedData.length) {
                DialogWarningMessage('please Save all selected Optional Covers Once!!');
                createnewtop = 0;
                return false;
            }
        }
        if (basicData[0].IssueID == 10 && basicData[0].isITGImanualapv == 1 && ITGIConfimation == true) {
            alert("Case was not pushed to Insurer through API. Are you sure you want to approve/reject the case manually ?");
            ITGIConfimation = false;
            $('#manualapvcheckbox').show();
            createnewtop = 0;
            return false;
        }
        if (basicData[0].IssueID == 10 && basicData[0].isITGImanualapv == 1 && ($('#manualapvchk').is(':checked') == false)) {
            alert("please check confirmation checkbox to approve claim");
            createnewtop = 0;
            return false;
        }
        if (isclaimwaitingperiod == true && isoverridewaitingperid == false) {
            alert("You cannot approve this claim. Waiting period is applicable as per policy. To approve this claim, Add Override rule");
            createnewtop = 0;
            return false;
        }
        if (isclaimsubmission == true && submissionflag == false) {
            //$('.btnAddManualrule').css("display", "block");
            var element = document.getElementById("rules_ID");
            element.classList.remove("collapsed");
            $('#btnAddManualrule').trigger('click');
            alert("Delayed Submission Clause is applicable. Raise Query seeking clarification for delayed submission and Refer the case to Insurer for approval.");
            createnewtop = 0;
            return false;
        }
        if (isAlimentnotcovered == true && isAlimentoverride == false) {
            alert("You cannot approve this claim. Aliment is not applicable as per policy. To approve this claim, Add Override rule");
            createnewtop = 0;
            return false;
        }

        $.ajax({
            type: "GET",
            url: "/MedicalScrutiny/Check_OpenActionItems",
            contentType: 'application/json;charset=utf-8',
            //processData: false,
            data: { ClaimID: $('#hdnClaimID').val(), slno: $('#hdnClaimSlNo').val() },
            success: function (data) {
                CheckSessionVariable(data);
                data = $.parseJSON(data);

                if (data.ID == 1111) {
                    createnewtop = 0;
                    DialogErrorMessage(data.Message);
                }
                else if (data == 0) {
                    ClaimRules_Insert(_stageID)
                }
                else if (parseInt(data) > 0) {
                    createnewtop = 0;
                    DialogWarningMessage('Some of the stages are not closed. Please check in Audit Trail. System does not allow to authorize the case.');
                }
            },
            error: function (e, x) {
                createnewtop = 0;
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });
    }

}

/* CallCenter Remarks */
function LoadCallCenter_CallDetails() {
    if ($('#tblCallCenterRemarks tbody').children().length == 0) {
        $.ajax({
            //type: "POST",
            url: "/Claims/CallCenterRemarks",
            contentType: 'application/json;charset=utf-8',
            //processData: false,
            data: { ClaimID: $('#hdnClaimID').val(), IsFrmArchived: $('#hdnIsFrmArchived').val() },
            success: function (data) {
                CheckSessionVariable(data);
                data = $.parseJSON(data);

                if (data.ID == 1) {
                    DialogErrorMessage(data.Message);
                }
                else {
                    for (var i = 0; i < data.length; i++) {
                        var tblBody = '<tr><td>' + data[i].CallerName + '</td>'
                            + '<td>' + data[i].MobileNo + '</td>'
                            + '<td>' + data[i].EmailID + '</td>'
                            + '<td>' + data[i].Remarks + '</td>'
                            + '</tr>';
                        $('#tblCallCenterRemarks tbody').append(tblBody);
                    }
                }
            },
            error: function (e, x) {
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });

    }
}

/* Vijitha    clime Consignment */
//$('#Btn_Consignment_Add').click(function (e) {
function AddConsignmentDetails() {
    //debugger
    if ($('#hdnIsFrmArchived').val() == "True") {
        DialogWarningMessage('You can not add consignment details for archival claim.');
        return false;
    }
    var DocumentType = $("#ddlConsignment_DocumentType option:selected").val();
    var Consignment_No = $("#txt_Consignment_No").val();
    var Consignment_Date = $("#txt_Consignment_Date").val();
    var Courier = $("#ddlConsignment_Courier option:selected").val();
    var FreightModeID = $("#ddlConsignment_FreightType option:selected").val();
    var DeliveryStatus = $("#ddlConsignment_DeliveryStatus option:selected").val();


    var ClaimID = $('#hdnClaimID').val();
    var SlNo = $('#hdnClaimSlNo').val();

    var StageID = $('#hdnClaimStageID').val()

    if (DeliveryStatus != "0" && Courier != "0" && Courier != 0 && DocumentType != "0" && FreightModeID != "0" && Consignment_No.trim() != "" && Consignment_Date.trim() != "") {

        $.ajax({
            url: '/MedicalScrutiny/SaveClaimConsignmentDetails',
            type: 'GET',
            data: {
                ClaimID: ClaimID,
                SlNo: SlNo,
                ConsignmentNo: Consignment_No,
                ConsignmentDate: Consignment_Date,
                CourierID: Courier,
                DocumentTypeID: DocumentType,
                ClaimStageID: StageID,
                FreightModeID: FreightModeID,
                DeliveryStatusID: DeliveryStatus

            },
            success: function (data) {
                if (data != "0") {
                    $('#tblConsignmentDetails tbody').html("");
                    LoadClaimConsignmentDetails(ClaimID);
                    alert('Consignment Details Saved Successfully');
                }
                else {
                    alert('Details Not Saved');
                }
            },
            error: function (res) {
                alert('Plroblem while Processing');
            }
        });
    }
    else {

        if (Consignment_No.trim() === "") {
            alert("Please Enter Consignment No");
        }
        else if (Consignment_Date.trim() === "") {
            alert("Please Enter Provider Consignment Date");
        }
        else if (Courier === "0") {
            alert("Please select Courier Company");
        }
        else if (DocumentType == 0) {
            alert("Please Select Document Type");
        }
        else if (FreightModeID == 0) {
            alert("Please Select Freight Mode");
        }
        else if (DeliveryStatus == 0) {
            alert("Please Select Delivery Status");
        }
    }
    //});
}

function LoadClaimConsignmentDetails(_ClaimID) {
    if ($('#tblConsignmentDetails tbody').html() == "") {
        $("#ddlConsignment_Courier option[value='0']").attr("selected", "selected");
        $("#txt_Consignment_branch option[value='0']").attr("selected", "selected");
        $("#ddlConsignment_DocumentType option[value='0']").attr("selected", "selected");
        $("#ddlConsignment_FreightType option[value='0']").attr("selected", "selected");
        $("#ddlConsignment_DeliveryStatus option[value='0']").attr("selected", "selected");

        $("#txt_Consignment_No").val("");
        $("#txt_Consignment_Date").val("");

        //var myDate = new Date();
        //var prettyDate = +myDate.getDate() + '/' + (myDate.getMonth() + 1) + '/' + myDate.getFullYear();        
        //$("#txt_Consignment_Date").val(prettyDate);

        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1;
        curr_month = GetMonthName(curr_month);
        var curr_year = d.getFullYear();

        $("#txt_Consignment_Date").val(curr_date + ' ' + curr_month + ' ' + curr_year);

        $.ajax({
            //type: "POST",
            url: "/MedicalScrutiny/GetClaimConsignmentDetails",
            contentType: 'application/json;charset=utf-8',
            //processData: false,
            data: { ClaimeID: _ClaimID, IsFrmArchived: $('#hdnIsFrmArchived').val() },
            success: function (data) {
                CheckSessionVariable(data);

                data = $.parseJSON(data);

                if (data.ID == 1) {
                    DialogErrorMessage('Unable to Retrieve Data');
                }
                else {

                    var toAppend = "";
                    $.each(data, function (i, Clim) {
                        var Region = getNamepropwithId(Clim.DispatchedBranch, MasterData.Mst_Regions);
                        var Documenttype = getNamepropwithId(Clim.DocumentTypeID, MasterData.Mst_DocumentType);
                        var courier = getNamepropwithId(Clim.CourierID, MasterData.Mst_Courier);

                        if (Clim.CourierID == 6) {
                            courier = Clim.CourierName;
                        }

                        var user = getNamepropwithId(Clim.CreatedOperatorID, MasterData.Mst_Users);
                        var Stage = getNamepropwithId(Clim.ClaimStageID, MasterData.ClaimStage);
                        var FreightMode = getNamepropwithId(Clim.FreightModeID, MasterData.FreightMode);
                        var DeliveryStatus = getNamepropwithId(Clim.DeliveryStatus, MasterData.DeliveryStatus);

                        toAppend += "<tr><td data-title='Claim Stage'>" + Stage + "</td><td data-title='Document Type'>" + Documenttype + "</td><td data-title='Consignment No'>" + Clim.ConsignmentNo + "</td><td data-title='Consignment Date'>" + JSONDate2(Clim.ConsignmentDate) + "</td><td data-title='Courier Company'>" + courier + "</td><td data-title='Freight Mode'>" + FreightMode + "</td><td data-title='Delivery Status'>";
                        if (Clim.DeliveryStatus == 274)
                            toAppend += "<span  class='label label-success arrowed-in arrowed-in-right'>"
                        else if (Clim.DeliveryStatus == 275)
                            toAppend += "<span  class='label label-inverse  arrowed-in arrowed-in-right'>"
                        else if (Clim.DeliveryStatus == 276)
                            toAppend += "<span  class='label label-info arrowed-in arrowed-in-right'>"
                        else if (Clim.DeliveryStatus == 277)
                            toAppend += "<span  class='label label-danger arrowed-in arrowed-in-right'>"
                        else {
                            toAppend += "<span  class='label label-warning arrowed-in arrowed-in-right'>"
                        }

                        toAppend += DeliveryStatus + "</span> </td><td data-title='User-Region'>" + user + "-" + Region + "</td>" + "<tr>";

                    });
                    $('#tblConsignmentDetails tbody').html(toAppend);
                }

            },
            error: function (e, x) {
                ShowResultMessage('ErrorMessage', e.responseText);
            }

        });
    }
}

function EnableConsignmentControls() {
    var _viewStageID = $('#hdnClaimStageID').val();
    if (_viewStageID == 7 || _viewStageID == 8 || _viewStageID == 12 || _viewStageID == 13 || _viewStageID == 14 || _viewStageID == 17 || _viewStageID == 18 || _viewStageID == 19 || _viewStageID == 20
        || _viewStageID == 21 || _viewStageID == 23 || _viewStageID == 24 || _viewStageID == 25 || _viewStageID == 26 || _viewStageID == 27 || _viewStageID == 28 || _viewStageID == 30 || _viewStageID == 31 || _viewStageID == 32 || _viewStageID == 33 || _viewStageID == 34
        || _viewStageID == 35 || _viewStageID == 36 || _viewStageID == 37 || _viewStageID == 38) {
        $('#ddlConsignment_DocumentType').removeAttr("disabled", false);
        $('#txt_Consignment_No').removeAttr("disabled", false);
        //$('#txt_Consignment_Date').removeAttr("disabled", false);
        $('#ddlConsignment_Courier').removeAttr("disabled", false);
        $('#ddlConsignment_FreightType').removeAttr("disabled", false);
        $('#ddlConsignment_DeliveryStatus').removeAttr("disabled", false);
        $('#Btn_Consignment_Add').removeAttr("disabled", false);
    }
}

/* Check open action items */
function PreauthCancel(_stageID) {
    if (CheckIsValidProvider()) {
        if ($('#hdnClaimID').val() != null) {
            if ($('#taPreauthCancel').val() == '') {
                alert('Please enter cancellation remarks.');
            }
            else {
                $.ajax({
                    type: "GET",
                    url: "/MedicalScrutiny/PreauthCancel",
                    contentType: 'application/json;charset=utf-8',
                    //processData: false,
                    data: {
                        ClaimID: $('#hdnClaimID').val(), SlNo: $('#hdnClaimSlNo').val(), PreauthCancelRemarks: $('#taPreauthCancel').val(), ClaimTypeID: $('#hdnClaimTypeID').val(),
                        RequestTypeID: $('#ddlRequestType').val(), ServiceTypeID: $('#ddlServiceType').val(), ServiceSubTypeID: $('#ddlServiceSubType').val(),
                        ClaimedAmount: $('#txtClaimedAmount').val(), PolicyTypeID: $('#hdnPolicyTypeID').val(), MainMemberPolicyID: $('#hdnMemberPolicyID').val(),
                        PolicyID: $('#hdnPolicyID').val(), ProviderID: $('#hdnProviderID').val(), BrokerID: $('#hdnBrokerID').val(), PayerID: $('#hdnPayerID').val(),
                        CorporateID: $('#hdnCorporateID').val(), InsuranceCompanyID: $('#hdnInsuranceCompanyID').val(), AgentID: $('#hdnAgentID').val(), QMSID: $("#hdnQMS").val(), QMSAdminID: $("#hdnQMS").val()
                    },
                    success: function (data) {
                        CheckSessionVariable(data);
                        data = $.parseJSON(data);

                        if (data.ID == 1) {
                            alert(data.Message);
                            window.location = '/Claims/Index';
                        }
                        else if (data == '') {
                            window.location = '/Claims/Index';
                        }
                        else {
                            alert(data);
                            window.location = '/Claims/Index';
                        }
                    },
                    error: function (e, x) {
                        ShowResultMessage('ErrorMessage', e.responseText);
                    }
                });
            }
        }
    }
    else {
        //alert("Preauth Cancellation is not possible for the " + providerstatus + " Provider.");
        alert("Warning! You are performing an action against " + providerstatus + " hospital. Only rejection is possible.");
    }
}

function Retrieve_CancelReasons(_actionID, _stageID, _ClaimID, _SlNo) {
    var flag = false;

    if (_stageID == 21) {
        if ($('#tblPreauthCancelReasonsView tbody tr').length > 0) {
            var rowID = $('#tblPreauthCancelReasonsView tbody tr:first').attr('id');
            if (('trPending_' + _stageID + '_' + _actionID) == rowID)
                flag = true;
        }
    }

    if (flag == false) {
        if (_actionID != null) {
            $('#tblPendingReasons tbody').html('');
            $.ajax({
                type: "GET",
                url: "/MedicalScrutiny/ClaimCencel_Reasons_Retrieve",
                contentType: 'application/json;charset=utf-8',
                ////processData: false,
                data: { ClaimID: _ClaimID, SlNo: _SlNo, ActionID: _actionID, StageID: _stageID },
                //data: { ActionID: _actionID },
                success: function (data) {
                    CheckSessionVariable(data);
                    if (data.length > 0) {
                        data = $.parseJSON(data);
                        if (data.ID == 1) {
                            DialogErrorMessage(data.Message);
                        }
                        else {
                            $('#tblRefInsAuditReasonsView,#tblPendingReasonsView,#tblRejectedReasonsView').hide();
                            $('#tblPreauthCancelReasonsView tbody').html('');
                            Bind_CancelReasons(data, _stageID, _actionID);
                        }
                    }
                },
                error: function (e, x) {
                    ShowResultMessage('ErrorMessage', e.responseText);
                }
            });
        }
    }
    else
        $("#divPendingReasons").css({ "display": "block", "position": "absolute", "width": "100%", "height": "100%", "padding-top": "300px", "z-index": "1000", "background": "#000", "background": "rgba(0,0,0,0.75)" });
}

function Bind_CancelReasons(data, _stageID, _actionID) {
    if (_stageID == 21) {
        $('#tblPreauthCancelReasonsView').show();
        $('#lblReasonsViewTitle').text('Reasons ');
        for (var i = 0; i < data.length; i++) {
            var ctrlID = 'trInsAuditReasons_' + _stageID + '_' + _actionID;
            var tblBody = '<tr id="' + ctrlID + '"> <td class="numeric">' + data[i].Remarks + '</td></tr>';
            $('#tblPreauthCancelReasonsView tbody').append(tblBody);
        }
    }

    $("#divPendingReasons").css({ "display": "block", "position": "absolute", "width": "100%", "height": "100%", "padding-top": "300px", "z-index": "1000", "background": "#000", "background": "rgba(0,0,0,0.75)" });
}

function GetActualBalanceSI() {
    //debugger
    if ($('#lbleffectivebsi').text().trim() == "") {
        //$('#hdnMemberPolicyID').val(), $('#hdnSITypeID').val()
        var memberPolicyID, SIType, SICategoryID;
        memberPolicyID = $('#hdnMemberPolicyID').val();
        SIType = $('#hdnSITypeID').val();

        $('.se-pre-con').show();


        $.ajax({
            //type: "GET",
            url: "/Common/BalanceSumInsured_Retrieve",
            contentType: 'application/json;charset=utf-8',
            data: { MemberPolicyID: memberPolicyID, SITypeID: SIType },
            success: function (SIData) {
                try {
                    CheckSessionVariable(SIData);
                    var data = $.parseJSON(SIData);
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].SICategoryID == 69) {
                                var BalanceSumInsured = (data[i].SumInsured + data[i].CB_Amount) - ((data[i].BlockedAmt) + (data[i].UtilizedAmt));
                                $('#lbleffectivebsi').text(BalanceSumInsured);
                            }
                        }
                    }
                    $('.se-pre-con').hide();
                } catch (e) {
                    $('.se-pre-con').hide();
                    alert(e.message);
                }
                $('.se-pre-con').hide();

            },
            error: function (e, x) {
                ShowResultMessage('ErrorMessage', e.responseText);
                $('#progress').hide();
            }
        });
    }
}

//Neft Date Validation
function DateRangeValidationwithToday(dtinput, inBound, outBound, controlname) {
    //if (dtinput == "") {
    //    DialogWarningMessage('Please Enter/Provide Date to validate');
    //    return false;
    //}
    //else
    outBound = GetTodayDate();
    if (inBound == "" || outBound == "") {
        // DialogWarningMessage('Please provide Dates to check date Range validation');
        ShowWanringMessage('divCSDWanringBox', 'Please provide Dates to check date Range validation');
        $('#' + controlname).val('');
        return false;
    } else {
        var startrange = new Date(inBound);
        var endrange = new Date(outBound);
        var inputdt = new Date(dtinput);
        if (inputdt < startrange || inputdt > endrange) {
            // DialogWarningMessage("Date should be between " + inBound + " and  " + outBound + "");
            ShowWanringMessage('divCSDWanringBox', "Date should be between " + inBound + " and  " + outBound + "");
            $('#' + controlname).val('');
            return false;
        } else {
            $('#divCSDWanringBox').html('')

            return true;
        }
    }
}

function ClaimFromCRMRemarks_Insert(_stageID, _ctrlReason, _ctrlRemarks, _roleID) {
    if ($('#' + _ctrlRemarks).val() == "") {
        // DialogWarningMessage("Please provide closing remarks");
        DialogWarningMessage('Please provide closing remarks to submit');
    }
    else
        if ($('#hdnClaimActionID').val() != "" && $('#hdnClaimActionID').val() != null) {
            _claimdetails = {};
            _claimdetails["ClaimID"] = $('#hdnClaimID').val();
            _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
            _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
            _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
            _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
            _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
            _claimdetails["ClaimStageID"] = _stageID;
            _claimdetails["RoleID"] = _roleID;
            _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();

            if ($('#' + _ctrlRemarks).val() != "") {
                if ($('#' + _ctrlRemarks).val() != '' || $('#' + _ctrlRemarks).val() != null) {
                    _claimdetails["Remarks"] = $('#' + _ctrlRemarks).val();

                }
                else {
                    _claimdetails["Remarks"] = null;
                }

                // Submit_Request(JSON.stringify(_claimdetails), _stageID);
                $.ajax({
                    //type: "POST",
                    url: "/MedicalScrutiny/ClaimFromCRMRemarks_Insert",
                    contentType: 'application/json;charset=utf-8',
                    //processData: false,
                    data: {
                        ClaimDetails: JSON.stringify(_claimdetails), ActionID: $('#hdnClaimActionID').val(),
                        QMSID: $("#hdnQMS").val(), QMSAdminID: $("#hdnQMS").val()
                    },
                    //data: { ClaimDetails: 1, Rules: 4 },
                    success: function (data) {
                        CheckSessionVariable(data.responseText);
                        //DialogResultMessage(data);
                        $('#btnCloseFromcrmclose').click();
                        CommonConfirmAjaxDialog(data, 'FromCRM Closing Success', returntoCDB, null, 300, 200);
                        //if (data == "Action Closed Successfully")
                        //{
                        //    window.location = '/Claims/Index';
                        //}
                        //else
                        //if (data == null || data == "") {
                        //    //alert('Data not found.');
                        //}
                    },
                    error: function (e, x) {
                        ShowResultMessage('ErrorMessage', e.responseText);
                    }
                });

            } else {
                DialogWarningMessage('Please Provide Remarks to submit');
            }

            // $('#' + _ctrlReason).val('0');
            $('#' + _ctrlRemarks).val('');

        }
        else {
            alert('Action ID not found..');
        }
}

var returntoCDB = function () {
    window.location = '/Claims/Index';
}

function Get_ClaimPreviousBankdetials(_ClaimID, _Srno, type) {
    try {
        if ($("#txtNBEnrollment_BankAccountNo").text() == "") {
            $('#progress').show();
            $.ajax({
                url: "/MedicalScrutiny/Get_ClaimPreviousBankdetials",
                contentType: 'application/json;charset=utf-8',
                //processData: false,
                data: { ClaimID: _ClaimID, SlNo: _Srno },
                success: function (data) {
                    $('#progress').hide();
                    data = $.parseJSON(data);

                    if (data == null || data == "") {
                        //alert('Data not found.');
                    }
                    else {
                        if (type == 1) {
                            //$("#txtNBEnrollment_MemberEmail").val(data[0].Email);
                            if ($('#hdnInsuranceCompanyID').val() === "14") {
                                //var originalemail = data[0].Email;
                                $("#hdnNBEnrollment_MemberEmail").val(data[0].Email);
                                Maskvalue("#txtNBEnrollment_MemberEmail", data[0].Email, 3);
                            }
                            else {
                                $("#txtNBEnrollment_MemberEmail").val(data[0].Email);
                            }
                            //$("#txtNBEnrollment_MemberMobile").val(data[0].Mobile);
                            if ($('#hdnInsuranceCompanyID').val() === "14") {
                                $("#hdnNBEnrollment_MemberMobile").val(data[0].Mobile);
                                Maskvalue("#txtNBEnrollment_MemberMobile", String(data[0].Mobile), 1);
                            }
                            else {
                                $("#txtNBEnrollment_MemberMobile").val(data[0].Mobile);
                            }
                            if (data.length > 0) {
                                if (data[0].payeeTypeID != null) {
                                    $("#txtNBEnrollment_PayeeType").text(getNamepropwithId(data[0].payeeTypeID, MasterData.PayeeType));
                                }
                                else {
                                    $("#txtNBEnrollment_PayeeType").text('Hospital');
                                }
                                $("#txtNBEnrollment_PayeeName").text(data[0].PayeeName);
                                //$("#txtNBEnrollment_BankAccountNo").text(data[0].AccountNumber);
                                if ($('#hdnInsuranceCompanyID').val() === "14") {
                                    Maskvalue("#txtNBEnrollment_BankAccountNo", data[0].AccountNumber, 1);
                                }
                                else {
                                    $("#txtNBEnrollment_BankAccountNo").text(data[0].AccountNumber);
                                }
                                $("#txtNBEnrollment_BankName").text(data[0].Bank);
                                $("#txtNBEnrollment_BranchName").text(data[0].Branch);
                                //$("#txtNBEnrollment_AccountType").text(getNamepropwithId(data.Table1[0].AccountTypeID, MasterData.Mst_AccountType));
                                //$("#txtNBEnrollment_IFSCode").text(data[0].IFSCCode);
                                if ($('#hdnInsuranceCompanyID').val() === "14") {
                                    Maskvalue("#txtNBEnrollment_IFSCode", data[0].IFSCCode, 1);
                                }
                                else {
                                    $("#txtNBEnrollment_IFSCode").text(data[0].IFSCCode);
                                }
                            }
                        }
                        else {
                            //$("#txtNBREnrollment_MemberEmail").val(data[0].Email);
                            if ($('#hdnInsuranceCompanyID').val() === "14") {
                                var hiddenEmail = data[0].Email;
                                $("#hdnNBREnrollment_MemberEmail").val(hiddenEmail);
                                Maskvalue("#txtNBREnrollment_MemberEmail", data[0].Email, 3);
                            }
                            else {
                                $("#txtNBREnrollment_MemberEmail").val(data[0].Email);
                            }
                            //$("#txtNBREnrollment_MemberMobile").val(data[0].Mobile);
                            if ($('#hdnInsuranceCompanyID').val() === "14") {
                                var hiddenMobile = data[0].Mobile;
                                $("#hdnNBREnrollment_MemberMobile").val(hiddenMobile);
                                Maskvalue("#txtNBREnrollment_MemberMobile", String(data[0].Mobile), 1);
                            }
                            else {
                                $("#txtNBREnrollment_MemberMobile").val(data[0].Mobile);
                            }
                            if (data.length > 0) {
                                if (data[0].payeeTypeID != null) {
                                    $("#txtNBREnrollment_PayeeType").text(getNamepropwithId(data[0].payeeTypeID, MasterData.PayeeType));
                                }
                                else {
                                    $("#txtNBREnrollment_PayeeType").text('Hospital');
                                }
                                $("#txtNBREnrollment_PayeeName").text(data[0].PayeeName);
                                //$("#txtNBREnrollment_BankAccountNo").val(data[0].AccountNumber);
                                if ($('#hdnInsuranceCompanyID').val() === "14") {
                                    //hdnNBREnrollment_BankAccountNo
                                    var hiddenAccount = data[0].AccountNumber;
                                    $("#hdnNBREnrollment_BankAccountNo").val(hiddenAccount);
                                    Maskvalue("#txtNBREnrollment_BankAccountNo", data[0].AccountNumber, 1);
                                }
                                else {
                                    $("#txtNBREnrollment_BankAccountNo").val(data[0].AccountNumber);
                                }
                                $("#txtNBREnrollment_BankName").val(data[0].Bank);
                                $("#txtNBREnrollment_BranchName").val(data[0].Branch);

                                if (data[0].AccountTypeID == 0) $("#ddlNBREnrollment_AccountType").val('');
                                else $("#ddlNBREnrollment_AccountType").val(data[0].AccountTypeID);
                                //$("#txtNBREnrollment_IFSCode").val(data[0].IFSCCode);

                                if ($('#hdnInsuranceCompanyID').val() === "14") {
                                    var hiddencode = data[0].IFSCCode;
                                    $("#hdnNBREnrollment_IFSCode").val(hiddencode);
                                    Maskvalue("#txtNBREnrollment_IFSCode", data[0].IFSCCode, 1);
                                }
                                else {
                                    $("#txtNBREnrollment_IFSCode").val(data[0].IFSCCode);
                                }
                            }
                        }
                    }

                },
                error: function (e, x) {
                    $('#progress').hide();
                    ShowResultMessage('ErrorMessage', e.responseText);
                }
            });
        }
    }
    catch (e) {
        $('#progress').hide();
        alert(e.message);
    }
}

function SendNeftBouncedQueryLetter() {
    try {
        var visibleEmail = $('#txtNBEnrollment_MemberEmail').val();
        var originalEmail = $('#hdnNBEnrollment_MemberEmail').val();
        var mEmail = (visibleEmail && visibleEmail.indexOf('x') !== -1)
            ? originalEmail
            : visibleEmail;
        var visibleMobile = $('#txtNBEnrollment_MemberMobile').val();
        var originalMobile = $('#hdnNBEnrollment_MemberMobile').val();
        var mMobile;
        if (visibleMobile && visibleMobile.indexOf('x') !== -1) {
            mMobile = originalMobile && originalMobile !== "" ? originalMobile : 0;
        } else {
            mMobile = visibleMobile && visibleMobile !== "" ? visibleMobile : 0;
        }

        var queryRemarks = $('#txtNBQueryRemarks').val();
        if (mEmail == "") {
            DialogWarningMessage("Please Enter Member Email Address to Send Neft Bounced Query Letter");
            $('#txtNBEnrollment_MemberEmail').focus();
        }
        else {

            $.ajax({
                //type: "POST",
                url: "/MedicalScrutiny/SendNeftBouncedQueryLetter",
                contentType: 'application/json;charset=utf-8',
                //processData: false,
                data: {
                    ClaimID: $('#hdnClaimID').val(), Slno: $('#hdnClaimSlNo').val(), EmailID: mEmail, Mobile: mMobile, Remarks: queryRemarks, PolicyType: $('#hdnPolicyTypeID').val(),
                    MainMemberPolicyID: $('#hdnMemberPolicyID').val(), PolicyID: $('#hdnPolicyID').val(), ProviderID: $('#hdnProviderID').val(),
                    BrokerID: $('#hdnBrokerID').val(), PayerID: $('#hdnPayerID').val(), CorporateID: $('#hdnCorporateID').val(),
                    InsuranceCompanyID: $('#hdnInsuranceCompanyID').val(), AgentID: $('#hdnAgentID').val()
                },
                success: function (data) {
                    try {
                        CheckSessionVariable(data);
                        data = $.parseJSON(data);
                        if (data != null) {
                            if (data.ID == 1) {
                                CommonConfirmAjaxDialog(data.Message, 'NEFT Bounced Query Success', returntoCDB, returntoCDB, 300, 200);
                            }
                            else {
                                CommonConfirmAjaxDialog(data.Message, 'NEFT Bounced Query Failed', returntoCDB, returntoCDB, 300, 200);
                            }
                        } else {
                            DialogErrorMessage("Error Occured");
                        }

                    } catch (e) {
                        alert('Error Occured while Sending Neft Bounced Query Letter');
                    }
                },
                error: function (e, x) {
                    ShowResultMessage('ErrorMessage', e.responseText);
                }
            });

        }
    }
    catch (e) {
        alert(e.message);
    }
}

function UpdateNeftBouncedQueryResponse(data) {
    try {
        var visibleEmail = $('#txtNBREnrollment_MemberEmail').val();
        var originalEmail = $('#hdnNBREnrollment_MemberEmail').val();
        var mEmail = (visibleEmail && visibleEmail.indexOf('x') !== -1)
            ? originalEmail
            : visibleEmail;
        var visibleMobile = $('#txtNBREnrollment_MemberMobile').val();
        var originalMobile = $('#hdnNBREnrollment_MemberMobile').val();
        var mMobile;
        if (visibleMobile && visibleMobile.indexOf('x') !== -1) {
            mMobile = originalMobile && originalMobile !== "" ? originalMobile : 0;
        } else {
            mMobile = visibleMobile && visibleMobile !== "" ? visibleMobile : 0;
        }
        var queryRemarks = $('#txtNBRRemarks').val();

        if (NeftQueryResponseData_Validate(null)) {
            $('#divNBRWanringBox').html('');

            $.ajax({
                //type: "POST",
                url: "/MedicalScrutiny/NeftBouncedQueryResponseInsert",
                contentType: 'application/json;charset=utf-8',
                //processData: false,
                data: {
                    ClaimID: $('#hdnClaimID').val(), Slno: $('#hdnClaimSlNo').val(), BankAccountNo: $('#hdnNBREnrollment_BankAccountNo').val(), BankName: $('#txtNBREnrollment_BankName').val(), BranchName: $('#txtNBREnrollment_BranchName').val(), IFSCCode: $('#hdnNBREnrollment_IFSCode').val(),
                    AccountTypeID: $('#ddlNBREnrollment_AccountType').val(), EmailID: mEmail, Mobile: mMobile, Remarks: queryRemarks
                },
                success: function (data) {
                    try {
                        CheckSessionVariable(data);
                        data = $.parseJSON(data);
                        if (data != null) {
                            if (data.ID == 1) {
                                CommonConfirmAjaxDialog(data.Message, 'NEFT Bounced Query Response', returntoCDB, returntoCDB, 300, 200);
                            }
                            else {
                                CommonConfirmAjaxDialog(data.Message, 'NEFT Bounced Query Response Failed', returntoCDB, returntoCDB, 300, 200);
                            }
                        } else {
                            DialogErrorMessage("Error Occured");
                        }
                    } catch (e) {
                        alert('Error Occured while Updating Neft Bounced Query Response');
                    }
                },
                error: function (e, x) {
                    ShowResultMessage('ErrorMessage', e.responseText);
                }
            });

        }
    } catch (e) {
        alert('Error Occured while Sending Neft Bounced Query Letter');
    }
}

function NeftQueryResponseData_Validate(_controlFields) {
    try {
        if ($('#txtNBREnrollment_PayeeType').text() == "") {
            DialogWarningMessage("Payee Type cannot be blank");
            return false;
        }
        else
            if ($('#txtNBREnrollment_PayeeName').text() == "") {
                DialogWarningMessage("Payee name cannot be blank");
                return false;
            }
            else {
                var _controlFields = [];
                //['txtNBREnrollment_PayeeType', 'Payee type cannot be blank'], ['txtNBREnrollment_PayeeName', 'Payee Name cannot be blank'],
                _controlFields.push(['txtNBREnrollment_IFSCode', 'Please Enter IFSCode'], ['txtNBREnrollment_BankAccountNo', 'Please Enter Account Number'], ['txtNBREnrollment_BankName', 'Please Enter Bankname'], ['txtNBREnrollment_BranchName', 'Please Enter Branch Name'], ['ddlNBREnrollment_AccountType', 'Please Select Account Type'], ['txtNBREnrollment_MemberEmail', 'Please Enter Member Email']);
                return CustomFiledsValidate(_controlFields, 'divNBRWanringBox');
                //return requiredFiledsValidate('divBPBasic', 'divBPWanringBox');
            }
    } catch (e) {
        alert('Error Occured while Validating Neft Query Response Information');
    }
}

function GetBankDetailsByIFSCCode1(ctrl, ctrl_bank, ctrl_Branch) {


    if ($('#' + ctrl).val() != '') {
        $.ajax({
            url: '/Common/GetBankDetails',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            data:
                { IFSC: $('#' + ctrl).val() },

            dataType: 'json',
            success: function (data) {
                if (data != null) {
                    $('#' + ctrl_bank).val(data.Name);
                    $('#' + ctrl_Branch).val(data.Branch);
                    // $('#' + ctrl_micr).val(data.MICRCode);


                } else {
                    alert("Invalid IFSC Code");
                }

            },
            error: function (err) {
                alert(err);
                //err[0]
            }
        });
        // }
    }
}
function internalExternalButtonClick() {
    ////debugger;
    var trigger = $('#ddlTriggers').val();
    window.location.href = "/Investigation/Investigation?ClaimID=" + $('#hdnClaimID').val() + "&SlNo=" + $('#hdnClaimSlNo').val() + "&Trigger=" + trigger;
}

function ReAssigninternalExternalButtonClick() {
    //if ($('#hdnClaimStageID').val() != 20)
    //    DialogWarningMessage('Investigation Not Done for this Claim to Re-Assign investigation.');
    var trigger = $('#ddlTriggers').val();
    window.location.href = "/Investigation/Investigation?ClaimID=" + $('#hdnClaimID').val() + "&SlNo=" + $('#hdnClaimSlNo').val() + "&Trigger=" + trigger + "&IsEdit=" + null + "&IsAssign=" + null + "&IsReAssign=" + 1;
}

//vijitha Role wise buttons displaying ---Modified By SrinuB on 25thFeb 2017
function StagewiseDisable_ButtonsByRoleWise() {
    var alroles = $.parseJSON($('#hdnallowedRoles').val());
    var isdoc = false;
    //var iscrm = false;
    var isaudit = false;
    $.each(alroles, function (i, item) {
        //if (item == 17 || item == 18 || item == 32) {
        //    iscrm = true;
        //}
        if (item == 13) {
            isdoc = true;
        }
        if (item == 16) {
            isaudit = true;
        }
    });
    if (isdoc || isaudit) {

        $('#DMSUpdateClass').show();

        if (isdoc) {
            $('#DMSAnnotation').show();
        }
        else {
            $('#DMSAnnotation').remove();
        }
    }
    else {
        $('#DMSUpdateClass,#DMSAnnotation').remove();

    }

}

function Retrieve_DocumentComments(_actionID, _stageID, _ClaimID, _SlNo) {
    var flag = false;

    //if (_stageID == 3) {
    //    if ($('#tblDocumentcomments tbody tr').length > 0) {
    //            flag = true;
    //    }
    //}

    if (flag == false) {
        if (_actionID != null) {
            $('#tblDocumentcomments tbody').html('');
            $.ajax({
                type: "GET",
                url: "/MedicalScrutiny/DocumentComments_Retrieve",
                contentType: 'application/json;charset=utf-8',
                ////processData: false,
                data: { ClaimID: _ClaimID, SlNo: _SlNo },
                //data: { ActionID: _actionID },
                success: function (data) {
                    CheckSessionVariable(data);
                    //alert(data);
                    if (data.length > 0) {
                        data = $.parseJSON(data);
                        if (data.ID == 1) {
                            DialogErrorMessage(data.Message);
                        }
                        else {
                            // GetRegionNameByUserID
                            //$('#tblRefInsAuditReasonsView,#tblPendingReasonsView,#tblRejectedReasonsView').hide();
                            // $('#tblPreauthCancelReasonsView tbody').html('');
                            Bind_DocumentComments(data, _stageID, _actionID, 'tblDocumentcomments');
                            // BindGridResults(data, 'tblDocumentcomments', 10);
                        }
                    }
                },
                error: function (e, x) {
                    ShowResultMessage('ErrorMessage', e.responseText);
                }
            });
        }
    }
    // else
    //     $("#divPendingReasons").css({ "display": "block", "position": "absolute", "width": "100%", "height": "100%", "padding-top": "300px", "z-index": "1000", "background": "#000", "background": "rgba(0,0,0,0.75)" });


}

function Bind_DocumentComments(data, _stageID, _actionID, tableId) {
    if (_stageID == 3) {
        if (data != null) {
            $('#' + tableId).html('');
            var columns = [];
            if ((data != null)) {
                columns = GetColumnsOfJsonObj(data[0]);
                var tHead = "<thead><tr>";
                var count = null;
                if (count == null || count == undefined || count == '')
                    count = columns.length;
                count = (columns.length > count) ? count : columns.length;
                for (var i = 0; i < count; i++) {
                    if (columns[i] == "ClaimID") {
                        tHead = tHead + "<th> ClaimID[Slno]</th>";
                    }
                    else
                        if (columns[i] == "Slno") {
                            //tr = tr + '<td><a href="#">' + GetRegionNameByUserID(data[i][columns[j]]) + '</a></td>';
                        }
                        else
                            tHead = tHead + "<th>" + columns[i] + "</th>";
                }
                tHead = tHead + "</tr></thead>";
                $("#" + tableId).append(tHead);
                for (var i = 0; i < data.length; i++) {

                    if (data[i] != null) {
                        //$('#PreAuth_download').css({ 'display': 'inherit' });
                        var tr = "<tr class='tr'>";
                        for (var j = 0; j < count; j++) {
                            // tr = tr + "<td>" + data[i][columns[j]] + "</td>";
                            if (columns[j] == "ClaimID") {
                                tr = tr + '<td><a href="#">' + data[i][columns[j]] + '[' + data[i]["Slno"] + ']</a></td>';
                            }
                            else
                                if (columns[j] == "Slno") {
                                    //tr = tr + '<td><a href="#">' + GetRegionNameByUserID(data[i][columns[j]]) + '</a></td>';
                                }
                                else
                                    if (columns[j] == "OpenBy") {
                                        tr = tr + '<td><a href="#">' + GetUserName(data[i][columns[j]], MasterData.Lnk_UserRegions, MasterData.Mst_Users) + "-" + GetRegionNameByUserID(data[i][columns[j]]) + '</a></td>';

                                    } else {
                                        tr = tr + "<td>" + data[i][columns[j]] + "</td>";
                                    }
                        }
                        tr = tr + "</tr>";
                        $("#" + tableId).append(tr);
                    }
                }
            }
            if ((data.length == 0) || (data == null)) {
                var $tr = $('<tr class="tr">').append($('<td colspan="8" style=" font-size:large; color:#3A798C;text-align:center;">').text("No Records Found")
                ).appendTo('#' + tableId);
            }
        }
    }

    // $("#tblDocumentcomments").css({ "display": "block", "position": "absolute", "width": "100%", "height": "100%", "padding-top": "300px", "z-index": "1000", "background": "#000", "background": "rgba(0,0,0,0.75)" });
}

$('#btnCloseDocumentcomments').on('click', function () { $('#documentRemarksModal').modal('hide'); });
//$('#documentRemarksbutton').on('click', function () { $('#documentRemarksModal').modal('show'); });

//$('#modelbutton').on('click', function () {
//    $('#documentRemarksModal').modal('show');
//});

function ShowdDocumentRemarksModel() {
    $('#documentRemarksModal').modal('show');
}

$('#txtSettlement_ChequeTransactionDate').on('change', function () {
    DateRangeValidationwithToday($(this).val(), $('#txtHospDOA').val(), null, 'txtSettlement_ChequeTransactionDate');
});

$('#lnkAdjudication').on('click', function () {

    //SP3V-5184 START
    if (basicData[0].Isrefertoinsurer == true && $("#hdnisLegalCase").val() == "True" && basicData[0].IsForwardedtoInsurer == "1" && ($('#hdnClaimStageID').val() == 5 || $('#hdnClaimStageID').val() == 28 || $('#hdnClaimStageID').val() == 38)) {
        alert("Case is flagged as legal. Refer to Insurer is Mandatory");
        return false;
    }
    //SP3V-5184 END

    var _valid = true;
    $('#rmcls').show();
    if ($('#hdnClaimStageID').val() == 5 || $('#hdnClaimStageID').val() == 28 || $('#hdnClaimStageID').val() == 38) {
        $('#btnRejectAll').attr("disabled", "true");
    }  //added by prasad
    //if (_bsiData == null || _bsiData == '' || _bsiData == undefined) {
    //    _valid = false;
    //    DialogWarningMessage('Please Check Balance Sum Insured details Before processing furthur.');
    //    //DialogWarningMessage('Balence sum insured data not found');

    //} else {
    //    if (_bsiData["Table1"].length == 0) {
    //        _valid = false;
    //        DialogWarningMessage('Please Check Balance Sum Insured details Before processing furthur.');
    //        //  DialogWarningMessage('Balence sum insured data not found');
    //    }
    //}

    if (basicData[0].IssueID != 24) {               ////added by prasad SP3V-331
        $('#Installment_Premium').hide();
        $('#InstallmentPremium').hide();
    }
    else {
        $('#Installment_Premium').show();
        $('#InstallmentPremium').show();
    }
    if (Isitpreauth($('#hdnRequestTypeID').val()))
        $('#litxtNegotiatedDiscount').hide();
        

    //end of SP3V-331
    if (_objBsi == null || _objBsi == '' || _objBsi == undefined) {
        _valid = false;
        DialogWarningMessage('Please Check Balance Sum Insured details Before processing furthur.');
        //DialogWarningMessage('Balence sum insured data not found');

    } else {
        if (_objBsi["Suminsured"].length == 0) {
            _valid = false;
            DialogWarningMessage('Please Check Balance Sum Insured details Before processing furthur.');
            //  DialogWarningMessage('Balence sum insured data not found');
        }
    }

    if (_valid == true) {
        chkRules();
        //Get_ClaimRejectedReasons($('#hdnClaimID').val(), $('#hdnClaimSlNo').val());
        DisplayDoctorRemarks();
        LoadPolicyDetails($('#hdnPolicyID').val(), 'hplPolicyInsuranceCompany');

        $('#divBillCalculation').show();
        $('#divAdjudication').show();
        $("#infertoinsurerbuttons").hide();
        setTimeout(function () {
            var rowCount = $('#tbloverrideRuleApproval >tbody >tr').length;
            if (rowCount == 1) {
                $("#IsOverride").attr("hidden", false);
            }
        }, 100);
        //****** SP-1103
        if ($('#hdnClaimStageID').val() == 24) {
            $('#btnBillCalculator').hide();
        }
        else {
            $('#btnBillCalculator').show();
        }
        //*************

        if (basicData[0].IssueID == 10) {
            if ($('#hdnClaimStageID').val() == 5 || $('#hdnClaimStageID').val() == 28 || $('#hdnClaimStageID').val() == 38) {
                if (basicData[0].ITGIinsurerresponse == "Auth Approved") {
                    $('#divAdjudicationFinalButtons').show();
                    $('#btnBillCalculator').attr('disabled', true);
                    $('#btnReject').attr('disabled', true);
                    $('#btnRejectAll').attr('disabled', true);
                    $('#lnkPreauthCancel').attr('disabled', true);
                }
                else if (basicData[0].ITGIinsurerresponse == "Auth Denied" || basicData[0].ITGIinsurerresponse.includes("Claim Repudiated")) {
                    $('#divAdjudicationFinalButtons').show();
                    $('#btnReject').show();
                    $('#btnBillCalculator').show();
                    $('#btnRejectAll').attr('disabled', true);
                    $('#lnkPreauthCancel').attr('disabled', true);
                    $('#btnApprove').attr('disabled', true);
                }
                else if (basicData[0].ITGIinsurerresponse.includes("Claim in query")) {
                    $('#divAdjudicationFinalButtons').show();
                    $('#btnReject').show();
                    $('#btnBillCalculator').show();
                    $('#btnRejectAll').attr('disabled', true);
                    $('#lnkPreauthCancel').attr('disabled', true);
                    if ($('#hdnClaimTypeID').val() == 1 && (($('#hdnRequestTypeID').val() == 1) || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3))
                        $('#btnApprove').attr('disabled', true);
                    else
                        $('#btnApprove').show();
                }
                else {
                    if ($('#hdnClaimTypeID').val() == 1 && (($('#hdnRequestTypeID').val() == 1) || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3)) {
                        if (basicData[0].isITGImanualapv == 1) {
                            $('#divAdjudicationFinalButtons').show();
                            $('#btnApprove').show();
                            $('#btnReject').show();
                            $('#btnRejectAll').attr('disabled', true);
                            $('#lnkPreauthCancel').attr('disabled', true);
                        }
                        else {
                            $('#divAdjudicationFinalButtons').hide();
                            alert("Warning! You cannot use Adjudication Process for ITGI cases. Under Claims Actions, click on Refer to Insurer - Approval/Rejection to proceed ahead!")
                            $('#divBillCalculation').hide();
                            $('#divAdjudication').hide();
                            return false;
                        }
                    }
                    else {
                        $('#divAdjudicationFinalButtons').show();
                        $('#btnApprove').show();
                        $('#btnReject').attr('disabled', true);
                        $('#btnRejectAll').attr('disabled', true);
                        $('#lnkPreauthCancel').attr('disabled', true);
                    }
                }
            }
            else if ($('#hdnClaimStageID').val() == 24 && basicData[0].ITGIinsurerresponse == "Auth Approved") {
                if ($('#hdnClaimTypeID').val() == 1 && (($('#hdnRequestTypeID').val() == 1) || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3))
                    $('#btnReProcessBillAmt').attr('disabled', true);
            }
            else if ($('#hdnClaimStageID').val() == 29) { //need to discuss
                if ($('#hdnClaimTypeID').val() == 1 && (($('#hdnRequestTypeID').val() == 1) || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3))
                    $('#lnkPreauthCancel').attr('disabled', true);
            }
        }
        // if (IsreopenClaim == false) {


        if (basicData[0].ReasonIDs_P == '224' && basicData[0].Isrefertoinsurer == true) {
            $('#btnReject').attr('disabled', true);
            $('#btnRejectAll').attr('disabled', true);
            $('#lnkPreauthCancel').attr('disabled', true);
        }
        else if (basicData[0].ReasonIDs_P == '225' && (basicData[0].Isrefertoinsurer == true || basicData[0].IssueID == 26)) {
            $('#btnApprove').attr('disabled', true);
        }
        //  }

    }

    // ClaimAI: Auto-click Calculate button after Bill Calculation section loads
    setTimeout(function() {
        console.log('[ClaimAI] Auto-clicking Calculate');
        $('#btnBillCalculator').click();
    }, 2000);

});

$('#lnkAudit').on('click', function () {
    var _valid = true;


    function handleBankDetailsSection() {
        $('.CL_Bankdetails,.TBD_Bankdetails').hide();

        //var insurerValue = $('#hdnInsuranceCompanyID').val();

        if (parseInt($('#hdnClaimTypeID').val()) === 1) {
            $('.CL_Bankdetails').show();
            LoadBankdetails($('#hdnClaimID').val(), $('#hdnClaimSlNo').val());
            $(".cl_bankdetails_check").prop("checked", true);
        } else {
            $('.TBD_Bankdetails').show();
            LoadBankdetails($('#hdnClaimID').val(), $('#hdnClaimSlNo').val());
        }



    }

    function validateBSIDataAndProceed() {
        if (!_objBsi || _objBsi === '' || _objBsi === undefined || _objBsi["Suminsured"].length === 0) {
            _valid = false;
            DialogWarningMessage('Please Check Balance Sum Insured details Before processing further.');
        } else {
            GetAuditRemarksDetails($('#hdnClaimID').val(), $('#hdnClaimSlNo').val());
            $('#divAudit').show();
            handleBankDetailsSection();
        }
    }

    if ($('#hdnClaimTypeID').val() == 2) {
        $.ajax({
            url: '/Provider/ValidateProviderUpdate',
            type: 'GET',
            contentType: 'application/json;charset=utf-8',
            data: {
                ProviderID: $('#hdnProviderID').val()
            },
            success: function (res) {
                var data = $.parseJSON(res);
                var resultValid = data.Table[0].Result;
                var prcno = data.Table[0].PRCNo;

                if (resultValid.toString() === "Failed" && prcno.trim() === "") {
                    DialogWarningMessage('!Fill mandatory fields in Provider details section and save to proceed further');
                    return;
                }

                if ($("#hdnNEFTValidation").val() !== "0") {
                    LoadReceivedPatientDetails($('#hdnClaimID').val(), $('#hdnClaimSlNo').val(), 'txtReceivedPatient_PatientName', 1, $('#hdnIsFrmArchived').val());
                }

                validateBSIDataAndProceed();
            },
            error: function () {
                alert('Problem while Validating Provider');
                return;
            }
        });
    } else {
        if ($("#hdnNEFTValidation").val() !== "0") {
            LoadReceivedPatientDetails($('#hdnClaimID').val(), $('#hdnClaimSlNo').val(), 'txtReceivedPatient_PatientName', 1, $('#hdnIsFrmArchived').val());
        }

        validateBSIDataAndProceed();
    }
});

function isMemberBankDetailsComplete() {
    var validate = true;
    if (MakeNullfromUndefinedorEmpty($('#RMB_spnpayeetype_View').text().trim()) == null ||
        MakeNullfromUndefinedorEmpty($('#RMB_spnpayeename_View').text().trim()) == null ||
        MakeNullfromUndefinedorEmpty($('#RMB_spnIFSCCode_View').text().trim()) == null ||
        MakeNullfromUndefinedorEmpty($('#RMB_spnBankName_View').text().trim()) == null ||
        MakeNullfromUndefinedorEmpty($('#RMB_spnBranchName_View').text().trim()) == null ||
        MakeNullfromUndefinedorEmpty($('#RMB_spnAccountNo_View').text().trim()) == null) {
        validate = true;
    }
    else {
        validate = false;
    }


    return validate;
}


function GetInvestigation() {
    $.ajax({
        url: '/Investigation/GetInvestigationDetailsByClaimID',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        data:
            { ClaimID: $('#hdnClaimID').val() },

        dataType: 'json',
        success: function (data) {
            if (data != null) {

                if (data != undefined && data.length > 0) {
                    $('#lnkInvestigationFeedBack').show();

                }
                else
                    $('#lnkInvestigationFeedBack').hide();

            } else {
                $('#lnkInvestigationFeedBack').hide();
            }

        },
        error: function (err) {
            alert(err);

        }
    });

}

function Bind_AuditTrail(data) {
    var uniqueSlNum = [];

    // LOOP THROUGH ORIGINAL ARRAY AND PUT EACH DISTINCT VALUE IN THE UNIQUE ARRAY
    for (i = 0; i < data.length; i++) {
        if (uniqueSlNum.indexOf(data[i].Slno) === -1) {
            uniqueSlNum.push(data[i].Slno);

        }
    }
    var SlNumcount = uniqueSlNum.length;
    var subconditionpanel = '<div id="faq-tab-1" class="tab-pane fade active in">';
    var subconditionpanelHeader = '<a href="#rule-1-5" data-parent="#rule-list-1" data-toggle="collapse" class="accordion-toggle" aria-expanded="true"></a></div>';// '<div class="panel panel-default"><div class="panel-heading"><a href="#rule-list-1-sub-1" data-parent="#rule-list-nested-1" data-toggle="collapse" class="accordion-toggle collapsed"><i class="ace-icon fa fa-plus smaller-80 middle" data-icon-hide="ace-icon fa fa-minus" data-icon-show="ace-icon fa fa-plus"></i>&nbsp;Enim eiusmod high life accusamus terry?</a></div>';
    var subconditionpanelBody = '';
    var tdView = '';
    var tblBody = '';
    var tblP = '';
    var tblheader = '<table class="tablenew col-md-12 table-bordered table-striped table-condensed cf  overflow-y" id="tblAuditTrail"><thead><tr><th class="numeric">Stage </th><th class="numeric">Stage </th><th class="numeric">Claim Type</th><th class="numeric">Request Type</th><th class="numeric">Claimed Amount</th><th class="numeric">IN-Date</th><th class="numeric">OUT-Date</th><th class="numeric">User - Region</th><th class="numeric">Duration</th><th class="numeric">Remarks</th><th class="numeric">Reasons</th></tr></thead>';


    var claimid = ''; var claimtype = ''; var RequestType = '';

    for (var k = 0; k < uniqueSlNum.length; k++) {


        for (var i = 0; i < data.length; i++) {
            if (data != null) {

                if (uniqueSlNum[k] == data[i].Slno) {
                    var tdView = '';
                    if (data[i].ClaimStageID == 23 || data[i].ClaimStageID == 7 || data[i].ClaimStageID == 8 || data[i].ClaimStageID == 17 || data[i].ClaimStageID == 18 || data[i].ClaimStageID == 14) {
                        var tdView = '<td><a class="show-popup"  data-showpopup="10" onclick=Retrieve_Reasons(' + data[i].ActionID + ',' + data[i].ClaimStageID + ',' + data[i].ClaimID + ',' + data[i].Slno + ')><label class="btn btn-warning">View</label></a></td>';
                    }
                    else if (data[i].ClaimStageID == 5) {
                        // var tdView = '<td><a onclick=Retrieve_BillView(' + data[i].ActionID + ',' + data[i].ClaimStageID + ')><label class="btn btn-primary">BillView</label></a></td>';
                        // var tdView = '<td><a onclick=CommonPopup("/Common/BillCalculationPrintView?ClaimID=' + $('#hdnClaimID').val() + '&SlNo=' + $('#hdnClaimSlNo').val() + '")><label class="btn btn-primary">BillView</label></a></td>';
                        var tdView = '<td><a  onclick=myPopup("/Common/BillCalculationPrintView?ClaimID=' + $('#hdnClaimID').val() + '&SlNo=' + uniqueSlNum[k] + '&ClaimTypeID=' + $('#hdnClaimTypeID').val() + '&RequestTypeID=' + $('#hdnRequestTypeID').val() + '&claimstageid=' + $('#hdnClaimStageID').val() + '&caltype=BILLVIEW")><label class="btn btn-warning">BillView</label></a></td>';
                    }
                    else if (data[i].ClaimStageID == 27 && Makezerofromnullorundefined(data[i].CloseDate) != 0) {
                        var tdView = '<td><a class="show-popup"  data-showpopup="19" onclick=SettlementDetails_Retrieve(' + data[i].Slno + ')><label class="btn btn-warning">View</label></a></td>';
                    }
                    else if (data[i].ClaimStageID == 21) {
                        var tdView = '<td><a class="show-popup"  data-showpopup="20" onclick=Retrieve_CancelReasons(' + data[i].ActionID + ',' + data[i].ClaimStageID + ',' + data[i].ClaimID + ',' + data[i].Slno + ')><label class="btn btn-warning">View</label></a></td>';
                    }
                    //else if (data[i].ClaimStageID == 3) {
                    //    var tdView = '<td><a id="modelbutton"   onclick=ShowdDocumentRemarksModel();Retrieve_DocumentComments(' + data[i].ActionID + ',' + data[i].ClaimStageID + ',' + data[i].ClaimID + ',' + data[i].Slno + ')  ><label class="btn btn-warning">View</label></a></td>';
                    //}
                    //else if (data[i].ClaimStageID == 4) {
                    //    var tdView = '<td><a id="modelbutton"   onclick=ShowdBillingRemarksModel();Retrieve_BillingRemarks(' + data[i].ClaimID + ',' + data[i].Slno + ')  ><label class="btn btn-warning">View</label></a></td>';
                    //}
                    else {
                        tdView = '<td></td>';
                    }


                    tblBody = tblBody + '<tr><td data-title="STAGE (Internal)" class="numeric">' + data[i].Name + '</td>'
                        + '<td data-title="STAGE (External)" class="numeric show-popup" data-showpopup="2">' + data[i].ExternalName + '</td>'
                        + '<td data-title = "Claim Type" class="numeric">' + data[i].ClaimType + '</td>'
                        + '<td data-title = "Request Type" class="numeric">' + data[i].RequestType + '</td><td data-title="Claimed Amount" class="numeric">' + data[i].ClaimedAmount + '</td>'
                        + '<td data-title="Open Date" class="numeric">' + JSONDateTime(data[i].OpenDate) + '</td><td data-title="Closed Date" class="numeric">' + MakeNEUasNotApplicable(JSONDateTime(data[i].CloseDate)) + '</td>'
                        + '<td data-title="User - Region" class="numeric">' + data[i].Closedby + '-' + data[i].Region + '</td>'
                        + '<td data-title="Duration" class="numeric">' + MakeNEUasNotApplicable(data[i].Duration) + '</td>'
                        + '<td data-title="Remarks" class="numeric"style="word-break: break-all;">' + MakeNEUasNotApplicable(data[i].Remarks) + '</td>'
                        + tdView + '</tr>';

                    claimid = data[i].ClaimID; claimtype = data[i].ClaimType; RequestType = data[i].RequestType;

                    //alert("" + claimtype);
                }
            }
            //if ($('#hdnRoleID').val() == 35)//Call center executive
            //    $('#tblAuditTrail tr').find('td:eq(0),th:eq(0)').remove();// remove stage internal column
            //else
            //$('#tblAuditTrail tr').find('td:eq(1),th:eq(1)').remove();// remove stage external column


        }

        tblP = tblBody;
        $('#divSerialNum').append('<div id="faq-tab-1" class="tab-pane fade active in"><a id=' + uniqueSlNum[k] + ' href="#rule-1-' + uniqueSlNum[k] + '" data-parent="#rule-list-' + uniqueSlNum[k] + '" data-toggle="collapse" class="accordion-toggle" aria-expanded="true"></a></div><div class="panel-collapse collapse in" id="rule-1' + uniqueSlNum[k] + '" aria-expanded="true" style=""><div class="panel-body"><div id="rule-list-nested' + uniqueSlNum[k] + '" class="panel-group accordion-style1 accordion-style2"><div class="panel-heading"><a href="#rule-list-' + uniqueSlNum[k] + '-sub-27" data-parent="#rule-list-nested-' + uniqueSlNum[k] + '" data-toggle="collapse" class="accordion-toggle"><i class="ace-icon fa fa-minus smaller-80 middle" data-icon-hide="ace-icon fa fa-minus" data-icon-show="ace-icon fa fa-plus"></i>' + claimtype + '-' + RequestType + '-' + claimid + '[' + uniqueSlNum[k] + ']' + '</a></div><div class="panel-collapse collapse in" id="rule-list-' + uniqueSlNum[k] + '-sub-27"><div>' + tblheader + tblP + '</div></div></div></div></div>');
        tblBody = '';

    }
}

//////////// Check All override Rules and Reason ///////////////

function fn_overriderulesAllClick() {
    try {
        if (_rules.length > 0) {
            if ($('#OverrideRulesAll').is(':checked') == true) {

                $.each(_rules, function (i, item) {
                    if (item.TriggerID != 0)
                        $('#btnOverride_' + item.TriggerID).prop('checked', true)
                })
            }
            else
                if ($('#OverrideRulesAll').is(':checked') == false) {
                    $.each(_rules, function (i, item) {
                        if (item.TriggerID != 0)
                            $('#btnOverride_' + item.TriggerID).prop('checked', false);
                    })
                }
        }
    } catch (e) {
        DialogErrorMessage('Error Occured');
    }
}

/////////////////////////

var chkAllrule = [];
function AddRule(data, overrideReasonval, txtmanRemarks) {
    //Commented by Leena ---Already add logic if user dont have rights 
    //var value = $("#hdnIsCopay").val();
    //if (value == "0") {
    //    alert("You don't have access to override the Copay");
    //    return false;
    //}
    //End Leena
    $("#lblOverrideValidationMsg").text('');
    var _InsurerId = $('#hdnInsuranceCompanyID').val();
    var _OverrideReasons = FormatHtml_Dropdown(MasterData.ClaimOverirdeReasons);
    var ruleVal = $("#ddlRule option:selected").val();
    var ruleText = $("#ddlRule option:selected").text();
    var ruleReason = $("#ddloverrideReason option:selected").val();
    var ruleRemarks = $("#txtmanualRemrks").val();

    //SP3V-1611 Added by leena
    if ((ruleVal == 0)) {
        //DialogWarningMessage("You don't have access to " + strrule);
        DialogWarningMessage("Please select first Override Rule");
        return false;
    }
    //Added condition for _InsurerId - 30 Acko 12apr2023
    if (ruleVal == 533) {
        //if (_InsurerId != 30) { 
        //    //DialogWarningMessage("This functionality is applicable for Acko Insurer only.");
        //    $("#lblOverrideValidationMsg").text("This functionality is applicable for Acko Insurer only.");
        //    return false;
        //}
        //SP3V-1611 Added by leena if remaining deductible amt is zero do not allow to add rule
        if (_balanceDeductibleAmt == 0) {
            $("#lblOverrideValidationMsg").text("Deductible Balance Amount is zero. Can not add Override Rule.");
            return false;
        }
    }
    //End 
    var dtuserMenu = MasterData.dtuserMenu;
    dtuserMenu = $.parseJSON(dtuserMenu);
    dtuserMenu = dtuserMenu["Table1"];
    var strrule = ruleText;
    var dtFindRule = dtuserMenu.filter(
        function (item) {
            return item.Name == strrule;
        });

    if (((dtFindRule == null) || dtFindRule.length <= 0) && ruleVal != 727 && ruleVal != 726 && ruleVal != 728) {
        //DialogWarningMessage("You don't have access to " + strrule);
        $("#lblOverrideValidationMsg").text("You don't have Permission to " + strrule);
        return false;
    }
    //End SP3V-1611 Leena

    for (var i = 0; i < rule.length; i++) {
        var name = rule[i];
        if (name == ruleVal) {
            _ruleStatus = false;
        }
    }


    if (ruleVal != 0 && ruleReason != 0 && ruleRemarks != "") {
        if (_ruleStatus == true) {
            var tbloverRideruleBody = ' <tr id="troverrideRuleapproval_' + ruleVal + '" class="overrideRules"><td data-title="Rule ID"><span id="spnRuleID_' + ruleVal + '">0</span></td><td data-title="Rule Name"><span id="spnRuleName_' + ruleVal + '">' + ruleText + '</span></td>'
                + '<td data-title="Override"><label class="inline"><input id="btnOverride_' + ruleVal + '"  type="checkbox" checked="checked" name="chkOverride" class="ace ace-switch ace-switch-5" onclick="fnOverriderules(this,' + ruleVal + ')">'
                + ' <span class="lbl middle"></span></label></td>'
                + '<td data-title="Override Reason"><select id="ddlOverrideReasons_' + ruleVal + '" class="form-control"><option value="0">-Select-</option>' + _OverrideReasons + '</select></td>'
                + '<td data-title="Override Remarks"><textarea class="form-control form-textarea" id="taOverRideRemarks_' + ruleVal + '" required=""></textarea><span data-title="Remove" class="clsremove"><a id="aCodingDelete_' + ruleVal + '" onclick="fn_Removerules(' + ruleVal + ')" class="btn btn-danger btn-xs"><span class="glyphicon glyphicon-trash"></span></a></span></td></tr>';
            $('#tbloverrideRuleApproval tbody').append(tbloverRideruleBody);

            $('#ddlOverrideReasons_' + ruleVal + '').val(overrideReasonval);
            $('#taOverRideRemarks_' + ruleVal + '').val(txtmanRemarks);
            $('#btnOverride_' + ruleVal + '').attr('disabled', 'disabled');

            rule.push(ruleVal);

            $('#ddlRule').val(0);
            $('#ddloverrideReason').val(0);
            $('#txtmanualRemrks').val('');

            $("#popupManualrule").modal('hide');
            $("#hdnIsCopayDone").val("Yes");

        } else {
            alert(ruleText + ' rule already exist.');
        }

        ///////  Copay TextBox //////////////
        if (ruleVal == 391) {
            outofPolicyStatus = true;
        }
        else if (ruleVal == 390) {
            $('.txtCoPaymentOverride').removeAttr('style');
            $('.lbltxtCoPayment').hide();
            copaystatus = true;
        }
        //sp3v-1611 Leena
        else if (ruleVal == 533) {
            $('.txtDeductibleOverride').removeAttr('style');
            $('.lbltxtDeductible').hide();
            OverrideDeductible = true;
            //$('.txtDeductibleOverride').val(_balanceDeductibleAmt); 12apr2023Commented by leena by default display zero
            $('.txtDeductibleOverride').val(0);
        }
        //End sp3v-1611 Leena
        else if (ruleVal == 727) {
            submissionflag = true;
        }
        else if (ruleVal == 726) {
            isoverridewaitingperid = true;
        }
        else if (ruleVal == 728) {
            isAlimentoverride = true;
        }
        else {
            $('.txtCoPaymentOverride').hide();
            $('.lbltxtCoPayment').show();
            copaystatus = false;

            //sp3v-1611 Leena
            $('.txtDeductibleOverride').hide();
            $('.lbltxtDeductible').show();
            OverrideDeductible = false;
            //End sp3v-1611 Leena
            submissionflag = false;
            isoverridewaitingperid = false;
            isAlimentoverride = false;
        }
        /////////////////////////////////////////
    } else {
        alert('Please fill all the fields.')
    }
}

function fn_Removerules(ruleId) {

    $('table#tbloverrideRuleApproval tr#troverrideRuleapproval_' + ruleId + '').remove();
    if (ruleId == 391) {
        outofPolicyStatus = false;
    }
    else if (ruleId == 390) {
        $('.txtCoPaymentOverride').hide();
        $('.lbltxtCoPayment').show();
        copaystatus = false;
        //************** For Task: (SP-1103)
        $('.txtCoPaymentOverride').val("");
        //**************
    }
    //SP3V-1611 Leena
    else if (ruleId == 533) {
        $('.txtDeductibleOverride').hide();
        $('.lbltxtDeductible').show();
        OverrideDeductible = false;
        $('.txtDeductibleOverride').val("");

    }
    //END SP3V-1611 Leena
    else if (ruleId == 726) {
        isoverridewaitingperid = false;
    }
    else if (ruleId == 727) {
        submissionflag = false;
    }
    else if (ruleId == 728) {
        isAlimentoverride = false;
    }
    else {
        $('.txtCoPaymentOverride').removeAttr('style');
        $('.lbltxtCoPayment').hide();
        copaystatus = true;

        //SP3V-1611 Leena
        $('.txtDeductibleOverride').removeAttr('style');
        $('.lbltxtDeductible').hide();
        OverrideDeductible = false;
        //End SP3V-1611
    }
    rule.pop(ruleId);
}


//***********Audit Process Bank details binding script here********************//

function LoadBankdetails(_ClaimID, _SrNo) {
    //if ($("#" + _spnSystemPatient_PatientName).text() == "") { }
    $.ajax({
        //type: "POST",
        url: "/Claims/GetBankDetails",
        contentType: 'application/json;charset=utf-8',
        //processData: false,
        data: { ClaimID: _ClaimID, SlNo: _SrNo },
        success: function (data) {


            if (data == null || data == "") {
                //alert('Data not found.');

            }
            else {
                data = $.parseJSON(data);

                if (data.Table.length > 0) {

                    if (parseInt($('#hdnClaimTypeID').val()) == 1) {
                        if (data.Table[0].payeeTypeID == null) {
                            $("#CL_spnpayeetype_View").html('Hospital');
                            $("#CL_spnpayeetype_View").html(data.Table[0].PayeeType);
                            $("#CL_spnpayeename_View").html(data.Table[0].PayeeName);
                            //$("#CL_spnIFSCCode_View").html(data.Table[0].IFSCCode);
                            if ($('#hdnInsuranceCompanyID').val() === "14") {
                                Maskvalue("#CL_spnIFSCCode_View", data.Table[0].IFSCCode, 1);
                            }
                            else {
                                $("#CL_spnIFSCCode_View").html(data.Table[0].IFSCCode);
                            }
                            $("#CL_spnBankName_View").html(data.Table[0].Bank);
                            $("#CL_spnBranchName_View").html(data.Table[0].Branch);
                            if ($('#hdnInsuranceCompanyID').val() === "14") {
                                Maskvalue("#CL_spnAccountNo_View", data.Table[0].AccountNumber, 1);
                            }
                            else {
                                $("#CL_spnAccountNo_View").html(data.Table[0].AccountNumber);
                            }



                        }
                    }

                    else {

                        if (data.Table[0].payeeTypeID != null) {

                            $("#RMB_spnpayeetype_View").html(getNamepropwithId(data.Table[0].payeeTypeID, MasterData.PayeeType));
                            $("#RMB_spnpayeename_View").html(data.Table[0].PayeeName);
                            //$("#RMB_spnIFSCCode_View").html(data.Table[0].IFSCCode);
                            if ($('#hdnInsuranceCompanyID').val() === "14") {
                                Maskvalue("#RMB_spnIFSCCode_View", data.Table[0].IFSCCode, 1);
                            }
                            else {
                                $("#RMB_spnIFSCCode_View").html(data.Table[0].IFSCCode);
                            }
                            $("#RMB_spnBankName_View").html(data.Table[0].Bank);
                            $("#RMB_spnBranchName_View").html(data.Table[0].Branch);
                            //$("#RMB_spnAccountNo_View").html(data.Table[0].AccountNumber);
                            if ($('#hdnInsuranceCompanyID').val() === "14") {
                                Maskvalue("#RMB_spnAccountNo_View", data.Table[0].AccountNumber, 1);
                            }
                            else {
                                $("#RMB_spnAccountNo_View").html(data.Table[0].AccountNumber);
                            }

                            if ($("#hdnNEFTValidation").val() != "0") {
                                $("#TBD_spnpayeetype_View").html(getNamepropwithId(data.Table[0].payeeTypeID, MasterData.PayeeType));
                                $("#TBD_spnpayeename_View").html(data.Table[0].PayeeName);
                                //$("#TBD_spnIFSCCode_View").html(data.Table1[0].IFSCode);
                                if ($('#hdnInsuranceCompanyID').val() === "14") {
                                    Maskvalue("#TBD_spnIFSCCode_View", data.Table1[0].IFSCode, 1);
                                }
                                else {
                                    $("#TBD_spnIFSCCode_View").html(data.Table1[0].IFSCode);
                                }
                                $("#TBD_spnBankName_View").html(data.Table1[0].BankName);
                                $("#TBD_spnBranchName_View").html(data.Table1[0].Branch);
                                //$("#TBD_spnAccountNo_View").html(data.Table1[0].BankAccountNo);
                                if ($('#hdnInsuranceCompanyID').val() === "14") {
                                    Maskvalue("#TBD_spnAccountNo_View", data.Table1[0].BankAccountNo, 1);
                                }
                                else {
                                    $("#TBD_spnAccountNo_View").html(data.Table1[0].BankAccountNo);
                                }
                                if ($('#rbTempBankDetails').is(':checked') == true) {
                                    if ($('#hdnMainMemberPolicyID').val() == $('#hdnMemberPolicyID').val() && $('#ddlPatientCondition').val() == "271") {
                                        if ($("#hdnPayeeTypeID").val() == 2 || $("#hdnPayeeTypeID").val() == 3) {
                                            _claimdetails["NomineePayeeName"] = $("#spnNomineePayeeName").text();
                                        }
                                        else if ($("#hdnPayeeTypeID").val() == 4 || MakeNullfromUndefinedorEmpty(basicData[0].ProposerName) == MakeNullfromUndefinedorEmpty(basicData[0].MemberName)) {
                                            _claimdetails["NomineePayeeName"] = $("#spnNomineePayeeName").text();
                                        }
                                    }
                                }
                            }

                        }
                        else {

                            //$("#RMB_spnpayeetype_View").html('Hospital');
                            //$("#RMB_spnpayeename_View").html(data.Table[0].PayeeName);
                            //$("#RMB_spnIFSCCode_View").html(data.Table[0].IFSCCode);
                            //$("#RMB_spnBankName_View").html(data.Table[0].Bank);
                            //$("#RMB_spnBranchName_View").html(data.Table[0].Branch);
                            //$("#RMB_spnAccountNo_View").html(data.Table[0].AccountNumber);

                            //$("#TBD_spnpayeetype_View").html('Hospital');
                            //$("#TBD_spnIFSCCode_View").html(data.Table1[0].IFSCCode);
                            //$("#TBD_spnBankName_View").html(data.Table1[0].Bank);
                            //$("#TBD_spnBranchName_View").html(data.Table1[0].Branch);
                            //$("#TBD_spnAccountNo_View").html(data.Table1[0].BankAccountNo);
                        }

                    }
                }
                var insurerValue = basicData[0].IssueID;
                if (insurerValue == 20) {
                    $("#DivTempDetails").show();
                    $('#rbTempBankDetails').prop('disabled', false);
                    $('#rbTempBankDetails').removeAttr('title');
                }
                else if (isMemberBankDetailsComplete()) {
                    $('#rbTempBankDetails').prop('disabled', false);
                } else {
                    $('#rbTempBankDetails').prop('disabled', true);
                    $('#rbTempBankDetails').removeAttr('title');
                }

            }
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
}

$('#rbTempBankDetails').change(function () {

    $('.temp_bankdetials td span').show();
    $('.sys_bankdetials td span').show();

    if ($('#TBD_spnpayeetype_View').html() == "" || $('#TBD_spnpayeetype_View').html() == null || $('#TBD_spnpayeetype_View').html() == 0) {
        $("#TBD_spnpayeetype_View").html('Is mandatory').addClass("madatory");

    }
    if ($('#TBD_spnpayeename_View').text() == "" || $('#TBD_spnpayeename_View').text() == null || $('#TBD_spnpayeename_View').text() == 0) {
        $("#TBD_spnpayeename_View").html('Is mandatory').addClass("madatory");
    }

    if ($('#TBD_spnIFSCCode_View').text() == "" || $('#TBD_spnIFSCCode_View').text() == null || $('#TBD_spnIFSCCode_View').text() == 0) {
        $("#TBD_spnIFSCCode_View").html('Is mandatory').addClass("madatory");

    }
    if ($('#TBD_spnBankName_View').text() == "" || $('#TBD_spnBankName_View').text() == null || $('#TBD_spnBankName_View').text() == 0) {
        $("#TBD_spnBankName_View").html('Is mandatory').addClass("madatory");

    }
    if ($('#TBD_spnBranchName_View').text() == "" || $('#TBD_spnBranchName_View').text() == null) {
        $("#TBD_spnBranchName_View").html('Is mandatory').addClass("madatory");
    }
    if ($('#TBD_spnAccountNo_View').text() == "" || $('#TBD_spnAccountNo_View').text() == null || $('#TBD_spnAccountNo_View').text() == 0) {
        $("#TBD_spnAccountNo_View").html('Is mandatory').addClass("madatory");
    }
    else {
        //  $('#btnAuditSubmit').css("display", "none");
    }
});

$('#rbSystemBankDetails').change(function () {
    {
        $('.temp_bankdetials td span').show();
        $('.sys_bankdetials td span').show();

        if ($('#RMB_spnpayeetype_View').html() == "" || $('#RMB_spnpayeetype_View').html() == null) {
            $("#RMB_spnpayeetype_View").html('Is mandatory').addClass("madatory");

        }
        if ($('#RMB_spnpayeename_View').text() == "" || $('#RMB_spnpayeename_View').text() == null) {
            $("#RMB_spnpayeename_View").html('Is mandatory').addClass("madatory");

        }
        if ($('#RMB_spnIFSCCode_View').text() == "" || $('#RMB_spnIFSCCode_View').text() == null) {
            $("#RMB_spnIFSCCode_View").html('Is mandatory').addClass("madatory");

        }
        if ($('#RMB_spnBankName_View').text() == "" || $('#RMB_spnBankName_View').text() == null) {
            $("#RMB_spnBankName_View").html('Is mandatory').addClass("madatory");

        }
        if ($('#RMB_spnBranchName_View').text() == "" || $('#RMB_spnBranchName_View').text() == null) {
            $("#RMB_spnBranchName_View").html('Is mandatory').addClass("madatory");

        }
        if ($('#RMB_spnAccountNo_View').text() == "" || $('#RMB_spnAccountNo_View').text() == null) {
            $("#RMB_spnAccountNo_View").html('Is mandatory').addClass("madatory");
        }
    }
});


//************************************************************** 
//               For Task: (SP-1180)
//**************************************************************
var providerstatus;
function CheckIsValidProvider() {
    providerstatus = "";
    if ($("#hdnObjValidProvider").val() != "" && $("#hdnClaimStageID").val() == 5) {
        var objProvider = JSON.parse($("#hdnObjValidProvider").val());
        if (objProvider.length > 0) {
            providerstatus = objProvider[0].ProviderStatus;
            return objProvider[0].IsValidProvider;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}


//************************************************************** 
//               For Task: (SP-1103)
//**************************************************************
function DisableCodingElements() {
    var isCodingDisable = $("#hdnIsCodingDisable").val();
    if (isCodingDisable == 1) {
        $("#ddlTreatmentType").attr("disabled", "disabled");
        $("#ddlProcedureLevel1").attr("disabled", "disabled");
        $("#ddlProcedureLevel2").attr("disabled", "disabled");
        $("#ddlProcedureLevel3").attr("disabled", "disabled");
        $("#ddlPriority").attr("disabled", "disabled");
        $("#ddlAnesthesia").attr("disabled", "disabled");
        $("#txtSurgeryDate").attr("disabled", "disabled");
        $("#ddlDeductionReasons").attr("disabled", "disabled");
    }
    else {
        $("#ddlTreatmentType").removeAttr('disabled');
        $("#ddlProcedureLevel1").removeAttr('disabled');
        $("#ddlProcedureLevel2").removeAttr('disabled');
        $("#ddlProcedureLevel3").removeAttr('disabled');
        $("#ddlPriority").removeAttr('disabled');
        $("#ddlAnesthesia").removeAttr('disabled');
        $("#txtSurgeryDate").removeAttr('disabled');
        $("#ddlDeductionReasons").removeAttr('disabled');
    }
}

function SaveCalculationReProcessInfo() {
    _claimdetails = {};
    _claimdetails["ClaimID"] = $('#hdnClaimID').val();
    _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
    _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
    _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
    _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
    _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
    _claimdetails["ClaimStageID"] = $('#hdnClaimStageID').val();
    if ($('#ClaimStageID').val() == 22) {
        _claimdetails["RoleID"] = 16;
    }
    _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();

    var _overrideCopayRuleObj = [];
    $('#tbloverrideRuleApproval > tbody  > tr').each(function () {
        var _objCopayRule = {};
        var id = this.id;
        var _triggerID = id.split('_')[1];
        var name = $('#spnRuleName_' + _triggerID + '').text();
        _objCopayRule["TriggerID"] = _triggerID;
        _objCopayRule["RuleName"] = name;
        if ($('#btnOverride_' + _triggerID).is(':checked') == true)
            _objCopayRule["isOverride"] = "1";
        else
            _objCopayRule["isOverride"] = "0";
        _objCopayRule["OverrideReasonIDs_P34"] = $('#ddlOverrideReasons_' + _triggerID).val();
        if ($('#taOverRideRemarks_' + _triggerID).val() != "") {
            _objCopayRule["OverRideRemarks"] = $('#taOverRideRemarks_' + _triggerID).val();
        } else {
            _objCopayRule["OverRideRemarks"] = null;
        }
        _objCopayRule["OverrideruleID"] = _triggerID;
        // Added By Venkat Mandadi
        // As discussed with Srinu bathina (If there is no general condition rules BPConditionid for manual/override rules is: 8)
        _objCopayRule["BPConditionID"] = "8";
        _overrideCopayRuleObj.push(_objCopayRule);
    });

    if (_overrideCopayRuleObj.length == 0) {
        var _objCopayRule = {};
        _objCopayRule["TriggerID"] = null;
        _objCopayRule["RuleName"] = null;
        _objCopayRule["isOverride"] = null;
        _objCopayRule["OverrideReasonIDs_P34"] = null;
        _objCopayRule["OverRideRemarks"] = null;
        _objCopayRule["OverrideruleID"] = null;
        _objCopayRule["BPConditionID"] = null;
        _overrideCopayRuleObj.push(_objCopayRule);
    }

    var _overRideCopayRule = JSON.stringify(_overrideCopayRuleObj);
    var _objClaimDetails = JSON.stringify(_claimdetails);

    if (_objClaimDetails != null) {
        if (utilizedamtarray.length == 0) {
            var _utilizedamt = {
            };
            _utilizedamt["MemberSIID"] = null;
            _utilizedamt["SanctionedAmount"] = null;
            _utilizedamt["BalanceAmount"] = null;
            utilizedamtarray.push(_utilizedamt);
        }
        if (copaystatus == true) {
            copaymentAmt = $('.txtCoPaymentOverride').val();
            if ($('.txtCoPaymentOverride').val() == "" || $('.txtCoPaymentOverride').val() == null) {
                alert('Please enter copayment amount');
                return false;
            }
        }


        if ($('#SkipScrutiny').is(':checked') == true)
            AuditSkipScrutiny = true;
        else
            AuditSkipScrutiny = false;


        //$(".se-pre-con").fadeIn();
        $.ajax({
            type: "GET",
            url: "/MedicalScrutiny/SaveCalculationReProcessInfo",
            contentType: 'application/json;charset=utf-8',
            data: {
                ClaimDetails: _objClaimDetails, Rules: _overRideCopayRule, DiscountByHospital: _hospitalDiscount, EligibleAmount: _eligibleAmount, Deductible: _calculatedDeductibleAmt,
                CoPayment: copaymentAmt, NetEligibleAmount: _neteligibleAmount, Excess_SI: _excessSuminsured, Excess_Preauth: _exceedingPreauth,
                ExcessPaidByPatient: _excesspaidbyPatient, AdmissibleAmount: _admissibleAmount, EligiblePayableAmount: _eligiblepayableAmt,
                NegotiatedAmount: _negotiatedDiscount, GrossAmount: _grosspayableAmt, TDSAmount: _tdsAmount, NetAmount: _netpayableAmount,
                PaidByPatient: _patientpaidAmount, BufferUtilized: bufferUtilizedAmount, Copayhtml: htmlEncode(_copayhtml),
                ClaimUtilization: JSON.stringify(utilizedamtarray), DoctorNotes: $('#txtDoctorRemarks').val(),
                AdditionalNotes: $('#txtAdditionalRemarks').val(), NottoDeductFromHospital: isEPAnottodeductfrommhospital, EarlyPaymentDiscountAmount: _earlyPaymentDiscountAmt, //Added for Task (SP-1307)
                AuditSkipScrutiny: AuditSkipScrutiny, PremiumAmount: _premiumAmt, modularamount: $("#txtModularAmt").val(), Patienttobepaid: $("#txtpatienttobepaid").val(),
                 PMTNegotiatedDiscount: _PMTNegotiatedDiscount
            },
            success: function (resData) {
                var objRes = $.parseJSON(resData);
                //$(".se-pre-con").fadeOut();
                if (objRes[0].Flag == 1) {
                    window.location = "/MedicalScrutiny/NavIndex?ClaimID=" + $('#hdnClaimID').val() + "&SlNo=" + $('#hdnClaimSlNo').val() + "&SID=" + $('#hdnClaimStageID').val() + "&AID=" + objRes[0].ActionItemID + "&QMS=" + $("#hdnQMS").val() + "&QMSadmin" + $("#hdnQMS").val();
                }
                DialogResultMessage(objRes[0].Msg);
            },
            error: function (e, x) {
                //$(".se-pre-con").fadeOut();
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });
    }
}

function GetCopayRules() {
    //$(".se-pre-con").fadeIn();
    $.ajax({
        type: "GET",
        url: "/MedicalScrutiny/Claims_RuleEngine",
        contentType: 'application/json;charset=utf-8',
        beforeSend: function () { $("#progress1").show(); },
        //processData: false,
        data: {
            ClaimID: $('#hdnClaimID').val(), MemberPolicyID: $('#hdnMemberPolicyID').val(), Slno: $('#hdnClaimSlNo').val()
        },
        success: function (data) {
            $("#progress1").hide();
            //$(".se-pre-con").fadeOut();
            CheckSessionVariable(data.responseText);
            data = $.parseJSON(data);
            for (var i = 0; i < data.length; i++) {
                if (data[i].isTrue == false && data[i].iscovered == true && (data[i].CopayValue != null || data[i].CopayPerc != null)) {
                    var _objrules = {
                    };
                    if (data[i].ID != "" && data[i].ID != null) {
                        _objrules["per"] = data[i].CopayPerc;
                        _objrules["val"] = data[i].CopayValue;
                        _objrules["lm"] = data[i].isLess;
                        _objrules["IsAccumulate"] = data[i].isICRCopay;
                        _objrules["BPConditionID"] = data[i].BPConditionID;
                        _objrules["BPSubConditionID"] = data[i].BPSubConditionID;
                        //_objrules["isOverride"] = data[i].isOverride;
                        //_objrules["OverrideReasonIDs_P34"] = data[i].OverrideReasonIDs_P34;
                        //_objrules["OverRideRemarks"] = data[i].OverRideRemarks;
                        _copayrules.push(_objrules);
                    }
                }
            }
            //ReprocessBillingDetails();
            BillCalculator();
        },
        error: function (e, x) {
            $("#progress1").hide();
            //$(".se-pre-con").fadeOut();
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
}

function SaveReAuditInfo() {
    if (!outofPolicyStatus) {
        var basicstartDate = basicData[0].MemberCommencingDate;
        var basicendDate = basicData[0].MemberEndDate;
        var _basicdoa = basicData[0].dateofadmission;
        var startDate = basicstartDate
        var endDate = basicendDate
        var _doa = _basicdoa
        if (_doa < startDate) {
            DialogWarningMessage("Admission is falling out of policy period.Please add override rule to approve the claim");
            return false;
        }
        else if (_doa > endDate) {
            DialogWarningMessage("Admission is falling out of policy period.Please add override rule to approve the claim");
            return false;
        }
    }
    if (utilizedamtarray.length == 0) {
        if (basicData[0].IsBufferEnabled == true) {
            SaveCalculationReProcessInfo();
        }
        else if (_requesttype == 12) {
            SaveCalculationReProcessInfo();
        }
        else {
            DialogWarningMessage("Bill amounts not calculated")
        }
    }
    else if (utilizedamtarray.length > 0) {
        SaveCalculationReProcessInfo();
    }
}

function ValidateReAuditInfo() {
    if (isproportionatechanged == true) {
        DialogWarningMessage("As you override proportionate, first save bill details and then approve");
        return false;
    }
    //SP3V-1697 Leena
    var InsurerId = $('#hdnInsuranceCompanyID').val();
    var _ClaimTypeID = $('#hdnClaimTypeID').val();
    var _RequestTypeID = $("#hdnRequestTypeID").val();

    var DischargeTypeId = '';
    if ((InsurerId == 5) && ((_RequestTypeID != 1) && (_RequestTypeID != 2) && (_RequestTypeID != 3))) {
        if ($('#ddlDischargeType').val() != '') {
            DischargeTypeId = $('#ddlDischargeType').val();
        }

        if ((DischargeTypeId == '0' || DischargeTypeId == null || DischargeTypeId == '' || DischargeTypeId == 'undefiened')) {
            DialogResultMessage("Please Select Discharge Type.");
            return false;
        }
    }

    if (_grosspayableAmt < $("#txtModularAmt").val()) {
        DialogResultMessage("Modular amount should be less than sanctioned amount");
        return false;
    }
    //END SP3V-1697 Leena
    // ClaimAI: BillingCorrection validation removed
    if (chkQP_MandatoryRecords()) {
        DialogWarningMessage('You can not approve the claim as it is in query pending.');
    }
    else if ($("#ddlRequestType").val() != 1 && $("#ddlRequestType").val() != 2 && MakeNullfromUndefinedorEmpty(_dod) == null) {
        DialogWarningMessage('You can not approve the claim without Date of discharge');
    }
    else {
        var bpsiId = $("#hdnBPSIID").val();
        var excessSumInsured = $("#txtExcessSumInsured").text(); var flagNo = $("#hdnNo").val();
        if (parseInt(excessSumInsured) != 0 && $('#hdnPolicyTypeID').val() == "3") {
            //if (isBufferRulesConfigured(bpsiId) && (flagNo == "false") && basicData[0].IsBufferEnabled != true) {
            //    //$("#modalBuffer").modal('show');
            //    alert("Buffer is available for this member. Push the claim back to adjudication");
            //}
            //else {
            if (_netpayableAmount >= 0 || (_remainingdeductableAmount > 0)) {
                SaveReAuditInfo();
            }
            else {
                DialogWarningMessage('Net payable amount is 0. Please click "Calculate" button to display the Net Payable amount; or Member Balance Sum Insured exhausted');
            }
            //}
        }
        else {
            if (_netpayableAmount >= 0 || (_remainingdeductableAmount > 0)) {
                SaveReAuditInfo();
            }
            else {
                DialogWarningMessage('Net payable amount is 0. Please click "Calculate" button to display the Net Payable amount; or Member Balance Sum Insured exhausted');
            }
        }
    }
}

function ReProcess_BillAmounts() {
    _copayrules = [];
    ShowOverideLable(); //SP3V-1611 Leena
    var _memberPolicyId = $('#hdnMemberPolicyID').val();
    var _siTypeId = $('#hdnSITypeID').val();
    var _claimId = $('#hdnClaimID').val();
    var _slNo = $('#hdnClaimSlNo').val();
    if (_memberPolicyId > 0 && _siTypeId > 0) {
        //$(".se-pre-con").fadeIn();
        $.ajax({
            type: "GET",
            url: "/MedicalScrutiny/RetainSIAmountsToReserved",
            contentType: 'application/json;charset=utf-8',
            beforeSend: function () { $("#progress1").show(); },
            data: {
                memberPolicyId: _memberPolicyId, siTypeId: _siTypeId, claimId: _claimId, slNo: _slNo
            },
            success: function (resData) {
                $("#progress1").hide();
                //$(".se-pre-con").fadeOut();
                var objResp = $.parseJSON(resData);
                if (objResp[0].resFlag == 3) {
                    CheckSessionVariable(objResp[0].Message);
                }
                else if (objResp[0].resFlag == 1) {
                    var objSumInsured = $.parseJSON(objResp[0].ResponseData);
                    if (objSumInsured["Suminsured"].length > 0) {
                        _objBsi = objSumInsured;
                    }
                    if (copaystatus == false) {
                        //GetCopayRules();
                        var copaydata = $.parseJSON(objResp[0].ResponseData1);
                        for (var i = 0; i < copaydata.length; i++) {
                            if (copaydata[i].isTrue == false && copaydata[i].iscovered == true && (copaydata[i].CopayValue != null || copaydata[i].CopayPerc != null)) {
                                var _objrules = {
                                };
                                if (copaydata[i].ID != "" && copaydata[i].ID != null) {
                                    _objrules["per"] = copaydata[i].CopayPerc;
                                    _objrules["val"] = copaydata[i].CopayValue;
                                    _objrules["lm"] = copaydata[i].isLess;
                                    _objrules["IsAccumulate"] = copaydata[i].isICRCopay;
                                    _objrules["BPConditionID"] = copaydata[i].BPConditionID;
                                    _objrules["BPSubConditionID"] = copaydata[i].BPSubConditionID;
                                    _objrules["copayonbuffer"] = copaydata[i].copayonbuffer;
                                    _copayrules.push(_objrules);
                                }
                            }
                        }
                        BillCalculator();
                    }
                    else {
                        BillCalculator();
                    }
                }
                else {
                    DialogResultMessage("Error occured while re-calculating, Please try again.");
                }
            },
            error: function (e, x) {
                $("#progress1").hide();
                //$(".se-pre-con").fadeOut();
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });
    }
}

//********** For Repudiated Task ********
function For_Repudiated_Insert(_stageID, _roleID) {
    var _ClaimID = $('#hdnClaimID').val();
    var _Slno = $('#hdnClaimSlNo').val();
    var _StageID = _stageID;
    var _RoleID = _roleID;
    var _Remarks = $('#for_repudiate_remarks').val()
    $.ajax({
        type: "GET",
        url: "/MedicalScrutiny/For_Repudiated_Insert",
        contentType: 'application/json;charset=utf-8',
        data: {
            ClaimID: _ClaimID, Slno: _Slno, Remarks: _Remarks
        },
        success: function (data) {
            CheckSessionVariable(data.responseText);

            if (data != null) {
                DialogResultMessage("Rejected successful");

            }
            $('.popup25').hide();

        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
}

//****************** GetReferToCRM
function GetReferToCRM(_ClaimID, _SlNo) {
    if (basicData[0].IS_ADJ_FROM_QR == 1 && isQuery_Responsed == 0) {
        setTimeout(function () {
            $(".popup41").attr("style", "display:none !important;");
        }, 100);
        DialogWarningMessage("Response Generated for the Raised Queries. please Process first before moving to other Stages");
        return false;
    }
    BindDropdown(MasterData.mReferToCRM, "ddlReferToCRM");
    $("#ddlReferToCRM").val(0);
    $('#ddlReferToCRM').prop("disabled", false);
    if ($("#hdnRequestTypeID").val() == "4") {
        $('#ddlReferToCRM option[value=411]').prop('disabled', true);
    }
    if (RemoveCMORemarks == 0 && $("#hdnStageID").val() != 10 && basicData[0].Isrefertocrm == true) {
        $('#ddlReferToCRM option[value="720"]').remove();
        $('#ddlReferToCRM option[value="721"]').remove();
    }
    if ($("#hdnStageID").val() == 10) {
        //if ($('#tblQueryDocuments tbody').children().length == 0) {
        $.ajax({
            //type: "POST",
            url: "/MedicalScrutiny/ReferToCRMDetails_Retrieve",
            contentType: 'application/json;charset=utf-8',
            //processData: false,
            data: {
                ClaimID: _ClaimID, SlNo: _SlNo
            },
            success: function (data) {
                CheckSessionVariable(data.responseText);
                data = $.parseJSON(data);
                if (data == null || data == "") {
                    //alert('Data not found.');
                }
                else {
                    $('#ddlReferToCRM').val(data[0].PID);
                    $('#taReferto_CRMRemarks').val(data[0].Remarks);
                }
            },
            error: function (e, x) {
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });
        //}
    }
    else {
        if (basicData[0].Isrefertocrm == true && RemoveCMORemarks == 1) {
            if (parseInt($("#txtPayableAmount").text()) >= parseInt(basicData[0].cmo_thresholdlimit)) {
                $('#ddlReferToCRM').val(720);
                $('#ddlReferToCRM').prop("disabled", true);
            }
            else if (parseInt($("#txtPayableAmount").text()) >= parseInt(basicData[0].Mbbs_thresholdlimit)) {
                $('#ddlReferToCRM').val(721);
                $('#ddlReferToCRM').prop("disabled", true);
            }

        }
    }
}


$("#BufferwithoutBase").click(function () {
    if ($('#BufferwithoutBase').is(':checked') == true) {
        isbufferwithoutbase = true;
        $("#exampleModalApprove").modal('show');

        element = document.getElementById("topupdata");
        element.classList.remove("div100");
        element = document.getElementById("bufferdivdata");
        element.classList.add("div100");
        $("#topupdata").hide();
        $("#bufferdivdata").show();
        element = document.getElementById("BufferTopSize");
        element.classList.add("divsingleTopup");
        FetchBufferEligibleAmount();
    }
});

function GeneratingApprovalLetter(_stageID, _ctrlReason, _ctrlRemarks, _roleID, isApprove) {
    _claimdetails = {};
    _claimdetails["ClaimID"] = $('#hdnClaimID').val();
    _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
    _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
    _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
    _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
    _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
    _claimdetails["ClaimStageID"] = _stageID;
    _claimdetails["RoleID"] = _roleID;
    _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();
    _claimdetails["AgentID"] = $("#hdnAgentID").val();
    _claimdetails["PayeeType"] = null;
    _claimdetails["ReasonIDs_P"] = null;
    _claimdetails["PayeeType"] = 1;
    _claimdetails["NomineePayeeName"] = $("#txtEnrollment_PayeeName").text();

    if ($('#' + _ctrlRemarks).val() != '' || $('#' + _ctrlRemarks).val() != null) {
        _claimdetails["Remarks"] = $('#' + _ctrlRemarks).val();
    }
    else {
        _claimdetails["Remarks"] = null;
        // DialogWarningMessage('Please select Remarks To Submit');
        // return false;
    }

    $.ajax({
        //type: "POST",
        url: "/MedicalScrutiny/GeneratingApprovalLetter",
        contentType: 'application/json;charset=utf-8',
        beforeSend: function () { $("#progress1").show(); },
        data: {
            ClaimDetails: JSON.stringify(_claimdetails), isApprove: (isApprove == 1) ? true : false, PolicyType: $('#hdnPolicyTypeID').val(),
            MainMemberPolicyID: $('#hdnMemberPolicyID').val(), PolicyID: $('#hdnPolicyID').val(), ProviderID: $('#hdnProviderID').val(),
            BrokerID: $('#hdnBrokerID').val(), PayerID: $('#hdnPayerID').val(), CorporateID: $('#hdnCorporateID').val(),
            InsuranceCompanyID: $('#hdnInsuranceCompanyID').val()
        },
        success: function (data) {
            // CheckSessionVariable(data.responseText);
            var data1 = $.parseJSON(data);
            if (data1.length > 0) {
                Bind_Communications(data1);
            }
            $("#progress1").hide();
            DialogResultMessage('Approval letter sent successfully');

            //if (data == 'Saved Successfully')
            // window.location = '/Claims/Index';
        },
        error: function (e, x) {
            $("#progress1").hide();
            ShowResultMessage('ErrorMessage', e.statusText);
        }
    });

    $('#' + _ctrlReason).val('0');
    $('#' + _ctrlRemarks).val('');

    // $('.popup8').trigger('click')
    //_cdtls = [];
    //_cdtls.push(_claimdetails);
}
function GeneratingSettlementLetter(_stageID, _ctrlReason, _ctrlRemarks, _roleID, isApprove) {
    _claimdetails = {};
    _claimdetails["ClaimID"] = $('#hdnClaimID').val();
    _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
    _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
    _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
    _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
    _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
    _claimdetails["ClaimStageID"] = _stageID;
    _claimdetails["RoleID"] = _roleID;
    _claimdetails["ClaimedAmount"] = $("#txtClaimedAmount").val();
    _claimdetails["AgentID"] = $("#hdnAgentID").val();
    _claimdetails["PayeeType"] = null;
    _claimdetails["ReasonIDs_P"] = null;
    _claimdetails["PayeeType"] = 1;
    _claimdetails["NomineePayeeName"] = $("#txtEnrollment_PayeeName").text();

    if ($('#' + _ctrlRemarks).val() != '' || $('#' + _ctrlRemarks).val() != null) {
        _claimdetails["Remarks"] = $('#' + _ctrlRemarks).val();
    }
    else {
        _claimdetails["Remarks"] = null;
        // DialogWarningMessage('Please select Remarks To Submit');
        // return false;
    }

    $.ajax({
        //type: "POST",
        url: "/MedicalScrutiny/GeneratingSettlementLetter",
        contentType: 'application/json;charset=utf-8',
        beforeSend: function () { $("#progress1").show(); },
        data: {
            ClaimDetails: JSON.stringify(_claimdetails), isApprove: (isApprove == 1) ? true : false, PolicyType: $('#hdnPolicyTypeID').val(),
            MainMemberPolicyID: $('#hdnMemberPolicyID').val(), PolicyID: $('#hdnPolicyID').val(), ProviderID: $('#hdnProviderID').val(),
            BrokerID: $('#hdnBrokerID').val(), PayerID: $('#hdnPayerID').val(), CorporateID: $('#hdnCorporateID').val(),
            InsuranceCompanyID: $('#hdnInsuranceCompanyID').val()
        },
        success: function (data) {
            // CheckSessionVariable(data.responseText);
            var data1 = $.parseJSON(data);
            if (data1.length > 0) {
                Bind_Communications(data1);
            }
            $("#progress1").hide();
            DialogResultMessage('Settlement  letter sent successfully');
            $('#IssettlementletterStatus_chkbx').prop("disabled", "true");
            //if (data == 'Saved Successfully')
            // window.location = '/Claims/Index';
        },
        error: function (e, x) {
            $("#progress1").hide();
            ShowResultMessage('ErrorMessage', e.statusText);
        }
    });

    $('#' + _ctrlReason).val('0');
    $('#' + _ctrlRemarks).val('');

    // $('.popup8').trigger('click')
    //_cdtls = [];
    //_cdtls.push(_claimdetails);
}
function UpdateQMSStatus(val, ClaimStageID, redirect) {
    $.ajax(
        {
            type: "POST",
            async: true,
            url: "/Qmsv2CM/UpdateClaimStatus",
            data: { Action: "UPDATESTATUS", ClaimID: "", ClaimStageID: ClaimStageID, Claimsdetails: "", ID: "", QMSID: val, STATUS: "5" },
            dataType: "json",
            success: function (data) {

            },
            complete: function () {
            },
            error: function (xhr, status, error) {
                alert(error);
                console.log(xhr.responseText + "--" + status + "--" + error);
            }
        }
    );

}
function Shiftbasetopupclaim() {
    var _ClaimID = $('#hdnClaimID').val();
    var _SlNo = $('#hdnClaimSlNo').val();
    if (_ClaimID != 0 && _SlNo != 0 && shiftingmemberID != 0) {
        $.ajax({
            url: "/MedicalScrutiny/Claimshiftingbasetopuppolicy",
            contentType: 'application/json;charset=utf-8',
            data: {
                ClaimID: _ClaimID, SlNo: _SlNo, shiftingmemberID: shiftingmemberID
            },
            success: function (data) {
                if (data != '' && data != null) {
                    DialogWarningMessage("Claim shifted successfully");
                    window.location = '/Claims/Index';
                }
            }
        });
    }
}

function DisplayBasetopdetails(val, issingle, _stageID) {
    $("#lblTopupDoctRemarksErr").text("");

    var element
    element = document.getElementById("BufferTopSize");
    element.classList.remove("divsingleTopup");
    if (val != "1") {
        element = document.getElementById("topupdata");
        element.classList.add("div100");
        element = document.getElementById("bufferdivdata");
        element.classList.remove("div100");
        $("#bufferdivdata").hide();
        $("#topupdata").show();
        element = document.getElementById("BufferTopSize");
        element.classList.add("divsingleTopup");
    }
    else if (val == "1" && issingle == "0") {
        element = document.getElementById("topupdata");
        element.classList.remove("div100");
        element = document.getElementById("bufferdivdata");
        element.classList.add("div100");
        $("#topupdata").hide();
        $("#bufferdivdata").show();
        element = document.getElementById("BufferTopSize");
        element.classList.add("divsingleTopup");

    }
    else if (val == "1" && issingle == "1") {
        element = document.getElementById("topupdata");
        element.classList.remove("div100");
        element = document.getElementById("bufferdivdata");
        element.classList.remove("div100");
        $("#topupdata").show();
        $("#bufferdivdata").show();
    }
    GetBasetopupbalancedetails();
    $("#showexcesssum").val(_excessSuminsured - bufferUtilizedAmount);
    $("#showTotalClaimAmount").text(_excessSuminsured - bufferUtilizedAmount);
    if (basetopbaldetails.length > 0) {
        $("#divTopupdata").show();
        $("#DivSuperTopup").show();
        $('#BaseMemberID').text(basetopbaldetails[0].BaseMemberID);
        $('#BaseBalanceID').text(basetopbaldetails[0].BaseBalance);
        if (basetopbaldetails[0].TopupMemberID == 0) {
            $("#divTopupdata").hide();
        }
        else {
            $('#TopupMemberID').text(basetopbaldetails[0].TopupMemberID);
            $('#TopupBalanceID').text(basetopbaldetails[0].topupBalance);
        }
        if (basetopbaldetails[0].SuperTopMemberID == 0) {
            $("#DivSuperTopup").hide();
        }
        else {
            $('#supertopupMemberID').text(basetopbaldetails[0].SuperTopMemberID);
            $('#supertopupBalanceID').text(basetopbaldetails[0].SuperTopUpBalance);
        }
    }
    if (_netpayableAmount > 0) {
        if (basetopbaldetails[0].GivenCoverageID == 76 && _excessSuminsured > 0 && ((((_excessSuminsured - bufferUtilizedAmount) > 0) && bufferUtilizedAmount != 0) || $("#hdnNo").val() == 'true') && (basetopbaldetails[0].topupBalance > 0 || basetopbaldetails[0].SuperTopUpBalance > 0))
            $('#createnewtopupclaim').show();
        if (basetopbaldetails[0].GivenCoverageID == 79 && _excessSuminsured > 0 && (basetopbaldetails[0].SuperTopUpBalance || basetopbaldetails[0].BaseBalance))
            $('#createnewtopupclaim').show();
        if (basetopbaldetails[0].GivenCoverageID == 80 && _excessSuminsured > 0 && (basetopbaldetails[0].topupBalance || basetopbaldetails[0].BaseBalance))
            $('#createnewtopupclaim').show();
        if (basicData[0].PreTopupslno != 0 && ((((_excessSuminsured - bufferUtilizedAmount) > 0) && bufferUtilizedAmount != 0) || $("#hdnNo").val() == 'true'))
            $('#createnewtopupclaim').show();
    }
    if (_netpayableAmount == 0 && _excessSuminsured > 0) {
        if (basetopbaldetails[0].GivenCoverageID == 76 && (basetopbaldetails[0].topupBalance > 0 || basetopbaldetails[0].SuperTopUpBalance > 0)) {
            $('#Shiftclaim').show();
            if (basetopbaldetails[0].topupBalance > 0)
                shiftingmemberID = basetopbaldetails[0].TopupMemberID;
            else
                shiftingmemberID = basetopbaldetails[0].SuperTopMemberID;
        }
        if (basetopbaldetails[0].GivenCoverageID == 79 && (basetopbaldetails[0].BaseBalance > 0 || basetopbaldetails[0].SuperTopUpBalance > 0)) {
            $('#Shiftclaim').show();
            if (basetopbaldetails[0].BaseBalance > 0)
                shiftingmemberID = basetopbaldetails[0].SuperTopMemberID;
            else
                shiftingmemberID = basetopbaldetails[0].BaseMemberID;
        }
        if (basetopbaldetails[0].GivenCoverageID == 80 && (basetopbaldetails[0].BaseBalance > 0 || basetopbaldetails[0].topupBalance > 0)) {
            $('#Shiftclaim').show();
            if (basetopbaldetails[0].BaseBalance > 0)
                shiftingmemberID = basetopbaldetails[0].BaseMemberID;
            else
                shiftingmemberID = basetopbaldetails[0].TopupMemberID;
        }
        if ((basetopbaldetails[0].GivenCoverageID == 79 || basetopbaldetails[0].GivenCoverageID == 80) && (basetopbaldetails[0].topupBalance == 0 && basetopbaldetails[0].SuperTopUpBalance == 0)) {
            $('#Shiftclaim').show();
            shiftingmemberID = basetopbaldetails[0].BaseMemberID;
        }
    }


    var checkcoveragetype = $("#hdnCoverageType").val();

    var viewpopup = 0;
    if (issingle == 1) {
        if (checkcoveragetype == 76 && basetopbaldetails[0].TopupMemberID != 0 && basetopbaldetails[0].topupBalance != 0)
            viewpopup = 1;
        if (checkcoveragetype == 76 && basetopbaldetails[0].SuperTopMemberID != 0 && basetopbaldetails[0].SuperTopUpBalance != 0)
            viewpopup = 1;
        if (checkcoveragetype == 79 && basetopbaldetails[0].SuperTopMemberID != 0 && basetopbaldetails[0].SuperTopUpBalance != 0)
            viewpopup = 1;
    }


    if (val == "1" && issingle == "1") {
        $("#exampleModalApprove").modal('show');
    } else if (val == "Basetopdetails") {
        $("#exampleModalApprove").modal('show');
    }
    else if (val == "1") {
        $("#exampleModalApprove").modal('show');
    }
    else if (viewpopup == 1) {
        $("#exampleModalApprove").modal('show');
    }
    else if (viewpopup == 0) {
        createnewtop = 0;
        Claim_Insert(_stageID);
    }
}

function GetBasetopupbalancedetails() {
    if ($('#hdnMemberPolicyID').val() != '' && $('#hdnMemberPolicyID').val() != null) {
        $.ajax({
            url: "/MedicalScrutiny/GetBasetopupbalancedetails",
            contentType: 'application/json;charset=utf-8',
            async: false,
            data: {
                memberPolicyID: $('#hdnMemberPolicyID').val(),
                Claimid: $('#hdnClaimID').val(),
                Slno: $('#hdnClaimSlNo').val(),
                CoverageType: $('#hdnCoverageType').val()
            },
            success: function (data) {
                if (data != '' && data != null) {
                    basetopbaldetails = $.parseJSON(data);
                }
            }
        });
    }
}

var createnewtop = 0;
var topup_AID = 0;
var topup_claimid = 0;
var topup_slno = 0
function createnewtopupsupertopclaim() {
    $("#lblTopupDoctRemarksErr").text("");
    var TopupDocRemarks = $.trim($("input:radio[name='rbtnTopupRemarks']:checked").val());
    if (TopupDocRemarks == "2") {
        $("#txtDoctorRemarks").val($("#hdnTopUpDocRemarks").val());
    }
    else if (TopupDocRemarks == "1") {
        $("#txtDoctorRemarks").val($("#txtTopupDoctorRemarks").val());
    }
    else {
        $("#lblTopupDoctRemarksErr").text("Please select radio button Yes or No to update Doctor Notes");
        return false;
    }

    if ($('#topupcheckbox').is(':checked') == false) {
        alert("Please select the Topup Utilization checkbox");
        return false;
    }

    if ($('#BufferCheckbox').is(':checked') == true) {
        alert("You have selected the Utilize from Buffer Utilization checkbox. please verify once.");
        return false;
    }
    var ClaimID = $('#hdnClaimID').val();
    var slno = $('#hdnClaimSlNo').val();
    var claimtypeID = $('#hdnClaimTypeID').val();
    var RequestTypeID = $("#ddlRequestType").val();
    var ServiceTypeID = $('#ddlServiceType').val();
    var ServiceSubTypeID = $('#ddlServiceSubType').val();
    var PolicyID = $('#hdnPolicyID').val();
    var RoleID = $('#hdnRoleID').val();
    var excesssuminsured = _excessSuminsured - bufferUtilizedAmount;
    if (excesssuminsured == 0 && $('#modularamount').val() == 0) {
        alert("excess sum insured or modular amount should be grether than zero to create top up claimID");
        return false;
    }
    $('#modularamount').prop("disabled", false);

    if (ValidateApproval(22)) {
        if (ClaimID != '' && ClaimID != null && slno != '' && slno != null && (excesssuminsured > 0 || $('#modularamount').val() > 0)) {
            createnewtop = 1;
            $('#SkipAudit').prop('checked', false);
            Check_OpenActionItems(22);
        }
        else
            alert("Excess sum insured should be greater than zero");
    }
    else {
        createnewtop = 0;
        $("#exampleModalApprove").modal("hide");
        $("#hdnNo").val('false');
        $('#modularamount').prop("disabled", true);
        $('#modularamount').val("");
        $('#ismodularclaim').prop('checked', false);
    }
}

function Createtopupsupertopupclaims() {
    var ClaimID = $('#hdnClaimID').val();
    var slno = $('#hdnClaimSlNo').val();
    var claimtypeID = $('#hdnClaimTypeID').val();
    var RequestTypeID = $("#ddlRequestType").val();
    var ServiceTypeID = $('#ddlServiceType').val();
    var ServiceSubTypeID = $('#ddlServiceSubType').val();
    var PolicyID = $('#hdnPolicyID').val();
    var RoleID = $('#hdnRoleID').val();
    var excesssuminsured = _excessSuminsured - bufferUtilizedAmount;

    $.ajax({
        url: "/MedicalScrutiny/Createtopsupertopupclaim",
        contentType: 'application/json;charset=utf-8',
        async: false,
        data: {
            ClaimID: ClaimID, slno: slno, claimtypeID: claimtypeID, RequestTypeID: RequestTypeID, ServiceTypeID: ServiceTypeID,
            ServiceSubTypeID: ServiceSubTypeID, PolicyID: PolicyID, RoleID: RoleID, excesssuminsured: excesssuminsured,
            modularamount: $('#modularamount').val().length === 0 ? 0 : $('#modularamount').val()
        },
        success: function (data) {
            if (data != '' && data != null) {
                if (data.includes("Preauth is created with ID")) {
                    var splitdata = data.split(":");
                    splitdata = splitdata[1].split(",");
                    topup_claimid = splitdata[0];
                    topup_slno = splitdata[2].trim().replace(/"/g, '');
                    topup_AID = splitdata[1];
                    basicData[0].Topupslno = basicData[0].PreTopupslno + 1;

                    splitdata = data.split(",");
                    $("#exampleModalApprove").modal("hide");
                    $('#dialogInnerText').text(splitdata[0]);
                    $('#btnCloseSAA').trigger('click');
                    $("#dialog-confirm").removeClass('hide').dialog({
                        resizable: false,
                        width: '320',
                        modal: true,
                        title: "Preauth Creation",
                        //title:"<div class='widget-header'><h4 class='smaller'><i class='ace-icon fa fa-exclamation-triangle red'></i> Empty the recycle bin?</h4></div>",
                        title_html: true,
                        buttons: [
                            {
                                html: "<i class='ace-icon fa fa-check-o bigger-110'></i>&nbsp; Confirm",
                                "class": "btn btn-danger",
                                click: function () {
                                    $(this).dialog("close");
                                    if (topup_claimid != 0) {

                                        $.ajax({
                                            //type: "POST",
                                            url: "/MedicalScrutiny/ClearUserClaimCache",
                                            contentType: 'application/json;charset=utf-8',
                                            success: function (data) {

                                                let tab2 = window.open('/MedicalScrutiny/NavIndex?ClaimID=' + topup_claimid + '&SlNo=' + topup_slno + '&SID=5&AID=' + topup_AID, '_blank');

                                                if (tab2) {
                                                    setTimeout(function () {
                                                        window.location.href = "/MedicalScrutiny/ClaimsView?ClaimID=" + $('#hdnClaimID').val() + "&SlNo=" + $('#hdnClaimSlNo').val() + "&SID=29&IsFrmArchived=false";
                                                    }, 1000);
                                                } else {
                                                    alert("Popup blocked! Allow popups in your browser settings.");
                                                }

                                            },
                                            error: function (e, x) {
                                                ShowResultMessage('ErrorMessage', e.responseText);
                                            }
                                        });

                                    }
                                    return true;

                                }
                            }
                        ]
                    });

                }
                else {
                    alert(data);
                }
            }
            else
                alert('error while creating claim');
        }
    });

}
//SP3V-1611 Leena
function ShowOverideLable() {
    $('#tbloverrideRuleApproval > tbody  > tr').each(function () {
        var id = this.id;
        var _triggerID = id.split('_')[1];
        var strrulename = $('#spnRuleName_' + _triggerID + '').text();
        if (strrulename.indexOf('Deductible') != -1) {
            $("#IsOverrideDeductible").attr("hidden", false);
        }
    });
}
//End 1611 Leena
//Added by Rajesh Yerramsetti 
function GetReviewedRemarksDetails(_ClaimID, _SlNo) {
    if ($("#hdnStageID").val() == 29) {
        $.ajax({
            //type: "POST",
            url: "/MedicalScrutiny/ReviewedRemarksDetails_Retrieve",
            contentType: 'application/json;charset=utf-8',
            //processData: false,
            data: {
                ClaimID: _ClaimID, SlNo: _SlNo
            },
            success: function (data) {
                CheckSessionVariable(data.responseText);
                data = $.parseJSON(data);
                if (data == null || data == "") {
                    //alert('Data not found.');
                }
                else {
                    // $('#ddlReferToCRM').val(data[0].PID);
                    $('#taReviewedRemarks').val(data[0].Remarks);
                }
            },
            error: function (e, x) {
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });
    }
}

//Added by Rajesh Yerramsetti 
function GetReturnReviewedRemarksDetails(_ClaimID, _SlNo) {
    if ($("#hdnStageID").val() == 29) {
        $.ajax({
            //type: "POST",
            url: "/MedicalScrutiny/ReturnReviewedRemarksDetails_Retrieve",
            contentType: 'application/json;charset=utf-8',
            //processData: false,
            data: {
                ClaimID: _ClaimID, SlNo: _SlNo
            },
            success: function (data) {
                CheckSessionVariable(data.responseText);
                data = $.parseJSON(data);
                if (data == null || data == "") {
                    //alert('Data not found.');
                }
                else {
                    // $('#ddlReferToCRM').val(data[0].PID);
                    $('#taReviewedRemarks').val(data[0].Remarks);
                }
            },
            error: function (e, x) {
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });
    }
}

function ReviewedRemarks_Insert(_stageID, _ctrlReason, _ctrlRemarks, _roleID, _Click) {
    _claimdetails = {};

    _claimdetails["ClaimID"] = $('#hdnClaimID').val();
    _claimdetails["Slno"] = $('#hdnClaimSlNo').val();
    _claimdetails["ClaimTypeID"] = $('#hdnClaimTypeID').val();
    _claimdetails["RequestTypeID"] = $("#ddlRequestType").val();
    _claimdetails["ServiceTypeID"] = $('#ddlServiceType').val();
    _claimdetails["ServiceSubTypeID"] = $('#ddlServiceSubType').val();
    _claimdetails["HospitalizationType"] = $('#spnHospitalization').val()//$('#ddlHospitalizationType').val();
    _claimdetails["ClaimStageID"] = _stageID;
    _claimdetails["RoleID"] = _roleID;
    _claimdetails["ClaimedAmount"] = $('#txtClaimedAmount').val();
    _claimdetails["ReceivedMode_P23"] = 87;
    _claimdetails["ReviewedFlag"] = _Click;
    _claimdetails["MemberPolicyID"] = $('#hdnMemberPolicyID').val();
    _claimdetails["ProviderID"] = $('#hdnProviderID').val();
    _claimdetails["PolicyType"] = $('#hdnPolicyTypeID').val();
    _claimdetails["CorpID"] = $('#hdnCorporateID').val();
    _claimdetails["DateofAdmission"] = $('#txtHospDOA').val();
    _claimdetails["ProbableDOA"] = $('#txtProbableDOA').val()
    _claimdetails["DateofDischarge"] = $('#txtHospDOD').val();
    //console.log(_ctrlRemarks);
    if (_ctrlRemarks == "taReviewReturnemarks") {
        if ($('#taReviewReturnemarks').val() != '' || $('#taReviewReturnemarks').val() != null) {
            _claimdetails["Remarks"] = $('#taReviewReturnemarks').val();

        }
        else {
            _claimdetails["Remarks"] = null;
        }
    }
    if (_ctrlRemarks == "taReviewedRemarks") {
        if ($('#taReviewedRemarks').val() != '' || $('#taReviewedRemarks').val() != null) {
            _claimdetails["Remarks"] = $('#taReviewedRemarks').val();

        }
        else {
            _claimdetails["Remarks"] = null;
        }
    }
    Submit_RequestReviewed(JSON.stringify(_claimdetails), _stageID);
}

function Submit_RequestReviewed(_cdtls, _stageID) {

    $.ajax({
        //type: "POST",
        url: "/MedicalScrutiny/Submit_RequestReviewed_Insert",
        contentType: 'application/json;charset=utf-8',
        //processData: false,
        data: { ClaimDetails: _cdtls },
        //data: { ClaimDetails: 1, Rules: 4 },
        success: function (data) {
            CheckSessionVariable(data.responseText);
            DialogResultMessage(data);
            window.location = '/Claims/Index'; //
            if (data == null || data == "") {
                //alert('Data not found.');
            }
            //SubmitReferToInsurer = true;
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });

}

function changemodularamount() {
    if ($('#ismodularclaim').is(':checked') == true) {
        $("#modularamount").removeAttr('disabled');
    }
    else {
        $('#modularamount').prop("disabled", "true");
        $('#modularamount').val("");
    }
}

function AddExcessModular() {

    var modularamount = $("#modularamount").val();
    var showexcesssum = $("#showexcesssum").val();
    if (modularamount === undefined || modularamount == "")
        $("#showTotalClaimAmount").text(parseInt(showexcesssum))
    else
        $("#showTotalClaimAmount").text(parseInt(modularamount) + parseInt(showexcesssum))

}

//Added by Rajesh Yerramsetti
//Abhishek for sp3v-3019 provision for Reason sub category
function BindSubReasonCategory(subCategory) {

    $('#ddlReasonsSub').val(subCategory);
}

function BindDropdownByColumnNameConditionID(Data, control, ColumnName1, insurerId) {
    $("#" + control + " :gt(0)").remove();
    if (Data != null) {
        var Data1 = Data.filter(x => x.InsurerId == insurerId);
        Data = Data.filter(x => x.InsurerId == insurerId);
        if (Data.length > 0) {
            //$('#txtClaimOtherIRRejectionReason').hide();
            //$('#ddlInsurerRejection').show();
            //$('#spnInsurerRejection').show();
            //$('#ddlInsurerProductCodetd').show();
            //$('#ddlInsurerProductTexttd').show();

            //$('#ddlInsurerRejectionCode').show();
            //$('#ddlInsurerRejectionCodeTexttd').show();
            //$('#ddlInsurerRejectionCodeTextth').show();
            $.each(Data, function (i) {
                var optionhtml = '<option title="' + Data[i].InsurerDescription + '" value="' +
                    Data[i].ID + '">' + Data[i][ColumnName1] + '</option>';
                $("#" + control).append(optionhtml);
            });
            var filteredData = $.parseJSON(MasterData.mInsurer_Rejections_Master_category).filter(function (item) {
                return (item.Insurerid.toString() === insurerId);
            });

            BindDropdown(filteredData, "ddlRejCategory");
        }
        //else {
        //    $('#txtClaimOtherIRRejectionReason').show();
        //    $('#ddlInsurerRejection').hide();
        //    $('#spnInsurerRejection').hide();
        //    $('#ddlInsurerRejectionCode').hide();
        //    $('#ddlInsurerRejectionCodeTexttd').hide();
        //    $('#ddlInsurerRejectionCodeTextth').hide();
        //}
    }
}

function BindDropdownByColumnNameConditionIDV2(Data, control, ColumnName1, insurerId) {
    $("#" + control + " :gt(0)").remove();
    if (Data != null) {
        if (Data.length > 0) {
            $.each(Data, function (i) {
                var optionhtml = '<option title="' + Data[i].Name + '" value="' +
                    Data[i].ID + '">' + Data[i].Name + '</option>';
                $("#" + control).append(optionhtml);
            });
        }
    }
}

function LoadInsurerRejection(SubCatagoryId) {
    var data = $.parseJSON(MasterData.mInsurer_Rejections_Master);
    data = data.filter(x => x.InsurerId == $('#hdnInsuranceCompanyID').val() && x.IRDAI_CategoryID == $('#ddlRejCategory option:selected').val() && x.IRDAI_SubCategoryID == ($('#ddlRejSubCategory').val() == '' ? SubCatagoryId : $('#ddlRejSubCategory').val()));
    if (data.length > 0) {

        $('#ddlInsurerRejection').val(data[0].ID);
        $('#ddlInsurerRejectionCode').val(data[0].ID);
        $('#ddlInsurerProductCode').val(data[0].ID);
        LoadDescription(data[0].ID);
        if (!$('#ddlInsurerProductCodeth').is(':hidden')) {
            LoadProductCodeDescription(data[0].ID);
        }
        else {
            //LoadProductCodeDescriptionv2(data[0].ID);
        }
    }
    else {
        $('#ddlInsurerRejection').val('');
        $('#ddlInsurerRejectionCode').val('');
        $('#ddlInsurerProductCode').val('');
        $('#ddlInsurerProductDescription').val('');
        $('#txtClaimOtherIRRejectionReason1').val('');
        
    }
}

function LoadDescription(reasionId) {
    $('#ddlInsurerRejectionCode').val($('#ddlInsurerRejection').val());
    $('#hyperInsurerRejection').attr('title', $('#ddlInsurerRejection option:selected').attr('title'));
    var data = $.parseJSON(MasterData.mInsurer_Rejections_Master);
    data = data.filter(x => x.InsurerId == $('#hdnInsuranceCompanyID').val() && x.ID == $('#ddlInsurerRejection').val());
    if (data.length > 0) {
        $('#ddlRejCategory').val(data[0].IRDAI_CategoryID);
        LoadSubCategory(data[0].IRDAI_CategoryID, '#ddlRejSubCategory');
        $('#ddlRejSubCategory').val(data[0].IRDAI_SubCategoryID);
    }
    else {
        $('#ddlRejCategory').val('');
        $('#ddlRejSubCategory').val('');
    }

}
function LoadProductCodeDescriptionv2(reasionId) {
    //$('#ddlInsurerProductDescription').prop('selectedIndex', 1);
}

function LoadProductCodeDescription(reasionId) {
    $('#ddlInsurerRejectionCode').val($('#ddlInsurerProductCode').val());
    $('#ddlInsurerRejection').val($('#ddlInsurerProductCode').val());
    LoadProductDescription(0);
    $('#ddlInsurerProductDescription').val($('#ddlInsurerProductCode').val());
    $('#hyperInsurerRejection').attr('title', $('#ddlInsurerRejection option:selected').attr('title'));
    //var data = $.parseJSON(MasterData.Insurer_Rejections_MasterWithProduct);
    //data = data.filter(x => x.InsurerId == $('#hdnInsuranceCompanyID').val() && x.ID == $('#ddlInsurerProductDescription').val());
    //if (data.length > 0) {
    //    $('#ddlRejCategory').val(data[0].IRDAI_CategoryID);
    //    LoadSubCategory(data[0].IRDAI_CategoryID, '#ddlRejSubCategory');
    //    $('#ddlRejSubCategory').val(data[0].IRDAI_SubCategoryID);
    //}
    LoadCodeDescription($('#ddlInsurerRejectionCode').val(), false);

}

function LoadProductDescription(reasionId) {
    var data = $.parseJSON(MasterData.Insurer_Rejections_ProIncDesc);
    var parentId = $('#ddlInsurerRejectionCode option:selected').val();

    var data1 = $.parseJSON(MasterData.Insurer_Rejections_ProIncDesc).filter(function (item) {
        return (item.Insurerid.toString() === $('#hdnInsuranceCompanyID').val() && item.InsExclCode.toString() === $('#ddlInsurerProductCode option:selected').text()
            && item.IradaiExclCode.toString() === $('#ddlInsurerRejectionCode option:selected').text());
    });

    if (data1.length > 0) {
        BindDropdown(data1, "ddlInsurerProductDescription");
    }
}

function LoadCodeDescription(reasionId, flag) {
    $('#ddlInsurerRejection').val($('#ddlInsurerRejectionCode').val());
    $('#hyperInsurerRejection').attr('title', $('#ddlInsurerRejection option:selected').attr('title'));
    var data = $.parseJSON(MasterData.mInsurer_Rejections_Master);
    data = data.filter(x => x.InsurerId == $('#hdnInsuranceCompanyID').val() && x.ID == $('#ddlInsurerRejection').val());
    if (data.length > 0) {
        $('#ddlRejCategory').val(data[0].IRDAI_CategoryID);
        LoadSubCategory(data[0].IRDAI_CategoryID, '#ddlRejSubCategory');
        $('#ddlRejSubCategory').val(data[0].IRDAI_SubCategoryID);
    }
    if (flag) {
        $('#ddlInsurerProductCode').val($('#ddlInsurerRejectionCode').val());
        LoadProductDescription(0);
        $('#ddlInsurerProductDescription').val($('#ddlInsurerProductCode').val());
    }
}

function LoadInsurerRejectionsMaster(InsurerId) {
    var data = $.parseJSON(MasterData.mInsurer_Rejections_Master);
    var parentId = $('#ddlRejCategory option:selected').val();
    BindSubCateDropDown(Control, data, parentId);
}

function LoadSubReasonCategory(ParentId, Control) {
    var data = MasterData.mInsurerSubCategory;
    var parentId = $('#ddlReasons option:selected').val();
    BindReasonSubCateDropDown(Control, data, parentId);
}
function BindReasonSubCateDropDown(Control, Data, ParentId) {
    $(Control + " :gt(0)").remove();
    $.each(Data, function (i, item) {
        if (item.ParentID == ParentId) {
            var optionhtml = '<option value="' + Data[i].ID + '">' + Data[i].Name + '</option>';
            $(Control).append(optionhtml);
        }
    });
}
//Added by Rajesh Yerramsetti
//End 1611 Leena

//SP3V-2497 Begin

var arrIssueIds = []
var dictforHospitalclaimarch = []
var providerName;
var corporateName;
var agentName;
var familyName;
var PINCodeOrCity;

var correlatedtabcount = 0;
function CorrelatedReportSubmit(status) {
    correlatedtabcount = correlatedtabcount + 1;
    Count();
    if (correlatedtabcount == 1)
        ClaimHistorySearch(status, 'main');
    else
        ClaimHistorySearch(status, 'm');
}
// Claims Count display

function Count() {

    try {

        var _memberPolicyID = $('#hdnMemberPolicyID').val();
        var _providerid = MakeNullfromUndefinedorEmpty($('#hdnProviderID').val());
        var _agentid = MakeNullfromUndefinedorEmpty($('#hdnAgentID').val());
        var _corporateid = MakeNullfromUndefinedorEmpty($("#hdnCorporateID").val());

        $.ajax({
            url: '/Claims/GetClaimsCount',
            type: 'GET',
            data: {
                ProviderID: _providerid, MemberPolicyID: _memberPolicyID, corporateid: _corporateid, AgentID: _agentid
            },
            success: function (result) {
                CheckSessionVariable(result);
                data = result;

                filterdata = $.parseJSON(data);

                if (filterdata != null) {
                    var HospitalClaimCount = filterdata[0].HospitalClaimCount;
                    $("#hospitalClaimCount").html("Hospital(" + HospitalClaimCount + ")");
                    CorporateClaimCount = (_corporateid == 0) ? 0 : filterdata[0].CorporateClaimCount;

                    $("#corporateClaimCount").html("Corporate(" + CorporateClaimCount + ")");

                    var AgentClaimCount = filterdata[0].AgentClaimCount;
                    $("#agentClaimCount").html("Agent(" + AgentClaimCount + ")");

                    var FamilyClaimCount = filterdata[0].FamilyClaimCount;
                    $("#familyClaimCount").html("Family(" + FamilyClaimCount + ")");

                    providerName = filterdata[0].providerName;
                    corporateName = filterdata[0].corporateName;
                    agentName = filterdata[0].agentName;
                    familyName = filterdata[0].familyName;
                    PINCodeOrCity == $("#txt_hd_add_pincode").val();
                    $("#searchoption").html("  <b>" + "<span >Hospital</span>" + ": " + providerName);
                }
            },
            error: function () {
                ShowErrorMessage('divCommonalertmessage', 'Error while Search Claims');

            }
        });
    } catch (e) {
        ShowErrorMessage('divCommonalertmessage', 'Error while Search Claims');

    }

}

//Claims History Search Hospital/Corporate/Agent/Family

function ClaimHistorySearch(Status, main) {

    try {


        var _memberPolicyID = $('#hdnMemberPolicyID').val();
        var _providerid = MakeNullfromUndefinedorEmpty($('#hdnProviderID').val());
        var _agentid = MakeNullfromUndefinedorEmpty($('#hdnAgentID').val());
        var _corporateid = MakeNullfromUndefinedorEmpty($("#hdnCorporateID").val());
        /*var _ClaimID = $('#hdnClaimID').val();*/
        var Status;
        var statusvalue, statusname;
        /*$("#entityFilter").hide();*/

        if (Status == 1) {
            statusvalue = "Hospital";
            statusname = (providerName == null) ? "Not Applicable" : providerName;
            $("#searchoption").html("  <b>" + statusvalue + ": </b>" + statusname);

        }
        else if (Status == 2) {
            statusvalue = "Corporate";
            statusname = (corporateName == null) ? "Not Applicable" : corporateName;
            if (statusname == "Not Applicable") {
                $("#searchoption").html("  <b>" + statusvalue + " : </b>" + "  <b>" + statusname);
            }
            else {
                $("#searchoption").html("  <b>" + statusvalue + " : </b>" + "  <b>" + statusname + " - Hospital : </b>" + providerName);
            }

        }
        else if (Status == 3) {
            statusvalue = "Agent";
            statusname = (agentName == null) ? "Not Applicable" : agentName;
            if (statusname == "Not Applicable") {
                $("#searchoption").html("  <b>" + statusvalue + " : </b>" + "  <b>" + statusname);
            }
            else {
                $("#searchoption").html("  <b>" + statusvalue + " : </b>" + "  <b>" + statusname + "- Hospital : </b>" + providerName);
            }

        }
        else if (Status == 4) {
            statusvalue = "Family";
            statusname = familyName;
            $("#searchoption").html("  <b>" + statusvalue + ": </b>" + statusname);
        }

        /*statusname = (statusname == null) ? "Not Applicable" : statusname;*/

        /* $("#searchoption").html("  <b>" + statusvalue + ": </b>" + statusname);*/

        $.ajax({
            url: '/Claims/ClaimHistorySearch',
            type: 'GET',
            data: {
                /*ProviderID: '64', MemberPolicyID: '762', corporateid: '7845', AgentID: '69', Status: 1*/
                ProviderID: _providerid, MemberPolicyID: _memberPolicyID, corporateid: _corporateid, AgentID: _agentid, Status: Status
            },
            success: function (result) {
                CheckSessionVariable(result);
                data = result;
                datatableResult = result;
                Filterdata = $.parseJSON(data);

                maindata = Filterdata;
                BindHospitaldashboardsearchresults($.parseJSON(data), 'tblhospitalResults', main);

                $('#btncommondialogclose').trigger('click');
                $('#divClaimRequests').show();
                $('#divPARequests').hide();
                $('#tblhospitalResults').attr("tabindex", -1).focus();
                $("#entityFilter").html("");

            },
            error: function () {
                ShowErrorMessage('divCommonalertmessage', 'Error while Search Claims');

            }
        });


        $('#btn_process').prop('disabled', false);


    }
    catch (e) {
        ShowErrorMessage('divCommonalertmessage', 'Error while Search Claims');

    }

}

function ClaimAdvanceSearchSubmit() {

    $("#tblhospitalResults").dataTable().fnDestroy();


    try {
        var dropdown1 = document.getElementById("txtentityid");
        var entityvalue = dropdown1.options[dropdown1.selectedIndex].value;

        var dropdown2 = document.getElementById("txtrequesttypeid");
        var requestType = dropdown2.options[dropdown2.selectedIndex].value;

        var fromDate = document.getElementById("txtcrFromDate").value;
        var toDate = document.getElementById("txtcrToDate").value;

        const date1 = new Date(fromDate.toString());
        const date2 = new Date(toDate.toString());
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (dropdown1.selectedIndex == 0) {
            alert('Please select Entity ');
            return;
        }
        if (dropdown2.selectedIndex == 0) {
            alert('Please select Claim Type ');
            return;
        }
        if (fromDate == "dd-mm-yyyy" || fromDate == '') {
            alert('Please select From Date ');
            return;
        }
        else {

            if (toDate == "dd-mm-yyyy" || toDate == '') {
                var currDate = new Date();
                var resultDate = new Date(currDate); // Create a new Date object from the given date
                resultDate.setDate(resultDate.getDate() - 120); // Subtract 120 days

                const day = String(resultDate.getDate()).padStart(2, '0');
                const month = String(resultDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                const year = resultDate.getFullYear();
                var prevCheckdate = `${year}-${month}-${day}`;


                const date1 = new Date(fromDate.toString());
                const date2 = new Date(currDate);
                const diffTime = Math.abs(date2 - date1);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 120) {
                    alert('Please select Fromdate is  greater than or equal to  ' + prevCheckdate);
                    return;
                }
            }



        }
        if (toDate == "dd-mm-yyyy" || toDate == '') {
            alert('Please select To Date ');
            return;
        }


        if (diffDays < 0) {
            alert('To Date is Greater than From Date ');
            return;
        }

        if (diffDays > 120) {
            alert('select FromDate and ToDate  Range less than or equal to 120 days ');
            return;
        }
        if (fromDate != '') {


            //var currDate = new Date();
            //const date1 = new Date(fromDate.toString());
            //const date2 = new Date(currDate);
            //const diffTime = Math.abs(date1 - date2);
            //const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            //alert('todate ' + diffDays.toString());
            //if (diffDays > 0 ) {
            //    alert('Please dont select future date');
            //    return;
            //}
        }

        var entity;

        if (entityvalue == "Hospital") {
            entity = 1;
            statusname = providerName;
        }
        else if (entityvalue == "Corporate") {
            entity = 2;
            statusname = corporateName;
        }
        else if (entityvalue == "Agent") {
            entity = 3;
            statusname = agentName;
        }
        else if (entityvalue == "Family") {
            entity = 4;
            statusname = familyName;
        }
        else if (entityvalue == "CityandPincode") {

            entity = 5;
            statusname = '';

        }

        if ($("#txt_hd_add_pincode").val() == '' && entity == 5) {
            alert('Please enter Pincode or City!');
            return;
        }
        var cityandstate = ""; var PinCode = "";
        var temp = $("#txt_hd_add_pincode").val().split('-')[2];
        if (temp === undefined) {

            cityandstate = $("#txt_hd_add_pincode").val();
        }
        else {
            PinCode = $("#txt_hd_add_pincode").val().split('-')[2];

        }


        var city = $("#txt_hd_add_pincode").val().split('-')[1];
        statusname = (statusname == null) ? "Not Applicable" : statusname;

        $("#searchoption").html("  <b>" + entityvalue + ": </b>" + statusname);
        var _memberPolicyID = $('#hdnMemberPolicyID').val();
        var _providerid = MakeNullfromUndefinedorEmpty($('#hdnProviderID').val());
        var _agentid = MakeNullfromUndefinedorEmpty($('#hdnAgentID').val());
        var _corporateid = MakeNullfromUndefinedorEmpty($("#hdnCorporateID").val());

        var Status;

        /*$('#divClaimDashboardsearch').trigger('click');*/
        if ((entityvalue != "" && entityvalue != undefined) && (requestType != "" && requestType != undefined) && (location != "" && location != undefined) && (fromDate != "" && fromDate != undefined) && (toDate != "" && toDate != undefined)) {

            if (fromDate <= toDate) {

                $.ajax({
                    url: '/Claims/ClaimAdvanceSearch',
                    type: 'GET',
                    data: {
                        /*ProviderID: '64', UHIDNo: 'HDFC44294838', corporateid: '7845', AgentID: '69', Status: 1*/
                        ProviderID: _providerid, MemberPolicyID: _memberPolicyID, corporateid: _corporateid, AgentID: _agentid, Status: entity, RequestType: requestType, FromDate: fromDate, ToDate: toDate, PinCode: PinCode, StateandCity: cityandstate
                    },
                    success: function (result) {

                        CheckSessionVariable(result);
                        data = result;
                        datatableResult = result;
                        $("#entityFilter").html("&ensp; <b>.</b>Entity Type: <b>" + entityvalue + "&ensp;.</b>Request Type: <b>" + requestType + "&ensp;.</b>Date: <b>" + fromDate + "  to " + toDate + "&ensp;.</b>State-City-Pincode:<b>" + $("#txt_hd_add_pincode").val()) + "</b>";

                        if (result)

                            Filterdata = $.parseJSON(data);
                        maindata = Filterdata;
                        $('#btncommondialogclose').trigger('click');
                        //filter advance


                        $('#divClaimAdvanceSearch').trigger('click');

                        $('#btncommondialogclose').trigger('click');

                        $('#btncommondialogclose').trigger('click');
                        //$('#divClaimRequests').show();
                        //$('#divPARequests').hide();
                        $('#tblhospitalResults').attr("tabindex", -1).focus();

                        BindHospitaldashboardsearchresults($.parseJSON(data), 'tblhospitalResults');
                        $("#exampleModal").modal('hide');
                    },
                    error: function () {
                        ShowErrorMessage('divCommonalertmessage', 'Error while Search Claims');
                        //DialogCommomErrorFunction('Error while Finding Claims')
                    }
                });


                $('#btn_process').prop('disabled', false);
            }
            else {
                ShowWanringMessage('divCommonalertmessage', 'From Date should not be greater than To Date');
            }
        }
        else
            ShowWanringMessage('divCommonalertmessage', 'Please provide all search items');

    } catch (e) {
        ShowErrorMessage('divCommonalertmessage', 'Error while Search Claims');
        //  DialogErrorMessage("Error While find Claim Detials");
    }
}
function BindHospitaldashboardsearchresults(data, tableId, main) {
    var _ClaimID = $('#hdnClaimID').val();
    printstatusTableId = tableId;
    $("#tblhospitalResultsbody").html('');
    if (data != null) {

        var columns = [];
        if ((data != null)) {
            columns = GetColumnsOfJsonObj(data[0]);
            var count = (columns.length > 17) ? 17 : columns.length;
            var tblBody = "";
            var matchedTblBody = "";
            var isFirstRow = false;

            for (var i = 0; i < data.length; i++) {
                var tr = "<tr>";

                for (var j = 0; j < count; j++) {


                    if (columns[j] == "ClaimID") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + data[i][columns[j]] + "</td>";
                    }

                    if (columns[j] == "PatientName") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + data[i][columns[j]] + "</td>";
                    }
                    else if (columns[j] == "Gender") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + (data[i][columns[j]]) + "</td>";
                    }

                    else if (columns[j] == "UhidNo") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + data[i][columns[j]] + " </td>";
                    }
                    else if (columns[j] == "Diagnosis") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + (data[i][columns[j]]) + " </td>";
                    }
                    else if (columns[j] == "DateofAdmission") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + DisplayDateasIcon_DayandMonthYear(data[i][columns[j]].split("T")[0]) + "</td>";
                    }
                    else if (columns[j] == "DateofDischarge") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + ((data[i][columns[j]] != null) ? DisplayDateasIcon_DayandMonthYear(data[i][columns[j]].split("T")[0]) : "NA") + "</td>";
                    }
                    else if (columns[j] == "ClaimedAmount") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + MakeNullasNotApplicable(data[i][columns[j]]) + " </td>";
                    }
                    else if (columns[j] == "ClaimType") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + MakeNullasNotApplicable(data[i][columns[j]]) + " </td>";
                    }

                    else if (columns[j] == "Flagged") {
                        /*tr = tr + "<td  data-title='" + columns[j] + "'>" + data[i][columns[j]] + " </td>";*/
                        if (data[i][columns[j]] == "Blacklist" || data[i][columns[j]] == "true") {
                            var tdflgdata = "<td style='display:none'  data-title='" + columns[j] + "'>" + '<i class="ace-icon fa fa-flag red"></i>' + " </td>";
                        }
                        else {
                            tdflgdata = "<td style='display:none' data-title='" + columns[j] + "'>" + data[i][columns[j]] + " </td>";
                        }
                        tr = tr + tdflgdata;
                    }
                    else if (columns[j] == "PINCode") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + data[i][columns[j]] + " </td>";
                    }
                    else if (columns[j] == "Los") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + MakeNullasNotApplicable(data[i][columns[j]]) + " </td>";
                    }

                    else if (columns[j] == "PerdayAvg") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + MakeNullasNotApplicable(data[i][columns[j]]) + " </td>";
                    }
                    else if (columns[j] == "BillAmount") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + MakeNullasNotApplicable(data[i][columns[j]]) + " </td>";
                    }
                    else if (columns[j] == "Accomodation") {
                        tr = tr + "<td  data-title='" + columns[j] + "'>" + MakeNullasNotApplicable(data[i][columns[j]]) + " </td>";
                    }


                    else if (columns[j] == "ID") {
                        if (_ClaimID == data[i][columns[j]]) {
                            isFirstRow = true;
                        }
                    }
                }
                tr = tr + "</tr>";
                if (isFirstRow) {
                    matchedTblBody = matchedTblBody + tr;
                    isFirstRow = false;

                } else {
                    tblBody = tblBody + tr;
                }
            }
            tblBody = matchedTblBody + tblBody;
            if (main != "main") {
                $('#tblhospitalResults').dataTable().fnClearTable();
                $('#tblhospitalResults').dataTable().fnDraw();
                $('#tblhospitalResults').dataTable().fnDestroy();
            }
            $("#tblhospitalResultsbody").html(tblBody);
            BindTable();
            //$("#" + tableId).append(tblBody);
            if ((data == null)) {
                // $('#PreAuth_download').css({ 'display': 'none' });
                var $tr = $('<tr class="tr">').append($('<td colspan="8" style=" font-size:large; color:#3A798C;text-align:center;">').text("No Records Found")
                ).appendTo('#' + tableId);
            }
            $("#btnCorrelatedAdvanceSearch").attr("disabled", false);
            $("#txtentityid").attr("disabled", false);
            $("#txtrequesttypeid").attr("disabled", false);
            $("#txtcrFromDate").attr("disabled", false);
            $("#txtcrToDate").attr("disabled", false);
            $("#btncdsSearch").attr("disabled", false);
            $(".close").attr("disabled", false);


        }
    }
}

function DatePickerBlock() {
    var date = $('#txtcrFromDate').val();
    let dt = new Date(date);


    document.getElementById("txtcrToDate").min = date;

    const datecopy = new Date(date);
    datecopy.setMonth(datecopy.getMonth() + 9);

    const todaydate = new Date();
    if (todaydate < datecopy) {
        document.getElementById("txtcrToDate").max = todaydate.toISOString().split("T")[0];
    }
    else {
        document.getElementById("txtcrToDate").max = datecopy.toISOString().split("T")[0];
    }
}
function GetDateTime(d) {
    if ((d != null) && (d != "")) {
        // var d = new Date(parseInt(jsonDate.substr(6)));

        m = d.getMonth() + 1;
        if (m < 10)
            m = '0' + m
        if (d.getDate() < 10)
            day = '0' + d.getDate()
        else
            day = d.getDate();

        hour = d.getHours();
        min = d.getMinutes();
        sec = d.getSeconds();

        if (min < 10)
            min = '0' + min

        if (sec < 10)
            sec = '0' + sec

        if (hour < 10)
            hour = '0' + hour
        // var date = (day + '-' + GetMonthName(m) + '-' + d.getFullYear() + " " + hour + ':' + min + ':' + sec);
        var date = (d.getFullYear() + '-' + m + '-' + day + " " + hour + ':' + min + ':' + sec);
        //alert(date)
        return date;
    }
}
function LoadMDSdata() {
    //$('#btnUploadDocs').click(function () {
    var VreceivedDate = GetDateTime(new Date());
    $('#txtScanFileReceivedDate').val(JSONDateTime(VreceivedDate));
    $("#ddlModeofDeliverID option[value=4]").hide();
    $("#ddlModeofDeliverID option[value=5]").hide();
    $('#ddlModeofDeliverID').val(3);
    $('#ddlModeofDeliverID').trigger('change');
    var dmsApiURL = $('#hdnDMSApiURL').val();
    var q = $('#hdnqString').val();
    $("#txtCategoryIRDoc option:selected").val(0);
    $('#txtCategoryIRDoc').find("option").remove();
    $('#txtCategoryIRDoc').html('<option value="0">--Select Category--</option>');
    //  $("#txtCategoryIRDoc").select2("val", "0");
    if (sessionStorage.getItem('token') == null) {
        $("#progress1").show();
        $.ajax({
            type: "GET",
            url: dmsApiURL + "api/auth/keyauthentication?q=" + encodeURIComponent(q) + "",
            contentType: "application/json",
            success: function (data) {
                if (data != "") {
                    //sessionStorage.setItem('token', data);
                    $.ajax({
                        type: "GET",
                        //url: dmsApiURL + "API/Document/getdoccategories",
                        url: dmsApiURL + "API/Document/subcategories",
                        dataType: "json",
                        headers: {
                            Authorization: 'Bearer ' + data
                        },
                        contentType: "application/json",
                        success: function (res) {

                            $.each(res, function (data, value) {

                                if (value.requestTypeID == $("#ddlRequestType").val()) {

                                    $("#txtCategoryIRDoc").append($("<option></option>").val(value.docCategoryID + "-" + value.docCategoryCode + "&" + value.subCategoryCode).html(value.title));
                                    //if (value.mandatoryFlag == 1) {
                                    //    let Dmsupddata = {};
                                    //    Dmsupddata["Requesttypeid"] = value.requestTypeID;
                                    //    Dmsupddata["DocCategoryID"] = value.docCategoryID;
                                    //    Dmsupddata["MandatoryFlag"] = value.mandatoryFlag;
                                    //    Dmsupddata["title"] = value.title;
                                    //    DMSMDC.push(Dmsupddata);
                                    //    DMSMDCC.push(value.docCategoryID);

                                    //}
                                }
                            });
                            if ($("#ddlRequestType").val() == 1 || $("#ddlRequestType").val() == 2) {
                                $("#txtCategoryIRDoc").append($("<option></option>").val(1 + "-" + "OTH" + "&" + "Others").html("Others"));
                            }
                        }
                    });
                    $("#progress1").hide();
                }
            },
            error: function (xhr, status, error) {
                alert(error);
                $("#progress1").hide();
            }
        });
    } else {
        $("#progress1").show();
        $.ajax({
            type: "GET",
            url: dmsApiURL + "API/Document/subcategories",
            dataType: "json",
            headers: {
                Authorization: 'Bearer ' + ''//sessionStorage.getItem('token')
            },
            contentType: "application/json",
            success: function (res) {
                DMSMDC = [];
                DMSMDCC = [];
                $.each(res, function (data, value) {

                    if (value.requestTypeID == $("#ddlRequestType").val()) {
                        let Dmsupddata = {};
                        //if (value.mandatoryFlag == 1) {
                        //    value.title=value.title + ' *'
                        //}
                        $("#txtCategoryIRDoc").append($("<option></option>").val(value.docCategoryID + "-" + value.docCategoryCode + '&' + value.subCategoryCode).html(value.title));

                        //if (value.mandatoryFlag == 1) {

                        //    Dmsupddata["Requesttypeid"] = value.requestTypeID;
                        //    Dmsupddata["DocCategoryID"] = value.docCategoryID;
                        //    Dmsupddata["MandatoryFlag"] = value.mandatoryFlag;
                        //    Dmsupddata["title"] = value.title;
                        //    DMSMDC.push(Dmsupddata);
                        //    DMSMDCC.push(value.docCategoryID);
                        //}
                    }
                    $("#progress1").hide();
                });
                if ($("#ddlRequestType").val() == 1 || $("#ddlRequestType").val() == 2) {
                    $("#txtCategoryIRDoc").append($("<option></option>").val(1 + "-" + "OTH" + "&" + "Others").html("Others"));
                }

            }
        });

    }
    //});
}
//function Filechangeevent1VM(file, num) {

//    num = parseInt(num);
//    var _num = num;
//    $('#progress .progress-bar').show();
//    var size = 0;

//    var _num1 = num;
//    var _num2 = num;
//    var docCategoryID = "";
//    var DocCategory = $("#txtCategoryIRDoc").val();
//    var resultData = DocCategory.split("-");
//    if (resultData.length == 2) {
//        docCategoryID = resultData[0];
//        docCategoryCode = resultData[1].split("&")[1];
//    }
//    //var recevieddate = GetDateTime $('#txtScanFileReceivedDate').val()
//    var receivedModeID = $('#ddlModeofDeliverID').val();
//    //file.push($("#txtCategoryIRDoc").val());
//    //file.push($('#txtScanFileReceivedDate').val());
//    //file.push($('#ddlModeofDeliverID').val());
//    if (docCategoryID != "0" && docCategoryID == 0) {
//        alert('Please select document category');
//        return false;
//    }
//    if (MakeNullfromUndefinedorEmpty($('#txtScanFileReceivedDate').val()) == null) {
//        alert('Please select file received date');
//        return false;
//    }
//    if (receivedModeID == "0" && receivedModeID == 0) {
//        alert('Please select received type');
//        return false;
//    }
//    var isValid = true;
//    $.each(file, function (i, item) {
//        var extension = item.name.replace(/^.*\./, '');
//        if (extension != "pdf") {
//            isValid = false;
//            return false;
//        }
//    });
//    if (!isValid) {
//        alert('Please browse PDF files only');
//        return false;
//    }

//    $.each(file, function (i, item) {
//        size = size + item.size;
//        //  filenums.push(_filenum);
//        _num2++;
//    });
//    //alert(size);
//    if (size > 52428800) {
//        alert('Files Should not Exceed 50MB');
//    } else {
//        for (var i = 0; i < file.length; i++) {
//            // var Filename = $("#txtCategoryIRDoc option:selected").text() + '_' + file[i].name;
//            var Filename = docCategoryCode + '-' + file[i].name;
//            // $('<p/>').text(file[i].name).appendTo('#files');
//            //if ((file[i].name.split('.')[1] == "jpeg") || (file[i].name.split('.')[1] == "png") || (file[i].name.split('.')[1] == "jpg"))
//            //    $('<tr id="trfilslist' + num + '" />').html('<td class="center" id="tr' + num + '"><a  class="btn btn-sm btn-success"><i class="glyphicon glyphicon-picture"></i></a></td><td><p class="name" data-ng-switch="" >' + $("#txtCategoryIRDoc option:selected").text() + ' </p></td><td><p class="name" data-ng-switch="" >' + Filename + ' </p></td><td><p class="name" data-ng-switch="" >' + $('#txtScanFileReceivedDate').val() + ' </p></td><td><p class="size ng-binding">' + ((file[i].size) / 1024).toFixed(2) + ' KB</p></td><td> .' + file[i].name.split('.')[1] + '</td><td><p class="name" data-ng-switch="" >' + $('#ddlModeofDeliverID option:selected').text() + ' </p></td><td class="center"><button type="button" class="btn btn-sm btn-danger destroy ng-scope ng-hide" onclick="RemovefilefromList(' + num + ')" ><i class="glyphicon glyphicon-trash"></i><span>Delete</span></button></td>').appendTo('#tblFileslistScan tbody');
//            //else
//            if (file[i].name.split('.')[1] == "pdf")
//                $('<tr id="trfilslist' + num + '" />').html('<td class="center" id="tr' + num + '"><a  class="btn btn-sm btn-danger"><i class="glyphicon glyphicon-file"></i></a></td><td><p class="name" data-ng-switch="" >' + $("#txtCategoryIRDoc").val().split("&")[0] + ' </p></td><td><p class="name" data-ng-switch="" >' + $("#txtCategoryIRDoc option:selected").text() + ' </p></td><td><p class="name" data-ng-switch="" >' + Filename + ' </p></td><td><p class="name" data-ng-switch="" >' + $('#txtScanFileReceivedDate').val() + ' </p></td><td><p class="size ng-binding">' + ((file[i].size) / 1024).toFixed(2) + ' KB</p></td><td> .' + file[i].name.split('.')[1] + '</td><td><p class="name" data-ng-switch="" >' + receivedModeID + '_' + $('#ddlModeofDeliverID option:selected').text() + ' </p></td><td class="center"><button type="button" class="btn btn-sm btn-danger destroy ng-scope ng-hide" onclick="RemovefilefromList(' + num + ')" ><i class="glyphicon glyphicon-trash"></i><span>Delete</span></button></td>').appendTo('#tblFileslistScan tbody');
//            //else if (file[i].name.split('.')[1] == "mp3")
//            //    $('<tr id="trfilslist' + num + '" />').html('<td class="center"><a  class="btn btn-sm btn-primary"><i class="glyphicon glyphicon-music"></i></a></td><td><p class="name" data-ng-switch="" >' + $("#txtCategoryIRDoc option:selected").text() + ' </p></td><td><p class="name" data-ng-switch="" >' + Filename + ' </p></td><td><p class="name" data-ng-switch="" >' + $('#txtScanFileReceivedDate').val() + ' </p></td><td><p class="size ng-binding">' + ((file[i].size) / 1024).toFixed(2) + ' KB</p></td><td> .' + file[i].name.split('.')[1] + '</td><td><p class="name" data-ng-switch="" >' + $('#ddlModeofDeliverID option:selected').text() + ' </p></td><td class="center"><button type="button" class="btn btn-sm btn-danger destroy ng-scope ng-hide" onclick="RemovefilefromList(' + num + ')" ><i class="glyphicon glyphicon-trash"></i><span>Delete</span></button></td>').appendTo('#tblFileslistScan tbody');
//            //  else if (file[i].name.split('.')[1] == "html")
//            //    $('<tr id="trfilslist' + num + '" />').html('<td class="center"><a  class="btn btn-sm btn-success"><i class="glyphicon glyphicon-play-circle"></i></a></td><td><p class="name" data-ng-switch="" >' + $("#txtCategoryIRDoc option:selected").text() + ' </p></td><td><p class="name" data-ng-switch="" >' + Filename + ' </p></td><td><p class="name" data-ng-switch="" >' + $('#txtScanFileReceivedDate').val() + ' </p></td><td><p class="size ng-binding">' + ((file[i].size) / 1024).toFixed(2) + ' KB</p></td><td> .' + file[i].name.split('.')[1] + '</td><td><p class="name" data-ng-switch="" >' + $('#ddlModeofDeliverID option:selected').text() + ' </p></td><td class="center"><button type="button" class="btn btn-sm btn-danger destroy ng-scope ng-hide" onclick="RemovefilefromList(' + num + ')" ><i class="glyphicon glyphicon-trash"></i><span>Delete</span></button></td>').appendTo('#tblFileslistScan tbody');
//            else

//                $('<tr id="trfilslist' + num + '" />').html('<td class="center" id="tr' + num + '"><a  class="btn btn-sm btn-danger"><i class="glyphicon glyphicon-file"></i></a></td><td><p class="name" data-ng-switch="" >' + $("#txtCategoryIRDoc").val() + ' </p></td><td><p class="name" data-ng-switch="" >' + $("#txtCategoryIRDoc option:selected").text() + ' </p></td><td><p class="name" data-ng-switch="" >' + Filename + ' </p></td><td><p class="name" data-ng-switch="" >' + $('#txtScanFileReceivedDate').val() + ' </p></td><td><p class="size ng-binding">' + ((file[i].size) / 1024).toFixed(2) + ' KB</p></td><td> .' + Filename.split(".")[Filename.split(".").length - 1] + '</td><td><p class="name" data-ng-switch="" >' + receivedModeID + '_' + $('#ddlModeofDeliverID option:selected').text() + ' </p></td><td class="center"><button type="button" class="btn btn-sm btn-danger destroy ng-scope ng-hide" onclick="RemovefilefromList(' + num + ')" ><i class="glyphicon glyphicon-trash"></i><span>Delete</span></button></td>').appendTo('#tblFileslistScan tbody');

//            num = num + 1;
//        }

//        //$('#progress .progress-bar').css('width',100 + '%');
//        for (var i = 1; i <= 100; i++) { $('#progress .progress-bar').css('width', i + '%'); }
//        $('#divfilebuttonsScan').append('<span class="btn btn-success fileinput-button" id="sspanfileupload' + num + '" ><i class="glyphicon glyphicon-plus"></i><span>Drop files to upload (or click) ...</span><input id="fileupload' + num + '" type="file" name="Vfiles" multiple onclick="fileonclick();" onchange="Filechangeevent1VM(this.files,' + num + ')"></span>');
//        // $('#progress .progress-bar').hide();
//        $('#sspanfileupload' + _num).hide();
//        // $('#spanfileupload' + _num).removeAttr('id');

//    }
//}
function InsertPreauthDMSUploadajax(VClaimid, Vslno) {
    try {

        var fileUploadsize = 26214400;//25MB
        var _files = $("input[name=Vfiles]");
        if (_files.length > 1) {
            var _size = 0;
            $.each(_files, function (i, files) {
                var files = $("input[name=Vfiles]").get(i).files;
                if (files.length != 0) {
                    $.each(files, function (i, item) {
                        _size = _size + item.size;
                    });
                }
            });
            if (_size > fileUploadsize) {
                $('#progress1').hide();
                alert('Max uploaded size Exceeded (25 MB),Documents are not uploaded, please upload manually.');

            } else {
                $('#progress1').show();

                var table = $("#tblFileslistScan tbody");
                var issuccess = 0;
                var isFailed = 0;
                var Vuploadfilecount = table.find('tr').length;

                table.find('tr').each(function (i) {
                    $('#progress1').show();
                    if ($('#hdnRequestTypeID').val() == 1 || $('#hdnRequestTypeID').val() == 2 || $('#hdnRequestTypeID').val() == 3) {
                        var $tds = $(this).find('td'),
                            docCategoryid = $tds.eq(1).text().split("-")[0],
                            docCategory = $tds.eq(1).text().split("-")[1],
                            documentname = $tds.eq(3).text(),
                            Receivedate = $tds.eq(4).text(),
                            receivedtype = $tds.eq(7).text()
                    }
                    //if ($('#hdnClaimTypeID').val() == 2) {
                    //    var $tds = $(this).find('td'),
                    //        docCategoryid = $tds.eq(1).text().split("_")[0],
                    //        docCategory = $tds.eq(1).text().split("_")[1],
                    //        documentname = $tds.eq(3).text(),
                    //        Receivedate = $tds.eq(4).text(),
                    //        receivedtype = $tds.eq(7).text()
                    //}
                    else {
                        var $tds = $(this).find('td'),
                            docCategoryid = $tds.eq(1).text().split("-")[0],
                            docCategory = $tds.eq(1).text().replace(/_/g, '-').split("-")[1],
                            documentname = $tds.eq(3).text(),
                            Receivedate = $tds.eq(4).text(),
                            receivedtype = $tds.eq(7).text()
                    }

                    var DocClaimid = VClaimid;
                    var DOcSlno = Vslno;
                    var DOcdocCategory = docCategory;
                    var Docdocumentname = documentname;
                    var DocReceivedate = Receivedate;
                    var Docreceivedtype = receivedtype.split('_')[0];
                    var files = $("input[name=Vfiles]").get(i).files;
                    if (files.length == 0) {
                        for (var j = i + 1; j <= $("input[name=Vfiles]").length; j++) {
                            var filesTemp = $("input[name=Vfiles]").get(j).files;
                            if (filesTemp.length != 0) {
                                files = $("input[name=Vfiles]").get(j).files;
                                break;
                            }
                        }
                    }
                    var data = new FormData();
                    if (files.length > 1) {
                        UploadMultiplePreauthDMSFiles(files, DocClaimid, DOcSlno, DOcdocCategory, Docdocumentname, DocReceivedate, Docreceivedtype);
                    }
                    else if (files.length == 1) {
                        data.append("files", files[0]);
                        $('#progress1').hide();
                        $('#progressnew').show();
                        var ajaxRequest = $.ajax({
                            type: "POST",
                            //url: "/Claims/UploadPreauthDMSUploadajax?ClaimId=" + ClaimId + " &Slno=" + Slno + "&docCategory=" + docCategory + "&documentName=" + documentName + "&documentName=" + documentName + "Receivedate" + Receivedate + "&receivedtype" + receivedtype,

                            url: "/Claims/UploadPreauthDMSUploadajax?ClaimId=" + DocClaimid + " &Slno=" + DOcSlno + "&docCategory=" + DOcdocCategory + "&documentName=" + Docdocumentname.replace(/&/g, '-') + "&Receivedate=" + DocReceivedate + "&Receivedtype=" + Docreceivedtype,
                            contentType: false,
                            processData: false,
                            data: data,
                            success: function (data) {
                                if (data == "success") {
                                    issuccess += 1;
                                    //RemovefilefromList(issuccess);
                                    if ((issuccess + isFailed) == Vuploadfilecount) {
                                        $('#progressnew').hide();
                                        alert("Successfully uploaded.");
                                        $("#tblFileslist tbody").html(" ");
                                        $('#largeModal').modal('toggle');
                                        $("#largeModal").modal('hide');
                                        funClearData();
                                        GetDMSDocuments();
                                        window.location = '/MedicalScrutiny/index';
                                        //Retrieve_Attachments(VClaimid, 0, 0);
                                        //$('a[href="#tab4"]').click();
                                        //   $('#progress1').show();
                                    }
                                    // $("#largeModal").modal('hide');
                                    //alert("Successfully uploaded.");
                                    //$("#tblFileslist tbody").html(" ");
                                    //$("#largeModal").modal('hide');
                                    //funClearData();
                                    //GetDMSDocuments();
                                }
                                else {
                                    isFailed += 1;
                                    if ((issuccess + isFailed) == Vuploadfilecount) {
                                        alert('out of ' + Vuploadfilecount + ' files ' + issuccess + ' successs please check');
                                        $('#progressnew').hide();
                                        $("#tblFileslist tbody").html(" ");
                                        $('#largeModal').modal('toggle');
                                        $("#largeModal").modal('hide');
                                        funClearData();
                                        GetDMSDocuments();
                                        window.location = '/MedicalScrutiny/index';
                                    }
                                    //alert(data);
                                    //$('#progress1').hide();
                                    //$('#progressnew').hide();
                                }

                            },
                            error: function (err) {

                                $('#progress1').hide();
                                $('#progressnew').hide();
                                //alert(err);
                                alert('out of ' + Vuploadfilecount + ' files ' + issuccess + ' successs please check');
                            }
                        });
                    }
                    $('#hplIsDataBind').text("");
                    $("#tblFileslist tbody").html(" ");
                });
                DMSUploadMsg = "Success";

                $('#divfilebuttons').html('<span class="btn btn-success fileinput-button" id="spanfileupload1" ><i class="glyphicon glyphicon-plus"></i><span>Drop files to upload (or click) ...</span><input id="fileupload1" type="file" name="files" multiple onclick="fileonclick();" onchange="Filechange(this.files,1)"></span>');
            }
            //$('#progress1').hide();
        }
        else {
            alert('Please browse files to upload');
            $('#progress1').hide();
            $('#progressnew').hide();
            return false;
        }
        return "";
    }
    catch (e) {
        $('#progress1').hide();
        $('#progressnew').hide();
        alert("Unexpected Error Occured while upload files");
    }
    finally {
        //$('#progress1').hide();
    }
}

//added by vsvskprasad 4261 task
function ValiadteicdCode() {
    var flag = true;
    try {
        $.ajax({
            url: "/MedicalScrutiny/IcdCode_validation",
            type: "GET",
            contentType: 'application/json;charset=utf-8',
            beforeSend: function () { $("#progress1").show(); },
            async: false,
            data: {
                IcdCode: MakeZerofromUndefinedorEmpty($('#hdnICDCodeID').val())
            },
            success: function (data) {
                $("#progress1").hide();
                CheckSessionVariable(data);
                // data = $.parseJSON(data);
                if (data != null && data != "" && IcdInsurerConfig($('#hdnInsuranceCompanyID').val()) == true) {
                    DialogWarningMessage("please add max available level of icd code");
                    flag = false;
                }
                else {
                    //it is for 
                    $('#dialog-ICDCodes').dialog("close");
                }
            },
            error: function (e, x) {
                $("#progress1").hide();
                DialogResultMessage('Error Occured While Getting Package Limits');
                flag = false;
            }
        });
        return flag;
    }
    catch (e) {
        $("#progress1").hide();
        DialogResultMessage('Error Occured While Getting Package Limits');
        flag = false;
        return flag;
    }
}

//added by vsvskprasad 4261 task
function IcdInsurerConfig(InsID) {
    var result = false;
    var AllowInsurers = [5, 6, 7, 8];
    for (var i = 0; i < AllowInsurers.length; i++) {
        if (AllowInsurers[i] == InsID) {
            result = true;
            break;
        }
    }
    return result;
};

function ClearICDCodes() {

    $("#ddlICDLevel1").val('');
    $("#ddlICDLevel2 :gt(0)").remove();
    $("#ddlICDLevel3 :gt(0)").remove();
    $("#ddlICDLevel4 :gt(0)").remove();
    $("#ddlICDLevel5 :gt(0)").remove();
    $("#ddlICDLevel6 :gt(0)").remove();
    $("#ddlICDLevel7 :gt(0)").remove();
}
function Isitpreauth(ReqID) {
    var result = false;
    var Requesttype = [1, 2, 3];
    for (var i = 0; i < Requesttype.length; i++) {
        if (Requesttype[i] == ReqID) {
            result = true;
            break;
        }
    }
    return result;
}

function FillTariffDiscounts() {
    try {
        $.ajax({
            //type: "POST",
            url: "/MedicalScrutiny/ProviderDetails_Retrieve",
            contentType: 'application/json;charset=utf-8',
            //processData: false,
            data: { ClaimID: $('#hdnClaimID').val(), ProviderID: 0, MemberPolicyID: 0, DOA: null, IsFrmArchived: $('#hdnIsFrmArchived').val() },
            success: function (data) {

                data = $.parseJSON(data);
                if (data == null || data == "") {
                    //alert('Data not found.');
                }
                else {

                    $("#hdnMOUID").val(data.Table[0].MOUID); //SP3V-411 11May2023 Leena
                }
            },
            complete: function () {
                try {
                    $.ajax({
                        //type: "POST",
                        url: "/MedicalScrutiny/GetProviderServicePackageDisc",
                        contentType: 'application/json;charset=utf-8',
                        //processData: false,
                        data: { ClaimID: $('#hdnClaimID').val(), ProviderID: $("#hdnProviderID").val(), MouId: $('#hdnMOUID').val(), isFrmArchived: $('#hdnIsFrmArchived').val() },
                        success: function (data) {

                            data = $.parseJSON(data);
                            if (data == null || data == "") {
                                //alert('Data not found.');
                            }
                            else {
                                dtServiceDiscount = data.Table;
                                dtPackageDiscount = data.Table1;
                                dtProviderPackage = data.Table2;
                                dtFacility = data.Table3;
                                dtProcedures = data.Table4;
                                FillDiscGrid();
                            }

                        },
                        error: function (e, x) {
                            ShowResultMessage('ErrorMessage', e.responseText);

                        }
                    });
                } catch (e) {
                    alert(e.message);
                }

            },
            error: function (e, x) {
                ShowResultMessage('ErrorMessage', e.responseText);
            }
        });
    } catch (e) {
        alert(e.message);
    }
}


function bind_insurer_response_remarks() {
    if (basicData[0].Isrefertoinsurer == true) {
        if ($("#hdnInsuranceCompanyID").val() == "3") {
            if (basicData[0].IRreason_request == 448) {
                if ($('#ddlResponses').val() == "224")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to Approve the case");
                else if ($('#ddlResponses').val() == "225")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to Reject the case");
                else if ($('#ddlResponses').val() == "259")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to Query the case");
                else if ($('#ddlResponses').val() == "733")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to Re-Process the case");
            }
            else {
                if ($('#ddlResponses').val() == "224")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to approve and not to Reject the case");
                else if ($('#ddlResponses').val() == "225")
                    $('#taResponsefrom_Insurer').val("In line with TPA Decision on rejection and long with rejection remarks");
                else if ($('#ddlResponses').val() == "259")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to look on query comments");
                else if ($('#ddlResponses').val() == "733")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to Re-Process the case");
            }
        }
        else {
            if (basicData[0].IRreason_request == 448) {
                if ($('#ddlResponses').val() == "224")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to Approve the case");
                else if ($('#ddlResponses').val() == "225")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to Reject the case");
                else if ($('#ddlResponses').val() == "259")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to Query the case");
                else if ($('#ddlResponses').val() == "733")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to Re-Process the case");
            }
            else {
                if ($('#ddlResponses').val() == "224")
                    $('#taResponsefrom_Insurer').val("In line with TPA Decision on Approval");
                else if ($('#ddlResponses').val() == "225")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to reject and not to approve the case");
                else if ($('#ddlResponses').val() == "259")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to look on query comments");
                else if ($('#ddlResponses').val() == "733")
                    $('#taResponsefrom_Insurer').val("Insurer is asking TPA to Re-Process the case");
            }
        }
       

    }
}

function get_crc_letter() {
    var element = document.getElementById("rmcls");
    if (element.classList.contains('collapsed')) {
        element.classList.remove("collapsed");
        Get_ClaimRejectedReasons($('#hdnClaimID').val(), $('#hdnClaimSlNo').val());
    }
    IRTotalRejectedReasons = [];
    infertoinsureractioncheck(3);
    if (IRTotalRejectedReasons.length == 0) {
        DialogWarningMessage("You cannot submit the request without a reason for rejection. Please select a reason for rejection from the list and then submit.");
        return false;
    }
    else {
        try {
            $.ajax({
                url: "/MedicalScrutiny/update_crc_letter",
                beforeSend: function () { $("#progress1").show(); },
                contentType: 'application/json;charset=utf-8',
                data: { ClaimID: $('#hdnClaimID').val(), Slno: $('#hdnClaimSlNo').val(), ClaimRejections: JSON.stringify(IRTotalRejectedReasons) },
                success: function (data) {
                    $("#progress1").hide();
                    if (1 == 1)
                        myPopup('/Common/PrintView?ID=' + basicData[0].ClaimDetailsID + '&Flag=' + 3 + '&ClaimTypeID=' + basicData[0].ClaimTypeID + ' & PolicyTypeID=' + basicData[0].PolicyType + ' & ClaimStageID=' + 17 + ' & IsFrmArchived=' + false);
                }
            });
        }
        catch (e) {
            alert(e.message);
        }
    }
}

function get_rejection_letter() {
    var element = document.getElementById("rmcls");
    if (element.classList.contains('collapsed')) {
        element.classList.remove("collapsed");
        Get_ClaimRejectedReasons($('#hdnClaimID').val(), $('#hdnClaimSlNo').val());
    }
    IRTotalRejectedReasons = [];
    infertoinsureractioncheck(3);
    if (IRTotalRejectedReasons.length == 0) {
        DialogWarningMessage("You cannot submit the request without a reason for rejection. Please select a reason for rejection from the list and then submit.");
        return false;
    }
    else {
        try {
            $.ajax({
                url: "/MedicalScrutiny/update_rejction_letter",
                beforeSend: function () { $("#progress1").show(); },
                contentType: 'application/json;charset=utf-8',
                data: { ClaimID: $('#hdnClaimID').val(), Slno: $('#hdnClaimSlNo').val(), ClaimRejections: JSON.stringify(IRTotalRejectedReasons) },
                success: function (data) {
                    $("#progress1").hide();
                    if (1 == 1)
                        myPopup('/Common/PrintView?ID=' + basicData[0].ClaimDetailsID + '&Flag=' + 3 + '&ClaimTypeID=' + basicData[0].ClaimTypeID + ' & PolicyTypeID=' + basicData[0].PolicyType + ' & ClaimStageID=' + 23 + ' & IsFrmArchived=' + false);
                }
            });
        }
        catch (e) {
            alert(e.message);
        }
    }
}


function configureRejectionButton(isVisible, conditionType) {
    const btn = document.getElementById("show_rejection_letter");
    const label = document.getElementById("rejectionBtnLabel");

    if (!isVisible) {
        btn.style.display = "none";
        return;
    }
    btn.style.display = "inline-block";

    switch (conditionType) {
        case "Rejection":
            label.innerText = "Rejection Letter";
            break;
        case "Repudiation":
            label.innerText = "Pre-Repudiation Letter";
            break;
        default:
            label.innerText = "Letter";
    }
}



function SAA_ReviewedRemarks() {
    Remarks = $('#SAA_taReviewedRemarks').val();
    if (_objBsi != null) {
        var objsuminsured_SA = _objBsi["Suminsured"];
        var objbenefits_SA = _objBsi["OtherBenefits"];
        var Sublimits_SA = _objBsi["Sublimits"];
    }
    var Sublmtamt = 0; var baseremBal = 0; var mineliamt = 0;
    var sublimitflag_SA = false;

    if (isSumlimit) {
        if (Sublimits_SA.length > 0) {
            $.each(Sublimits_SA, function (i, item) {
                if (allowedsi.indexOf(item.BPSIID) != -1) {
                    Sublmtamt = item.Balance;
                    sublimitflag_SA = true;
                }
            })
        }
    }
    if (objsuminsured_SA != null) {
        $.each(objsuminsured_SA, function (i, item) {
            if (item.SICategery == 69) {
                baseremBal = item.Balance;
            }
        });
    }
    if (sublimitflag_SA == true) {
        if (Sublmtamt < baseremBal)
            mineliamt = Sublmtamt;
        else
            mineliamt = baseremBal;
    }
    else
        mineliamt = baseremBal;

    if (basicData[0].Sanctionedamount > mineliamt) {
        alert("There is no enough for member to approve current request, Please review return case");
        return false;
    }
    else {
        Check_OpenActionItems(22);
    }
}
function SAA_ReviewedRemarks_Insert(flag) {
    var Remarks = "";
    if (flag == 1) {
        Remarks = $('#SAA_taReviewedRemarks').val();
        if (_objBsi != null) {
            var objsuminsured_SA = _objBsi["Suminsured"];
            var objbenefits_SA = _objBsi["OtherBenefits"];
            var Sublimits_SA = _objBsi["Sublimits"];
        }
        var Sublmtamt = 0; var baseremBal = 0; var mineliamt = 0;
        var sublimitflag_SA = false;

        if (isSumlimit) {
            if (Sublimits_SA.length > 0) {
                $.each(Sublimits_SA, function (i, item) {
                    if (allowedsi.indexOf(item.BPSIID) != -1) {
                        Sublmtamt = item.Balance;
                        sublimitflag_SA = true;
                    }
                })
            }
        }
        if (objsuminsured_SA != null) {
            $.each(objsuminsured_SA, function (i, item) {
                if (item.SICategery == 69) {
                    baseremBal = item.Balance;
                }
            });
        }
        if (sublimitflag_SA == true) {
            if (Sublmtamt < baseremBal)
                mineliamt = Sublmtamt;
            else
                mineliamt = baseremBal;
        }
        else
            mineliamt = baseremBal;

        if (basicData[0].Sanctionedamount > mineliamt) {
            alert("There is no enough for member to approve current request, Please review return case");
            return false;
        }
        //var _utilizedamt = {};
        //_utilizedamt["MemberSIID"] = basicData[0].BPSIID;
        //_utilizedamt["SanctionedAmount"] = mineliamt;
        //_utilizedamt["BalanceAmount"] = baseremBal - mineliamt;
        //utilizedamtarray.push(_utilizedamt);
        Check_OpenActionItems(22);

    }
    else {
        Remarks = $('#SAA_taReviewReturnemarks').val();

        try {
            $.ajax({
                url: "/MedicalScrutiny/SAA_Submit_RequestReviewed_Insert",
                contentType: 'application/json;charset=utf-8',
                data: { ClaimID: $('#hdnClaimID').val(), Slno: $('#hdnClaimSlNo').val(), flag: flag, Remarks: Remarks },
                success: function (data) {
                    CheckSessionVariable(data.responseText);
                    if (flag == 1) {
                        DialogResultMessage(data);
                        window.location = '/Claims/Index';
                    }
                    else if (flag == 2) {
                        //$('#btnServiceBillDetailsSave,#btnHospDetailsSave,#btnCodingDetails').show();
                        //basicData[0].IsAutomationClaim = 7;
                        alert(data);
                        window.location = '/MedicalScrutiny/index';
                    }
                    if (data == null || data == "") {

                    }
                },
                error: function (e, x) {
                    ShowResultMessage('ErrorMessage', e.responseText);
                }
            });
        }
        catch (e) {
            alert(e.message);
        }
    }
}

function get_Approval_letter() {
    try {
        myPopup('/Common/PrintView?ID=' + $('#hdnClaimID').val() + '&Flag=' + 4 + '&ClaimTypeID=' + basicData[0].ClaimTypeID + ' & PolicyTypeID=' + basicData[0].PolicyType + ' & ClaimStageID=' + 24 + ' & IsFrmArchived=' + false);
    }
    catch (e) {
        alert(e.message);
    }
}

function BackToBillingStage(_ClaimID, _SlNo) {
    if (basicData[0].RequestTypeID == 4 || basicData[0].ClaimTypeID == 2) {
        DialogWarningMessage("The claim cannot be moved to Refer to Billing");
        return false;
    }
    $("#RefertoBillingModal").modal('show');
    $.ajax({
        url: "/MedicalScrutiny/ReferInsDetails_Retrieve",
        contentType: 'application/json;charset=utf-8',
        data: {
            ClaimID: _ClaimID, SlNo: _SlNo
        },
        success: function (data) {
            CheckSessionVariable(data.responseText);
            data = $.parseJSON(data);

            if (data == null || data == "") {
            }
            else {
                $('#taReferto_Insurer').val(data[0].Remarks);
            }
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });
}

function CheckMulitplStagesOpen(_ClaimID, _SlNo) {
    if (basicData[0].IS_ADJ_FROM_QR == 1 && isQuery_Responsed == 0) {
        DialogWarningMessage("Response Generated for the Raised Queries. please Process first before moving to other Stages");
        return false;
    }
    var value = CheckIsValidProvider();
    if (basicData[0].Isrefertoinsurer == true) {
        if (MakeZerofromUndefinedorEmpty(providerstatus) != 0) {
            if (providerstatus.includes("Blacklist")) {
                alert("Warning! You are performing an action against " + providerstatus + " hospital. Only rejection is possible.");
                return false;
            }
        }
    }
    $.ajax({
        url: "/MedicalScrutiny/CheckMultipleStageOpen",
        contentType: 'application/json;charset=utf-8',
        data: {
            ClaimID: _ClaimID, SlNo: _SlNo
        },
        success: function (data) {
            CheckSessionVariable(data.responseText);
            data = $.parseJSON(data);

            if (data == null || data == "") {
            }
            else {
                if (data[0].CountValue > 0) {
                    alert("Can not Move to Billing until all other Stages Close!!");
                    return;
                }
                else {
                    BackToBillingStage(_ClaimID, _SlNo);
                }
            }
        },
        error: function (e, x) {
            ShowResultMessage('ErrorMessage', e.responseText);
        }
    });

}

function btnReferToBillingCancel() {
    $("#RefertoBillingModal").modal('hide');
}

var Coverages = [];
function Get_claim_Coverages_details() {
    try {
        $.ajax({
            url: "/MedicalScrutiny/GetCoverageEligibility_OPD",
            contentType: 'application/json;charset=utf-8',
            beforeSend: function () { $("#progress1").show(); },
            data: { ClaimID: $('#hdnClaimID').val(), Slno: $('#hdnClaimSlNo').val(), CoverageID: 0 },
            async: false,
            success: function (data1) {
                $("#progress1").hide();
                if (data1 != null && data1 != []) {
                    Coverages = JSON.parse(data1);
                    //$("#ID_OPD_limits_tbody_OutOfSI").empty();
                    //$.each(data, function (i, item) {
                    //    bind_OPD_limits_OutOfSI(item, 'ID_OPD_limits_OutOfSI');
                    //});
                }
            }
        });
    }
    catch (e) {
        $("#progress1").hide();
        alert(e.message);
    }
}


function bind_OPD_claimdata_Service(services) {
    var serviceslist = services.toString().split(',');
    var bindserlist = [];
    if (serviceslist.indexOf("52") != 0) {
        $.each(Coverages.Table2, function (j, item1) {
            if (serviceslist.indexOf(item1.ServicesubType.toString()) > -1 && item1.ServicetypeID == 2) {
                bindserlist.push(item1);
            }
        });
        bind_OPD_claimdata(bindserlist, 'tblBSI_OPD_utilization', 6);
    }
    else {
        $.each(Coverages.Table2, function (i, item) {
            if (item.ServicetypeID == 2 && item.BPConditionID == 93) {
                bindserlist.push(item);
            }
        });
        bind_OPD_claimdata(bindserlist, 'tblBSI_OPD_utilization', 6);
    }
}

function bind_OPD_claimdata_coverage(BPConditionID) {
    var bindserlist = [];
    if (Coverages.Table2.length > 0) {
        $.each(Coverages.Table2, function (i, item) {
            if (item.BPConditionID == BPConditionID) {
                bindserlist.push(item);
            }
        });
        bind_OPD_claimdata(bindserlist, 'tblBSI_OPD_utilization', 6);
    }
}
function bind_OPD_claimdata(data, tableId, count) {
    if (data != null) {
        $('#' + tableId).html('');
        var columns = [];
        if ((data != null)) {
            columns = GetColumnsOfJsonObj(data[0]);
            var tHead = "<thead><tr>";
            if (count == null || count == undefined || count == '')
                count = columns.length;
            count = (columns.length > count) ? count : columns.length;
            for (var i = 0; i < count; i++) {
                tHead = tHead + "<th>" + columns[i] + "</th>";
            }
            tHead = tHead + "</tr></thead>";
            $("#" + tableId).append(tHead);
            for (var i = 0; i <= data.length; i++) {
                if (data[i] != null) {
                    var tr = "<tr class='tr'>";

                    for (var j = 0; j < count; j++) {
                        if (columns[j] == 'ServicesubType') {
                            var ServiceTypeID = getNamepropwithId(data[i]['ServicesubType'], MasterData.mClaimServiceType);
                            if (data[i].CoverageID != 32)
                                ServiceTypeID = data[i].CoverageName;
                            //tr = tr + "<td><a href='#' onclick='Bindutilization_service(" + data[i]['ServicesubType'] + ")'>" + ServiceTypeID + "</a></td>";
                            tr = tr + "<td>" + ServiceTypeID + "</td>";
                        }
                        else if (columns[j] == 'ClaimID') {
                            tr = tr + "<td>" + data[i]['ClaimID'] + '-' + data[i]['Slno'] + "</td>";
                        }
                        else if (columns[j] == 'Relationship') {
                            var Relationship = getNamepropwithId(data[i]['Relationship'], MasterData.Mst_RelationShip);
                            tr = tr + "<td>" + Relationship + "</td>";
                        }
                        else {
                            tr = tr + "<td>" + data[i][columns[j]] + "</td>";
                        }
                    }
                    tr = tr + "</tr>";
                    $("#" + tableId).append(tr);
                }
            }
        }
        if ((data.length == 0) || (data == null)) {
            var $tr = $('<tr class="tr">').append($('<td colspan="8" style=" font-size:large; color:#3A798C;text-align:center;">').text("No Records Found")
            ).appendTo('#' + tableId);
        }
    }
}

function bind_OPD_limits_OutOfSI(data, tableId) {
    var tbodydata = '';
    // $('#ID_OPD_limits').show();
    if (data != null) {
        OpDServicesubType = data.OpDServicesubType;
        OPD_Suminsured = data.OPDfamilyLimit;
        OPD_Utilized = data.OPDUtilizedfamilyLimit;
        OPD_Balance = data.OPDAvailableFamilyLimit;

        var tr = "<tr class='tr'>";
        if (data.BPConditionID == 93 && data.OpDServicesubType != null && data.OpDServicesubType != '')
            // tr = tr + "<td>" + data.BpConditionName + "  " + "[" + getServicesubtypeNames(data.OpDServicesubType) + "]" + "</td>";
            tr = tr + "<td><a href='#' onclick='bind_OPD_claimdata_Service(\"" + data.OpDServicesubType + "\")'>" + data.BpConditionName + "  " + "[" + getServicesubtypeNames(data.OpDServicesubType) + "]" + "</a></td>";
        else
            tr = tr + "<td><a href='#' onclick='bind_OPD_claimdata_coverage(" + data.BPConditionID + ")'>" + data.BpConditionName + "</td>";

        if (data.OPDfamilyLimit > 0)
            tr = tr + "<td>" + data.OPDfamilyLimit + "</td>";
        else
            tr = tr + "<td>" + '' + "</td>";

        if (data.OPDIndividualLimit > 0)
            tr = tr + "<td>" + data.OPDIndividualLimit + "</td>";
        else
            tr = tr + "<td>" + '' + "</td>";

        if (data.OpdClaimLimit > 0)
            tr = tr + "<td>" + data.OpdClaimLimit + "</td>";
        else
            tr = tr + "<td>" + '' + "</td>";

        if (data.OPDfamilyLimit > 0)
            tr = tr + "<td>" + data.OPDUtilizedfamilyLimit + "</td>";
        else
            tr = tr + "<td>" + '' + "</td>";

        if (data.OPDIndividualLimit > 0)
            tr = tr + "<td>" + data.OPDUtilizedIndividuallimit + "</td>";
        else
            tr = tr + "<td>" + '' + "</td>";

        if (data.OpdClaimLimit > 0)
            tr = tr + "<td>" + data.OPDUtilizedIndividuallimit + "</td>";
        else
            tr = tr + "<td>" + '' + "</td>";

        if (data.OPDfamilyLimit > 0)
            tr = tr + "<td>" + data.OPDAvailableFamilyLimit + "</td>";
        else
            tr = tr + "<td>" + '' + "</td>";

        if (data.OPDIndividualLimit > 0)
            tr = tr + "<td>" + data.OPDAvailbaleIndividualLimit + "</td>";
        else
            tr = tr + "<td>" + '' + "</td>";

        if (data.OpdClaimLimit > 0)
            tr = tr + "<td>" + data.OPDAvailClaimLimit + "</td>";
        else
            tr = tr + "<td>" + '' + "</td>";

        if (data.DailyLimit > 0)
            tr = tr + "<td>" + data.DailyLimit + "</td>";
        else
            tr = tr + "<td>" + '' + "</td>";

        if (data.iscovered == true)
            tr = tr + "<td>" + "Covered" + "</td>";
        else
            tr = tr + "<td>" + "Not Covered" + "</td>";

        tr = tr + "</tr>";
        // $("#" + tableId).append(tr);
        tbodydata = tbodydata + tr;
    }
    $("#ID_OPD_limits_tbody_OutOfSI").append(tbodydata);
}
function Get_claim_Coverages(flag) {
    try {
        Get_claim_Coverages_details();
        MasterData.Mst_Coverages = [];
        MasterData.Mst_Coverages = Coverages.Table1;
        LoadCoveragesData(flag);
    }
    catch (e) {
        alert(e.message);
    }
}
function viewOPD_OutofAssign() {
    try {
        var data = Coverages.Table;
        var data1 = Coverages.Table2;
        $("#ID_OPD_limits_tbody_OutOfSI").empty();
        $.each(data, function (i, item) {
            bind_OPD_limits_OutOfSI(item, 'ID_OPD_limits_OutOfSI');
        });
        $('#OPDUtilization_outofSI').modal('show');
        $("#OPD_model_body_OutOfSI").show();
        $(".btnBalancedUtilization_OutOfSI").attr("disabled", false);
        if (data1.length > 0) {
            bind_OPD_claimdata(data1, 'tblBSI_OPD_utilization', 6);
        }
    }
    catch (e) {
        alert(e.message);
    }
}

function copayapplicableonbuffer(flag, SIamount, Bufferamount) {
    try {
        if (flag == true)
            return true;
        else if (flag == false && SIamount == Bufferamount)
            return false;
        else
            return true;
    }
    catch (e) {
        alert(e.message);
    }
}
