import type { NextPage, GetServerSideProps } from 'next';
import { getProviders, signIn } from 'next-auth/react';
import { ClientSafeProvider, LiteralUnion } from 'next-auth/react/types';
import { BuiltInProviderType } from 'next-auth/providers';

interface LoginProps {
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
}

const Login: NextPage<LoginProps> = ({ providers }) => {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img src="https://i.imgur.com/fPuEa9V.png" alt="" className="w-48 mb-7" />

      {Object.values(providers).map((provider) => (
        <div key={provider.id}>
          <button
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: '/',
              })
            }
            className="bg-[#1fdf64] hover:bg-white text-white hover:text-black py-5 px-7 rounded-full">
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default Login;
