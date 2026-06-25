const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultFlags = [
  {
    key: 'ads_enabled',
    label: 'Ads Enabled',
    description: 'Master toggle for all advertisements in the app',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'banner_ads_enabled',
    label: 'Banner Ads',
    description: 'Master toggle for all banner ads',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'banner_bottom',
    label: 'Banner - Bottom Bar',
    description: 'Banner ad at the bottom of main screen',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'banner_home',
    label: 'Banner - Home Page',
    description: 'Banner ad on the home feed page',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'banner_detail',
    label: 'Banner - Detail Page',
    description: 'Banner ad on the prompt detail page',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'interstitial_ads_enabled',
    label: 'Interstitial Ads',
    description: 'Master toggle for all interstitial ads',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'interstitial_detail_open',
    label: 'Interstitial on Detail Open',
    description: 'Show interstitial ad when opening a prompt detail page',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'interstitial_on_copy',
    label: 'Interstitial on Copy',
    description: 'Show interstitial ad when user copies a prompt',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'interstitial_after_splash',
    label: 'Interstitial After Splash',
    description: 'Show interstitial ad after the splash screen',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'banner_ai_story_detail',
    label: 'Banner - AI Story Detail',
    description: 'Banner ad on the AI Story detail page',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'interstitial_ai_story_copy',
    label: 'Interstitial on AI Story Copy',
    description: 'Show interstitial ad when user copies from AI Story feed',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'interstitial_ai_story_detail_copy',
    label: 'Interstitial on AI Story Detail Copy',
    description: 'Show interstitial ad when user copies from AI Story detail page',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'native_ads_enabled',
    label: 'Native Ads',
    description: 'Show native inline ads',
    enabled: false,
    platform: 'android',
  },
  {
    key: 'privacy_consent_required',
    label: 'Privacy Consent Required',
    description: 'Require user to accept privacy policy before using the app',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'account_deletion_enabled',
    label: 'Account Deletion',
    description: 'Allow users to delete their accounts from the app',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'user_registration_enabled',
    label: 'User Registration',
    description: 'Allow new users to register in the app',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'prompt_creation_enabled',
    label: 'Prompt Creation',
    description: 'Allow users to create new prompts',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'dark_mode_enabled',
    label: 'Dark Mode',
    description: 'Allow users to switch to dark mode',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'maintenance_mode',
    label: 'Maintenance Mode',
    description: 'Show maintenance screen to users',
    enabled: false,
    platform: 'android',
  },
  {
    key: 'data_collection_consent',
    label: 'Data Collection Consent',
    description: 'Show data collection disclosure and obtain consent',
    enabled: true,
    platform: 'android',
  },
  {
    key: 'age_gate_enabled',
    label: 'Age Gate',
    description: 'Show age verification for restricted content',
    enabled: false,
    platform: 'android',
  },
  {
    key: 'content_moderation_enabled',
    label: 'Content Moderation',
    description: 'Filter inappropriate content',
    enabled: true,
    platform: 'android',
  },
];

async function seed() {
  console.log('Seeding feature flags...');
  for (const flag of defaultFlags) {
    const existing = await prisma.featureFlag.findUnique({ where: { key: flag.key } });
    if (!existing) {
      await prisma.featureFlag.create({ data: flag });
      console.log(`  Created: ${flag.key}`);
    } else {
      console.log(`  Skipped (exists): ${flag.key}`);
    }
  }

  // Seed AppConfig if not exists
  const existingConfig = await prisma.appConfig.findFirst();
  if (!existingConfig) {
    await prisma.appConfig.create({
      data: {
        privacyPolicy: 'https://your-privacy-policy-url.com',
        termsOfService: 'https://your-terms-of-service-url.com',
        contactEmail: 'support@prompthub.app',
        appVersion: '1.0.0',
        maintenanceMode: false,
      },
    });
    console.log('  Created: AppConfig');
  } else {
    console.log('  Skipped (exists): AppConfig');
  }

  console.log('Done!');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
