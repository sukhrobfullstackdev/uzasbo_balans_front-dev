import { combineReducers } from "redux";

import navigationReducer from "./navigation-slice";
import historyModalReducer from "./history-modal-slice";

//Admin
import userListReducer from "../App/views/Admin/User/_redux/usersSlice";
import organizationListReducer from "../App/views/Admin/Organization/_redux/organizationsSlice";
import rolesListReducer from "../App/views/Admin/Roles/_redux/rolesSlice";
import changeDocSatusReducer from "../App/views/Admin/ChangeDocStatus/_redux/changeDocStatusSlice";
import orgHeaderInfoListReducer from "../App/views/Admin/OrganizationHeaderInfo/_redux/orgHeaderInfoSlice";
import formaDKPositionListReducer from "../App/views/Admin/FormaDKPositionCanEdit/_redux/getListSlice";
//Admin end

//Documents
import paymentRequestReducer from "../App/views/Documents/PaymentDocuments/PaymentRequest/_redux/getListSlice";
//import inpaymentListReducer from "../App/views/Documents/PaymentDocuments/Inpayment/_redux/getListSlice";
///
import IncomeCashOrderReducer from "../App/views/Documents/CashAccounting/IncomeCashOrder/_redux/getListSlice";
import CurrencyIncomeCashOrderReducer from "../App/views/Documents/CashAccounting/CurrencyIncomeCashOrder/_redux/getListSlice";
import CurrencyOutcomeCashOrderReducer from "../App/views/Documents/CashAccounting/CurrencyOutcomeCashOrder/_redux/getListSlice";
import OutcomeCashOrderReducer from "../App/views/Documents/CashAccounting/OutcomeCashOrder/_redux/getListSlice";
///
import PermanentAssetReappraisalReducer from "../App/views/Documents/AccountingofFixedAssets/PermanentAssetReappraisal/_redux/getListSlice";
import PermanentAssetAgeingReducer from "../App/views/Documents/AccountingofFixedAssets/PermanentAssetAgeing/_redux/getListSlice";
import PermanentAssetMovementFromStowegeReducer from "../App/views/Documents/AccountingofFixedAssets/PermanentAssetMovementFromStowege/_redux/getListSlice";
import PermanentAssetMovementReducer from "../App/views/Documents/AccountingofFixedAssets/PermanentAssetMovement/_redux/getListSlice";
import PermanentAssetRetirementReducer from "../App/views/Documents/AccountingofFixedAssets/PermanentAssetRetirement/_redux/getListSlice";


///
import studentContractReducer from "../App/views/Documents/Others/StudentContract/_redux/getListSlice";
import paymentOrderReducer from "../App/views/Documents/PaymentDocuments/PaymentOrder/_redux/getListSlice";
import paymentRegisterReducer from "../App/views/Documents/PaymentDocuments/PaymentRegister/_redux/getListSlice";
import treasuryMemOrderReducer from "../App/views/Documents/PaymentDocuments/TreasuryMemOrder/_redux/getListSlice";
import onlinePaymentReducer from "../App/views/Documents/PaymentDocuments/OnlinePayment/_redux/getListSlice";
import sentPaymentOrderReducer from "../App/views/Documents/PaymentDocuments/SentPaymentOrder/_redux/getListSlice";
import InventoryHoldingIntakeReducer from "../App/views/Documents/InventoryHoldingReserve/InventoryHoldingIntake/_redux/getListSlice";
import InventoryHoldingIntakeUnpaidReducer from "../App/views/Documents/InventoryHoldingReserve/InventoryHoldingIntakeUnpaid/_redux/getListSlice";
import foodstuffIntakeReducer from "../App/views/Documents/AccountingForFood/FoodstuffIntake/_redux/getListSlice";
import RequestForSettlementAccountReducer from "../App/views/Documents/ElectronicApplication/RequestForSettlementAccount/_redux/getListSlice";
//Documents end

// References
import contractsListReducer from "../App/views/References/Organizational/Contracts/_redux/getListSlice";
import contractsReducer from "../App/views/References/Organizational/Contracts/_redux/contractsSlice";
import contractorsReducer from "../App/views/References/Organizational/Contractors/_redux/getListSlice";
import premanetAssetReducer from "../App/views/References/Organizational/PermanentAsset/_redux/getListSlice";
import subAccReducer from "../App/views/References/Organizational/SubAcc/_redux/getListSlice";
import InventoryHoldingReducer from "../App/views/References/Organizational/InventoryHolding/_redux/getListSlice";
import ResponsiblePersonReducer from "../App/views/References/Organizational/ResponsiblePerson/_redux/getListSlice";
import ConstantValueReducer from "../App/views/References/Organizational/ConstantValue/_redux/getListSlice";
import childrenReducer from "../App/views/References/Organizational/Children/_redux/getListSlice";
import departmentReducer from "../App/views/References/Organizational/Department/_redux/getListSlice";
import employeeReducer from "../App/views/References/Organizational/Employee/_redux/getListSlice";
import orgSettleAccReducer from "../App/views/References/Organizational/OrganizationsSettlementAccount/_redux/getListSlice";
import currencyReducer from "../App/views/References/Global/Currency/_redux/getListSlice";
import currencyCourseReducer from "../App/views/References/Global/CurrencyCourse/_redux/getListSlice";
import itemOfExpenseReducer from "../App/views/References/Global/ItemOfExpense/_redux/getListSlice";
import FormaSetCommonReducer from "../App/views/References/Global/FormaSetCommon/_redux/getListSlice";
import IncomeUNCReducer from "../App/views/References/Global/IncomeUNC/_redux/getListSlice";
import OKEDReducer from "../App/views/References/Global/OKED/_redux/getListSlice";
import UserSettlementAccountReducer from "../App/views/References/Global/UserSettlementAccount/_redux/getListSlice";
import SpecificationReducer from "../App/views/References/Global/Specification/_redux/getListSlice";
import infoBankReducer from "../App/views/References/Global/InfoBank/_redux/getListSlice";
import funcItemReducer from "../App/views/References/Global/FunctionalItemOfExpense/_redux/getListSlice";
import treasOperDateReducer from "../App/views/References/Global/TreasOperDate/_redux/getListSlice";
import infoAccReducer from "../App/views/References/Global/InfoAcc/_redux/getListSlice";
import allowedTransactionReducer from "../App/views/References/Global/AllowedTransaction/_redux/getListSlice";
import OrganizationsDocSettAccountReducer from "../App/views/Admin/OrganizationsDocSettAccount/_redux/getListSlice";
import OrganizationsSettAccountReducer from "../App/views/Admin/OrganizationsDocSettAccount/_redux/getListSlice";
// References end

// Reports
import turnoverSheetGetListReducer from "../App/views/Reports/TurnoverSheet/_redux/getListSlice";
import inventoryHoldingCardGetListReducer from "../App/views/Reports/InventoryHoldingCard/_redux/getListSlice";
import inPaymentReducer from "../App/views/Documents/PaymentDocuments/InPayment/_redux/getListSlice";
// Reports end

export const rootReducer = combineReducers({
  navigation: navigationReducer,
  historyModal: historyModalReducer,
  //Admin
  userList: userListReducer,
  organizationList: organizationListReducer,
  rolesList: rolesListReducer,
  changeDocSatus: changeDocSatusReducer,
  orgHeaderInfoList: orgHeaderInfoListReducer,
  formaDKPositionList: formaDKPositionListReducer,
  //Admin end

  //Document
  paymentOrderList: paymentOrderReducer,
  paymentRegisterList: paymentRegisterReducer,
  treasuryMemOrderList: treasuryMemOrderReducer,
  paymentRequestList: paymentRequestReducer,
  inPaymentList: inPaymentReducer,
  onlinePaymentList: onlinePaymentReducer,
  sentPaymentOrderList: sentPaymentOrderReducer,
  //////
  IncomeCashOrderList: IncomeCashOrderReducer,
  CurrencyIncomeCashOrderList: CurrencyIncomeCashOrderReducer,
  CurrencyOutcomeCashOrderList: CurrencyOutcomeCashOrderReducer,
  OutcomeCashOrderList: OutcomeCashOrderReducer,
  /////
  PermanentAssetReappraisalList: PermanentAssetReappraisalReducer,
  PermanentAssetAgeingList: PermanentAssetAgeingReducer,
  PermanentAssetMovementFromStowegeList: PermanentAssetMovementFromStowegeReducer,
  PermanentAssetMovementList: PermanentAssetMovementReducer,
  PermanentAssetRetirementList: PermanentAssetRetirementReducer,

  ///
  studentContractList: studentContractReducer,
  requestForSettlementAccountList: RequestForSettlementAccountReducer,
  //Document end

  // References
  //organizational
  contractsList: contractsListReducer,
  contracts: contractsReducer,
  contractorsList: contractorsReducer,
  premanetAssetsList: premanetAssetReducer,
  subAccList: subAccReducer,
  InventoryHoldingList: InventoryHoldingReducer,

  ResponsiblePersonList: ResponsiblePersonReducer,
  ConstantValueList: ConstantValueReducer,
  childrenList: childrenReducer,
  departmentList: departmentReducer,
  employeeList: employeeReducer,
  orgSettleAccList: orgSettleAccReducer,
  //organizational end

  //global
  currencyList: currencyReducer,
  currencyCourseList: currencyCourseReducer,
  itemOfExpenseList: itemOfExpenseReducer,
  FormaSetCommonList: FormaSetCommonReducer,
  IncomeUNCList: IncomeUNCReducer,
  OKEDList: OKEDReducer,
  UserSettlementAccountList: UserSettlementAccountReducer,
  SpecificationList: SpecificationReducer,
  infoBankList: infoBankReducer,
  funcItemList: funcItemReducer,
  treasOperDateList: treasOperDateReducer,
  infoAccList: infoAccReducer,
  allowedTransactionList: allowedTransactionReducer,
  OrganizationsDocSettAccountList: OrganizationsDocSettAccountReducer,
  orgSettleAccListList: OrganizationsSettAccountReducer,
  // SettAccountList: OrganizationsDocSettAccountReducer,

  // References end

  // Reports
  turnoverSheetList: turnoverSheetGetListReducer,
  inventoryHoldingCardList: inventoryHoldingCardGetListReducer,
  inventoryHoldingIntakeList: InventoryHoldingIntakeReducer,
  inventoryHoldingIntakeUnpaidList: InventoryHoldingIntakeUnpaidReducer,
  foodstuffIntakeList: foodstuffIntakeReducer,
  // Reports end
});