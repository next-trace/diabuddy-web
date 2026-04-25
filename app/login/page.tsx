'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClientError } from '@/api-client';
import { Button, Input, PageHeader, Card, CardBody, BrandLockup } from '@next-trace/nexdoz-design-system/react';
import { userApi } from '../../lib/api';
import { Icon } from '../components/icons';
import { mapErrorToFriendly } from '../../lib/error-map';

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
      router.push('/');
    } catch (e) {
      if (e instanceof ApiClientError) {
        setError(mapErrorToFriendly(e.payload?.details || e.message));
        return;
      }
      setError(mapErrorToFriendly(e));
    }
  }

  return (
    <section className="shell" data-theme="dbui-light" style={{ display: 'grid', placeItems: 'center', minHeight: '90dvh' }}>
      <Card density="comfortable" style={{ maxWidth: 440, width: '100%' }}>
        <CardBody>
          <div style={{ marginBottom: '1.25rem' }}>
            <BrandLockup variant="auto" tagline="Diabetes Companion" />
          </div>
          <PageHeader
            icon={<Icon name="shield" />}
            eyebrow={<><Icon name="shield" /> Secure Access</>}
            title="Sign In"
            subtitle="Sign in with an existing Nexdoz account."
          />
          <form onSubmit={submit} className="formGrid">
            <label>
              Email
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@nexdoz.local" />
            </label>
            <label>
              Password
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" />
            </label>
            {error ? <p style={{ color: 'var(--dbui-danger)' }}>{error}</p> : null}
            <Button variant="primary" size="md" type="submit" fullWidth><Icon name="login" /> Continue</Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
