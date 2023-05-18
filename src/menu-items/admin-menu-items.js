const menuItems = {
  items: [
    //Dashboard
    {
      id: "navigation",
      title: "Navigation",
      type: "group",
      icon: "icon-navigation",
      children: [
        {
          id: "dashboard",
          title: "Dashboard",
          type: "item",
          url: "/dashboard/default",
          icon: "feather icon-home",
          role: 'UserView'
        },
      ],
    },
    //Dashboard end
    //References
    {
      id: "references",
      title: "references",
      type: "group",
      icon: "icon-ui",
      children: [
        {
          id: "referenceOrganizations",
          title: "Reference Organizations",
          type: "collapse",
          icon: "feather icon-list",
          children: [
            {
              id: "Contractors",
              title: "Contractors",
              type: "item",
              url: "/Contractors",
              role: 'ContractorView'
            },
            {
              id: "contracts",
              title: "contracts",
              type: "item",
              url: "/contracts",
              role: 'ContractView'
            },
            {
              id: "SubAcc",
              title: "SubAcc",
              type: "item",
              url: "/SubAcc",
              role: 'SubAccView'
            },
            {
              id: "OrganizationsSettlementAccount",
              title: "OrganizationsSettlementAccount",
              type: "item",
              url: "/OrganizationsSettlementAccount",
              role: 'OrganizationsSettlementAccountView'
            },
            {
              id: "PermanentAsset",
              title: "PermanentAsset",
              type: "item",
              url: "/PermanentAsset",
              role: 'PermanentAssetView'
            },
            {
              id: "InventoryHolding",
              title: "InventoryHolding",
              type: "item",
              url: "/InventoryHolding",
              role: 'SubAccView'
            },
            {
              id: "Department",
              title: "Department",
              type: "item",
              url: "/Department",
              role: 'DepartmentView'
            },
            {
              id: "Employee",
              title: "Employee",
              type: "item",
              url: "/Employee",
              role: 'EmployeeView'
            },
            {
              id: "ResponsiblePerson",
              title: "ResponsiblePerson",
              type: "item",
              url: "/ResponsiblePerson",
              role: 'ResponsiblePersonView'
            },
            {
              id: "Children",
              title: "Children",
              type: "item",
              url: "/Children",
              role: 'ChildrenView'
            },
            {
              id: "ConstantValue",
              title: "ConstantValue",
              type: "item",
              url: "/ConstantValue",
              role: 'ConstantValueView'
            },
          ],
        },
        {
          id: "global reference",
          title: "Global Reference",
          type: "collapse",
          icon: "feather icon-globe",
          children: [
            {
              id: "Currency",
              title: "Currency",
              type: "item",
              url: "/Currency",
              role: 'CurrencyCourseView'
            },
            {
              id: "CurrencyCourse",
              title: "CurrencyCourse",
              type: "item",
              url: "/CurrencyCourse",
              role: 'CurrencyCourseView'
            },
            {
              id: "ItemOfExpense",
              title: "ItemOfExpense",
              type: "item",
              url: "/ItemOfExpense",
              role: 'ItemOfExpenseView'
            },
            {
              id: "FormaSetCommon",
              title: "FormaSetCommon",
              type: "item",
              url: "/FormaSetCommon",
              role: 'FormaSetCommonView'
            },
            // {
            //   id: "UserSettlementAccount",
            //   title: "UserSettlementAccount",
            //   type: "item",
            //   url: "/UserSettlementAccount",
            //   role: 'FormaSetCommonView'

            // },
            {
              id: "Specification",
              title: "Specification",
              type: "item",
              url: "/Specification",
              role: 'FormaSetCommonView'

            },
            {
              id: "InfoBank",
              title: "InfoBank",
              type: "item",
              url: "/InfoBank",
              role: 'BankView'
            },
            {
              id: "FunctionalItemOfExpense",
              title: "FunctionalItemOfExpense",
              type: "item",
              url: "/FunctionalItemOfExpense",
              role: 'FunctionalItemOfExpenseView'
            },
            {
              id: "TreasOperDate",
              title: "TreasOperDate",
              type: "item",
              url: "/TreasOperDate",
              role: 'TreasuryMemOrderView'
            },
            {
              id: "IncomeUNC",
              title: "IncomeUNC",
              type: "item",
              url: "/IncomeUNC",
              role: 'TreasuryMemOrderView'
            },
            {
              id: "OKED",
              title: "OKED",
              type: "item",
              url: "/OKED",
              role: 'CurrencyCourseView'
            },
            {
              id: "InfoAcc",
              title: "InfoAcc",
              type: "item",
              url: "/InfoAcc",
              role: 'AccView'
            },
            {
              id: "AllowedTransaction",
              title: "AllowedTransaction",
              type: "item",
              url: "/AllowedTransaction",
              role: 'AllowedTransactionView'
            },
          ],
        },
        // {
        //   id: "global reference",
        //   title: "Global Reference",
        //   type: "collapse",
        //   icon: "feather icon-globe",
        //   children: [
        //     {
        //       id: "bank",
        //       title: "Bank",
        //       type: "item",
        //       url: "/bank",
        //       role: 'BankView'
        //     },
        //     {
        //       id: "allowed Transaction",
        //       title: "Allowed Transaction",
        //       type: "item",
        //       url: "/allowedTransaction",
        //       role: 'AllowedTransactionView'
        //     },
        //     {
        //       id: "calculationKind",
        //       title: "Calculation Kind",
        //       type: "item",
        //       url: "/calculationKind",
        //       role: 'CalculationKindView'
        //     },
        //     {
        //       id: "minimalSalary",
        //       title: "Minimal Salary",
        //       type: "item",
        //       url: "/minimalSalary",
        //       role: 'MinimalSalaryView'
        //     },
        //     {
        //       id: "tariffScale",
        //       title: "Tariff Scale",
        //       type: "item",
        //       url: "/tariffScale",
        //       role: 'TariffScaleView'
        //     },
        //     {
        //       id: "qualificationCategory",
        //       title: "Qualification Category",
        //       type: "item",
        //       url: "/qualificationCategory",
        //       role: 'QualificationCategoryView'
        //     },
        //     {
        //       id: "subjects",
        //       title: "Subjects",
        //       type: "item",
        //       url: "/subjects",
        //       role: 'SubjectsView'
        //     },
        //     {
        //       id: "baseSalary",
        //       title: "BaseSalary",
        //       type: "item",
        //       url: "/baseSalary",
        //       role: 'MinimalSalaryView'
        //     },
        //     {
        //       id: "experienceContWork",
        //       title: "ExperienceContWork",
        //       type: "item",
        //       url: "/experienceContWork",
        //       role: 'ExperienceContWorkView'
        //     },
        //     {
        //       id: "scholarshipCategory",
        //       title: "ScholarshipCategory",
        //       type: "item",
        //       url: "/scholarshipCategory",
        //       role: 'MinimalSalaryView'
        //     },
        //     {
        //       id: "position",
        //       title: "Position",
        //       type: "item",
        //       url: "/position",
        //       role: 'PositionView'
        //     },
        //     {
        //       id: "positionQualificationAmount",
        //       title: "PositionQualificationAmount",
        //       type: "item",
        //       url: "/positionQualificationAmount",
        //       role: 'MinimalSalaryView'
        //     },
        //   ],
        // },
        // {
        //   id: "Templates",
        //   title: "templates",
        //   type: "collapse",
        //   icon: "feather icon-book",
        //   children: [
        //     {
        //       id: "holidays",
        //       title: "TPHolidays",
        //       type: "item",
        //       url: "/TPHoliday",
        //       role: 'TPHolidayView'
        //     },
        //     {
        //       id: "TPShift",
        //       title: "TPShift",
        //       type: "item",
        //       url: "/TPShift",
        //       role: 'TPShiftView'
        //     },
        //     {
        //       id: "TPWorkSchedule",
        //       title: "TPWorkSchedule",
        //       type: "item",
        //       url: "/TPWorkSchedule",
        //       role: 'TPWorkScheduleView'
        //     },
        //     {
        //       id: "TPTaxesAndCharges",
        //       title: "TPTaxesAndCharges",
        //       type: "item",
        //       url: "/TPTaxesAndCharges",
        //       role: 'TPTaxesAndChargesView'
        //     },
        //     {
        //       id: "TPSalaryTransaction",
        //       title: "TPSalaryTransaction",
        //       type: "item",
        //       url: "/TPSalaryTransaction",
        //       role: 'TPSalaryTransactionView'
        //     },
        //     {
        //       id: "TPSubCalculationKind",
        //       title: "TPSubCalculationKind",
        //       type: "item",
        //       url: "/TPSubCalculationKind",
        //       role: 'TPSubCalculationKindView'
        //     },
        //     {
        //       id: "TPBasicSubCalculationKind",
        //       title: "TPBasicSubCalculationKind",
        //       type: "item",
        //       url: "/TPBasicSubCalculationKind",
        //       role: 'TPBasicSubCalculationKindView'
        //     },
        //     {
        //       id: "TPListOfPosition",
        //       title: "TPListOfPosition",
        //       type: "item",
        //       url: "/TPListOfPosition",
        //       role: 'TPListOfPositionView'
        //     },
        //     {
        //       id: "TPListOfPositionCategory",
        //       title: "TPListOfPositionCategory",
        //       type: "item",
        //       url: "/TPListOfPositionCategory",
        //       role: 'TPListOfPositionCategoryView'
        //     },
        //     {
        //       id: "TPLimitBySubCalculationKind",
        //       title: "TPLimitBySubCalculationKind",
        //       type: "item",
        //       url: "/TPLimitBySubCalculationKind",
        //       role: 'TPLimitBySubCalculationKindView'
        //     },
        //   ],
        // },
      ],
    },
    //Reference end

    //Documents
    {
      id: "Documents",
      title: "Documents",
      type: "group",
      children: [
        {
          id: "PaymentDocuments",
          title: "PaymentDocuments",
          type: "collapse",
          icon: "feather icon-file-text",
          children: [
            {
              id: "PaymentOrder",
              title: "PaymentOrder",
              type: "item",
              url: "/PaymentOrder",
              role: 'PaymentOrderView'
            },
            {
              id: "SentPaymentOrder",
              title: "SentPaymentOrder",
              type: "item",
              url: "/PaymentRegister/SentPaymentOrder",
              role: 'PaymentRegistryView'
            },
            {
              id: "PaymentRegister",
              title: "PaymentRegister",
              type: "item",
              url: "/PaymentRegister",
              role: 'PaymentRegistryView'
            },
            {
              id: "TreasuryMemOrder",
              title: "TreasuryMemOrder",
              type: "item",
              url: "/TreasuryMemOrder",
              role: 'TreasuryMemOrderView'
            },
            {
              id: "PaymentRequest",
              title: "PaymentRequest",
              type: "item",
              url: "/PaymentRequest",
              role: 'PaymentRequestView'
            },
            {
              id: "Inpayment",
              title: "Inpayment",
              type: "item",
              url: "/Inpayment",
              role: 'InpaymentView'
            },
            {
              id: "OnlinePayment",
              title: "OnlinePayment",
              type: "item",
              url: "/OnlinePayment",
              role: 'OnlinePaymentView'
            },

          ],
        },
        {
          id: "CashList",
          title: "CashList",
          type: "collapse",
          icon: "feather icon-align-left",
          children: [
            {
              id: "IncomeCashOrder",
              title: "IncomeCashOrder",
              type: "item",
              url: "/IncomeCashOrder",
              role: 'IncomeCashOrderView'
            },
            {
              id: "OutcomeCashOrder",
              title: "OutcomeCashOrder",
              type: "item",
              url: "/OutcomeCashOrder",
              role: 'OutcomeCashOrderView'
            },
            {
              id: "CurrencyIncomeCashOrder",
              title: "CurrencyIncomeCashOrder",
              type: "item",
              url: "/CurrencyIncomeCashOrder",
              role: 'CurrencyIncomeCashOrderView'
            },
            {
              id: "CurrencyOutcomeCashOrder",
              title: "CurrencyOutcomeCashOrder",
              type: "item",
              url: "/CurrencyOutcomeCashOrder",
              role: 'CurrencyOutcomeCashOrderView'
            },

          ],
        },
        {
          id: "AccountingofFixedAssets",
          title: "AccountingofFixedAssets",
          type: "collapse",
          icon: "feather icon-file",
          children: [
            {
              id: "PermanentAssetReappraisal",
              title: "PermanentAssetReappraisal",
              type: "item",
              url: "/PermanentAssetReappraisal",
              role: 'PermanentAssetReappraisalView'
            },

            {
              id: "PermanentAssetAgeing",
              title: "PermanentAssetAgeing",
              type: "item",
              url: "/PermanentAssetAgeing",
              role: 'PermanentAssetAgeingView'
            },
            {
              id: "PermanentAssetMovementFromStowege",
              title: "PermanentAssetMovementFromStowege",
              type: "item",
              url: "/PermanentAssetMovementFromStowege",
              role: 'PermanentAssetMovementFromStowegeView'
            },
            {
              id: "PermanentAssetMovement",
              title: "PermanentAssetMovement",
              type: "item",
              url: "/PermanentAssetMovement",
              role: 'PermanentAssetMovementView'
            },
            {
              id: "PermanentAssetRetirement",
              title: "PermanentAssetRetirement",
              type: "item",
              url: "/PermanentAssetRetirement",
              role: 'PermanentAssetRetirementView'
            },

          ],
        },
        {
          id: "Others",
          title: "Others",
          type: "collapse",
          icon: "feather icon-paperclip",
          children: [
            {
              id: "StudentContract",
              title: "StudentContract",
              type: "item",
              url: "/StudentContract",
              role: 'StudentContractView'
            },

          ],
        },
        {
          id: "InventoryHoldingReserve",
          title: "InventoryHoldingReserve",
          type: "collapse",
          icon: "feather icon-users",
          children: [
            {
              id: "InventoryHoldingIntake",
              title: "InventoryHoldingIntake",
              type: "item",
              url: "/InventoryHoldingIntake",
              role: 'InventoryHoldingIntakeView'
            },

          ],
        },
        {
          id: "AccountingForFood",
          title: "AccountingForFood",
          type: "collapse",
          icon: "feather icon-users",
          children: [
            {
              id: "FoodstuffIntake",
              title: "FoodstuffIntake",
              type: "item",
              url: "/FoodstuffIntake",
              role: 'FoodstuffIntakeView'
            },

          ],
        },
        {
          id: "electronicApplication",
          title: "electronicApplication",
          type: "collapse",
          icon: "feather icon-file-text",
          children: [
            {
              id: "requestForSettlementAccount",
              title: "requestForSettlementAccount",
              type: "item",
              url: "/RequestForSettlementAccount",
              role: 'RequestForSettlementAccountView'
            },
          ],
        },
      ],
    },
    //Documents end

    //Reports
    {
      id: "reports",
      title: "reports",
      type: "group",
      children: [
        {
          id: "inventoryAccounting",
          title: "inventoryAccounting",
          type: "collapse",
          icon: "feather icon-file-text",
          children: [
            {
              id: "turnoverSheet",
              title: "turnoverSheet",
              type: "item",
              url: "/TurnoverSheet",
              role: 'ReportModuleView'
            },
            {
              id: "inventoryHoldingCard",
              title: "inventoryHoldingCardMenu",
              type: "item",
              url: "/InventoryHoldingCard",
              role: 'ReportModuleView'
            },
          ],
        },
      ],
    },
    //Reports end
    //Adminstrator
    {
      id: "Adminstrator",
      title: "Management",
      type: "group",
      children: [
        {
          id: "Users",
          title: "users",
          type: "collapse",
          icon: "feather icon-users",
          children: [
            {
              id: "User",
              title: "ControlUsers",
              type: "item",
              url: "/ControlUsers",
              role: 'UserView'
            },
            {
              id: "Role",
              title: "roles",
              type: "item",
              url: "/Roles",
              role: 'RoleView'
            },
            {
              id: "ChangeDocumentStatus",
              title: "changeDocumentStatus",
              type: "item",
              url: "/ChangeDocumentStatus",
              role: 'ChangeDocumentStatusView'
            },
            {
              id: "Organization",
              title: "Organization",
              type: "item",
              url: "/Organization",
              role: 'UserView'
            },
            {
              id: "OrganizationHeaderInfo",
              title: "OrganizationHeaderInfo",
              type: "item",
              url: "/OrganizationHeaderInfo",
              role: 'OrganizationsDocSettAccountView'
            },
            {
              id: "OrderInfo",
              title: "OrderInfo",
              type: "item",
              url: "/OrderInfo",
              role: 'OrderInfoView'
            },
            {
              id: "FormaDKPositionCanEdit",
              title: "FormaDKPositionCanEdit",
              type: "item",
              url: "/FormaDKPositionCanEdit",
              role: 'UserView'
            },
            {
              id: "OrganizationsDocSettAccount",
              title: "OrganizationsDocSettAccount",
              type: "item",
              url: "/OrganizationsDocSettAccount",
              role: 'AllowedTransactionView'
            },
          ],
        },

      ],
    },
    //Adminstrator end
  ],
};

export default menuItems;
