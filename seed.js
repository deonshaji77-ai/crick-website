const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_PRODUCTS = [
  { name: "Striker Pro", basePrice: 2799, category: "Tennis Ball Bats", image: "https://images.unsplash.com/photo-1593341646782-e0be218c5e94?auto=format&fit=crop&q=80&w=600", specifications: [{key: "Weight", value: "950g"}, {key: "Edge", value: "40mm"}] },
  { name: "Gladiator Scoop", basePrice: 3555, category: "Tennis Ball Bats", image: "https://images.unsplash.com/photo-1593341646782-e0be218c5e94?auto=format&fit=crop&q=80&w=600", specifications: [{key: "Weight", value: "980g"}, {key: "Edge", value: "42mm"}] },
  { name: "Reserve Willow V1", basePrice: 20555, category: "Leather Ball Bats", image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=600", specifications: [{key: "Weight", value: "1160g"}, {key: "Edge", value: "38mm"}] },
  { name: "Classic Purist", basePrice: 26666, category: "Leather Ball Bats", image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=600", specifications: [{key: "Weight", value: "1140g"}, {key: "Edge", value: "40mm"}] },
  { name: "Pro 1.0 Batting Gloves", basePrice: 4666, category: "Batting Gloves", image: "https://images.unsplash.com/photo-1593341646782-e0be218c5e94?auto=format&fit=crop&q=80&w=600", specifications: [] },
  { name: "Pro 1.0 Thigh Pad", basePrice: 2799, category: "Batting Pads", image: "https://images.unsplash.com/photo-1593341646782-e0be218c5e94?auto=format&fit=crop&q=80&w=600", specifications: [] },
  { name: "Tour Duffle Bag", basePrice: 7555, category: "Cricket Bags", image: "https://images.unsplash.com/photo-1593341646782-e0be218c5e94?auto=format&fit=crop&q=80&w=600", specifications: [] },
  { name: "Titanium Helmet", basePrice: 9444, category: "Helmets", image: "https://images.unsplash.com/photo-1593341646782-e0be218c5e94?auto=format&fit=crop&q=80&w=600", specifications: [] }
];

async function main() {
  console.log("Seeding database...");
  for (const p of DEFAULT_PRODUCTS) {
    await prisma.product.create({
      data: {
        name: p.name,
        category: p.category,
        basePrice: p.basePrice,
        image: p.image,
        specifications: {
          create: p.specifications
        }
      }
    });
  }
  console.log("Seeding complete!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
