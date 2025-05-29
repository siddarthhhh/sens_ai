import React from 'react';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';

const IndustryInsightPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    // Redirect users who have NOT onboarded to onboarding page
    redirect('/onboarding');
  }

  return <div>IndustryInsightPage - Welcome onboarded user!</div>;
};

export default IndustryInsightPage;
