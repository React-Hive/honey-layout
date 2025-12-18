const ENV = process.env.NODE_ENV || 'development';

export const __DEV__ = ENV !== 'production';

if (__DEV__ && typeof window !== 'undefined' && !process.env.JEST_WORKER_ID) {
  console.info(
    '[@react-hive/honey-layout]: You are running in development mode. ' +
      'This build is not optimized for production and may include extra checks or logs.',
  );
}
