import { useLoaderData, Link, Links, Outlet } from "remix";
import connectDb from "~/db/connectDb.server.js";
import React, { useRef, useState } from 'react';



export default function Index() {
  return (
    <div><Outlet /></div>
  )
  }

