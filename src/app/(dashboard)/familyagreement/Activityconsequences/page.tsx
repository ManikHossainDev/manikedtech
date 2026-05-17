import { Suspense } from 'react';
import ActivityConsequencesContent from './ClientComponent';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActivityConsequencesContent />
    </Suspense>
  );
}