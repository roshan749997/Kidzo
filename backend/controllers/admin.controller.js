import { Product } from '../models/product.js';
import { KidsClothing } from '../models/KidsClothing.js';
import { Footwear } from '../models/Footwear.js';
import { KidsAccessories } from '../models/KidsAccessories.js';
import { BabyCare } from '../models/BabyCare.js';
import { Toys } from '../models/Toys.js';
import Order from '../models/Order.js';
import { Address } from '../models/Address.js';

export async function createProduct(req, res) {
  try {
    const {
      title,
      mrp,
      discountPercent = 0,
      description = '',
      category,
      product_info = {},
      images = {},
      categoryId,
    } = req.body || {};

    if (!title || typeof mrp === 'undefined' || !category) {
      return res.status(400).json({ message: 'title, mrp and category are required' });
    }

    const payload = {
      title,
      mrp: Number(mrp),
      discountPercent: Number(discountPercent) || 0,
      description,
      category,
      product_info: {
        brand: product_info.brand || '',
        manufacturer: product_info.manufacturer || '',
        
        /* ---- Kids Clothing ---- */
        clothingType: product_info.clothingType || '',
        gender: product_info.gender || '',
        ageGroup: product_info.ageGroup || '',
        availableSizes: Array.isArray(product_info.availableSizes) ? product_info.availableSizes : 
                       (product_info.availableSizes ? [product_info.availableSizes] : []),
        fabric: product_info.fabric || '',
        color: product_info.color || '',
        
        /* ---- Footwear ---- */
        footwearType: product_info.footwearType || '',
        shoeMaterial: product_info.shoeMaterial || '',
        soleMaterial: product_info.soleMaterial || '',
        
        /* ---- Kids Accessories ---- */
        accessoryType: product_info.accessoryType || '',
        material: product_info.material || '',
        
        /* ---- Baby Care ---- */
        babyCareType: product_info.babyCareType || '',
        ageRange: product_info.ageRange || '',
        safetyStandard: product_info.safetyStandard || '',
        quantity: product_info.quantity || '',
        
        /* ---- Toys ---- */
        toyType: product_info.toyType || '',
        batteryRequired: product_info.batteryRequired || false,
        batteryIncluded: product_info.batteryIncluded || false,
        
        /* ---- Universal ---- */
        includedComponents: product_info.includedComponents || '',
        
        // Legacy fields for backward compatibility
        SareeLength: product_info.SareeLength || '',
        SareeMaterial: product_info.SareeMaterial || product_info.fabric || product_info.material || '',
        SareeColor: product_info.SareeColor || product_info.color || '',
        IncludedComponents: product_info.IncludedComponents || product_info.includedComponents || '',
        shoeSize: product_info.shoeSize || product_info.availableSizes?.[0] || '',
        shoeColor: product_info.shoeColor || product_info.color || '',
        shoeType: product_info.shoeType || product_info.footwearType || '',
        watchBrand: product_info.watchBrand || '',
        movementType: product_info.movementType || '',
        caseMaterial: product_info.caseMaterial || '',
        bandMaterial: product_info.bandMaterial || '',
        waterResistance: product_info.waterResistance || '',
        watchType: product_info.watchType || '',
      },
      images: {
        image1: images.image1,
        image2: images.image2,
        image3: images.image3,
      },
    };

    if (categoryId) payload.categoryId = categoryId;

    // Determine which collection to use based on category
    const categoryLower = (category || '').toLowerCase().replace(/\s+/g, '-');
    let product;
    
    if (categoryLower.includes('kids-clothing') || categoryLower.includes('clothing')) {
      product = await KidsClothing.create(payload);
    } else if (categoryLower.includes('footwear') || categoryLower.includes('shoe')) {
      product = await Footwear.create(payload);
    } else if (categoryLower.includes('kids-accessories') || categoryLower.includes('accessories') || categoryLower.includes('watch') || categoryLower.includes('sunglass')) {
      product = await KidsAccessories.create(payload);
    } else if (categoryLower.includes('baby-care') || categoryLower.includes('babycare') || categoryLower.includes('diaper') || categoryLower.includes('lotion')) {
      product = await BabyCare.create(payload);
    } else if (categoryLower.includes('toy')) {
      product = await Toys.create(payload);
    } else {
      // Default to Product collection for unknown categories
      product = await Product.create(payload);
    }
    
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    let { status, orderStatus } = req.body || {};
    const newStatus = (status || orderStatus || '').toString().toLowerCase();

    const allowed = new Set(['created','confirmed','on_the_way','delivered','failed','paid']);
    if (!allowed.has(newStatus)) {
      return res.status(400).json({ message: 'Invalid status', allowed: Array.from(allowed) });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { status: newStatus } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
}

export async function adminListProducts(req, res) {
  try {
    // Fetch products from all category collections
    const [products, kidsClothing, footwear, kidsAccessories, babyCare, toys] = await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).lean(),
      KidsClothing.find({}).sort({ createdAt: -1 }).lean(),
      Footwear.find({}).sort({ createdAt: -1 }).lean(),
      KidsAccessories.find({}).sort({ createdAt: -1 }).lean(),
      BabyCare.find({}).sort({ createdAt: -1 }).lean(),
      Toys.find({}).sort({ createdAt: -1 }).lean(),
    ]);
    
    // Combine all products
    const allProducts = [
      ...products,
      ...kidsClothing,
      ...footwear,
      ...kidsAccessories,
      ...babyCare,
      ...toys,
    ].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA; // Sort by newest first
    });
    
    return res.json(allProducts);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list products', error: err.message });
  }
}

export async function deleteProductById(req, res) {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
}

export async function adminListOrders(req, res) {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .lean();

    const userIds = Array.from(new Set(orders.map(o => String(o.user?._id)).filter(Boolean)));
    let addrMap = {};
    if (userIds.length > 0) {
      const addrs = await Address.find({ userId: { $in: userIds } }).lean();
      addrMap = Object.fromEntries(addrs.map(a => [String(a.userId), a]));
    }

    const enriched = orders.map(o => ({
      ...o,
      address: o.shippingAddress || (o.user?._id ? (addrMap[String(o.user._id)] || null) : null),
    }));

    return res.json(enriched);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list orders', error: err.message });
  }
}

export async function adminStats(req, res) {
  try {
    const [revenueAgg] = await Order.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const totalRevenue = revenueAgg?.total || 0;
    const totalOrders = revenueAgg?.count || 0;
    
    // Count products from all collections
    const [productCount, kidsClothingCount, footwearCount, kidsAccessoriesCount, babyCareCount, toysCount] = await Promise.all([
      Product.countDocuments(),
      KidsClothing.countDocuments(),
      Footwear.countDocuments(),
      KidsAccessories.countDocuments(),
      BabyCare.countDocuments(),
      Toys.countDocuments(),
    ]);
    
    const totalProducts = productCount + kidsClothingCount + footwearCount + kidsAccessoriesCount + babyCareCount + toysCount;
    
    return res.json({ totalRevenue, totalOrders, totalProducts });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load stats', error: err.message });
  }
}

export async function adminListAddresses(req, res) {
  try {
    const addrs = await Address.find({}).sort({ createdAt: -1 }).populate('userId', 'name email').lean();
    return res.json(addrs);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list addresses', error: err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { mrp, discountPercent } = req.body;

    if (typeof mrp === 'undefined' && typeof discountPercent === 'undefined') {
      return res.status(400).json({ message: 'At least one field (mrp or discountPercent) is required' });
    }

    const updates = {};
    if (typeof mrp !== 'undefined') {
      updates.mrp = Number(mrp);
    }
    if (typeof discountPercent !== 'undefined') {
      updates.discountPercent = Number(discountPercent) || 0;
    }

    // Try to update in all collections
    const collections = [
      { model: Product, name: 'Product' },
      { model: KidsClothing, name: 'KidsClothing' },
      { model: Footwear, name: 'Footwear' },
      { model: KidsAccessories, name: 'KidsAccessories' },
      { model: BabyCare, name: 'BabyCare' },
      { model: Toys, name: 'Toys' },
    ];
    
    let updatedProduct = null;
    for (const { model } of collections) {
      try {
        const result = await model.findByIdAndUpdate(
          id,
          { $set: updates },
          { new: true, runValidators: true }
        );
        if (result) {
          updatedProduct = result;
          break;
        }
      } catch (err) {
        // Continue to next collection
        continue;
      }
    }

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(updatedProduct);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
}
