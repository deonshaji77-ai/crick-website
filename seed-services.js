const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_KNOCKING = [
  {
    name: "Standard Knocking",
    price: 20,
    features: [
      { description: "Linseed Oiling (2 coats)" },
      { description: "5,000 Machine Strokes" },
      { description: "Edge & Toe Compression" }
    ]
  },
  {
    name: "Pro Match-Ready",
    price: 35,
    features: [
      { description: "Premium Oiling & Polishing" },
      { description: "10,000 Machine Strokes" },
      { description: "Hand Boning & Edging" },
      { description: "Clear Anti-Scuff Sheet Fitted" }
    ]
  }
];

const DEFAULT_REPAIRS = [
  {
    name: "Toe Binding & Repair",
    turnaroundTime: "2-3 DAYS",
    basePrice: 1500,
    imageReference: "/images/toe_repair.jpg"
  },
  {
    name: "Handle Replacement",
    turnaroundTime: "3-5 DAYS",
    basePrice: 2500,
    imageReference: "/images/handle_repair.jpg"
  },
  {
    name: "Edge Repair & Fiber Tape",
    turnaroundTime: "1-2 DAYS",
    basePrice: 800,
    imageReference: "/images/edge_repair.jpg"
  },
  {
    name: "Full Refurbishment",
    turnaroundTime: "5-7 DAYS",
    basePrice: 4000,
    imageReference: "/images/refurbishment.jpg"
  }
];

async function main() {
  console.log("Seeding services...");
  
  for (const k of DEFAULT_KNOCKING) {
    await prisma.knockingTier.create({
      data: {
        name: k.name,
        price: k.price,
        features: {
          create: k.features
        }
      }
    });
  }

  for (const r of DEFAULT_REPAIRS) {
    await prisma.repairService.create({
      data: {
        name: r.name,
        turnaroundTime: r.turnaroundTime,
        basePrice: r.basePrice,
        imageReference: r.imageReference
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
