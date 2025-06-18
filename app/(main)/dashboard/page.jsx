export const dynamic = 'force-dynamic';


import React from 'react';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import { getIndustryInsights } from '@/actions/dashboard';
import DashboardView from "./_component/dashboard-view";

const IndustryInsightPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  const insights=await getIndustryInsights();

  if (!isOnboarded) {
    // Redirect users who have NOT onboarded to onboarding page
    redirect('/onboarding');
  }

  return <div className='container mx-auto'>
    <DashboardView insights={insights} />
    </div>;
};

export default IndustryInsightPage;
