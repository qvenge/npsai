'use client';

import { createContext, useState, useContext } from 'react';
import { usePathname } from 'next/navigation';


export interface Page {
  id: string;
  title: string;
};

const initialState = {id: '', title: ''};

const PageContext = createContext<Page>(initialState);

export interface PageContextProps {
  children: React.ReactNode;
  pages: Page[];
}

export function PageContextProvider({ children, pages }: PageContextProps) {
  const pathname = usePathname();

  return (
    <PageContext.Provider value={pages.find(page => pathname.includes(page.id)) || initialState}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}