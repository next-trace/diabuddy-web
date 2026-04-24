'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClientError } from '@/api-client';
import { Button, Input } from '@next-trace/diabuddy-design-system/react';
import { userApi } from '../../lib/api';
import { Icon } from '../components/icons';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      await userApi.login({ email, password });
      router.push('/dashboard');
    } catch (e) {
      if (e instanceof ApiClientError) {
        setError(e.payload?.details || e.message);
        return;
      }
      setError((e as Error).message);
    }
  }

  return (
    <section className="shell">
      <section className="card narrow">
        <p className="eyebrow eyebrowWithIcon"><Icon name="shield" /> SECURE ACCESS</p>
        <h1><Icon name="login" /> Sign In</h1>
        <p className="muted">Sign in with an existing DiaBuddy account.</p>
        <form onSubmit={submit} className="formGrid">
          <label>
            Email
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@diabuddy.local" />
          </label>
          <label>
            Password
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" />
          </label>
          {error ? <p className="errorText">{error}</p> : null}
          <Button className="linkButton" type="submit"><Icon name="login" /> Continue</Button>
        </form>
      </section>
    </section>
  );
}
