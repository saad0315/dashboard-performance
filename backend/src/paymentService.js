"use strict";

var ApiContracts = require("authorizenet").APIContracts;
var ApiControllers = require("authorizenet").APIControllers;
require("dotenv").config();

// function chargeCreditCard(paymentDetails, callback) {
//   var merchantAuthenticationType =
//     new ApiContracts.MerchantAuthenticationType();
//   merchantAuthenticationType.setName("2DE9nu2p6");
//   merchantAuthenticationType.setTransactionKey("59MNhDT5gXb29236");

//   var creditCard = new ApiContracts.CreditCardType();
//   creditCard.setCardNumber(paymentDetails?.creditCardNumber);
//   creditCard.setExpirationDate(paymentDetails?.expirationDate);
//   creditCard.setCardCode(paymentDetails?.cardCode);

//   var paymentType = new ApiContracts.PaymentType();
//   paymentType.setCreditCard(creditCard);

//   var orderDetails = new ApiContracts.OrderType();
//   orderDetails.setInvoiceNumber(paymentDetails?.invoiceNumber);
//   orderDetails.setDescription(paymentDetails?.project?.projectName);

//   var billTo = new ApiContracts.CustomerAddressType();
//   billTo.setFirstName("Mr/Mrs");
//   billTo.setLastName(paymentDetails?.name);
//   billTo.setCompany("Bellevue Publishers");
//   billTo.setAddress(paymentDetails?.billTo?.address);
//   billTo.setCity(paymentDetails?.billTo?.city);
//   billTo.setState(paymentDetails?.billTo?.state);
//   billTo.setZip(paymentDetails?.billTo?.zip);
//   billTo.setCountry(paymentDetails?.billTo?.country);

//   var userField_a = new ApiContracts.UserField();
//   userField_a.setName("Company Name");
//   userField_a.setValue("Bellevue Publishers");

//   var userField_b = new ApiContracts.UserField();
//   userField_b.setName("Customer Name");
//   userField_b.setValue(paymentDetails?.customer?.userName);

//   var userFieldList = [];
//   userFieldList.push(userField_a);
//   userFieldList.push(userField_b);

//   var userFields = new ApiContracts.TransactionRequestType.UserFields();
//   userFields.setUserField(userFieldList);

//   var transactionSetting1 = new ApiContracts.SettingType();
//   transactionSetting1.setSettingName("duplicateWindow");
//   transactionSetting1.setSettingValue("120");
//   var transactionSettingList = [];
//   transactionSettingList.push(transactionSetting1);
//   var transactionSettings = new ApiContracts.ArrayOfSetting();
//   transactionSettings.setSetting(transactionSettingList);

//   var transactionRequestType = new ApiContracts.TransactionRequestType();
//   transactionRequestType.setTransactionType(
//     ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
//   );
//   transactionRequestType.setPayment(paymentType);
//   transactionRequestType.setAmount(paymentDetails.paidToDate);
//   transactionRequestType.setUserFields(userFields);
//   transactionRequestType.setOrder(orderDetails);
//   transactionRequestType.setBillTo(billTo);
//   transactionRequestType.setTransactionSettings(transactionSettings);
//   var createRequest = new ApiContracts.CreateTransactionRequest();
//   createRequest.setMerchantAuthentication(merchantAuthenticationType);
//   createRequest.setTransactionRequest(transactionRequestType);
//   //pretty print request
//   console.log(JSON.stringify(createRequest.getJSON(), null, 2));
//   var ctrl = new ApiControllers.CreateTransactionController(
//     createRequest.getJSON()
//   );

//   ctrl.execute(function () {
//     var apiResponse = ctrl.getResponse();

//     var response = new ApiContracts.CreateTransactionResponse(apiResponse);

//     //pretty print response
//     console.log(JSON.stringify(response, null, 2));

//     if (response != null) {
//       if (
//         response.getMessages().getResultCode() ==
//         ApiContracts.MessageTypeEnum.OK
//       ) {
//         if (response.getTransactionResponse().getMessages() != null) {
//           console.log(
//             "Successfully created transaction with Transaction ID: " +
//             response.getTransactionResponse().getTransId()
//           );
//           console.log(
//             "Response Code: " +
//             response.getTransactionResponse().getResponseCode()
//           );
//           console.log(
//             "Message Code: " +
//             response
//               .getTransactionResponse()
//               .getMessages()
//               .getMessage()[0]
//               .getCode()
//           );
//           console.log(
//             "Description: " +
//             response
//               .getTransactionResponse()
//               .getMessages()
//               .getMessage()[0]
//               .getDescription()
//           );
//         } else {
//           console.log("Failed Transaction.");
//           if (response.getTransactionResponse().getErrors() != null) {
//             console.log(
//               "Error Code: " +
//               response
//                 .getTransactionResponse()
//                 .getErrors()
//                 .getError()[0]
//                 .getErrorCode()
//             );
//             console.log(
//               "Error message: " +
//               response
//                 .getTransactionResponse()
//                 .getErrors()
//                 .getError()[0]
//                 .getErrorText()
//             );
//           }
//         }
//       } else {
//         console.log("Failed Transaction. ");
//         if (
//           response.getTransactionResponse() != null &&
//           response.getTransactionResponse().getErrors() != null
//         ) {
//           console.log(
//             "Error Code: " +
//             response
//               .getTransactionResponse()
//               .getErrors()
//               .getError()[0]
//               .getErrorCode()
//           );
//           console.log(
//             "Error message: " +
//             response
//               .getTransactionResponse()
//               .getErrors()
//               .getError()[0]
//               .getErrorText()
//           );
//         } else {
//           console.log(
//             "Error Code: " + response.getMessages().getMessage()[0].getCode()
//           );
//           console.log(
//             "Error message: " + response.getMessages().getMessage()[0].getText()
//           );
//         }
//       }
//     } else {
//       console.log("Null Response.");
//     }

//     callback(response);
//   });
// }

function chargeCreditCard(paymentDetails, callback) {
  const merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName("8FRN32psd8");
  merchantAuthenticationType.setTransactionKey("4JyqKK92Bk8ub42e");
  // merchantAuthenticationType.setName("96YuAe2ey");
  // merchantAuthenticationType.setTransactionKey("46GKpx86vdQs4877");

  // ✅ Use opaqueData instead of raw card info
  const opaqueData = new ApiContracts.OpaqueDataType();
  opaqueData.setDataDescriptor(paymentDetails.opaqueData.dataDescriptor);
  opaqueData.setDataValue(paymentDetails.opaqueData.dataValue);

  const paymentType = new ApiContracts.PaymentType();
  paymentType.setOpaqueData(opaqueData);

  const orderDetails = new ApiContracts.OrderType();
  orderDetails.setInvoiceNumber(paymentDetails?.invoice?.invoiceNumber);
  orderDetails.setDescription(
    paymentDetails?.project?.projectName || "Payment"
  );

  var billTo = new ApiContracts.CustomerAddressType();
  billTo.setFirstName("Mr/Mrs");
  billTo.setLastName(paymentDetails?.billTo?.name);
  billTo.setCompany(paymentDetails?.companyName);
  billTo.setAddress(paymentDetails?.billTo?.address);
  billTo.setCity(paymentDetails?.billTo?.city);
  billTo.setState(paymentDetails?.billTo?.state);
  billTo.setZip(paymentDetails?.billTo?.zip);
  billTo.setEmail(paymentDetails?.billTo?.email);

  const transactionRequestType = new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(paymentDetails.amount);
  transactionRequestType.setBillTo(billTo);

  const customerData = new ApiContracts.CustomerDataType();
  customerData.setEmail(paymentDetails?.billTo?.email);
  transactionRequestType.setCustomer(customerData);

  // Optional settings (unchanged)
  const transactionSetting1 = new ApiContracts.SettingType();
  transactionSetting1.setSettingName("duplicateWindow");
  transactionSetting1.setSettingValue("120");

  const transactionSettings = new ApiContracts.ArrayOfSetting();
  transactionSettings.setSetting([transactionSetting1]);

  transactionRequestType.setTransactionSettings(transactionSettings);
  transactionRequestType.setOrder(orderDetails);

  const createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  const ctrl = new ApiControllers.CreateTransactionController(
    createRequest.getJSON()
  );
  ctrl.setEnvironment("https://api2.authorize.net/xml/v1/request.api");

  ctrl.execute(() => {
    const apiResponse = ctrl.getResponse();
    const response = new ApiContracts.CreateTransactionResponse(apiResponse);

    console.log(JSON.stringify(response, null, 2));
    callback(response);
  });
}

function getTransactionDetails(transactionId, callback) {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName("8FRN32psd8");
  merchantAuthenticationType.setTransactionKey("4JyqKK92Bk8ub42e");
  // merchantAuthenticationType.setName("96YuAe2ey");
  // merchantAuthenticationType.setTransactionKey("46GKpx86vdQs4877");

  var getRequest = new ApiContracts.GetTransactionDetailsRequest();
  getRequest.setMerchantAuthentication(merchantAuthenticationType);
  getRequest.setTransId(transactionId);

  console.log(JSON.stringify(getRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.GetTransactionDetailsController(
    getRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.GetTransactionDetailsResponse(apiResponse);

    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        console.log(
          "Transaction Id : " + response.getTransaction().getTransId()
        );
        console.log(
          "Transaction Type : " + response.getTransaction().getTransactionType()
        );
        console.log(
          "Message Code : " + response.getMessages().getMessage()[0].getCode()
        );
        console.log(
          "Message Text : " + response.getMessages().getMessage()[0].getText()
        );
      } else {
        console.log("Result Code: " + response.getMessages().getResultCode());
        console.log(
          "Error Code: " + response.getMessages().getMessage()[0].getCode()
        );
        console.log(
          "Error message: " + response.getMessages().getMessage()[0].getText()
        );
      }
    } else {
      console.log("Null Response.");
    }

    callback(response);
  });
}
// merchantAuthenticationType.setName("96YuAe2ey");
// merchantAuthenticationType.setTransactionKey("46GKpx86vdQs4877");

function capturePreviouslyAuthorizedAmount(transactionId, callback) {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName("8FRN32psd8");
  merchantAuthenticationType.setTransactionKey("4JyqKK92Bk8ub42e");

  var orderDetails = new ApiContracts.OrderType();
  orderDetails.setInvoiceNumber(transactionId.invoice.invoiceNumber);
  orderDetails.setDescription(transactionId.invoice.project.projectName);

  var transactionRequestType = new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    ApiContracts.TransactionTypeEnum.PRIORAUTHCAPTURETRANSACTION
  );
  transactionRequestType.setRefTransId(transactionId.transId);
  transactionRequestType.setOrder(orderDetails);

  transactionRequestType.setAmount(transactionId.amount);

  var createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  //pretty print request
  console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.CreateTransactionController(
    createRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.CreateTransactionResponse(apiResponse);

    //pretty print response
    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        if (response.getTransactionResponse().getMessages() != null) {
          console.log(
            "Successfully created transaction with Transaction ID: " +
              response.getTransactionResponse().getTransId()
          );
          console.log(
            "Response Code: " +
              response.getTransactionResponse().getResponseCode()
          );
          console.log(
            "Message Code: " +
              response
                .getTransactionResponse()
                .getMessages()
                .getMessage()[0]
                .getCode()
          );
          console.log(
            "Description: " +
              response
                .getTransactionResponse()
                .getMessages()
                .getMessage()[0]
                .getDescription()
          );
        } else {
          console.log("Failed Transaction.");
          if (response.getTransactionResponse().getErrors() != null) {
            console.log(
              "Error Code: " +
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorCode()
            );
            console.log(
              "Error message: " +
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorText()
            );
          }
        }
      } else {
        console.log("Failed Transaction. ");
        if (
          response.getTransactionResponse() != null &&
          response.getTransactionResponse().getErrors() != null
        ) {
          console.log(
            "Error Code: " +
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorCode()
          );
          console.log(
            "Error message: " +
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorText()
          );
        } else {
          console.log(
            "Error Code: " + response.getMessages().getMessage()[0].getCode()
          );
          console.log(
            "Error message: " + response.getMessages().getMessage()[0].getText()
          );
        }
      }
    } else {
      console.log("Null Response.");
    }

    callback(response);
  });
}

function getAnAcceptPaymentPage(invoice, callback) {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName("975NZD7sky");
  merchantAuthenticationType.setTransactionKey("42T828m6LuxJ2u77");

  var transactionRequestType = new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );
  transactionRequestType.setAmount(invoice.totalAmount);

  // var customerProfileType = new ApiContracts.CustomerProfilePaymentType();
  // customerProfileType.setCustomerProfileId(invoice.customerProfileId || "123456789");
  // transactionRequestType.setProfile(customerProfileType);
  ///////////////////////////////////////////////

  // var customerData = new ApiContracts.CustomerDataType();
  // customerData.setEmail(invoice.customer.userEmail);
  // transactionRequestType.setCustomer(customerData);

  //////////////////////////////////////////////

  // var billTo = new ApiContracts.CustomerAddressType();
  // billTo.setFirstName("Mr/Mrs");
  // billTo.setLastName(invoice.customer.lastName || "Saad Madcom");
  // billTo.setEmail(invoice.customer.userEmail);
  // // Add other address fields if available in your customer data
  // billTo.setCompany("Belleuve Publishers");
  // billTo.setAddress("123 Main St");
  // billTo.setCity("Anytown");
  // billTo.setState("CA");
  // billTo.setZip("12345");
  // billTo.setCountry("USA");
  // transactionRequestType.setBillTo(billTo);

  // // ✅ Add Customer section like official
  // const customerData = new ApiContracts.CustomerDataType();
  // customerData.setType(ApiContracts.CustomerTypeEnum.INDIVIDUAL);
  // customerData.setEmail(invoice.customer.userEmail);
  // customerData.setId("cust-" + Date.now());
  // transactionRequestType.setCustomer(customerData);

  // // ✅ Add transactionSettings
  // const duplicateWindowSetting = new ApiContracts.SettingType();
  // duplicateWindowSetting.setSettingName("duplicateWindow");
  // duplicateWindowSetting.setSettingValue("60");

  // const testRequestSetting = new ApiContracts.SettingType();
  // testRequestSetting.setSettingName("testRequest");
  // testRequestSetting.setSettingValue("false");

  // const transactionSettingList = [duplicateWindowSetting, testRequestSetting];
  // const transactionSettingArray = new ApiContracts.ArrayOfSetting();
  // transactionSettingArray.setSetting(transactionSettingList);
  // transactionRequestType.setTransactionSettings(transactionSettingArray);

  const settings = [
    { name: "hostedPaymentButtonOptions", value: '{"text": "Pay"}' },
    { name: "hostedPaymentOrderOptions", value: '{"show": false}' },
    // {
    //   name: 'hostedPaymentReturnOptions',
    //   value: '{"showReceipt": true, "url": "https://amazonpublishing.testinglinq.com/receipt", "urlText": "Continue", "cancelUrl": "https://amazonpublishing.testinglinq.com/cancel", "cancelUrlText": "Cancel"}'
    // },
    {
      name: "hostedPaymentPaymentOptions",
      value:
        '{"cardCodeRequired": false, "showCreditCard": true, "showBankAccount": true}',
    },
    { name: "hostedPaymentSecurityOptions", value: '{"captcha": false}' },
    {
      name: "hostedPaymentShippingAddressOptions",
      value: '{"show": false, "required": false}',
    },
  ].map((s) => {
    const setting = new ApiContracts.SettingType();
    setting.setSettingName(s.name);
    setting.setSettingValue(s.value);
    return setting;
  });

  const alist = new ApiContracts.ArrayOfSetting();
  alist.setSetting(settings);

  var getRequest = new ApiContracts.GetHostedPaymentPageRequest();
  getRequest.setMerchantAuthentication(merchantAuthenticationType);
  getRequest.setTransactionRequest(transactionRequestType);
  getRequest.setHostedPaymentSettings(alist);

  console.log(
    "Request payload:",
    JSON.stringify(getRequest.getJSON(), null, 2)
  );

  var ctrl = new ApiControllers.GetHostedPaymentPageController(
    getRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    if (apiResponse == null) {
      return callback({
        error: "Null response received",
        code: "E_NULL_RESPONSE",
      });
    }

    var response = new ApiContracts.GetHostedPaymentPageResponse(apiResponse);

    // console.log('Full API Response:', JSON.stringify(response.getJSON(), null, 2));

    if (
      response.getMessages().getResultCode() !== ApiContracts.MessageTypeEnum.OK
    ) {
      const errorMessage = response.getMessages().getMessage()[0];
      return callback({
        error: `Error Code: ${errorMessage.getCode()}, Error Message: ${errorMessage.getText()}`,
        code: errorMessage.getCode(),
      });
    }

    console.log(JSON.stringify(response.getJSON(), null, 2)); // Log full response for debugging
    callback(null, response);
  });
}

if (require.main === module) {
  getAnAcceptPaymentPage(function () {
    console.log("getAnAcceptPaymentPage call complete.");
  });
}

// 	ctrl.execute(function(){
// 		var apiResponse = ctrl.getResponse();

// 		if (apiResponse != null) var response = new ApiContracts.GetHostedPaymentPageResponse(apiResponse);

// 		//pretty print response
// 		//console.log(JSON.stringify(response, null, 2));

// 		if(response != null)
// 		{
// 			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
// 			{
// 				console.log('Hosted payment page token :');
// 				console.log(response.getToken());
// 			}
// 			else
// 			{
// 				//console.log('Result Code: ' + response.getMessages().getResultCode());
// 				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
// 				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
// 			}
// 		}
// 		else
// 		{
// 			var apiError = ctrl.getError();
// 			console.log(apiError);
// 			console.log('Null response received');
// 		}

// 		callback(response);
// 	});
// }

///////////////////////

// function getAnAcceptPaymentPage(amount, callback) {
//   const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
//   merchantAuthenticationType.setName("96YuAe2ey");
//   merchantAuthenticationType.setTransactionKey("46GKpx86vdQs4877");

//   const transactionRequestType = new ApiContracts.TransactionRequestType();
//   transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
//   transactionRequestType.setAmount(amount);

//   const setting1 = new ApiContracts.SettingType();
//   setting1.setSettingName('hostedPaymentButtonOptions');
//   setting1.setSettingValue('{"text": "Pay"}');

//   const setting2 = new ApiContracts.SettingType();
//   setting2.setSettingName('hostedPaymentOrderOptions');
//   setting2.setSettingValue('{"show": false}');

//   const settingList = [setting1, setting2];
//   const alist = new ApiContracts.ArrayOfSetting();
//   alist.setSetting(settingList);

//   const getRequest = new ApiContracts.GetHostedPaymentPageRequest();
//   getRequest.setMerchantAuthentication(merchantAuthenticationType);
//   getRequest.setTransactionRequest(transactionRequestType);
//   getRequest.setHostedPaymentSettings(alist);

//   const ctrl = new ApiControllers.GetHostedPaymentPageController(getRequest.getJSON());

//   ctrl.execute(() => {
//     const apiResponse = ctrl.getResponse();
//     const response = new ApiContracts.GetHostedPaymentPageResponse(apiResponse);

//     if (
//       response &&
//       response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK
//     ) {
//       callback(null, response.getToken());
//     } else {
//       callback(new Error('Failed to get hosted payment token'), null);
//     }
//   });
// }

module.exports = {
  chargeCreditCard,
  getAnAcceptPaymentPage,
  getTransactionDetails,
  capturePreviouslyAuthorizedAmount,
};
