import { Toys } from '../models/Toys.js';

// Helper function to normalize subcategory names
const normalizeSubcategory = (subcategory) => {
  if (!subcategory) return '';
  return subcategory.replace(/-/g, ' ').trim().toLowerCase();
};

// Helper function to process image URLs
const processImages = (productObj) => {
  const baseUrl = process.env.BASE_URL || 
                 process.env.BACKEND_URL || 
                 (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
  
  const ensureAbsoluteUrl = (url) => {
    if (!url || typeof url !== 'string') return url;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      return url;
    }
    if (url.includes('cloudinary.com') || url.includes('amazonaws.com') || url.includes('cdn')) {
      if (!url.startsWith('http')) {
        return `https://${url}`;
      }
      return url;
    }
    if (baseUrl) {
      return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
    }
    return url;
  };
  
  if (productObj.images) {
    if (Array.isArray(productObj.images)) {
      const imagesObj = {};
      productObj.images.forEach((img, index) => {
        if (img && img.url) {
          imagesObj[`image${index + 1}`] = ensureAbsoluteUrl(img.url);
        }
      });
      if (Object.keys(imagesObj).length > 0) {
        productObj.images = imagesObj;
      }
    } else if (typeof productObj.images === 'object') {
      const processedImages = {};
      ['image1', 'image2', 'image3'].forEach(key => {
        if (productObj.images[key]) {
          processedImages[key] = ensureAbsoluteUrl(productObj.images[key]);
        }
      });
      productObj.images = processedImages;
    }
  }
  
  return productObj;
};

// Get all toys products or filter by subcategory
export const getToysProducts = async (req, res) => {
  try {
    const rawSubcategory = (req.query.subcategory || req.query.category || '').toString();
    const subcategory = normalizeSubcategory(rawSubcategory);
    
    // Base query: Match toys category OR toy-related terms
    const baseCategoryQuery = {
      $or: [
        { category: 'toys' },
        { category: { $regex: /toy|game|puzzle|doll|car|action figure/i } }
      ]
    };
    
    let query = baseCategoryQuery;
    
    if (subcategory) {
      // If subcategory is provided, match it in subcategory field OR category field
      query = {
        $and: [
          baseCategoryQuery,
          {
            $or: [
              { subcategory: { $regex: new RegExp(subcategory, 'i') } },
              { category: { $regex: new RegExp(subcategory, 'i') } }
            ]
          }
        ]
      };
    }
    
    // Additional filters
    if (req.query.toyType) {
      if (query.$and) {
        query.$and.push({ 'product_info.toyType': { $regex: new RegExp(req.query.toyType, 'i') } });
      } else {
        query['product_info.toyType'] = { $regex: new RegExp(req.query.toyType, 'i') };
      }
    }
    if (req.query.batteryRequired !== undefined) {
      if (query.$and) {
        query.$and.push({ 'product_info.batteryRequired': req.query.batteryRequired === 'true' });
      } else {
        query['product_info.batteryRequired'] = req.query.batteryRequired === 'true';
      }
    }
    if (req.query.ageGroup) {
      if (query.$and) {
        query.$and.push({ 'product_info.ageGroup': { $regex: new RegExp(req.query.ageGroup, 'i') } });
      } else {
        query['product_info.ageGroup'] = { $regex: new RegExp(req.query.ageGroup, 'i') };
      }
    }
    
    console.log('Toys query:', JSON.stringify(query, null, 2));
    const products = await Toys.find(query).sort({ createdAt: -1 });
    console.log(`Found ${products.length} products in Toys collection`);
    
    // Process images
    const processedProducts = products.map(product => {
      const productObj = product.toObject();
      return processImages(productObj);
    });
    
    res.json(processedProducts);
  } catch (error) {
    console.error('Error fetching toys products:', error);
    res.status(500).json({ 
      message: 'Error fetching toys products', 
      error: error.message 
    });
  }
};

// Get single product by ID
export const getToysProductById = async (req, res) => {
  try {
    const product = await Toys.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const productObj = product.toObject();
    const processedProduct = processImages(productObj);
    
    res.json(processedProduct);
  } catch (error) {
    console.error('Error fetching toys product:', error);
    res.status(500).json({ 
      message: 'Error fetching toys product', 
      error: error.message 
    });
  }
};
