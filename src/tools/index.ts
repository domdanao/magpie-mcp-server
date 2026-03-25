import { Tool } from '@modelcontextprotocol/sdk/types.js';

export function createMagpieTools(): Tool[] {
  return [
    // Account
    {
      name: 'get_me',
      description: 'Get your Magpie merchant account information including account name, status, payment method settings, rates, payout settings, and branding',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    },

    // Payment Sources
    {
      name: 'create_source',
      description: 'Create a payment source (card, wallet, bank account) for processing payments',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['card', 'gcash', 'maya', 'paymaya', 'bpi', 'alipay', 'unionpay', 'wechat', 'grabpay', 'instapay', 'qrph'],
            description: 'The type of payment method'
          },
          card: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Cardholder name' },
              number: { type: 'string', description: '16-digit card number' },
              exp_month: { type: 'string', description: 'Expiry month (MM)' },
              exp_year: { type: 'string', description: 'Expiry year (YYYY)' },
              cvc: { type: 'string', description: 'Card security code' }
            },
            required: ['name', 'number', 'exp_month', 'exp_year', 'cvc']
          },
          redirect: {
            type: 'object',
            properties: {
              success: { type: 'string', description: 'Success redirect URL' },
              fail: { type: 'string', description: 'Failure redirect URL' },
              notify: { type: 'string', description: 'Notification webhook URL' }
            },
            required: ['success', 'fail']
          }
        },
        required: ['type']
      }
    },
    
    {
      name: 'get_source',
      description: 'Retrieve details of a payment source',
      inputSchema: {
        type: 'object',
        properties: {
          sourceId: {
            type: 'string',
            description: 'The ID of the source to retrieve'
          }
        },
        required: ['sourceId']
      }
    },

    // Customers
    {
      name: 'create_customer',
      description: 'Create a customer for recurring charges and source management',
      inputSchema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: "Customer's email address"
          },
          description: {
            type: 'string',
            description: 'Customer description'
          },
          mobile_number: {
            type: 'string',
            description: "Customer's mobile number"
          },
          metadata: {
            type: 'object',
            description: 'Set of key-value pairs for storing additional information'
          }
        },
        required: ['email', 'description']
      }
    },

    {
      name: 'get_customer',
      description: 'Retrieve details of an existing customer by ID',
      inputSchema: {
        type: 'object',
        properties: {
          customerId: {
            type: 'string',
            description: 'The ID of the customer to retrieve'
          }
        },
        required: ['customerId']
      }
    },

    {
      name: 'update_customer',
      description: 'Update customer details',
      inputSchema: {
        type: 'object',
        properties: {
          customerId: {
            type: 'string',
            description: 'The ID of the customer to update'
          },
          mobile_number: {
            type: 'string',
            description: "Customer's mobile number"
          },
          description: {
            type: 'string',
            description: 'Customer description'
          },
          metadata: {
            type: 'object',
            description: 'Set of key-value pairs for storing additional information'
          }
        },
        required: ['customerId']
      }
    },

    {
      name: 'get_customer_by_email',
      description: 'Retrieve details of an existing customer by email address',
      inputSchema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'The email address of the customer to retrieve'
          }
        },
        required: ['email']
      }
    },

    {
      name: 'attach_source_to_customer',
      description: 'Attach a payment source to a customer for recurring charges',
      inputSchema: {
        type: 'object',
        properties: {
          customerId: {
            type: 'string',
            description: 'The ID of the customer'
          },
          source: {
            type: 'string',
            description: 'The source ID to attach to the customer'
          }
        },
        required: ['customerId', 'source']
      }
    },

    {
      name: 'detach_source_from_customer',
      description: 'Detach a payment source from a customer',
      inputSchema: {
        type: 'object',
        properties: {
          customerId: {
            type: 'string',
            description: 'The ID of the customer'
          },
          sourceId: {
            type: 'string',
            description: 'The source ID to detach from the customer'
          }
        },
        required: ['customerId', 'sourceId']
      }
    },

    // Payment Charges
    {
      name: 'create_charge',
      description: 'Create a payment charge using a source',
      inputSchema: {
        type: 'object',
        properties: {
          amount: {
            type: 'integer',
            description: 'Amount in cents (e.g., 5000 for PHP 50.00)'
          },
          currency: {
            type: 'string',
            enum: ['PHP'],
            description: 'Three-letter ISO currency code'
          },
          source: {
            type: 'string',
            description: 'The ID of the payment source'
          },
          description: {
            type: 'string',
            description: 'A description for this charge'
          },
          statement_descriptor: {
            type: 'string',
            description: 'Text that appears on customer\'s statement'
          },
          capture: {
            type: 'boolean',
            description: 'Whether to immediately capture the charge',
            default: true
          },
          require_auth: {
            type: 'boolean',
            description: 'Whether to require 3D Secure authentication',
            default: true
          }
        },
        required: ['amount', 'currency', 'source', 'description', 'statement_descriptor']
      }
    },

    {
      name: 'get_charge',
      description: 'Retrieve details of a payment charge',
      inputSchema: {
        type: 'object',
        properties: {
          chargeId: {
            type: 'string',
            description: 'The ID of the charge to retrieve'
          }
        },
        required: ['chargeId']
      }
    },

    {
      name: 'list_charges',
      description: 'List all payment charges',
      inputSchema: {
        type: 'object',
        properties: {
          startAfter: {
            type: 'string',
            description: 'Pagination cursor - start after this charge ID'
          }
        }
      }
    },

    {
      name: 'capture_charge',
      description: 'Capture a previously authorized charge',
      inputSchema: {
        type: 'object',
        properties: {
          chargeId: {
            type: 'string',
            description: 'The ID of the charge to capture'
          },
          amount: {
            type: 'integer',
            description: 'Amount to capture in cents (must be <= authorized amount)'
          }
        },
        required: ['chargeId', 'amount']
      }
    },

    {
      name: 'void_charge',
      description: 'Void an authorized charge',
      inputSchema: {
        type: 'object',
        properties: {
          chargeId: {
            type: 'string',
            description: 'The ID of the charge to void'
          }
        },
        required: ['chargeId']
      }
    },

    {
      name: 'refund_charge',
      description: 'Refund a captured charge',
      inputSchema: {
        type: 'object',
        properties: {
          chargeId: {
            type: 'string',
            description: 'The ID of the charge to refund'
          },
          amount: {
            type: 'integer',
            description: 'Amount to refund in cents'
          }
        },
        required: ['chargeId']
      }
    },

    {
      name: 'verify_charge',
      description: 'Verify a charge using a confirmation ID and OTP from the provider',
      inputSchema: {
        type: 'object',
        properties: {
          chargeId: {
            type: 'string',
            description: 'The ID of the charge to verify'
          },
          confirmation_id: {
            type: 'string',
            description: 'Confirmation ID data from the provider'
          },
          otp: {
            type: 'string',
            description: 'One-time pin from the provider'
          }
        },
        required: ['chargeId', 'confirmation_id', 'otp']
      }
    },

    // Checkout Sessions
    {
      name: 'create_checkout_session',
      description: 'Create a checkout session for payment collection',
      inputSchema: {
        type: 'object',
        properties: {
          currency: {
            type: 'string',
            enum: ['php'],
            description: 'Three-letter ISO currency code'
          },
          cancel_url: {
            type: 'string',
            description: 'URL to redirect on payment cancellation'
          },
          success_url: {
            type: 'string',
            description: 'URL to redirect on payment success'
          },
          line_items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Item name' },
                quantity: { type: 'integer', description: 'Item quantity' },
                amount: { type: 'integer', description: 'Item amount in cents' },
                description: { type: 'string', description: 'Item description' }
              },
              required: ['name', 'quantity', 'amount']
            },
            description: 'List of items being purchased'
          },
          mode: {
            type: 'string',
            enum: ['payment', 'setup', 'subscription', 'save_card'],
            description: 'The payment mode'
          },
          payment_method_types: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['card', 'gcash', 'maya', 'paymaya', 'bpi', 'alipay', 'unionpay', 'wechat', 'grabpay', 'instapay', 'qrph']
            },
            description: 'Allowed payment methods'
          },
          customer_email: {
            type: 'string',
            description: 'Customer email address'
          },
          customer_name: {
            type: 'string',
            description: 'Customer name'
          }
        },
        required: ['currency', 'cancel_url', 'success_url', 'line_items', 'mode', 'payment_method_types']
      }
    },

    {
      name: 'get_checkout_session',
      description: 'Retrieve details of a checkout session',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            description: 'The ID of the checkout session'
          }
        },
        required: ['sessionId']
      }
    },

    {
      name: 'list_checkout_sessions',
      description: 'List all checkout sessions',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },

    {
      name: 'expire_checkout_session',
      description: 'Manually expire a checkout session',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            description: 'The ID of the checkout session to expire'
          }
        },
        required: ['sessionId']
      }
    },

    {
      name: 'capture_checkout_session',
      description: 'Capture an authorized checkout session',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            description: 'The ID of the checkout session to capture'
          }
        },
        required: ['sessionId']
      }
    },

    // Payment Requests
    {
      name: 'create_payment_request',
      description: 'Create an invoice-style payment request',
      inputSchema: {
        type: 'object',
        properties: {
          currency: {
            type: 'string',
            enum: ['PHP'],
            description: 'Three-letter ISO currency code'
          },
          customer: {
            type: 'string',
            description: 'Customer ID'
          },
          delivery_methods: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['email', 'sms']
            },
            description: 'How to deliver the payment request'
          },
          line_items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Item name' },
                quantity: { type: 'integer', description: 'Item quantity' },
                amount: { type: 'integer', description: 'Item amount in cents' },
                description: { type: 'string', description: 'Item description' }
              },
              required: ['name', 'quantity', 'amount']
            },
            description: 'List of items being billed'
          },
          payment_method_types: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['card', 'gcash', 'maya', 'paymaya', 'bpi', 'alipay', 'unionpay', 'wechat', 'grabpay', 'instapay', 'qrph']
            },
            description: 'Allowed payment methods'
          },
          message: {
            type: 'string',
            description: 'Custom message for the payment request'
          }
        },
        required: ['currency', 'delivery_methods', 'line_items', 'payment_method_types']
      }
    },

    {
      name: 'get_payment_request',
      description: 'Retrieve details of a payment request',
      inputSchema: {
        type: 'object',
        properties: {
          requestId: {
            type: 'string',
            description: 'The ID of the payment request'
          }
        },
        required: ['requestId']
      }
    },

    {
      name: 'list_payment_requests',
      description: 'List payment requests with optional filters',
      inputSchema: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            description: 'Page number for pagination'
          },
          limit: {
            type: 'integer',
            description: 'Number of items per page'
          },
          status: {
            type: 'string',
            enum: ['open', 'paid', 'voided'],
            description: 'Filter by payment request status'
          }
        }
      }
    },

    {
      name: 'void_payment_request',
      description: 'Void a payment request',
      inputSchema: {
        type: 'object',
        properties: {
          requestId: {
            type: 'string',
            description: 'The ID of the payment request to void'
          },
          reason: {
            type: 'string',
            description: 'Reason for voiding the payment request'
          }
        },
        required: ['requestId', 'reason']
      }
    },

    {
      name: 'resend_payment_request',
      description: 'Resend a payment request to the customer',
      inputSchema: {
        type: 'object',
        properties: {
          requestId: {
            type: 'string',
            description: 'The ID of the payment request to resend'
          }
        },
        required: ['requestId']
      }
    },

    // Payment Links
    {
      name: 'create_payment_link',
      description: 'Create a shareable payment link',
      inputSchema: {
        type: 'object',
        properties: {
          allow_adjustable_quantity: {
            type: 'boolean',
            description: 'Allow customers to adjust item quantities'
          },
          currency: {
            type: 'string',
            enum: ['PHP'],
            description: 'Three-letter ISO currency code'
          },
          internal_name: {
            type: 'string',
            description: 'Internal name for the payment link'
          },
          line_items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Item name' },
                quantity: { type: 'integer', description: 'Available quantity' },
                amount: { type: 'integer', description: 'Item amount in cents' },
                description: { type: 'string', description: 'Item description' },
                remaining: { type: 'integer', description: 'Remaining stock' }
              },
              required: ['name', 'quantity', 'amount']
            },
            description: 'List of items available for purchase'
          },
          payment_method_types: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['card', 'gcash', 'maya', 'paymaya', 'bpi', 'alipay', 'unionpay', 'wechat', 'grabpay', 'instapay', 'qrph']
            },
            description: 'Allowed payment methods'
          },
          description: {
            type: 'string',
            description: 'Description of the payment link'
          },
          redirect_url: {
            type: 'string',
            description: 'URL to redirect after successful payment'
          }
        },
        required: ['allow_adjustable_quantity', 'currency', 'internal_name', 'line_items', 'payment_method_types']
      }
    },

    {
      name: 'get_payment_link',
      description: 'Retrieve details of a payment link',
      inputSchema: {
        type: 'object',
        properties: {
          linkId: {
            type: 'string',
            description: 'The ID of the payment link'
          }
        },
        required: ['linkId']
      }
    },

    {
      name: 'list_payment_links',
      description: 'List payment links with optional filters',
      inputSchema: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            description: 'Page number for pagination'
          },
          limit: {
            type: 'integer',
            description: 'Number of items per page'
          },
          status: {
            type: 'string',
            enum: ['active', 'deactivated'],
            description: 'Filter by payment link status'
          }
        }
      }
    },

    {
      name: 'update_payment_link',
      description: 'Update a payment link',
      inputSchema: {
        type: 'object',
        properties: {
          linkId: {
            type: 'string',
            description: 'The ID of the payment link to update'
          },
          allow_adjustable_quantity: {
            type: 'boolean',
            description: 'Allow customers to adjust item quantities'
          }
        },
        required: ['linkId']
      }
    },

    {
      name: 'activate_payment_link',
      description: 'Activate a deactivated payment link',
      inputSchema: {
        type: 'object',
        properties: {
          linkId: {
            type: 'string',
            description: 'The ID of the payment link to activate'
          }
        },
        required: ['linkId']
      }
    },

    {
      name: 'deactivate_payment_link',
      description: 'Deactivate an active payment link',
      inputSchema: {
        type: 'object',
        properties: {
          linkId: {
            type: 'string',
            description: 'The ID of the payment link to deactivate'
          }
        },
        required: ['linkId']
      }
    }
  ];
}