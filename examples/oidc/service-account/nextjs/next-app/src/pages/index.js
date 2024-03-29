import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import LoginBtn from '@/components/login-btn';
import { useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState(null);

  const handleLog = async () => {
    try {
      setMessage(null);
      const result = await fetch('/api/message')
        .then(res => res.json())
      setMessage(result.error ? 'Please login to view this content.' : result.content)
    } catch (e) {
      setMessage('Failed to send API request.')
    }
  }
  
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <LoginBtn />
        <button onClick={handleLog}>Log things</button>
        <p>{message || ''}</p>
      </main>
    </>
  )
}
