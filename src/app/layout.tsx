import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import clsx from 'clsx';

const inter = Inter({
  variable: '--family-Inter',
  subsets: ['cyrillic', 'latin'],
});

export const metadata: Metadata = {
  title: 'NPSai',
  description: 'NPSai админ панель',
};

// const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={clsx(inter.className, inter.variable)}>
        {/* <QueryClientProvider client={queryClient}> */}
          {children}
        {/* </QueryClientProvider> */}
      </body>
    </html>
  );
}
