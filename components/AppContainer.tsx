'use client';
import React from 'react';
import { useMediaQuery } from '@mantine/hooks';
import Header from './Header';
import { useState } from 'react';
import SideBar from './SideBar';
import { Transition } from '@mantine/core';

type Props = {
  usersList: {
    username: string;
    imageUrl: string;
    id: string;
  }[];
  children: React.ReactNode;
};

export const AppContainer = ({ usersList, children }: Props) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 928px)');

  return (
    <>
      <Transition
        mounted={!!(isSideBarOpen && isMobile)}
        transition="slide-right"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <div
            className="absolute w-full z-50  bg-gradient-to-r from-stokes-secondary to-stokes-secondary-lighter top-10 h-full rounded"
            style={styles}
          >
            <SideBar usersList={usersList} />
          </div>
        )}
      </Transition>
      <Header setIsSideBarOpen={setIsSideBarOpen} />
      <div className="flex size-full justify-center">
        <div className="grid grid-cols-5 grid-flow-col mx-4 border-stokes-secondary bg-gradient-to-r from-stokes-secondary/95 to-stokes-primary border-4 rounded-lg w-full">
          {!isMobile && <SideBar usersList={usersList} />}
          {children}
        </div>
      </div>
    </>
  );
};
