import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@toplegends.co" },
    update: {},
    create: {
      name: "Admin Top Legends",
      email: "admin@toplegends.co",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "camisetas-club" },
      update: {},
      create: { name: "Camisetas de Club", slug: "camisetas-club", description: "Camisetas de clubes nacionales e internacionales" },
    }),
    prisma.category.upsert({
      where: { slug: "camisetas-seleccion" },
      update: {},
      create: { name: "Camisetas de Selección", slug: "camisetas-seleccion", description: "Camisetas de selecciones nacionales" },
    }),
    prisma.category.upsert({
      where: { slug: "camisetas-retro" },
      update: {},
      create: { name: "Camisetas Retro", slug: "camisetas-retro", description: "Camisetas retro e históricas" },
    }),
    prisma.category.upsert({
      where: { slug: "uniformes" },
      update: {},
      create: { name: "Uniformes Completos", slug: "uniformes", description: "Uniformes completos para equipos" },
    }),
    prisma.category.upsert({
      where: { slug: "accesorios" },
      update: {},
      create: { name: "Accesorios", slug: "accesorios", description: "Accesorios deportivos de fútbol" },
    }),
  ]);

  const teams = await Promise.all([
    prisma.team.upsert({
      where: { slug: "atletico-nacional" },
      update: {},
      create: { name: "Atlético Nacional", slug: "atletico-nacional", country: "Colombia", league: "Liga BetPlay" },
    }),
    prisma.team.upsert({
      where: { slug: "millonarios" },
      update: {},
      create: { name: "Millonarios", slug: "millonarios", country: "Colombia", league: "Liga BetPlay" },
    }),
    prisma.team.upsert({
      where: { slug: "america-de-cali" },
      update: {},
      create: { name: "América de Cali", slug: "america-de-cali", country: "Colombia", league: "Liga BetPlay" },
    }),
    prisma.team.upsert({
      where: { slug: "barcelona" },
      update: {},
      create: { name: "Barcelona FC", slug: "barcelona", country: "España", league: "La Liga" },
    }),
    prisma.team.upsert({
      where: { slug: "real-madrid" },
      update: {},
      create: { name: "Real Madrid", slug: "real-madrid", country: "España", league: "La Liga" },
    }),
    prisma.team.upsert({
      where: { slug: "manchester-city" },
      update: {},
      create: { name: "Manchester City", slug: "manchester-city", country: "Inglaterra", league: "Premier League" },
    }),
    prisma.team.upsert({
      where: { slug: "colombia" },
      update: {},
      create: { name: "Selección Colombia", slug: "colombia", country: "Colombia" },
    }),
    prisma.team.upsert({
      where: { slug: "argentina" },
      update: {},
      create: { name: "Selección Argentina", slug: "argentina", country: "Argentina" },
    }),
    prisma.team.upsert({
      where: { slug: "brasil" },
      update: {},
      create: { name: "Selección Brasil", slug: "brasil", country: "Brasil" },
    }),
  ]);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const sampleProducts = [
    {
      name: "Camiseta Atlético Nacional 2024",
      slug: "camiseta-atletico-nacional-2024",
      description: "Camiseta oficial del Atlético Nacional temporada 2024. Confeccionada en material transpirable de alta calidad. Ideal para usar en la cancha o para coleccionar.",
      price: 189900,
      comparePrice: 249900,
      sku: "NAC-2024-HOME",
      categorySlug: "camisetas-club",
      teamSlug: "atletico-nacional",
      type: "CLUB",
      season: "2024",
    },
    {
      name: "Camiseta Millonarios 2024",
      slug: "camiseta-millonarios-2024",
      description: "Camiseta oficial de Millonarios FC temporada 2024. Diseño clásico con los colores tradicionales del club.",
      price: 179900,
      sku: "MIL-2024-HOME",
      categorySlug: "camisetas-club",
      teamSlug: "millonarios",
      type: "CLUB",
      season: "2024",
    },
    {
      name: "Camiseta Retro Selección Colombia 1990",
      slug: "camiseta-retro-colombia-1990",
      description: "Edición retro de la camiseta de la Selección Colombia utilizada en el Mundial de Italia 1990. Un clásico para coleccionistas.",
      price: 249900,
      comparePrice: 299900,
      sku: "COL-RETRO-1990",
      categorySlug: "camisetas-retro",
      teamSlug: "colombia",
      type: "RETRO",
      season: "1990",
    },
    {
      name: "Camiseta Selección Argentina 2024",
      slug: "camiseta-argentina-2024",
      description: "Camiseta oficial de la Selección Argentina campeona del mundo. Tercera estrella incluida.",
      price: 219900,
      sku: "ARG-2024-HOME",
      categorySlug: "camisetas-seleccion",
      teamSlug: "argentina",
      type: "SELECTION",
      season: "2024",
    },
    {
      name: "Camiseta Real Madrid 2024/25",
      slug: "camiseta-real-madrid-2024",
      description: "Camiseta oficial del Real Madrid para la temporada 2024/25. Diseño moderno con tecnología de alto rendimiento.",
      price: 259900,
      comparePrice: 329900,
      sku: "RMA-2425-HOME",
      categorySlug: "camisetas-club",
      teamSlug: "real-madrid",
      type: "CLUB",
      season: "2024/25",
    },
    {
      name: "Camiseta Retro Barcelona 1999",
      slug: "camiseta-retro-barcelona-1999",
      description: "Edición retro de la camiseta del FC Barcelona temporada 1998-99. Conmemorativa del centenario del club.",
      price: 269900,
      sku: "BAR-RETRO-1999",
      categorySlug: "camisetas-retro",
      teamSlug: "barcelona",
      type: "RETRO",
      season: "1998/99",
    },
  ];

  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));
  const teamMap = new Map(teams.map((t) => [t.slug, t.id]));

  const existingCount = await prisma.product.count();
  if (existingCount > 0) {
    console.log("Products already exist, skipping product seed.");
  } else {
    for (const product of sampleProducts) {
      await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          comparePrice: product.comparePrice ?? null,
          sku: product.sku,
          categoryId: categoryMap.get(product.categorySlug) ?? null,
          teamId: teamMap.get(product.teamSlug) ?? null,
          season: product.season,
          type: product.type,
          variants: {
            create: sizes.map((size) => ({
              size,
              stock: size === "XS" ? 0 : Math.floor(Math.random() * 20) + 5,
            })),
          },
          images: {
            create: [
              { url: "/images/placeholder.svg", alt: product.name, order: 0, isPrimary: true },
              { url: "/images/placeholder.svg", alt: `${product.name} - Vista 2`, order: 1, isPrimary: false },
            ],
          },
        },
      });
    }
    console.log(`Products created: ${sampleProducts.length}`);
  }

  console.log("Seed completed successfully");
  console.log(`Admin: admin@toplegends.co / admin123`);
  console.log(`Products created: ${sampleProducts.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
