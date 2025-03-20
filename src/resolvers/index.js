import Resolver from '@forge/resolver';

const resolver = new Resolver();

resolver.define('getRequestUrlFromFitId', (fitId) => {
  // 1. Look fitid issue and request url for it
  // 2. Return request url
  console.log(req);
  return 'Hello, world!';
});

export const handler = resolver.getDefinitions();
