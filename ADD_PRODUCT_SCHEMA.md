# Product Addition Schema Guide

## Universal Schema (All Products)

```javascript
{
  title: String (required),              // Product name/title
  mrp: Number (required),                // Maximum Retail Price
  discountPercent: Number (0-100),       // Discount percentage (default: 0)
  description: String,                   // Product description
  category: String (required),           // Category name
  categoryId: ObjectId (optional),       // Reference to Category model
  subcategory: String (optional),       // Subcategory name
  
  images: {
    image1: String (required),          // Primary image URL
    image2: String (optional),          // Secondary image URL
    image3: String (optional)           // Tertiary image URL
  },
  
  product_info: {
    brand: String,                      // Brand name
    manufacturer: String,                // Manufacturer name
    includedComponents: String         // What's included
  }
}
```

---

## 1. Kids Clothing Products

**Category:** `"kids-clothing"`

### Complete Schema:
```javascript
{
  title: "Boys Cotton T-Shirt",
  mrp: 599,
  discountPercent: 20,
  description: "100% cotton t-shirt, perfect for daily wear",
  category: "kids-clothing",
  subcategory: "boys-cloth",  // Optional: boys-cloth, girls-cloths, winterwear
  
  images: {
    image1: "https://example.com/tshirt-front.jpg",
    image2: "https://example.com/tshirt-back.jpg",
    image3: "https://example.com/tshirt-detail.jpg"
  },
  
  product_info: {
    brand: "Kidzo",
    manufacturer: "Kidzo Clothing Co.",
    
    // Required for Kids Clothing
    clothingType: "T-shirt",            // Required: T-shirt, Dress, Shorts, Pants, Shirt, Skirt, Jacket, Sweater
    
    // Recommended
    gender: "Boys",                      // Boys, Girls, Unisex
    ageGroup: "3-5Y",                   // 0-1Y, 1-3Y, 3-5Y, 5-8Y, 8-12Y
    availableSizes: ["S", "M", "L"],    // Array of sizes
    fabric: "Cotton",                    // Fabric type
    color: "Blue",                       // Product color
    
    includedComponents: "1 T-shirt"
  }
}
```

### API Endpoint:
```
POST /api/admin/products
```

---

## 2. Footwear Products

**Category:** `"footwear"`

### Complete Schema:
```javascript
{
  title: "Kids Sports Shoes",
  mrp: 1299,
  discountPercent: 15,
  description: "Comfortable sports shoes for active kids",
  category: "footwear",
  subcategory: "boys-footwear",  // Optional: boys-footwear, girls-footwear
  
  images: {
    image1: "https://example.com/shoe1.jpg",
    image2: "https://example.com/shoe2.jpg",
    image3: "https://example.com/shoe3.jpg"
  },
  
  product_info: {
    brand: "Kidzo",
    manufacturer: "Kidzo Footwear",
    
    // Required for Footwear
    footwearType: "Shoes",              // Required: Shoes, Sandals, Slippers, Boots, Sneakers
    
    // Recommended
    shoeMaterial: "Mesh",                // Upper material: Leather, Canvas, Mesh, Synthetic, Rubber
    soleMaterial: "Rubber",              // Sole material: Rubber, EVA, PU, TPR, PVC
    availableSizes: ["7", "8", "9", "10", "11"],  // Array of sizes
    color: "Black",                      // Shoe color
    
    includedComponents: "1 Pair of Shoes"
  }
}
```

### API Endpoint:
```
POST /api/admin/products
```

---

## 3. Kids Accessories Products

**Category:** `"kids-accessories"` or `"Watches"` (both work)

### Complete Schema:
```javascript
{
  title: "Vintage Field Men's Watch - Canvas Strap",
  mrp: 3899,
  discountPercent: 25,
  description: "A rugged, military-inspired analog watch",
  category: "Watches",                  // Can be "Watches" or "kids-accessories"
  subcategory: "watches",               // Optional: watches, sunglasses
  
  images: {
    image1: "https://example.com/watch1.jpg",
    image2: "https://example.com/watch2.jpg"
  },
  
  product_info: {
    brand: "Trailblazer",
    manufacturer: "Heritage Clockworks",
    
    // Required for Kids Accessories
    accessoryType: "Watch",              // Required: Watch, Cap, Bag, Sunglasses, Backpack, Wallet, Belt
    
    // Recommended
    material: "Canvas",                  // Material: Canvas, Leather, Metal, Plastic, etc.
    color: "Olive Green",                // Accessory color
    availableSizes: ["One Size"],        // Or specific sizes if applicable
    
    // Watch-specific fields (optional, for watches)
    watchBrand: "Trailblazer",
    movementType: "Quartz",              // Quartz, Automatic, Mechanical
    caseMaterial: "Brass/Brushed Steel Finish",
    bandMaterial: "Canvas",
    waterResistance: "50m",              // 50m, 100m, 200m
    watchType: "Analog",                 // Analog, Digital, Smart Watch
    
    includedComponents: "Watch, Small Repair Kit, Warranty Card"
  }
}
```

### Important Notes:
- **Category can be "Watches"** - Admin controller automatically maps it to KidsAccessories
- **accessoryType is auto-detected** - If watch fields exist, it sets to "Watch"
- **Old watch fields still work** - watchBrand, watchType, etc. are supported

### API Endpoint:
```
POST /api/admin/products
```

---

## 4. Baby Care Products

**Category:** `"baby-care"`

### Complete Schema:
```javascript
{
  title: "Baby Shampoo - Gentle Formula",
  mrp: 299,
  discountPercent: 5,
  description: "Gentle shampoo for baby's delicate hair",
  category: "baby-care",
  subcategory: "baby-gear",             // Optional: diapers, wipes, baby-gear, baby-proofing-safety
  
  images: {
    image1: "https://example.com/shampoo1.jpg",
    image2: "https://example.com/shampoo2.jpg"
  },
  
  product_info: {
    brand: "Kidzo",
    manufacturer: "Kidzo Baby Care",
    
    // Required for Baby Care
    babyCareType: "Shampoo",            // Required: Lotion, Diaper, Shampoo, Soap, Oil, Wipes, Powder, Cream
    
    // Recommended
    ageRange: "0-12 months",             // 0-6 months, 6-12 months, 12-24 months, 0-12 months
    safetyStandard: "Dermatologically tested",  // BPA Free, Dermatologically tested, Hypoallergenic, Paraben Free
    quantity: "200ml",                   // Product quantity: 200ml, 100 wipes, 50g
    color: "White",                      // Product color (if applicable)
    
    includedComponents: "1 Bottle"
  }
}
```

### API Endpoint:
```
POST /api/admin/products
```

---

## 5. Toys Products

**Category:** `"toys"`

### Complete Schema:
```javascript
{
  title: "Remote Control Car",
  mrp: 899,
  discountPercent: 25,
  description: "Fun remote control car for kids",
  category: "toys",
  subcategory: "",                       // Optional subcategory
  
  images: {
    image1: "https://example.com/car1.jpg",
    image2: "https://example.com/car2.jpg",
    image3: "https://example.com/car3.jpg"
  },
  
  product_info: {
    brand: "Kidzo",
    manufacturer: "Kidzo Toys",
    
    // Required for Toys
    toyType: "Car",                      // Required: Car, Puzzle, Soft Toy, Action Figure, Board Game, Doll, Building Blocks, Educational Toy
    
    // Recommended
    batteryRequired: true,              // Boolean: Does it need batteries?
    batteryIncluded: true,               // Boolean: Are batteries included?
    ageGroup: "5-8Y",                   // Recommended age group
    color: "Red",                       // Toy color
    availableSizes: ["Medium"],         // Size if applicable
    
    includedComponents: "1 Car, 1 Remote Control, 2 AA Batteries"
  }
}
```

### API Endpoint:
```
POST /api/admin/products
```

---

## Quick Reference Table

| Field | Type | Required | Category | Example Values |
|-------|------|----------|----------|----------------|
| `title` | String | ✅ Yes | All | "Kids T-Shirt" |
| `mrp` | Number | ✅ Yes | All | 599 |
| `discountPercent` | Number | No | All | 0-100 |
| `description` | String | No | All | "Product description" |
| `category` | String | ✅ Yes | All | "kids-clothing", "footwear", "Watches", "baby-care", "toys" |
| `subcategory` | String | No | All | "boys-cloth", "watches", etc. |
| `images.image1` | String | ✅ Yes | All | "https://..." |
| `images.image2` | String | No | All | "https://..." |
| `images.image3` | String | No | All | "https://..." |
| `product_info.brand` | String | No | All | "Kidzo" |
| `product_info.manufacturer` | String | No | All | "Kidzo Co." |
| `product_info.clothingType` | String | ✅ | Kids Clothing | "T-shirt", "Dress", "Shorts" |
| `product_info.gender` | String | ⚠️ | Kids Clothing | "Boys", "Girls", "Unisex" |
| `product_info.ageGroup` | String | ⚠️ | Kids Clothing | "3-5Y", "5-8Y" |
| `product_info.fabric` | String | ⚠️ | Kids Clothing | "Cotton", "Polyester" |
| `product_info.color` | String | No | All | "Blue", "Red" |
| `product_info.footwearType` | String | ✅ | Footwear | "Shoes", "Sandals", "Slippers" |
| `product_info.shoeMaterial` | String | ⚠️ | Footwear | "Mesh", "Leather", "Canvas" |
| `product_info.soleMaterial` | String | No | Footwear | "Rubber", "EVA" |
| `product_info.accessoryType` | String | ✅ | Accessories | "Watch", "Cap", "Bag" |
| `product_info.material` | String | ⚠️ | Accessories | "Canvas", "Leather" |
| `product_info.babyCareType` | String | ✅ | Baby Care | "Shampoo", "Diaper", "Lotion" |
| `product_info.ageRange` | String | ⚠️ | Baby Care | "0-12 months" |
| `product_info.safetyStandard` | String | ⚠️ | Baby Care | "BPA Free", "Dermatologically tested" |
| `product_info.quantity` | String | ⚠️ | Baby Care | "200ml", "100 wipes" |
| `product_info.toyType` | String | ✅ | Toys | "Car", "Puzzle", "Soft Toy" |
| `product_info.batteryRequired` | Boolean | ⚠️ | Toys | true/false |
| `product_info.batteryIncluded` | Boolean | ⚠️ | Toys | true/false |
| `product_info.availableSizes` | Array | No | All | ["S", "M", "L"] or ["7", "8", "9"] |
| `product_info.includedComponents` | String | No | All | "1 T-shirt" |

**Legend:**
- ✅ = Required
- ⚠️ = Highly Recommended

---

## Example API Request

### Using Admin Panel or API:

```javascript
// POST /api/admin/products
{
  "title": "Vintage Field Men's Watch - Canvas Strap",
  "mrp": 3899,
  "discountPercent": 25,
  "description": "A rugged, military-inspired analog watch",
  "category": "Watches",  // Can be "Watches" or "kids-accessories"
  "subcategory": "watches",
  
  "images": {
    "image1": "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765522263/page_2_img_26_mqglgf.jpg"
  },
  
  "product_info": {
    "brand": "Trailblazer",
    "manufacturer": "Heritage Clockworks",
    "watchBrand": "Trailblazer",
    "movementType": "Quartz",
    "caseMaterial": "Brass/Brushed Steel Finish",
    "bandMaterial": "Canvas",
    "waterResistance": "50m",
    "watchType": "Analog",
    "IncludedComponents": "Watch, Small Repair Kit, Warranty Card"
  }
}
```

**Note:** Admin controller automatically:
- Maps "Watches" → KidsAccessories model
- Sets `accessoryType: "Watch"` from watch fields
- Sets `category: "kids-accessories"` automatically

---

## Category Mapping

| Input Category | Model Used | Normalized Category |
|---------------|------------|---------------------|
| `"Watches"` | KidsAccessories | `"kids-accessories"` |
| `"kids-accessories"` | KidsAccessories | `"kids-accessories"` |
| `"kids-clothing"` | KidsClothing | `"kids-clothing"` |
| `"footwear"` | Footwear | `"footwear"` |
| `"baby-care"` | BabyCare | `"baby-care"` |
| `"toys"` | Toys | `"toys"` |

---

## Common Field Values

### clothingType Options:
`"T-shirt"`, `"Dress"`, `"Shorts"`, `"Pants"`, `"Shirt"`, `"Skirt"`, `"Jacket"`, `"Sweater"`

### footwearType Options:
`"Shoes"`, `"Sandals"`, `"Slippers"`, `"Boots"`, `"Sneakers"`

### accessoryType Options:
`"Watch"`, `"Cap"`, `"Bag"`, `"Sunglasses"`, `"Backpack"`, `"Wallet"`, `"Belt"`, `"Hair Accessories"`

### babyCareType Options:
`"Lotion"`, `"Diaper"`, `"Shampoo"`, `"Soap"`, `"Oil"`, `"Wipes"`, `"Powder"`, `"Cream"`

### toyType Options:
`"Car"`, `"Puzzle"`, `"Soft Toy"`, `"Action Figure"`, `"Board Game"`, `"Doll"`, `"Building Blocks"`, `"Educational Toy"`

---

## Tips

1. **For Watches**: Use `category: "Watches"` - it automatically maps to KidsAccessories
2. **Image URLs**: Use absolute URLs (https://) for best results
3. **Sizes**: Use array format: `["S", "M", "L"]` or `["7", "8", "9"]`
4. **Required Fields**: At minimum, provide `title`, `mrp`, `category`, and `images.image1`
5. **Category-Specific Fields**: Each category has its own required field (clothingType, footwearType, etc.)

