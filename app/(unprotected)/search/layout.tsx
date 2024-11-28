'use server'

import React, { Suspense } from "react";

const SearchLayout = async ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<div>loading...</div>}>
    { children }
  </Suspense>;
}

export default SearchLayout;