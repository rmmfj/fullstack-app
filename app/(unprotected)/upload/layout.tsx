'use server'

import React, { Suspense } from "react";

const UploadLayout = async ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<div>loading...</div>}>
    { children }
  </Suspense>;
}

export default UploadLayout;