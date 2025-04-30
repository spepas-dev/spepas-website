// src/pages/buyer/PostRequestPage.tsx
// import React from 'react';
import PostRequestForm from '@/components/buyer/PostRequestForm';

export default function PostRequestPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl w-[80%] mx-auto p-4 pt-20">
      <section className="pt-10"></section>
      <h1 className="text-2xl font-bold mb-4">Post a Request</h1>
      <PostRequestForm />
    </div>
  );
}
