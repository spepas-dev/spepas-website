// src/components/profiling/RegistrationSelection.tsx
import React from 'react';
import { useAuth } from '@/features/auth';
import { useNavigate } from 'react-router-dom';

const RegistrationSelection: React.FC = () => {
  const { authData } = useAuth();
  const user = authData?.user;
  const navigate = useNavigate();

  // disable if user.gopa, user.mepa, etc. exist
  const options = [
    { label: 'GOPA Profile',    path: '/gopa-registration',    disabled: !!user?.gopa },
    { label: 'Seller Profile',  path: '/seller-registration', disabled: !!user?.sellerDetails },
    { label: 'MEPA Profile',    path: '/mepa-registration',   disabled: !!user?.mepa },
    { label: 'Rider Profile',   path: '/rider-registration',  disabled: !!user?.deliver },
  ];

  return (
    <>
    <section className="pt-10"></section>
    <section className="py-20 bg-white p-4 max-w-4xl w-[80%] mx-auto p-4 pt-20">
      
    <h2 className="text-xl mb-6">Choose Registration Type</h2>
      <ul className="grid grid-cols-2 gap-4">
        {options.map(opt => (
          <li key={opt.path}>
            <button
              onClick={() => !opt.disabled && navigate(opt.path)}
              disabled={opt.disabled}
              className={`w-full p-4 rounded shadow ${opt.disabled ? 'bg-gray-300 text-gray-600 opacity-50 cursor-not-allowed' : 'hover:bg-blue hover:text-white'}`}
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>

      <button
  type="button"
  onClick={() => navigate('/')}
  className="mt-6 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200"
>
  Skip
</button>


      
    </section>
      

    </>
  );
};

export default RegistrationSelection;
