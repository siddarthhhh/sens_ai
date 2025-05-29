import React from 'react';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";

const OnboardingPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded) {
    // Redirect users who already onboarded to dashboard/main page
    redirect('/');
  }

  return  <main>
      <OnboardingForm industries={industries} />
    </main>
};

export default OnboardingPage;
