const http = require('http');
const { createHash } = require('node:crypto');

const PORT = parseInt(process.env.PORT || '4612', 10);
const ADMIN_PLAIN_PASSWORD = 'adminadmin';
const USER_PLAIN_PASSWORD = 'useruser';
const CREATOR_PLAIN_PASSWORD = 'creatorcreator';
const ADMIN_HASH_PASSWORD = createHash('md5').update(ADMIN_PLAIN_PASSWORD).digest('hex');
const USER_HASH_PASSWORD = createHash('md5').update(USER_PLAIN_PASSWORD).digest('hex');
const CREATOR_HASH_PASSWORD = createHash('md5').update(CREATOR_PLAIN_PASSWORD).digest('hex');
const TOKENS = {
  admin: 'stub-admin-token',
  user: 'stub-user-token',
  creator: 'stub-creator-token'
};

const now = () => new Date().toISOString();

const settingGroups = {
  general: [
    {
      key: 'siteName',
      name: 'Site name',
      type: 'text',
      value: 'FansNest Local',
      description: 'Site title used across the platform'
    },
    {
      key: 'logoUrl',
      name: 'Logo',
      type: 'text',
      value: '/logo.svg',
      description: 'Main website logo',
      meta: { upload: true }
    },
    {
      key: 'darkmodeLogoUrl',
      name: 'Dark logo',
      type: 'text',
      value: '/logo-dark.svg',
      description: 'Dark mode logo',
      meta: { upload: true }
    },
    {
      key: 'favicon',
      name: 'Favicon',
      type: 'text',
      value: '/favicon.ico',
      description: 'Browser tab icon',
      meta: { upload: true }
    },
    {
      key: 'loginPlaceholderImage',
      name: 'Login placeholder image',
      type: 'text',
      value: '/auth-img.png',
      description: 'Image shown on login',
      meta: { upload: true }
    },
    {
      key: 'maintenanceMode',
      name: 'Maintenance mode',
      type: 'boolean',
      value: false,
      description: 'Enable maintenance mode'
    },
    {
      key: 'requireEmailVerification',
      name: 'Require email verification',
      type: 'boolean',
      value: false,
      description: 'Require users to verify email on signup'
    }
  ],
  email: [
    {
      key: 'adminEmail',
      name: 'Admin email',
      type: 'text',
      value: 'admin@example.com',
      description: 'Primary admin email'
    },
    {
      key: 'senderEmail',
      name: 'Sender email',
      type: 'text',
      value: 'noreply@example.com',
      description: 'Sender used for transactional emails'
    }
  ],
  mailer: [
    {
      key: 'smtpTransporter',
      name: 'SMTP transporter',
      type: 'mixed',
      value: {
        host: 'smtp.example.com',
        port: '587',
        secure: false,
        auth: {
          user: '',
          pass: ''
        }
      },
      description: 'SMTP server configuration'
    }
  ],
  custom: [
    {
      key: 'metaKeywords',
      name: 'Meta keywords',
      type: 'textarea',
      value: 'fansnest,creators,subscriptions',
      description: 'SEO keywords'
    },
    {
      key: 'metaDescription',
      name: 'Meta description',
      type: 'textarea',
      value: 'FansNest local environment',
      description: 'SEO description'
    },
    {
      key: 'footerContent',
      name: 'Footer content',
      type: 'text-editor',
      value: '<p>FansNest local footer</p>',
      description: 'Footer HTML content'
    }
  ],
  commission: [
    {
      key: 'performerCommission',
      name: 'Performer commission',
      type: 'number',
      value: 0.8,
      description: 'Commission ratio between 0 and 1',
      meta: {
        min: 0.01,
        max: 0.99,
        step: 0.01
      }
    }
  ],
  pricing: [
    {
      key: 'freeSubscriptionEnabled',
      name: 'Enable free subscription',
      type: 'boolean',
      value: true,
      description: 'Allow free subscription plans'
    },
    {
      key: 'freeSubscriptionDuration',
      name: 'Free subscription duration (days)',
      type: 'number',
      value: 30,
      description: 'Duration of free subscription in days',
      meta: {
        min: 0,
        max: 365
      }
    },
    {
      key: 'minimumSubscriptionPrice',
      name: 'Minimum subscription price',
      type: 'number',
      value: 1,
      description: 'Minimum subscription amount'
    },
    {
      key: 'maximumSubscriptionPrice',
      name: 'Maximum subscription price',
      type: 'number',
      value: 1000,
      description: 'Maximum subscription amount'
    },
    {
      key: 'minimumWalletPrice',
      name: 'Minimum wallet topup',
      type: 'number',
      value: 1,
      description: 'Minimum wallet recharge amount'
    },
    {
      key: 'maximumWalletPrice',
      name: 'Maximum wallet topup',
      type: 'number',
      value: 1000,
      description: 'Maximum wallet recharge amount'
    },
    {
      key: 'minimumTipPrice',
      name: 'Minimum tip',
      type: 'number',
      value: 1,
      description: 'Minimum tip amount'
    },
    {
      key: 'maximumTipPrice',
      name: 'Maximum tip',
      type: 'number',
      value: 1000,
      description: 'Maximum tip amount'
    },
    {
      key: 'minimumPayoutAmount',
      name: 'Minimum payout amount',
      type: 'number',
      value: 50,
      description: 'Minimum payout threshold'
    }
  ],
  agora: [
    {
      key: 'agoraEnable',
      name: 'Enable agora live',
      type: 'boolean',
      value: false,
      description: 'Enable Agora based streaming'
    },
    {
      key: 'agoraAppId',
      name: 'Agora App ID',
      type: 'text',
      value: '',
      description: 'Agora application id'
    },
    {
      key: 'agoraCertificate',
      name: 'Agora certificate',
      type: 'text',
      value: '',
      description: 'Agora certificate key'
    }
  ],
  paymentGateways: [
    {
      key: 'paymentGateway',
      name: 'Payment gateway',
      type: 'radio',
      value: 'stripe',
      description: 'Default payment gateway',
      meta: {
        value: [
          { key: 'stripe', name: 'Stripe' },
          { key: 'ccbill', name: 'CCBill' }
        ]
      }
    },
    {
      key: 'stripePublishableKey',
      name: 'Stripe publishable key',
      type: 'text',
      value: '',
      description: 'Stripe public key'
    },
    {
      key: 'stripeSecretKey',
      name: 'Stripe secret key',
      type: 'text',
      value: '',
      description: 'Stripe secret key'
    },
    {
      key: 'ccbillClientAccountNumber',
      name: 'CCBill client account number',
      type: 'text',
      value: '',
      description: 'CCBill client account'
    },
    {
      key: 'ccbillSingleSubAccountNumber',
      name: 'CCBill single sub account number',
      type: 'text',
      value: '',
      description: 'CCBill one-time purchase sub account'
    },
    {
      key: 'ccbillRecurringSubAccountNumber',
      name: 'CCBill recurring sub account number',
      type: 'text',
      value: '',
      description: 'CCBill recurring sub account'
    },
    {
      key: 'ccbillFlexformId',
      name: 'CCBill flexform id',
      type: 'text',
      value: '',
      description: 'CCBill flexform id'
    },
    {
      key: 'ccbillSalt',
      name: 'CCBill salt',
      type: 'text',
      value: '',
      description: 'CCBill salt key'
    },
    {
      key: 'ccbillDatalinkUsername',
      name: 'CCBill datalink username',
      type: 'text',
      value: '',
      description: 'CCBill datalink username'
    },
    {
      key: 'ccbillDatalinkPassword',
      name: 'CCBill datalink password',
      type: 'text',
      value: '',
      description: 'CCBill datalink password'
    }
  ],
  socials: [
    {
      key: 'googleLoginClientId',
      name: 'Google login client id',
      type: 'text',
      value: '',
      description: 'Google OAuth client id'
    },
    {
      key: 'googleLoginClientSecret',
      name: 'Google login client secret',
      type: 'text',
      value: '',
      description: 'Google OAuth client secret'
    },
    {
      key: 'twitterLoginClientId',
      name: 'Twitter login client id',
      type: 'text',
      value: '',
      description: 'Twitter OAuth client id'
    },
    {
      key: 'twitterLoginClientSecret',
      name: 'Twitter login client secret',
      type: 'text',
      value: '',
      description: 'Twitter OAuth client secret'
    }
  ],
  analytics: [
    {
      key: 'gaCode',
      name: 'Google analytics code',
      type: 'textarea',
      value: '',
      description: 'Google analytics snippet'
    }
  ]
};

function createSetting(setting, group, ordering) {
  return {
    _id: `stub-${group}-${setting.key}`,
    key: setting.key,
    value: setting.value,
    name: setting.name,
    description: setting.description || '',
    extra: setting.extra || '',
    group,
    public: !!setting.public,
    type: setting.type || 'text',
    visible: setting.visible !== false,
    meta: setting.meta || {},
    autoload: !!setting.autoload,
    ordering: typeof setting.ordering === 'number' ? setting.ordering : ordering,
    createdAt: now(),
    updatedAt: now()
  };
}

const settingsByGroup = {};
const settingsByKey = {};
Object.keys(settingGroups).forEach((group) => {
  settingsByGroup[group] = settingGroups[group].map((setting, idx) => {
    const item = createSetting(setting, group, idx);
    settingsByKey[item.key] = item;
    return item;
  });
});

function getPublicSettings() {
  return {
    maintenanceMode: !!settingsByKey.maintenanceMode?.value,
    logoUrl: settingsByKey.logoUrl?.value || '/logo.svg',
    darkmodeLogoUrl: settingsByKey.darkmodeLogoUrl?.value || '/logo-dark.svg',
    siteName: settingsByKey.siteName?.value || 'FansNest Local',
    favicon: settingsByKey.favicon?.value || '/favicon.ico',
    menus: [],
    googleAnalyticsCode: settingsByKey.gaCode?.value || '',
    requireEmailVerification: !!settingsByKey.requireEmailVerification?.value,
    stripePublishableKey: settingsByKey.stripePublishableKey?.value || '',
    paymentGateway: settingsByKey.paymentGateway?.value || 'stripe',
    freeSubscriptionEnabled: !!settingsByKey.freeSubscriptionEnabled?.value,
    freeSubscriptionDuration: settingsByKey.freeSubscriptionDuration?.value ?? 0,
    minimumSubscriptionPrice: settingsByKey.minimumSubscriptionPrice?.value ?? 1,
    maximumSubscriptionPrice: settingsByKey.maximumSubscriptionPrice?.value ?? 1000,
    minimumWalletPrice: settingsByKey.minimumWalletPrice?.value ?? 1,
    maximumWalletPrice: settingsByKey.maximumWalletPrice?.value ?? 1000,
    minimumTipPrice: settingsByKey.minimumTipPrice?.value ?? 1,
    maximumTipPrice: settingsByKey.maximumTipPrice?.value ?? 1000,
    minimumPayoutAmount: settingsByKey.minimumPayoutAmount?.value ?? 50
  };
}

const keyMap = {
  homeTitle: 'FansNest Login',
  homeMetaKeywords: 'fansnest,login',
  homeMetaDescription: 'FansNest local login',
  loginPlaceholderImage: '/auth-img.png'
};

function makeId(prefix) {
  return `stub-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function capitalizeLabel(value) {
  return String(value || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function performerSummary(performer) {
  return {
    _id: performer._id,
    name: performer.name,
    username: performer.username,
    avatar: performer.avatar,
    verifiedAccount: !!performer.verifiedAccount,
    isFeatured: !!performer.isFeatured,
    isOnline: !!performer.isOnline,
    live: performer.live || 0,
    bio: performer.bio || '',
    monthlyPrice: performer.monthlyPrice || 0,
    score: performer.score || 0,
    subscriberCount: performer.subscriberCount || 0,
    mediaCount: performer.mediaCount || 0,
    responseTime: performer.responseTime || 'Replies within 24h',
    lastActiveText: performer.lastActiveText || 'Active this week',
    isFreeSubscription: !!performer.isFreeSubscription
  };
}

function userSummary(user) {
  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    avatar: user.avatar
  };
}

const initialTimestamp = now();

const stubUsers = [
  {
    _id: 'stub-admin-id',
    username: 'admin',
    name: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    avatar: '/no-avatar.jpg',
    roles: ['admin'],
    status: 'active',
    verifiedEmail: true,
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-user-id',
    username: 'user',
    name: 'Demo User',
    firstName: 'Demo',
    lastName: 'User',
    email: 'user@example.com',
    avatar: '/no-avatar.jpg',
    roles: ['user'],
    status: 'active',
    verifiedEmail: true,
    balance: 48.25,
    stats: {
      totalSubscriptions: 3
    },
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-user-id-2',
    username: 'vipfan',
    name: 'Vip Fan',
    firstName: 'Vip',
    lastName: 'Fan',
    email: 'vipfan@example.com',
    avatar: '/no-avatar.jpg',
    roles: ['user'],
    status: 'active',
    verifiedEmail: true,
    balance: 96.5,
    stats: {
      totalSubscriptions: 6
    },
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-user-id-3',
    username: 'newfan',
    name: 'New Fan',
    firstName: 'New',
    lastName: 'Fan',
    email: 'newfan@example.com',
    avatar: '/no-avatar.jpg',
    roles: ['user'],
    status: 'active',
    verifiedEmail: false,
    balance: 12,
    stats: {
      totalSubscriptions: 1
    },
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-user-id-4',
    username: 'archivedfan',
    name: 'Archived Fan',
    firstName: 'Archived',
    lastName: 'Fan',
    email: 'archivedfan@example.com',
    avatar: '/no-avatar.jpg',
    roles: ['user'],
    status: 'inactive',
    verifiedEmail: true,
    balance: 0,
    stats: {
      totalSubscriptions: 0
    },
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-creator-user-id',
    username: 'creator1',
    name: 'Creator One',
    firstName: 'Creator',
    lastName: 'One',
    email: 'creator1@example.com',
    avatar: '/no-avatar.jpg',
    roles: ['user'],
    status: 'active',
    verifiedEmail: true,
    isPerformer: true,
    performerId: 'stub-performer-1',
    balance: 182.45,
    stats: {
      subscribers: 128,
      totalSubscriptions: 128
    },
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubPerformers = [
  {
    _id: 'stub-performer-1',
    username: 'creator1',
    name: 'Creator One',
    firstName: 'Creator',
    lastName: 'One',
    email: 'creator1@example.com',
    avatar: '/no-avatar.jpg',
    cover: '/default-banner.jpeg',
    status: 'active',
    verifiedEmail: true,
    verifiedDocument: true,
    verifiedAccount: true,
    isFeatured: false,
    isOnline: 0,
    isFreeSubscription: true,
    live: 0,
    country: 'US',
    dateOfBirth: '1998-01-15T00:00:00.000Z',
    performerId: 'stub-performer-1',
    score: 2400,
    bio: 'Daily drops, private replies, and subscriber-first content.',
    monthlyPrice: 12.99,
    subscriberCount: 128,
    mediaCount: 42,
    responseTime: 'Replies within 6h',
    lastActiveText: 'Active today',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-performer-2',
    username: 'creator2',
    name: 'Ava Luxe',
    firstName: 'Ava',
    lastName: 'Luxe',
    email: 'creator2@example.com',
    avatar: '/no-avatar.jpg',
    cover: '/default-banner.jpeg',
    status: 'active',
    verifiedEmail: true,
    verifiedDocument: true,
    verifiedAccount: true,
    isFeatured: true,
    isOnline: 1,
    isFreeSubscription: false,
    live: 1,
    country: 'CA',
    dateOfBirth: '1996-05-08T00:00:00.000Z',
    performerId: 'stub-performer-2',
    score: 5300,
    bio: 'Live-heavy creator with premium vault content and fast DM replies.',
    monthlyPrice: 24.99,
    subscriberCount: 864,
    mediaCount: 118,
    responseTime: 'Replies within 1h',
    lastActiveText: 'Live now',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-performer-3',
    username: 'creator3',
    name: 'Mia Nova',
    firstName: 'Mia',
    lastName: 'Nova',
    email: 'creator3@example.com',
    avatar: '/no-avatar.jpg',
    cover: '/default-banner.jpeg',
    status: 'active',
    verifiedEmail: true,
    verifiedDocument: true,
    verifiedAccount: true,
    isFeatured: true,
    isOnline: 1,
    isFreeSubscription: true,
    live: 0,
    country: 'GB',
    dateOfBirth: '1997-09-14T00:00:00.000Z',
    performerId: 'stub-performer-3',
    score: 4100,
    bio: 'High-touch creator experience with private drops and premium bundles.',
    monthlyPrice: 15.99,
    subscriberCount: 526,
    mediaCount: 76,
    responseTime: 'Replies within 3h',
    lastActiveText: 'Active today',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-performer-4',
    username: 'creator4',
    name: 'Noor Vale',
    firstName: 'Noor',
    lastName: 'Vale',
    email: 'creator4@example.com',
    avatar: '/no-avatar.jpg',
    cover: '/default-banner.jpeg',
    status: 'inactive',
    verifiedEmail: true,
    verifiedDocument: true,
    verifiedAccount: false,
    isFeatured: false,
    isOnline: 0,
    isFreeSubscription: false,
    live: 0,
    country: 'AE',
    dateOfBirth: '1994-12-18T00:00:00.000Z',
    performerId: 'stub-performer-4',
    score: 1200,
    bio: 'Dormant creator account used for admin management demos.',
    subscriberCount: 12,
    mediaCount: 8,
    responseTime: 'Paused',
    lastActiveText: 'Last active 2 weeks ago',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-performer-5',
    username: 'creator5',
    name: 'Lina Hart',
    firstName: 'Lina',
    lastName: 'Hart',
    email: 'creator5@example.com',
    avatar: '/no-avatar.jpg',
    cover: '/default-banner.jpeg',
    status: 'active',
    verifiedEmail: true,
    verifiedDocument: false,
    verifiedAccount: false,
    isFeatured: false,
    isOnline: 0,
    isFreeSubscription: true,
    live: 0,
    country: 'FR',
    dateOfBirth: '1999-03-09T00:00:00.000Z',
    performerId: 'stub-performer-5',
    score: 890,
    bio: 'Pending review creator used to demonstrate verification workflows.',
    subscriberCount: 54,
    mediaCount: 12,
    responseTime: 'Replies within 12h',
    lastActiveText: 'Awaiting verification',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubCategories = [
  {
    _id: 'stub-category-1',
    name: 'General',
    slug: 'general',
    ordering: 0,
    description: 'General creator category',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-category-2',
    name: 'Lifestyle',
    slug: 'lifestyle',
    ordering: 1,
    description: 'Lifestyle creator category',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-category-3',
    name: 'Live Stream',
    slug: 'live-stream',
    ordering: 2,
    description: 'Live streaming creator category',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubPosts = [
  {
    _id: 'stub-post-1',
    title: 'About FansNest',
    slug: 'about',
    shortDescription: 'About page',
    content: '<p>Welcome to FansNest.</p>',
    type: 'page',
    status: 'published',
    ordering: 0,
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-post-2',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    shortDescription: 'Privacy page',
    content: '<p>Your privacy matters.</p>',
    type: 'page',
    status: 'published',
    ordering: 1,
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-post-3',
    title: 'Terms of Service',
    slug: 'terms-of-service',
    shortDescription: 'Terms page',
    content: '<p>Terms for using FansNest.</p>',
    type: 'page',
    status: 'published',
    ordering: 2,
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubMenus = [
  {
    _id: 'stub-menu-1',
    title: 'About',
    path: '/page/about',
    internal: true,
    section: 'footer',
    ordering: 0,
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubCoupons = [
  {
    _id: 'stub-coupon-1',
    name: 'WELCOME10',
    code: 'WELCOME10',
    value: 0.1,
    numberOfUses: 100,
    status: 'active',
    expiredDate: '2027-12-31T00:00:00.000Z',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubBanners = [
  {
    _id: 'stub-banner-1',
    title: 'Top Banner',
    description: 'Sample banner',
    position: 'top',
    link: '/',
    status: 'active',
    photo: {
      _id: 'stub-file-banner-1',
      url: '/banner-image.jpg'
    },
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-banner-2',
    title: 'Live this week',
    description: 'Fresh creators, premium drops, and private chat moments',
    position: 'top',
    link: '/home',
    status: 'active',
    photo: {
      _id: 'stub-file-banner-2',
      url: '/live-streaming.jpg'
    },
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubFeeds = [
  {
    _id: 'stub-feed-1',
    type: 'text',
    text: 'Welcome post',
    performerId: 'stub-performer-1',
    fromSourceId: 'stub-performer-1',
    performer: performerSummary(stubPerformers[0]),
    status: 'active',
    isSale: false,
    totalLike: 86,
    totalComment: 12,
    totalBookmark: 7,
    polls: [],
    files: [],
    fileIds: [],
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-feed-2',
    type: 'photo',
    text: 'Fresh photo set dropped for premium members.',
    performerId: 'stub-performer-2',
    fromSourceId: 'stub-performer-2',
    performer: performerSummary(stubPerformers[1]),
    status: 'active',
    isSale: true,
    price: 14.99,
    totalLike: 248,
    totalComment: 31,
    totalBookmark: 19,
    polls: [],
    files: [
      {
        _id: 'stub-feed-file-2',
        type: 'feed-photo',
        url: '/default-banner.jpeg',
        thumbnails: ['/default-banner.jpeg']
      }
    ],
    fileIds: ['stub-feed-file-2'],
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-feed-3',
    type: 'text',
    text: 'Behind-the-scenes drop is live now with private replies open.',
    performerId: 'stub-performer-3',
    fromSourceId: 'stub-performer-3',
    performer: performerSummary(stubPerformers[2]),
    status: 'active',
    isSale: false,
    totalLike: 174,
    totalComment: 28,
    totalBookmark: 13,
    polls: [],
    files: [],
    fileIds: [],
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-feed-4',
    type: 'scheduled-streaming',
    text: 'Private live room starts tonight at 9 PM.',
    performerId: 'stub-performer-2',
    fromSourceId: 'stub-performer-2',
    performer: performerSummary(stubPerformers[1]),
    status: 'active',
    isSale: false,
    streamingScheduled: '2026-03-22T21:00:00.000Z',
    totalLike: 96,
    totalComment: 14,
    totalBookmark: 11,
    polls: [],
    files: [],
    fileIds: [],
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-feed-5',
    type: 'photo',
    text: 'Today’s premium gallery preview is now available.',
    performerId: 'stub-performer-1',
    fromSourceId: 'stub-performer-1',
    performer: performerSummary(stubPerformers[0]),
    status: 'active',
    isSale: true,
    price: 11.99,
    totalLike: 132,
    totalComment: 18,
    totalBookmark: 15,
    polls: [],
    files: [
      {
        _id: 'stub-feed-file-5',
        type: 'feed-photo',
        url: '/default-banner.jpeg',
        thumbnails: ['/default-banner.jpeg']
      }
    ],
    fileIds: ['stub-feed-file-5'],
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubVideos = [
  {
    _id: 'stub-video-1',
    performerId: 'stub-performer-1',
    performer: performerSummary(stubPerformers[0]),
    title: 'Welcome video',
    description: 'Sample video',
    tags: [],
    participantIds: ['stub-performer-1'],
    isSale: false,
    isSchedule: false,
    price: 9.99,
    status: 'active',
    thumbnailId: 'stub-file-video-thumb',
    teaserId: 'stub-file-video-teaser',
    videoId: 'stub-file-video-main',
    thumbnail: { _id: 'stub-file-video-thumb', name: 'thumb.jpg', url: '/default-thumbnail.png' },
    teaser: { _id: 'stub-file-video-teaser', name: 'teaser.mp4', url: '/default-teaser.mp4' },
    video: { _id: 'stub-file-video-main', name: 'video.mp4', url: '/default-video.mp4' },
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-video-2',
    performerId: 'stub-performer-2',
    performer: performerSummary(stubPerformers[1]),
    title: 'VIP after-hours set',
    description: 'Premium release for paid members',
    tags: ['vip', 'premium'],
    participantIds: ['stub-performer-2'],
    isSale: true,
    isSchedule: false,
    price: 24.99,
    status: 'active',
    thumbnailId: 'stub-file-video-thumb-2',
    teaserId: 'stub-file-video-teaser-2',
    videoId: 'stub-file-video-main-2',
    thumbnail: { _id: 'stub-file-video-thumb-2', name: 'thumb-2.jpg', url: '/default-banner.jpeg' },
    teaser: { _id: 'stub-file-video-teaser-2', name: 'teaser-2.mp4', url: '/default-banner.jpeg' },
    video: { _id: 'stub-file-video-main-2', name: 'video-2.mp4', url: '/default-banner.jpeg' },
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubGalleries = [
  {
    _id: 'stub-gallery-1',
    performerId: 'stub-performer-1',
    performer: performerSummary(stubPerformers[0]),
    title: 'Sample Gallery',
    description: 'Sample gallery',
    isSale: false,
    price: 9.99,
    numOfItems: 1,
    status: 'active',
    coverPhoto: {
      _id: 'stub-file-gallery-cover',
      url: '/default-banner.jpeg'
    },
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-gallery-2',
    performerId: 'stub-performer-2',
    performer: performerSummary(stubPerformers[1]),
    title: 'Night Shift Collection',
    description: 'High-conversion premium gallery',
    isSale: true,
    price: 17.99,
    numOfItems: 6,
    status: 'active',
    coverPhoto: {
      _id: 'stub-file-gallery-cover-2',
      url: '/live-streaming.jpg'
    },
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubPhotos = [
  {
    _id: 'stub-photo-1',
    performerId: 'stub-performer-1',
    performer: performerSummary(stubPerformers[0]),
    galleryId: 'stub-gallery-1',
    title: 'Sample Photo',
    description: 'Sample image',
    status: 'active',
    photo: {
      _id: 'stub-file-photo-1',
      url: '/no-image.jpg',
      thumbnails: ['/no-image.jpg']
    },
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-photo-2',
    performerId: 'stub-performer-2',
    performer: performerSummary(stubPerformers[1]),
    galleryId: 'stub-gallery-2',
    title: 'Members preview',
    description: 'Premium visual preview',
    status: 'active',
    photo: {
      _id: 'stub-file-photo-2',
      url: '/default-banner.jpeg',
      thumbnails: ['/default-banner.jpeg']
    },
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubProducts = [
  {
    _id: 'stub-product-1',
    performerId: 'stub-performer-1',
    performer: performerSummary(stubPerformers[0]),
    name: 'Starter Pack',
    description: 'Sample product',
    type: 'physical',
    stock: 10,
    price: 19.99,
    status: 'active',
    image: '/product.png',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-product-2',
    performerId: 'stub-performer-3',
    performer: performerSummary(stubPerformers[2]),
    name: 'Priority DM Bundle',
    description: 'Fast-track access plus premium replies',
    type: 'digital',
    stock: 999,
    price: 49.99,
    status: 'active',
    image: '/product.png',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubReports = [
  {
    _id: 'stub-report-1',
    sourceInfo: userSummary(stubUsers[1]),
    performerInfo: performerSummary(stubPerformers[0]),
    target: 'feed',
    targetId: 'stub-feed-1',
    title: 'Spam',
    description: 'Reported as spam',
    createdAt: initialTimestamp,
    updatedAt: initialTimestamp
  }
];

const stubOrders = [
  {
    _id: 'stub-order-1',
    orderNumber: '100001',
    userInfo: userSummary(stubUsers[1]),
    performerInfo: performerSummary(stubPerformers[0]),
    productInfo: {
      _id: 'stub-product-1',
      name: 'Starter Pack',
      description: 'Sample product',
      type: 'physical'
    },
    quantity: 1,
    unitPrice: 19.99,
    totalPrice: 19.99,
    deliveryAddress: '123 Demo Street, New York',
    shippingCode: 'SHIP123',
    deliveryStatus: 'processing',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-order-2',
    orderNumber: '100002',
    userInfo: userSummary(stubUsers[2]),
    performerInfo: performerSummary(stubPerformers[1]),
    productInfo: {
      _id: 'stub-product-2',
      name: 'Priority DM Bundle',
      description: 'Digital bundle',
      type: 'digital'
    },
    quantity: 1,
    unitPrice: 49.99,
    totalPrice: 49.99,
    deliveryAddress: 'Digital delivery',
    shippingCode: 'DIGI200',
    deliveryStatus: 'delivered',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-order-3',
    orderNumber: '100003',
    userInfo: userSummary(stubUsers[1]),
    performerInfo: performerSummary(stubPerformers[2]),
    productInfo: {
      _id: 'stub-product-1',
      name: 'Starter Pack',
      description: 'Sample product',
      type: 'physical'
    },
    quantity: 2,
    unitPrice: 19.99,
    totalPrice: 39.98,
    deliveryAddress: '77 Creator Avenue, London',
    shippingCode: 'SHIP777',
    deliveryStatus: 'shipping',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubEarnings = [
  {
    _id: 'stub-earning-1',
    performerInfo: performerSummary(stubPerformers[0]),
    userInfo: userSummary(stubUsers[1]),
    grossPrice: 19.99,
    siteCommission: 0.2,
    netPrice: 15.99,
    type: 'product',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-earning-2',
    performerInfo: performerSummary(stubPerformers[1]),
    userInfo: userSummary(stubUsers[2]),
    grossPrice: 49.99,
    siteCommission: 0.2,
    netPrice: 39.99,
    type: 'subscription',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-earning-3',
    performerInfo: performerSummary(stubPerformers[2]),
    userInfo: userSummary(stubUsers[1]),
    grossPrice: 39.98,
    siteCommission: 0.2,
    netPrice: 31.98,
    type: 'tip',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubSubscriptions = [
  {
    _id: 'stub-subscription-1',
    subscriptionId: 'SUB-1001',
    userId: 'stub-user-id',
    performerId: 'stub-performer-1',
    userInfo: userSummary(stubUsers[1]),
    performerInfo: performerSummary(stubPerformers[0]),
    subscriptionType: 'free',
    paymentGateway: 'system',
    status: 'active',
    expiredAt: '2027-12-31T00:00:00.000Z',
    nextRecurringDate: null,
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-subscription-2',
    subscriptionId: 'SUB-1002',
    userId: 'stub-user-id-2',
    performerId: 'stub-performer-2',
    userInfo: userSummary(stubUsers[2]),
    performerInfo: performerSummary(stubPerformers[1]),
    subscriptionType: 'monthly',
    paymentGateway: 'stripe',
    status: 'active',
    expiredAt: '2027-08-30T00:00:00.000Z',
    nextRecurringDate: '2026-04-22T00:00:00.000Z',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-subscription-3',
    subscriptionId: 'SUB-1003',
    userId: 'stub-user-id-3',
    performerId: 'stub-performer-3',
    userInfo: userSummary(stubUsers[3]),
    performerInfo: performerSummary(stubPerformers[2]),
    subscriptionType: 'trial',
    paymentGateway: 'system',
    status: 'deactivated',
    expiredAt: '2026-02-28T00:00:00.000Z',
    nextRecurringDate: null,
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubPaymentTransactions = [
  {
    _id: 'stub-payment-1',
    sourceInfo: userSummary(stubUsers[1]),
    products: [{ name: 'Starter Pack', description: 'Sample product' }],
    type: 'token_package',
    originalPrice: 20,
    couponInfo: { value: 0 },
    totalPrice: 20,
    status: 'success',
    paymentGateway: 'stripe',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-payment-2',
    sourceInfo: userSummary(stubUsers[2]),
    products: [{ name: 'Monthly Subscription', description: 'Creator subscription' }],
    type: 'subscription',
    originalPrice: 49.99,
    couponInfo: { value: 0.1 },
    totalPrice: 44.99,
    status: 'success',
    paymentGateway: 'stripe',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubWalletCharges = [
  {
    _id: 'stub-wallet-charge-10000001',
    sourceInfo: userSummary(stubUsers[1]),
    performerInfo: performerSummary(stubPerformers[0]),
    products: [{ name: 'Tip', description: 'Creator tip' }],
    totalPrice: 5,
    type: 'tip',
    status: 'success',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-wallet-charge-10000002',
    sourceInfo: userSummary(stubUsers[2]),
    performerInfo: performerSummary(stubPerformers[1]),
    products: [{ name: 'Wallet Top-up', description: 'Top-up for premium chat' }],
    totalPrice: 25,
    type: 'wallet_topup',
    status: 'success',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubPayoutRequests = [
  {
    _id: 'stub-payout-1',
    sourceId: 'stub-performer-1',
    sourceInfo: performerSummary(stubPerformers[0]),
    requestTokens: 120.5,
    requestNote: 'Please process payout',
    adminNote: '',
    paymentAccountType: 'paypal',
    paymentAccountInfo: { value: { email: 'creator1@paypal.test' } },
    status: 'pending',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-payout-2',
    sourceId: 'stub-performer-2',
    sourceInfo: performerSummary(stubPerformers[1]),
    requestTokens: 420,
    requestNote: 'Weekly creator payout',
    adminNote: 'Queued for payout',
    paymentAccountType: 'paypal',
    paymentAccountInfo: { value: { email: 'creator2@paypal.test' } },
    status: 'approved',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubEmailTemplates = [
  {
    _id: 'stub-email-template-1',
    name: 'Welcome Email',
    description: 'Welcome template',
    subject: 'Welcome to FansNest',
    content: '<p>Welcome!</p>',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  },
  {
    _id: 'stub-email-template-2',
    name: 'Subscription Renewal',
    description: 'Renewal reminder template',
    subject: 'Your subscription is being renewed',
    content: '<p>Your premium access continues.</p>',
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubPaymentCards = [
  {
    _id: 'stub-card-1',
    brand: 'visa',
    last4: '4242',
    isDefault: true,
    createdAt: initialTimestamp,
    updatedAt: initialTimestamp
  }
];

const stubConversations = [
  {
    _id: 'stub-conversation-1',
    name: 'Creator One',
    type: 'private',
    source: 'performer',
    sourceId: 'stub-performer-1',
    recipientInfo: performerSummary(stubPerformers[0]),
    totalNotSeenMessages: 1,
    lastMessage: 'Welcome to FansNest. Let me know what content you want next.',
    lastMessageCreatedAt: initialTimestamp,
    updatedAt: initialTimestamp,
    createdAt: initialTimestamp
  }
];

const stubMessages = [
  {
    _id: 'stub-message-1',
    conversationId: 'stub-conversation-1',
    senderId: 'stub-performer-1',
    senderInfo: performerSummary(stubPerformers[0]),
    text: 'Welcome to FansNest. Let me know what content you want next.',
    type: 'text',
    createdAt: initialTimestamp,
    updatedAt: initialTimestamp
  }
];

const stubState = {
  users: stubUsers,
  performers: stubPerformers,
  categories: stubCategories,
  posts: stubPosts,
  menus: stubMenus,
  coupons: stubCoupons,
  banners: stubBanners,
  feeds: stubFeeds,
  videos: stubVideos,
  galleries: stubGalleries,
  photos: stubPhotos,
  products: stubProducts,
  reports: stubReports,
  orders: stubOrders,
  earnings: stubEarnings,
  subscriptions: stubSubscriptions,
  paymentTransactions: stubPaymentTransactions,
  walletCharges: stubWalletCharges,
  payoutRequests: stubPayoutRequests,
  emailTemplates: stubEmailTemplates,
  paymentCards: stubPaymentCards,
  conversations: stubConversations,
  messages: stubMessages,
  blockCountries: []
};

function getPager(url, fallbackLimit = 10) {
  const limit = Number.parseInt(url.searchParams.get('limit') || '', 10);
  const offset = Number.parseInt(url.searchParams.get('offset') || '', 10);
  return {
    limit: Number.isNaN(limit) ? fallbackLimit : Math.max(limit, 0),
    offset: Number.isNaN(offset) ? 0 : Math.max(offset, 0)
  };
}

function toPaged(items, url, fallbackLimit = 10) {
  const { limit, offset } = getPager(url, fallbackLimit);
  const total = items.length;
  const data = (limit > 0 ? items.slice(offset, offset + limit) : items.slice(offset));
  return { data, total };
}

function findById(items, id) {
  return items.find((item) => `${item._id}` === `${id}`) || null;
}

function upsertById(items, id, payload) {
  const idx = items.findIndex((item) => `${item._id}` === `${id}`);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...payload, updatedAt: now() };
  return items[idx];
}

function deleteById(items, id) {
  const before = items.length;
  const afterItems = items.filter((item) => `${item._id}` !== `${id}`);
  items.length = 0;
  items.push(...afterItems);
  return before !== afterItems.length;
}

function parseJsonOrEmpty(req, done) {
  parseBody(req, (err, body) => {
    if (err) {
      done(err, {});
      return;
    }
    done(null, body || {});
  });
}

function sendUploadResponse(res, kind = 'file') {
  send(res, 200, {
    data: {
      _id: makeId(`${kind}-upload`),
      url: `/uploads/stub-${Date.now()}.png`,
      name: `stub-${kind}.dat`,
      mimeType: kind === 'video' ? 'video/mp4' : 'image/png'
    }
  });
}

function send(res, code, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  });
  res.end(body);
}

function parseBody(req, onDone) {
  let raw = '';
  req.on('data', (chunk) => {
    raw += chunk;
    if (raw.length > 1e6) req.destroy();
  });
  req.on('end', () => {
    try {
      const body = raw ? JSON.parse(raw) : {};
      onDone(null, body);
    } catch (e) {
      onDone(e);
    }
  });
}

function readBody(req, onDone) {
  req.on('data', () => {});
  req.on('end', onDone);
}

function normalizeToken(headerVal) {
  if (!headerVal) return '';
  const val = String(headerVal).trim();
  if (val.toLowerCase().startsWith('bearer ')) return val.slice(7).trim();
  return val;
}

function getActorByToken(token) {
  if (token === TOKENS.admin) {
    return {
      kind: 'admin',
      user: findById(stubState.users, 'stub-admin-id')
    };
  }
  if (token === TOKENS.user) {
    return {
      kind: 'user',
      user: findById(stubState.users, 'stub-user-id')
    };
  }
  if (token === TOKENS.creator) {
    return {
      kind: 'creator',
      user: findById(stubState.users, 'stub-creator-user-id'),
      performer: findById(stubState.performers, 'stub-performer-1')
    };
  }
  return null;
}

function actorSummary(actor) {
  if (!actor?.user) return null;
  return {
    _id: actor.user._id,
    username: actor.user.username,
    email: actor.user.email,
    firstName: actor.user.firstName,
    lastName: actor.user.lastName,
    name: actor.user.name,
    avatar: actor.user.avatar,
    roles: actor.user.roles || ['user'],
    isPerformer: !!actor.user.isPerformer,
    performerId: actor.user.performerId || null,
    emailVerified: actor.user.verifiedEmail !== false,
    verifiedEmail: actor.user.verifiedEmail !== false,
    balance: actor.user.balance || 0,
    stats: actor.user.stats || {}
  };
}

function getPublicPerformers({ includePending = false } = {}) {
  return stubState.performers.filter((performer) => {
    if (performer.status !== 'active') return false;
    if (!includePending && performer.verifiedDocument === false) return false;
    return true;
  });
}

function getFilteredPerformers(url) {
  let items = [...getPublicPerformers()];
  const q = String(url.searchParams.get('q') || '').trim().toLowerCase();
  const sortBy = String(url.searchParams.get('sortBy') || '').trim();
  const isFreeSubscription = url.searchParams.get('isFreeSubscription');
  const country = url.searchParams.get('country');

  if (q) {
    items = items.filter((performer) => (
      `${performer.name} ${performer.username}`.toLowerCase().includes(q)
    ));
  }
  if (country) {
    items = items.filter((performer) => performer.country === country);
  }
  if (isFreeSubscription === 'true') {
    items = items.filter((performer) => performer.isFreeSubscription);
  }

  if (sortBy === 'live') {
    items.sort((a, b) => (b.live || 0) - (a.live || 0) || (b.isOnline || 0) - (a.isOnline || 0));
  } else if (sortBy === 'latest') {
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    items.sort((a, b) => (b.score || 0) - (a.score || 0) || (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  return items;
}

function getFilteredFeeds(url) {
  let items = [...stubState.feeds];
  const q = String(url.searchParams.get('q') || '').trim().toLowerCase();
  const type = String(url.searchParams.get('type') || '').trim();
  const audience = String(url.searchParams.get('audience') || 'for-you').trim();

  if (q) {
    items = items.filter((feed) => String(feed.text || '').toLowerCase().includes(q));
  }
  if (type) {
    items = items.filter((feed) => feed.type === type);
  }

  if (audience === 'trending') {
    items.sort((a, b) => Number(!!b.isSale) - Number(!!a.isSale)
      || Number(!!b.streamingScheduled) - Number(!!a.streamingScheduled)
      || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } else if (audience === 'latest') {
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (audience === 'following') {
    items = items.filter((feed) => ['stub-performer-1', 'stub-performer-2'].includes(feed.performerId));
    items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } else {
    items.sort((a, b) => Number(!!b.streamingScheduled) - Number(!!a.streamingScheduled)
      || Number(!!b.isSale) - Number(!!a.isSale)
      || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  return items.map((feed) => ({
    polls: [],
    pollIds: [],
    files: [],
    fileIds: [],
    totalLike: 0,
    totalComment: 0,
    totalBookmark: 0,
    isLiked: false,
    isBookMarked: false,
    isSubscribed: true,
    isBought: false,
    price: 0,
    text: '',
    ...feed,
    polls: Array.isArray(feed.polls) ? feed.polls : [],
    pollIds: Array.isArray(feed.pollIds) ? feed.pollIds : [],
    files: Array.isArray(feed.files) ? feed.files : [],
    fileIds: Array.isArray(feed.fileIds) ? feed.fileIds : []
  }));
}

function getAdminStatistics() {
  const users = stubState.users.filter((user) => !user.isPerformer && !(user.roles || []).includes('admin'));
  const performers = stubState.performers;
  const totalGrossPrice = stubState.earnings.reduce((sum, item) => sum + Number(item.grossPrice || 0), 0);
  const totalNetPrice = stubState.earnings.reduce((sum, item) => sum + Number(item.netPrice || 0), 0);
  const totalPriceCommission = Number((totalGrossPrice - totalNetPrice).toFixed(2));

  return {
    totalActivePerformers: performers.filter((item) => item.status === 'active' && item.verifiedDocument !== false).length,
    totalInactivePerformers: performers.filter((item) => item.status === 'inactive').length,
    totalPendingPerformers: performers.filter((item) => item.verifiedDocument === false).length,
    totalActiveUsers: users.filter((item) => item.status === 'active' && item.verifiedEmail !== false).length,
    totalInactiveUsers: users.filter((item) => item.status === 'inactive').length,
    totalPendingUsers: users.filter((item) => item.verifiedEmail === false).length,
    totalDeliveredOrders: stubState.orders.filter((item) => item.deliveryStatus === 'delivered').length,
    totalGrossPrice: Number(totalGrossPrice.toFixed(2)),
    totalNetPrice: Number(totalNetPrice.toFixed(2)),
    totalPriceCommission,
    totalOrders: stubState.orders.length,
    totalPosts: stubState.feeds.length,
    totalPhotoPosts: stubState.feeds.filter((item) => item.type === 'photo').length,
    totalVideoPosts: stubState.feeds.filter((item) => item.type === 'video').length,
    totalGalleries: stubState.galleries.length,
    totalPhotos: stubState.photos.length,
    totalVideos: stubState.videos.length,
    totalProducts: stubState.products.length,
    totalRefundedOrders: stubState.orders.filter((item) => item.deliveryStatus === 'refunded').length,
    totalShippingdOrders: stubState.orders.filter((item) => item.deliveryStatus === 'shipping').length,
    totalSubscribers: stubState.subscriptions.length,
    totalActiveSubscribers: stubState.subscriptions.filter((item) => item.status === 'active').length,
    totalInactiveSubscribers: stubState.subscriptions.filter((item) => item.status !== 'active').length
  };
}

function getAdminDashboardActivity() {
  const liveCreators = getPublicPerformers().filter((performer) => performer.live > 0 || performer.isOnline > 0).length;
  const pendingPayouts = stubState.payoutRequests.filter((item) => item.status === 'pending');
  const pendingCreatorReviews = stubState.performers.filter((item) => item.verifiedDocument === false);
  const spotlightCreators = getPublicPerformers()
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 3)
    .map((performer) => ({
      _id: performer._id,
      name: performer.name,
      username: performer.username,
      headline: performer.bio || 'High-performing creator account',
      metric: `${performer.subscriberCount || 0} members`,
      secondaryMetric: performer.isFreeSubscription ? 'Free funnel + paid unlocks' : `${formatCurrency(performer.monthlyPrice)}/month`,
      status: performer.live > 0 ? 'Live now' : performer.lastActiveText || 'Active today',
      href: `/creator/update/${performer._id}`
    }));

  const recentActivity = [
    ...stubState.subscriptions.map((item) => {
      const performer = findById(stubState.performers, item.performerId);
      const paidPlan = !['free', 'trial'].includes(item.subscriptionType);
      return {
        _id: `activity-subscription-${item._id}`,
        type: 'subscription',
        title: `${item.userInfo?.name || 'A fan'} subscribed to ${item.performerInfo?.name || 'a creator'}`,
        description: `${capitalizeLabel(item.subscriptionType)} plan via ${String(item.paymentGateway || 'system').toUpperCase()}`,
        amount: paidPlan ? formatCurrency(performer?.monthlyPrice || 19.99) : 'Free entry',
        status: item.status,
        href: '/subscription',
        createdAt: item.updatedAt || item.createdAt || initialTimestamp
      };
    }),
    ...stubState.orders.map((item) => ({
      _id: `activity-order-${item._id}`,
      type: 'order',
      title: `Order #${item.orderNumber} is ${capitalizeLabel(item.deliveryStatus)}`,
      description: `${item.userInfo?.name || 'A fan'} purchased ${item.productInfo?.name || 'a product'}`,
      amount: formatCurrency(item.totalPrice),
      status: item.deliveryStatus,
      href: '/order',
      createdAt: item.updatedAt || item.createdAt || initialTimestamp
    })),
    ...stubState.payoutRequests.map((item) => ({
      _id: `activity-payout-${item._id}`,
      type: 'payout',
      title: `${item.sourceInfo?.name || 'A creator'} payout ${capitalizeLabel(item.status)}`,
      description: `${item.paymentAccountType || 'manual'} payout request is in the finance queue`,
      amount: formatCurrency(item.requestTokens),
      status: item.status,
      href: '/payout-request',
      createdAt: item.updatedAt || item.createdAt || initialTimestamp
    })),
    ...pendingCreatorReviews.map((item) => ({
      _id: `activity-review-${item._id}`,
      type: 'review',
      title: `${item.name} is waiting for creator verification`,
      description: 'Document review queue needs management approval',
      amount: 'Pending review',
      status: 'review',
      href: '/creator',
      createdAt: item.updatedAt || item.createdAt || initialTimestamp
    }))
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return {
    queue: [
      {
        label: 'Creator reviews pending',
        value: pendingCreatorReviews.length,
        hint: 'Profiles waiting on ID verification'
      },
      {
        label: 'Payouts awaiting release',
        value: pendingPayouts.length,
        hint: `${formatCurrency(pendingPayouts.reduce((sum, item) => sum + Number(item.requestTokens || 0), 0))} in pending creator cashout`
      },
      {
        label: 'Live rooms right now',
        value: liveCreators,
        hint: 'Use this for a strong management demo moment'
      }
    ],
    spotlightCreators,
    recentActivity
  };
}

function requestHandler(req, res) {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  if (req.method === 'OPTIONS') {
    return send(res, 200, { ok: true });
  }

  if (req.method === 'GET' && url.pathname === '/') {
    return send(res, 200, { data: { ok: true, service: 'fansnest-local-stub-api' } });
  }

  if (req.method === 'GET' && url.pathname === '/settings/public') {
    return send(res, 200, { data: getPublicSettings() });
  }

  if (req.method === 'GET' && url.pathname === '/site-promo/search') {
    return send(res, 200, {
      data: {
        total: 0,
        data: []
      }
    });
  }

  if (req.method === 'GET' && url.pathname === '/user/feeds') {
    return send(res, 200, { data: toPaged(getFilteredFeeds(url), url, 24) });
  }

  if (req.method === 'GET' && url.pathname === '/streaming/user/search') {
    const items = getPublicPerformers().filter((performer) => performer.live > 0 || performer.isOnline > 0);
    return send(res, 200, { data: toPaged(items, url, 24) });
  }

  if (req.method === 'GET' && url.pathname === '/performers/search/random') {
    const items = [...getFilteredPerformers(url)].sort(() => 0.5 - Math.random());
    return send(res, 200, { data: toPaged(items, url, 12) });
  }

  if (req.method === 'GET' && url.pathname === '/admin/settings') {
    const group = String(url.searchParams.get('group') || '').trim();
    if (!group) {
      const all = Object.keys(settingsByGroup).flatMap((key) => settingsByGroup[key]);
      return send(res, 200, { data: all });
    }
    return send(res, 200, { data: settingsByGroup[group] || [] });
  }

  if (req.method === 'PUT' && url.pathname.startsWith('/admin/settings/')) {
    const key = decodeURIComponent(url.pathname.replace('/admin/settings/', ''));
    parseBody(req, (err, body) => {
      if (err) {
        send(res, 400, { message: 'Invalid JSON' });
        return;
      }
      const old = settingsByKey[key];
      const group = old?.group || 'general';
      const setting = old || createSetting({
        key,
        name: key,
        type: typeof body.value === 'boolean' ? 'boolean' : 'text',
        value: body.value,
        description: ''
      }, group, settingsByGroup[group]?.length || 0);
      setting.value = body.value;
      setting.updatedAt = now();

      if (!old) {
        if (!settingsByGroup[group]) settingsByGroup[group] = [];
        settingsByGroup[group].push(setting);
      }
      settingsByKey[key] = setting;
      send(res, 200, { data: setting });
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/admin/settings/files/upload') {
    readBody(req, () => {
      send(res, 200, {
        data: {
          _id: `stub-upload-${Date.now()}`,
          url: `/uploads/stub-${Date.now()}.png`,
          mimeType: 'image/png',
          name: 'stub.png'
        }
      });
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/mailer/verify') {
    return send(res, 200, {
      data: {
        hasError: false
      }
    });
  }

  if (req.method === 'POST' && url.pathname === '/auth/login') {
    parseBody(req, (err, body) => {
      if (err) {
        send(res, 400, { message: 'Invalid JSON' });
        return;
      }
      const username = String(body.username || body.email || '').toLowerCase().trim();
      const password = String(body.password || '').trim();
      const isAdminLogin = (username === 'admin' || username === 'admin@example.com')
        && (password === ADMIN_PLAIN_PASSWORD || password === ADMIN_HASH_PASSWORD);
      const isUserLogin = (username === 'user' || username === 'user@example.com')
        && (password === USER_PLAIN_PASSWORD || password === USER_HASH_PASSWORD);
      const isCreatorLogin = (username === 'creator1' || username === 'creator1@example.com')
        && (password === CREATOR_PLAIN_PASSWORD || password === CREATOR_HASH_PASSWORD);

      if (isAdminLogin) {
        send(res, 200, { data: { token: TOKENS.admin } });
        return;
      }
      if (isUserLogin) {
        send(res, 200, { data: { token: TOKENS.user } });
        return;
      }
      if (isCreatorLogin) {
        send(res, 200, { data: { token: TOKENS.creator } });
        return;
      }
      send(res, 404, { message: 'Not Found' });
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/users/me') {
    const token = normalizeToken(req.headers.authorization);
    const actor = getActorByToken(token);
    if (actor) return send(res, 200, { data: actorSummary(actor) });
    return send(res, 401, { message: 'Please login!' });
  }

  if (req.method === 'PUT' && url.pathname === '/users') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const token = normalizeToken(req.headers.authorization);
      if (token === TOKENS.admin) {
        const updated = upsertById(stubState.users, 'stub-admin-id', body);
        return send(res, 200, { data: updated || findById(stubState.users, 'stub-admin-id') });
      }
      if (token === TOKENS.user) {
        const updated = upsertById(stubState.users, 'stub-user-id', body);
        return send(res, 200, { data: updated || findById(stubState.users, 'stub-user-id') });
      }
      if (token === TOKENS.creator) {
        const updated = upsertById(stubState.users, 'stub-creator-user-id', body);
        return send(res, 200, { data: updated || findById(stubState.users, 'stub-creator-user-id') });
      }
      return send(res, 401, { message: 'Please login!' });
    });
  }

  if (req.method === 'POST' && url.pathname === '/users/avatar/upload') {
    return readBody(req, () => sendUploadResponse(res, 'avatar'));
  }

  if (req.method === 'GET' && url.pathname === '/performers/user/search') {
    return send(res, 200, { data: toPaged(getFilteredPerformers(url), url, 24) });
  }

  if (req.method === 'GET' && url.pathname === '/performers/top') {
    return send(res, 200, { data: toPaged(getFilteredPerformers(url), url, 24) });
  }

  if (req.method === 'GET' && url.pathname === '/performers/me') {
    const actor = getActorByToken(normalizeToken(req.headers.authorization));
    if (!actor?.performer) return send(res, 401, { message: 'Please login as creator!' });
    return send(res, 200, { data: actor.performer });
  }

  if (req.method === 'POST' && url.pathname === '/performers/avatar/upload') {
    return readBody(req, () => sendUploadResponse(res, 'avatar'));
  }

  if (req.method === 'POST' && url.pathname === '/performers/cover/upload') {
    return readBody(req, () => sendUploadResponse(res, 'cover'));
  }

  if (req.method === 'POST' && url.pathname === '/performers/welcome-video/upload') {
    return readBody(req, () => sendUploadResponse(res, 'video'));
  }

  if (req.method === 'POST' && url.pathname === '/performers/documents/upload') {
    return readBody(req, () => sendUploadResponse(res, 'document'));
  }

  const performerBankingMatch = url.pathname.match(/^\/performers\/([^/]+)\/banking-settings$/);
  if (performerBankingMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.performers, performerBankingMatch[1], {
        bankingSettings: body
      });
      return send(res, 200, { data: updated });
    });
  }

  const performerPaymentMatch = url.pathname.match(/^\/performers\/([^/]+)\/payment-gateway-settings$/);
  if (performerPaymentMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.performers, performerPaymentMatch[1], {
        paymentGatewaySettings: body
      });
      return send(res, 200, { data: updated });
    });
  }

  const performerByIdMatch = url.pathname.match(/^\/performers\/([^/]+)$/);
  if (performerByIdMatch && req.method === 'GET') {
    const item = stubState.performers.find((performer) => (
      performer._id === performerByIdMatch[1] || performer.username === performerByIdMatch[1]
    )) || null;
    return send(res, 200, { data: item });
  }
  if (performerByIdMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.performers, performerByIdMatch[1], body);
      return send(res, 200, { data: updated });
    });
  }

  if (req.method === 'GET' && url.pathname === '/performer/feeds') {
    return send(res, 200, { data: toPaged(stubState.feeds, url, 24) });
  }
  if (req.method === 'POST' && url.pathname === '/performer/feeds') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const actor = getActorByToken(normalizeToken(req.headers.authorization)) || {};
      const performer = actor.performer || stubState.performers[0];
      const item = {
        _id: makeId('feed'),
        type: body.type || 'text',
        text: body.text || 'New creator post',
        performerId: performer?._id || null,
        fromSourceId: performer?._id || null,
        performer: performer ? performerSummary(performer) : null,
        status: 'active',
        isSale: !!body.isSale,
        price: Number(body.price || 0),
        polls: Array.isArray(body.polls) ? body.polls : [],
        pollIds: Array.isArray(body.pollIds) ? body.pollIds : [],
        files: Array.isArray(body.files) ? body.files : [],
        fileIds: Array.isArray(body.fileIds) ? body.fileIds : [],
        totalLike: Number(body.totalLike || 0),
        totalComment: Number(body.totalComment || 0),
        totalBookmark: Number(body.totalBookmark || 0),
        isLiked: false,
        isBookMarked: false,
        isSubscribed: true,
        isBought: false,
        updatedAt: now(),
        createdAt: now()
      };
      stubState.feeds.unshift(item);
      return send(res, 200, { data: item });
    });
  }
  if (req.method === 'POST'
    && ['/performer/feeds/photo/upload', '/performer/feeds/video/upload', '/performer/feeds/audio/upload', '/performer/feeds/thumbnail/upload', '/performer/feeds/teaser/upload'].includes(url.pathname)
  ) {
    return readBody(req, () => send(res, 200, { data: { _id: makeId('feed-file'), url: `/uploads/${Date.now()}.dat` } }));
  }
  if (req.method === 'POST' && url.pathname === '/performer/feeds/polls') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: { _id: makeId('poll'), ...body } });
    });
  }
  const performerFeedMatch = url.pathname.match(/^\/performer\/feeds\/([^/]+)$/);
  if (performerFeedMatch && req.method === 'GET') {
    return send(res, 200, { data: findById(stubState.feeds, performerFeedMatch[1]) || null });
  }
  if (performerFeedMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: upsertById(stubState.feeds, performerFeedMatch[1], body) });
    });
  }
  if (performerFeedMatch && req.method === 'DELETE') {
    deleteById(stubState.feeds, performerFeedMatch[1]);
    return send(res, 200, { data: true });
  }

  if (req.method === 'GET' && url.pathname === '/performer/performer-assets/galleries/search') {
    return send(res, 200, { data: toPaged(stubState.galleries, url, 24) });
  }
  if (req.method === 'GET' && url.pathname === '/performer-assets/galleries/search') {
    return send(res, 200, { data: toPaged(stubState.galleries, url, 24) });
  }
  if (req.method === 'POST' && url.pathname === '/performer/performer-assets/galleries') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const actor = getActorByToken(normalizeToken(req.headers.authorization)) || {};
      const performer = actor.performer || stubState.performers[0];
      const item = {
        _id: makeId('gallery'),
        performerId: performer?._id || null,
        performer: performer ? performerSummary(performer) : null,
        title: body.title || 'New gallery',
        description: body.description || '',
        isSale: !!body.isSale,
        price: body.price || 0,
        numOfItems: 0,
        status: 'active',
        coverPhoto: { _id: makeId('gallery-cover'), url: '/default-banner.jpeg' },
        updatedAt: now(),
        createdAt: now()
      };
      stubState.galleries.unshift(item);
      return send(res, 200, { data: item });
    });
  }
  const performerGalleryMatch = url.pathname.match(/^\/performer\/performer-assets\/galleries\/([^/]+)(?:\/view)?$/);
  if (performerGalleryMatch && req.method === 'GET') {
    return send(res, 200, { data: findById(stubState.galleries, performerGalleryMatch[1]) || null });
  }
  if (performerGalleryMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: upsertById(stubState.galleries, performerGalleryMatch[1], body) });
    });
  }
  if (performerGalleryMatch && req.method === 'DELETE') {
    deleteById(stubState.galleries, performerGalleryMatch[1]);
    return send(res, 200, { data: true });
  }
  const publicGalleryMatch = url.pathname.match(/^\/performer-assets\/galleries\/([^/]+)\/view$/);
  if (publicGalleryMatch && req.method === 'GET') {
    return send(res, 200, { data: findById(stubState.galleries, publicGalleryMatch[1]) || null });
  }

  if (req.method === 'GET' && url.pathname === '/performer/performer-assets/videos/search') {
    return send(res, 200, { data: toPaged(stubState.videos, url, 24) });
  }
  if (req.method === 'GET' && url.pathname === '/performer-assets/videos/search') {
    return send(res, 200, { data: toPaged(stubState.videos, url, 24) });
  }
  if (req.method === 'POST' && url.pathname === '/performer/performer-assets/videos/upload') {
    return readBody(req, () => {
      const actor = getActorByToken(normalizeToken(req.headers.authorization)) || {};
      const performer = actor.performer || stubState.performers[0];
      const item = {
        _id: makeId('video'),
        performerId: performer?._id || null,
        performer: performer ? performerSummary(performer) : null,
        title: 'Uploaded video',
        description: 'Local demo upload',
        tags: [],
        participantIds: [performer?._id].filter(Boolean),
        isSale: false,
        isSchedule: false,
        price: 0,
        status: 'active',
        thumbnail: { _id: makeId('thumb'), name: 'thumb.jpg', url: '/default-banner.jpeg' },
        teaser: { _id: makeId('teaser'), name: 'teaser.mp4', url: '/uploads/teaser.mp4' },
        video: { _id: makeId('video-file'), name: 'video.mp4', url: '/uploads/video.mp4' },
        updatedAt: now(),
        createdAt: now()
      };
      stubState.videos.unshift(item);
      send(res, 200, { data: item });
    });
  }
  const performerVideoMatch = url.pathname.match(/^\/performer\/performer-assets\/videos\/([^/]+)(?:\/view)?$/);
  if (performerVideoMatch && req.method === 'GET') {
    return send(res, 200, { data: findById(stubState.videos, performerVideoMatch[1]) || null });
  }
  const publicVideoMatch = url.pathname.match(/^\/performer-assets\/videos\/([^/]+)$/);
  if (publicVideoMatch && req.method === 'GET') {
    return send(res, 200, { data: findById(stubState.videos, publicVideoMatch[1]) || null });
  }

  if (req.method === 'GET' && url.pathname === '/performer/performer-assets/products/search') {
    return send(res, 200, { data: toPaged(stubState.products, url, 24) });
  }
  if (req.method === 'POST' && url.pathname === '/performer/performer-assets/products') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const actor = getActorByToken(normalizeToken(req.headers.authorization)) || {};
      const performer = actor.performer || stubState.performers[0];
      const item = {
        _id: makeId('product'),
        performerId: performer?._id || null,
        performer: performer ? performerSummary(performer) : null,
        name: body.name || 'New product',
        description: body.description || '',
        type: body.type || 'digital',
        stock: body.stock || 10,
        price: body.price || 9.99,
        status: 'active',
        image: '/product.png',
        updatedAt: now(),
        createdAt: now()
      };
      stubState.products.unshift(item);
      return send(res, 200, { data: item });
    });
  }

  if (req.method === 'GET' && url.pathname === '/orders/users/search') {
    const actor = getActorByToken(normalizeToken(req.headers.authorization));
    const items = actor?.user ? stubState.orders.filter((item) => item.userInfo?._id === actor.user._id) : [];
    return send(res, 200, { data: toPaged(items, url, 24) });
  }

  if (req.method === 'GET' && url.pathname === '/payment/transactions/user/search') {
    return send(res, 200, { data: toPaged(stubState.paymentTransactions, url, 24) });
  }

  if (req.method === 'POST' && url.pathname === '/payment/wallet/top-up') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const actor = getActorByToken(normalizeToken(req.headers.authorization)) || {};
      const amount = Number(body.amount || 0);
      if (actor.user) actor.user.balance = Number((actor.user.balance || 0)) + amount;
      const item = {
        _id: makeId('wallet-charge'),
        sourceInfo: userSummary(actor.user || stubState.users[1]),
        performerInfo: performerSummary(stubState.performers[0]),
        products: [{ name: 'Wallet Top-up', description: 'Local demo top-up' }],
        totalPrice: amount,
        type: 'wallet_topup',
        status: 'success',
        updatedAt: now(),
        createdAt: now()
      };
      stubState.walletCharges.unshift(item);
      return send(res, 200, { data: item });
    });
  }

  const applyCouponMatch = url.pathname.match(/^\/coupons\/([^/]+)\/apply-coupon$/);
  if (applyCouponMatch && req.method === 'POST') {
    const item = stubState.coupons.find((coupon) => coupon.code === applyCouponMatch[1]) || null;
    return send(res, 200, { data: item });
  }

  if (req.method === 'GET' && url.pathname === '/payment-cards') {
    return send(res, 200, { data: toPaged(stubState.paymentCards, url, 24) });
  }
  const gatewayCardMatch = url.pathname.match(/^\/([^/]+)\/cards$/);
  if (gatewayCardMatch && req.method === 'POST') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const item = {
        _id: makeId('card'),
        brand: body.brand || gatewayCardMatch[1],
        last4: body.last4 || '4242',
        isDefault: stubState.paymentCards.length === 0,
        updatedAt: now(),
        createdAt: now()
      };
      stubState.paymentCards.unshift(item);
      return send(res, 200, { data: item });
    });
  }
  const paymentCardDeleteMatch = url.pathname.match(/^\/payment-cards\/([^/]+)$/);
  if (paymentCardDeleteMatch && req.method === 'DELETE') {
    deleteById(stubState.paymentCards, paymentCardDeleteMatch[1]);
    return send(res, 200, { data: true });
  }

  if (req.method === 'POST' && url.pathname === '/payment/subscribe/performers') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const actor = getActorByToken(normalizeToken(req.headers.authorization)) || {};
      const performer = findById(stubState.performers, body.performerId) || stubState.performers[0];
      const item = {
        _id: makeId('subscription'),
        subscriptionId: `SUB-${Math.floor(Math.random() * 100000)}`,
        userId: actor.user?._id || 'stub-user-id',
        performerId: performer?._id || null,
        userInfo: userSummary(actor.user || stubState.users[1]),
        performerInfo: performer ? performerSummary(performer) : null,
        subscriptionType: body.subscriptionType || 'monthly',
        paymentGateway: 'stripe',
        status: 'active',
        expiredAt: '2027-12-31T00:00:00.000Z',
        nextRecurringDate: null,
        updatedAt: now(),
        createdAt: now()
      };
      stubState.subscriptions.unshift(item);
      return send(res, 200, { data: item });
    });
  }

  if (req.method === 'GET' && url.pathname === '/payout-requests/search') {
    return send(res, 200, { data: toPaged(stubState.payoutRequests, url, 24) });
  }
  if (req.method === 'POST' && url.pathname === '/payout-requests') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const actor = getActorByToken(normalizeToken(req.headers.authorization)) || {};
      const performer = actor.performer || stubState.performers[0];
      const item = {
        _id: makeId('payout'),
        sourceId: performer?._id || null,
        sourceInfo: performer ? performerSummary(performer) : null,
        requestTokens: Number(body.requestTokens || body.requestPrice || 50),
        requestNote: body.requestNote || 'Local demo payout request',
        adminNote: '',
        paymentAccountType: 'paypal',
        paymentAccountInfo: { value: { email: performer?.email || 'creator@example.com' } },
        status: 'pending',
        updatedAt: now(),
        createdAt: now()
      };
      stubState.payoutRequests.unshift(item);
      return send(res, 200, { data: item });
    });
  }
  if (req.method === 'POST' && url.pathname === '/payout-requests/calculate') {
    return send(res, 200, { data: { price: 120.5, tokens: 120.5 } });
  }
  if (req.method === 'GET' && url.pathname === '/payout-requests/check/pending-review') {
    return send(res, 200, { data: { pending: stubState.payoutRequests.some((item) => item.status === 'pending') } });
  }
  const payoutViewMatch = url.pathname.match(/^\/payout-requests\/([^/]+)\/view$/);
  if (payoutViewMatch && req.method === 'GET') {
    return send(res, 200, { data: findById(stubState.payoutRequests, payoutViewMatch[1]) || null });
  }
  const payoutCrudMatch = url.pathname.match(/^\/payout-requests\/([^/]+)$/);
  if (payoutCrudMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: upsertById(stubState.payoutRequests, payoutCrudMatch[1], body) });
    });
  }

  if (req.method === 'GET' && url.pathname === '/conversations') {
    return send(res, 200, { data: toPaged(stubState.conversations, url, 24) });
  }
  if (req.method === 'GET' && url.pathname === '/conversations/search') {
    return send(res, 200, { data: toPaged(stubState.conversations, url, 24) });
  }
  if (req.method === 'POST' && url.pathname === '/conversations') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const performer = findById(stubState.performers, body.recipientId || body.sourceId) || stubState.performers[0];
      const item = {
        _id: makeId('conversation'),
        name: performer?.name || 'New conversation',
        type: body.type || 'private',
        source: body.source || 'performer',
        sourceId: performer?._id || null,
        recipientInfo: performer ? performerSummary(performer) : null,
        totalNotSeenMessages: 0,
        lastMessage: '',
        lastMessageCreatedAt: now(),
        updatedAt: now(),
        createdAt: now()
      };
      stubState.conversations.unshift(item);
      return send(res, 200, { data: item });
    });
  }
  const conversationMatch = url.pathname.match(/^\/conversations\/([^/]+)$/);
  if (conversationMatch && req.method === 'GET') {
    return send(res, 200, { data: findById(stubState.conversations, conversationMatch[1]) || null });
  }
  const conversationUpdateMatch = url.pathname.match(/^\/conversations\/([^/]+)\/update$/);
  if (conversationUpdateMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: upsertById(stubState.conversations, conversationUpdateMatch[1], body) });
    });
  }

  if (req.method === 'GET' && url.pathname === '/messages/counting-not-read-messages') {
    const total = stubState.conversations.reduce((sum, item) => sum + (item.totalNotSeenMessages || 0), 0);
    return send(res, 200, { data: { total } });
  }
  const messagesMatch = url.pathname.match(/^\/messages\/conversations\/([^/]+)$/);
  if (messagesMatch && req.method === 'GET') {
    const items = stubState.messages.filter((item) => item.conversationId === messagesMatch[1]);
    return send(res, 200, { data: toPaged(items, url, 50) });
  }
  if (messagesMatch && req.method === 'POST') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const actor = getActorByToken(normalizeToken(req.headers.authorization)) || {};
      const senderInfo = actor.performer ? performerSummary(actor.performer) : userSummary(actor.user || stubState.users[1]);
      const item = {
        _id: makeId('message'),
        conversationId: messagesMatch[1],
        senderId: senderInfo?._id || 'stub-user-id',
        senderInfo,
        text: body.text || body.content || 'Local demo message',
        type: 'text',
        createdAt: now(),
        updatedAt: now()
      };
      stubState.messages.push(item);
      upsertById(stubState.conversations, messagesMatch[1], {
        lastMessage: item.text,
        lastMessageCreatedAt: item.createdAt,
        totalNotSeenMessages: 1
      });
      return send(res, 200, { data: item });
    });
  }
  const readAllMessagesMatch = url.pathname.match(/^\/messages\/read-all\/([^/]+)$/);
  if (readAllMessagesMatch && req.method === 'POST') {
    const updated = upsertById(stubState.conversations, readAllMessagesMatch[1], { totalNotSeenMessages: 0 });
    return send(res, 200, { data: updated || { _id: readAllMessagesMatch[1], totalNotSeenMessages: 0 } });
  }

  if (req.method === 'POST' && url.pathname === '/reactions') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: { _id: makeId('reaction'), ...body } });
    });
  }
  if (req.method === 'DELETE' && url.pathname === '/reactions') {
    return send(res, 200, { data: true });
  }
  const reactionBookmarkMatch = url.pathname.match(/^\/reactions\/([^/]+)\/bookmark$/);
  if (reactionBookmarkMatch && req.method === 'GET') {
    return send(res, 200, { data: toPaged([], url, 24) });
  }

  if (req.method === 'GET' && url.pathname === '/admin/statistics') {
    return send(res, 200, { data: getAdminStatistics() });
  }

  if (req.method === 'GET' && url.pathname === '/admin/dashboard/activity') {
    return send(res, 200, { data: getAdminDashboardActivity() });
  }

  if (req.method === 'POST' && url.pathname === '/settings/keys') {
    parseBody(req, (err, body) => {
      if (err) {
        send(res, 400, { message: 'Invalid JSON' });
        return;
      }
      const keys = Array.isArray(body.keys) ? body.keys : [];
      const out = {};
      for (const key of keys) {
        if (settingsByKey[key]) out[key] = settingsByKey[key].value;
        else out[key] = keyMap[key] || '';
      }
      send(res, 200, { data: out });
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/countries/list') {
    return send(res, 200, {
      data: [
        { code: 'US', name: 'United States', flag: 'https://flagcdn.com/us.svg' },
        { code: 'IN', name: 'India', flag: 'https://flagcdn.com/in.svg' }
      ]
    });
  }

  if (req.method === 'GET' && url.pathname === '/languages/list') {
    return send(res, 200, {
      data: [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' }
      ]
    });
  }

  if (req.method === 'GET' && url.pathname === '/phone-codes/list') {
    return send(res, 200, {
      data: [
        { code: '+1', name: 'United States (+1)', countryCode: 'US' },
        { code: '+91', name: 'India (+91)', countryCode: 'IN' }
      ]
    });
  }

  if (req.method === 'GET' && url.pathname === '/user-additional') {
    return send(res, 200, {
      data: {
        bodyTypes: [],
        ethnicities: [],
        heights: [],
        weights: [],
        eyes: [],
        hairs: [],
        butts: []
      }
    });
  }

  if (req.method === 'GET' && url.pathname === '/mailer/templates') {
    return send(res, 200, { data: stubState.emailTemplates });
  }

  const emailTemplateMatch = url.pathname.match(/^\/mailer\/templates\/([^/]+)$/);
  if (emailTemplateMatch && req.method === 'GET') {
    const item = findById(stubState.emailTemplates, emailTemplateMatch[1]) || stubState.emailTemplates[0];
    return send(res, 200, { data: item || null });
  }
  if (emailTemplateMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const id = emailTemplateMatch[1];
      const updated = upsertById(stubState.emailTemplates, id, body)
        || { _id: id, ...body, updatedAt: now(), createdAt: now() };
      if (!findById(stubState.emailTemplates, id)) stubState.emailTemplates.push(updated);
      return send(res, 200, { data: updated });
    });
  }

  if (req.method === 'GET' && url.pathname === '/admin/block/countries') {
    return send(res, 200, { data: stubState.blockCountries });
  }
  if (req.method === 'POST' && url.pathname === '/admin/block/countries') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const countryCode = String(body.countryCode || '').toUpperCase().trim();
      if (!countryCode) return send(res, 400, { message: 'Missing countryCode' });
      const exists = stubState.blockCountries.find((c) => c.countryCode === countryCode);
      if (exists) return send(res, 200, { data: exists });
      const item = { _id: makeId('block-country'), countryCode, createdAt: now(), updatedAt: now() };
      stubState.blockCountries.push(item);
      return send(res, 200, { data: item });
    });
  }
  const blockCountryMatch = url.pathname.match(/^\/admin\/block\/countries\/([^/]+)$/);
  if (blockCountryMatch && req.method === 'DELETE') {
    const code = String(blockCountryMatch[1] || '').toUpperCase();
    stubState.blockCountries = stubState.blockCountries.filter((c) => c.countryCode !== code);
    return send(res, 200, { data: { success: true } });
  }

  if (req.method === 'GET' && url.pathname === '/admin/posts/search') {
    return send(res, 200, { data: toPaged(stubState.posts, url, 100) });
  }
  if (req.method === 'POST' && url.pathname === '/admin/posts') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const title = body.title || 'Untitled';
      const slug = String(body.slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const item = {
        _id: makeId('post'),
        title,
        slug,
        shortDescription: body.shortDescription || '',
        content: body.content || '',
        type: body.type || 'page',
        status: body.status || 'published',
        ordering: typeof body.ordering === 'number' ? body.ordering : 0,
        updatedAt: now(),
        createdAt: now()
      };
      stubState.posts.push(item);
      return send(res, 200, { data: item });
    });
  }
  const postViewMatch = url.pathname.match(/^\/admin\/posts\/([^/]+)\/view$/);
  if (postViewMatch && req.method === 'GET') {
    const item = findById(stubState.posts, postViewMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  const postCrudMatch = url.pathname.match(/^\/admin\/posts\/([^/]+)$/);
  if (postCrudMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.posts, postCrudMatch[1], body);
      return send(res, 200, { data: updated || null });
    });
  }
  if (postCrudMatch && req.method === 'DELETE') {
    deleteById(stubState.posts, postCrudMatch[1]);
    return send(res, 200, { data: { success: true } });
  }

  if (req.method === 'GET' && url.pathname === '/menus/admin/search') {
    return send(res, 200, { data: toPaged(stubState.menus, url, 100) });
  }
  if (req.method === 'POST' && url.pathname === '/menus/admin') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const item = {
        _id: makeId('menu'),
        title: body.title || 'Untitled',
        path: body.path || '/',
        internal: !!body.internal,
        section: body.section || 'footer',
        ordering: typeof body.ordering === 'number' ? body.ordering : 0,
        updatedAt: now(),
        createdAt: now()
      };
      stubState.menus.push(item);
      return send(res, 200, { data: item });
    });
  }
  const menuViewMatch = url.pathname.match(/^\/menus\/admin\/([^/]+)\/view$/);
  if (menuViewMatch && req.method === 'GET') {
    const item = findById(stubState.menus, menuViewMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  const menuCrudMatch = url.pathname.match(/^\/menus\/admin\/([^/]+)$/);
  if (menuCrudMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.menus, menuCrudMatch[1], body);
      return send(res, 200, { data: updated || null });
    });
  }
  if (menuCrudMatch && req.method === 'DELETE') {
    deleteById(stubState.menus, menuCrudMatch[1]);
    return send(res, 200, { data: { success: true } });
  }

  if (req.method === 'GET' && url.pathname === '/admin/coupons') {
    return send(res, 200, { data: toPaged(stubState.coupons, url, 100) });
  }
  if (req.method === 'POST' && url.pathname === '/admin/coupons') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const item = {
        _id: makeId('coupon'),
        name: body.name || 'COUPON',
        code: body.code || `CODE${Math.floor(Math.random() * 9999)}`,
        value: Number(body.value) || 0.1,
        numberOfUses: Number(body.numberOfUses) || 1,
        status: body.status || 'active',
        expiredDate: body.expiredDate || '2027-12-31T00:00:00.000Z',
        updatedAt: now(),
        createdAt: now()
      };
      stubState.coupons.push(item);
      return send(res, 200, { data: item });
    });
  }
  const couponViewMatch = url.pathname.match(/^\/admin\/coupons\/([^/]+)\/view$/);
  if (couponViewMatch && req.method === 'GET') {
    const item = findById(stubState.coupons, couponViewMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  const couponCrudMatch = url.pathname.match(/^\/admin\/coupons\/([^/]+)$/);
  if (couponCrudMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.coupons, couponCrudMatch[1], body);
      return send(res, 200, { data: updated || null });
    });
  }
  if (couponCrudMatch && req.method === 'DELETE') {
    deleteById(stubState.coupons, couponCrudMatch[1]);
    return send(res, 200, { data: { success: true } });
  }

  if (req.method === 'GET' && url.pathname === '/admin/banner/search') {
    return send(res, 200, { data: toPaged(stubState.banners, url, 100) });
  }
  if (req.method === 'POST' && url.pathname === '/admin/banner/upload') {
    return readBody(req, () => {
      const item = {
        _id: makeId('banner'),
        title: 'Uploaded banner',
        description: '',
        position: 'top',
        status: 'active',
        photo: { _id: makeId('banner-file'), url: '/banner-image.jpg' },
        updatedAt: now(),
        createdAt: now()
      };
      stubState.banners.push(item);
      return send(res, 200, { data: item });
    });
  }
  const bannerViewMatch = url.pathname.match(/^\/admin\/banner\/([^/]+)\/view$/);
  if (bannerViewMatch && req.method === 'GET') {
    const item = findById(stubState.banners, bannerViewMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  const bannerCrudMatch = url.pathname.match(/^\/admin\/banner\/([^/]+)$/);
  if (bannerCrudMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.banners, bannerCrudMatch[1], body);
      return send(res, 200, { data: updated || null });
    });
  }
  if (bannerCrudMatch && req.method === 'DELETE') {
    deleteById(stubState.banners, bannerCrudMatch[1]);
    return send(res, 200, { data: { success: true } });
  }

  if (req.method === 'GET' && url.pathname === '/admin/users/search') {
    return send(res, 200, { data: toPaged(stubState.users, url, 100) });
  }
  if (req.method === 'POST' && url.pathname === '/admin/users') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const item = {
        _id: makeId('user'),
        username: body.username || makeId('usern').slice(-8),
        name: body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim() || 'New User',
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        email: body.email || `${makeId('mail').slice(-6)}@example.com`,
        avatar: '/no-avatar.jpg',
        roles: Array.isArray(body.roles) && body.roles.length ? body.roles : ['user'],
        status: body.status || 'active',
        verifiedEmail: !!body.verifiedEmail,
        updatedAt: now(),
        createdAt: now()
      };
      stubState.users.push(item);
      return send(res, 200, { data: item });
    });
  }
  const userViewMatch = url.pathname.match(/^\/admin\/users\/([^/]+)\/view$/);
  if (userViewMatch && req.method === 'GET') {
    const item = findById(stubState.users, userViewMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  const userAvatarUploadMatch = url.pathname.match(/^\/admin\/users\/([^/]+)\/avatar\/upload$/);
  if (userAvatarUploadMatch && req.method === 'POST') {
    return readBody(req, () => sendUploadResponse(res, 'avatar'));
  }
  const userDeleteMatch = url.pathname.match(/^\/admin\/users\/([^/]+)\/delete$/);
  if (userDeleteMatch && req.method === 'DELETE') {
    deleteById(stubState.users, userDeleteMatch[1]);
    return send(res, 200, { data: { success: true } });
  }
  const userCrudMatch = url.pathname.match(/^\/admin\/users\/([^/]+)$/);
  if (userCrudMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.users, userCrudMatch[1], body);
      return send(res, 200, { data: updated || null });
    });
  }

  if (req.method === 'GET' && url.pathname === '/admin/performers/search') {
    return send(res, 200, { data: toPaged(stubState.performers, url, 100) });
  }
  if (req.method === 'POST' && url.pathname === '/admin/performers') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const item = {
        _id: makeId('performer'),
        username: body.username || makeId('creator').slice(-8),
        name: body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim() || 'New Creator',
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        email: body.email || `${makeId('performer-mail').slice(-6)}@example.com`,
        avatar: '/no-avatar.jpg',
        cover: '/default-banner.jpeg',
        status: body.status || 'active',
        verifiedEmail: !!body.verifiedEmail,
        verifiedDocument: !!body.verifiedDocument,
        verifiedAccount: !!body.verifiedAccount,
        isFeatured: !!body.isFeatured,
        isOnline: 0,
        isFreeSubscription: true,
        live: 0,
        country: body.country || 'US',
        dateOfBirth: body.dateOfBirth || '1998-01-15T00:00:00.000Z',
        updatedAt: now(),
        createdAt: now()
      };
      stubState.performers.push(item);
      return send(res, 200, { data: item });
    });
  }
  const performerViewMatch = url.pathname.match(/^\/admin\/performers\/([^/]+)\/view$/);
  if (performerViewMatch && req.method === 'GET') {
    const item = findById(stubState.performers, performerViewMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  const performerAvatarUploadMatch = url.pathname.match(/^\/admin\/performers\/([^/]+)\/avatar\/upload$/);
  if (performerAvatarUploadMatch && req.method === 'POST') {
    return readBody(req, () => sendUploadResponse(res, 'avatar'));
  }
  const performerCoverUploadMatch = url.pathname.match(/^\/admin\/performers\/([^/]+)\/cover\/upload$/);
  if (performerCoverUploadMatch && req.method === 'POST') {
    return readBody(req, () => sendUploadResponse(res, 'cover'));
  }
  const performerWelcomeUploadMatch = url.pathname.match(/^\/admin\/performers\/([^/]+)\/welcome-video\/upload$/);
  if (performerWelcomeUploadMatch && req.method === 'POST') {
    return readBody(req, () => sendUploadResponse(res, 'video'));
  }
  if (req.method === 'POST' && url.pathname === '/admin/performers/documents/upload') {
    return readBody(req, () => sendUploadResponse(res, 'document'));
  }
  const performerDocumentUploadMatch = url.pathname.match(/^\/admin\/performers\/documents\/upload\/([^/]+)$/);
  if (performerDocumentUploadMatch && req.method === 'POST') {
    return readBody(req, () => sendUploadResponse(res, 'document'));
  }
  const performerDeleteMatch = url.pathname.match(/^\/admin\/performers\/([^/]+)\/delete$/);
  if (performerDeleteMatch && req.method === 'DELETE') {
    deleteById(stubState.performers, performerDeleteMatch[1]);
    return send(res, 200, { data: { success: true } });
  }
  const performerPaymentSettingMatch = url.pathname.match(/^\/admin\/performers\/([^/]+)\/payment-gateway-settings$/);
  if (performerPaymentSettingMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: { performerId: performerPaymentSettingMatch[1], ...body } });
    });
  }
  const performerCommissionSettingMatch = url.pathname.match(/^\/admin\/performers\/([^/]+)\/commission-settings$/);
  if (performerCommissionSettingMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: { performerId: performerCommissionSettingMatch[1], ...body } });
    });
  }
  const performerBankingSettingMatch = url.pathname.match(/^\/admin\/performers\/([^/]+)\/banking-settings$/);
  if (performerBankingSettingMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: { performerId: performerBankingSettingMatch[1], ...body } });
    });
  }
  const performerCrudMatch = url.pathname.match(/^\/admin\/performers\/([^/]+)$/);
  if (performerCrudMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.performers, performerCrudMatch[1], body);
      return send(res, 200, { data: updated || null });
    });
  }

  if (req.method === 'GET' && url.pathname === '/admin/performer-categories/search') {
    return send(res, 200, { data: toPaged(stubState.categories, url, 100) });
  }
  if (req.method === 'POST' && url.pathname === '/admin/performer-categories') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const item = {
        _id: makeId('category'),
        name: body.name || 'Category',
        slug: body.slug || (body.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ordering: typeof body.ordering === 'number' ? body.ordering : 0,
        description: body.description || '',
        updatedAt: now(),
        createdAt: now()
      };
      stubState.categories.push(item);
      return send(res, 200, { data: item });
    });
  }
  const categoryViewMatch = url.pathname.match(/^\/admin\/performer-categories\/([^/]+)\/view$/);
  if (categoryViewMatch && req.method === 'GET') {
    const item = findById(stubState.categories, categoryViewMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  const categoryCrudMatch = url.pathname.match(/^\/admin\/performer-categories\/([^/]+)$/);
  if (categoryCrudMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.categories, categoryCrudMatch[1], body);
      return send(res, 200, { data: updated || null });
    });
  }
  if (categoryCrudMatch && req.method === 'DELETE') {
    deleteById(stubState.categories, categoryCrudMatch[1]);
    return send(res, 200, { data: { success: true } });
  }

  if (req.method === 'GET' && url.pathname === '/admin/feeds') {
    return send(res, 200, { data: toPaged(stubState.feeds, url, 100) });
  }
  if (req.method === 'POST' && url.pathname === '/admin/feeds/polls') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: { _id: makeId('poll'), ...body } });
    });
  }
  if (req.method === 'POST' && url.pathname === '/admin/feeds') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const performer = findById(stubState.performers, body.fromSourceId) || stubState.performers[0];
      const item = {
        _id: makeId('feed'),
        type: body.type || 'text',
        text: body.text || '',
        performerId: performer?._id || null,
        fromSourceId: performer?._id || null,
        performer: performer ? performerSummary(performer) : null,
        status: body.status || 'active',
        isSale: !!body.isSale,
        price: Number(body.price || 0),
        polls: Array.isArray(body.polls) ? body.polls : [],
        pollIds: Array.isArray(body.pollIds) ? body.pollIds : [],
        files: Array.isArray(body.files) ? body.files : [],
        fileIds: Array.isArray(body.fileIds) ? body.fileIds : [],
        totalLike: Number(body.totalLike || 0),
        totalComment: Number(body.totalComment || 0),
        totalBookmark: Number(body.totalBookmark || 0),
        isLiked: false,
        isBookMarked: false,
        isSubscribed: true,
        isBought: false,
        updatedAt: now(),
        createdAt: now()
      };
      stubState.feeds.push(item);
      return send(res, 200, { data: item });
    });
  }
  if (
    req.method === 'POST'
    && ['/admin/feeds/photo/upload', '/admin/feeds/video/upload', '/admin/feeds/audio/upload', '/admin/feeds/thumbnail/upload', '/admin/feeds/teaser/upload'].includes(url.pathname)
  ) {
    return readBody(req, () => send(res, 200, { data: { _id: makeId('feed-file'), url: `/uploads/${Date.now()}.dat` } }));
  }
  const feedItemMatch = url.pathname.match(/^\/admin\/feeds\/([^/]+)$/);
  if (feedItemMatch && req.method === 'GET') {
    const item = findById(stubState.feeds, feedItemMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  if (feedItemMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.feeds, feedItemMatch[1], body);
      return send(res, 200, { data: updated || null });
    });
  }
  if (feedItemMatch && req.method === 'DELETE') {
    deleteById(stubState.feeds, feedItemMatch[1]);
    return send(res, 200, { data: { success: true } });
  }

  if (req.method === 'GET' && url.pathname === '/admin/performer-assets/galleries/search') {
    return send(res, 200, { data: toPaged(stubState.galleries, url, 100) });
  }
  if (req.method === 'POST' && url.pathname === '/admin/performer-assets/galleries') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const performer = findById(stubState.performers, body.performerId) || stubState.performers[0];
      const item = {
        _id: makeId('gallery'),
        performerId: performer?._id || null,
        performer: performer ? performerSummary(performer) : null,
        title: body.title || 'Gallery',
        description: body.description || '',
        isSale: !!body.isSale,
        price: Number(body.price) || 0,
        numOfItems: 0,
        status: body.status || 'active',
        coverPhoto: { _id: makeId('gallery-cover'), url: '/default-banner.jpeg' },
        updatedAt: now(),
        createdAt: now()
      };
      stubState.galleries.push(item);
      return send(res, 200, { data: item });
    });
  }
  const galleryViewMatch = url.pathname.match(/^\/admin\/performer-assets\/galleries\/([^/]+)\/view$/);
  if (galleryViewMatch && req.method === 'GET') {
    const item = findById(stubState.galleries, galleryViewMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  const galleryCrudMatch = url.pathname.match(/^\/admin\/performer-assets\/galleries\/([^/]+)$/);
  if (galleryCrudMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.galleries, galleryCrudMatch[1], body);
      return send(res, 200, { data: updated || null });
    });
  }
  if (galleryCrudMatch && req.method === 'DELETE') {
    deleteById(stubState.galleries, galleryCrudMatch[1]);
    return send(res, 200, { data: { success: true } });
  }

  if (req.method === 'GET' && url.pathname === '/admin/performer-assets/photos/search') {
    return send(res, 200, { data: toPaged(stubState.photos, url, 100) });
  }
  if (req.method === 'POST' && url.pathname === '/admin/performer-assets/photos/upload') {
    return readBody(req, () => send(res, 200, { data: { _id: makeId('photo-file'), url: '/no-image.jpg' } }));
  }
  const photoViewMatch = url.pathname.match(/^\/admin\/performer-assets\/photos\/([^/]+)\/view$/);
  if (photoViewMatch && req.method === 'GET') {
    const item = findById(stubState.photos, photoViewMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  const photoCrudMatch = url.pathname.match(/^\/admin\/performer-assets\/photos\/([^/]+)$/);
  if (photoCrudMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.photos, photoCrudMatch[1], body);
      return send(res, 200, { data: updated || null });
    });
  }
  if (photoCrudMatch && req.method === 'DELETE') {
    deleteById(stubState.photos, photoCrudMatch[1]);
    return send(res, 200, { data: { success: true } });
  }

  if (req.method === 'GET' && url.pathname === '/admin/performer-assets/videos/search') {
    return send(res, 200, { data: toPaged(stubState.videos, url, 100) });
  }
  if (req.method === 'POST' && url.pathname === '/admin/performer-assets/videos/upload') {
    return readBody(req, () => send(res, 200, { data: { _id: makeId('video-file'), url: '/default-video.mp4' } }));
  }
  const videoViewMatch = url.pathname.match(/^\/admin\/performer-assets\/videos\/([^/]+)\/view$/);
  if (videoViewMatch && req.method === 'GET') {
    const item = findById(stubState.videos, videoViewMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  const videoEditMatch = url.pathname.match(/^\/admin\/performer-assets\/videos\/edit\/([^/]+)$/);
  if (videoEditMatch && req.method === 'PUT') {
    return readBody(req, () => send(res, 200, { data: findById(stubState.videos, videoEditMatch[1]) || null }));
  }
  const videoCrudMatch = url.pathname.match(/^\/admin\/performer-assets\/videos\/([^/]+)$/);
  if (videoCrudMatch && req.method === 'DELETE') {
    deleteById(stubState.videos, videoCrudMatch[1]);
    return send(res, 200, { data: { success: true } });
  }
  const videoRemoveFileMatch = url.pathname.match(/^\/admin\/performer-assets\/videos\/remove-file\/([^/]+)$/);
  if (videoRemoveFileMatch && req.method === 'DELETE') {
    return send(res, 200, { data: { success: true } });
  }

  if (req.method === 'GET' && url.pathname === '/admin/performer-assets/products/search') {
    return send(res, 200, { data: toPaged(stubState.products, url, 100) });
  }
  if (req.method === 'POST' && url.pathname === '/admin/performer-assets/products') {
    return readBody(req, () => {
      const item = {
        _id: makeId('product'),
        performerId: stubState.performers[0]?._id || null,
        performer: performerSummary(stubState.performers[0]),
        name: 'Uploaded Product',
        description: '',
        type: 'physical',
        stock: 1,
        price: 1,
        status: 'active',
        image: '/product.png',
        updatedAt: now(),
        createdAt: now()
      };
      stubState.products.push(item);
      return send(res, 200, { data: item });
    });
  }
  const productViewMatch = url.pathname.match(/^\/admin\/performer-assets\/products\/([^/]+)\/view$/);
  if (productViewMatch && req.method === 'GET') {
    const item = findById(stubState.products, productViewMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  const productCrudMatch = url.pathname.match(/^\/admin\/performer-assets\/products\/([^/]+)$/);
  if (productCrudMatch && req.method === 'PUT') {
    return readBody(req, () => send(res, 200, { data: findById(stubState.products, productCrudMatch[1]) || null }));
  }
  if (productCrudMatch && req.method === 'DELETE') {
    deleteById(stubState.products, productCrudMatch[1]);
    return send(res, 200, { data: { success: true } });
  }

  if (req.method === 'GET' && url.pathname === '/reports') {
    return send(res, 200, { data: toPaged(stubState.reports, url, 100) });
  }

  if (req.method === 'GET' && url.pathname === '/orders/search') {
    return send(res, 200, { data: toPaged(stubState.orders, url, 100) });
  }
  const orderMatch = url.pathname.match(/^\/orders\/([^/]+)$/);
  if (orderMatch && req.method === 'GET') {
    const item = findById(stubState.orders, orderMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  const orderUpdateMatch = url.pathname.match(/^\/orders\/([^/]+)\/update$/);
  if (orderUpdateMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.orders, orderUpdateMatch[1], body);
      return send(res, 200, { data: updated || null });
    });
  }

  if (req.method === 'GET' && url.pathname === '/admin/earning/search') {
    return send(res, 200, { data: toPaged(stubState.earnings, url, 100) });
  }
  if (req.method === 'GET' && url.pathname === '/admin/earning/stats') {
    const totalGrossPrice = stubState.earnings.reduce((a, b) => a + (b.grossPrice || 0), 0);
    const totalNetPrice = stubState.earnings.reduce((a, b) => a + (b.netPrice || 0), 0);
    const totalSiteCommission = Number((totalGrossPrice - totalNetPrice).toFixed(2));
    return send(res, 200, { data: { totalGrossPrice, totalNetPrice, totalSiteCommission } });
  }
  if (req.method === 'POST' && url.pathname === '/admin/earning/update-status') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: { success: true, ...body } });
    });
  }
  const earningByIdMatch = url.pathname.match(/^\/admin\/earning\/([^/]+)$/);
  if (earningByIdMatch && req.method === 'GET') {
    const item = findById(stubState.earnings, earningByIdMatch[1]) || null;
    return send(res, 200, { data: item });
  }

  if (req.method === 'GET' && url.pathname === '/subscriptions/admin/search') {
    return send(res, 200, { data: toPaged(stubState.subscriptions, url, 100) });
  }
  if (req.method === 'POST' && url.pathname === '/subscriptions') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const user = findById(stubState.users, body.userId) || stubState.users[1];
      const performer = findById(stubState.performers, body.performerId) || stubState.performers[0];
      const item = {
        _id: makeId('subscription'),
        subscriptionId: `SUB-${Math.floor(Math.random() * 100000)}`,
        userId: user?._id || null,
        performerId: performer?._id || null,
        userInfo: user ? userSummary(user) : null,
        performerInfo: performer ? performerSummary(performer) : null,
        subscriptionType: body.subscriptionType || 'free',
        paymentGateway: 'system',
        status: body.status || 'active',
        expiredAt: body.expiredAt || '2027-12-31T00:00:00.000Z',
        nextRecurringDate: null,
        updatedAt: now(),
        createdAt: now()
      };
      stubState.subscriptions.push(item);
      return send(res, 200, { data: item });
    });
  }
  const subCrudMatch = url.pathname.match(/^\/subscriptions\/admin\/([^/]+)$/);
  if (subCrudMatch && req.method === 'PUT') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.subscriptions, subCrudMatch[1], body);
      return send(res, 200, { data: updated || null });
    });
  }
  if (subCrudMatch && req.method === 'DELETE') {
    deleteById(stubState.subscriptions, subCrudMatch[1]);
    return send(res, 200, { data: { success: true } });
  }
  const cancelSubMatch = url.pathname.match(/^\/payment\/([^/]+)\/cancel-subscription\/([^/]+)$/);
  if (cancelSubMatch && req.method === 'POST') {
    const updated = upsertById(stubState.subscriptions, cancelSubMatch[2], { status: 'deactivated' });
    return send(res, 200, { data: updated || { _id: cancelSubMatch[2], status: 'deactivated' } });
  }

  if (req.method === 'GET' && url.pathname === '/payment/transactions/admin/search') {
    return send(res, 200, { data: toPaged(stubState.paymentTransactions, url, 100) });
  }
  if (req.method === 'GET' && url.pathname === '/admin/wallet/charges/search') {
    return send(res, 200, { data: toPaged(stubState.walletCharges, url, 100) });
  }

  if (req.method === 'GET' && url.pathname === '/admin/payout-requests/search') {
    return send(res, 200, { data: toPaged(stubState.payoutRequests, url, 100) });
  }
  const payoutByIdMatch = url.pathname.match(/^\/admin\/payout-requests\/([^/]+)$/);
  if (payoutByIdMatch && req.method === 'GET') {
    const item = findById(stubState.payoutRequests, payoutByIdMatch[1]) || null;
    return send(res, 200, { data: item });
  }
  const payoutStatusMatch = url.pathname.match(/^\/admin\/payout-requests\/status\/([^/]+)$/);
  if (payoutStatusMatch && req.method === 'POST') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      const updated = upsertById(stubState.payoutRequests, payoutStatusMatch[1], body);
      return send(res, 200, { data: updated || null });
    });
  }
  if (req.method === 'POST' && url.pathname === '/admin/payout-requests/calculate') {
    return send(res, 200, {
      data: {
        totalEarnedTokens: 1200,
        previousPaidOutTokens: 300,
        remainingUnpaidTokens: 900
      }
    });
  }
  const payoutPayMatch = url.pathname.match(/^\/admin\/payout-requests\/payout\/([^/]+)$/);
  if (payoutPayMatch && req.method === 'POST') {
    const updated = upsertById(stubState.payoutRequests, payoutPayMatch[1], { status: 'done' });
    return send(res, 200, { data: updated || { _id: payoutPayMatch[1], status: 'done' } });
  }
  if (payoutByIdMatch && req.method === 'DELETE') {
    deleteById(stubState.payoutRequests, payoutByIdMatch[1]);
    return send(res, 200, { data: { success: true } });
  }

  if (req.method === 'PUT' && url.pathname === '/admin/auth/users/password') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: { success: true, ...body } });
    });
  }
  if (req.method === 'PUT' && url.pathname === '/auth/users/me/password') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: { success: true, ...body } });
    });
  }
  if (req.method === 'POST' && url.pathname === '/auth/users/forgot') {
    return parseJsonOrEmpty(req, (err, body) => {
      if (err) return send(res, 400, { message: 'Invalid JSON' });
      return send(res, 200, { data: { success: true, ...body } });
    });
  }

  if (url.pathname.startsWith('/admin/') || url.pathname.startsWith('/menus/')) {
    if (req.method === 'GET') return send(res, 200, { data: { data: [], total: 0 } });
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) return send(res, 200, { data: { success: true } });
  }

  send(res, 404, { message: 'Not Found', path: url.pathname, method: req.method });
}

module.exports = requestHandler;

if (require.main === module) {
  const server = http.createServer(requestHandler);
  // Do not pin to IPv4 only; localhost may resolve to IPv6 (::1) in SSR calls.
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Stub API listening on http://localhost:${PORT}`);
  });
}
