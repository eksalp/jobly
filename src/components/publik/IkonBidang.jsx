import React from "react";
import {
  BarChart3, Code2, Megaphone, Handshake, Wrench, Calculator, Palette, Users, ClipboardList,
  Headset, Truck, HeartPulse, GraduationCap, Rocket, Scale, Sprout, } from "lucide-react";
import { IkonKerja as Briefcase } from "../IkonKerja";

const PETA = { BarChart3, Code2, Megaphone, Handshake, Wrench, Calculator, Palette, Users, ClipboardList, Headset, Truck, HeartPulse, GraduationCap, Rocket, Scale, Sprout };

export function IkonBidang({ nama, size = 18 }) {
  const Ikon = PETA[nama] || Briefcase;
  return <Ikon size={size} />;
}
