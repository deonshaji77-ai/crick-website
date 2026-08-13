import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { addProductToFirestore } from '@/lib/firestore';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SAMPLE_PRODUCTS = [
  {
    name: 'Phantom Pro Leather Bat',
    category: 'Leather Ball Bats',
    basePrice: 15500,
    imageUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&q=80',
    specifications: [
      { key: 'Weight', value: '1150g' },
      { key: 'Edge', value: '40mm' },
      { key: 'Grade', value: 'Grade 1 English Willow' }
    ]
  },
  {
    name: 'Striker X Tennis Bat',
    category: 'Tennis Ball Bats',
    basePrice: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    specifications: [
      { key: 'Weight', value: '950g' },
      { key: 'Edge', value: '38mm' },
      { key: 'Type', value: 'Kashmir Willow' }
    ]
  },
  {
    name: 'Pro Series Batting Gloves',
    category: 'Batting Gloves',
    basePrice: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=800&q=80',
    specifications: [
      { key: 'Size', value: 'Mens' },
      { key: 'Material', value: 'Sheep Leather' }
    ]
  }
];

export async function GET() {
  try {
    const results = [];
    
    for (const product of SAMPLE_PRODUCTS) {
      // 1. Upload to Cloudinary, restricted to 'circvault-website' folder
      const uploadResult = await cloudinary.uploader.upload(product.imageUrl, {
        folder: 'circvault-website',
      });
      
      const secureUrl = uploadResult.secure_url;
      
      // 2. Save to Firestore (catch permission errors)
      let productId = 'failed_to_save';
      let firestoreError = null;
      try {
        productId = await addProductToFirestore({
          name: product.name,
          category: product.category,
          basePrice: product.basePrice,
          image: secureUrl,
          specifications: product.specifications,
        });
      } catch (err: any) {
        firestoreError = err.message;
      }
      
      results.push({
        id: productId,
        name: product.name,
        cloudinaryUrl: secureUrl,
        firestoreError
      });
    }

    return NextResponse.json({ success: true, seededProducts: results });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
