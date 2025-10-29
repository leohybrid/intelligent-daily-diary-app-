
import React from 'react';
import Card from './shared/Card';

const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
        <Card className="w-96">
            <h1 className="text-2xl font-bold text-center">Login</h1>
            <p className="mt-4 text-center text-gray-500">This is a placeholder for the login component.</p>
        </Card>
    </div>
  );
};

export default Login;
