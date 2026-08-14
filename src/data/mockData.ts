import { ModuleConfig } from "../types"

const defaultAuditTrail = () => [
  {
    timestamp: "2026-08-12 10:00",
    user: "Arjun Kumar",
    action: "Created Record",
  },
]

const defaultActivities = (code: string) => [
  {
    id: "1",
    timestamp: "2026-08-12 10:05",
    user: "Arjun Kumar",
    description: "Record " + code + " initialized",
    type: "info" as const,
  },
]

const defaultComments = () => [
  {
    id: "1",
    user: "Arjun Kumar",
    avatar: "AK",
    timestamp: "2026-08-12 10:10",
    message: "Standard operational values populated.",
  },
]

const defaultAttachments = () => [
  {
    id: "1",
    name: "specification_sheet.pdf",
    size: "1.4 MB",
    uploadedBy: "Arjun Kumar",
    uploadedAt: "2026-08-12 10:02",
  },
]

const defaultApprovalHistory = () => [
  {
    step: "Initial Review",
    approver: "Neha Sharma (Operations Mgr)",
    status: "approved" as const,
    timestamp: "2026-08-12 11:00",
    comments: "Details verified.",
  },
]

export const modulesData: ModuleConfig[] = [
  {
    key: "commercial",
    label: "Commercial Management",
    icon: "trending-up",
    masters: [
      {
        key: "customer",
        label: "Customer",
        fields: [
          { key: "name", label: "Company Name", type: "text", required: true, section: "Company Details" },
          { key: "companyCode", label: "Company Code", type: "text", required: true, section: "Company Details" },
          { key: "incorporationDate", label: "Incorporation Date", type: "date", required: false, section: "Company Details" },
          { key: "customerType", label: "Customer Type", type: "select", options: ["Internal", "External"], required: true, section: "Company Details" },
          { key: "companyEmail", label: "Company Email", type: "text", required: false, section: "Company Details" },
          { key: "referenceNumber", label: "Reference Number", type: "text", required: false, section: "Company Details" },
          { key: "phone", label: "Company Phone Number", type: "text", required: true, section: "Company Contact Details" },
          { key: "altPhone", label: "Alt Phone Number", type: "text", required: false, section: "Company Contact Details" },
          { key: "currency", label: "Currency", type: "select", options: ["USD - United State Dollar ($)", "MYR - Malaysian Ringgit", "IDR - Indonesian Rupiah"], required: true, section: "Account Information" },
          { key: "address", label: "Address", type: "text", required: true, section: "Company Address" },
          { key: "country", label: "Country", type: "select", options: ["Malaysia", "Indonesia", "India", "Singapore"], required: true, section: "Company Address" },
          { key: "state", label: "State", type: "text", required: true, section: "Company Address" },
          { key: "city", label: "City", type: "text", required: false, section: "Company Address" },
          { key: "zone", label: "Zone", type: "text", required: true, section: "Company Address" },
          { key: "zipCode", label: "Zip Code", type: "text", required: false, section: "Company Address" },
          { key: "remarks", label: "Remarks", type: "text", required: false, section: "Other Information" },
          { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true, section: "Other Information" },
          
          { key: "ownerFirstName", label: "Owner First Name", type: "text", required: true, section: "Owner Information" },
          { key: "ownerLastName", label: "Owner Last Name", type: "text", required: true, section: "Owner Information" },
          { key: "ownerEmail", label: "Owner Email", type: "text", required: true, section: "Owner Information" },
          { key: "ownerDob", label: "Date Of Birth", type: "date", required: false, section: "Owner Information" },
          { key: "ownerPhone", label: "Owner Phone Number", type: "text", required: true, section: "Owner Contact Details" },
          { key: "ownerAltPhone", label: "Owner Alt Phone Number", type: "text", required: false, section: "Owner Contact Details" }
        ],
        defaultData: [
          {
            id: "cust-1",
            code: "CUST-2026-001",
            name: "Apex Technologies Pvt. Ltd.",
            status: "Active",
            createdAt: "2026-08-10",
            createdBy: "Arjun Kumar",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("CUST-2026-001"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              name: "Apex Technologies Pvt. Ltd.",
              companyCode: "ABCD123",
              incorporationDate: "2025-02-07",
              customerType: "Internal",
              companyEmail: "abc09@yopmail.com",
              referenceNumber: "NRJ395KSO",
              phone: "(+234)-1234567890",
              altPhone: "",
              currency: "USD - United State Dollar ($)",
              address: "2A, 2nd Floor, Inwinex Tower, D.No 8, Road No. 2, Venkat Nagar, Banjara Hills, Hyderabad, Telangana 500034",
              country: "India",
              state: "Telangana State",
              city: "Hyderabad",
              zone: "South",
              zipCode: "500034",
              remarks: "Primary internal manufacturing client",
              status: "Active",
              
              ownerFirstName: "David",
              ownerLastName: "Jones",
              ownerEmail: "owner212@yopmail.com",
              ownerDob: "2000-01-01",
              ownerPhone: "(+234)-1234567890",
              ownerAltPhone: ""
            },
          },
        ],
      },
    ],
    transactions: [
      {
        key: "enquiry",
        label: "Customer Enquiry",
        fields: [
          { key: "enquiryNo", label: "Enquiry Number", type: "text", required: true, section: "Enquiry Overview" },
          { key: "enquiryDate", label: "Enquiry Date", type: "date", required: true, section: "Enquiry Overview" },
          { key: "customer", label: "Customer", type: "select", options: ["Apex Technologies Pvt. Ltd.", "Adani Wilmar Palm Refinery", "Emami Agrotech Palm Division"], required: true, section: "Enquiry Overview" },
          
          { key: "product", label: "Product Required", type: "select", options: ["RBD Palm Olein (CP6)", "RBD Palm Olein (CP8)", "RBD Palm Olein (CP10)", "Crude Palm Oil (CPO)", "RBD Palm Stearin", "Palm Fatty Acid Distillate (PFAD)"], required: true, section: "Requirements Spec" },
          { key: "quantity", label: "Quantity (MT)", type: "number", required: true, section: "Requirements Spec" },
          { key: "packagingType", label: "Packaging Required", type: "select", options: ["Bulk Vessel", "Flexibag", "20L Jerrycan", "190kg Drum"], required: true, section: "Requirements Spec" },
          
          { key: "destinationPort", label: "Destination Port", type: "select", options: ["Rotterdam (NL)", "Nhava Sheva (IN)", "Shanghai (CN)", "Port Klang (MY)", "Belawan (ID)"], required: true, section: "Logistics Requested" },
          { key: "incoterm", label: "Requested Incoterm", type: "select", options: ["FOB", "CIF", "CFR"], required: true, section: "Logistics Requested" },
          { key: "targetDate", label: "Target Loading Date", type: "date", required: true, section: "Logistics Requested" },
          
          { key: "expectedPrice", label: "Target Price (USD / MT)", type: "number", required: true, section: "Commercial Target" },
          { key: "specialInstructions", label: "FFA / Quality Specifications", type: "text", required: false, section: "Other Requirements" },
          { key: "status", label: "Enquiry Status", type: "select", options: ["Pending", "Accepted", "Rejected"], required: true, section: "Other Information" }
        ],
        defaultData: [
          {
            id: "enq-1",
            code: "ENQ-2026-9042",
            date: "2026-08-12",
            status: "Pending",
            workflowStep: "Awaiting Quote",
            createdAt: "2026-08-12",
            createdBy: "Ramesh Patel",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("ENQ-2026-9042"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            approvalHistory: defaultApprovalHistory(),
            details: {
              enquiryNo: "ENQ-2026-9042",
              enquiryDate: "2026-08-12",
              customer: "Apex Technologies Pvt. Ltd.",
              product: "RBD Palm Olein (CP10)",
              quantity: 500,
              packagingType: "Bulk Vessel",
              destinationPort: "Nhava Sheva (IN)",
              incoterm: "FOB",
              targetDate: "2026-08-25",
              expectedPrice: 850,
              specialInstructions: "FFA < 0.1%, M&I < 0.1%, Color (5.25R max)",
              status: "Pending"
            },
          },
        ],
      },
      {
        key: "quotation",
        label: "Quotation",
        fields: [
          { key: "quotationNo", label: "Quotation No", type: "text", required: true, section: "Quotation Details" },
          { key: "quotationDate", label: "Quotation Date", type: "date", required: true, section: "Quotation Details" },
          { key: "expiryDate", label: "Expiry Date", type: "date", required: true, section: "Quotation Details" },
          { key: "customer", label: "Customer", type: "select", options: ["Apex Technologies Pvt. Ltd.", "Adani Wilmar Palm Refinery", "Emami Agrotech Palm Division"], required: true, section: "Quotation Details" },
          { key: "enquiryRef", label: "Enquiry Reference", type: "text", required: false, section: "Quotation Details" },
          
          { key: "product", label: "Product Offered", type: "select", options: ["RBD Palm Olein (CP6)", "RBD Palm Olein (CP8)", "RBD Palm Olein (CP10)", "Crude Palm Oil (CPO)", "RBD Palm Stearin", "Palm Fatty Acid Distillate (PFAD)"], required: true, section: "Logistics Details" },
          { key: "quantity", label: "Quoted Quantity (MT)", type: "number", required: true, section: "Logistics Details" },
          { key: "packagingType", label: "Packaging Type", type: "select", options: ["Bulk Vessel", "Flexibag", "20L Jerrycan", "190kg Drum"], required: true, section: "Logistics Details" },
          { key: "destinationPort", label: "Destination Port", type: "select", options: ["Rotterdam (NL)", "Nhava Sheva (IN)", "Shanghai (CN)", "Port Klang (MY)", "Belawan (ID)"], required: true, section: "Logistics Details" },
          { key: "incoterm", label: "Incoterm", type: "select", options: ["FOB", "CIF", "CFR"], required: true, section: "Logistics Details" },
          { key: "loadingPort", label: "Port of Loading", type: "select", options: ["Port Klang (MY)", "Pasir Gudang (MY)", "Belawan (ID)", "Dumai (ID)"], required: true, section: "Logistics Details" },
          
          { key: "currency", label: "Currency", type: "select", options: ["USD", "MYR", "IDR"], required: true, section: "Pricing & Financials" },
          { key: "unitPrice", label: "Unit Price (USD / MT)", type: "number", required: true, section: "Pricing & Financials" },
          { key: "discount", label: "Discount Amount", type: "number", required: false, section: "Pricing & Financials" },
          { key: "tax", label: "Export Duty / Tax %", type: "number", required: false, section: "Pricing & Financials" },
          { key: "paymentTerms", label: "Payment Terms", type: "select", options: ["LC at Sight", "CAD (Cash Against Documents)", "30% Advance + 70% DP", "100% Advance"], required: true, section: "Pricing & Financials" },
          
          { key: "status", label: "Status", type: "select", options: ["Draft", "Sent to Customer", "Approved", "Expired", "Rejected"], required: true, section: "Execution Details" },
          { key: "salesExecutive", label: "Sales Representative", type: "text", required: true, section: "Execution Details" }
        ],
        defaultData: [
          {
            id: "qtn-1",
            code: "QTN-2026-4812",
            date: "2026-08-12",
            status: "Approved",
            workflowStep: "Sent to Customer",
            createdAt: "2026-08-12",
            createdBy: "Arjun Kumar",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("QTN-2026-4812"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            approvalHistory: defaultApprovalHistory(),
            details: {
              quotationNo: "QTN-2026-4812",
              quotationDate: "2026-08-12",
              expiryDate: "2026-08-20",
              customer: "Apex Technologies Pvt. Ltd.",
              enquiryRef: "ENQ-2026-9042",
              product: "RBD Palm Olein (CP10)",
              quantity: 500,
              packagingType: "Bulk Vessel",
              destinationPort: "Nhava Sheva (IN)",
              incoterm: "FOB",
              loadingPort: "Port Klang (MY)",
              currency: "USD",
              unitPrice: 855,
              discount: 0,
              tax: 0,
              paymentTerms: "LC at Sight",
              status: "Approved",
              salesExecutive: "Arjun Kumar"
            },
          },
        ],
      },
      {
        key: "salesorder",
        label: "Sales Order",
        fields: [
          { key: "salesOrderNo", label: "Sales Order No", type: "text", required: true, section: "Sales Order Details" },
          { key: "salesOrderDate", label: "Sales Order Date", type: "date", required: true, section: "Sales Order Details" },
          { key: "customer", label: "Customer", type: "select", options: ["Apex Technologies Pvt. Ltd.", "Adani Wilmar Palm Refinery", "Emami Agrotech Palm Division"], required: true, section: "Sales Order Details" },
          { key: "quotationRef", label: "Quotation Reference", type: "text", required: false, section: "Sales Order Details" },
          
          { key: "product", label: "Product Ordered", type: "select", options: ["RBD Palm Olein (CP6)", "RBD Palm Olein (CP8)", "RBD Palm Olein (CP10)", "Crude Palm Oil (CPO)", "RBD Palm Stearin", "Palm Fatty Acid Distillate (PFAD)"], required: true, section: "Logistics Details" },
          { key: "quantity", label: "Ordered Quantity (MT)", type: "number", required: true, section: "Logistics Details" },
          { key: "packagingType", label: "Packaging Type", type: "select", options: ["Bulk Vessel", "Flexibag", "20L Jerrycan", "190kg Drum"], required: true, section: "Logistics Details" },
          { key: "destinationPort", label: "Destination Port", type: "select", options: ["Rotterdam (NL)", "Nhava Sheva (IN)", "Shanghai (CN)", "Port Klang (MY)", "Belawan (ID)"], required: true, section: "Logistics Details" },
          { key: "incoterm", label: "Incoterm", type: "select", options: ["FOB", "CIF", "CFR"], required: true, section: "Logistics Details" },
          { key: "loadingPort", label: "Port of Loading", type: "select", options: ["Port Klang (MY)", "Pasir Gudang (MY)", "Belawan (ID)", "Dumai (ID)"], required: true, section: "Logistics Details" },
          
          { key: "currency", label: "Currency", type: "select", options: ["USD", "MYR", "IDR"], required: true, section: "Pricing Details" },
          { key: "unitPrice", label: "Unit Price (USD / MT)", type: "number", required: true, section: "Pricing Details" },
          { key: "totalAmount", label: "Total Order Value (USD)", type: "number", required: true, section: "Pricing Details" },
          { key: "paymentTerms", label: "Payment Terms", type: "select", options: ["LC at Sight", "CAD (Cash Against Documents)", "30% Advance + 70% DP", "100% Advance"], required: true, section: "Pricing Details" },
          
          { key: "requestedDeliveryDate", label: "Requested Delivery Date", type: "date", required: true, section: "Execution Status" },
          { key: "status", label: "Status", type: "select", options: ["Open", "Awaiting Schedule", "Planned", "Dispatched", "Closed"], required: true, section: "Execution Status" }
        ],
        defaultData: [
          {
            id: "so-1",
            code: "SO-2026-0091",
            date: "2026-08-12",
            status: "Open",
            workflowStep: "Dispatched",
            createdAt: "2026-08-12",
            createdBy: "Arjun Kumar",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("SO-2026-0091"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            approvalHistory: defaultApprovalHistory(),
            details: {
              salesOrderNo: "SO-2026-0091",
              salesOrderDate: "2026-08-12",
              customer: "Apex Technologies Pvt. Ltd.",
              quotationRef: "QTN-2026-4812",
              product: "RBD Palm Olein (CP10)",
              quantity: 500,
              packagingType: "Bulk Vessel",
              destinationPort: "Nhava Sheva (IN)",
              incoterm: "FOB",
              loadingPort: "Port Klang (MY)",
              currency: "USD",
              unitPrice: 855,
              totalAmount: 427500,
              paymentTerms: "LC at Sight",
              requestedDeliveryDate: "2026-08-25",
              status: "Open"
            },
          },
          {
            id: "so-2",
            code: "SO-2026-0092",
            date: "2026-08-13",
            status: "Open",
            workflowStep: "Awaiting Schedule",
            createdAt: "2026-08-13",
            createdBy: "Arjun Kumar",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("SO-2026-0092"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            approvalHistory: defaultApprovalHistory(),
            details: {
              salesOrderNo: "SO-2026-0092",
              salesOrderDate: "2026-08-13",
              customer: "Emami Agrotech Palm Division",
              quotationRef: "",
              product: "RBD Palm Stearin",
              quantity: 300,
              packagingType: "Flexibag",
              destinationPort: "Shanghai (CN)",
              incoterm: "CIF",
              loadingPort: "Pasir Gudang (MY)",
              currency: "USD",
              unitPrice: 830,
              totalAmount: 249000,
              paymentTerms: "30% Advance + 70% DP",
              requestedDeliveryDate: "2026-08-28",
              status: "Open"
            },
          },
          {
            id: "so-3",
            code: "SO-2026-0093",
            date: "2026-08-13",
            status: "Open",
            workflowStep: "Awaiting Schedule",
            createdAt: "2026-08-13",
            createdBy: "Arjun Kumar",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("SO-2026-0093"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            approvalHistory: defaultApprovalHistory(),
            details: {
              salesOrderNo: "SO-2026-0093",
              salesOrderDate: "2026-08-13",
              customer: "Adani Wilmar Palm Refinery",
              quotationRef: "",
              product: "RBD Palm Olein (CP10)",
              quantity: 800,
              packagingType: "Bulk Vessel",
              destinationPort: "Nhava Sheva (IN)",
              incoterm: "FOB",
              loadingPort: "Dumai (ID)",
              currency: "USD",
              unitPrice: 860,
              totalAmount: 688000,
              paymentTerms: "LC at Sight",
              requestedDeliveryDate: "2026-09-02",
              status: "Open"
            },
          },
          {
            id: "so-4",
            code: "SO-2026-0094",
            date: "2026-08-14",
            status: "Open",
            workflowStep: "Awaiting Schedule",
            createdAt: "2026-08-14",
            createdBy: "Arjun Kumar",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("SO-2026-0094"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            approvalHistory: defaultApprovalHistory(),
            details: {
              salesOrderNo: "SO-2026-0094",
              salesOrderDate: "2026-08-14",
              customer: "Emami Agrotech Palm Division",
              quotationRef: "",
              product: "Palm Fatty Acid Distillate (PFAD)",
              quantity: 200,
              packagingType: "190kg Drum",
              destinationPort: "Shanghai (CN)",
              incoterm: "CFR",
              loadingPort: "Belawan (ID)",
              currency: "USD",
              unitPrice: 650,
              totalAmount: 130000,
              paymentTerms: "CAD (Cash Against Documents)",
              requestedDeliveryDate: "2026-09-05",
              status: "Open"
            },
          }
        ],
      },
    ],
  },
  {
    key: "procurement",
    label: "Procurement Management",
    icon: "shopping-cart",
    masters: [
      {
        key: "supplier",
        label: "Supplier",
        fields: [
          { key: "name", label: "Name of Organization", type: "text", required: true, section: "Basic Information" },
          { key: "shortName", label: "Short Name", type: "text", required: false, section: "Basic Information" },
          { key: "refCode", label: "Ref Code", type: "text", required: false, section: "Basic Information" },
          { key: "currency", label: "Currency", type: "select", options: ["USD - United State Dollar ($)", "MYR - Malaysian Ringgit", "IDR - Indonesian Rupiah"], required: true, section: "Basic Information" },
          { key: "parentGl", label: "Parent General Ledger", type: "select", options: ["Trade Payable - CPO", "Trade Payable - Additives", "Trade Payable - Packaging"], required: false, section: "Basic Information" },
          { key: "formOfBusiness", label: "Form Of Business", type: "select", options: ["Partnership", "Sole Proprietorship", "Public Limited", "Private Limited"], required: false, section: "Basic Information" },
          { key: "dateOfIncorporation", label: "Date Of Incorporation", type: "date", required: false, section: "Basic Information" },
          { key: "typeOfBusiness", label: "Type Of Business", type: "select", options: ["Raw Material Supplier", "Chemical Supplier", "Packaging Vendor", "Logistic Partner"], required: false, section: "Basic Information" },
          { key: "maxAdvance", label: "Max Advance (%)", type: "select", options: ["10", "20", "30", "50", "70"], required: false, section: "Basic Information" },
          { key: "printName", label: "Print Name", type: "text", required: true, section: "Basic Information" },
          { key: "whatsappNum", label: "Whatsapp Num", type: "text", required: false, section: "Basic Information" },
          
          { key: "email", label: "Email Address", type: "text", required: true, section: "Communication Info" },
          { key: "mobileNo", label: "Mobile No", type: "text", required: true, section: "Communication Info" },
          { key: "websiteUrl", label: "Website URL", type: "text", required: false, section: "Communication Info" },
          { key: "faxNo", label: "Fax No", type: "text", required: false, section: "Communication Info" },
          { key: "additionalPaymentInstruction", label: "Additional Payment Instruction", type: "text", required: false, section: "Communication Info" },
          
          { key: "streetAddress", label: "Street Address", type: "text", required: true, section: "Corporate Address" },
          { key: "country", label: "Country", type: "select", options: ["Malaysia", "Indonesia", "India", "Singapore"], required: true, section: "Corporate Address" },
          { key: "state", label: "State", type: "text", required: true, section: "Corporate Address" },
          { key: "city", label: "City", type: "text", required: false, section: "Corporate Address" },
          { key: "postCode", label: "Post Code", type: "text", required: false, section: "Corporate Address" },
          
          { key: "contactTitle", label: "Title", type: "select", options: ["Mr", "Ms", "Dr"], required: false, section: "Contact Person" },
          { key: "contactName", label: "Name", type: "text", required: true, section: "Contact Person" },
          { key: "contactGender", label: "Gender", type: "select", options: ["Male", "Female", "Other"], required: false, section: "Contact Person" },
          { key: "contactEmail", label: "Email", type: "text", required: true, section: "Contact Person" },
          { key: "contactMobile", label: "Mobile", type: "text", required: true, section: "Contact Person" }
        ],
        defaultData: [
          {
            id: "supp-1",
            code: "SUPP-2026-001",
            name: "Sime Darby Oils Trading",
            status: "Active",
            performanceTag: "High",
            ordersGiven: 18,
            ordersReceived: 18,
            onTimeDeliveries: 17,
            createdAt: "2026-08-11",
            createdBy: "Neha Sharma",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("SUPP-2026-001"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              name: "Sime Darby Oils Trading",
              shortName: "Sime Darby",
              refCode: "SDE-992-K",
              currency: "MYR - Malaysian Ringgit",
              parentGl: "Trade Payable - CPO",
              formOfBusiness: "Public Limited",
              dateOfIncorporation: "2010-04-12",
              typeOfBusiness: "Raw Material Supplier",
              maxAdvance: "70",
              printName: "Sime Darby Oils Trading Berhad",
              whatsappNum: "+60-12345-6789",
              email: "trading@simedarby.com",
              mobileNo: "+60-12-345-6789",
              websiteUrl: "https://www.simedarbyoils.com",
              faxNo: "+60-12-345-6780",
              additionalPaymentInstruction: "All invoices trade in USD bank accounts.",
              streetAddress: "Level 9, Sime Darby Plantation Tower, No. 2, Jalan PJU 1A/7, Ara Damansara",
              country: "Malaysia",
              state: "Selangor",
              city: "Petaling Jaya",
              postCode: "47301",
              contactTitle: "Mr",
              contactName: "Mohd Yazid",
              contactGender: "Male",
              contactEmail: "yazid.mohd@simedarby.com",
              contactMobile: "+60-12-345-6789"
            },
          },
          {
            id: "supp-2",
            code: "SUPP-2026-002",
            name: "Seri Maju Trading Sdn. Bhd.",
            status: "Active",
            performanceTag: "Average",
            ordersGiven: 12,
            ordersReceived: 11,
            onTimeDeliveries: 8,
            createdAt: "2026-08-11",
            createdBy: "Neha Sharma",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("SUPP-2026-002"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              name: "Seri Maju Trading Sdn. Bhd.",
              shortName: "Seri Maju",
              refCode: "SMT-441-B",
              currency: "MYR - Malaysian Ringgit",
              parentGl: "Trade Payable - Packaging",
              formOfBusiness: "Private Limited",
              dateOfIncorporation: "2015-07-22",
              typeOfBusiness: "Packaging Vendor",
              maxAdvance: "30",
              printName: "Seri Maju Trading Sdn Bhd",
              whatsappNum: "+60-11-2234-5678",
              email: "procurement@serimaju.com.my",
              mobileNo: "+60-11-2234-5678",
              websiteUrl: "https://www.serimaju.com.my",
              faxNo: "+60-11-2234-5670",
              additionalPaymentInstruction: "30 days credit term upon delivery.",
              streetAddress: "No. 12, Jalan Industri 3, Taman Perindustrian Puchong",
              country: "Malaysia",
              state: "Selangor",
              city: "Puchong",
              postCode: "47100",
              contactTitle: "Ms",
              contactName: "Lim Mei Ying",
              contactGender: "Female",
              contactEmail: "meiying@serimaju.com.my",
              contactMobile: "+60-11-2234-5678"
            },
          },
          {
            id: "supp-3",
            code: "SUPP-2026-003",
            name: "PT Wilmar Nabati Indonesia",
            status: "Active",
            performanceTag: "Low",
            ordersGiven: 9,
            ordersReceived: 6,
            onTimeDeliveries: 3,
            createdAt: "2026-08-12",
            createdBy: "Arjun Kumar",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("SUPP-2026-003"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              name: "PT Wilmar Nabati Indonesia",
              shortName: "Wilmar ID",
              refCode: "WNI-221-J",
              currency: "IDR - Indonesian Rupiah",
              parentGl: "Trade Payable - CPO",
              formOfBusiness: "Public Limited",
              dateOfIncorporation: "2008-03-15",
              typeOfBusiness: "Raw Material Supplier",
              maxAdvance: "20",
              printName: "PT Wilmar Nabati Indonesia Tbk",
              whatsappNum: "+62-21-5555-8899",
              email: "supply@wilmar-id.com",
              mobileNo: "+62-21-5555-8899",
              websiteUrl: "https://www.wilmar-international.com",
              faxNo: "+62-21-5555-8890",
              additionalPaymentInstruction: "LC only — no advance payments accepted.",
              streetAddress: "Jl. Jendral Sudirman Kav. 54-55, Sudirman Plaza",
              country: "Indonesia",
              state: "DKI Jakarta",
              city: "Jakarta Selatan",
              postCode: "12190",
              contactTitle: "Mr",
              contactName: "Budi Santoso",
              contactGender: "Male",
              contactEmail: "budi.santoso@wilmar-id.com",
              contactMobile: "+62-812-3456-7890"
            },
          },
          {
            id: "supp-4",
            code: "SUPP-2026-004",
            name: "IOI Oleochemical Industries",
            status: "Active",
            performanceTag: "High",
            ordersGiven: 22,
            ordersReceived: 22,
            onTimeDeliveries: 21,
            createdAt: "2026-08-12",
            createdBy: "Arjun Kumar",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("SUPP-2026-004"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              name: "IOI Oleochemical Industries",
              shortName: "IOI Oleo",
              refCode: "IOI-887-P",
              currency: "MYR - Malaysian Ringgit",
              parentGl: "Trade Payable - CPO",
              formOfBusiness: "Public Limited",
              dateOfIncorporation: "2000-11-08",
              typeOfBusiness: "Chemical Supplier",
              maxAdvance: "50",
              printName: "IOI Oleochemical Industries Bhd",
              whatsappNum: "+60-16-789-0012",
              email: "orders@ioioleo.com.my",
              mobileNo: "+60-16-789-0012",
              websiteUrl: "https://www.ioigroup.com",
              faxNo: "+60-16-789-0010",
              additionalPaymentInstruction: "Payment via TT within 15 days of invoice.",
              streetAddress: "2 IOI Square, IOI Resort City, Putrajaya",
              country: "Malaysia",
              state: "Putrajaya",
              city: "Putrajaya",
              postCode: "62502",
              contactTitle: "Mr",
              contactName: "Raj Kumar",
              contactGender: "Male",
              contactEmail: "raj.kumar@ioioleo.com.my",
              contactMobile: "+60-16-789-0012"
            },
          },
        ],
      },
    ],
    transactions: [
      {
        key: "po",
        label: "Purchase Order",
        fields: [
          { key: "poNo", label: "PO No Code", type: "text", required: true, section: "PO Info Header" },
          { key: "poDate", label: "PO Date", type: "date", required: true, section: "PO Info Header" },
          { key: "supplier", label: "Vendor", type: "select", options: ["Sime Darby Oils Trading"], required: true, section: "PO Info Header" },
          { key: "securityPaymentTerms", label: "Security Payment Terms", type: "select", options: ["100% CAD", "30% Advance + 70% DP", "LC at Sight"], required: false, section: "PO Info Header" },
          { key: "preferredBank", label: "Vendor Preferred Bank", type: "select", options: ["Maybank Berhad", "CIMB Bank", "Standard Chartered"], required: false, section: "PO Info Header" },
          
          { key: "currency", label: "Currency", type: "select", options: ["USD", "MYR", "IDR"], required: true, section: "Pricing & Trade" },
          { key: "exgRate", label: "Exg Rate", type: "number", required: true, section: "Pricing & Trade" },
          { key: "vendorRefNo", label: "Vendor Ref No", type: "text", required: false, section: "Pricing & Trade" },
          { key: "costCenter", label: "Cost Center", type: "select", options: ["Refinery Operations", "Utility Plant", "Logistics Fleet"], required: true, section: "Pricing & Trade" },
          { key: "priceRating", label: "Price Rating", type: "select", options: ["Fair", "Favorable", "Unfavorable"], required: false, section: "Pricing & Trade" },
          { key: "vatWithheld", label: "VAT Withheld?", type: "select", options: ["Yes", "No"], required: false, section: "Pricing & Trade" },
          { key: "inputTaxCredit", label: "Input Tax Credit?", type: "select", options: ["Yes", "No"], required: false, section: "Pricing & Trade" },
          
          { key: "product", label: "Item Name", type: "select", options: ["Crude Palm Oil (CPO)", "Bleaching Earth", "Phosphoric Acid", "Coal Fuel Stock"], required: true, section: "Material Selection" },
          { key: "quantity", label: "Ordered Qty (MT)", type: "number", required: true, section: "Material Selection" },
          { key: "unitPrice", label: "Unit Price", type: "number", required: true, section: "Material Selection" },
          { key: "totalAmount", label: "Total Taxable Amt", type: "number", required: true, section: "Material Selection" },
          { key: "deliveryDate", label: "Expected Delivery Date", type: "date", required: true, section: "Material Selection" },
          
          { key: "status", label: "Status", type: "select", options: ["Draft", "Approved", "Sent to Supplier", "Closed"], required: true, section: "Execution Details" }
        ],
        defaultData: [
          {
            id: "po-1",
            code: "PO-2026-551",
            date: "2026-08-12",
            status: "Approved",
            workflowStep: "Active",
            createdAt: "2026-08-12",
            createdBy: "Neha Sharma",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("PO-2026-551"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            approvalHistory: defaultApprovalHistory(),
            details: {
              poNo: "HOM-PO-10219",
              poDate: "2026-08-12",
              supplier: "Sime Darby Oils Trading",
              securityPaymentTerms: "LC at Sight",
              preferredBank: "Maybank Berhad",
              currency: "USD",
              exgRate: 1,
              vendorRefNo: "REF-SDE-882",
              costCenter: "Refinery Operations",
              priceRating: "Fair",
              vatWithheld: "No",
              inputTaxCredit: "Yes",
              product: "Crude Palm Oil (CPO)",
              quantity: 1000,
              unitPrice: 820,
              totalAmount: 820000,
              deliveryDate: "2026-08-20",
              status: "Approved"
            },
          },
        ],
      },
      {
        key: "gateentry",
        label: "Gate Operations (Entry/Exit)",
        fields: [
          { key: "vehicleNo", label: "Vehicle Number", type: "text", required: true, section: "Vehicle Details" },
          { key: "driverName", label: "Driver Name", type: "text", required: true, section: "Vehicle Details" },
          { key: "transporter", label: "Transporter", type: "text", required: true, section: "Vehicle Details" },
          { key: "materialName", label: "Cargo Type", type: "select", options: ["Crude Palm Oil (CPO)", "RBD Palm Olein"], required: true, section: "Cargo Declared" },
          { key: "quantity", label: "Declared Quantity (MT)", type: "number", required: true, section: "Cargo Declared" },
          { key: "entryDateTime", label: "Entry Date & Time", type: "text", required: true, section: "Security Status" },
          { key: "exitDateTime", label: "Exit Date & Time", type: "text", section: "Security Status" },
          { key: "exitClearance", label: "Exit Clearance Status", type: "select", options: ["Cleared", "Hold"], section: "Security Status" },
        ],
        defaultData: [
          {
            id: "ge-1",
            code: "GE-2026-0812",
            date: "2026-08-12",
            status: "Cleared",
            workflowStep: "Vehicle Exited",
            createdAt: "2026-08-12",
            createdBy: "SecOfficer R. Singh",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("GE-2026-0812"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            approvalHistory: defaultApprovalHistory(),
            details: {
              vehicleNo: "MH12-9842",
              driverName: "Harpreet Singh",
              transporter: "Global Cargo Logistics",
              materialName: "Crude Palm Oil (CPO)",
              quantity: 25,
              entryDateTime: "2026-08-12 10:15",
              exitDateTime: "2026-08-12 14:10",
              exitClearance: "Cleared",
            },
          },
        ],
      },
      {
        key: "qualityinspection",
        label: "Quality Inspection",
        fields: [
          { key: "gateEntry", label: "Gate Entry Ref", type: "text", required: true, section: "References" },
          { key: "sampleId", label: "Sample ID", type: "text", required: true, section: "Quality Parameters" },
          { key: "ffa", label: "Free Fatty Acids (FFA %)", type: "number", required: true, section: "Quality Parameters" },
          { key: "moi", label: "Moisture & Impurities (%)", type: "number", required: true, section: "Quality Parameters" },
          { key: "qualityStatus", label: "Inspection Status", type: "select", options: ["Accepted", "Rejected"], required: true, section: "Quality Parameters" },
        ],
        defaultData: [
          {
            id: "insp-1",
            code: "INSP-2026-0812",
            date: "2026-08-12",
            status: "Accepted",
            workflowStep: "Completed",
            createdAt: "2026-08-12",
            createdBy: "QA Lab Chief",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("INSP-2026-0812"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              gateEntry: "GE-2026-0812",
              sampleId: "SMP-2026-9042",
              ffa: 4.2,
              moi: 0.15,
              qualityStatus: "Accepted",
            },
          },
        ],
      },
      {
        key: "goodsreceipt",
        label: "Goods Receipt",
        fields: [
          { key: "gateEntry", label: "Gate Entry Ref", type: "text", required: true, section: "Receipt References" },
          { key: "product", label: "Product Received", type: "select", options: ["Crude Palm Oil (CPO)"], required: true, section: "Receipt Details" },
          { key: "receivedQty", label: "Received Qty (MT)", type: "number", required: true, section: "Receipt Details" },
          { key: "targetTank", label: "Discharge Tank", type: "select", options: ["Tank T-101 (Crude Palm Oil)"], required: true, section: "Discharge Details" },
        ],
        defaultData: [
          {
            id: "grn-1",
            code: "GRN-2026-0812",
            date: "2026-08-12",
            status: "Posted",
            workflowStep: "Inventory Updated",
            createdAt: "2026-08-12",
            createdBy: "StoreOfficer A. Verma",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("GRN-2026-0812"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              gateEntry: "GE-2026-0812",
              product: "Crude Palm Oil (CPO)",
              receivedQty: 24.8,
              targetTank: "Tank T-101 (Crude Palm Oil)",
            },
          },
        ],
      },
    ],
  },
  {
    key: "REMOVED_PLACEHOLDER",
    label: "Receiving Operations",
    icon: "truck",
    transactions: [
      {
        key: "gateentry",
        label: "Gate Operations (Entry/Exit)",
        fields: [
          {
            key: "vehicleNo",
            label: "Vehicle Number",
            type: "text",
            required: true,
            section: "Vehicle Details",
          },
          {
            key: "driverName",
            label: "Driver Name",
            type: "text",
            required: true,
            section: "Vehicle Details",
          },
          {
            key: "transporter",
            label: "Transporter",
            type: "text",
            required: true,
            section: "Vehicle Details",
          },
          {
            key: "materialName",
            label: "Cargo Type",
            type: "select",
            options: ["Crude Palm Oil (CPO)", "RBD Palm Olein"],
            required: true,
            section: "Cargo Declared",
          },
          {
            key: "quantity",
            label: "Declared Quantity (MT)",
            type: "number",
            required: true,
            section: "Cargo Declared",
          },
          {
            key: "entryDateTime",
            label: "Entry Date & Time",
            type: "text",
            required: true,
            section: "Security Status",
          },
          {
            key: "exitDateTime",
            label: "Exit Date & Time",
            type: "text",
            section: "Security Status",
          },
          {
            key: "exitClearance",
            label: "Exit Clearance Status",
            type: "select",
            options: ["Cleared", "Hold"],
            section: "Security Status",
          },
        ],
        defaultData: [
          {
            id: "ge-1",
            code: "GE-2026-0812",
            date: "2026-08-12",
            status: "Cleared",
            workflowStep: "Vehicle Exited",
            createdAt: "2026-08-12",
            createdBy: "SecOfficer R. Singh",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("GE-2026-0812"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            approvalHistory: defaultApprovalHistory(),
            details: {
              vehicleNo: "MH12-9842",
              driverName: "Harpreet Singh",
              transporter: "Global Cargo Logistics",
              materialName: "Crude Palm Oil (CPO)",
              quantity: 25,
              entryDateTime: "2026-08-12 10:15",
              exitDateTime: "2026-08-12 14:10",
              exitClearance: "Cleared",
            },
          },
        ],
      },
      {
        key: "qualityinspection",
        label: "Quality Inspection",
        fields: [
          {
            key: "gateEntry",
            label: "Gate Entry Ref",
            type: "text",
            required: true,
            section: "References",
          },
          {
            key: "sampleId",
            label: "Sample ID",
            type: "text",
            required: true,
            section: "Quality Parameters",
          },
          {
            key: "ffa",
            label: "Free Fatty Acids (FFA %)",
            type: "number",
            required: true,
            section: "Quality Parameters",
          },
          {
            key: "moi",
            label: "Moisture & Impurities (%)",
            type: "number",
            required: true,
            section: "Quality Parameters",
          },
          {
            key: "qualityStatus",
            label: "Inspection Status",
            type: "select",
            options: ["Accepted", "Rejected"],
            required: true,
            section: "Quality Parameters",
          },
        ],
        defaultData: [
          {
            id: "insp-1",
            code: "INSP-2026-0812",
            date: "2026-08-12",
            status: "Accepted",
            workflowStep: "Completed",
            createdAt: "2026-08-12",
            createdBy: "QA Lab Chief",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("INSP-2026-0812"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              gateEntry: "GE-2026-0812",
              sampleId: "SMP-2026-9042",
              ffa: 4.2,
              moi: 0.15,
              qualityStatus: "Accepted",
            },
          },
        ],
      },
      {
        key: "goodsreceipt",
        label: "Goods Receipt",
        fields: [
          {
            key: "gateEntry",
            label: "Gate Entry Ref",
            type: "text",
            required: true,
            section: "Receipt References",
          },
          {
            key: "product",
            label: "Product Received",
            type: "select",
            options: ["Crude Palm Oil (CPO)"],
            required: true,
            section: "Receipt Details",
          },
          {
            key: "receivedQty",
            label: "Received Qty (MT)",
            type: "number",
            required: true,
            section: "Receipt Details",
          },
          {
            key: "targetTank",
            label: "Discharge Tank",
            type: "select",
            options: ["Tank T-101 (Crude Palm Oil)"],
            required: true,
            section: "Discharge Details",
          },
        ],
        defaultData: [
          {
            id: "grn-1",
            code: "GRN-2026-0812",
            date: "2026-08-12",
            status: "Posted",
            workflowStep: "Inventory Updated",
            createdAt: "2026-08-12",
            createdBy: "StoreOfficer A. Verma",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("GRN-2026-0812"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              gateEntry: "GE-2026-0812",
              product: "Crude Palm Oil (CPO)",
              receivedQty: 24.8,
              targetTank: "Tank T-101 (Crude Palm Oil)",
            },
          },
        ],
      },
    ],
  },
  {
    key: "tankfarm",
    label: "Inventory",
    icon: "database",
    masters: [
      {
        key: "products",
        label: "Products",
        fields: [
          { key: "productName", label: "Product Name", type: "text", required: true, section: "Product Info" },
          { key: "productCode", label: "Product Code", type: "text", required: true, section: "Product Info" },
          { key: "productType", label: "Product Type", type: "select", options: ["Raw Material", "Chemical / Additive", "Finished Product"], required: true, section: "Product Info" },
          { key: "currentStock", label: "Current Stock", type: "number", required: true, section: "Inventory Status" },
          { key: "uom", label: "Unit of Measure (UOM)", type: "select", options: ["MT", "Units"], required: true, section: "Inventory Status" }
        ],
        defaultData: [
          {
            id: "prod-1",
            code: "PROD-CPO-01",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "System",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              productName: "Crude Palm Oil (CPO)",
              productCode: "PROD-CPO-01",
              productType: "Raw Material",
              currentStock: 1200,
              uom: "MT"
            }
          },
          {
            id: "prod-2",
            code: "PROD-PA-02",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "System",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              productName: "Phosphoric Acid (85% purity)",
              productCode: "PROD-PA-02",
              productType: "Chemical / Additive",
              currentStock: 50,
              uom: "MT"
            }
          },
          {
            id: "prod-3",
            code: "PROD-CS-03",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "System",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              productName: "Caustic Soda (NaOH 50% purity)",
              productCode: "PROD-CS-03",
              productType: "Chemical / Additive",
              currentStock: 30,
              uom: "MT"
            }
          },
          {
            id: "prod-4",
            code: "PROD-BE-04",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "System",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              productName: "Activated Bleaching Earth",
              productCode: "PROD-BE-04",
              productType: "Chemical / Additive",
              currentStock: 100,
              uom: "MT"
            }
          },
          {
            id: "prod-5",
            code: "PROD-CA-05",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "System",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              productName: "Citric Acid (50% purity)",
              productCode: "PROD-CA-05",
              productType: "Chemical / Additive",
              currentStock: 25,
              uom: "MT"
            }
          },
          {
            id: "prod-6",
            code: "PROD-FA-06",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "System",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              productName: "Precoat Filter Aid",
              productCode: "PROD-FA-06",
              productType: "Chemical / Additive",
              currentStock: 40,
              uom: "MT"
            }
          },
          {
            id: "prod-7",
            code: "PROD-FC-07",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "System",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              productName: "Filter Cloths / Papers",
              productCode: "PROD-FC-07",
              productType: "Chemical / Additive",
              currentStock: 200,
              uom: "Units"
            }
          },
          {
            id: "prod-8",
            code: "PROD-NG-08",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "System",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              productName: "Nitrogen Gas (Blanketing)",
              productCode: "PROD-NG-08",
              productType: "Chemical / Additive",
              currentStock: 15,
              uom: "MT"
            }
          },
          {
            id: "prod-9",
            code: "PROD-RPO-09",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "System",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              productName: "RBD Palm Olein (CP10)",
              productCode: "PROD-RPO-09",
              productType: "Finished Product",
              currentStock: 3850,
              uom: "MT"
            }
          },
          {
            id: "prod-10",
            code: "PROD-RPS-10",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "System",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              productName: "RBD Palm Stearin",
              productCode: "PROD-RPS-10",
              productType: "Finished Product",
              currentStock: 1500,
              uom: "MT"
            }
          },
          {
            id: "prod-11",
            code: "PROD-PFAD-11",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "System",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              productName: "PFAD",
              productCode: "PROD-PFAD-11",
              productType: "Finished Product",
              currentStock: 300,
              uom: "MT"
            }
          }
        ]
      },
      {
        key: "tank",
        label: "Tanks",
        fields: [
          {
            key: "tankName",
            label: "Tank Name",
            type: "text",
            required: true,
            section: "Basic Information",
          },
          {
            key: "tankTag",
            label: "Tank Tagging",
            type: "select",
            options: [
              "Crude Palm Oil Tank",
              "Production Tank",
              "Finished Product Tank",
            ],
            required: true,
            section: "Basic Information",
          },
          {
            key: "assignedProduct",
            label: "Assigned Product",
            type: "select",
            options: [
              "Crude Palm Oil (CPO)",
              "RBD Palm Olein (CP10)",
              "RBD Palm Stearin",
              "Palm Fatty Acid Distillate (PFAD)",
            ],
            required: true,
            section: "Basic Information",
          },
          {
            key: "capacity",
            label: "Capacity (MT)",
            type: "number",
            required: true,
            section: "Capacity Details",
          },
          {
            key: "currentVolume",
            label: "Current Product Vol (MT)",
            type: "number",
            required: true,
            section: "Capacity Details",
          },
        ],
        defaultData: [
          {
            id: "tank-1",
            code: "TANK-CPO-01",
            name: "Tank T-101 (CPO Crude Storage)",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Arjun Kumar",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("TANK-CPO-01"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              tankName: "Tank T-101 (CPO Crude Storage)",
              tankTag: "Crude Palm Oil Tank",
              assignedProduct: "Crude Palm Oil (CPO)",
              capacity: 5000,
              currentVolume: 3200,
            },
          },
          {
            id: "tank-2",
            code: "TANK-PROD-01",
            name: "Tank T-201 (Fractionation Feed)",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Arjun Kumar",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("TANK-PROD-01"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              tankName: "Tank T-201 (Fractionation Feed)",
              tankTag: "Production Tank",
              assignedProduct: "Crude Palm Oil (CPO)",
              capacity: 2500,
              currentVolume: 1200,
            },
          },
          {
            id: "tank-3",
            code: "TANK-FIN-01",
            name: "Tank T-301 (Olein Export Tank)",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Arjun Kumar",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("TANK-FIN-01"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              tankName: "Tank T-301 (Olein Export Tank)",
              tankTag: "Finished Product Tank",
              assignedProduct: "RBD Palm Olein (CP10)",
              capacity: 4000,
              currentVolume: 3850,
            },
          },
        ],
      },
    ],
  },
  {
    key: "production",
    label: "Production Control",
    icon: "cpu",
    masters: [
      {
        key: "process-template",
        label: "Process Templates",
        fields: [
          {
            key: "templateName",
            label: "Template Name",
            type: "text",
            required: true,
            section: "General Information",
          },
          {
            key: "finishedProduct",
            label: "Finished Product",
            type: "select",
            options: ["RBD Palm Olein (CP10)", "RBD Palm Stearin", "PFAD"],
            required: true,
            section: "General Information",
          },
          {
            key: "version",
            label: "Version",
            type: "text",
            required: true,
            section: "General Information",
          },
        ],
        defaultData: [
          {
            id: "pt-1",
            code: "PT-001",
            status: "Active",
            createdAt: "2026-08-13",
            createdBy: "Admin",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("PT-001"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              templateName: "RBD Palm Olein Process",
              finishedProduct: "RBD Palm Olein (CP10)",
              version: "1.0",
              steps: [
                { name: "Degumming", inputProduct: "Crude Palm Oil (CPO)", inputQty: 1000, outputProduct: "Degummed Palm Oil", outputQty: 990 },
                { name: "Neutralization", inputProduct: "Degummed Palm Oil", inputQty: 990, outputProduct: "Neutralized Palm Oil", outputQty: 975 },
                { name: "Bleaching", inputProduct: "Neutralized Palm Oil", inputQty: 975, outputProduct: "Bleached Palm Oil", outputQty: 965 },
                { name: "Filtration", inputProduct: "Bleached Palm Oil", inputQty: 965, outputProduct: "Filtered Palm Oil", outputQty: 960 },
                { name: "Deodorization", inputProduct: "Filtered Palm Oil", inputQty: 960, outputProduct: "RBD Palm Olein (CP10)", outputQty: 950 }
              ]
            },
          },
        ],
      },
    ],
    transactions: [
      {
        key: "prodplan",
        label: "Production Plan",
        fields: [
          {
            key: "planName",
            label: "Plan Name",
            type: "text",
            required: true,
            section: "Plan Details",
          },
          {
            key: "product",
            label: "Target Product",
            type: "select",
            options: ["RBD Palm Olein (CP10)", "RBD Palm Stearin"],
            required: true,
            section: "Plan Details",
          },
          {
            key: "targetQuantity",
            label: "Target Qty (MT)",
            type: "number",
            required: true,
            section: "Plan Details",
          },
          {
            key: "startDate",
            label: "Start Date",
            type: "date",
            required: true,
            section: "Schedule",
          },
          {
            key: "endDate",
            label: "End Date",
            type: "date",
            required: true,
            section: "Schedule",
          },
        ],
        defaultData: [
          {
            id: "plan-1",
            code: "PLAN-2026-0081",
            date: "2026-08-12",
            status: "Approved",
            workflowStep: "In Progress",
            createdAt: "2026-08-12",
            createdBy: "ProdMgr S. Kulkarni",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("PLAN-2026-0081"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              planName: "Olein Refining Batch 26A",
              product: "RBD Palm Olein (CP10)",
              targetQuantity: 1200,
              startDate: "2026-08-13",
              endDate: "2026-08-16",
            },
          },
        ],
      },

      {
        key: "prodorder",
        label: "Production Order",
        fields: [
          {
            key: "salesOrderRef",
            label: "Sales Order Ref",
            type: "text",
            required: true,
            section: "Reference Details",
          },
          {
            key: "product",
            label: "Product to Produce",
            type: "select",
            options: [
              "RBD Palm Olein (CP10)",
              "RBD Palm Stearin",
              "Palm Fatty Acid Distillate (PFAD)",
            ],
            required: true,
            section: "Production Details",
          },
          {
            key: "quantity",
            label: "Quantity (MT)",
            type: "number",
            required: true,
            section: "Production Details",
          },
          {
            key: "startDate",
            label: "Scheduled Start",
            type: "date",
            required: true,
            section: "Schedule",
          },
        ],
        defaultData: [
          {
            id: "po-ord-1",
            code: "PRD-ORD-2026-8041",
            date: "2026-08-12",
            status: "Released",
            workflowStep: "Ready to Run",
            createdAt: "2026-08-12",
            createdBy: "Arjun Kumar",
            auditTrail: defaultAuditTrail(),
            activities: defaultActivities("PRD-ORD-2026-8041"),
            comments: defaultComments(),
            attachments: defaultAttachments(),
            details: {
              salesOrderRef: "SO-2026-0091",
              product: "RBD Palm Olein (CP10)",
              quantity: 500,
              startDate: "2026-08-15",
            },
          },
        ],
      },
    ],
  },
  {
    key: "assets",
    label: "Asset Management",
    icon: "cpu",
    masters: [
      {
        key: "asset",
        label: "Assets",
        fields: [
          { key: "assetName", label: "Asset Name", type: "text", required: true, section: "Asset Profile" },
          { key: "assetCode", label: "Asset Code", type: "text", required: true, section: "Asset Profile" },
          { key: "category", label: "Category", type: "select", options: ["Refining Unit", "Storage Tank", "Utility Pump", "Piping Node", "Packaging Line"], required: true, section: "Asset Profile" },
          { key: "preventiveInterval", label: "Preventive Interval (Days)", type: "number", required: true, section: "Maintenance Setup" },
          { key: "lastMaintenanceDate", label: "Last Maintenance Date", type: "date", required: true, section: "Maintenance Setup" },
          { key: "nextMaintenanceDate", label: "Next Maintenance Date", type: "date", required: true, section: "Maintenance Setup" },
          { key: "status", label: "Operational Status", type: "select", options: ["Operational", "Under Maintenance", "Broken"], required: true, section: "Maintenance Setup" }
        ],
        defaultData: [
          {
            id: "asset-1",
            code: "ASSET-DEG-01",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Admin",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              assetName: "Degumming Acid Mixer Section",
              assetCode: "ASSET-DEG-01",
              category: "Refining Unit",
              preventiveInterval: 30,
              lastMaintenanceDate: "2026-08-01",
              nextMaintenanceDate: "2026-08-31",
              status: "Operational"
            }
          },
          {
            id: "asset-2",
            code: "ASSET-BL-02",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Admin",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              assetName: "Bleaching Earth Feeder Motor",
              assetCode: "ASSET-BL-02",
              category: "Refining Unit",
              preventiveInterval: 60,
              lastMaintenanceDate: "2026-07-15",
              nextMaintenanceDate: "2026-09-13",
              status: "Operational"
            }
          },
          {
            id: "asset-3",
            code: "ASSET-FIL-03",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Admin",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              assetName: "Bleaching Filtration Pressure Pump",
              assetCode: "ASSET-FIL-03",
              category: "Refining Unit",
              preventiveInterval: 15,
              lastMaintenanceDate: "2026-08-10",
              nextMaintenanceDate: "2026-08-25",
              status: "Operational"
            }
          },
          {
            id: "asset-4",
            code: "ASSET-DEO-04",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Admin",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              assetName: "Deodorizer Tower Vacuum Ventur",
              assetCode: "ASSET-DEO-04",
              category: "Refining Unit",
              preventiveInterval: 180,
              lastMaintenanceDate: "2026-06-01",
              nextMaintenanceDate: "2026-11-28",
              status: "Operational"
            }
          }
        ]
      }
    ]
  },
  {
    key: "maintenance",
    label: "Maintenance Operations",
    icon: "settings",
    transactions: [
      {
        key: "workorder",
        label: "Work Orders",
        fields: [
          { key: "workOrderNo", label: "Work Order Number", type: "text", required: true, section: "WO Info" },
          { key: "assetRef", label: "Asset Reference Code", type: "text", required: true, section: "WO Info" },
          { key: "maintType", label: "Maintenance Type", type: "select", options: ["Preventive", "Reactive"], required: true, section: "Schedule Details" },
          { key: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Emergency"], required: true, section: "Schedule Details" },
          { key: "description", label: "Work Description", type: "text", required: true, section: "Schedule Details" },
          { key: "scheduledDate", label: "Scheduled Work Date", type: "date", required: true, section: "Schedule Details" },
          { key: "status", label: "Work Status", type: "select", options: ["Draft", "Assigned", "In Progress", "Completed", "Cancelled"], required: true, section: "Progress Status" }
        ],
        defaultData: [
          {
            id: "wo-1",
            code: "WO-2026-0001",
            status: "Approved",
            date: "2026-08-14",
            createdAt: "2026-08-14",
            createdBy: "Maintenance Planner",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              workOrderNo: "WO-2026-0001",
              assetRef: "ASSET-DEG-01",
              maintType: "Preventive",
              priority: "Medium",
              description: "Monthly preventive servicing and acid dosing pump check",
              scheduledDate: "2026-08-31",
              status: "Draft"
            }
          },
          {
            id: "wo-2",
            code: "WO-2026-0002",
            status: "Approved",
            date: "2026-08-14",
            createdAt: "2026-08-14",
            createdBy: "Maintenance Planner",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              workOrderNo: "WO-2026-0002",
              assetRef: "ASSET-BL-02",
              maintType: "Reactive",
              priority: "High",
              description: "Fix earth feeder speed controller issue",
              scheduledDate: "2026-08-14",
              status: "In Progress"
            }
          }
        ]
      },
      {
        key: "maintrequest",
        label: "Maintenance Requests",
        fields: [
          { key: "requestNo", label: "Request Number", type: "text", required: true, section: "Req Info" },
          { key: "assetRef", label: "Asset Reference Code", type: "text", required: true, section: "Req Info" },
          { key: "reportedIssue", label: "Reported Issue Description", type: "text", required: true, section: "Req Info" },
          { key: "reportedBy", label: "Reported By Name", type: "text", required: true, section: "Audit Details" },
          { key: "requestDate", label: "Request Date", type: "date", required: true, section: "Audit Details" },
          { key: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Emergency"], required: true, section: "Audit Details" },
          { key: "status", label: "Request Status", type: "select", options: ["New", "Approved", "Work Order Created", "Rejected"], required: true, section: "Request Status" }
        ],
        defaultData: [
          {
            id: "req-1",
            code: "REQ-2026-0101",
            status: "Approved",
            date: "2026-08-14",
            createdAt: "2026-08-14",
            createdBy: "Rajesh Kumar",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              requestNo: "REQ-2026-0101",
              assetRef: "ASSET-BL-02",
              reportedIssue: "Earth feeder speed controller showing unstable speed",
              reportedBy: "Operator Rajan",
              requestDate: "2026-08-14",
              priority: "High",
              status: "Approved"
            }
          }
        ]
      }
    ]
  },
  {
    key: "utilities",
    label: "Utilities",
    icon: "users",
    masters: [
      {
        key: "employee",
        label: "Employee Roster",
        fields: [
          { key: "employeeName", label: "Employee Name", type: "text", required: true, section: "Employee Profile" },
          { key: "employeeCode", label: "Employee Code", type: "text", required: true, section: "Employee Profile" },
          { key: "role", label: "Role", type: "select", options: ["Shift Engineer", "Operator", "Technician", "Supervisor"], required: true, section: "Employee Profile" },
          { key: "status", label: "Operational Status", type: "select", options: ["Active", "On Leave", "Suspended"], required: true, section: "Employee Profile" }
        ],
        defaultData: [
          {
            id: "emp-1",
            code: "EMP-001",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Admin",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              employeeName: "Rajesh Kumar",
              employeeCode: "EMP-001",
              role: "Shift Engineer",
              status: "Active"
            }
          },
          {
            id: "emp-2",
            code: "EMP-002",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Admin",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              employeeName: "Rajan Singh",
              employeeCode: "EMP-002",
              role: "Operator",
              status: "Active"
            }
          },
          {
            id: "emp-3",
            code: "EMP-003",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Admin",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              employeeName: "Amit Sharma",
              employeeCode: "EMP-003",
              role: "Operator",
              status: "Active"
            }
          },
          {
            id: "emp-4",
            code: "EMP-004",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Admin",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              employeeName: "Anil Mehta",
              employeeCode: "EMP-004",
              role: "Technician",
              status: "Active"
            }
          },
          {
            id: "emp-5",
            code: "EMP-005",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Admin",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              employeeName: "Suresh G.",
              employeeCode: "EMP-005",
              role: "Supervisor",
              status: "Active"
            }
          }
        ]
      }
    ],
    transactions: [
      {
        key: "shiftplan",
        label: "Shift Allocations",
        fields: [
          { key: "shiftNo", label: "Shift Plan No", type: "text", required: true, section: "Shift Info" },
          { key: "employeeRef", label: "Assigned Employee", type: "text", required: true, section: "Shift Info" },
          { key: "scheduledDay", label: "Scheduled Day", type: "select", options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true, section: "Shift Info" },
          { key: "productionOrderRef", label: "Production Order Ref", type: "text", required: true, section: "Shift Info" },
          { key: "shiftTime", label: "Shift Timing", type: "select", options: ["Day (08:00 - 16:00)", "Evening (16:00 - 00:00)", "Night (00:00 - 08:00)"], required: true, section: "Shift Info" }
        ],
        defaultData: [
          {
            id: "shift-1",
            code: "SHIFT-2026-0001",
            status: "Approved",
            createdAt: "2026-08-14",
            createdBy: "Operations Planner",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              shiftNo: "SHIFT-2026-0001",
              employeeRef: "Rajesh Kumar",
              scheduledDay: "Monday",
              productionOrderRef: "PRD-ORD-2026-8041",
              shiftTime: "Day (08:00 - 16:00)"
            }
          },
          {
            id: "shift-2",
            code: "SHIFT-2026-0002",
            status: "Approved",
            createdAt: "2026-08-14",
            createdBy: "Operations Planner",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              shiftNo: "SHIFT-2026-0002",
              employeeRef: "Rajan Singh",
              scheduledDay: "Wednesday",
              productionOrderRef: "PRD-ORD-2026-8041",
              shiftTime: "Night (00:00 - 08:00)"
            }
          }
        ]
      },
      {
        key: "utilitylogs",
        label: "Utility Usage Logs",
        fields: [
          { key: "logNo", label: "Log Number", type: "text", required: true, section: "Log ID" },
          { key: "logDate", label: "Date of Log", type: "date", required: true, section: "Telemetry Data" },
          { key: "coalStock", label: "Coal Fuel Stock (MT)", type: "number", required: true, section: "Fuel Inventory" },
          { key: "waterConsumption", label: "Boiler Feedwater (kL)", type: "number", required: true, section: "Utility Inputs" },
          { key: "steamGenerated", label: "Process Steam Yield (MT)", type: "number", required: true, section: "Utility Yields" },
          { key: "powerConsumption", label: "Grid Electrical Draw (kWh)", type: "number", required: true, section: "Utility Inputs" }
        ],
        defaultData: [
          {
            id: "utl-log-1",
            code: "UTL-2026-091",
            status: "Recorded",
            createdAt: "2026-08-14",
            createdBy: "Boiler Operator",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              logNo: "UTL-2026-091",
              logDate: "2026-08-14",
              coalStock: 450,
              waterConsumption: 120,
              steamGenerated: 95,
              powerConsumption: 4800
            }
          },
          {
            id: "utl-log-2",
            code: "UTL-2026-092",
            status: "Recorded",
            createdAt: "2026-08-13",
            createdBy: "Boiler Operator",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              logNo: "UTL-2026-092",
              logDate: "2026-08-13",
              coalStock: 480,
              waterConsumption: 115,
              steamGenerated: 92,
              powerConsumption: 4600
            }
          }
        ]
      }
    ]
  },
  {
    key: "finance",
    label: "Payments",
    icon: "dollar-sign",
    masters: [
      {
        key: "paymentterm",
        label: "Payment Terms",
        fields: [
          { key: "termName", label: "Term Name", type: "text", required: true, section: "Term Rules" },
          { key: "advancePct", label: "Advance Payment %", type: "number", required: true, section: "Term Rules" },
          { key: "dispatchPct", label: "On Dispatch %", type: "number", required: true, section: "Term Rules" },
          { key: "deliveryPct", label: "On Delivery %", type: "number", required: true, section: "Term Rules" }
        ],
        defaultData: [
          {
            id: "term-1",
            code: "TERM-25-50-25",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Admin",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              termName: "Standard 25-50-25 Scheme",
              advancePct: 25,
              dispatchPct: 50,
              deliveryPct: 25
            }
          },
          {
            id: "term-2",
            code: "TERM-ADV-100",
            status: "Active",
            createdAt: "2026-08-01",
            createdBy: "Admin",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              termName: "100% Advance Payment",
              advancePct: 100,
              dispatchPct: 0,
              deliveryPct: 0
            }
          }
        ]
      }
    ],
    transactions: [
      {
        key: "paymentreceived",
        label: "Payments Received",
        fields: [
          { key: "paymentNo", label: "Receipt Voucher No", type: "text", required: true, section: "Voucher Details" },
          { key: "salesOrderRef", label: "Linked Sales Order", type: "select", options: ["SO-2026-0091", "SO-2026-0092"], required: true, section: "Voucher Details" },
          { key: "amount", label: "Amount Received (₹)", type: "number", required: true, section: "Transaction Amount" },
          { key: "paymentDate", label: "Date Received", type: "date", required: true, section: "Transaction Amount" },
          { key: "paymentStage", label: "Payment Milestone Stage", type: "select", options: ["Advance 25%", "On Dispatch 50%", "On Delivery 25%", "100% Advance"], required: true, section: "Transaction Amount" },
          { key: "paymentMethod", label: "Payment Instrument Type", type: "select", options: ["Bank Wire / RTGS", "Letter of Credit", "UPI Transfer"], required: true, section: "Audit Tracking" }
        ],
        defaultData: [
          {
            id: "pay-rec-1",
            code: "PMT-REC-2026-001",
            status: "Cleared",
            createdAt: "2026-08-12",
            createdBy: "Accounts Receivable",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              paymentNo: "PMT-REC-2026-001",
              salesOrderRef: "SO-2026-0091",
              amount: 7500000,
              paymentDate: "2026-08-12",
              paymentStage: "Advance 25%",
              paymentMethod: "Bank Wire / RTGS"
            }
          }
        ]
      },
      {
        key: "paymentmade",
        label: "Payments Made",
        fields: [
          { key: "paymentNo", label: "Disbursement Voucher No", type: "text", required: true, section: "Voucher Details" },
          { key: "purchaseOrderRef", label: "Linked Purchase Order", type: "select", options: ["PO-2026-551"], required: true, section: "Voucher Details" },
          { key: "amount", label: "Amount Paid (₹)", type: "number", required: true, section: "Transaction Amount" },
          { key: "paymentDate", label: "Date Paid", type: "date", required: true, section: "Transaction Amount" },
          { key: "paymentStage", label: "Payment Milestone Stage", type: "select", options: ["Advance 25%", "On Dispatch 50%", "On Delivery 25%", "100% Advance"], required: true, section: "Transaction Amount" },
          { key: "paymentMethod", label: "Payment Instrument Type", type: "select", options: ["NEFT / RTGS Transfer", "Corporate Cheque", "Letter of Credit"], required: true, section: "Audit Tracking" }
        ],
        defaultData: [
          {
            id: "pay-made-1",
            code: "PMT-MADE-2026-001",
            status: "Processed",
            createdAt: "2026-08-13",
            createdBy: "Accounts Payable",
            auditTrail: [],
            activities: [],
            comments: [],
            attachments: [],
            details: {
              paymentNo: "PMT-MADE-2026-001",
              purchaseOrderRef: "PO-2026-551",
              amount: 1200000,
              paymentDate: "2026-08-13",
              paymentStage: "Advance 25%",
              paymentMethod: "NEFT / RTGS Transfer"
            }
          }
        ]
      }
    ]
  }
]

