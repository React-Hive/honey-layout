const ENV = process.env.NODE_ENV || 'development';

export const __DEV__ = ENV !== 'production';

export const HONEY_LAYOUT_CSS_PROPERTY_PREFIX = '$';

if (__DEV__ && typeof window !== 'undefined' && !process.env.VITEST_WORKER_ID) {
  console.info(
    '[@react-hive/honey-layout]: You are running in development mode. ' +
      'This build is not optimized for production and may include extra checks or logs.',
  );
}
