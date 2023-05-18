import { all, call } from "redux-saga/effects";

//Admin
import { userListSagas } from "../App/views/Admin/User/_redux/userListSaga";
import { organizationListSagas } from "../App/views/Admin/Organization/_redux/organizationListSaga";
import { rolesListSagas } from "../App/views/Admin/Roles/_redux/rolesListSaga";
import { changeDocStatusSagas } from "../App/views/Admin/ChangeDocStatus/_redux/changeDocStatusSaga";
import { orgHeaderInfoListSagas } from "../App/views/Admin/OrganizationHeaderInfo/_redux/orgHeaderInfoListSaga";
import { FormaDKPositionCanEditSagas } from "../App/views/Admin/FormaDKPositionCanEdit/_redux/getListSaga";

//Document
import { paymentOrderSagas } from "../App/views/Documents/PaymentDocuments/PaymentOrder/_redux/getListSaga";
import { paymentRegisterSagas } from "../App/views/Documents/PaymentDocuments/PaymentRegister/_redux/getListSaga";
import { paymentRequestSagas } from "../App/views/Documents/PaymentDocuments/PaymentRequest/_redux/getListSaga";
import { InpaymentSagas } from "../App/views/Documents/PaymentDocuments/InPayment/_redux/getListSaga";
import { onlinePaymentSagas } from "../App/views/Documents/PaymentDocuments/OnlinePayment/_redux/getListSaga";
import { sentPaymentOrderSagas } from "../App/views/Documents/PaymentDocuments/SentPaymentOrder/_redux/getListSaga";

////
import { IncomeCashOrderSagas } from "../App/views/Documents/CashAccounting/IncomeCashOrder/_redux/IncomeCashOrderSaga";
import { CurrencyIncomeCashOrderSagas } from "../App/views/Documents/CashAccounting/CurrencyIncomeCashOrder/_redux/CurrencyIncomeCashOrderSaga";
import { CurrencyOutcomeCashOrderSagas } from "../App/views/Documents/CashAccounting/CurrencyOutcomeCashOrder/_redux/CurrencyOutcomeCashOrderSaga";
import { OutcomeCashOrderSagas } from "../App/views/Documents/CashAccounting/OutcomeCashOrder/_redux/OutcomeCashOrderSaga";
////
import { PermanentAssetReappraisalSagas } from "../App/views/Documents/AccountingofFixedAssets/PermanentAssetReappraisal/_redux/PermanentAssetReappraisalSaga";
import { PermanentAssetAgeingSagas } from "../App/views/Documents/AccountingofFixedAssets/PermanentAssetAgeing/_redux/PermanentAssetAgeingSaga";
import { PermanentAssetMovementFromStowegeSagas } from "../App/views/Documents/AccountingofFixedAssets/PermanentAssetMovementFromStowege/_redux/PermanentAssetMovementFromStowegeSaga";
import { PermanentAssetMovementSagas } from "../App/views/Documents/AccountingofFixedAssets/PermanentAssetMovement/_redux/PermanentAssetMovementSaga";
import { PermanentAssetRetirementSagas } from "../App/views/Documents/AccountingofFixedAssets/PermanentAssetRetirement/_redux/PermanentAssetRetirementSaga";


import { studentContractSagas } from "../App/views/Documents/Others/StudentContract/_redux/getListSaga";
import { treasuryMemOrderSagas } from "../App/views/Documents/PaymentDocuments/TreasuryMemOrder/_redux/getListSaga";

import { InventoryHoldingIntakeSagas } from "../App/views/Documents/InventoryHoldingReserve/InventoryHoldingIntake/_redux/InventoryHoldingIntakeSaga";
import { foodstuffIntakeSagas } from "../App/views/Documents/AccountingForFood/FoodstuffIntake/_redux/getListSaga";
import { RequestForSettlementAccountSagas } from "../App/views/Documents/ElectronicApplication/RequestForSettlementAccount/_redux/RequestForSettlementAccountSagas";
//Document End

// References
//organizational
import { ContractsSagas } from "../App/views/References/Organizational/Contracts/_redux/ContractsSaga";
import { ContractorsSagas } from "../App/views/References/Organizational/Contractors/_redux/ContractorsSaga";
import { PremanetAssetSagas } from "../App/views/References/Organizational/PermanentAsset/_redux/PermanentAssetSaga";
import { SubAccSagas } from "../App/views/References/Organizational/SubAcc/_redux/SubAccSaga";
import { InventoryHoldingSagas } from "../App/views/References/Organizational/InventoryHolding/_redux/InventoryHoldingSaga";
import { ResponsiblePersonSagas } from "../App/views/References/Organizational/ResponsiblePerson/_redux/ResponsiblePersonSaga";
import { ConstantValueSagas } from "../App/views/References/Organizational/ConstantValue/_redux/ConstantValueSaga";
import { ChildrenSagas } from "../App/views/References/Organizational/Children/_redux/getListSaga";
import { DepartmentSagas } from "../App/views/References/Organizational/Department/_redux/DepartmentSaga";
import { EmployeeSagas } from "../App/views/References/Organizational/Employee/_redux/EmployeeSaga";
import { OrgSettleAccSagas } from "../App/views/References/Organizational/OrganizationsSettlementAccount/_redux/OrgSettleAccSaga";
//organizational end

//global
import { CurrencySagas } from "../App/views/References/Global/Currency/_redux/CurrencySaga";
import { CurrencyCourseSagas } from "../App/views/References/Global/CurrencyCourse/_redux/CurrencyCourseSaga";
import { ItemOfExpenseSagas } from "../App/views/References/Global/ItemOfExpense/_redux/ItemOfExpenseSaga";
import { FormaSetCommonSagas } from "../App/views/References/Global/FormaSetCommon/_redux/FormaSetCommonSaga";
import { IncomeUNCSagas } from "../App/views/References/Global/IncomeUNC/_redux/IncomeUNCSaga";
import { OKEDSagas } from "../App/views/References/Global/OKED/_redux/OKEDSaga";
import { UserSettlementAccountSagas } from "../App/views/References/Global/UserSettlementAccount/_redux/UserSettlementAccountSaga";
import { SpecificationSagas } from "../App/views/References/Global/Specification/_redux/SpecificationSaga";
import { InfoBankSagas } from "../App/views/References/Global/InfoBank/_redux/InfoBankSaga";
import { FunctionalItemOfExpenseSagas } from "../App/views/References/Global/FunctionalItemOfExpense/_redux/FunctionalItemOfExpenseSaga";
import { TreasOperDates } from "../App/views/References/Global/TreasOperDate/_redux/TreasOperDateSaga";
import { InfoAccSagas } from "../App/views/References/Global/InfoAcc/_redux/InfoAccSaga";
import { AllowedTransactionSagas } from "../App/views/References/Global/AllowedTransaction/_redux/AllowedTransactionSaga";
import { OrganizationsDocSettAccountSagas } from "../App/views/Admin/OrganizationsDocSettAccount/_redux/OrganizationsDocSettAccountSaga";
// import { SetementListSagas } from "../App/views/References/Global/OrganizationsDocSettAccount/_redux/SettlementSaga";
// References end

// Reports
import { turnoverSheetSagas } from "../App/views/Reports/TurnoverSheet/_redux/turnoverSheetSagas";
import { inventoryHoldingCardSagas } from "../App/views/Reports/InventoryHoldingCard/_redux/inventoryHoldingCardSagas";
// Reports end

export default function* rootSaga() {
  yield all([
    call(userListSagas),
    call(organizationListSagas),
    call(rolesListSagas),
    call(changeDocStatusSagas),
    call(orgHeaderInfoListSagas),
    call(FormaDKPositionCanEditSagas),
    //Document
    call(paymentOrderSagas),
    call(paymentRegisterSagas),
    call(treasuryMemOrderSagas),
    call(paymentRequestSagas),
    call(InpaymentSagas),
    call(onlinePaymentSagas),
    call(sentPaymentOrderSagas),

    ///
    call(IncomeCashOrderSagas),
    call(CurrencyIncomeCashOrderSagas),
    call(CurrencyOutcomeCashOrderSagas),
    call(OutcomeCashOrderSagas),
    ////////////////////////////////

    call(PermanentAssetReappraisalSagas),
    call(PermanentAssetAgeingSagas),
    call(PermanentAssetMovementFromStowegeSagas),
    call(PermanentAssetMovementSagas),
    call(PermanentAssetRetirementSagas),

    call(studentContractSagas),
    call(RequestForSettlementAccountSagas),
    //Document end
    // References
    call(ContractsSagas),
    call(ContractorsSagas),
    call(PremanetAssetSagas),
    call(SubAccSagas),
    call(InventoryHoldingSagas),
    call(ResponsiblePersonSagas),
    call(ConstantValueSagas),
    call(ChildrenSagas),
    call(DepartmentSagas),
    call(EmployeeSagas),
    call(OrgSettleAccSagas),

    //global
    call(CurrencySagas),
    call(CurrencyCourseSagas),
    call(ItemOfExpenseSagas),
    call(FormaSetCommonSagas),
    call(IncomeUNCSagas),
    call(OKEDSagas),
    call(UserSettlementAccountSagas),
    call(SpecificationSagas),
    call(InfoBankSagas),
    call(FunctionalItemOfExpenseSagas),
    call(TreasOperDates),
    call(InfoAccSagas),
    call(AllowedTransactionSagas),
    call(OrganizationsDocSettAccountSagas),
    // call(SetementListSagas),
    // References end

    // Reports
    call(turnoverSheetSagas),
    call(inventoryHoldingCardSagas),
    call(InventoryHoldingIntakeSagas),
    call(foodstuffIntakeSagas),
    // Reports end
  ]);
}