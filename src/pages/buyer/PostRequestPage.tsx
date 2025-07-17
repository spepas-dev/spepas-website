// src/pages/buyer/PostRequestPage.tsx
import React from 'react';
import PostRequestForm from '../../components/buyer/PostRequestForm';

const PostRequestPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
      <section className="pt-10"></section>
      <PostRequestForm />
    </div>
  );
};

export default PostRequestPage;
