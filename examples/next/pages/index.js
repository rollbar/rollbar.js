import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { Provider, ErrorBoundary, useRollbar } from "@rollbar/react";
import Rollbar from "rollbar";

// Rollbar configuration
const rollbarConfig = {
  accessToken: 'YOUR_CLIENT_ACCESS_TOKEN', // Replace with your actual token
  environment: 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        source_map_enabled: true,
        code_version: '1.0.0',
      }
    },
    person: {
      id: 'user123',
      email: 'user@example.com',
      username: 'testuser',
    }
  }
};

// Create Rollbar instance
const rollbar = new Rollbar(rollbarConfig);

// Component that might throw an error
function ErrorProneComponent({ shouldError }) {
  if (shouldError) {
    throw new Error('React component error for Rollbar testing');
  }
  return <p className={styles.successMessage}>Component rendered successfully!</p>;
}

export default function App() {
  return (
    <Provider instance={rollbar}>
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    </Provider>
  );
}

function Home() {
  const rollbar = useRollbar();
  const [showError, setShowError] = useState(false);

  // Function to trigger a manually reported error
  const triggerManualError = () => {
    try {
      throw new Error('Manually triggered error for Rollbar testing');
    } catch (error) {
      rollbar.error('Manual error caught and reported', error);
      alert('Error reported to Rollbar!');
    }
  };

  // Function to trigger an uncaught error
  const triggerUncaughtError = () => {
    const nullObject = null;
    nullObject.nonExistentMethod();
  };

  // Function to trigger a promise rejection
  const triggerPromiseRejection = () => {
    new Promise((_, reject) => {
      reject(new Error('Promise rejection for Rollbar testing'));
    });
    alert('Promise rejection triggered!');
  };

  // Function to log custom messages
  const logCustomMessage = () => {
    rollbar.info('Custom info message from Next.js app');
    rollbar.log('User clicked the custom message button', {
      timestamp: new Date().toISOString(),
      action: 'button_click',
      page: 'home',
    });
    alert('Custom message logged to Rollbar!');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Rollbar Next.js Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Rollbar + <Link href="https://nextjs.org">Next.js</Link> Example
        </h1>

        <p className={styles.description}>
          Demonstrate error tracking with Rollbar in Next.js
        </p>

        <div className={styles.errorButtons}>
          <h2>Error Testing</h2>
          <div className={styles.buttonGrid}>
            <button onClick={triggerManualError} className={styles.errorButton}>
              Trigger Manual Error
            </button>
            <button onClick={triggerUncaughtError} className={`${styles.errorButton} ${styles.danger}`}>
              Trigger Uncaught Error
            </button>
            <button onClick={triggerPromiseRejection} className={styles.errorButton}>
              Trigger Promise Rejection
            </button>
            <button onClick={() => setShowError(!showError)} className={styles.errorButton}>
              Toggle Component Error
            </button>
            <button onClick={logCustomMessage} className={`${styles.errorButton} ${styles.info}`}>
              Log Custom Message
            </button>
          </div>
        </div>

        <div className={styles.status}>
          <ErrorProneComponent shouldError={showError} />
        </div>

        <div className={styles.instructions}>
          <h3>Setup Instructions:</h3>
          <ol>
            <li>Replace 'YOUR_CLIENT_ACCESS_TOKEN' with your Rollbar project token</li>
            <li>Run <code>npm install</code> to install dependencies</li>
            <li>Run <code>npm run dev</code> to start the development server</li>
            <li>Click the buttons to trigger different types of errors</li>
            <li>Check your Rollbar dashboard to see the reported errors</li>
          </ol>
        </div>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
