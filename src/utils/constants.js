// Loan Types
export const LOAN_TYPE_PERSONAL = 'personal';
export const LOAN_TYPE_HOME = 'home';
export const LOAN_TYPE_BUSINESS = 'business';

// Loan Type Configs
export const LOAN_CONFIGS = {
  [LOAN_TYPE_PERSONAL]: {
    label: 'Personal Loan',
    icon: '💳',
    description: 'For personal expenses, education, travel, or medical emergencies',
    minAmount: 50000,
    maxAmount: 1000000,
    minTenure: 12,
    maxTenure: 60,
    interestRate: 10.5,
    purposes: [
      'Medical Emergency',
      'Education',
      'Travel',
      'Home Renovation',
      'Wedding',
      'Debt Consolidation',
      'Other Personal Expenses'
    ],
    coApplicantThreshold: 500000,
  },
  [LOAN_TYPE_HOME]: {
    label: 'Home Loan',
    icon: '🏠',
    description: 'For purchasing, constructing, or renovating your dream home',
    minAmount: 50000,
    maxAmount: 10000000,
    minTenure: 60,
    maxTenure: 360,
    interestRate: 8.5,
    purposes: [
      'New Home Purchase',
      'Resale Property Purchase',
      'Home Construction',
      'Home Renovation',
      'Plot Purchase',
      'Balance Transfer'
    ],
    coApplicantThreshold: 0, // Always required
  },
  [LOAN_TYPE_BUSINESS]: {
    label: 'Business Loan',
    icon: '🏢',
    description: 'For expanding, upgrading, or starting your business venture',
    minAmount: 50000,
    maxAmount: 5000000,
    minTenure: 12,
    maxTenure: 120,
    interestRate: 14,
    purposes: [
      'Working Capital',
      'Equipment Purchase',
      'Business Expansion',
      'Inventory Purchase',
      'Office Space',
      'Business Acquisition',
      'Other Business Needs'
    ],
    coApplicantThreshold: 2000000,
  },
};

// Employment Types
export const EMPLOYMENT_SALARIED = 'salaried';
export const EMPLOYMENT_SELF_EMPLOYED = 'selfEmployed';
export const EMPLOYMENT_BUSINESS_OWNER = 'businessOwner';

// Residence Types
export const RESIDENCE_TYPES = [
  { value: 'owned', label: 'Owned' },
  { value: 'rented', label: 'Rented' },
  { value: 'company', label: 'Company Provided' },
  { value: 'family', label: 'Family' },
];

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

// Marital Status Options
export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
];

// Relationship Options
export const RELATIONSHIP_OPTIONS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'businessPartner', label: 'Business Partner' },
];

// Business Types
export const BUSINESS_TYPES = [
  { value: 'proprietorship', label: 'Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'pvtLtd', label: 'Private Limited' },
  { value: 'llp', label: 'LLP' },
  { value: 'publicLtd', label: 'Public Limited' },
  { value: 'other', label: 'Other' },
];

// File upload constraints
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_BANK_STATEMENT_SIZE_MB = 10;
export const MAX_PHOTO_SIZE_MB = 2;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
export const ACCEPTED_PDF_TYPE = ['application/pdf'];
export const ACCEPTED_DOC_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_PDF_TYPE];

// Auto-save
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
export const DRAFT_TTL_HOURS = 72;
export const STORAGE_KEY_PREFIX = 'lendswift_draft_';
export const STORAGE_META_PREFIX = 'lendswift_meta_';

// Processing Fee
export const PROCESSING_FEE_PERCENT = 1;
export const MIN_PROCESSING_FEE = 2000;
export const MAX_PROCESSING_FEE = 25000;

// PAN entity types
export const PAN_ENTITY_TYPES = {
  P: 'Individual',
  C: 'Company',
  H: 'HUF',
  A: 'AOP',
  B: 'BOI',
  G: 'Government',
  J: 'Artificial Juridical Person',
  L: 'Local Authority',
  F: 'Firm',
  T: 'Trust',
};

// Valid PAN types per loan type
export const VALID_PAN_TYPES = {
  [LOAN_TYPE_PERSONAL]: ['P'],
  [LOAN_TYPE_HOME]: ['P'],
  [LOAN_TYPE_BUSINESS]: ['P', 'C', 'F'],
};

// States of India
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];
