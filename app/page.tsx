import { redirect } from 'next/navigation';

export default function Home() {
  // This will redirect to login by default
  redirect('/repos');
}