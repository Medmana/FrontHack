
import Blog from "@/components/Examen";

import ScrollUp from "@/components/Common/ScrollUp";

import Patients from "@/components/Patients";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI4CKD",
  description: "AI4CKD - AI for Chronic Kidney Disease",
  // other metadata
};

export default function Home() {
  return (
    <>
      <Patients />
    </>
  );
}
