import { useEffect } from 'react';

interface DocumentMeta {
  title: string;
  description?: string;
}

// Open Graph теги используют атрибут property, обычные meta — name.
function setMetaTag(key: string, content: string, attr: 'name' | 'property' = 'name') {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

// SPA без SSR — <title>/description меняются на клиенте при монтировании
// страницы. Каждый вызов перетирает предыдущий (следующая страница задаст
// свои значения при монтировании), явного восстановления при размонтировании
// не требуется.
export function useDocumentMeta({ title, description }: DocumentMeta) {
  useEffect(() => {
    document.title = title;
    if (description) {
      setMetaTag('description', description);
      setMetaTag('og:description', description, 'property');
    }
    setMetaTag('og:title', title, 'property');
  }, [title, description]);
}
