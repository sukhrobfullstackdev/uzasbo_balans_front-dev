import ApiServices from '../api.services';

const baseUrl = 'Helper/';

const mapUrl = 'OrganizationInfo/'
const baseEmpluyeeUrl = "http://192.168.254.53/inps/api/"
// const subUrl = 'SubDepartment/  '

const HelperServices = {
  getEmployeeTypeList() {
    return ApiServices.get(`${baseUrl}GetEmployeeTypeList`);
  },

  getGenderList() {
    return ApiServices.get(`${baseUrl}GetGenderList`);
  },

  getRegionList() {
    return ApiServices.get(`${baseUrl}GetOblastList`);
  },

  getDistrictList(id) {
    return ApiServices.get(`${baseUrl}GetRegionList?OblastID=${id}`);
  },

  getBankList(pageNumber = '', pageLimit = '', sortColumn, orderType, search = '') {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }
    return ApiServices.get(`${baseUrl}GetBankCodeList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&Search=${search}`);
  },

  // getWorkingEmployeesNoParameterList(pageNumber, pageLimit, sortColumn, orderType, filter, parentId) {
  //   if (orderType === "ascend") {
  //     orderType = "asc";
  //   } else if (orderType === "descend") {
  //     orderType = "desc";
  //   }

  //   if (parentId === 63) {
  //     return ApiServices.get(
  //       `${baseEmpluyeeUrl}GetList?`
  //     );
  //   }

  //   return ApiServices.get(`${baseUrl}GetWorkingEmployeesNoParameterList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&FullName=${filter.FullName ? filter.FullName : ''}&PersonnelNumber=${filter.PersonnelNumber ? filter.PersonnelNumber : ''}`);
  // },

  getStateList() {
    return ApiServices.get(`${baseUrl}GetStateList`);
  },
  getOblastList() {
    return ApiServices.get(`${baseUrl}GetOblastList?lang=&CountryID=0`)
  },
  getStatusList() {
    return ApiServices.get(`${baseUrl}GetStatusList`)
  },
  // GetDivisionList
  GetDivisionList() {
    return ApiServices.get(`${baseUrl}GetDivisionList`)
  },
  GetPayrollList() {
    return ApiServices.get(`${baseUrl}GetPayrollSubCalculationList`)
  },
  getListOfPositionCategoryList() {
    return ApiServices.get(`${baseUrl}GetListOfPositionCategoryList`)
  },
  getPayrollSubAccList() {
    return ApiServices.get(`${baseUrl}GetPayrollSubAccList`)
  },
  getExperienceContWorkList() {
    return ApiServices.get(`${baseUrl}GetExperienceContWorkList`)
  },
  getListOfPositionList() {
    return ApiServices.get(`${baseUrl}GetListOfPositionList`)
  },

  getItemOfExpensesList(parentId) {
    return ApiServices.get(`${baseUrl}GetItemOfExpensesList?${parentId ? 'ParentID=' + parentId : ''}`)
  },
  GetItemOfExpensesList(parentId) {
    return ApiServices.get(`${baseUrl}GetItemOfExpensesList?ParentID=0`)
  },
  getAllSubCalculationKindList() {
    return ApiServices.get(`${baseUrl}GetAllSubCalculationKindList`)
  },
  GetTaxItemList() {
    return ApiServices.get(`${baseUrl}GetTaxItemList`)
  },
  getDepartmentList(divisionId) {
    return ApiServices.get(`${baseUrl}GetDepartmentList?DivisionID=${divisionId}`)
  },

  getFakultitetList(divisionId) {
    return ApiServices.get(`${baseUrl}GetDepartmentForScholarship?TypeID=1&DivisionID=${divisionId}`)
  },
  getGroupList(divisionId) {
    return ApiServices.get(`${baseUrl}GetDepartmentForScholarship?TypeID=2&DivisionID=${divisionId}`)
  },
  getDirectionList(divisionId) {
    return ApiServices.get(`${baseUrl}GetDepartmentForScholarship?TypeID=3&DivisionID=${divisionId}`)
  },
  getAllDepartmentList() {
    return ApiServices.get(`${baseUrl}GetAllDepartmentList?`)
  },

  //SalaryTransation AddModal
  getOrganizationsSettlementAccountList() {
    return ApiServices.get(`${baseUrl}GetOrganizationsSettlementAccountList`)
  },
  getStaffListType() {
    return ApiServices.get(`${baseUrl}GetStaffListTypeList`)
  },
  getAllowedTransactionList(payload) {
    return ApiServices.get(`${baseUrl}GetAllowedTransactionList`, { params: payload })
  },
  getAllowedTransactionInPaymentList(payload) {
    return ApiServices.get(`${baseUrl}GetAllowedTransactionInPaymentList`, { params: payload })
  },
  getAllowedTransactionForPaymentRequestList(id) {
    return ApiServices.get(`${baseUrl}GetAllowedTransactionForPaymentRequestList?ID=${id}`)
  },
  GetSubAccDbCrList(AccDbID) {
    return ApiServices.get(`${baseUrl}GetSubAccDbCrList?Accid=${AccDbID}`)
  },
  getSubAccDbCrList(AccCrID) {
    return ApiServices.get(`${baseUrl}GetSubAccDbCrList?Accid=${AccCrID}`)
  },
  getTMZSubAccDBList(id) {
    return ApiServices.get(`${baseUrl}GetTMZSubAccDBList?AllowedTransactionID=${id}`)
  },
  GetSubAcc60List() {
    return ApiServices.get(`${baseUrl}GetSubAccList?Accid=${60}`)
  },

  getSubAccList(id) {
    return ApiServices.get(`${baseUrl}GetSubAccList?Accid=${id}`)
  },

  getAllSubCount(ID) {
    return ApiServices.get(`${baseUrl}GetAllSubCount?AccID=${ID}`);
  },

  getClassLanguageList(id) {
    return ApiServices.get(`${baseUrl}GetClassLanguageList`)
  },
  getTaxesAndChargesAll(id) {
    return ApiServices.get(`${baseUrl}GetTaxesAndChargesAll?SubAccDbIDt=${id}`)
  },



  getAllSubDepartementList() {
    return ApiServices.get(`${baseUrl}GetAllSubDepartementList`)
  },
  GetTimeSheetTypeList() {
    return ApiServices.get(`${baseUrl}GetTimeSheetTypeList`)
  },

  getClassNumberList() {
    return ApiServices.get(`${baseUrl}GetClassNumberList`)
  },
  // getSubAcc60List() {
  //   return ApiServices.get(`${baseUrl}GetSubAccList?AccID=60`)
  // },

  // getStatusList(id) {
  //   return ApiServices.get(`${baseUrl}GetStatusList`)
  // },
  getENKTList(payload) {
    return ApiServices.get(`${baseUrl}GetENKTList`, { params: payload })
  },

  GetListOfPositionList(payload) {
    return ApiServices.get(`${baseUrl}GetENKTList`, { params: payload })
  },

  getRequestReceivingCashList(payload) {
    return ApiServices.get(`${baseUrl}GetRequestReceivingCashList`, { params: payload })
  },

  GetEnrolmentTypeList() {
    return ApiServices.get(`${baseUrl}GetEnrolmentTypeList`)
  },

  GetWorkScheduleList() {
    return ApiServices.get(`${baseUrl}GetWorkScheduleList`)
  },

  GetRoundingTypeList() {
    return ApiServices.get(`${baseUrl}GetRoundingTypeList?forenrolment=true`)
  },

  getRoundingTypeList(forenrolment = false) {
    return ApiServices.get(`${baseUrl}GetRoundingTypeList?forenrolment=${forenrolment}`)
  },

  getRoundingTypeListForEnrolment() {
    return ApiServices.get(`${baseUrl}GetRoundingTypeList?forenrolment=true`)
  },

  GetMinimalSalary(date) {
    return ApiServices.get(`${baseUrl}GetMinimalSalary?OnDate=${date}`)
  },

  GetTariffScaleTableList(TariffScaleID) {
    return ApiServices.get(`${baseUrl}GetTariffScaleTableList?TariffScaleID=${TariffScaleID}`);
  },

  GetAllSubCalculationKindList(pageNumber, pageLimit, sortColumn, orderType, filter) {
    return ApiServices.get(`${baseUrl}GetAllSubCalculationKindList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&Name=${filter.Name ? filter.Name : ""}&ID=${filter.ID ? filter.ID : ""}`);
  },

  // GetWorkingEmployeesNoParameterList(pageNumber, pageLimit, sortColumn, orderType, divisionId = '', departmentId = '', filterType, filterValue) {
  //   if (orderType === "ascend") {
  //     orderType = "asc";
  //   } else if (orderType === "descend") {
  //     orderType = "desc";
  //   }

  //   return ApiServices.get(`${baseUrl}GetWorkingEmployeesNoParameterList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&DivisionID=${divisionId}&DepartmentID=${departmentId}${filterType ? '&' + filterType + '=' + filterValue : ''}`);
  // },

  getReqRecCashTypeList() {
    return ApiServices.get(`${baseUrl}GetReqRecCashTypeList`);
  },

  getOrgSignList(signNumber) {
    return ApiServices.get(`${baseUrl}GetOrgSignList?SignNumber=${signNumber}`);
  },

  getDismissalReason() {
    return ApiServices.get(`${baseUrl}GetReasonOfDismissalList`);
  },

  getLeaveCalcType() {
    return ApiServices.get(`${baseUrl}GetLeaveCalcType`);
  },

  GetStaffListFileLog(id, tableId = '279') {
    return ApiServices.get(`${baseUrl}GetStaffListFileLog?id=${id}&TableID=${tableId}`);
  },

  GetFileLog(id, tableId = 231) {
    return ApiServices.get(`${baseUrl}GetFileLog?id=${id}&TableID=${tableId}`);
  },

  getStaffListGroupList() {
    return ApiServices.get(`${baseUrl}GetStaffListGroupList`);
  },

  getBLHGTypeList() {
    return ApiServices.get(`${baseUrl}GetBLHGTypeList`);
  },

  getAttachedClassTitleTableData(id) {
    return ApiServices.get(`${baseUrl}GetAttachedClassTitleTableData?AttachedClassTitleTableID=${id}`)
  },

  getSpecializedSubjectsList() {
    return ApiServices.get(`${baseUrl}GetSpecializedSubjectsList`)
  },

  GetPositionQualificationList() {
    return ApiServices.get(`${baseUrl}GetPositionQualificationList?ForBillingList=false`)
  },

  GetPositionPeriodicityList() {
    return ApiServices.get(`${baseUrl}GetPositionPeriodicityList`)
  },

  GetPositionSalaryTypeList() {
    return ApiServices.get(`${baseUrl}GetPositionSalaryTypeList`)
  },

  GetFileLogForPayrollOfPlasticCardSheet(id) {
    return ApiServices.get(`${baseUrl}GetFileLogForPayrollOfPlasticCardSheet?DocumentID=${id}`)
  },

  PhoneNumberCleaner(id) {
    return ApiServices.post(`${baseUrl}PhoneNumberCleaner?EmployeeID=${id}`)
  },

  //Organization 
  getCheckINNOrganization(data) {
    return ApiServices.get(`${baseUrl}CheckINNOrganization?INN=${data}`)
  },

  getChapterList() {
    return ApiServices.get(`${baseUrl}GetChapterList`);
  },
  GetOKEDList() {
    return ApiServices.get(`${baseUrl}GetOKEDList`);
  },
  getOrganizationTypeList() {
    return ApiServices.get(`${baseUrl}GetOrganizationTypeList`);
  },
  getTreasuryBranchList() {
    return ApiServices.get(`${baseUrl}GetFunctionalItemList`);
  },
  getTreasuryBranchListSetelment() {
    return ApiServices.get(`${baseUrl}GetTreasuryBranchList`);
  },
  GetBankList() {
    return ApiServices.get(`${baseUrl}GetBankList`);
  },
  getOrganizationFunctionalItemList(id) {
    return ApiServices.get(`${baseUrl}GetOrganizationFunctionalItemList?OrganizationID=30279`);
  },
  GetTableDataHistory(params) {
    return ApiServices.get(`${baseUrl}GetTableDataHistory`, { params: params });
  },
  getHeaderOrganizationList() {
    return ApiServices.get(`${baseUrl}GetHeaderOrganizationList`);
  },
  getTableDataHistory() {
    return ApiServices.get(`${baseUrl}GetTableDataHistory`);
  },
  getSettlementAccountListForOrganization(id) {
    return ApiServices.get(`${baseUrl}GetSettlementAccountListForOrganization?OrganizationID=${id}`);
  },
  getTableList() {
    return ApiServices.get(`${baseUrl}GetTableList`);
  },
  getCurrencyList() {
    return ApiServices.get(`${baseUrl}GetCurrencyList`);
  },
  getOrgSettAccList() {
    return ApiServices.get(`${baseUrl}GetSettlementAccountList`);
  },
  getUnitsOfMeasureList() {
    return ApiServices.get(`${baseUrl}GetUnitsOfMeasureList`);
  },
  getPAGroupList(id) {
    return ApiServices.get(`${baseUrl}GetPAGroupList?AccID=${id}`);
  },
  getPASubGroupList(id) {
    return ApiServices.get(`${baseUrl}GetPASubGroupList?SubAccID=${id}`);
  },
  getSubAcc(id) {
    return ApiServices.get(`${baseUrl}GetSubAcc?Accid=${id}`)
  },
  getContractTypeInfoList() {
    return ApiServices.get(`${baseUrl}GetContractTypeInfoList`);
  },

  getItemOfExpenseSubCountList(payload) {
    return ApiServices.get(`${baseUrl}GetItemOfExpenseSubCountList`, {
      params: payload
    });
  },
  getOrganizationsFunctionalItem(payload) {
    return ApiServices.get(`${baseUrl}GetOrganizationsFunctionalItem`, {
      params: payload
    });
  },
  getMoneyMeansMovementList() {
    return ApiServices.get(`${baseUrl}GetMoneyMeansMovementList`, {
      // params: payload
    });
  },
  getMoneyMeansMovementList3() {
    return ApiServices.get(`${baseUrl}GetMoneyMeansMovementList3`, {
      // params: payload
    });
  },
  getTreasuryMemOrderTypeList() {
    return ApiServices.get(`${baseUrl}GetTreasuryMemOrderTypeList`, {
      // params: payload
    });
  },
  getLastCurrencyCourse(payload) {
    return ApiServices.get(`${baseUrl}GetLastCurrencyCourse`, {
      params: payload
    });
  },
  getAccList(id) {
    return ApiServices.get(`${baseUrl}GetAccList?Accid=${id}`)
  },
  getInventoryHoldingTypeList(id) {
    return ApiServices.get(`${baseUrl}GetInventoryHoldingTypeList`)
  },
  getContractorAccountList(id) {
    return ApiServices.get(`${baseUrl}GetContractorAccountList?ContractorPayeeID=${id}`)
  },
  getContractList(id) {
    return ApiServices.get(`${baseUrl}GetContractList?ContractorPayeeID=${id}`)
  },
  getDocumentTypeList() {
    return ApiServices.get(`${baseUrl}GetDocumentTypeList`)
  },
  childrenGroupTypeList() {
    return ApiServices.get(`${baseUrl}ChildrenGroupTypeList`)
  },
  workSheduleKindList() {
    return ApiServices.get(`${baseUrl}WorkSheduleKindList`)
  },
  childHoursTypeList(id) {
    return ApiServices.get(`${baseUrl}ChildHoursTypeList?ChildrenGroupTypeID=${id}`)
  },
  getItemOfExpenseList() {
    return ApiServices.get(`${baseUrl}GetItemOfExpenseList`)
  },
  getSubCashList() {
    return ApiServices.get(`${baseUrl}GetSubCashList`)
  },
  getEmployeeList() {
    return ApiServices.get(`${baseUrl}GetEmployeeList`)
  },
  getConstantTypeList() {
    return ApiServices.get(`${baseUrl}GetConstantTypeList`)
  },
  getSubActualList() {
    return ApiServices.get(`${baseUrl}GetSubActualList`)
  },
  getBankParentCodeList() {
    return ApiServices.get(`${baseUrl}GetBankParentCodeList`)
  },
  getAccTypeList() {
    return ApiServices.get(`${baseUrl}GetAccTypeList`)
  },
  getAccSystemTypeList() {
    return ApiServices.get(`${baseUrl}GetAccSystemTypeList`)
  },
  getSubCountList() {
    return ApiServices.get(`${baseUrl}GetSubCountList`)
  },
  getMoneyMeansMovementsKind() {
    return ApiServices.get(`${baseUrl}GetMoneyMeansMovementsKind`)
  },
  getAllowedTransactionICOAll() {
    return ApiServices.get(`${baseUrl}GetAllowedTransactionICOAll/?AccDbID=40`)
  },
  getAllowedTransactionICOAllList() {
    return ApiServices.get(`${baseUrl}GetAllowedTransactionICOAll/?AccDbID=41`)
  },
  getTransactionSubCountSubAccDBList() {
    return ApiServices.get(`${baseUrl}GetTransactionSubCountSubAccDBList/?AccID=40`)
  },
  getTransactionSubCountSubAccDB() {
    return ApiServices.get(`${baseUrl}GetTransactionSubCountSubAccDBList/?AccID=41`)
  },
  getInpaymentSubAccCRList(id) {
    return ApiServices.get(`${baseUrl}GetInpaymentSubAccCRList/?AllowedTransactionID=${id}`)
  },
  getTransactionSubCountInfo(divisionId) {
    return ApiServices.get(`${baseUrl}GetTransactionSubCountInfo/?AllowedTransactionID=${divisionId}`)
  },
  getMonthList() {
    return ApiServices.get(`${baseUrl}GetMonthList`)
  },
  getDepartmentsList() {
    return ApiServices.get(`${baseUrl}GetDepartmentsList`)
  },
  getResponsiblePersonForDocList() {
    return ApiServices.get(`${baseUrl}GetResponsiblePersonForDocList`)
  },
  getDepartmentStowegeList() {
    return ApiServices.get(`${baseUrl}GetDepartmentStowegeList`)
  },

  getCurrency() {
    return ApiServices.get(`${baseUrl}GetCurrency`)
  },
  getLastCurrency(id, date) {
    return ApiServices.get(`${baseUrl}GetLastCurrencyCourse?CurrencyID=${id}&Date=${date}`)
  },
  getSubAccTMZ(payload) {
    return ApiServices.get(`${baseUrl}GetSubAccTMZ`, { params: payload })
  },
  getStudentContractDbList() {
    return ApiServices.get(`${baseUrl}GetStudentContractDbList`)
  },
  getStudentContractCrList() {
    return ApiServices.get(`${baseUrl}GetStudentContractCrList`)
  },
  getFacultyList(payload) {
    return ApiServices.get(`${baseUrl}GetFacultyList`, { params: payload })
  },
  getStudyDirectionList(payload) {
    return ApiServices.get(`${baseUrl}GetStudyDirectionList`, { params: payload })
  },
  getStudyGroupList(payload) {
    return ApiServices.get(`${baseUrl}GetStudyGroupList`, { params: payload })
  },
  getSettlementAccountsList(payload) {
    return ApiServices.get(`${baseUrl}GetSettlementAccountsList`, { params: payload })
  },
  getListStudentList(payload) {
    return ApiServices.get(`${baseUrl}GetListStudentList`, { params: payload })
  },
  getSubAccDBListForChangeSubAcc(payload) {
    return ApiServices.get(`${baseUrl}GetSubAccDBListForChangeSubAcc`, { params: payload })
  },
  GetDocumentChangeLog(params) {
    return ApiServices.get(`${baseUrl}GetDocumentChangeLog`, { params: params })
  },
  getItemOfExpenseListForENKT(code) {
    return ApiServices.get(`${baseUrl}GetItemOfExpenseListForENKT?ENKTCode=${code}`)
  },
  getENKTPropertiesList(code, lang = 'ru_RU') {
    return ApiServices.get(`${baseUrl}GetENKTPropertiesList?Code=${code}&Language=${lang}`)
  },
  getENKTPropertiesValuesList(payload) {
    return ApiServices.get(`${baseUrl}GetENKTPropertiesValuesList`, {
      params: payload
    })
  },
  getSubAccDBList(payload) {
    return ApiServices.get(`${baseUrl}GetSubAccDBList`, { params: payload })
  },
  getSubAccCRList(payload) {
    return ApiServices.get(`${baseUrl}GetSubAccCRList`, { params: payload })
  },
  getInpaymentSubAccDBList(payload) {
    return ApiServices.get(`${baseUrl}GetInpaymentSubAccDBList`, { params: payload })
  },
  getInpaymentSubAccCrList(payload) {
    return ApiServices.get(`${baseUrl}GetInpaymentSubAccCRList`, { params: payload })
  },
  GetAllowedTransactionForOutcomeCashOrderList() {
    return ApiServices.get(`${baseUrl}GetAllowedTransactionForOutcomeCashOrderList?ID=74`)
  },
  GetAllowedTransactionForOutcomeCashOrderList2() {
    return ApiServices.get(`${baseUrl}GetAllowedTransactionInDocument/?DocumentID=205`)
  },
  GetAllowedTransactionForOutcomeCashOrderList3() {
    return ApiServices.get(`${baseUrl}GetAllowedTransactionInDocument/?DocumentID=143`)
  },

  getAllowedTransactionForCurrencyOutcomeCashOrderList() {
    return ApiServices.get(`${baseUrl}GetAllowedTransactionForCurrencyOutcomeCashOrderList/?ID=0`)
  },

  // getTMZSubAccDBList(divisionId) {
  //   return ApiServices.get(`${baseUrl}GetTMZSubAccDBList/?AllowedTransactionID=${divisionId}`)
  // },
  getPaymentOrderCommons(payload, controller, endpoint) {
    return ApiServices.get(`${controller}/${endpoint}`, { params: payload })
  },
  getContractorSubCountList(payload, controller, endpoint) {
    return ApiServices.get(`${baseUrl}${controller}`, { params: payload })
  },
  getWarrantsList() {
    return ApiServices.get(`${baseUrl}GetWarrantsList`)
  },

  getPAQuitTypeList() {
    return ApiServices.get(`${baseUrl}GetPAQuitTypeList`)
  },

  getAllowedTransactionInDocument(id) {
    return ApiServices.get(`${baseUrl}GetAllowedTransactionInDocument?DocumentID=${id}`)
  },
  getAllowedTransactionInDocument2(id) {
    return ApiServices.get(`${baseUrl}GetAllowedTransactionInDocument?DocumentID=${id}`)
  },
  getContractForSelectList(payload, endpoint) {
    return ApiServices.get(`${baseUrl}${endpoint}`, { params: payload })
  },
  getRestByPermanentAsset(newModalDate, responsiblePersonCrModalID, subDepartmentList, SubAccID) {
    return ApiServices.get(`${baseUrl}GetRestByPermanentAsset/?Date=${newModalDate}&SubAccID=${SubAccID}&selectedRows=&DepartmentID=${subDepartmentList}&ResponsiblePersonID=${responsiblePersonCrModalID}`)
  },

  getRegionMap(payload) {
    if (payload.Date) {
      return ApiServices.get(`${baseUrl}GetInfoDashboardOblastDate`, { params: payload });
    }
    else return ApiServices.get(`${baseUrl}GetInfoDasboardOblast`, { params: payload });
  },
  getDistrictMap(payload) {
    if (payload.Date) {
      return ApiServices.get(`${baseUrl}GetInfoDasboardRegionDate`, { params: payload });
    }
    else return ApiServices.get(`${baseUrl}GetInfoDasboardRegion`, { params: payload });
  },
  getInfoDasboardOrg(payload) {
    if (payload.Date) {
      return ApiServices.get(`${baseUrl}GetInfoDashboardOrgDate`, { params: payload });
    }
    else return ApiServices.get(`${baseUrl}GetInfoDashboardOrg`, { params: payload });
  },
  getInfoDashboardOrgDetails(payload) {
    return ApiServices.get(`${baseUrl}GetInfoDashboardOrgDetails`, { params: payload });
  },
  getInfoDashboardOrganization(payload) {
    return ApiServices.get(`${baseUrl}GetInfoDashboardOrganization`, { params: payload });
  },
  getInfoDashboardOrgGruop(payload) {
    if (payload.Date) {
      return ApiServices.get(`${baseUrl}GetInfoDashboardOrgGruop`, { params: payload });
    }
    return ApiServices.get(`${baseUrl}GetInfoDashboardOrgGruopDate`, { params: payload });
  },
  getInfoDashboardOrganizationCount(payload) {
    return ApiServices.get(`${baseUrl}GetInfoDashboardOrganizationCount`, { params: payload });
  },
  getInfoDashboardTotalSum(payload) {
    return ApiServices.get(`${baseUrl}GetInfoDashboardTotalSum`, { params: payload });
  },
}

export default HelperServices;
