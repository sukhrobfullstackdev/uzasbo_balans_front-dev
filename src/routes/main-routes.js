import React from 'react';

//Nav end

//dashboard const
// const Nvd3Chart = React.lazy(() => import('../Demo/Charts/Nvd3Chart/index'));
//dashboard const end

const MainPage = React.lazy(() => import('../App/views/MainPage/MainPage'))
//Adminstrator
const Organization = React.lazy(() => import('../App/views/Admin/Organization/Organizations'));
const UpdateOrganization = React.lazy(() => import('../App/views/Admin/Organization/UpdateOrganization.js'));

const FormaDKPositionCanEdit = React.lazy(() => import('../App/views/Admin/FormaDKPositionCanEdit/FormaDKPositionCanEdit'));
const UpdateFormaDKPositionCanEdit = React.lazy(() => import('../App/views/Admin/FormaDKPositionCanEdit/UpdateFormaDKPositionCanEdit'));

const UpdateOrgHeaderInfo = React.lazy(() => import('../App/views/Admin/OrganizationHeaderInfo/UpdateOrgHeaderInfo'));
const User = React.lazy(() => import('../App/views/Admin/User/Users'));
const UpdateUser = React.lazy(() => import('../App/views/Admin/User/UpdateUser.js'));
const Roles = React.lazy(() => import('../App/views/Admin/Roles/Roles'));
const ChangeDocumentStatus = React.lazy(() => import('../App/views/Admin/ChangeDocStatus/ChangeDocStatus'));
//Adminstrator end

//Documents
const PaymentOrder = React.lazy(() => import('../App/views/Documents/PaymentDocuments/PaymentOrder/PaymentOrder'));
const UpdatePaymentOrder = React.lazy(() => import('../App/views/Documents/PaymentDocuments/PaymentOrder/UpdatePaymentOrder'));

const PaymentRegister = React.lazy(() => import('../App/views/Documents/PaymentDocuments/PaymentRegister/PaymentRegister'));
const UpdatePaymentRegister = React.lazy(() => import('../App/views/Documents/PaymentDocuments/PaymentRegister/UpdatePaymentRegister'));

const TreasuryMemOrder = React.lazy(() => import('../App/views/Documents/PaymentDocuments/TreasuryMemOrder/TreasuryMemOrder'));
const UpdateTreasuryMemOrder = React.lazy(() => import('../App/views/Documents/PaymentDocuments/TreasuryMemOrder/UpdateTreasuryMemOrder'));

const PaymentRequest = React.lazy(() => import('../App/views/Documents/PaymentDocuments/PaymentRequest/PaymentRequest'));
const UpdatePaymentRequest = React.lazy(() => import('../App/views/Documents/PaymentDocuments/PaymentRequest/UpdatePaymentRequest'));

const InPayment = React.lazy(() => import('../App/views/Documents/PaymentDocuments/InPayment/Inpayment'));
const UpdateInPayment = React.lazy(() => import('../App/views/Documents/PaymentDocuments/InPayment/UpdateInPayment'));

const OnlinePayment = React.lazy(() => import('../App/views/Documents/PaymentDocuments/OnlinePayment/OnlinePayment'));

const SentPaymentOrder = React.lazy(() => import('../App/views/Documents/PaymentDocuments/SentPaymentOrder/SentPaymentOrder'));

const IncomeCashOrder = React.lazy(() => import('../App/views/Documents/CashAccounting/IncomeCashOrder/IncomeCashOrder'));
const UpdateIncomeCashOrder = React.lazy(() => import('../App/views/Documents/CashAccounting/IncomeCashOrder/UpdateIncomeCashOrder'));

const OutcomeCashOrder = React.lazy(() => import('../App/views/Documents/CashAccounting/OutcomeCashOrder/OutcomeCashOrder'));
const UpdateOutcomeCashOrder = React.lazy(() => import('../App/views/Documents/CashAccounting/OutcomeCashOrder/UpdateOutcomeCashOrder'));

const CurrencyIncomeCashOrder = React.lazy(() => import('../App/views/Documents/CashAccounting/CurrencyIncomeCashOrder/CurrencyIncomeCashOrder'));
const UpdateCurrencyIncomeCashOrder = React.lazy(() => import('../App/views/Documents/CashAccounting/CurrencyIncomeCashOrder/UpdateCurrencyIncomeCashOrder'));

const CurrencyOutcomeCashOrder = React.lazy(() => import('../App/views/Documents/CashAccounting/CurrencyOutcomeCashOrder/CurrencyOutcomeCashOrder'));
const UpdateCurrencyOutcomeCashOrder = React.lazy(() => import('../App/views/Documents/CashAccounting/CurrencyOutcomeCashOrder/UpdateCurrencyOutcomeCashOrder'));

const PermanentAssetReappraisal = React.lazy(() => import('../App/views/Documents/AccountingofFixedAssets/PermanentAssetReappraisal/PermanentAssetReappraisal'));
const UpdatePermanentAssetReappraisal = React.lazy(() => import('../App/views/Documents/AccountingofFixedAssets/PermanentAssetReappraisal/UpdatePermanentAssetReappraisal'));

const PermanentAssetAgeing = React.lazy(() => import('../App/views/Documents/AccountingofFixedAssets/PermanentAssetAgeing/PermanentAssetAgeing'));
const UpdatePermanentAssetAgeing = React.lazy(() => import('../App/views/Documents/AccountingofFixedAssets/PermanentAssetAgeing/UpdatePermanentAssetAgeing'));

const PermanentAssetMovementFromStowege = React.lazy(() => import('../App/views/Documents/AccountingofFixedAssets/PermanentAssetMovementFromStowege/PermanentAssetMovementFromStowege'));
const UpdatePermanentAssetMovementFromStowege = React.lazy(() => import('../App/views/Documents/AccountingofFixedAssets/PermanentAssetMovementFromStowege/UpdatePermanentAssetMovementFromStowege'));

const PermanentAssetMovement = React.lazy(() => import('../App/views/Documents/AccountingofFixedAssets/PermanentAssetMovement/PermanentAssetMovement'));
const UpdatePermanentAssetMovement = React.lazy(() => import('../App/views/Documents/AccountingofFixedAssets/PermanentAssetMovement/UpdatePermanentAssetMovement'));

const PermanentAssetRetirement = React.lazy(() => import('../App/views/Documents/AccountingofFixedAssets/PermanentAssetRetirement/PermanentAssetRetirement'));
const UpdatePermanentAssetRetirement = React.lazy(() => import('../App/views/Documents/AccountingofFixedAssets/PermanentAssetRetirement/UpdatePermanentAssetRetirement'));

const StudentContract = React.lazy(() => import('../App/views/Documents/Others/StudentContract/StudentContract'));
const UpdateStudentContract = React.lazy(() => import('../App/views/Documents/Others/StudentContract/UpdateStudentContract'));

const InventoryHoldingIntake = React.lazy(() => import('../App/views/Documents/InventoryHoldingReserve/InventoryHoldingIntake/InventoryHoldingIntake'));
const UpdateInventoryHoldingIntake = React.lazy(() => import('../App/views/Documents/InventoryHoldingReserve/InventoryHoldingIntake/UpdateInventoryHoldingIntake'));

const InventoryHoldingIntakeUnpaid = React.lazy(() => import('../App/views/Documents/InventoryHoldingReserve/InventoryHoldingIntakeUnpaid/InventoryHoldingIntakeUnpaid'));
const UpdateInventoryHoldingIntakeUnpaid = React.lazy(() => import('../App/views/Documents/InventoryHoldingReserve/InventoryHoldingIntakeUnpaid/UpdateInventoryHoldingIntakeUnpaid'));

const FoodstuffIntake = React.lazy(() => import('../App/views/Documents/AccountingForFood/FoodstuffIntake/FoodstuffIntake'));
const UpdateFoodstuffIntake = React.lazy(() => import('../App/views/Documents/AccountingForFood/FoodstuffIntake/UpdateFoodstuffIntake'));

const RequestForSettlementAccount = React.lazy(() => import('../App/views/Documents/ElectronicApplication/RequestForSettlementAccount/RequestForSettlementAccount'));
const UpdateRequestForSettlementAccount = React.lazy(() => import('../App/views/Documents/ElectronicApplication/RequestForSettlementAccount/UpdateRequestForSettlementAccount'));

//Documents End

// References
//organizational
const Contracts = React.lazy(() => import('../App/views/References/Organizational/Contracts/Contracts'));
const UpdateContract = React.lazy(() => import('../App/views/References/Organizational/Contracts/UpdateContract'));

const Contractors = React.lazy(() => import('../App/views/References/Organizational/Contractors/Contractors'));
const UpdateContractor = React.lazy(() => import('../App/views/References/Organizational/Contractors/UpdateContractor'));
const ContractorProfile = React.lazy(() => import('../App/views/References/Organizational/Contractors/CalcAccount'));

const PermanentAsset = React.lazy(() => import('../App/views/References/Organizational/PermanentAsset/PermanentAsset'));
const UpdatePermanentAsset = React.lazy(() => import('../App/views/References/Organizational/PermanentAsset/UpdatePermanentAsset'));

const Children = React.lazy(() => import('../App/views/References/Organizational/Children/Children'));
const UpdateChildren = React.lazy(() => import('../App/views/References/Organizational/Children/UpdateChildren'));
const OrganizationHeaderInfo = React.lazy(() => import('../App/views/Admin/OrganizationHeaderInfo/OrganizationHeaderInfo'));

const SubAcc = React.lazy(() => import('../App/views/References/Organizational/SubAcc/SubAcc'));
const UpdateSubAcc = React.lazy(() => import('../App/views/References/Organizational/SubAcc/UpdateSubAcc'));

const InventoryHolding = React.lazy(() => import('../App/views/References/Organizational/InventoryHolding/InventoryHolding'));
const UpdateInventoryHolding = React.lazy(() => import('../App/views/References/Organizational/InventoryHolding/UpdateInventoryHolding'));

const ResponsiblePerson = React.lazy(() => import('../App/views/References/Organizational/ResponsiblePerson/ResponsiblePerson'));
const UpdateResponsiblePerson = React.lazy(() => import('../App/views/References/Organizational/ResponsiblePerson/UpdateResponsiblePerson'));

const ConstantValue = React.lazy(() => import('../App/views/References/Organizational/ConstantValue/ConstantValue'));
const UpdateConstantValue = React.lazy(() => import('../App/views/References/Organizational/ConstantValue/UpdateConstantValue'));

const Department = React.lazy(() => import('../App/views/References/Organizational/Department/Department'));
const UpdateDepartment = React.lazy(() => import('../App/views/References/Organizational/Department/UpdateDepartment'));

const Employee = React.lazy(() => import('../App/views/References/Organizational/Employee/Employee'));
const UpdateEmployee = React.lazy(() => import('../App/views/References/Organizational/Employee/UpdateEmployee'));

const OrganizationsSettlementAccount = React.lazy(() => import('../App/views/References/Organizational/OrganizationsSettlementAccount/OrganizationsSettlementAccount'));
const UpdateOrganizationsSettlementAccount = React.lazy(() => import('../App/views/References/Organizational/OrganizationsSettlementAccount/UpdateOrganizationsSettlementAccount'));
//organizational end

//global
const Currency = React.lazy(() => import('../App/views/References/Global/Currency/Currency'));

const CurrencyCourse = React.lazy(() => import('../App/views/References/Global/CurrencyCourse/CurrencyCourse'));
const UpdateCurrencyCourse = React.lazy(() => import('../App/views/References/Global/CurrencyCourse/UpdateCurrencyCourse'));

const ItemOfExpense = React.lazy(() => import('../App/views/References/Global/ItemOfExpense/ItemOfExpense'));

const FormaSetCommon = React.lazy(() => import('../App/views/References/Global/FormaSetCommon/FormaSetCommon'));
const UpdateFormaSetCommon = React.lazy(() => import('../App/views/References/Global/FormaSetCommon/UpdateFormaSetCommon'));

const UserSettlementAccount = React.lazy(() => import('../App/views/References/Global/UserSettlementAccount/UserSettlementAccount'));
const UpdateUserSettlementAccount = React.lazy(() => import('../App/views/References/Global/UserSettlementAccount/UpdateUserSettlementAccount'));

const Specification = React.lazy(() => import('../App/views/References/Global/Specification/Specification'));
const UpdateSpecification = React.lazy(() => import('../App/views/References/Global/Specification/UpdateSpecification'));

const InfoBank = React.lazy(() => import('../App/views/References/Global/InfoBank/InfoBank'));
const UpdateInfoBank = React.lazy(() => import('../App/views/References/Global/InfoBank/UpdateInfoBank'));

const FunctionalItemOfExpense = React.lazy(() => import('../App/views/References/Global/FunctionalItemOfExpense/FunctionalItemOfExpense'));
const UpdateFunctionalItemOfExpense = React.lazy(() => import('../App/views/References/Global/FunctionalItemOfExpense/UpdateFunctionalItemOfExpense'));

const TreasOperDate = React.lazy(() => import('../App/views/References/Global/TreasOperDate/TreasOperDate'));
const UpdateTreasOperDate = React.lazy(() => import('../App/views/References/Global/TreasOperDate/UpdateTreasOperDate'));

const IncomeUNC = React.lazy(() => import('../App/views/References/Global/IncomeUNC/IncomeUNC'));
const UpdateIncomeUNC = React.lazy(() => import('../App/views/References/Global/IncomeUNC/UpdateIncomeUNC'));

const OKED = React.lazy(() => import('../App/views/References/Global/OKED/OKED'));
const UpdateOKED = React.lazy(() => import('../App/views/References/Global/OKED/UpdateOKED'));

const InfoAcc = React.lazy(() => import('../App/views/References/Global/InfoAcc/InfoAcc'));
const UpdateInfoAcc = React.lazy(() => import('../App/views/References/Global/InfoAcc/UpdateInfoAcc'));

const OrganizationsDocSettAccount = React.lazy(() => import('../App/views/Admin/OrganizationsDocSettAccount/OrganizationsDocSettAccount'));
const UpdateOrganizationsDocSettAccount = React.lazy(() => import('../App/views/Admin/OrganizationsDocSettAccount/UpdateOrganizationsDocSettAccount'));

const AllowedTransaction = React.lazy(() => import('../App/views/References/Global/AllowedTransaction/AllowedTransaction'));
const UpdateAllowedTransaction = React.lazy(() => import('../App/views/References/Global/AllowedTransaction/UpdateAllowedTransaction'));
//global end
// References end

// Reports
const TurnoverSheet = React.lazy(() => import('../App/views/Reports/TurnoverSheet/TurnoverSheet'));
const InventoryHoldingCard = React.lazy(() => import('../App/views/Reports/InventoryHoldingCard/InventoryHoldingCard'));
// Reports end

const routes = [
  //dashboard
  { path: '/dashboard/default', exact: true, name: 'Default', component: MainPage, role: 'Dashboard' },
  //Admins
  { path: '/Organization', exact: true, name: 'Organization', component: Organization, role: 'UserView' },
  { path: '/Organization/edit/:id', exact: true, name: 'EditOrganization', component: UpdateOrganization, role: 'UserView' },
  { path: '/Organization/add', exact: true, name: 'AddOrganization', component: UpdateOrganization, role: 'UserView' },

  { path: '/FormaDKPositionCanEdit', exact: true, name: 'FormaDKPositionCanEdit', component: FormaDKPositionCanEdit, role: 'UserView' },
  { path: '/FormaDKPositionCanEdit/add', exact: true, name: 'AddFormaDKPositionCanEdit', component: UpdateFormaDKPositionCanEdit, role: 'UserView' },
  { path: '/FormaDKPositionCanEdit/edit/:id', exact: true, name: 'EditFormaDKPositionCanEdit', component: UpdateFormaDKPositionCanEdit, role: 'UserView' },

  { path: '/Roles', exact: true, name: 'Roles', component: Roles, role: 'RoleView' },
  { path: '/ChangeDocumentStatus', exact: true, name: 'ChangeDocumentStatus', component: ChangeDocumentStatus, role: 'ChangeDocumentStatusView' },

  { path: '/ControlUsers', exact: true, name: 'User', component: User, role: 'UserView' },
  { path: '/ControlUsers/add', exact: true, name: 'AddUser', component: UpdateUser, role: 'UserInsert' },
  { path: '/ControlUsers/edit/:id', exact: true, name: 'EditUser', component: UpdateUser, role: 'UserEdit' },
  { path: '/OrganizationHeaderInfo', exact: true, name: 'OrganizationHeaderInfo', component: OrganizationHeaderInfo, role: 'OrganizationsDocSettAccountView' },
  { path: '/OrganizationHeaderInfo/add', exact: true, name: 'AddOrgHeaderInfo', component: UpdateOrgHeaderInfo, role: 'OrganizationHeaderInfoEdit' },
  // Admins end

  //Documents
  { path: '/PaymentOrder', exact: true, name: 'PaymentOrder', component: PaymentOrder, role: 'PaymentOrderView' },
  { path: '/PaymentOrder/add', exact: true, name: 'AddPaymentOrder', component: UpdatePaymentOrder, role: 'PaymentOrderInsert' },
  { path: '/PaymentOrder/edit/:id', exact: true, name: 'EditPaymentOrder', component: UpdatePaymentOrder, role: 'PaymentOrderEdit' },

  { path: '/PaymentRegister', exact: true, name: 'PaymentRegister', component: PaymentRegister, role: 'PaymentRegistryView' },
  { path: '/PaymentRegister/add', exact: true, name: 'AddPaymentRegister', component: UpdatePaymentRegister, role: 'PaymentRegistryInsert' },
  { path: '/PaymentRegister/edit/:id', exact: true, name: 'EditPaymentRegister', component: UpdatePaymentRegister, role: 'PaymentRegistryEdit' },
  
  { path: '/TreasuryMemOrder', exact: true, name: 'TreasuryMemOrder', component: TreasuryMemOrder, role: 'TreasuryMemOrderView' },
  { path: '/TreasuryMemOrder/add', exact: true, name: 'AddTreasuryMemOrder', component: UpdateTreasuryMemOrder, role: 'TreasuryMemOrderInsert' },
  { path: '/TreasuryMemOrder/edit/:id', exact: true, name: 'EditTreasuryMemOrder', component: UpdateTreasuryMemOrder, role: 'TreasuryMemOrderEdit' },

  { path: '/PaymentRequest', exact: true, name: 'PaymentRequest', component: PaymentRequest, role: 'PaymentRequestView' },
  { path: '/PaymentRequest/add', exact: true, name: 'AddPaymentRequest', component: UpdatePaymentRequest, role: 'PaymentRequestInsert' },
  { path: '/PaymentRequest/edit/:id', exact: true, name: 'EditPaymentRequest', component: UpdatePaymentRequest, role: 'PaymentRequestEdit' },

  { path: '/Inpayment', exact: true, name: 'Inpayment', component: InPayment, role: 'InpaymentView' },
  { path: '/Inpayment/add', exact: true, name: 'AddInpayment', component: UpdateInPayment, role: 'InpaymentInsert' },
  { path: '/Inpayment/edit/:id', exact: true, name: 'EditInpayment', component: UpdateInPayment, role: 'InpaymentEdit' },

  { path: '/OnlinePayment', exact: true, name: 'OnlinePayment', component: OnlinePayment, role: 'OnlinePaymentView' },

  { path: '/PaymentRegister/SentPaymentOrder', exact: true, name: 'SentPaymentOrder', component: SentPaymentOrder, role: 'PaymentRegistryView' },

  { path: '/IncomeCashOrder', exact: true, name: 'IncomeCashOrder', component: IncomeCashOrder, role: 'IncomeCashOrderView' },
  { path: '/IncomeCashOrder/add', exact: true, name: 'AddIncomeCashOrder', component: UpdateIncomeCashOrder, role: 'IncomeCashOrderInsert' },
  { path: '/IncomeCashOrder/edit/:id', exact: true, name: 'EditIncomeCashOrder', component: UpdateIncomeCashOrder, role: 'IncomeCashOrderEdit' },

  { path: '/OutcomeCashOrder', exact: true, name: 'OutcomeCashOrder', component: OutcomeCashOrder, role: 'OutcomeCashOrderView' },
  { path: '/OutcomeCashOrder/add', exact: true, name: 'AddOutcomeCashOrder', component: UpdateOutcomeCashOrder, role: 'OutcomeCashOrderInsert' },
  { path: '/OutcomeCashOrder/edit/:id', exact: true, name: 'EditOutcomeCashOrder', component: UpdateOutcomeCashOrder, role: 'OutcomeCashOrderEdit' },

  { path: '/CurrencyIncomeCashOrder', exact: true, name: 'CurrencyIncomeCashOrder', component: CurrencyIncomeCashOrder, role: 'CurrencyIncomeCashOrderView' },
  { path: '/CurrencyIncomeCashOrder/add', exact: true, name: 'AddCurrencyIncomeCashOrder', component: UpdateCurrencyIncomeCashOrder, role: 'CurrencyIncomeCashOrderInsert' },
  { path: '/CurrencyIncomeCashOrder/edit/:id', exact: true, name: 'EditCurrencyIncomeCashOrder', component: UpdateCurrencyIncomeCashOrder, role: 'CurrencyIncomeCashOrderEdit' },

  { path: '/CurrencyOutcomeCashOrder', exact: true, name: 'CurrencyOutcomeCashOrder', component: CurrencyOutcomeCashOrder, role: 'CurrencyOutcomeCashOrderView' },
  { path: '/CurrencyOutcomeCashOrder/add', exact: true, name: 'AddCurrencyOutcomeCashOrder', component: UpdateCurrencyOutcomeCashOrder, role: 'CurrencyOutcomeCashOrderInsert' },
  { path: '/CurrencyOutcomeCashOrder/edit/:id', exact: true, name: 'EditCurrencyOutcomeCashOrder', component: UpdateCurrencyOutcomeCashOrder, role: 'CurrencyOutcomeCashOrderEdit' },

  
  { path: '/PermanentAssetReappraisal', exact: true, name: 'PermanentAssetReappraisal', component: PermanentAssetReappraisal, role: 'PermanentAssetReappraisalView' },
  { path: '/PermanentAssetReappraisal/add', exact: true, name: 'AddPermanentAssetReappraisal', component: UpdatePermanentAssetReappraisal, role: 'PermanentAssetReappraisalInsert' },
  { path: '/PermanentAssetReappraisal/edit/:id', exact: true, name: 'EditPermanentAssetReappraisal', component: UpdatePermanentAssetReappraisal, role: 'PermanentAssetReappraisalEdit' },


  { path: '/PermanentAssetAgeing', exact: true, name: 'PermanentAssetAgeing', component: PermanentAssetAgeing, role: 'PermanentAssetAgeingView' },
  { path: '/PermanentAssetAgeing/add', exact: true, name: 'AddPermanentAssetAgeing', component: UpdatePermanentAssetAgeing, role: 'PermanentAssetAgeingInsert' },
  { path: '/PermanentAssetAgeing/edit/:id', exact: true, name: 'EditPermanentAssetAgeing', component: UpdatePermanentAssetAgeing, role: 'PermanentAssetAgeingEdit' },

  { path: '/PermanentAssetMovementFromStowege', exact: true, name: 'PermanentAssetMovementFromStowege', component: PermanentAssetMovementFromStowege, role: 'PermanentAssetMovementFromStowegeView' },
  { path: '/PermanentAssetMovementFromStowege/add', exact: true, name: 'AddPermanentAssetMovementFromStowege', component: UpdatePermanentAssetMovementFromStowege, role: 'PermanentAssetMovementFromStowegeInsert' },
  { path: '/PermanentAssetMovementFromStowege/edit/:id', exact: true, name: 'EditPermanentAssetMovementFromStowege', component: UpdatePermanentAssetMovementFromStowege, role: 'PermanentAssetMovementFromStowegeEdit' },

  { path: '/PermanentAssetMovement', exact: true, name: 'PermanentAssetMovement', component: PermanentAssetMovement, role: 'PermanentAssetMovementView' },
  { path: '/PermanentAssetMovement/add', exact: true, name: 'AddPermanentAssetMovement', component: UpdatePermanentAssetMovement, role: 'PermanentAssetMovementInsert' },
  { path: '/PermanentAssetMovement/edit/:id', exact: true, name: 'EditPermanentAssetMovement', component: UpdatePermanentAssetMovement, role: 'PermanentAssetMovementEdit' },

  { path: '/PermanentAssetRetirement', exact: true, name: 'PermanentAssetRetirement', component: PermanentAssetRetirement, role: 'PermanentAssetRetirementView' },
  { path: '/PermanentAssetRetirement/add', exact: true, name: 'AddPermanentAssetRetirement', component: UpdatePermanentAssetRetirement, role: 'PermanentAssetRetirementInsert' },
  { path: '/PermanentAssetRetirement/edit/:id', exact: true, name: 'EditPermanentAssetRetirement', component: UpdatePermanentAssetRetirement, role: 'PermanentAssetRetirementEdit' },

  { path: '/StudentContract', exact: true, name: 'StudentContract', component: StudentContract, role: 'StudentContractView' },
  { path: '/StudentContract/add', exact: true, name: 'AddStudentContract', component: UpdateStudentContract, role: 'StudentContractInsert' },
  { path: '/StudentContract/edit/:id', exact: true, name: 'EditStudentContract', component: UpdateStudentContract, role: 'StudentContractEdit' },

  { path: '/InventoryHoldingIntake', exact: true, name: 'InventoryHoldingIntake', component: InventoryHoldingIntake, role: 'InventoryHoldingIntakeView' },
  { path: '/InventoryHoldingIntake/add', exact: true, name: 'AddInventoryHoldingIntake', component: UpdateInventoryHoldingIntake, role: 'InventoryHoldingIntakeInsert' },
  { path: '/InventoryHoldingIntake/edit/:id', exact: true, name: 'EditInventoryHoldingIntake', component: UpdateInventoryHoldingIntake, role: 'InventoryHoldingIntakeEdit' },

  { path: '/InventoryHoldingIntakeUnpaid', exact: true, name: 'InventoryHoldingIntakeUnpaid', component: InventoryHoldingIntakeUnpaid, role: 'InventoryHoldingIntakeUnpaidView' },
  { path: '/InventoryHoldingIntakeUnpaid/add', exact: true, name: 'AddInventoryHoldingIntakeUnpaid', component: UpdateInventoryHoldingIntakeUnpaid, role: 'InventoryHoldingIntakeUnpaidInsert' },
  { path: '/InventoryHoldingIntakeUnpaid/edit/:id', exact: true, name: 'EditInventoryHoldingIntakeUnpaid', component: UpdateInventoryHoldingIntakeUnpaid, role: 'InventoryHoldingIntakeUnpaidEdit' },
  
  { path: '/FoodstuffIntake', exact: true, name: 'FoodstuffIntake', component: FoodstuffIntake, role: 'FoodstuffIntakeView' },
  { path: '/FoodstuffIntake/add', exact: true, name: 'AddFoodstuffIntake', component: UpdateFoodstuffIntake, role: 'FoodstuffIntakeInsert' },
  { path: '/FoodstuffIntake/edit/:id', exact: true, name: 'EditFoodstuffIntakee', component: UpdateFoodstuffIntake, role: 'FoodstuffIntakeEdit' },

  { path: '/RequestForSettlementAccount', exact: true, name: 'RequestForSettlementAccount', component: RequestForSettlementAccount, role: 'RequestForSettlementAccountView' },
  { path: '/RequestForSettlementAccount/add', exact: true, name: 'AddRequestForSettlementAccount', component: UpdateRequestForSettlementAccount, role: 'RequestForSettlementAccountInsert' },
  { path: '/RequestForSettlementAccount/edit/:id', exact: true, name: 'EditRequestForSettlementAccount', component: UpdateRequestForSettlementAccount, role: 'RequestForSettlementAccountEdit' },
  //Documents end

  // References
  //organizational path
  { path: '/contracts', exact: true, name: 'Contracts', component: Contracts, role: 'ContractView' },
  { path: '/contracts/add', exact: true, name: 'AddContract', component: UpdateContract, role: 'ContractView' },
  { path: '/contracts/edit/:id', exact: true, name: 'EditContract', component: UpdateContract, role: 'ContractView' },

  { path: '/Contractors', exact: true, name: 'Contractors', component: Contractors, role: 'ContractorView' },
  { path: '/Contractors/add', exact: true, name: 'AddContractor', component: UpdateContractor, role: 'ContractorInsert' },
  { path: '/Contractors/edit/:id', exact: true, name: 'EditContractor', component: UpdateContractor, role: 'ContractorEdit' },
  { path: '/Contractors/Profile/:id', exact: true, name: 'ContractorProfile', component: ContractorProfile, role: 'ContractorView' },

  { path: '/PermanentAsset', exact: true, name: 'PermanentAsset', component: PermanentAsset, role: 'PermanentAssetView' },
  { path: '/PermanentAsset/add', exact: true, name: 'AddPermanentAsset', component: UpdatePermanentAsset, role: 'PermanentAssetInsert' },
  { path: '/PermanentAsset/edit/:id', exact: true, name: 'EditPermanentAsset', component: UpdatePermanentAsset, role: 'PermanentAssetEdit' },

  { path: '/Children', exact: true, name: 'Children', component: Children, role: 'ChildrenView' },
  { path: '/Children/add', exact: true, name: 'AddChildren', component: UpdateChildren, role: 'ChildrenInsert' },
  { path: '/Children/edit/:id', exact: true, name: 'EditChildren', component: UpdateChildren, role: 'ChildrenEdit' },

  { path: '/SubAcc', exact: true, name: 'SubAcc', component: SubAcc, role: 'SubAccView' },
  { path: '/SubAcc/add', exact: true, name: 'AddSubAcc', component: UpdateSubAcc, role: 'SubAccInsert' },
  { path: '/SubAcc/edit/:id', exact: true, name: 'EditSubAcc', component: UpdateSubAcc, role: 'SubAccEdit' },

  { path: '/InventoryHolding', exact: true, name: 'InventoryHolding', component: InventoryHolding, role: 'InventoryHoldingView' },
  { path: '/InventoryHolding/add', exact: true, name: 'AddInventoryHolding', component: UpdateInventoryHolding, role: 'InventoryHoldingInsert' },
  { path: '/InventoryHolding/edit/:id', exact: true, name: 'EditInventoryHolding', component: UpdateInventoryHolding, role: 'InventoryHoldingEdit' },

  { path: '/ResponsiblePerson', exact: true, name: 'ResponsiblePerson', component: ResponsiblePerson, role: 'ResponsiblePersonView' },
  { path: '/ResponsiblePerson/add', exact: true, name: 'AddResponsiblePerson', component: UpdateResponsiblePerson, role: 'InventoryHoldingInsert' },
  { path: '/ResponsiblePerson/edit/:id', exact: true, name: 'EditResponsiblePerson', component: UpdateResponsiblePerson, role: 'InventoryHoldingEdit' },

  { path: '/ConstantValue', exact: true, name: 'ConstantValue', component: ConstantValue, role: 'ConstantValueView' },
  { path: '/ConstantValue/add', exact: true, name: 'AddConstantValue', component: UpdateConstantValue, role: 'ConstantValueInsert' },
  { path: '/ConstantValue/edit/:id', exact: true, name: 'EditConstantValue', component: UpdateConstantValue, role: 'ConstantValueEdit' },

  { path: '/Department', exact: true, name: 'Department', component: Department, role: 'DepartmentView' },
  { path: '/Department/add', exact: true, name: 'AddDepartment', component: UpdateDepartment, role: 'DepartmentInsert' },
  { path: '/Department/edit/:id', exact: true, name: 'EditDepartment', component: UpdateDepartment, role: 'DepartmentEdit' },

  { path: '/Employee', exact: true, name: 'Employee', component: Employee, role: 'EmployeeView' },
  { path: '/Employee/add', exact: true, name: 'AddEmployee', component: UpdateEmployee, role: 'EmployeeInsert' },
  { path: '/Employee/edit/:id', exact: true, name: 'EditEmployee', component: UpdateEmployee, role: 'EmployeeEdit' },

  { path: '/OrganizationsSettlementAccount', exact: true, name: 'OrganizationsSettlementAccount', component: OrganizationsSettlementAccount, role: 'OrganizationsSettlementAccountView' },
  { path: '/OrganizationsSettlementAccount/add', exact: true, name: 'AddOrganizationsSettlementAccount', component: UpdateOrganizationsSettlementAccount, role: 'OrganizationsSettlementAccountView' },
  { path: '/OrganizationsSettlementAccount/edit/:id', exact: true, name: 'EditOrganizationsSettlementAccount', component: UpdateOrganizationsSettlementAccount, role: 'OrganizationsSettlementAccountView' },
  //organizational path end

  //global path
  { path: '/Currency', exact: true, name: 'Currency', component: Currency, role: 'CurrencyCourseView' },

  { path: '/CurrencyCourse', exact: true, name: 'CurrencyCourse', component: CurrencyCourse, role: 'CurrencyCourseView' },
  { path: '/CurrencyCourse/add', exact: true, name: 'AddCurrencyCourse', component: UpdateCurrencyCourse, role: 'CurrencyCourseEdit' },
  { path: '/CurrencyCourse/edit/:id', exact: true, name: 'EditCurrencyCourse', component: UpdateCurrencyCourse, role: 'CurrencyCourseInsert' },

  { path: '/FormaSetCommon', exact: true, name: 'FormaSetCommon', component: FormaSetCommon, role: 'FormaSetCommonView' },
  { path: '/FormaSetCommon/add', exact: true, name: 'AddFormaSetCommon', component: UpdateFormaSetCommon, role: 'FormaSetCommonView' },
  { path: '/FormaSetCommon/edit/:id', exact: true, name: 'EditFormaSetCommon', component: UpdateFormaSetCommon, role: 'FormaSetCommonView' },

  { path: '/UserSettlementAccount', exact: true, name: 'UserSettlementAccount', component: UserSettlementAccount, role: 'FormaSetCommonView' },
  { path: '/UserSettlementAccount/add', exact: true, name: 'AddUserSettlementAccount', component: UpdateUserSettlementAccount, role: 'FormaSetCommonView' },
  { path: '/UserSettlementAccount/edit/:id', exact: true, name: 'EditUserSettlementAccount', component: UpdateUserSettlementAccount, role: 'FormaSetCommonView' },

  { path: '/Specification', exact: true, name: 'Specification', component: Specification, role: 'FormaSetCommonView' },
  { path: '/Specification/add', exact: true, name: 'AddSpecification', component: UpdateSpecification, role: 'FormaSetCommonView' },
  { path: '/Specification/edit/:id', exact: true, name: 'EditSpecification', component: UpdateSpecification, role: 'FormaSetCommonView' },

  { path: '/ItemOfExpense', exact: true, name: 'ItemOfExpense', component: ItemOfExpense, role: 'ItemOfExpenseView' },

  { path: '/InfoBank', exact: true, name: 'InfoBank', component: InfoBank, role: 'BankView' },
  { path: '/InfoBank/add', exact: true, name: 'AddInfoBank', component: UpdateInfoBank, role: 'BankInsert' },
  { path: '/InfoBank/edit/:id', exact: true, name: 'EditInfoBank', component: UpdateInfoBank, role: 'BankEdit' },

  { path: '/FunctionalItemOfExpense', exact: true, name: 'FunctionalItemOfExpense', component: FunctionalItemOfExpense, role: 'FunctionalItemOfExpenseView' },
  { path: '/FunctionalItemOfExpense/add', exact: true, name: 'AddFunctionalItemOfExpense', component: UpdateFunctionalItemOfExpense, role: 'FunctionalItemOfExpenseView' },
  { path: '/FunctionalItemOfExpense/edit/:id', exact: true, name: 'EditFunctionalItemOfExpense', component: UpdateFunctionalItemOfExpense, role: 'FunctionalItemOfExpenseView' },


  { path: '/TreasOperDate', exact: true, name: 'TreasOperDate', component: TreasOperDate, role: 'TreasuryMemOrderView' },
  { path: '/TreasOperDate/add', exact: true, name: 'AddTreasOperDate', component: UpdateTreasOperDate, role: 'TreasuryMemOrderInsert' },
  { path: '/TreasOperDate/edit/:id', exact: true, name: 'EditTreasOperDate', component: UpdateTreasOperDate, role: 'TreasuryMemOrderEdit' },

  { path: '/IncomeUNC', exact: true, name: 'IncomeUNC', component: IncomeUNC, role: 'TreasuryMemOrderView' },
  { path: '/IncomeUNC/add', exact: true, name: 'AddIncomeUNC', component: UpdateIncomeUNC, role: 'TreasuryMemOrderInsert' },
  { path: '/IncomeUNC/edit/:id', exact: true, name: 'EditIncomeUNC', component: UpdateIncomeUNC, role: 'TreasuryMemOrderEdit' },

  { path: '/OKED', exact: true, name: 'OKED', component: OKED, role: 'CurrencyCourseView' },
  { path: '/OKED/add', exact: true, name: 'AddOKED', component: UpdateOKED, role: 'CurrencyCourseInsert' },
  { path: '/OKED/edit/:id', exact: true, name: 'EditOKED', component: UpdateOKED, role: 'CurrencyCourseEdit' },

  { path: '/InfoAcc', exact: true, name: 'InfoAcc', component: InfoAcc, role: 'AccView' },
  { path: '/InfoAcc/add', exact: true, name: 'AddInfoAcc', component: UpdateInfoAcc, role: 'AccView' },
  { path: '/InfoAcc/edit/:id', exact: true, name: 'EditInfoAcc', component: UpdateInfoAcc, role: 'AccView' },

  { path: '/OrganizationsDocSettAccount', exact: true, name: 'OrganizationsDocSettAccount', component: OrganizationsDocSettAccount, role: 'AccView' },
  { path: '/OrganizationsDocSettAccount/add', exact: true, name: 'AddOrganizationsDocSettAccount', component: UpdateOrganizationsDocSettAccount, role: 'AccView' },
  { path: '/OrganizationsDocSettAccount/edit/:id', exact: true, name: 'EditOrganizationsDocSettAccount', component: UpdateOrganizationsDocSettAccount, role: 'AccView' },
  // { path: '/InfoAcc/edit/:id', exact: true, name: 'EditInfoAcc', component: UpdateInfoAcc, role: 'AccView' },

  { path: '/AllowedTransaction', exact: true, name: 'AllowedTransaction', component: AllowedTransaction, role: 'AllowedTransactionView' },
  { path: '/AllowedTransaction/add', exact: true, name: 'AddAllowedTransaction', component: UpdateAllowedTransaction, role: 'AllowedTransactionInsert' },
  { path: '/AllowedTransaction/edit/:id', exact: true, name: 'EditAllowedTransaction', component: UpdateAllowedTransaction, role: 'AllowedTransactionEdit' },
  //global path end
  // References end

  // Reports
  { path: '/TurnoverSheet', exact: true, name: 'TurnoverSheet', component: TurnoverSheet, role: 'ReportModuleView' },
  { path: '/InventoryHoldingCard', exact: true, name: 'InventoryHoldingCard', component: InventoryHoldingCard, role: 'ReportModuleView' },
  // Reports end
]


export default routes;

