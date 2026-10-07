import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Product,
  CartItem,
  Address,
  Order,
  User,
  Coupon,
  CategoryInfo,
  CustomerRoute,
  AdminRoute,
  OrderStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_ADDRESSES,
  INITIAL_USER,
  INITIAL_ORDERS,
} from '../data/mockData';

interface StoreContextType {
  // Navigation & Mode
  portalMode: 'store' | 'admin';
  setPortalMode: (mode: 'store' | 'admin') => void;
  currentRoute: CustomerRoute;
  adminRoute: AdminRoute;
  navigate: (route: CustomerRoute | string, params?: { productId?: string; orderNumber?: string }) => void;
  navigateAdmin: (route: AdminRoute) => void;
  selectedProductId: string | null;
  selectedOrderNumber: string | null;

  // Admin Auth
  isAdminAuthenticated: boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart & Pricing
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  itemsSubtotal: number;
  couponDiscount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  grandTotal: number;
  totalSavings: number;
  isGiftUnlocked: boolean;
  totalCartCount: number;

  // Auth & Addresses
  currentUser: User | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => void;
  loginWithOtp: (phone: string) => void;
  continueAsGuest: (email: string) => void;
  logout: () => void;
  selectedAddress: Address;
  setSelectedAddress: (addr: Address) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  savedAddresses: Address[];

  // Orders
  orders: Order[];
  latestPlacedOrder: Order | null;
  createOrder: (
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery',
    paymentDetails?: string,
    notes?: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Admin capabilities
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  categories: CategoryInfo[];
  addCategory: (cat: Omit<CategoryInfo, 'id'>) => void;
  toggleCategoryActive: (id: string) => void;
  customers: User[];
  updateCustomer: (id: string, updates: Partial<User>) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  isAcceptingOrders: boolean;
  toggleAcceptingOrders: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const routerNavigate = useNavigate();
  const location = useLocation();

  // Load initial states or defaults
  const [portalMode, setPortalMode] = useState<'store' | 'admin'>('store');
  const [currentRoute, setCurrentRoute] = useState<CustomerRoute>('home');
  const [adminRoute, setAdminRoute] = useState<AdminRoute>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-halwa-01');
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('mhf_admin_auth') === 'true';
  });

  const loginAdmin = (username: string, password: string): boolean => {
    if (username.trim().toLowerCase() === 'jeeva@admin' && password === 'adminadmin') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('mhf_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('mhf_admin_auth');
  };

  // Sync state with location.pathname (handles browser history popstate and back-navigation)
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentRoute('home');
      setPortalMode('store');
    } else if (path === '/cart') {
      setCurrentRoute('cart');
      setPortalMode('store');
    } else if (path === '/login') {
      setCurrentRoute('login');
      setPortalMode('store');
    } else if (path === '/checkout') {
      setCurrentRoute('checkout');
      setPortalMode('store');
    } else if (path === '/trackorder') {
      setCurrentRoute('track-order');
      setPortalMode('store');
    } else if (path.startsWith('/order/')) {
      setCurrentRoute('order-details');
      setPortalMode('store');
      const orderNum = path.replace('/order/', '');
      setSelectedOrderNumber(decodeURIComponent(orderNum));
    } else if (path.startsWith('/product/')) {
      setCurrentRoute('product-detail');
      setPortalMode('store');
      const prodId = path.replace('/product/', '');
      setSelectedProductId(decodeURIComponent(prodId));
    } else if (path.startsWith('/adminpage')) {
      setPortalMode('admin');
    } else {
      const stripped = path.replace('/', '') as CustomerRoute;
      setCurrentRoute(stripped);
      setPortalMode('store');
    }
  }, [location.pathname]);

  // Products
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<CategoryInfo[]>(INITIAL_CATEGORIES);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);

  // Cart with initial items matching Image 1
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0], // Tirunelveli Halwa (₹450)
      quantity: 1,
    },
    {
      product: INITIAL_PRODUCTS[1], // Manapparai Murukku (₹145 x 2 = ₹290)
      quantity: 2,
    },
    {
      product: INITIAL_PRODUCTS[2], // Andhra Gongura Pickle (₹175)
      quantity: 1,
    },
  ]);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(INITIAL_COUPONS[0]); // HERITAGE10 pre-applied

  // User & Auth
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address>(INITIAL_ADDRESSES[0]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<Order | null>(null);

  // Admin store status
  const [isAcceptingOrders, setIsAcceptingOrders] = useState<boolean>(true);

  // Additional mock customers for admin table
  const [customers, setCustomers] = useState<User[]>([
    INITIAL_USER,
    {
      id: 'usr-krv',
      name: 'K. R. Venkatraman',
      email: 'kr.venkatraman@outlook.com',
      phone: '+91 98455 66778',
      isVerified: true,
      role: 'customer',
      totalOrders: 4,
      totalSpent: 3120,
      rewardCoins: 25,
      addresses: [],
    },
    {
      id: 'usr-deepika',
      name: 'Deepika Nambiar',
      email: 'deepika.nambiar@gmail.com',
      phone: '+91 97451 99882',
      isVerified: true,
      role: 'customer',
      totalOrders: 9,
      totalSpent: 7840,
      rewardCoins: 120,
      addresses: [],
    },
    {
      id: 'usr-arvind',
      name: 'S. Arvind Swamy',
      email: 'arvind.swamy@gmail.com',
      phone: '+91 99890 12340',
      isVerified: true,
      role: 'customer',
      totalOrders: 3,
      totalSpent: 2650,
      rewardCoins: 30,
      addresses: [],
    },
  ]);

  // Navigation handlers
  const navigate = (route: CustomerRoute | string, params?: { productId?: string; orderNumber?: string }) => {
    setPortalMode('store');
    if (params?.productId) {
      setSelectedProductId(params.productId);
    }
    if (params?.orderNumber) {
      setSelectedOrderNumber(params.orderNumber);
    }

    let targetPath = '/';
    if (route.startsWith('/')) {
      targetPath = route;
    } else {
      switch (route) {
        case 'home':
          targetPath = '/';
          break;
        case 'cart':
          targetPath = '/cart';
          break;
        case 'auth-check':
        case 'login':
          targetPath = '/login';
          break;
        case 'delivery-address':
        case 'checkout':
          targetPath = '/checkout';
          break;
        case 'track-order':
          targetPath = '/trackorder';
          break;
        case 'order-details':
          targetPath = params?.orderNumber
            ? `/order/${encodeURIComponent(params.orderNumber.replace(/^#/, ''))}`
            : '/trackorder';
          break;
        case 'order-success':
          targetPath = params?.orderNumber
            ? `/order/${encodeURIComponent(params.orderNumber.replace(/^#/, ''))}`
            : '/order-success';
          break;
        case 'product-detail':
          targetPath = params?.productId ? `/product/${params.productId}` : '/';
          break;
        case 'shop-all':
        case 'regional-sweets':
        case 'savouries-and-mixtures':
        case 'handcrafted-pickles':
        case 'millet-and-health':
        case 'about-us':
        case 'contact':
          targetPath = `/${route}`;
          break;
        default:
          targetPath = '/';
      }
    }

    setCurrentRoute(route as CustomerRoute);
    routerNavigate(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateAdmin = (route: AdminRoute) => {
    setAdminRoute(route);
    setPortalMode('admin');
    routerNavigate('/adminpage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // Cart Handlers
  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    if (itemsSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Requires minimum order of ₹${found.minOrder}`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const freeShippingThreshold = 699;
  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const rawCouponDiscount = appliedCoupon
    ? (itemsSubtotal * appliedCoupon.discountPercent) / 100
    : 0;
  const couponDiscount = appliedCoupon
    ? Math.min(rawCouponDiscount, appliedCoupon.maxDiscount)
    : 0;

  const shippingFee = itemsSubtotal >= freeShippingThreshold || itemsSubtotal === 0 ? 0 : 80;
  const grandTotal = Math.max(0, itemsSubtotal - couponDiscount + shippingFee);

  const productMarkupSavings = cartItems.reduce(
    (sum, item) => sum + Math.max(0, item.product.originalPrice - item.product.price) * item.quantity,
    0
  );
  const totalSavings = couponDiscount + productMarkupSavings;
  const isGiftUnlocked = itemsSubtotal >= freeShippingThreshold;
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Auth handlers
  const loginWithGoogle = () => {
    setIsAuthenticated(true);
    setCurrentUser(INITIAL_USER);
  };

  const loginWithOtp = (phone: string) => {
    setIsAuthenticated(true);
    setCurrentUser({
      ...INITIAL_USER,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
    });
  };

  const continueAsGuest = (email: string) => {
    setIsAuthenticated(true);
    setCurrentUser({
      id: `guest-${Date.now()}`,
      name: 'Valued Guest',
      email: email || 'guest@mirasheritage.com',
      phone: '+91 98450 00000',
      isVerified: false,
      role: 'customer',
      totalOrders: 1,
      totalSpent: grandTotal,
      rewardCoins: 0,
      addresses: savedAddresses,
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setSavedAddresses(prev => [newAddr, ...prev]);
    setSelectedAddress(newAddr);
  };

  // Create Order handler
  const createOrder = (
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery',
    paymentDetails?: string,
    notes?: string
  ): Order => {
    const nextNum = 8822 + orders.length;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `#MHF-${nextNum}`,
      createdAt: 'Just now',
      customerName: currentUser?.name || 'Ananya Sharma',
      customerEmail: currentUser?.email || 'ananya.sharma@gmail.com',
      customerPhone: currentUser?.phone || '+91 98452 77120',
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        weight: item.product.weight,
        image: item.product.image,
      })),
      subtotal: itemsSubtotal,
      discount: couponDiscount,
      deliveryFee: shippingFee,
      total: grandTotal,
      paymentMethod,
      paymentDetails: paymentDetails || `${paymentMethod} Verified`,
      status: 'New',
      deliveryAddress: selectedAddress,
      deliveryNotes: notes,
      trackingId: `BD-EXP-${Math.floor(10000 + Math.random() * 90000)}`,
      isGIDirect: true,
    };

    setOrders(prev => [newOrder, ...prev]);
    setLatestPlacedOrder(newOrder);
    setCartItems([]); // Clear cart upon placing order
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  // Admin Product Handlers
  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(prod => (prod.id === id ? { ...prod, ...updates } : prod))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(prod => prod.id !== id));
  };

  // Category handlers
  const addCategory = (cat: Omit<CategoryInfo, 'id'>) => {
    const newCat: CategoryInfo = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    setCategories(prev => [...prev, newCat]);
  };

  const toggleCategoryActive = (id: string) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, isActive: !cat.isActive } : cat))
    );
  };

  // Customer handler
  const updateCustomer = (id: string, updates: Partial<User>) => {
    setCustomers(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  // Coupon handler
  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [coupon, ...prev]);
  };

  const toggleAcceptingOrders = () => {
    setIsAcceptingOrders(prev => !prev);
  };

  return (
    <StoreContext.Provider
      value={{
        portalMode,
        setPortalMode,
        currentRoute,
        adminRoute,
        navigate,
        navigateAdmin,
        selectedProductId,
        selectedOrderNumber,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        searchQuery,
        setSearchQuery,
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        itemsSubtotal,
        couponDiscount,
        shippingFee,
        freeShippingThreshold,
        grandTotal,
        totalSavings,
        isGiftUnlocked,
        totalCartCount,
        currentUser,
        isAuthenticated,
        loginWithGoogle,
        loginWithOtp,
        continueAsGuest,
        logout,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        savedAddresses,
        orders,
        latestPlacedOrder,
        createOrder,
        updateOrderStatus,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        addCategory,
        toggleCategoryActive,
        customers,
        updateCustomer,
        coupons,
        addCoupon,
        isAcceptingOrders,
        toggleAcceptingOrders,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
