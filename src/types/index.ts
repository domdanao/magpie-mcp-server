// Magpie API Configuration
export interface MagpieConfig {
  apiKey: string;
  secretKey: string;
  baseUrl?: string;
  testMode?: boolean;
}

// Common Payment Types
export type Currency = 'PHP';

export type PaymentMethodType = 
  | 'card' 
  | 'gcash' 
  | 'maya' 
  | 'paymaya'
  | 'bpi' 
  | 'alipay' 
  | 'unionpay' 
  | 'wechat';

export type PaymentMode = 'payment' | 'setup' | 'subscription' | 'save_card';

export interface LineItem {
  name: string;
  quantity: number;
  amount: number;
  description?: string;
  image?: string;
}

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postal_code?: string;
  phone_number?: string;
  email?: string;
}

export interface Redirect {
  success: string;
  fail: string;
  notify?: string;
}

// Source Types
export interface CardDetails {
  name: string;
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  address_line1?: string;
  address_line2?: string;
  address_city?: string;
  address_state?: string;
  address_country?: string;
  address_zip?: string;
}

export interface CreateSourceRequest {
  type: PaymentMethodType;
  card?: CardDetails;
  redirect?: Redirect;
  owner?: {
    billing?: Address;
    shipping?: Address;
    name?: string;
    address_country?: string;
  };
}

// Charge Types
export interface CreateChargeRequest {
  amount: number;
  currency: Currency;
  source: string;
  description: string;
  statement_descriptor: string;
  capture?: boolean;
  cvc?: string;
  require_auth?: boolean;
  redirect_url?: string;
  metadata?: Record<string, any>;
}

// Checkout Session Types
export interface CreateCheckoutSessionRequest {
  currency: Currency;
  cancel_url: string;
  success_url: string;
  line_items: LineItem[];
  mode: PaymentMode;
  payment_method_types: PaymentMethodType[];
  customer?: string;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  description?: string;
  metadata?: Record<string, string>;
  client_reference_id?: string;
}

// Payment Request Types
export interface CreatePaymentRequestRequest {
  currency: Currency;
  customer?: string;
  delivery_methods: ('email' | 'sms')[];
  line_items: LineItem[];
  message?: string;
  metadata?: Record<string, string>;
  payment_method_types: PaymentMethodType[];
}

// Payment Link Types
export interface CreatePaymentLinkRequest {
  allow_adjustable_quantity: boolean;
  currency: Currency;
  internal_name: string;
  line_items: Array<LineItem & { remaining?: number }>;
  payment_method_types: PaymentMethodType[];
  description?: string;
  expiry?: string;
  metadata?: Record<string, string>;
  phone_number_collection?: boolean;
  redirect_url?: string;
  require_auth?: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    type: string;
    message: string;
    code?: string;
  };
}

// MCP Tool Arguments
export interface ToolArguments {
  [key: string]: any;
}