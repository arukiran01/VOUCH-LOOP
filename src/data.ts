import { VoucherCategory, Voucher } from './types';

export const CATEGORIES: VoucherCategory[] = [
  { id: '1', name: 'Electronics', icon: 'smartphone' },
  { id: '2', name: 'Fashion', icon: 'shirt' },
  { id: '3', name: 'Food & Dining', icon: 'utensils' },
  { id: '4', name: 'Travel', icon: 'plane' },
  { id: '5', name: 'Grocery', icon: 'shopping-cart' },
  { id: '6', name: 'Beauty', icon: 'sparkles' },
];

export const VOUCHERS: Voucher[] = [
  // Electronics (1)
  { id: 'v1', brand: 'Amazon Pay', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', value: 50, sellingPrice: 47, discountPercentage: 6, category: '1', sellerId: 'u1', sellerName: 'Rohan S.', expiryDate: '2026-12-31', status: 'active', description: 'Use across the entire Amazon catalog including electronics, books, household items, and more.', rating: 4.8, reviewCount: 342 },
  { id: 'v7', brand: 'Flipkart', logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg', value: 30, sellingPrice: 28, discountPercentage: 6.6, category: '1', sellerId: 'u7', sellerName: 'Sanjay P.', expiryDate: '2026-11-15', status: 'active', description: 'Shop for everything from electronics to fashion.', rating: 4.5, reviewCount: 128 },
  { id: 'v10', brand: 'Croma', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Croma_Logo.svg', value: 50, sellingPrice: 45, discountPercentage: 10, category: '1', sellerId: 'u10', sellerName: 'Gaurav K.', expiryDate: '2026-12-01', status: 'active', description: 'Upgrade your tech with Croma.', rating: 4.6, reviewCount: 89 },
  { id: 'v16', brand: 'Reliance Digital', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Reliance_Digital_Logo.svg', value: 40, sellingPrice: 36, discountPercentage: 10, category: '1', sellerId: 'u16', sellerName: 'Anita T.', expiryDate: '2026-05-30', status: 'active', description: 'Wide range of electronics and appliances.', rating: 4.2, reviewCount: 56 },

  // Fashion (2)
  { id: 'v3', brand: 'Myntra', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png', value: 20, sellingPrice: 17, discountPercentage: 15, category: '2', sellerId: 'u3', sellerName: 'Arun K.', expiryDate: '2026-10-15', status: 'active', description: 'Shop for clothing, shoes, and accessories from the biggest brands.', rating: 4.7, reviewCount: 421 },
  { id: 'v13', brand: 'Ajio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/AJIO_Logo.svg/512px-AJIO_Logo.svg.png', value: 15, sellingPrice: 13, discountPercentage: 13.3, category: '2', sellerId: 'u13', sellerName: 'Simran K.', expiryDate: '2026-10-31', status: 'active', description: 'Discover trendy styles and top fashion brands.', rating: 4.4, reviewCount: 156 },
  { id: 'v14', brand: 'Shoppers Stop', logo: 'https://upload.wikimedia.org/wikipedia/en/7/73/Shoppers_Stop_logo.svg', value: 30, sellingPrice: 25, discountPercentage: 16.6, category: '2', sellerId: 'u14', sellerName: 'Rahul M.', expiryDate: '2026-11-25', status: 'active', description: 'Shop for premium clothing, accessories, and cosmetics.', rating: 4.3, reviewCount: 92 },
  { id: 'v17', brand: 'Lifestyle', logo: 'https://i.pinimg.com/736x/87/03/49/87034928fcce97d82531d0446b1319c5.jpg', value: 25, sellingPrice: 22, discountPercentage: 12, category: '2', sellerId: 'u17', sellerName: 'Pooja R.', expiryDate: '2026-04-12', status: 'active', description: 'The best of fashion and lifestyle.', rating: 4.1, reviewCount: 45 },
  
  // Food & Dining (3)
  { id: 'v2', brand: 'Swiggy', logo: 'https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg', value: 50, sellingPrice: 42, discountPercentage: 16, category: '3', sellerId: 'u2', sellerName: 'Priya M.', expiryDate: '2026-08-30', status: 'active', description: 'Get your favorite food from local restaurants delivered.', rating: 4.9, reviewCount: 892 },
  { id: 'v5', brand: 'Zomato', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg', value: 45, sellingPrice: 40, discountPercentage: 11, category: '3', sellerId: 'u5', sellerName: 'Neha J.', expiryDate: '2026-11-20', status: 'active', description: 'Enjoy delicious meals at the finest restaurants.', rating: 4.8, reviewCount: 753 },
  { id: 'v12', brand: 'PVR Cinemas', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/PVR_Cinemas_logo.svg', value: 50, sellingPrice: 40, discountPercentage: 20, category: '3', sellerId: 'u12', sellerName: 'Karan J.', expiryDate: '2026-07-20', status: 'active', description: 'Enjoy the latest movies with popcorn and drinks.', rating: 4.5, reviewCount: 231 }, // Put PVR in food/dining or Entertainment, but 3 works for now
  { id: 'v18', brand: 'Domino\'s', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Domino%27s_pizza_logo.svg', value: 30, sellingPrice: 24, discountPercentage: 20, category: '3', sellerId: 'u18', sellerName: 'Ravi T.', expiryDate: '2026-06-15', status: 'active', description: 'The best pizzas in town.', rating: 4.6, reviewCount: 412 },

  // Travel (4)
  { id: 'v4', brand: 'MakeMyTrip', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/MakeMyTrip_Logo.png', value: 50, sellingPrice: 44, discountPercentage: 12, category: '4', sellerId: 'u4', sellerName: 'Vikram B.', expiryDate: '2026-09-01', status: 'active', description: 'Book flights, hotels, and holiday packages.', rating: 4.4, reviewCount: 189 },
  { id: 'v9', brand: 'Uber', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png', value: 20, sellingPrice: 18, discountPercentage: 10, category: '4', sellerId: 'u9', sellerName: 'Akash R.', expiryDate: '2026-08-15', status: 'active', description: 'Request a ride, hop in, and go.', rating: 4.7, reviewCount: 532 },
  { id: 'v15', brand: 'Cleartrip', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Cleartrip_logo.svg/512px-Cleartrip_logo.svg.png', value: 50, sellingPrice: 42, discountPercentage: 16, category: '4', sellerId: 'u15', sellerName: 'Anita H.', expiryDate: '2026-08-05', status: 'active', description: 'Book flights and hotels with ease.', rating: 4.2, reviewCount: 67 },
  { id: 'v19', brand: 'Ola', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Ola_Cabs_logo.svg/512px-Ola_Cabs_logo.svg.png', value: 50, sellingPrice: 42, discountPercentage: 16, category: '4', sellerId: 'u19', sellerName: 'Tarun M.', expiryDate: '2026-11-10', status: 'active', description: 'Everyday cabs and rides.', rating: 4.3, reviewCount: 321 },

  // Grocery (5)
  { id: 'v6', brand: 'Blinkit', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Blinkit-yellow-app-icon.svg', value: 25, sellingPrice: 24, discountPercentage: 4, category: '5', sellerId: 'u6', sellerName: 'Rahul D.', expiryDate: '2026-07-25', status: 'active', description: 'Get groceries and essentials delivered in 10 minutes.', rating: 4.8, reviewCount: 945 },
  { id: 'v11', brand: 'BigBasket', logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Bigbasket_logo.png', value: 50, sellingPrice: 46, discountPercentage: 8, category: '5', sellerId: 'u11', sellerName: 'Meghna T.', expiryDate: '2026-09-30', status: 'active', description: 'Order your fresh fruits, veggies, and daily essentials online.', rating: 4.6, reviewCount: 423 },
  { id: 'v20', brand: 'Zepto', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Zepto_Logo.svg/512px-Zepto_Logo.svg.png', value: 30, sellingPrice: 27, discountPercentage: 10, category: '5', sellerId: 'u20', sellerName: 'Kunal L.', expiryDate: '2026-03-25', status: 'active', description: '10-minute grocery delivery.', rating: 4.7, reviewCount: 654 },

  // Beauty (6)
  { id: 'v8', brand: 'Nykaa', logo: 'https://upload.wikimedia.org/wikipedia/en/8/87/Nykaa_Logo.svg', value: 50, sellingPrice: 45, discountPercentage: 10, category: '6', sellerId: 'u8', sellerName: 'Divya S.', expiryDate: '2027-01-10', status: 'active', description: 'Your one-stop destination for cosmetics, skincare, haircare.', rating: 4.9, reviewCount: 882 },
  { id: 'v21', brand: 'Purplle', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Purplle_Logo.png/512px-Purplle_Logo.png', value: 15, sellingPrice: 13, discountPercentage: 13.3, category: '6', sellerId: 'u21', sellerName: 'Sneha P.', expiryDate: '2026-08-30', status: 'active', description: 'Online beauty and personal care.', rating: 4.5, reviewCount: 234 },
  { id: 'v22', brand: 'Kama Ayurveda', logo: 'https://1000logos.net/wp-content/uploads/2023/10/Kama-Ayurveda-Logo.jpg', value: 30, sellingPrice: 25, discountPercentage: 16.6, category: '6', sellerId: 'u22', sellerName: 'Anita H.', expiryDate: '2026-12-15', status: 'active', description: 'Authentic Ayurvedic products.', rating: 4.7, reviewCount: 156 }
];
