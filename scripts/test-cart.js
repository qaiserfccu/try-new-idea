(async () => {
  try {
    const prisma = require('../lib/prisma').default;
    const cart = await prisma.cart.findFirst();
    console.log('cart:', cart);
  } catch (e) {
    console.error('error:', e);
    if (e && e.meta) console.error('meta:', e.meta);
    process.exit(1);
  } finally {
    try {
      const prisma = require('../lib/prisma').default;
      await prisma.$disconnect();
    } catch {}
  }
})();