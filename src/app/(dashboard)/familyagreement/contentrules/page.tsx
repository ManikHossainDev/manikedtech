import { Suspense } from 'react';
import ContentRulesContent from './ClientComponent';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContentRulesContent />
    </Suspense>
  );
}