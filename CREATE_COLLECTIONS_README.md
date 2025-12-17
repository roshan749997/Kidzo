# Create Category Collections - Instructions

## Problem
MongoDB में category-specific collections (KidsClothing, Footwear, KidsAccessories, BabyCare, Toys) automatically नहीं बनते हैं जब तक पहली document insert नहीं होती।

## Solution
एक script बनाई गई है जो सभी collections create करती है।

## How to Run

### Option 1: Using npm script (Recommended)
```bash
cd backend
npm run create-collections
```

### Option 2: Direct node command
```bash
cd backend
node scripts/create-collections.js
```

### Option 3: With environment file
```bash
cd backend
node --env-file=.env scripts/create-collections.js
```

## What the Script Does

1. ✅ Database से connect करता है
2. ✅ हर category के लिए collection check करता है
3. ✅ अगर collection नहीं है, तो एक dummy document insert करके collection create करता है
4. ✅ Dummy document को immediately delete कर देता है
5. ✅ सभी collections की list show करता है

## Expected Output

```
Connecting to database...
✅ Connected to database

Creating category-specific collections...

Creating collection: kidsclothings
✅ Collection kidsclothings created
✅ Dummy document deleted from kidsclothings

Creating collection: footwears
✅ Collection footwears created
✅ Dummy document deleted from footwears

Creating collection: kidsaccessories
✅ Collection kidsaccessories created
✅ Dummy document deleted from kidsaccessories

Creating collection: babycares
✅ Collection babycares created
✅ Dummy document deleted from babycares

Creating collection: toys
✅ Collection toys created
✅ Dummy document deleted from toys

✅ All collections created successfully!

📋 All collections in database:
  - addresses
  - carts
  - categories
  - db
  - orders
  - products
  - users
  - wishlists
  - kidsclothings
  - footwears
  - kidsaccessories
  - babycares
  - toys
```

## Collections Created

After running the script, these collections will be created in MongoDB:

1. **kidsclothings** - Kids Clothing products
2. **footwears** - Footwear products
3. **kidsaccessories** - Kids Accessories products
4. **babycares** - Baby Care products
5. **toys** - Toys products

## Notes

- Script automatically checks if collections already exist
- Safe to run multiple times - won't create duplicates
- Dummy documents are automatically deleted
- Collections will have proper indexes as defined in models

## Troubleshooting

### Error: Cannot find module
Make sure you're in the `backend` directory:
```bash
cd backend
npm run create-collections
```

### Error: MongoDB connection failed
Check your `.env` file has `MONGODB_URI` set:
```bash
MONGODB_URI=your_mongodb_connection_string
```

### Collections still not showing
1. Check MongoDB Atlas dashboard
2. Refresh the collections list
3. Make sure script ran successfully
4. Check MongoDB connection string is correct

## Alternative: Create Collections Manually

If the script doesn't work, you can create collections manually:

1. Go to MongoDB Atlas
2. Click "Create Collection"
3. Database: `Kidzoo` (or your database name)
4. Collection name: `kidsclothings`
5. Repeat for: `footwears`, `kidsaccessories`, `babycares`, `toys`

## After Creating Collections

Once collections are created:
- ✅ Category-specific endpoints will work
- ✅ Products can be added to category-specific collections
- ✅ Fast queries will work with indexes
- ✅ Frontend will automatically use category-specific endpoints


