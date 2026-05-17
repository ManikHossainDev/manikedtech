import { Suspense } from 'react';
import SafetyCommunicationContent from './ClientComponent';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SafetyCommunicationContent />
    </Suspense>
  );
}