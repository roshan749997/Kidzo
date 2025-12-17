# Product Schema Guide for Kidzo

This guide shows the complete schema for adding products in each category.

## Universal Fields (All Products)

```javascript
{
  title: String (required),           // Product title/name
  mrp: Number (required),              // Maximum Retail Price
  discountPercent: Number (0-100),     // Discount percentage (default: 0)
  description: String,                 // Product description
  category: String (required),         // Category name (e.g., "kids-clothing", "footwear")
  categoryId: ObjectId (optional),     // Reference to Category model
  
  images: {
    image1: String (required),          // Primary product image URL
    image2: String (optional),         // Secondary image URL
    image3: String (optional)          // Tertiary image URL
  },
  
  product_info: {
    // Universal fields
    brand: String,                     // Product brand name
    manufacturer: String,               // Manufacturer name
    availableSizes: [String],          // Array of available sizes (e.g., ["S", "M", "L"] or ["7", "8", "9"])
    includedComponents: String         // What's included in the package
  }
}
```

---

## 1. Kids Clothing Products

**Category:** `kids-clothing`

```javascript
{
  title: "Kids Cotton T-Shirt",
  mrp: 599,
  discountPercent: 20,
  description: "Comfortable cotton t-shirt for kids",
  category: "kids-clothing",
  
  images: {
    image1: "https://example.com/image1.jpg",
    image2: "https://example.com/image2.jpg",
    image3: "https://example.com/image3.jpg"
  },
  
  product_info: {
    brand: "Kidzo",
    manufacturer: "Kidzo Manufacturing",
    
    // Kids Clothing specific fields
    clothingType: "T-shirt",           // Options: T-shirt, Dress, Shorts, Pants, Shirt, etc.
    gender: "Boys",                    // Options: Boys, Girls, Unisex
    ageGroup: "3-5Y",                  // Options: 0-1Y, 1-3Y, 3-5Y, 5-8Y, 8-12Y
    availableSizes: ["S", "M", "L", "XL"],
    fabric: "Cotton",                 // Material/Fabric type
    color: "Blue",                     // Product color
    
    // Universal
    includedComponents: "1 T-shirt"
  }
}
```

**Required Fields:**
- `title`, `mrp`, `category`, `images.image1`
- `product_info.clothingType`
- `product_info.gender` (recommended)
- `product_info.ageGroup` (recommended)

---

## 2. Footwear Products

**Category:** `footwear`

```javascript
{
  title: "Kids Sports Shoes",
  mrp: 1299,
  discountPercent: 15,
  description: "Comfortable sports shoes for active kids",
  category: "footwear",
  
  images: {
    image1: "https://example.com/shoe1.jpg",
    image2: "https://example.com/shoe2.jpg",
    image3: "https://example.com/shoe3.jpg"
  },
  
  product_info: {
    brand: "Kidzo",
    manufacturer: "Kidzo Footwear",
    
    // Footwear specific fields
    footwearType: "Shoes",             // Options: Shoes, Sandals, Slippers, Boots
    shoeMaterial: "Mesh",              // Upper material (e.g., Leather, Canvas, Mesh, Synthetic)
    soleMaterial: "Rubber",            // Sole material (e.g., Rubber, EVA, PU)
    availableSizes: ["7", "8", "9", "10", "11"],
    color: "Black",                    // Shoe color
    
    // Universal
    includedComponents: "1 Pair of Shoes"
  }
}
```

**Required Fields:**
- `title`, `mrp`, `category`, `images.image1`
- `product_info.footwearType`
- `product_info.availableSizes` (recommended)

---

## 3. Kids Accessories Products

**Category:** `kids-accessories`

```javascript
{
  title: "Kids Baseball Cap",
  mrp: 399,
  discountPercent: 10,
  description: "Stylish baseball cap for kids",
  category: "kids-accessories",
  
  images: {
    image1: "https://example.com/cap1.jpg",
    image2: "https://example.com/cap2.jpg"
  },
  
  product_info: {
    brand: "Kidzo",
    manufacturer: "Kidzo Accessories",
    
    // Kids Accessories specific fields
    accessoryType: "Cap",              // Options: Cap, Bag, Sunglasses, Watch, Backpack, etc.
    material: "Cotton",                // Material used (e.g., Cotton, Polyester, Plastic)
    color: "Red",                      // Accessory color
    availableSizes: ["One Size"],      // Or specific sizes if applicable
    
    // Universal
    includedComponents: "1 Cap"
  }
}
```

**Required Fields:**
- `title`, `mrp`, `category`, `images.image1`
- `product_info.accessoryType`
- `product_info.material` (recommended)

---

## 4. Baby Care Products

**Category:** `baby-care`

```javascript
{
  title: "Baby Shampoo - Gentle Formula",
  mrp: 299,
  discountPercent: 5,
  description: "Gentle shampoo for baby's delicate hair",
  category: "baby-care",
  
  images: {
    image1: "https://example.com/shampoo1.jpg",
    image2: "https://example.com/shampoo2.jpg"
  },
  
  product_info: {
    brand: "Kidzo",
    manufacturer: "Kidzo Baby Care",
    
    // Baby Care specific fields
    babyCareType: "Shampoo",           // Options: Lotion, Diaper, Shampoo, Soap, Oil, Wipes, etc.
    ageRange: "0-12 months",           // Age range (e.g., "0-6 months", "6-12 months", "12-24 months")
    safetyStandard: "Dermatologically tested", // Safety certifications (e.g., "BPA Free", "Dermatologically tested", "Hypoallergenic")
    quantity: "200ml",                 // Product quantity/size (e.g., "200ml", "100 wipes", "50g")
    color: "White",                    // Product color (if applicable)
    
    // Universal
    includedComponents: "1 Bottle"
  }
}
```

**Required Fields:**
- `title`, `mrp`, `category`, `images.image1`
- `product_info.babyCareType`
- `product_info.ageRange` (recommended)
- `product_info.quantity` (recommended)
- `product_info.safetyStandard` (recommended for baby products)

---

## 5. Toys Products

**Category:** `toys`

```javascript
{
  title: "Remote Control Car",
  mrp: 899,
  discountPercent: 25,
  description: "Fun remote control car for kids",
  category: "toys",
  
  images: {
    image1: "https://example.com/car1.jpg",
    image2: "https://example.com/car2.jpg",
    image3: "https://example.com/car3.jpg"
  },
  
  product_info: {
    brand: "Kidzo",
    manufacturer: "Kidzo Toys",
    
    // Toys specific fields
    toyType: "Car",                    // Options: Car, Puzzle, Soft Toy, Action Figure, Board Game, etc.
    batteryRequired: true,             // Boolean: Does it need batteries?
    batteryIncluded: true,             // Boolean: Are batteries included?
    ageGroup: "5-8Y",                  // Recommended age group
    color: "Red",                      // Toy color
    availableSizes: ["Medium"],        // Size if applicable
    
    // Universal
    includedComponents: "1 Car, 1 Remote Control, 2 AA Batteries"
  }
}
```

**Required Fields:**
- `title`, `mrp`, `category`, `images.image1`
- `product_info.toyType`
- `product_info.batteryRequired` (recommended)
- `product_info.batteryIncluded` (recommended if batteryRequired is true)

---

## Complete Example Schema

Here's a complete example for creating a product via API:

### API Endpoint: `POST /api/admin/products`

```javascript
// Example: Kids Clothing Product
{
  "title": "Boys Cotton T-Shirt",
  "mrp": 599,
  "discountPercent": 20,
  "description": "100% cotton t-shirt, perfect for daily wear",
  "category": "kids-clothing",
  "categoryId": "optional_category_id",
  
  "images": {
    "image1": "https://example.com/tshirt-front.jpg",
    "image2": "https://example.com/tshirt-back.jpg",
    "image3": "https://example.com/tshirt-detail.jpg"
  },
  
  "product_info": {
    "brand": "Kidzo",
    "manufacturer": "Kidzo Clothing Co.",
    "clothingType": "T-shirt",
    "gender": "Boys",
    "ageGroup": "3-5Y",
    "availableSizes": ["S", "M", "L"],
    "fabric": "Cotton",
    "color": "Blue",
    "includedComponents": "1 T-shirt"
  }
}
```

---

## Field Reference Table

| Field | Type | Required | Category | Description |
|-------|------|----------|----------|-------------|
| `title` | String | ✅ Yes | All | Product name |
| `mrp` | Number | ✅ Yes | All | Maximum Retail Price |
| `discountPercent` | Number | No | All | Discount % (0-100) |
| `description` | String | No | All | Product description |
| `category` | String | ✅ Yes | All | Category name |
| `images.image1` | String | ✅ Yes | All | Primary image URL |
| `images.image2` | String | No | All | Secondary image URL |
| `images.image3` | String | No | All | Tertiary image URL |
| `product_info.brand` | String | No | All | Brand name |
| `product_info.manufacturer` | String | No | All | Manufacturer name |
| `product_info.availableSizes` | Array | No | All | Available sizes array |
| `product_info.includedComponents` | String | No | All | What's included |
| `product_info.clothingType` | String | ✅ | Kids Clothing | Type of clothing |
| `product_info.gender` | String | ⚠️ | Kids Clothing | Boys/Girls/Unisex |
| `product_info.ageGroup` | String | ⚠️ | Kids Clothing | Age range |
| `product_info.fabric` | String | ⚠️ | Kids Clothing | Fabric type |
| `product_info.color` | String | No | All | Product color |
| `product_info.footwearType` | String | ✅ | Footwear | Type of footwear |
| `product_info.shoeMaterial` | String | ⚠️ | Footwear | Upper material |
| `product_info.soleMaterial` | String | No | Footwear | Sole material |
| `product_info.accessoryType` | String | ✅ | Accessories | Type of accessory |
| `product_info.material` | String | ⚠️ | Accessories | Material used |
| `product_info.babyCareType` | String | ✅ | Baby Care | Type of baby care product |
| `product_info.ageRange` | String | ⚠️ | Baby Care | Age range |
| `product_info.safetyStandard` | String | ⚠️ | Baby Care | Safety certifications |
| `product_info.quantity` | String | ⚠️ | Baby Care | Product quantity/size |
| `product_info.toyType` | String | ✅ | Toys | Type of toy |
| `product_info.batteryRequired` | Boolean | ⚠️ | Toys | Needs batteries? |
| `product_info.batteryIncluded` | Boolean | ⚠️ | Toys | Batteries included? |

**Legend:**
- ✅ = Required
- ⚠️ = Recommended (highly suggested for better product information)

---

## Notes

1. **Backward Compatibility**: Legacy fields (`SareeMaterial`, `SareeColor`, `shoeType`, etc.) are still supported but deprecated.

2. **Size Format**: 
   - Clothing: Use standard sizes like `["S", "M", "L", "XL"]` or age-based like `["3Y", "4Y", "5Y"]`
   - Footwear: Use numeric sizes like `["7", "8", "9", "10"]` or EU sizes like `["EU 25", "EU 26"]`
   - Accessories: Use `["One Size"]` if size doesn't matter

3. **Color Format**: Use simple color names like "Blue", "Red", "Black", etc.

4. **Images**: At minimum, provide `image1`. Additional images improve product presentation.

5. **Category Names**: Use lowercase with hyphens:
   - `kids-clothing`
   - `footwear`
   - `kids-accessories`
   - `baby-care`
   - `toys`






