export function createPageUrl(page, data) {
  switch (page) {
    case 'product':
      return `/product/${data.id}`;
    case 'marketplace':
      return '/marketplace';
    case 'upload':
      return '/upload';
    case 'assistant':
      return '/assistant';
    default:
      return '/';
  }
}
