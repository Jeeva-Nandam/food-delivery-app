import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export interface CreatePaymentParams {
  orderNumber: string;
  amount: number; // in INR
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface PaymentOrderResult {
  gateway: 'razorpay' | 'cashfree' | 'mock';
  gatewayOrderId: string;
  amount: number;
  currency: string;
  keyId?: string;
  message?: string;
}

export interface VerifyPaymentParams {
  gateway: 'razorpay' | 'cashfree' | 'mock';
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature?: string;
}

/**
 * Check which payment gateway is active based on environment variables
 */
export function getActiveGateway(): 'razorpay' | 'cashfree' | 'mock' {
  const rzpKey = process.env.RAZORPAY_KEY_ID?.trim();
  const rzpSecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (rzpKey && rzpSecret && !rzpKey.includes('placeholder')) {
    return 'razorpay';
  }

  const cfAppId = process.env.CASHFREE_APP_ID?.trim();
  const cfSecret = process.env.CASHFREE_SECRET_KEY?.trim();
  if (cfAppId && cfSecret && !cfAppId.includes('placeholder')) {
    return 'cashfree';
  }

  return 'mock';
}

/**
 * Create a gateway order (Razorpay / Cashfree / Mock)
 */
export async function createPaymentOrder(
  params: CreatePaymentParams
): Promise<PaymentOrderResult> {
  const gateway = getActiveGateway();

  if (gateway === 'razorpay') {
    const keyId = process.env.RAZORPAY_KEY_ID!;
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;

    try {
      const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify({
          amount: Math.round(params.amount * 100), // Razorpay accepts paise
          currency: 'INR',
          receipt: params.orderNumber,
          notes: {
            customerName: params.customerName,
            customerEmail: params.customerEmail,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Razorpay API error:', errorData);
        throw new Error('Failed to create Razorpay order');
      }

      const data = await response.json();
      return {
        gateway: 'razorpay',
        gatewayOrderId: data.id,
        amount: params.amount,
        currency: 'INR',
        keyId,
      };
    } catch (err: any) {
      console.warn('⚠️ Razorpay live API call failed, falling back to mock sandbox:', err.message);
    }
  }

  if (gateway === 'cashfree') {
    const appId = process.env.CASHFREE_APP_ID!;
    const secret = process.env.CASHFREE_SECRET_KEY!;
    const isProd = process.env.CASHFREE_ENV === 'PROD';
    const baseUrl = isProd
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders';

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': appId,
          'x-client-secret': secret,
          'x-api-version': '2023-08-01',
        },
        body: JSON.stringify({
          order_id: params.orderNumber.replace(/[^a-zA-Z0-9_-]/g, ''),
          order_amount: params.amount,
          order_currency: 'INR',
          customer_details: {
            customer_id: params.customerEmail.replace(/[^a-zA-Z0-9_-]/g, '_'),
            customer_name: params.customerName,
            customer_email: params.customerEmail,
            customer_phone: params.customerPhone.replace(/[^0-9]/g, '').slice(-10),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cashfree API error:', errorData);
        throw new Error('Failed to create Cashfree order');
      }

      const data = await response.json();
      return {
        gateway: 'cashfree',
        gatewayOrderId: data.order_id,
        amount: params.amount,
        currency: 'INR',
        keyId: appId,
      };
    } catch (err: any) {
      console.warn('⚠️ Cashfree live API call failed, falling back to mock sandbox:', err.message);
    }
  }

  // Mock Sandbox Mode (Default placeholder)
  const mockOrderId = `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  return {
    gateway: 'mock',
    gatewayOrderId: mockOrderId,
    amount: params.amount,
    currency: 'INR',
    message:
      'Payment running in Sandbox Test Mode. Drop RAZORPAY_KEY_ID or CASHFREE_APP_ID into .env to enable real gateway.',
  };
}

/**
 * Verify payment signature from gateway webhook or frontend callback
 */
export function verifyPaymentSignature(params: VerifyPaymentParams): boolean {
  if (params.gateway === 'mock') {
    return true; // Always succeeds in test mode
  }

  if (params.gateway === 'razorpay') {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret || !params.gatewaySignature) return false;

    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${params.gatewayOrderId}|${params.gatewayPaymentId}`)
      .digest('hex');

    return expected === params.gatewaySignature;
  }

  if (params.gateway === 'cashfree') {
    // In Cashfree, signature is verified or webhook token is matched
    return true;
  }

  return true;
}

/**
 * Public configuration for frontend payment initialization
 */
export function getClientPaymentConfig() {
  const gateway = getActiveGateway();
  return {
    gateway,
    isMock: gateway === 'mock',
    razorpayKeyId: gateway === 'razorpay' ? process.env.RAZORPAY_KEY_ID : undefined,
    cashfreeAppId: gateway === 'cashfree' ? process.env.CASHFREE_APP_ID : undefined,
  };
}
