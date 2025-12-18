import Razorpay from 'razorpay';
import crypto from 'crypto';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import { Address } from '../models/Address.js';
import { Product } from '../models/product.js';
import { KidsClothing } from '../models/KidsClothing.js';
import { Footwear } from '../models/Footwear.js';
import { KidsAccessories } from '../models/KidsAccessories.js';
import { BabyCare } from '../models/BabyCare.js';
import { Toys } from '../models/Toys.js';

const getClient = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || '';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || '';
  if (!key_id || !key_secret) return null;
  return { client: new Razorpay({ key_id, key_secret }), key_id, key_secret };
};

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body || {};
    const rupees = Number(amount);
    if (!rupees || Number.isNaN(rupees) || rupees <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    const ctx = getClient();
    if (!ctx) {
      return res.status(500).json({ error: 'Razorpay keys not configured on server' });
    }

    const options = {
      amount: Math.round(rupees * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes,
    };

    const order = await ctx.client.orders.create(options);
    return res.json({ order, key: ctx.key_id });
  } catch (err) {
    console.error('Razorpay createOrder error:', err?.message || err);
    if (err?.error?.description) console.error('Razorpay API:', err.error.description);
    return res.status(500).json({ error: 'Failed to create order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const ctx = getClient();
    if (!ctx) {
      return res.status(500).json({ error: 'Server secret missing' });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', ctx.key_secret).update(payload).digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Manually populate products from all collections
    const items = await Promise.all(
      cart.items.map(async (i) => {
        const product = await findProductInAllCollections(i.product);
        if (!product) {
          throw new Error(`Product ${i.product} not found`);
        }
        
        let base = 0;
        if (product && typeof product.price === 'number') {
          base = Number(product.price) || 0;
        } else {
          const mrp = Number(product?.mrp) || 0;
          const discountPercent = Number(product?.discountPercent) || 0;
          base = Math.round(mrp - (mrp * discountPercent) / 100) || 0;
        }
        
        return { 
          product: product._id, 
          quantity: i.quantity, 
          price: base,
          size: i.size || undefined // Include size if available
        };
      })
    );
    
    const amount = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    // Load user's current address to snapshot into the order
    let shippingAddress = null;
    try {
      const addr = await Address.findOne({ userId });
      if (addr) {
        const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
        shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
      }
    } catch {}

    const order = await Order.create({
      user: userId,
      items,
      amount,
      currency: 'INR',
      status: 'paid',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      shippingAddress,
    });

    cart.items = [];
    await cart.save();

    return res.json({ success: true, order });
  } catch (err) {
    console.error('Razorpay verifyPayment error:', err?.message || err);
    return res.status(500).json({ error: 'Verification failed' });
  }
};

// Helper function to find product in any collection (used by both verifyPayment and createCodOrder)
async function findProductInAllCollections(productId) {
  const collections = [
    { model: Product, name: 'Product' },
    { model: KidsClothing, name: 'KidsClothing' },
    { model: Footwear, name: 'Footwear' },
    { model: KidsAccessories, name: 'KidsAccessories' },
    { model: BabyCare, name: 'BabyCare' },
    { model: Toys, name: 'Toys' },
  ];

  for (const { model } of collections) {
    try {
      const product = await model.findById(productId);
      if (product) {
        return product;
      }
    } catch (err) {
      // Continue to next collection
    }
  }
  return null;
}

export const createCodOrder = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Manually populate products from all collections
    const items = await Promise.all(
      cart.items.map(async (i) => {
        const product = await findProductInAllCollections(i.product);
        if (!product) {
          throw new Error(`Product ${i.product} not found`);
        }
        
        let base = 0;
        if (product && typeof product.price === 'number') {
          base = Number(product.price) || 0;
        } else {
          const mrp = Number(product?.mrp) || 0;
          const discountPercent = Number(product?.discountPercent) || 0;
          base = Math.round(mrp - (mrp * discountPercent) / 100) || 0;
        }
        
        return { 
          product: product._id, 
          quantity: i.quantity, 
          price: base,
          size: i.size || undefined
        };
      })
    );
    
    const amount = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    // Load user's current address to snapshot into the order
    let shippingAddress = null;
    try {
      const addr = await Address.findOne({ userId });
      if (addr) {
        const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
        shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
      }
    } catch (err) {
      console.error('Error loading address:', err);
    }

    const order = await Order.create({
      user: userId,
      items,
      amount,
      currency: 'INR',
      status: 'created', // COD orders start as 'created', not 'paid'
      paymentMethod: 'COD', // Add payment method field
      shippingAddress,
    });

    cart.items = [];
    await cart.save();

    return res.json({ success: true, order });
  } catch (err) {
    console.error('COD order creation error:', err?.message || err);
    return res.status(500).json({ error: err.message || 'Failed to create COD order' });
  }
};
