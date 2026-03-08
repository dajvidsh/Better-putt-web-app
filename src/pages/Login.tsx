import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Target } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="size-full bg-white flex flex-col pb-10 pt-10">
      <div className="flex-1 flex flex-col justify-center px-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center size-16 border-2 border-black rounded-full mb-6">
            <Target className="size-8" />
          </div>
          <h1 className="text-3xl font-light mb-2">Better Putt</h1>
          <p className="text-gray-500">Přihlasit</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-black outline-none transition-colors bg-transparent"
              placeholder="vas@email.cz"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-600 mb-2">
              Heslo
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-black outline-none transition-colors bg-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 mt-8 flex items-center justify-center gap-2 active:opacity-70 transition-opacity"
          >
            Pokračovat
            <ArrowRight className="size-4" />
          </button>
        </form>

        <button className="mt-6 text-sm text-gray-500 text-center w-full">
          Zapomenuté heslo?
        </button>
      </div>

      <div className="px-8 pb-8 text-center">
        <p className="text-sm text-gray-400">
          Nemáte účet?{' '}
          <button onClick={() => navigate('/register')} className="text-black underline">Registrovat</button>
        </p>
      </div>
    </div>
  );
}